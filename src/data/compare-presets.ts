import { companySummaries } from "@/generated/company-summaries";

/**
 * Comparison preset benchmarks. Defined as data (not inline in the client) so a
 * test can guarantee every preset slug resolves to a real company — if a
 * company is renamed or removed, the preset is caught before it ships broken.
 */
export interface ComparePreset {
  name: string;
  slugs: string[];
}

export const PRESETS: ComparePreset[] = [
  { name: "Stripe vs Adyen (Payments Enterprise)", slugs: ["stripe", "adyen"] },
  { name: "Wise vs Revolut (Cross-Border & FX)", slugs: ["wise", "revolut"] },
  { name: "Chime vs Nubank (Consumer Neobanks)", slugs: ["chime", "nubank"] },
  { name: "Stripe vs PayPal vs Square (Merchant Stack)", slugs: ["stripe", "paypal", "square"] },
  { name: "Razorpay vs Stripe (Payments India)", slugs: ["razorpay", "stripe"] },
  { name: "Razorpay vs Cashfree (Indian Gateways)", slugs: ["razorpay", "cashfree"] },
  { name: "Wise vs Payoneer (Freelancer Payouts)", slugs: ["wise", "payoneer"] },
];

/** True when every slug in every preset resolves to a known company. */
export function presetsAreValid(): boolean {
  const known = new Set(companySummaries.map((c) => c.slug));
  return PRESETS.every((p) => p.slugs.every((slug) => known.has(slug)));
}
