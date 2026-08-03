/**
 * SEO article catalog (Phase 2 of the monetization plan).
 *
 * Data-driven long-tail editorial content — money-adjacent comparisons that
 * rank for commercial-intent searches and route readers to company profiles,
 * tools, and (once enrolled) affiliate CTAs. Each article is fully static
 * (SSG) and lives at `/articles/<slug>`.
 *
 * FEES ARE ILLUSTRATIVE: they reflect published standard rates as of the
 * catalog vintage and are NOT live quotes. Always verify with the provider.
 */

import type { PartnerCtaPlacement } from "@/lib/partners";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface ArticleCta {
  slug: string;
  label: string;
  placement: PartnerCtaPlacement;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  /** ISO date YYYY-MM-DD. */
  publishedAt: string;
  updatedAt: string;
  category: string;
  /** Company profile slugs linked from the article (internal linking layer). */
  relatedCompanySlugs: string[];
  /** Commercial CTAs placed in the article's call-to-action band. */
  ctas: ArticleCta[];
  body: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: "stripe-vs-adyen-fees",
    title: "Stripe vs Adyen: fees & platform differences for online businesses",
    description:
      "A plain-language comparison of Stripe and Adyen — published fee structures, strengths, and who each best fits, with an illustrative monthly-fee estimate you can run yourself.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Payments",
    relatedCompanySlugs: ["stripe", "adyen", "paypal", "square"],
    ctas: [
      { slug: "stripe", label: "Visit Stripe", placement: "compare-vs" },
      { slug: "adyen", label: "Visit Adyen", placement: "compare-vs" },
    ],
    body: [
      {
        type: "p",
        text: "Stripe and Adyen are two of the most popular payment platforms for online businesses, but they sell in very different ways. Stripe is a self-serve platform with transparent, published rates and a famous developer API. Adyen is a single, unified processing platform largely sold through enterprise sales, with custom contracts rather than a public price list. This guide compares the two so you can decide which direction fits your stage and team.",
      },
      {
        type: "h2",
        text: "Fee structure at a glance",
      },
      {
        type: "table",
        headers: ["Factor", "Stripe", "Adyen"],
        rows: [
          ["Pricing model", "Published flat rate", "Custom contract (illustrative)"],
          [
            "Standard online rate (illustrative)",
            "2.9% + $0.30",
            "~1.95% blended estimate (varies by contract)",
          ],
          ["Developer experience", "Best-in-class API & docs", "Strong, enterprise-focused"],
          ["Self-serve signup", "Yes", "Sales-led, custom onboarding"],
          ["Best fit", "Startups, SaaS, platforms", "Large merchants, high volume"],
        ],
      },
      {
        type: "p",
        text: "Because Adyen negotiates per merchant, its headline number can be lower at scale — but it comes with implementation and contracting overhead. Stripe’s number is the same for everyone and is predictable to budget around.",
      },
      {
        type: "h2",
        text: "Key differences to weigh",
      },
      {
        type: "ul",
        items: [
          "Transparency: Stripe publishes its schedule; Adyen’s is custom, so compare with an actual quote.",
          "Speed to launch: Stripe can be integrated in a day; an Adyen rollout often involves sales, legal, and onboarding.",
          "Global reach: both support dozens of currencies and payment methods.",
          "Support model: Stripe is product-led; Adyen offers more hands-on, relationship-managed support for enterprise.",
        ],
      },
      {
        type: "h2",
        text: "Estimate your own monthly cost",
      },
      {
        type: "p",
        text: "Fees depend heavily on your transaction volume, average order value, and international mix. Use our free Payment Gateway Fee Calculator to run Stripe, Adyen (illustrative), PayPal, and Square side by side for your own numbers.",
      },
      {
        type: "p",
        text: "Editorial note: figures above are illustrative published-rate assumptions from the catalog vintage, not quotes. Actual pricing varies by region, payment method, volume, and contract — verify current terms before deciding.",
      },
    ],
  },
  {
    slug: "wise-vs-revolut-international-transfers",
    title: "Wise vs Revolut: which is better for international money transfers?",
    description:
      "A practical comparison of Wise and Revolut for sending and spending across borders — FX markups, fees, multi-currency accounts, and who each best fits.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "revolut", "moneygram", "payoneer"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "revolut", label: "Open Revolut", placement: "compare-vs" },
    ],
    body: [
      {
        type: "p",
        text: "Wise and Revolut both help you move money across borders, but they were built for slightly different jobs. Wise is purpose-built for transparent international transfers at the real mid-market exchange rate. Revolut is a financial superapp that bundles multi-currency accounts, cards, trading, and budgeting — with FX as one feature among many. This guide helps you pick based on what you actually need.",
      },
      { type: "h2", text: "FX pricing at a glance" },
      {
        type: "table",
        headers: ["Factor", "Wise", "Revolut"],
        rows: [
          ["Exchange rate", "Real mid-market rate (no markup)", "Interbank rate up to a monthly free limit, then a markup"],
          ["Fee model", "Upfront fee per transfer (typically 0.5-2%)", "Free tier up to ~$10K/mo FX, then 1%"],
          ["Markup transparency", "Shown before you send", "Spreads can widen on weekends/crypto"],
          ["Best for", "Pure transfers you want cheap and transparent", "All-in-one banking + frequent travel"],
        ],
      },
      { type: "h2", text: "Where Wise wins" },
      {
        type: "ul",
        items: [
          "Always the real mid-market rate — the headline you see is the rate you get.",
          "Upfront fee shown before you confirm, so there is no hidden spread.",
          "Multi-currency account with local bank details in 10 currencies.",
          "Transfers to many destinations complete same-day.",
        ],
      },
      { type: "h2", text: "Where Revolut wins" },
      {
        type: "ul",
        items: [
          "A full banking superapp: cards, budgeting, stock and crypto trading in one place.",
          "Free tier covers basic banking and pooled FX up to a monthly limit.",
          "Real-time spend tracking and category budgets.",
          "Junior accounts and premium tiers with travel perks.",
        ],
      },
      { type: "h2", text: "The trade-off" },
      {
        type: "p",
        text: "If your main goal is sending a specific amount abroad as cheaply and transparently as possible, Wise's no-markup rate is hard to beat. If you want a single app that handles everyday spending, travel, and the occasional transfer, Revolut's bundled value can win — especially within its free FX limit.",
      },
      {
        type: "p",
        text: "Run your own numbers: our free Cross-Border FX Estimator compares Wise, Revolut, PayPal, and a bank wire baseline for a given send amount and currency, showing the upfront fee, FX markup, and estimated recipient payout side by side.",
      },
      {
        type: "p",
        text: "Editorial note: fees and FX limits above are illustrative from the catalog vintage, not live quotes. FX programs change by region, account tier, and amount — verify the current quote before sending.",
      },
    ],
  },
  {
    slug: "stripe-vs-paypal-online-payments",
    title: "Stripe vs PayPal: online payment processing for your store",
    description:
      "Comparing Stripe and PayPal for online checkout — published rates, developer experience, buyer trust, and which merchants each fits best.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Payments",
    relatedCompanySlugs: ["stripe", "paypal", "square", "adyen"],
    ctas: [
      { slug: "stripe", label: "Visit Stripe", placement: "compare-vs" },
      { slug: "paypal", label: "Visit PayPal", placement: "compare-vs" },
    ],
    body: [
      {
        type: "p",
        text: "Stripe and PayPal are the two names most online stores consider first. Stripe is a developer-first platform you embed into your own checkout. PayPal is a consumer wallet and hosted checkout that buyers recognize and trust. Many stores end up using both — but understanding the trade-offs helps you decide where to start and where to invest.",
      },
      { type: "h2", text: "Published rates at a glance" },
      {
        type: "table",
        headers: ["Factor", "Stripe", "PayPal"],
        rows: [
          ["Standard online rate (illustrative)", "2.9% + $0.30", "3.49% + $0.49"],
          ["International surcharge", "+2.5%", "+1.5% cross-border"],
          ["Developer experience", "Best-in-class API & docs", "Drop-in buttons & hosted checkout"],
          ["Buyer familiarity", "Developers love it", "Consumers trust the brand"],
        ],
      },
      { type: "h2", text: "Choose Stripe when" },
      {
        type: "ul",
        items: [
          "You want full control over the checkout experience and branding.",
          "You have a developer (or are one) and value great API documentation.",
          "You need subscriptions, billing, or marketplace payouts (Stripe Connect).",
          "You process enough volume to benefit from custom interchange-plus pricing.",
        ],
      },
      { type: "h2", text: "Choose PayPal when" },
      {
        type: "ul",
        items: [
          "Buyer trust and conversion matter more than a custom checkout.",
          "Your customers already use PayPal and expect the button.",
          "You want a fast, low-code way to accept payments.",
          "You sell internationally and want built-in buyer protection messaging.",
        ],
      },
      {
        type: "p",
        text: "The cost difference compounds: PayPal's published rate is meaningfully higher per transaction, which matters at volume. Run your exact monthly volume, order size, and international mix through our free Fee Calculator to see the dollar gap for your business.",
      },
      {
        type: "p",
        text: "Editorial note: rates above are illustrative published assumptions from the catalog vintage, not quotes. Both offer volume discounts and enterprise pricing — verify current terms before deciding.",
      },
    ],
  },
  {
    slug: "affirm-vs-klarna-bnpl",
    title: "Affirm vs Klarna: buy now, pay later compared",
    description:
      "A side-by-side of two leading BNPL providers — fee models, late-fee policies, merchant costs, and which shoppers and stores each fits.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "BNPL",
    relatedCompanySlugs: ["affirm", "klarna", "afterpay"],
    ctas: [
      { slug: "affirm", label: "Visit Affirm", placement: "compare-vs" },
      { slug: "klarna", label: "Visit Klarna", placement: "compare-vs" },
    ],
    body: [
      {
        type: "p",
        text: "Buy now, pay later (BNPL) lets shoppers split a purchase into installments. Affirm and Klarna are two of the largest providers, but they take meaningfully different approaches to fees, terms, and transparency. This guide compares them so shoppers and merchants can choose.",
      },
      { type: "h2", text: "Fee model at a glance" },
      {
        type: "table",
        headers: ["Factor", "Affirm", "Klarna"],
        rows: [
          ["Consumer interest", "0-36% APR (shown upfront)", "0% on Pay in 4 / Pay in 30"],
          ["Late fees", "None", "Up to ~$15 after a grace period (varies by region)"],
          ["Installment options", "Pay in 4, or 3-36 month loans", "Pay in 4, Pay in 30, or store installments"],
          ["Merchant fee", "~2-6% per transaction", "~3-6% per transaction"],
        ],
      },
      { type: "h2", text: "Affirm's edge: transparency" },
      {
        type: "ul",
        items: [
          "Shows the total cost of the loan upfront — no deferred interest or surprises.",
          "No late fees and no prepayment penalties.",
          "Longer-term monthly installment loans (up to 36 months) for bigger purchases.",
          "A debit card (Debit+) that lets you pay over time at any Visa-accepting shop.",
        ],
      },
      { type: "h2", text: "Klarna's edge: flexibility and shopping" },
      {
        type: "ul",
        items: [
          "Interest-free Pay in 4 and Pay in 30 options for short-term splitting.",
          "A shopping app with price-drop alerts and cashback across partner stores.",
          "Strong retailer network, especially in Europe and expanding in the US.",
          "Multiple payment choices at checkout for shopper flexibility.",
        ],
      },
      {
        type: "p",
        text: "For shoppers who want zero interest and a short split, Klarna's Pay in 4 is simple. For larger purchases spread over months with total-cost transparency and no late fees, Affirm's model is often the safer choice. The catch: BNPL can encourage overspending — only commit to installments you can repay.",
      },
      {
        type: "p",
        text: "Editorial note: APRs, fees, and merchant costs are illustrative from the catalog vintage. BNPL terms vary by merchant, region, and borrower credit — verify current terms at checkout.",
      },
    ],
  },
  {
    slug: "best-neobanks-2026",
    title: "Best neobanks compared: Chime, Monzo, N26, and SoFi",
    description:
      "A roundup of four leading digital banks — what they're best at, their fee models, and who each is built for, so you can pick the right mobile bank.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Neobanks",
    relatedCompanySlugs: ["chime", "monzo", "n26", "sofi", "revolut"],
    ctas: [
      { slug: "chime", label: "Open Chime", placement: "compare-vs" },
      { slug: "sofi", label: "Open SoFi", placement: "compare-vs" },
    ],
    body: [
      {
        type: "p",
        text: "Neobanks are app-first banks that skip branches in favor of lower fees and a better mobile experience. The right one depends on where you live and what you value — fee-free overdraft, travel-friendly multi-currency, a clean eurozone account, or an all-in-one financial product. Here's how four of the biggest compare.",
      },
      { type: "h2", text: "Quick comparison" },
      {
        type: "table",
        headers: ["Neobank", "Region", "Best for", "Standout feature"],
        rows: [
          ["Chime", "US", "Fee-free everyday banking", "SpotMe overdraft up to $200, no fees"],
          ["Monzo", "UK", "Real-time spending insight", "Instant notifications, fee-free abroad spending"],
          ["N26", "Eurozone", "Simple euro account", "Clean UX, SEPA instant, savings Spaces"],
          ["SoFi", "US", "All-in-one finance", "Lending + investing + banking in one"],
        ],
      },
      { type: "h2", text: "Chime — for US fee-free banking" },
      {
        type: "p",
        text: "Chime is the largest US neobank, focused on removing the fees that hit lower-to-moderate-income consumers hardest: no monthly fee, no overdraft fee (via SpotMe), and early access to direct deposit. It's a strong pick for simple, no-frills US checking if you don't need branches or joint accounts.",
      },
      { type: "h2", text: "Monzo — for UK spenders who want insight" },
      {
        type: "p",
        text: "Monzo is a full UK-licensed challenger bank famous for instant transaction notifications, bill-splitting, saving pots, and fee-free spending abroad. It's ideal for UK residents who want a beautifully transparent view of their money.",
      },
      { type: "h2", text: "N26 — for a clean eurozone account" },
      {
        type: "p",
        text: "N26 offers a German-IBAN euro account with a famously clean interface, SEPA instant transfers, and sub-account 'Spaces' for budgeting. It suits European users who want simplicity, though its premium tiers add limited value for many.",
      },
      { type: "h2", text: "SoFi — for borrowing + banking together" },
      {
        type: "p",
        text: "SoFi stands out by combining banking, lending (student-loan refi, personal loans, mortgages), and investing in one platform. If you want a single relationship that covers cash, credit, and investments — and you qualify — it's a compelling US option.",
      },
      {
        type: "p",
        text: "Editorial note: features, fees, and availability above are illustrative from the catalog vintage and vary by region and account tier. Confirm current terms and eligibility before opening an account.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
