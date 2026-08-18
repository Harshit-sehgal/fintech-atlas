/**
 * Single source of truth for interactive tool metadata.
 *
 * Every surface that names a tool — the /tools index, the India hub, and the
 * footer — derives its links and copy from this list, so tool metadata is
 * defined once. `indiaFeatured` flags the tools surfaced on the /india hub.
 */

export interface Tool {
  id: string;
  href: string;
  name: string;
  shortName: string;
  icon: string;
  badge: string;
  description: string;
  features: string[];
  /** CSS variable name for the per-tool accent (see globals.css). */
  accentVar: string;
  /** Whether the tool is surfaced on the India hub. */
  indiaFeatured: boolean;
}

export const tools: Tool[] = [
  {
    id: "calculators",
    href: "/tools/calculators",
    name: "Personal Finance Calculators",
    shortName: "Personal Finance Calculators",
    icon: "🧮",
    badge: "Calculator Suite",
    description:
      "Project SIP and SWP growth, estimate EMIs, inflation, retirement corpus, FIRE number, emergency fund, and net worth.",
    features: ["SIP, SWP & CAGR", "EMI & loan costs", "Retirement & FIRE planning", "Net worth & emergency fund"],
    accentVar: "var(--tool-acc-calculators)",
    indiaFeatured: false,
  },
  {
    id: "calculator",
    href: "/tools/calculator",
    name: "Payment Gateway Fee Estimator",
    shortName: "Fee Estimator",
    icon: "💳",
    badge: "Interactive Calculator",
    description:
      "Compare total monthly processing fees across Stripe, PayPal, Square, and Adyen based on your transaction volume, average order size, and international mix.",
    features: ["Real-time fee calculation", "Effective rate comparison", "Volume discount thresholds", "Detailed cost breakdowns"],
    accentVar: "var(--tool-acc-calculator)",
    indiaFeatured: true,
  },
  {
    id: "razorpay-fee-calculator",
    href: "/tools/razorpay-fee-calculator",
    name: "Razorpay Fee Calculator (India)",
    shortName: "Razorpay Fee Calculator",
    icon: "🇮🇳",
    badge: "India Calculator",
    description:
      "Estimate Razorpay's real cost for Indian businesses: 2% on all domestic instruments, 18% GST on top, international up to 3% — with a reverse-charge formula for target payouts.",
    features: ["2% domestic + 18% GST (2.36% all-in)", "International up to 3%", "Reverse-charge estimate", "Compare with Stripe & Cashfree"],
    accentVar: "var(--tool-acc-razorpay-fee-calculator)",
    indiaFeatured: true,
  },
  {
    id: "remittance",
    href: "/tools/remittance",
    name: "Cross-Border FX & Transfer Estimator",
    shortName: "Cross-Border FX Tool",
    icon: "🌍",
    badge: "FX Tool",
    description:
      "Estimate recipient payouts for USD transfers to common currencies using simplified Wise, Revolut, PayPal, or hypothetical bank-wire scenarios.",
    features: ["Reference FX comparison", "Markup visibility", "Transfer speed comparison", "Recipient net payout estimate"],
    accentVar: "var(--tool-acc-remittance)",
    indiaFeatured: true,
  },
  {
    id: "exchange-rate-markup-calculator",
    href: "/tools/exchange-rate-markup-calculator",
    name: "Exchange-Rate Markup Calculator",
    shortName: "Exchange-Rate Markup Calculator",
    icon: "💱",
    badge: "FX Tool",
    description:
      "Measure the hidden FX spread on any international transfer: enter the mid-market rate and your provider's rate to see the markup percentage and the rupee cost — for receiving INR (USD → INR) and sending INR (INR → USD).",
    features: ["Markup vs mid-market", "USD → INR and INR → USD", "Rupee cost of the spread", "Works with any provider's quote"],
    accentVar: "var(--tool-acc-exchange-rate-markup-calculator)",
    indiaFeatured: true,
  },
  {
    id: "matchmaker",
    href: "/tools/matchmaker",
    name: "FinTech Matchmaker Quiz",
    shortName: "Matchmaker Quiz",
    icon: "🎯",
    badge: "Interactive Quiz",
    description:
      "Answer a few questions about your business, scale, or personal finance needs to get an initial shortlist of FinTech platforms.",
    features: ["4-step recommendation flow", "SaaS, E-commerce, Freelance, & Personal tracks", "Pros & cons breakdown", "Direct profile links"],
    accentVar: "var(--tool-acc-matchmaker)",
    indiaFeatured: false,
  },
];

/** Tools surfaced on the India hub. */
export const indiaFeaturedTools = tools.filter((t) => t.indiaFeatured);