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
    title: "Best way to receive USD in India (2026)",
    description:
      "The decision map for USD receipts: Wise USD details (~0.5% total), Payoneer's $0 receive + 1–4% corridor, PayPal's 4.4% + $0.30 + 3% conversion, bank wires, USDC and EEFC — routed by who pays, how much, and how often.",
    href: "/articles/best-way-to-receive-usd-in-india/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "PayPal vs Payoneer India (2026)",
    description:
      "PayPal India's receiving schedule (4.4% + $0.30, then a 3% conversion — roughly 7% of a $1,000 receipt) vs Payoneer's $0 receiving accounts and 1–4% exit corridor, with a $1,000 worked example.",
    href: "/articles/paypal-vs-payoneer-india/",
  },
  {
    date: "2026-08-04",
    kind: "fix",
    title: "Klarna valuation corrected to market capitalisation",
    description:
      "Klarna's profile showed the $6.8B private-round valuation after its NYSE listing; the quick-stat now shows the ~$7.5B market capitalisation (as of 3–4 August 2026) and is labelled as such, with a cited source.",
    href: "/companies/klarna/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Best payment method for Upwork India (2026)",
    description:
      "Upwork's two-stage payment decision: the 0–15% service fee locked per contract, then the India rails — Direct to Local Bank ($0.99, ~2–4% conversion markup), Payoneer's 1–4% corridor, and the Wise two-step via free ACH.",
    href: "/articles/best-payment-method-upwork-india/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Best payment method for Fiverr India (2026)",
    description:
      "Fiverr's 20% flat commission, 14-day (or 7-day) clearance, and the official payout table — PayPal free vs bank transfer via Payoneer ($1) vs the Payoneer account ($3) — with the USD-only conversion math for INR.",
    href: "/articles/best-payment-method-fiverr-india/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "How to get paid from Latin America in India",
    description:
      "Why PIX, Mercado Pago, and PicPay stop at their border — and the corridors (Wise BRL details, Payoneer via Workana-style platforms, PayPal, SWIFT) that actually land the money in an INR account, with ARS/BRL currency-risk and FIRC notes.",
    href: "/articles/receiving-payments-from-latin-america-in-india/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Plaid vs India's Account Aggregator",
    description:
      "Plaid's 12,000+ institution API model vs the RBI-regulated, consent-based AA framework — the comparison that decides which bank-data integration a fintech actually needs.",
    href: "/articles/plaid-vs-indias-account-aggregator/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "USDC vs bank wire: receiving USD in India",
    description:
      "Stablecoin rails compared against the site's bank-rail models — where USDC's 24×7 settlement and fee structure genuinely win, and the Section 115BBH/194S tax, FIRC, and FEMA caveats that keep it a complementary rail, not the default.",
    href: "/articles/stablecoins-for-cross-border-payments/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Cash App vs Venmo: US peer-to-peer payments",
    description:
      "The two dominant US P2P apps compared — business fees, cards, and speed — plus the honest India angle: neither supports INR, and cross-border workarounds end in frozen balances.",
    href: "/articles/cash-app-vs-venmo/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Gusto vs ADP vs Paychex for US payroll",
    description:
      "US payroll for global teams — contractor payments (the India-relevant part), W-2 tax filing, benefits, and PEO options across the three, with the pick driven by headcount and state count.",
    href: "/articles/gusto-vs-adp-vs-paychex-us-payroll/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Brex vs Relay: business banking for startups",
    description:
      "Corporate cards and rewards for VC-backed startups vs free business checking for bootstrapped SMBs — including when an Indian company does not need US business banking at all.",
    href: "/articles/brex-vs-relay-business-banking/",
  },

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
    kind: "article",
    title: "Best payment gateway for Shopify India",
    description:
      "Shopify Payments is not available to India-registered merchants, so every Indian store pairs Shopify with a third-party gateway — Razorpay, Cashfree, Paytm, PayPal, and Braintree compared for UPI-first checkout, international cards, and Apple Pay at checkout.",
    href: "/articles/best-payment-gateway-shopify-india/",
  },
  {
    date: "2026-08-04",
    kind: "article",
    title: "Payment gateway fees compared: India",
    description:
      "What Indian merchants actually pay — the 2% headline plus 18% GST (2.36% effective), international-card surcharges past 3.5%, and the settlement, refund, and contract costs the rate tables hide — across Razorpay, Cashfree, Stripe India, Paytm, and PhonePe.",
    href: "/articles/payment-gateway-fee-comparison-india/",
  },
  {
    date: "2026-08-04",
    kind: "site",
    title: "Company ownership audit",
    description:
      "Every company profile now shows a machine-checkable ownership classification (publicly listed, privately held, subsidiary, division, acquired). The audit corrected four stale statuses: Klarna is publicly listed (NYSE since Sep 2025), Afterpay operates inside Block, MoneyGram is private since its 2023 take-private, and Cash App is a Block product line.",
    href: "/companies/klarna/",
  },
  {
    date: "2026-08-04",
    kind: "fix",
    title: "Company profile quick-stat fix",
    description:
      "The ownership row renders with an accessible one-line hint, and a crash that dropped the section-header component during the ownership edit is fixed and covered by typecheck and tests.",
    href: "/companies/",
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
