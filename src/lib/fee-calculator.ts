/**
 * Pure payment-fee calculation logic, extracted from the calculator client
 * component so the math is unit-testable without rendering React.
 *
 * The component imports {@link computeProviderCosts} and spreads the returned
 * `cost` onto each provider config for display. Keep this function free of
 * React, framer-motion, and DOM access so it stays testable in isolation.
 */

import type { FeeCurrency, ProviderFeeConfig } from "@/data/fee-calculator-config";

export interface FeeInputs {
  /** Gross monthly processing volume in the selected currency. */
  monthlyRevenue: number;
  /** Average order value in the selected currency — drives transaction count. */
  avgOrderValue: number;
  /** International revenue as a percentage of monthly revenue (0–100). */
  intlPercent: number;
  /** In-person / POS revenue as a percentage of monthly revenue (0–100). */
  inPersonPercent: number;
  /** Which pricing schedule to cost: providers outside this currency are excluded. */
  currency: FeeCurrency;
}

export interface ProviderCost extends ProviderFeeConfig {
  /** Computed monthly fee in the selected currency. */
  cost: number;
}

/**
 * Transaction count derived from volume ÷ average order value.
 * Returns 0 when AOV is non-positive to avoid division-by-zero / Infinity.
 */
export function transactionCount(monthlyRevenue: number, avgOrderValue: number): number {
  return avgOrderValue > 0 ? Math.round(monthlyRevenue / avgOrderValue) : 0;
}

/**
 * Compute the monthly fee for a single provider given the business inputs.
 *
 * Two models are supported via the provider config:
 *
 * 1. **Blended** (`config.blended` present): a single percentage of gross
 *    volume plus a fixed per-transaction fee. The domestic / international /
 *    in-person split is ignored because blended pricing doesn't vary by channel.
 * 2. **Online + in-person breakdown** (default): domestic online, international
 *    online (domestic rate + surcharge), and in-person POS are costed
 *    separately and summed.
 */
export function computeProviderCost(config: ProviderFeeConfig, inputs: FeeInputs): number {
  if (config.currency !== inputs.currency) {
    throw new RangeError(
      `Cannot calculate a ${config.currency} provider with ${inputs.currency} inputs`,
    );
  }

  if (![inputs.monthlyRevenue, inputs.avgOrderValue, inputs.intlPercent, inputs.inPersonPercent].every(Number.isFinite)) {
    throw new TypeError("Fee inputs must be finite numbers");
  }

  const monthlyRevenue = Math.max(0, inputs.monthlyRevenue);
  const { avgOrderValue } = inputs;
  const intlPercent = Math.min(100, Math.max(0, inputs.intlPercent));
  const inPersonPercent = Math.min(100, Math.max(0, inputs.inPersonPercent));
  const txCount = transactionCount(monthlyRevenue, avgOrderValue);

  let base: number;
  if (config.blended) {
    const { pct, fixed } = config.blended;
    base = monthlyRevenue * pct + txCount * fixed;
  } else {
    const { online, inPerson = { pct: 0, fixed: 0 } } = config;

    const intlRevenue = (monthlyRevenue * intlPercent) / 100;
    const domRevenue = monthlyRevenue - intlRevenue;

    // Domestic online — share of domestic revenue that is NOT in-person, costed
    // at the domestic rate. Transaction count is similarly scaled by the
    // non-in-person share of domestic volume.
    const domOnlinePct = (domRevenue * (100 - inPersonPercent)) / 100;
    const domOnlineTx = (txCount * (100 - intlPercent) / 100) * ((100 - inPersonPercent) / 100);
    const domOnlineCost = domOnlinePct * online.domPct + domOnlineTx * online.domFixed;

    // International online — domestic percentage rate + international surcharge
    // *percentage*, and the full international FIXED fee per transaction.
    // NOTE: `online.intlFixed` is the TOTAL international per-transaction fixed
    // fee (e.g. $0.30 for Stripe) — it is NOT a surcharge added on top of
    // `domFixed`. Adding `domFixed` here would double-count the fixed fee.
    const intlOnlinePct = (intlRevenue * (100 - inPersonPercent)) / 100;
    const intlOnlineTx = (txCount * (intlPercent / 100) * ((100 - inPersonPercent) / 100));
    const intlOnlineCost =
      intlOnlinePct * (online.domPct + online.intlSurcharge) +
      intlOnlineTx * online.intlFixed;

    // In-person / POS — straightforward percentage + fixed on the in-person slice.
    const inPersonPct = (monthlyRevenue * inPersonPercent) / 100;
    const inPersonTx = txCount * (inPersonPercent / 100);
    const inPersonCost = inPersonPct * inPerson.pct + inPersonTx * inPerson.fixed;

    base = domOnlineCost + intlOnlineCost + inPersonCost;
  }

  // India GST is charged ON TOP of the platform fee (e.g. 18% of 2% → 2.36%
  // all-in). Providers without a published GST line (US schedules) are not
  // taxed here — their local sales tax treatment is out of scope.
  return config.gstPercent ? base * (1 + config.gstPercent / 100) : base;
}

/**
 * Compute costs for every provider in the selected currency and sort ascending
 * (cheapest first). Cross-currency rows are excluded — comparing an INR
 * schedule against a USD schedule without a live FX rate would be misleading.
 */
export function computeProviderCosts(
  configs: ProviderFeeConfig[],
  inputs: FeeInputs
): ProviderCost[] {
  return configs
    .filter((config) => config.currency === inputs.currency)
    .map((config) => ({ ...config, cost: computeProviderCost(config, inputs) }))
    .sort((a, b) => a.cost - b.cost);
}
