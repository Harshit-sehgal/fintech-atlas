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

/**
 * Scenario router (T105): the primary entry point on /compare. Each scenario
 * answers "what are you deciding?" with a starting pair and the comparison
 * rows that matter most for that decision (`emphasize` references row ids
 * from lib/compare-view COMPARE_ROWS — validated by test, see
 * compare-presets.test).
 */
export interface CompareScenario {
  id: string;
  question: string;
  description: string;
  slugs: string[];
  emphasize: string[];
}

export const SCENARIOS: CompareScenario[] = [
  {
    id: "freelancer-usd",
    question: "Freelancer invoicing USD clients",
    description:
      "You bill overseas clients in dollars and want the most of each invoice to reach an Indian bank account.",
    slugs: ["wise", "payoneer"],
    emphasize: ["pricing-model", "tradeoff"],
  },
  {
    id: "online-store",
    question: "Accepting payments for an online store",
    description:
      "You sell to Indian customers — UPI, cards and netbanking matter more than headline pricing.",
    slugs: ["razorpay", "cashfree"],
    emphasize: ["pricing-model", "customers"],
  },
  {
    id: "enterprise-rails",
    question: "Enterprise payment rails",
    description:
      "You run significant volume across markets and need platform depth, acquiring reach and negotiated rates.",
    slugs: ["stripe", "adyen"],
    emphasize: ["advantage", "pricing-model"],
  },
];

/** True when every scenario slug resolves and every emphasised row id exists. */
export function scenariosAreValid(rowIds: readonly string[]): boolean {
  const known = new Set(companySummaries.map((c) => c.slug));
  const rows = new Set(rowIds);
  return SCENARIOS.every(
    (s) =>
      s.slugs.every((slug) => known.has(slug)) &&
      s.emphasize.length > 0 &&
      s.emphasize.every((id) => rows.has(id)),
  );
}
