/**
 * Pure cross-border remittance / FX calculation logic, extracted from the
 * remittance client component so the math is unit-testable without React.
 */

import type { RemittanceProviderConfig, CurrencyOption } from "@/data/remittance-config";
import { MAX_RATE_AGE_DAYS, RATES_AS_OF } from "@/data/remittance-config";

export interface RemittanceInputs {
  /** Amount being sent in USD. */
  sendAmount: number;
  /** Target currency the recipient receives. */
  currency: CurrencyOption;
}

export interface ProviderPayout extends RemittanceProviderConfig {
  /** Upfront transfer fee in USD. */
  fee: number;
  /** Effective exchange rate (mid-market minus the provider's FX markup). */
  rate: number;
  /** Recipient receives this many units of the target currency. */
  netPayout: number;
}

/**
 * Mid-market rate from the selected currency.
 */
export function midMarketRate(currency: CurrencyOption): number {
  return currency.rate;
}

/**
 * Compute the upfront fee for a single provider given the send amount.
 *
 * Three fee models:
 * - `"pct"`: percentage of send amount.
 * - `"fixed"`: flat fee regardless of amount.
 * - `"pct_plus_fixed"`: percentage + flat fee.
 */
export function computeFee(config: RemittanceProviderConfig, sendAmount: number): number {
  switch (config.feeModel) {
    case "pct":
      return sendAmount * config.feePct;
    case "pct_plus_fixed":
      return sendAmount * config.feePct + config.feeFixed;
    case "fixed":
      return config.feeFixed;
    default:
      return 0;
  }
}

/**
 * Compute the effective exchange rate after the provider's FX markup.
 * A 0% markup yields the mid-market rate unchanged.
 */
export function computeEffectiveRate(config: RemittanceProviderConfig, midRate: number): number {
  if (config.fxMargin > 0) {
    return midRate * (1 - config.fxMargin / 100);
  }
  return midRate;
}

/**
 * Compute the full payout breakdown for a single provider.
 * The amount-after-fee is clamped to ≥ 0 so a fee exceeding the send amount
 * doesn't produce a negative payout.
 */
export function computeProviderPayout(
  config: RemittanceProviderConfig,
  inputs: RemittanceInputs
): ProviderPayout {
  const midRate = midMarketRate(inputs.currency);
  if (!Number.isFinite(inputs.sendAmount) || !Number.isFinite(midRate)) {
    throw new TypeError("Remittance inputs must be finite numbers");
  }
  const fee = computeFee(config, inputs.sendAmount);
  const rate = computeEffectiveRate(config, midRate);
  const amountAfterFee = Math.max(0, inputs.sendAmount - fee);
  const netPayout = amountAfterFee * rate;

  return { ...config, fee, rate, netPayout };
}

/**
 * Compute payouts for every provider, sorted by best (highest) payout first.
 * This is the entry point the remittance client calls.
 */
export function computeProviderPayouts(
  configs: RemittanceProviderConfig[],
  inputs: RemittanceInputs
): ProviderPayout[] {
  return configs
    .map((config) => computeProviderPayout(config, inputs))
    .sort((a, b) => b.netPayout - a.netPayout);
}

/**
 * True when the hardcoded exchange-rate snapshot is older than
 * {@link MAX_RATE_AGE_DAYS}. Lets the UI warn (and CI/build fail) rather than
 * presenting stale rates as if they were current.
 */
export function isRateSnapshotStale(now: number = Date.now()): boolean {
  const snapshot = Date.parse(RATES_AS_OF);
  if (Number.isNaN(snapshot)) return true;
  return now - snapshot > MAX_RATE_AGE_DAYS * 24 * 60 * 60 * 1000;
}

/** Human-readable label for the rate snapshot date. */
export function ratesAsOfLabel(): string {
  const d = new Date(RATES_AS_OF);
  return Number.isNaN(d.getTime())
    ? RATES_AS_OF
    : d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
