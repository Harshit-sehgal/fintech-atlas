/**
 * Pure payment-fee calculation logic, extracted from the calculator client
 * component so the math is unit-testable without rendering React.
 *
 * The component imports {@link computeProviderCosts} and spreads the returned
 * `cost` onto each provider config for display. Keep this function free of
 * React, framer-motion, and DOM access so it stays testable in isolation.
 */

import type { ProviderFeeConfig } from "@/data/fee-calculator-config";

export interface FeeInputs {
  /** Gross monthly processing volume in dollars. */
  monthlyRevenue: number;
  /** Average order value in dollars — drives transaction count. */
  avgOrderValue: number;
  /** International revenue as a percentage of monthly revenue (0–100). */
  intlPercent: number;
  /** In-person / POS revenue as a percentage of monthly revenue (0–100). */
  inPersonPercent: number;
}

export interface ProviderCost extends ProviderFeeConfig {
  /** Computed monthly fee in dollars. */
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
  const { monthlyRevenue, avgOrderValue, intlPercent, inPersonPercent } = inputs;
  const txCount = transactionCount(monthlyRevenue, avgOrderValue);

  if (config.blended) {
    const { pct, fixed } = config.blended;
    return monthlyRevenue * pct + txCount * fixed;
  }

  const { online, inPerson = { pct: 0, fixed: 0 } } = config;

  const intlRevenue = (monthlyRevenue * intlPercent) / 100;
  const domRevenue = monthlyRevenue - intlRevenue;

  // Domestic online — share of domestic revenue that is NOT in-person, costed
  // at the domestic rate. Transaction count is similarly scaled by the
  // non-in-person share of domestic volume.
  const domOnlinePct = (domRevenue * (100 - inPersonPercent)) / 100;
  const domOnlineTx = (txCount * (100 - intlPercent) / 100) * ((100 - inPersonPercent) / 100);
  const domOnlineCost = domOnlinePct * online.domPct + domOnlineTx * online.domFixed;

  // International online — domestic rate + international surcharge on both
  // the percentage and per-transaction fixed fees.
  const intlOnlinePct = (intlRevenue * (100 - inPersonPercent)) / 100;
  const intlOnlineTx = (txCount * (intlPercent / 100) * ((100 - inPersonPercent) / 100));
  const intlOnlineCost =
    intlOnlinePct * (online.domPct + online.intlSurcharge) +
    intlOnlineTx * (online.domFixed + online.intlFixed);

  // In-person / POS — straightforward percentage + fixed on the in-person slice.
  const inPersonPct = (monthlyRevenue * inPersonPercent) / 100;
  const inPersonTx = txCount * (inPersonPercent / 100);
  const inPersonCost = inPersonPct * inPerson.pct + inPersonTx * inPerson.fixed;

  return domOnlineCost + intlOnlineCost + inPersonCost;
}

/**
 * Compute costs for every provider and sort ascending (cheapest first).
 * This is the entry point the calculator client calls.
 */
export function computeProviderCosts(
  configs: ProviderFeeConfig[],
  inputs: FeeInputs
): ProviderCost[] {
  return configs
    .map((config) => ({ ...config, cost: computeProviderCost(config, inputs) }))
    .sort((a, b) => a.cost - b.cost);
}
