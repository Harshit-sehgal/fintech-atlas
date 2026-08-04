/**
 * Site changelog — the human-readable history behind the changelog page and
 * `changelog.xml` RSS feed. Every entry must be verifiable against a commit
 * in the repository; add an entry whenever user-visible content ships.
 *
 * Kinds: article | tool | fix | site
 */
export type ChangelogKind = "article" | "tool" | "fix" | "site";

export interface ChangelogEntry {
  /** YYYY-MM-DD publish date. */
  date: string;
  kind: ChangelogKind;
  title: string;
  description: string;
  /** Internal path (with trailing slash) or external URL. */
  href: string;
}

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-08-04",
    kind: "article",
    title: "Receiving $1,000 from a US client in India",
    description:
      "Completes the $500/$1,000/$5,000 trilogy at the point where flat fees and percentage fees balance out — marketplace rails (Upwork/Fiverr → Payoneer), and starting the FIRC and 44ADA documentation habit.",
    href: "/articles/receiving-1000-usd-from-us-client-in-india/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Razorpay vs Cashfree for ecommerce",
    description:
      "Checkout and plugin depth, EMI and pay-later coverage, COD reconciliation, and international ecommerce — the operational differences that decide the gateway for an Indian online store.",
    href: "/articles/razorpay-vs-cashfree-for-ecommerce/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Razorpay vs Stripe for developers",
    description:
      "API design, SDKs, webhooks, test tooling, PCI scope, and India-specific rails — which gateway an engineering team builds faster on.",
    href: "/articles/razorpay-vs-stripe-for-developers/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Receiving $5,000 from a US client in India",
    description:
      "At $5,000 the channel gap shrinks to ~3% — the real decisions become EEFC accounts, FIRC documentation, and advance payments.",
    href: "/articles/receiving-5000-usd-from-us-client-in-india/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Payment gateways for Indian subscriptions",
    description:
      "UPI AutoPay mandates as the deciding rail, card-on-file eMandates, eNACH, and the billing features that decide between Razorpay, Cashfree, and Stripe India.",
    href: "/articles/payment-gateway-for-subscription-businesses/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Quarterly India Cross-Border Payment Fee Index",
    description:
      "A $500/$1,000/$5,000 matrix across five channels, every cell computed from the same fee models and ₹83.50/USD snapshot as the FX estimator — with a drift test so published figures cannot silently diverge from the calculators.",
    href: "/articles/quarterly-india-cross-border-fee-index/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "FIRA vs FIRC: payment-method comparison",
    description:
      "The advice-versus-certificate difference, when each matters for GST claims and audit trails, and what each receiving channel actually issues.",
    href: "/articles/fira-vs-firc-payment-methods/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "International payment settlement times (India)",
    description:
      "An eight-rail timeline from UPI's instant 24×7 credits to 2–5-day SWIFT transfers, with merchant-hold and refund mechanics for gateways.",
    href: "/articles/international-payment-settlement-times/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Receiving $500 from a US client in India",
    description:
      "Worked ₹-landed numbers for the most common freelancer receipt — where the channel choice is worth more than 10% of the money.",
    href: "/articles/receiving-500-usd-from-us-client-in-india/",
  },
  {
    date: "2026-08-04",
    kind: "tool",
    title: "Exchange-rate markup calculator",
    description:
      "Input-only mid-vs-offered rate tool showing the markup and the INR/USD loss in both directions — exposes the hidden spread in any rate you are offered.",
    href: "/tools/exchange-rate-markup-calculator/",
  },
  {
    date: "2026-08-04",
    kind: "tool",
    title: "Services track: audits, sample report, and checklist",
    description:
      "Gateway selection audits and implementation services, a public sample selection report (fees computed at build time from the calculator's own config), and an interactive implementation checklist with progress persistence.",
    href: "/services/",
  },
  {
    date: "2026-08-04",
    kind: "fix",
    title: "Cross-site FX consistency sweep",
    description:
      "Every published USD→INR figure now derives from the same fee models and rate snapshot as the FX estimator. A drift test recomputes all article tables from the calculator configs and fails the build if they diverge.",
    href: "/tools/remittance/",
  },
  {
    date: "2026-08-04",
    kind: "site",
    title: "SEO title pass",
    description:
      "All 92 pages now ship titles under 65 characters — company profiles lead with 'fees, features & review', and no page double-appends the site name.",
    href: "/",
  },
  {
    date: "2026-08-04",
    kind: "fix",
    title: "Services contact popup-blocked fallback",
    description:
      "When the browser blocks the booking-form window, the form now falls back to a direct draft-link instead of silently failing.",
    href: "/services/",
  },
  {
    date: "2026-08-04",
    kind: "site",
    title: "Accessibility sweep",
    description:
      "The axe-core gate now covers the services pages and legal templates, marquee duplicate copy no longer doubles tab stops, error boundaries announce via role=alert, and CountUp announces only its final value.",
    href: "/",
  },
  {
    date: "2026-08-04",
    kind: "site",
    title: "Keyboard and dark-theme WCAG gates",
    description:
      "A global focus-visible rule, skip-link target, RSS autodiscovery, and a dual-theme axe pass — every route is audited in both light and dark themes.",
    href: "/",
  },
  {
    date: "2026-08-04",
    kind: "fix",
    title: "Non-finite input guards",
    description:
      "NaN and Infinity inputs are now rejected in the fee, remittance, and investment calculators instead of propagating into results.",
    href: "/tools/calculators/",
  },
  {
    date: "2026-08-04",
    kind: "site",
    title: "Correction reporting",
    description:
      "Every company profile and article now links a prefilled correction-report issue — the site's public channel for flagging outdated figures.",
    href: "https://github.com/Harshit-sehgal/fintech-atlas/issues/new/choose",
  },
  {
    date: "2026-08-04",
    kind: "site",
    title: "Breadcrumb consistency and structured-data hardening",
    description:
      "A shared breadcrumb component (visible nav plus BreadcrumbList JSON-LD) across articles, profiles, and tools; the build now validates required properties per JSON-LD type and verifies internal-link fragment targets.",
    href: "/tools/",
  },
];

export const changelogKinds: ChangelogKind[] = ["article", "tool", "fix", "site"];

export const changelogKindLabels: Record<ChangelogKind, string> = {
  article: "Article",
  tool: "Tool",
  fix: "Fix",
  site: "Site",
};
