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
  /** Named author (T015: required for Google trust signals on financial content). */
  author: string;
  /** ISO date YYYY-MM-DD. */
  publishedAt: string;
  updatedAt: string;
  category: string;
  /** Company profile slugs linked from the article (internal linking layer). */
  relatedCompanySlugs: string[];
  /** Commercial CTAs placed in the article's call-to-action band. */
  ctas: ArticleCta[];
  /** Related interactive tool (plan T049: every article links its calculator). */
  relatedTool?: { href: string; label: string };
  /** Curated cross-article links (plan T052: related guides on genuine relevance). */
  relatedArticleSlugs?: string[];
  body: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: "stripe-vs-adyen-fees",
    author: "FinTech Atlas editorial team",
    title: "Stripe vs Adyen: fees & platform differences",
    description:
      "A plain-language comparison of Stripe and Adyen — published fee structures, strengths, and who each best fits, with an illustrative monthly-fee estimate you can run yourself.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Payments",
    relatedCompanySlugs: ["stripe", "adyen", "paypal", "square"],
    relatedArticleSlugs: ["stripe-vs-paypal-online-payments", "square-vs-stripe-retail-and-online"],
    ctas: [
      { slug: "stripe", label: "Visit Stripe", placement: "compare-vs" },
      { slug: "adyen", label: "Visit Adyen", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/calculator", label: "Run the fee calculator" },
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
    author: "FinTech Atlas editorial team",
    title: "Wise vs Revolut: international transfers compared",
    description:
      "A practical comparison of Wise and Revolut for sending and spending across borders — FX markups, fees, multi-currency accounts, and who each best fits.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "revolut", "moneygram", "payoneer"],
    relatedArticleSlugs: ["how-to-send-money-abroad-cheap", "quarterly-india-cross-border-fee-index", "best-neobanks-2026"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "revolut", label: "Open Revolut", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/remittance", label: "Estimate transfer costs" },
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
    author: "FinTech Atlas editorial team",
    title: "Stripe vs PayPal: online payments compared",
    description:
      "Comparing Stripe and PayPal for online checkout — published rates, developer experience, buyer trust, and which merchants each fits best.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Payments",
    relatedCompanySlugs: ["stripe", "paypal", "square", "adyen"],
    relatedArticleSlugs: ["stripe-vs-adyen-fees", "razorpay-vs-stripe-payments-india", "square-vs-stripe-retail-and-online"],
    ctas: [
      { slug: "stripe", label: "Visit Stripe", placement: "compare-vs" },
      { slug: "paypal", label: "Visit PayPal", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/calculator", label: "Run the fee calculator" },
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
    author: "FinTech Atlas editorial team",
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
    author: "FinTech Atlas editorial team",
    title: "Best neobanks: Chime, Monzo, N26 & SoFi",
    description:
      "A roundup of four leading digital banks — what they're best at, their fee models, and who each is built for, so you can pick the right mobile bank.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-04",
    category: "Neobanks",
    relatedCompanySlugs: ["chime", "monzo", "n26", "sofi", "revolut", "starling", "nubank", "bunq"],
    relatedArticleSlugs: ["wise-vs-revolut-international-transfers", "brex-vs-relay-business-banking", "cash-app-vs-venmo", "plaid-vs-indias-account-aggregator"],
    ctas: [
      { slug: "chime", label: "Open Chime", placement: "compare-vs" },
      { slug: "sofi", label: "Open SoFi", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/remittance", label: "Compare transfer costs" },
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
        type: "h2",
        text: "Beyond the big four",
      },
      {
        type: "p",
        text: "The same app-first model has produced strong regional challengers beyond this roundup: Starling (UK, business-banking focused), Nubank (Brazil, now Latin America's largest digital bank), and Bunq (Europe, multi-currency and AI-driven budgeting) each follow the playbook with a local twist. Their profiles cover the full landscape.",
      },
      {
        type: "p",
        text: "If what you actually need is free person-to-person money movement rather than a bank account, the US money apps (Cash App, Venmo) cover that without any bank — the Cash App vs Venmo guide compares them.",
      },
      {
        type: "p",
        text: "And the account-linking layer underneath these apps is its own decision: Plaid vs India's Account Aggregator compares the US bank-data API model with the RBI's consent-based framework, which matters the moment a neobank's 'link your bank' button points at a bank outside the US.",
      },
      {
        type: "p",
        text: "Editorial note: features, fees, and availability above are illustrative from the catalog vintage and vary by region and account tier. Confirm current terms and eligibility before opening an account.",
      },
    ],
  },
  {
    slug: "coinbase-vs-robinhood-crypto-investing",
    author: "FinTech Atlas editorial team",
    title: "Coinbase vs Robinhood: buying crypto and stocks",
    description:
      "A practical comparison of Coinbase and Robinhood for retail investors — trading fees, crypto selection, regulation, and who each fits best.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-04",
    category: "Investing",
    relatedCompanySlugs: ["coinbase", "robinhood", "sofi", "binance", "okx"],
    ctas: [
      { slug: "coinbase", label: "Visit Coinbase", placement: "compare-vs" },
      { slug: "robinhood", label: "Visit Robinhood", placement: "compare-vs" },
    ],
    body: [
      {
        type: "p",
        text: "Coinbase and Robinhood both let retail investors buy crypto, but they come at it from opposite directions. Coinbase is a dedicated crypto exchange and regulated US custodian. Robinhood is a brokerage that added crypto alongside commission-free stocks and ETFs. Which one you pick depends on whether you want deep crypto functionality or an all-in-one investing app.",
      },
      { type: "h2", text: "Trading fees & model at a glance" },
      {
        type: "table",
        headers: ["Factor", "Coinbase", "Robinhood"],
        rows: [
          ["Crypto selection", "200+ assets", "Smaller, curated set"],
          ["Retail fee (illustrative)", "~1-3% (Advanced ~0.5% taker)", "Commission-free (spread applies)"],
          ["Regulation", "Top US-regulated custodian", "US brokerage (FINRA/SIPC)"],
          ["Broader investing", "Crypto focus", "Stocks, ETFs, options, crypto"],
        ],
      },
      { type: "h2", text: "Choose Coinbase when" },
      {
        type: "ul",
        items: [
          "You want the widest selection of crypto and an easy fiat on-ramp.",
          "A regulated, insured custodian matters to you for larger amounts.",
          "You use advanced trading features or self-custody wallets (Coinbase Wallet).",
          "You prefer a dedicated crypto product with institutional-grade security.",
        ],
      },
      { type: "h2", text: "Choose Robinhood when" },
      {
        type: "ul",
        items: [
          "You want stocks, ETFs, options, and crypto in one place.",
          "A simple, mobile-first interface matters more than crypto depth.",
          "You trade frequently and value commission-free stock/ETF trades.",
          "You're starting out and want a beginner-friendly on-ramp.",
        ],
      },
      {
        type: "p",
        text: "The honest trade-off: Coinbase tends to be more expensive for small, frequent retail crypto trades but offers far more depth and regulated custody; Robinhood is cheaper and simpler to start but has a narrower crypto selection and thinner self-custody story. Fees shown are illustrative snapshots — check live rates before trading.",
      },
      {
        type: "p",
        text: "If you are choosing a crypto venue rather than a broker, the global exchanges — Binance and OKX — offer the widest asset selection and the deepest trading tooling, at the cost of a thinner US regulatory story than Coinbase's. Their profiles cover the exchange landscape; the right pick depends on where you trade and what you value.",
      },
      {
        type: "p",
        text: "Editorial note: this is educational, not investment advice. Crypto is volatile and may not be suitable for all investors.",
      },
    ],
  },
  {
    slug: "best-payment-gateway-small-business",
    author: "FinTech Atlas editorial team",
    title: "Best payment gateway for a small business",
    description:
      "A small-business buyer's guide to the three most common US gateways — Square vs Stripe vs PayPal across setup, fees, in-person, and online needs.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Payments",
    relatedCompanySlugs: ["square", "stripe", "paypal", "adyen"],
    relatedArticleSlugs: ["razorpay-vs-stripe-payments-india", "razorpay-vs-cashfree-indian-gateways", "brex-vs-relay-business-banking", "best-payment-gateway-shopify-india", "payment-gateway-fee-comparison-india"],
    ctas: [
      { slug: "square", label: "Visit Square", placement: "compare-vs" },
      { slug: "stripe", label: "Visit Stripe", placement: "compare-vs" },
      { slug: "paypal", label: "Visit PayPal", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/calculator", label: "Estimate gateway fees" },
    body: [
      {
        type: "p",
        text: "Most small businesses boil down to one of three payment gateways. Square is the plug-and-play choice for in-person and retail. Stripe is the developer favorite for online and platform-led businesses. PayPal is the trusted hosted checkout that converts hesitant buyers. Here's how to pick between them.",
      },
      { type: "h2", text: "The three at a glance" },
      {
        type: "table",
        headers: ["Factor", "Square", "Stripe", "PayPal"],
        rows: [
          ["Setup", "Very easy, pure POS", "API-first, dev-friendly", "Easy hosted checkout"],
          ["Standard online rate (illustrative)", "2.9% + $0.30", "2.9% + $0.30", "3.49% + $0.49"],
          ["In-person card rate", "2.6% + $0.10", "2.7% + $0.05", "2.29% + $0.09"],
          ["Best for", "Retail / in-person", "Online / platform / SaaS", "Consumer trust + checkout"],
        ],
      },
      { type: "h2", text: "When Square wins" },
      {
        type: "ul",
        items: [
          "You sell in person — card readers, POS terminals, and a free register app.",
          "You want fast setup with no contracts and transparent pricing.",
          "You run a coffee shop, salon, food truck, or retail store.",
        ],
      },
      { type: "h2", text: "When Stripe wins" },
      {
        type: "ul",
        items: [
          "You have (or are) a developer and want to own the checkout.",
          "You need subscriptions, billing, or marketplace payouts (Connect).",
          "You're a SaaS product or platform processing significant online volume.",
        ],
      },
      { type: "h2", text: "When PayPal wins" },
      {
        type: "ul",
        items: [
          "Buyer familiarity and conversion at checkout are your top priority.",
          "You want the PayPal button without custom integration work.",
          "You sell into markets where PayPal is the expected payment method.",
        ],
      },
      {
        type: "p",
        text: "There's no single 'best' — the right pick depends on whether your revenue is in-person or online and how much you want to customize. Many businesses run Square for the counter and Stripe (or PayPal) for the website. Run your own monthly revenue, order size, and international mix through our free Fee Calculator to compare the dollar cost for your exact numbers.",
      },
      {
        type: "p",
        text: "Editorial note: rates above are illustrative published assumptions from the catalog vintage, not quotes. Volume discounts and enterprise pricing vary — verify current terms before deciding.",
      },
    ],
  },
  {
    slug: "wise-vs-payoneer-business-payouts",
    author: "FinTech Atlas editorial team",
    title: "Wise vs Payoneer for freelancers & businesses",
    description:
      "A comparison of Wise and Payoneer for cross-border payments — receiving client money, holding balances, and paying out suppliers as a freelancer or small business.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "revolut", "paypal"],
    relatedArticleSlugs: ["payoneer-fees-india", "how-to-send-money-abroad-cheap", "best-payment-method-upwork-india", "paypal-vs-payoneer-india"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/exchange-rate-markup-calculator", label: "Measure the rate markup" },
    body: [
      {
        type: "p",
        text: "Freelancers and small businesses dealing with international clients often land on two names: Wise and Payoneer. Both move money across borders, but they serve slightly different workflows. The short version: Wise shines for transparent, low-cost transfers using the real mid-market rate; Payoneer is built around getting paid by platforms and marketplaces around the world.",
      },
      { type: "h2", text: "The two at a glance" },
      {
        type: "table",
        headers: ["Factor", "Wise", "Payoneer"],
        rows: [
          ["FX rate", "Real mid-market, no markup", "Fixed spread that can be higher"],
          ["Getting paid", "Local bank details (multi-currency)", "Marketplace/payment rails + receiving accounts"],
          ["Fee model", "Upfront fee per transfer", "Loading/conversion fees, some account fees"],
          ["Best for", "Cheap, transparent transfers", "Platforms/clients who pay via Payoneer"],
        ],
      },
      { type: "h2", text: "Choose Wise when" },
      {
        type: "ul",
        items: [
          "You want the real exchange rate and a transparent upfront fee.",
          "You hold balances and pay out suppliers in multiple currencies.",
          "You value local bank details for receiving in common currencies.",
        ],
      },
      { type: "h2", text: "Choose Payoneer when" },
      {
        type: "ul",
        items: [
          "Your clients or freelance marketplaces pay you through Payoneer.",
          "You need a single receiving account across many global platforms.",
          "You want a service purpose-built around marketplace payouts.",
        ],
      },
      {
        type: "p",
        text: "Many freelancers end up using both. The honest trade-off: Wise is usually the cheaper, more transparent choice for sending money once you have it; Payoneer's value is how it collects payments from platforms that route through it. Compare the exact fee on your own route before choosing.",
      },
      {
        type: "p",
        text: "Editorial note: fees and FX spreads are illustrative from the catalog vintage, not live quotes. Cross-border rates vary by route, currency, and account tier.",
      },
    ],
  },
  {
    slug: "how-to-send-money-abroad-cheap",
    author: "FinTech Atlas editorial team",
    title: "How to send money abroad cheaply",
    description:
      "An evergreen guide to avoiding hidden FX markups when sending money internationally — what mid-market rate means, what to compare, and which providers to run numbers on.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "revolut", "paypal", "moneygram"],
    relatedArticleSlugs: ["wise-vs-payoneer-business-payouts", "wise-vs-revolut-international-transfers", "receiving-500-usd-from-us-client-in-india", "stablecoins-for-cross-border-payments", "cash-app-vs-venmo"],
    ctas: [
      { slug: "wise", label: "Compare rates with Wise", placement: "compare-vs" },
      { slug: "revolut", label: "Compare rates with Revolut", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/exchange-rate-markup-calculator", label: "Measure a rate markup" },
    body: [
      {
        type: "p",
        text: "Banks often advertise low or zero 'transfer fees' but make their money on the exchange-rate markup — the difference between the rate you see and the real market rate. This guide explains how to see the true cost of an international transfer and compare providers fairly.",
      },
      { type: "h2", text: "Understand the real cost: rate markup + fee" },
      {
        type: "p",
        text: "The total cost of sending money abroad is two parts: the upfront fee and the exchange-rate markup. Some providers hide the markup by giving you a worse rate than the mid-market rate. The only way to compare fairly is to look at what the recipient actually receives for your exact amount.",
      },
      { type: "h2", text: "What to compare, in order" },
      {
        type: "ul",
        items: [
          "The exchange rate offered vs. the current mid-market rate (the markup).",
          "The upfront transfer fee, shown before you confirm.",
          "Any receiving-side fees the recipient might incur.",
          "Transfer speed — faster isn't always free.",
          "The final amount delivered to the recipient for your send amount.",
        ],
      },
      { type: "h2", text: "Which types of providers win" },
      {
        type: "ul",
        items: [
          "FX specialists (e.g. Wise) tend to use the real mid-market rate with a transparent upfront fee.",
          "Superapp neobanks (e.g. Revolut) offer free FX up to a monthly limit, then a markup.",
          "Traditional banks and card-based services often charge a percentage markup instead of/alongside a fee.",
          "Instant remittance services can be convenient but pricier per transfer.",
          "Stablecoin rails (USDC) are a newer corridor — 24×7 settlement and no bank hours, but with unsettled regulation and exchange-spread costs (see the USDC vs bank wire guide).",
          "US person-to-person apps (Cash App, Venmo) are not an international corridor at all — US-only accounts, no INR support, so they cannot receive a transfer sent from India (see the Cash App vs Venmo guide).",
        ],
      },
      {
        type: "table",
        headers: ["Provider type", "Typical cost (illustrative)", "The catch"],
        rows: [
          ["Bank wire", "~4.5% markup, $35-class fee", "Worst rate; correspondent fees at both ends"],
          ["FX specialist (Wise-class)", "~0.4–0.5% + small fee, mid-market rate", "Fast and transparent — the baseline to beat"],
          ["Superapp (Revolut-class)", "0.5%, or free within monthly limits", "Free tier caps; markup past the limit"],
          ["Card-based (PayPal-class)", "~$5 flat + ~3.5% spread", "Convenient; the spread is the cost"],
        ],
      },
      {
        type: "p",
        text: "Run your exact send amount and target currency through our free Cross-Border FX Estimator — it shows the upfront fee, FX markup, and estimated recipient payout for a bank wire, a specialist service, a superapp, and a card-based provider side by side.",
      },
      {
        type: "p",
        text: "Editorial note: rates change daily and vary by route, amount, funding method, and tier. This is educational guidance, not a live quote or financial advice.",
      },
    ],
  },
  {
    slug: "square-vs-stripe-retail-and-online",
    author: "FinTech Atlas editorial team",
    title: "Square vs Stripe: retail vs online platforms",
    description:
      "The honest Square vs Stripe comparison for businesses that sell in person, online, or both — setup, rates, hardware, and which one fits your store.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Payments",
    relatedCompanySlugs: ["square", "stripe", "paypal", "adyen"],
    relatedArticleSlugs: ["stripe-vs-adyen-fees", "stripe-vs-paypal-online-payments"],
    ctas: [
      { slug: "square", label: "Visit Square", placement: "compare-vs" },
      { slug: "stripe", label: "Visit Stripe", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/calculator", label: "Run the fee calculator" },
    body: [
      {
        type: "p",
        text: "Square and Stripe are both excellent payment platforms, but they were built for different storefronts. Square is the natural fit for in-person and retail. Stripe is the platform choice for online, subscription, and developer-led businesses. The honest answer is that 'which is better' depends entirely on where you sell.",
      },
      { type: "h2", text: "Rates & positioning at a glance" },
      {
        type: "table",
        headers: ["Factor", "Square", "Stripe"],
        rows: [
          ["In-person card rate (illustrative)", "2.6% + $0.10", "2.7% + $0.05"],
          ["Online card rate (illustrative)", "2.9% + $0.30", "2.9% + $0.30"],
          ["POS hardware", "Readers, terminals, free register app", "Terminals via partners"],
          ["Developer/platform", "Simple emailable payment links", "Best-in-class API (Connect, subscriptions)"],
          ["Best for", "Retail, cafés, salons, pop-ups", "SaaS, platforms, online stores"],
        ],
      },
      { type: "h2", text: "Pick Square for in-person and simplicity" },
      {
        type: "ul",
        items: [
          "You run a physical store, café, food truck, or salon.",
          "You want card readers and a free POS app up and running fast.",
          "You prefer transparent, no-contract, pay-as-you-go pricing.",
        ],
      },
      { type: "h2", text: "Pick Stripe for online and flexibility" },
      {
        type: "ul",
        items: [
          "You’re a SaaS, subscription, or platform business.",
          "You want full control of the checkout and a developer-friendly API.",
          "You need billing, invoicing, marketplace payouts, or custom payment flows.",
        ],
      },
      {
        type: "p",
        text: "If you sell both in person and online, many businesses run Square at the counter and Stripe on the website — it’s normal to mix them. Run your exact monthly volume, order size, and in-person split through our free Fee Calculator to compare the real dollar cost for your store.",
      },
      {
        type: "p",
        text: "Editorial note: rates above are illustrative published assumptions from the catalog vintage, not quotes; hardware and add-on pricing vary.",
      },
    ],
  },
  {
    slug: "razorpay-vs-stripe-payments-india",
    author: "FinTech Atlas editorial team",
    title: "Razorpay vs Stripe (India): fees & platforms",
    description:
      "Razorpay and Stripe India both charge a flat 2% on domestic payments plus 18% GST. A plain-language comparison of the two leading India gateways — fees, settlement, and who each best fits.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["razorpay", "stripe"],
    relatedArticleSlugs: ["razorpay-vs-cashfree-indian-gateways", "best-payment-gateway-small-business", "razorpay-vs-stripe-for-developers", "payment-gateway-for-subscription-businesses", "stripe-vs-paypal-online-payments", "payment-gateway-fee-comparison-india"],
    ctas: [
      { slug: "razorpay", label: "Visit Razorpay", placement: "compare-vs" },
      { slug: "stripe", label: "Visit Stripe", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/razorpay-fee-calculator", label: "Calculate Razorpay fees" },
    body: [
      {
        type: "p",
        text: "For an India-registered business, the gateway decision almost always comes down to Razorpay vs Stripe. Both are self-serve platforms with published, flat-rate pricing — and since Stripe entered the Indian market, their headline numbers have converged: 2% on domestic payments, no fixed per-transaction fee. The differences are in the details: which payment methods each supports natively, settlement timelines, and developer experience. This guide compares them for the Indian market specifically.",
      },
      {
        type: "h2",
        text: "Fee structure at a glance",
      },
      {
        type: "table",
        headers: ["Factor", "Razorpay", "Stripe (India)"],
        rows: [
          [
            "Pricing model",
            "Published flat rate",
            "Published flat rate (Standard)",
          ],
          [
            "Domestic online rate",
            "2% on all domestic instruments (cards, UPI, netbanking, wallets)",
            "2% on India-issued cards",
          ],
          [
            "International cards",
            "Up to 3%",
            "3% on cards issued outside India",
          ],
          [
            "Fixed per-transaction fee",
            "None",
            "None",
          ],
          [
            "GST",
            "18% added on top of the platform fee",
            "18% added on top of the platform fee",
          ],
          [
            "Setup / AMC / refund fees",
            "₹0",
            "None",
          ],
          ["Best fit", "Indian startups & D2C with UPI-heavy checkouts", "Platforms, SaaS & global-first businesses"],
        ],
      },
      {
        type: "p",
        text: "Both rates are quoted exclusive of GST: an 18% GST on the platform fee takes the all-in domestic cost to 2.36%. Neither charges a fixed per-transaction fee on the standard plan, which keeps small-ticket UPI and card payments economical. Razorpay’s flat 2% also covers UPI and netbanking, while Stripe India prices cards specifically — so a UPI-heavy checkout can end up cheaper on Razorpay in practice.",
      },
      {
        type: "h2",
        text: "Key differences to weigh",
      },
      {
        type: "ul",
        items: [
          "Settlement: Razorpay offers T+1 with instant settlement options; Stripe India standard payouts follow a similar T+1 cadence, so compare the fine print for your bank.",
          "Payment methods: Razorpay was built for India — UPI, netbanking, and wallets are first-class; Stripe India focuses on card rails and international reach.",
          "Global infrastructure: Stripe shines when you also sell internationally, with local acquiring and multi-currency payout rails.",
          "Developer experience: both have strong APIs; Stripe’s docs are famously deep, while Razorpay’s local docs and support are tuned to Indian compliance.",
          "Enterprise features: Stripe Billing, Connect, and marketplace payouts are mature; Razorpay’s Route and payment links cover most Indian use cases out of the box.",
        ],
      },
      {
        type: "h2",
        text: "Run your own numbers",
      },
      {
        type: "p",
        text: "Your monthly fee depends on volume, average order value, and international mix — and GST changes the picture at every volume level. Use our free Payment Gateway Fee Calculator and switch to the INR — India providers view to compare Razorpay and Stripe (India) on your own numbers.",
      },
      {
        type: "p",
        text: "Editorial note: rates above are published India schedules from the catalog vintage (Razorpay pricing page and Stripe India pricing), not quotes — verify current terms before deciding.",
      },
    ],
  },
  {
    slug: "razorpay-vs-cashfree-indian-gateways",
    author: "FinTech Atlas editorial team",
    title: "Razorpay vs Cashfree (India): gateway comparison",
    description:
      "Both Indian gateways charge a flat 2% on domestic payments plus 18% GST — the differences are international rates, settlement, and product depth. A plain-language comparison for Indian merchants.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["razorpay", "cashfree"],
    relatedArticleSlugs: ["razorpay-vs-stripe-payments-india", "best-payment-gateway-small-business", "razorpay-vs-cashfree-for-ecommerce", "payment-gateway-fee-comparison-india"],
    ctas: [
      { slug: "razorpay", label: "Visit Razorpay", placement: "compare-vs" },
      { slug: "cashfree", label: "Visit Cashfree", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/razorpay-fee-calculator", label: "Calculate gateway fees" },
    body: [
      {
        type: "p",
        text: "For an India-registered business, Razorpay and Cashfree are the two most common domestic gateway choices. Both publish flat-rate pricing and both charge 2% on domestic online payments — identical headline numbers that make the decision about everything else: international card rates, settlement speed, payment-method coverage, and what the platform offers beyond processing. This guide compares them for the Indian market specifically.",
      },
      {
        type: "h2",
        text: "Fee structure at a glance",
      },
      {
        type: "table",
        headers: ["Factor", "Razorpay", "Cashfree"],
        rows: [
          [
            "Pricing model",
            "Published flat rate",
            "Published flat rate",
          ],
          [
            "Domestic online rate",
            "2% on all domestic instruments (cards, UPI, netbanking, wallets)",
            "2% on domestic payments (cards, UPI, net banking, EMI, pay-later)",
          ],
          [
            "International cards",
            "Up to 3%",
            "From 2.95% (2.99% for Visa/Mastercard)",
          ],
          [
            "Fixed per-transaction fee",
            "None",
            "None",
          ],
          [
            "GST",
            "18% added on top of the platform fee",
            "18% added on top of the platform fee",
          ],
          [
            "Setup / AMC",
            "₹0",
            "₹0 — no setup or annual maintenance charges",
          ],
          [
            "Best fit",
            "Startups & D2C wanting a full-stack suite (banking, lending)",
            "Platforms & fintechs needing payouts, verification & settlement APIs",
          ],
        ],
      },
      {
        type: "p",
        text: "Both rates are quoted exclusive of GST: 18% on the platform fee takes the all-in domestic cost to 2.36%. Cashfree's published schedule is 2% with zero setup costs, plus a time-limited 1.95% intro rate for new merchants; Razorpay's flat 2% covers UPI, netbanking, and wallets as well as cards. Internationally, Cashfree starts at 2.95% (2.99% for Visa/Mastercard) while Razorpay charges up to 3% — a hair's breadth apart, so international mix rarely decides the choice on rate alone.",
      },
      {
        type: "h2",
        text: "Key differences to weigh",
      },
      {
        type: "ul",
        items: [
          "Settlement: both default to T+1; Cashfree sells instant-settlement products aimed at marketplaces, while Razorpay couples settlement with its Route and payout tooling.",
          "Payment methods: both cover UPI, cards, netbanking, EMI, and pay-later; Cashfree markets 180+ modes including RuPay UPI on credit cards.",
          "Beyond processing: Razorpay adds business banking (RazorpayX) and lending (Razorpay Capital); Cashfree adds bulk payouts, instant settlements, and a KYC/verification suite.",
          "International: Cashfree collects in 140+ currencies with local acquiring partnerships; Razorpay prices international cards at up to 3% on top of its domestic 2%.",
          "Developer experience: both are API-first — Cashfree is a common embedded-payments pick for fintech platforms, while Razorpay's docs and plugins target direct merchants.",
        ],
      },
      {
        type: "h2",
        text: "Run your own numbers",
      },
      {
        type: "p",
        text: "Your effective rate depends on volume, average order value, and international mix — and GST changes the picture at every volume level. Use our free Payment Gateway Fee Calculator, switch to the INR — India providers view, and compare Razorpay and Cashfree Payments on your own numbers.",
      },
      {
        type: "p",
        text: "Editorial note: rates above are published India schedules from the catalog vintage (Cashfree's pricing page and Razorpay's pricing page), not quotes — verify current terms before deciding.",
      },
    ],
  },
  {
    slug: "payoneer-fees-india",
    author: "FinTech Atlas editorial team",
    title: "Payoneer fees in India (2026): receiving USD",
    description:
      "Payoneer's published India pricing — free local receiving accounts, a 1–4% USD-to-INR withdrawal corridor, card-funded requests at 2.90% + $0.49, and the $29.95 annual fee — explained with a worked example.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["payoneer", "wise"],
    relatedArticleSlugs: ["wise-vs-payoneer-business-payouts", "receiving-1000-usd-from-us-client-in-india", "quarterly-india-cross-border-fee-index", "best-payment-method-upwork-india", "best-payment-method-fiverr-india", "best-way-to-receive-usd-in-india", "paypal-vs-payoneer-india"],
    ctas: [
      { slug: "payoneer", label: "See Payoneer pricing", placement: "compare-vs" },
      { slug: "wise", label: "Compare with Wise", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/exchange-rate-markup-calculator", label: "Measure the 1–4% withdrawal markup" },
    body: [
      {
        type: "p",
        text: "Payoneer's India pricing is layered: receiving money is often free or cheap, the exit to INR costs 1–4% of the amount, and marketplace payouts add fees of their own on top. For a typical Indian freelancer receiving $1,000 and withdrawing to a bank account, the total Payoneer-side cost lands between roughly 1% and 5% depending on how the client paid and which corridor applies. This guide breaks down the published schedule so you can price the decision before you open an account.",
      },
      {
        type: "h2",
        text: "Payoneer fees at a glance (India)",
      },
      {
        type: "table",
        headers: ["Fee item", "Published rate", "Notes"],
        rows: [
          [
            "Receive from another Payoneer customer",
            "Free",
            "Balance-to-balance transfers",
          ],
          [
            "Receive via local-currency receiving account",
            "Free",
            "USD, EUR, GBP and other receiving accounts",
          ],
          [
            "Receive via non-local receiving account",
            "Fixed fee or 1%",
            "Depending on the amount received",
          ],
          [
            "Client pays by credit card (payment request)",
            "2.90% + $0.49",
            "Card-funded payment requests",
          ],
          [
            "Client pays by US ACH bank debit",
            "1%",
            "US-only bank debit",
          ],
          [
            "Marketplace payouts (Upwork, Fiverr, etc.)",
            "Set by each marketplace",
            "Payoneer itself does not set these fees",
          ],
          [
            "Withdraw USD balance to an INR bank account",
            "1–4% of amount",
            "Automatic withdrawal to the linked Indian bank within 48 hours",
          ],
          [
            "Annual account fee",
            "$29.95",
            "Only if under $6,000 received in any 12 consecutive months",
          ],
        ],
      },
      {
        type: "p",
        text: "The headline numbers from Payoneer's India pricing page (updated June 2026): receiving accounts in your local currency are free, payment requests cost 2.90% + $0.49 when funded by credit card, and converting a USD balance into INR costs 1–4% of the transaction amount. That last figure is the one most comparison tables miss — it is a percentage of the full amount, so it dominates every other cost once you actually take the money out.",
      },
      {
        type: "h2",
        text: "What a real payment costs: a worked example",
      },
      {
        type: "p",
        text: "Illustrative math at a mid-market snapshot of ₹95.40/USD (the FX estimator's 2026-08-12 rate): a $1,000 marketplace payout arrives with no Payoneer receiving fee. Withdrawing to INR at the published 1–4% corridor, at 1% you keep $990 — about ₹94,446 — and at 4% you keep $960 — about ₹91,584. If the client paid by credit card instead, the 2.90% + $0.49 request fee (≈ $29.49) applies first, and the withdrawal corridor then applies to what is left. The exact corridor rate is shown inside your account before you confirm the withdrawal.",
      },
      {
        type: "h2",
        text: "The India-specific detail: automatic INR conversion",
      },
      {
        type: "p",
        text: "Payoneer's India pricing page states that payments received by customers based in India are automatically withdrawn to the linked Indian bank account within 48 hours. Indian users also do not get the Payoneer prepaid card. Cross-border payouts to Indian freelancers operate under the RBI's Payment Aggregator – Cross Border (PA-CB) framework, which replaced the older OPGSP regime — per January 2026 industry sources; treat this as context, not legal or tax advice.",
      },
      {
        type: "h2",
        text: "How to reduce your Payoneer costs",
      },
      {
        type: "ul",
        items: [
          "Receive through a local-currency receiving account where the client can pay by domestic transfer — the receiving fee is $0.",
          "Prefer marketplace payouts over card-funded payment requests; card requests add 2.90% + $0.49 before the exit fee.",
          "Batch withdrawals — the exit cost is a percentage of the amount, so fewer, larger withdrawals beat many small ones where minimums apply.",
          "Keep at least $6,000 of receipts in any 12-month window to avoid the $29.95 annual account fee.",
          "Check the exact corridor fee in the Fees section of your account before confirming a withdrawal — the 1–4% range is corridor-dependent.",
        ],
      },
      {
        type: "h2",
        text: "Methodology & limitations",
      },
      {
        type: "p",
        text: "Figures above are Payoneer's published India pricing (payoneer.com/en-in/about/pricing/, updated 18 June 2026) and global pricing page (updated 1 January 2026). Marketplace payout fees are set by each marketplace and vary. The worked example assumes an illustrative ₹95.40/USD mid-market snapshot (the FX estimator's 2026-08-12 rate); actual exchange rates move continuously. The fee shown in your Payoneer account before you confirm a transaction is authoritative.",
      },
      {
        type: "p",
        text: "Editorial note: rates are published schedules from the catalog vintage, not live quotes — verify current terms in your Payoneer account before confirming any transaction.",
      },
    ],
  },
  {
    slug: "receiving-500-usd-from-us-client-in-india",
    author: "FinTech Atlas editorial team",
    title: "Receiving $500 from a US client in India",
    description:
      "What actually lands in your INR account when a US client sends $500 — Wise, Payoneer, PayPal, and bank wire compared with a worked rupee example, plus FIRC and tax notes.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    relatedArticleSlugs: ["receiving-1000-usd-from-us-client-in-india", "receiving-5000-usd-from-us-client-in-india", "fira-vs-firc-payment-methods", "quarterly-india-cross-border-fee-index", "how-to-send-money-abroad-cheap", "international-payment-settlement-times", "gusto-vs-adp-vs-paychex-us-payroll", "cash-app-vs-venmo", "receiving-payments-from-latin-america-in-india", "best-way-to-receive-usd-in-india"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
      { slug: "paypal", label: "Visit PayPal", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/remittance", label: "Estimate transfer costs" },
    body: [
      {
        type: "p",
        text: "A US client sends you $500. What lands in your INR account depends on the channel they use: the fee the provider takes, the exchange-rate spread, and how long the money takes. At the site's ₹95.40/USD mid-market snapshot (2026-08-12, the same rates the FX estimator uses), the cheapest and the priciest routes differ by roughly ₹5,100 — more than 10% of the amount. The short version: Wise and Revolut are the cheapest and fastest for most freelancers, bank wires hide their cost in the rate, PayPal is the most expensive, and Payoneer wins when the client already pays through marketplace rails.",
      },
      {
        type: "h2",
        text: "What each channel delivers for $500",
      },
      {
        type: "table",
        headers: ["Channel", "Upfront fee", "FX markup", "You receive (₹)", "Typical time"],
        rows: [
          ["Wise", "≈ $2.65 flat", "0% — mid-market rate", "≈ ₹47,447", "Minutes–hours"],
          ["Payoneer", "$0 to receive", "1–4% corridor (2% illustrated)", "≈ ₹46,746", "1–2 business days"],
          ["Bank wire (SWIFT)", "≈ $35 outgoing + sender's bank fees", "≈ 4.5% corridor", "≈ ₹42,365", "2–5 business days"],
          ["PayPal", "≈ $4.99 flat", "≈ 3.5% FX spread", "≈ ₹45,571", "1–3 days"],
        ],
      },
      {
        type: "h2",
        text: "Where the differences come from",
      },
      {
        type: "ul",
        items: [
          "Wise converts at the mid-market rate and charges a flat upfront fee (≈ 0.5% at this size), so the FX cost is visible before anyone sends anything.",
          "Payoneer's USD→INR withdrawal spread (1–4%, corridor-dependent) is hidden inside the conversion — check the exact rate in the Fees section before confirming.",
          "PayPal's flat ~$5 fee plus a ~3.5% conversion spread sits on top of the mid-market rate — and the personal-payment model can add a percentage fee on top of that; check the quote before confirming.",
          "Bank wires look cheap on paper but add double-ended fees (your client's bank + incoming SWIFT charges) plus the bank's FX margin — the classic hidden-markup trap.",
        ],
      },
      {
        type: "h2",
        text: "FIRC, records, and tax",
      },
      {
        type: "p",
        text: "A $500 inward remittance arrives through the banking channel and is recorded under FEMA like any other foreign receipt. For amounts this small, your bank's credit advice is the practical record — you can request a formal Foreign Inward Remittance Certificate (FIRC) from your branch whenever you need one for tax or documentation purposes.",
      },
      {
        type: "ul",
        items: [
          "A US client generally does not deduct Indian TDS, so the gross receipt lands in full — but the amount is business income for you.",
          "Many freelancers pay tax on a presumptive basis under Section 44ADA when eligible (professional income, turnover within limits) — the India–US tax treaty prevents double taxation.",
          "Keep the credit advice and any FIRC with your invoices; they are the evidence trail if a bank or the tax office ever asks.",
          "This is editorial guidance, not tax or legal advice — run your numbers past a CA.",
        ],
      },
      {
        type: "h2",
        text: "Which channel should you pick?",
      },
      {
        type: "ul",
        items: [
          "Occasional $500 from a direct client → Wise (or Revolut — at this size they land within ₹15 of each other): cheapest, fastest, most transparent.",
          "Platform or marketplace payouts → Payoneer: the rail the platform already uses, and receiving is $0.",
          "Client insists on PayPal → accept, but know you are paying roughly 10% versus Wise — asking the client to cover the fee is reasonable.",
          "Large or recurring amounts → give the client your Wise USD account details so they can pay by domestic ACH transfer; receiving is $0 and there is no SWIFT chain.",
          "Never via US P2P apps (Cash App, Venmo) — both are US-only, support no INR, and cross-border workarounds violate their terms (see the Cash App vs Venmo guide).",
        ],
      },
      {
        type: "h2",
        text: "Run your own numbers",
      },
      {
        type: "p",
        text: "The exact gap depends on the day's rate and your specific corridor. Use the Cross-Border FX Estimator to compare providers for your actual amount, and the exchange-rate markup calculator to expose the hidden spread of any rate you are offered. The same playbook applies when the client is outside the US — the Latin America guide covers the corridors (PIX, Mercado Pago, Payoneer) that get the money from there to India.",
      },
      {
        type: "p",
        text: "Editorial note: figures are illustrative from the 2026 catalog vintage (₹95.40/USD, the FX estimator's 2026-08-12 snapshot; fee models match the estimator's provider configs), not live quotes or financial advice. Fee schedules and FX programs change — verify the current rate before confirming any transfer.",
      },
    ],
  },
  {
    slug: "international-payment-settlement-times",
    author: "FinTech Atlas editorial team",
    title: "International payment settlement times (India)",
    description:
      "How fast money actually moves in India: UPI, IMPS, NEFT, RTGS, gateway T+1 settlement, Wise, SWIFT, and Payoneer — typical timelines and what slows them down.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["razorpay", "cashfree", "stripe", "wise", "payoneer", "paytm", "phonepe", "google-pay", "visa-direct", "mastercard-send"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india", "quarterly-india-cross-border-fee-index", "stablecoins-for-cross-border-payments"],
    ctas: [
      { slug: "razorpay", label: "Visit Razorpay", placement: "compare-vs" },
      { slug: "cashfree", label: "Visit Cashfree", placement: "compare-vs" },
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/remittance", label: "Estimate transfer costs" },
    body: [
      {
        type: "p",
        text: "The money you expect is only as fast as the rail it travels on. In India the same ₹1,000 can move instantly over UPI or take three business days through a bank wire — and international payments add the correspondent-bank chain on top. The short version: domestic rails settle in seconds to minutes (UPI, IMPS, NEFT, RTGS), payment gateways settle merchants on T+1 as standard, and cross-border payments land in minutes (Wise) to 2–5 business days (SWIFT). What you should expect depends on whether you are a merchant waiting for checkout revenue or a freelancer waiting for a client's transfer.",
      },
      {
        type: "h2",
        text: "India settlement timelines at a glance",
      },
      {
        type: "table",
        headers: ["Rail", "Typical time", "Notes", "Best for"],
        rows: [
          ["UPI", "Instant, 24×7", "Free; per-bank transaction limits apply", "Checkout, P2P, small payments"],
          ["IMPS", "Instant, 24×7", "Small fee; works from any bank", "Bank-to-bank transfers"],
          ["NEFT", "≈ 30 minutes (half-hourly batches)", "Free or near-free; 24×7 since 2019", "Domestic transfers, salaries"],
          ["RTGS", "Real-time", "₹2 lakh minimum; high-value", "Large domestic payments"],
          ["Gateway settlement (Razorpay, Cashfree, Stripe India)", "T+1 standard; T+0 for select merchants", "Settled to your bank account next business day", "Online merchants"],
          ["Wise (USD → INR)", "Minutes–hours", "Local-rail pairs; mid-market FX", "International transfers"],
          ["Payoneer (USD → INR)", "1–2 business days", "Marketplace rails; 1–4% corridor", "Platform payouts"],
          ["Bank wire / SWIFT", "2–5 business days", "Correspondent chain + double-ended fees", "Bank-to-bank international"],
          ["Card rails (Visa Direct / Mastercard Send)", "Minutes, where supported", "Real-time push to a debit card; network and bank dependent", "Instant payouts, refunds"],
          ["Stablecoin rails (USDC)", "Minutes–hours, 24×7", "On/off-ramp spreads + network fee; no bank hours — see the USDC vs bank wire guide", "Large or weekend-urgent receipts"],
        ],
      },
      {
        type: "h2",
        text: "Gateway settlement: what T+1 actually means",
      },
      {
        type: "p",
        text: "When a customer pays you at 8 PM on a Friday, T+1 does not mean Saturday morning. T+1 means the settlement instruction is processed on the next business day — so a Friday-evening transaction typically lands Monday, and a Saturday transaction lands Tuesday. Weekends, public holidays, and bank cut-off times all stretch the calendar.",
      },
      {
        type: "ul",
        items: [
          "Standard settlement for Razorpay, Cashfree, and Stripe India is T+1; select merchants on some gateways qualify for T+0 instant settlement.",
          "New merchants can face temporary settlement holds (days to a couple of weeks) while the gateway builds a risk history.",
          "Refunds and chargebacks are deducted from upcoming settlements, so a heavy refund week can shrink or delay your payout.",
          "Settlement happens to your linked bank account, not to a wallet — the bank's own processing adds the final few hours.",
        ],
      },
      {
        type: "h2",
        text: "International transfers: where the days go",
      },
      {
        type: "p",
        text: "A SWIFT wire passes through at least two banks — your client's and yours — and often a correspondent bank in between. Each hop has its own processing window, and weekends pause the chain entirely. FX markets close on weekends too, so a Friday-afternoon USD transfer can effectively stand still until Monday. Wise avoids most of the chain by moving money locally in each country (an INR transfer in India, a USD transfer in the US) and netting the difference — which is why it lands in minutes to hours at the mid-market rate.",
      },
      {
        type: "ul",
        items: [
          "Client-side delays matter: the client's bank cut-off time decides whether the wire leaves today or tomorrow.",
          "Beneficiary banks add their own processing — and their own incoming fees — even after the SWIFT message arrives.",
          "Payoneer receives into a local account and withdraws to INR on the 1–4% corridor, typically 1–2 business days.",
          "US ACH (domestic) payments into a Wise USD account clear in 1–3 business days, then convert and land in minutes.",
        ],
      },
      {
        type: "h2",
        text: "Which timeline matters for your business",
      },
      {
        type: "ul",
        items: [
          "Merchant with checkout revenue → gateway T+1 (or T+0 if eligible) is the cash-flow number to plan around; UPI at the counter settles instantly.",
          "Freelancer waiting on a client → ask how the client pays: ACH into your Wise USD details beats a SWIFT wire on both speed and fees.",
          "High-value domestic payment → RTGS clears in real time; NEFT is fine when tomorrow is acceptable.",
          "Recurring international invoices → build a 2–5 business day buffer into your expectations so a slow wire never becomes a missed deadline.",
        ],
      },
      {
        type: "h2",
        text: "Run your own numbers",
      },
      {
        type: "p",
        text: "Speed is half the picture — the other half is what the transfer costs you. Use the Cross-Border FX Estimator to compare providers for your exact amount, and the exchange-rate markup calculator to see the hidden spread in any rate you are offered.",
      },
      {
        type: "p",
        text: "Editorial note: timelines above are typical published behaviour from the 2026 catalog vintage, not guarantees. Settlement windows vary by bank, merchant category, gateway policy, and public holidays — check your provider's current terms before planning around a date.",
      },
    ],
  },
  {
    slug: "fira-vs-firc-payment-methods",
    author: "FinTech Atlas editorial team",
    title: "FIRA vs FIRC: payment-method comparison",
    description:
      "FIRA and FIRC are the two documents that prove money from abroad reached your Indian bank — what each is, when you need the certificate, and which payment methods produce one.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india", "receiving-1000-usd-from-us-client-in-india", "receiving-5000-usd-from-us-client-in-india", "best-payment-method-upwork-india", "best-payment-method-fiverr-india", "best-way-to-receive-usd-in-india"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
      { slug: "paypal", label: "Visit PayPal", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/remittance", label: "Estimate transfer costs" },
    body: [
      {
        type: "p",
        text: "FIRA and FIRC are the two documents banks issue for money received from outside India, and the names are used almost interchangeably in freelancer forums — which is exactly why the difference matters. The short version: FIRA is the bank's advice that a remittance arrived; FIRC is the formal certificate with a reference number that accountants, GST offices, and banks ask for when you need to prove foreign receipt. For day-to-day bookkeeping the credit advice is usually enough; for export-of-services claims under GST, tax documentation, or DTAA relief, you want the FIRC.",
      },
      {
        type: "h2",
        text: "FIRA vs FIRC at a glance",
      },
      {
        type: "table",
        headers: ["", "FIRA", "FIRC"],
        rows: [
          ["Full name", "Foreign Inward Remittance Advice", "Foreign Inward Remittance Certificate"],
          ["What it is", "The bank's advice/acknowledgement of a credit", "A formal certificate with a certificate number"],
          ["Issued by", "Your AD-category bank, usually automatically", "Your bank, usually on request"],
          ["Cost", "Free", "Free (standard practice)"],
          ["Typical turnaround", "Instant–same day", "1–3 business days"],
          ["When you need it", "Bookkeeping and general records", "GST export claims, tax files, DTAA documentation, bank queries"],
        ],
      },
      {
        type: "h2",
        text: "When the difference actually matters",
      },
      {
        type: "ul",
        items: [
          "Export of services under GST — the certificate is the standard evidence that foreign currency was received for the supply.",
          "Income-tax documentation for foreign receipts, especially when claiming double-taxation relief under the India–US treaty.",
          "Bank or CA requests for a formal record of a specific inward remittance.",
          "Large or recurring receipts where the bank's compliance team wants a clean audit trail.",
        ],
      },
      {
        type: "h2",
        text: "How to get a FIRC",
      },
      {
        type: "ul",
        items: [
          "Most banks now generate FIRCs from netbanking: open the inward-remittance record for the transaction and download the certificate.",
          "If it is not online, visit the branch that services your account — take the transaction reference from your credit advice.",
          "FIRC is issued under FEMA for remittances received through the banking channel; the process is free as standard practice.",
          "Keep a copy with the matching invoice — the pair is your evidence trail if a bank or the tax office ever asks.",
        ],
      },
      {
        type: "h2",
        text: "Which payment methods produce one",
      },
      {
        type: "table",
        headers: ["Channel", "FIRC treatment", "Why"],
        rows: [
          ["Bank wire / SWIFT", "Yes — standard", "The classic banking-channel inward remittance; your bank issues FIRC automatically or on request"],
          ["Wise (USD → INR)", "Usually yes, bank-dependent", "Credits arrive through banking partners; classification varies by bank — ask your branch"],
          ["Payoneer (USD → INR)", "Usually yes, bank-dependent", "Withdrawals land as banking-channel credits; confirmation depends on your bank"],
          ["PayPal (balance → INR)", "Typically no", "Withdrawals settle domestically from PayPal's Indian entity, so there is no foreign remittance to certify"],
        ],
      },
      {
        type: "h2",
        text: "What to do with the documents",
      },
      {
        type: "ul",
        items: [
          "File FIRCs with the invoices they correspond to — one folder per financial year keeps tax season simple.",
          "If you claim GST refunds or export benefits, your CA will ask for FIRC as standard evidence — collect them as you go, not in April.",
          "PayPal-only freelancers should keep the withdrawal statements instead; the domestic settlement means no FIRC, but the record still proves the income.",
          "This is editorial guidance, not tax or legal advice — confirm what your own accountant needs.",
        ],
      },
      {
        type: "h2",
        text: "Run your own numbers",
      },
      {
        type: "p",
        text: "FIRC eligibility depends on how your bank classifies a credit — the other half of the picture is what each channel costs. Use the Cross-Border FX Estimator to compare providers for your exact amount, and the exchange-rate markup calculator to expose the hidden spread in any rate you are offered.",
      },
      {
        type: "p",
        text: "Editorial note: FIRC/FIRA practices are general banking practice as of the 2026 catalog vintage and vary by bank, branch, and transaction type — confirm the current process with your own bank before planning around it.",
      },
    ],
  },
  {
    slug: "quarterly-india-cross-border-fee-index",
    author: "FinTech Atlas editorial team",
    title: "Quarterly India Cross-Border Payment Fee Index",
    description:
      "The FinTech Atlas consolidated index of India cross-border payment fees: what Wise, Revolut, Payoneer, PayPal, and a bank wire actually deliver for $500, $1,000, and $5,000 — computed from the site's published fee schedules.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india", "receiving-1000-usd-from-us-client-in-india", "receiving-5000-usd-from-us-client-in-india", "payoneer-fees-india", "wise-vs-revolut-international-transfers", "international-payment-settlement-times", "stablecoins-for-cross-border-payments", "payment-gateway-fee-comparison-india", "best-payment-method-upwork-india", "best-payment-method-fiverr-india"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
      { slug: "revolut", label: "Open Revolut", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/remittance", label: "Run your own amount" },
    body: [
      {
        type: "p",
        text: "This is the FinTech Atlas consolidated fee index for receiving USD in India — what each channel actually delivers after fees and FX markup, for three representative amounts. Every figure is computed from the same provider fee models and the same ₹95.40/USD mid-market snapshot (2026-08-12) that power the site's Cross-Border FX Estimator, so the index and the calculator can never disagree. Treat it as a snapshot of the current vintage, not a live quote: schedules change, and your exact corridor can differ.",
      },
      {
        type: "h2",
        text: "The index: net INR for $500 / $1,000 / $5,000",
      },
      {
        type: "table",
        headers: ["Channel", "$500", "$1,000", "$5,000", "Fee model", "FX markup"],
        rows: [
          ["Wise", "≈ ₹47,447", "≈ ₹94,942", "≈ ₹4,74,901", "0.43% + $0.50", "0%"],
          ["Revolut", "≈ ₹47,462", "≈ ₹94,923", "≈ ₹4,74,615", "0.5%", "0%"],
          ["Payoneer (2% corridor illustrated)", "≈ ₹46,746", "≈ ₹93,492", "≈ ₹4,67,460", "1–4% corridor", "In-spread"],
          ["PayPal / Xoom", "≈ ₹45,571", "≈ ₹91,602", "≈ ₹4,59,846", "$4.99 flat", "3.5%"],
          ["Illustrative bank wire", "≈ ₹42,365", "≈ ₹87,918", "≈ ₹4,52,346", "$35 flat", "4.5%"],
        ],
      },
      {
        type: "h2",
        text: "How the index is computed",
      },
      {
        type: "p",
        text: "For each provider: the fee model (percentage, flat, or both) is applied to the send amount, then the FX markup is applied to the mid-market rate, and the net amount is converted. The mid-market snapshot is ₹95.40/USD (2026-08-12); the fee models are the ones published in the site's remittance configuration — the same inputs the Cross-Border FX Estimator runs. Payoneer has no fixed published percentage for USD→INR: the published 1–4% corridor is shown at its 2% midpoint for comparison, with the caveat that the actual rate is shown in your account before you confirm.",
      },
      {
        type: "h2",
        text: "Reading the index",
      },
      {
        type: "ul",
        items: [
          "At $500, Revolut and Wise land within ₹15 of each other — a rounding difference, not a decision; the tie breaks on speed, account features, and corridors you actually use.",
          "Above roughly $714, Wise's 0.43% + $0.50 model beats Revolut's flat 0.5% — the crossover is built into the fee math.",
          "PayPal's flat $4.99 fee scales down as a percentage as amounts grow, but the 3.5% spread stays proportional — it trails Wise by ~7–8% at every size in this table.",
          "The bank wire is the most expensive at every size in this table: the $35 flat fee plus 4.5% margin costs roughly 10% of a $500 transfer before any incoming charges.",
          "Payoneer's corridor sits between the specialists and PayPal at the 2% midpoint — check the actual corridor before relying on it.",
        ],
      },
      {
        type: "h2",
        text: "What's not in the index",
      },
      {
        type: "ul",
        items: [
          "Domestic gateway fees (Razorpay, Cashfree, Stripe India at 2% + 18% GST) are a different rail — they apply to INR checkouts, not USD receipts; use the gateway fee calculator for those.",
          "Enterprise and negotiated rates, card-funded payment requests, weekend FX effects, and promotional offers are all excluded.",
          "Stablecoin rails (USDC) are excluded — they have no published fee schedule; the USDC vs bank wire guide covers the corridor, its typical spread range, and the regulatory caveats.",
          "Incoming bank charges on wires are excluded — the bank row is the outgoing-side $35 model plus the 4.5% margin.",
        ],
      },
      {
        type: "h2",
        text: "Run your own numbers",
      },
      {
        type: "p",
        text: "The index is a fixed snapshot; your transfer is live. Run your exact amount through the Cross-Border FX Estimator, and use the exchange-rate markup calculator to expose the hidden spread in any rate a provider offers you.",
      },
      {
        type: "p",
        text: "Editorial note: index figures are computed from the site's published provider fee models and the ₹95.40/USD snapshot of 2026-08-12 — the same inputs as the Cross-Border FX Estimator. They are illustrative, not live quotes; verify current schedules before planning around any figure.",
      },
    ],
  },
  {
    slug: "payment-gateway-for-subscription-businesses",
    author: "FinTech Atlas editorial team",
    title: "Payment gateways for Indian subscriptions",
    description:
      "Razorpay, Cashfree, and Stripe India for recurring billing: UPI AutoPay mandates, card-on-file eMandates, eNACH, billing engines, and which gateway fits a subscription business.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["razorpay", "cashfree", "stripe"],
    relatedArticleSlugs: ["razorpay-vs-stripe-payments-india", "razorpay-vs-stripe-for-developers", "razorpay-vs-cashfree-for-ecommerce", "payment-gateway-fee-comparison-india"],
    ctas: [
      { slug: "razorpay", label: "Visit Razorpay", placement: "compare-vs" },
      { slug: "cashfree", label: "Visit Cashfree", placement: "compare-vs" },
      { slug: "stripe", label: "Visit Stripe", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/calculator", label: "Estimate gateway fees" },
    body: [
      {
        type: "p",
        text: "A subscription business in India is really three problems: recurring billing, failed-payment recovery, and the rails that let Indian customers authorise repeat debits. The short version: Razorpay and Cashfree cover the full Indian stack — UPI AutoPay mandates, card-on-file eMandates, and eNACH — while Stripe India is the stronger choice if a large share of your customers pay by international cards. All three charge the same published 2% + 18% GST on domestic payments, so the decision is about mandate rails, billing features, and your customer mix, not headline price.",
      },
      {
        type: "h2",
        text: "Capability at a glance",
      },
      {
        type: "table",
        headers: ["Capability", "Razorpay", "Cashfree", "Stripe (India)"],
        rows: [
          ["UPI AutoPay (recurring mandates)", "Yes", "Yes", "Limited — verify"],
          ["Card recurring (card-on-file eMandate)", "Yes", "Yes", "Yes"],
          ["eNACH bank-account auto-debit", "Yes", "Yes", "No"],
          ["Domestic fee (published)", "2% + 18% GST", "2% + 18% GST", "2% + 18% GST"],
          ["International cards", "Up to 3%", "Varies by instrument", "3%"],
          ["Settlement", "T+1 standard", "T+1 default", "T+1-style payouts"],
          ["Billing engine", "Subscriptions add-on", "Subscription product", "Stripe Billing"],
        ],
      },
      {
        type: "h2",
        text: "Why UPI AutoPay changes the decision",
      },
      {
        type: "p",
        text: "Most Indian consumers do not reach for a credit card when a subscription renews — they pay by UPI. UPI AutoPay (the recurring-mandate variant of the UPI rail) lets a customer approve a standing mandate once, after which the gateway can debit them on schedule. That single flow is the difference between an Indian subscription business that collects reliably and one that chases failed card payments every month.",
      },
      {
        type: "ul",
        items: [
          "Mandates carry per-debit limits set by the customer's bank (with additional-factor authentication for higher amounts), so high-ticket annual plans may need a different rail.",
          "The customer approves the mandate through their own UPI app — the gateway handles the mandate creation, but the experience lives in the customer's bank app.",
          "Mandate approval is near-instant, which makes UPI AutoPay the fastest recurring rail to onboard a new customer on.",
          "Razorpay and Cashfree both offer UPI AutoPay; Stripe's India support is more limited — verify current coverage before betting your renewal flow on it.",
        ],
      },
      {
        type: "h2",
        text: "Cards and bank-account mandates",
      },
      {
        type: "p",
        text: "For customers who do pay by card, RBI's card-on-file tokenisation rules mean the gateway stores a token, not the card number, and recurring card debits run through an eMandate. For very high-ticket or business-to-business subscriptions, eNACH (the bank-account auto-debit rail) supports larger amounts than UPI mandates — but mandate setup takes days rather than minutes, because the customer's bank has to approve it.",
      },
      {
        type: "ul",
        items: [
          "Card-on-file eMandates need the customer's one-time approval at setup; renewal debits then run without re-authentication within the mandate's limits.",
          "eNACH is the rail for annual contracts above UPI mandate limits — budget 3–7 days for the mandate to go live.",
          "Stripe India does not offer eNACH; if bank-account auto-debit matters, that is a Razorpay/Cashfree conversation.",
          "Every recurring rail has a failure rate — budget for it, and build a retry flow rather than assuming clean renewals.",
        ],
      },
      {
        type: "h2",
        text: "Billing features that matter for subscriptions",
      },
      {
        type: "ul",
        items: [
          "Dunning: automatic retries with smart windows (e.g. days 0, 3, 7) recover a meaningful share of failed renewals — the single highest-leverage billing feature.",
          "Proration and plan changes: upgrades, downgrades, and mid-cycle changes without manual refunds.",
          "GST invoicing: subscriptions need correct tax invoices at renewal time; the billing engine should emit them automatically.",
          "Metered/usage billing: for SaaS priced on seats or consumption, the engine must be able to bill variable amounts on a schedule.",
          "Refund and chargeback tooling: self-serve refunds beat support tickets for every churned customer you want back.",
        ],
      },
      {
        type: "h2",
        text: "Which one should you pick?",
      },
      {
        type: "ul",
        items: [
          "D2C SaaS or membership selling to Indian consumers → Razorpay or Cashfree: UPI AutoPay coverage is the deciding rail, and the billing engines cover the rest.",
          "International-first SaaS (USD pricing, global customers) → Stripe: global card coverage, Stripe Billing, and the developer ecosystem.",
          "High-ticket annual or B2B contracts → whichever gateway's eNACH you can live with, and plan the mandate lead time into onboarding.",
          "Hybrid → run Stripe for the global share and an Indian gateway for UPI AutoPay; both ecosystems tolerate a split checkout.",
        ],
      },
      {
        type: "h2",
        text: "Run your own numbers",
      },
      {
        type: "p",
        text: "The fee schedule is the same 2% + 18% GST across all three, but your international mix changes the blended rate. Run your volume, average order value, and international share through the gateway fee calculator to see the monthly number for each provider.",
      },
      {
        type: "p",
        text: "Editorial note: capabilities above are indicative from the 2026 catalog vintage — mandate limits, eNACH availability, and Stripe's India coverage change; verify the current feature matrix with each provider before committing your renewal flow.",
      },
    ],
  },
  {
    slug: "receiving-5000-usd-from-us-client-in-india",
    author: "FinTech Atlas editorial team",
    title: "Receiving $5,000 from a US client in India",
    description:
      "At $5,000 the channel gap shrinks to ~3% — the real decisions are EEFC accounts (hold the dollars), FIRC documentation, and advance payments. Worked numbers from the site's fee index.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india", "receiving-1000-usd-from-us-client-in-india", "fira-vs-firc-payment-methods", "quarterly-india-cross-border-fee-index", "stablecoins-for-cross-border-payments", "best-way-to-receive-usd-in-india"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
      { slug: "revolut", label: "Open Revolut", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/remittance", label: "Estimate transfer costs" },
    body: [
      {
        type: "p",
        text: "A $5,000 receipt from a US client is a different game from $500. At the smaller size the channel choice was worth more than 10% of the money; at $5,000 the published schedules land within about 3% of each other — the channel decision mostly stops mattering, and three new ones take its place: whether to convert at all (EEFC), how to document the receipt (FIRC), and how the client pays (advance vs milestones). The short version: at this size, pick a low-cost rail and spend your attention on holding, records, and timing.",
      },
      {
        type: "h2",
        text: "The numbers at $5,000",
      },
      {
        type: "table",
        headers: ["Channel", "You receive (₹)", "Fee model", "FX markup"],
        rows: [
          ["Wise", "≈ ₹4,74,901", "0.43% + $0.50", "0%"],
          ["Revolut", "≈ ₹4,74,615", "0.5%", "0%"],
          ["Payoneer (2% corridor illustrated)", "≈ ₹4,67,460", "1–4% corridor", "In-spread"],
          ["PayPal / Xoom", "≈ ₹4,59,846", "$4.99 flat", "3.5%"],
          ["Illustrative bank wire", "≈ ₹4,52,346", "$35 flat", "4.5%"],
        ],
      },
      {
        type: "p",
        text: "Figures computed from the same fee models and ₹95.40/USD snapshot (2026-08-12) as the Quarterly India Cross-Border Payment Fee Index — the full $500/$1,000/$5,000 matrix lives there.",
      },
      {
        type: "h2",
        text: "What changes at this size",
      },
      {
        type: "ul",
        items: [
          "The channel gap compresses: Wise vs PayPal is ~3% at $5,000, versus more than 10% at $500 — the flat fees that hurt small transfers barely register now.",
          "FIRC becomes routine: at this size your bank will commonly issue (or expect you to have) a Foreign Inward Remittance Certificate for the credit.",
          "Banks may ask for source documentation — an invoice or contract matching the credit is the standard answer, so keep it ready.",
          "The amount clears the threshold where an EEFC account (holding the dollars) starts being a real option rather than a curiosity.",
        ],
      },
      {
        type: "h2",
        text: "EEFC: hold the dollars instead of converting",
      },
      {
        type: "p",
        text: "An EEFC (Exchange Earners' Foreign Currency Account) is a foreign-currency account with an AD-category bank that service exporters — including freelancers — can credit with eligible export earnings. Instead of converting on arrival, you keep the USD in the account and convert when you actually need INR. That decouples the payment from the exchange rate: if you believe the rupee will weaken, holding delays conversion; if it strengthens, you lose. It is timing risk either way, and the account is not free money — balances earn interest under RBI norms and can only be used for permitted purposes.",
      },
      {
        type: "ul",
        items: [
          "Eligible earnings: foreign-currency receipts for exported services can be credited, up to the permitted percentage — ask your bank about current limits.",
          "The account lives at your AD bank and pairs with your regular INR account; conversion happens when you instruct it.",
          "Currency risk is yours: there is no hedging product here — holding is a bet on the USD/INR direction, and converting on receipt is the neutral default.",
          "Most freelancers do not need an EEFC; it earns its keep only when receipts are frequent or large enough that conversion timing meaningfully moves the outcome.",
        ],
      },
      {
        type: "h2",
        text: "FIRC and documentation at $5,000",
      },
      {
        type: "ul",
        items: [
          "Keep the invoice and the credit advice (or FIRC) as a pair — it is the evidence trail for export-of-services claims and tax files.",
          "Export of services is zero-rated under GST; the certificate is the standard receipt evidence your CA will ask for alongside the LUT/refund mechanics.",
          "The India–US tax treaty prevents double taxation, but the paperwork is yours: file the FIRC with the invoice it corresponds to.",
          "If the bank queries the source of a credit, the invoice-plus-FIRC pair answers it in one message.",
        ],
      },
      {
        type: "h2",
        text: "Advance payments and milestones",
      },
      {
        type: "ul",
        items: [
          "A 100% advance on invoice is normal at this size — agree the rail before the client pays so you are not surprised by a wire.",
          "Split milestone payments each generate their own FIRC/credit advice; batch them into one folder per project, not per year.",
          "If the client pays by ACH into your Wise USD account, you choose when to convert — the same timing decision as an EEFC, without the bank account.",
        ],
      },
      {
        type: "h2",
        text: "Which channel should you pick?",
      },
      {
        type: "ul",
        items: [
          "Direct client paying $5,000 → Wise (or Revolut — within ₹250 of each other at this size), and give them your USD account details for an ACH payment.",
          "Marketplace or platform payouts → Payoneer: the rail the platform already uses; the ~1.6% gap to Wise is the price of the rails.",
          "Client insists on PayPal → the ~3% gap is tolerable at this size, but the conversion spread still makes it the worst of the four.",
          "Never a bank wire at this size unless the client's bank requires it — it is the most expensive row in the table.",
          "Want conversion timing control → EEFC at your bank, or a Wise USD balance — the choice is where you want the money parked.",
          "Crypto-comfortable, weekend-urgent, no FIRC needed → a USDC rail can match Wise at this size (see the USDC vs bank wire guide) — benchmark the quoted spread first.",
        ],
      },
      {
        type: "h2",
        text: "Run your own numbers",
      },
      {
        type: "p",
        text: "The table above is a fixed snapshot. Run your exact amount through the Cross-Border FX Estimator, compare against the full fee index, and use the exchange-rate markup calculator to expose the hidden spread in any rate you are offered.",
      },
      {
        type: "p",
        text: "Editorial note: figures are computed from the site's published fee models and ₹95.40/USD snapshot (2026-08-12) — the same inputs as the FX estimator. EEFC eligibility, holding limits, and banking practice vary by bank and regulation; this is editorial guidance, not tax or legal advice. Verify current terms before acting.",
      },
    ],
  },
  {
    slug: "razorpay-vs-stripe-for-developers",
    author: "FinTech Atlas editorial team",
    title: "Razorpay vs Stripe for developers",
    description:
      "API design, SDKs, webhooks, test tooling, PCI scope, and India-specific rails — which gateway your engineering team will build faster on, and where the DX gap is real.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["razorpay", "stripe"],
    relatedArticleSlugs: ["razorpay-vs-stripe-payments-india", "payment-gateway-for-subscription-businesses"],
    ctas: [
      { slug: "razorpay", label: "Razorpay developer docs", placement: "compare-vs" },
      { slug: "stripe", label: "Stripe developer docs", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/calculator", label: "Estimate gateway fees" },
    body: [
      {
        type: "p",
        text: "For an engineering team, Razorpay vs Stripe is a developer-experience question, not a pricing one — the published rates converge at 2% + GST on domestic payments, and the business comparison is covered separately. The DX differences are real but narrower than Stripe's global reputation suggests: Stripe brings a more consistent API surface, richer event model, and first-class test tooling; Razorpay brings native India-specific rails — UPI intents, AutoPay mandates, and payouts — that Stripe India does not match. If your checkout is UPI-heavy and Indian, Razorpay gets you live faster; if you are building global subscriptions or need the cleanest API to hang billing off, Stripe is the safer long-term bet.",
      },
      {
        type: "h2",
        text: "Capability at a glance",
      },
      {
        type: "table",
        headers: ["Capability", "Razorpay", "Stripe (India)"],
        rows: [
          ["API design", "India-first resources (orders, UPI intents, mandates)", "Consistent, versioned, idempotency-first"],
          ["SDK coverage", "All major languages + WooCommerce/Shopify plugins", "All major languages + ecosystem plugins"],
          ["Webhook event model", "Core payment/refund/settlement events", "Rich catalog incl. subscription lifecycle"],
          ["Test tooling", "Sandbox with UPI test flow", "Sandbox + test clock for recurring billing"],
          ["India rails (UPI, AutoPay, payouts)", "Native, first-party", "Limited — verify current coverage"],
          ["PCI scope", "SAQ-A on hosted flows", "SAQ-A on hosted flows"],
        ],
      },
      {
        type: "h2",
        text: "API design and documentation",
      },
      {
        type: "ul",
        items: [
          "Stripe's API is the industry reference: idempotency keys on every mutating call, a consistent resource model, versioned API with migration guides, and typed SDKs in most languages.",
          "Razorpay's API is competent and covers India-specific resources Stripe lacks — orders, payment links, UPI intents, mandates, and settlement routing — but the surface is more sprawling, with less uniform conventions across products.",
          "Both document well; Razorpay's docs are practical for the Indian flow (UPI intent handshake, mandate creation), Stripe's are deeper for general payment plumbing.",
          "Error handling: Stripe's typed error classes and decline codes are easier to map to user-facing messages; Razorpay's error model is thinner and needs more mapping on your side.",
        ],
      },
      {
        type: "h2",
        text: "SDKs and client libraries",
      },
      {
        type: "ul",
        items: [
          "Both ship official SDKs for the mainstream languages (Node, Python, PHP, Java, Go) — pick by your stack, not by gateway.",
          "Stripe's SDKs are more consistently versioned and typed; Razorpay's are adequate but occasionally lag new API features.",
          "Framework plugins: Razorpay has first-party WooCommerce/Shopify/other plugin coverage tuned for Indian merchants; Stripe relies on its own plugins plus the ecosystem — both cover the popular carts.",
          "Mobile: both offer native iOS/Android SDKs; Stripe's checkout sheet is more polished, Razorpay's is India-aware (UPI apps deep-linking, netbanking list).",
        ],
      },
      {
        type: "h2",
        text: "Webhooks and events",
      },
      {
        type: "ul",
        items: [
          "Stripe's event model is the gold standard: a rich event catalog (payment, dispute lifecycle, subscription and invoice events for Billing), signed payloads, and replayable delivery.",
          "Razorpay covers the core events — payment success/failure, refund, settlement — with signed webhooks; the catalog is smaller and subscription-automation events live in the subscriptions product.",
          "Both support signature verification and retries; plan for idempotent handlers either way, because redelivery happens on both platforms.",
        ],
      },
      {
        type: "h2",
        text: "Test mode and tooling",
      },
      {
        type: "ul",
        items: [
          "Both give you a sandbox with test cards and (for Razorpay) a UPI test flow that mirrors the app handshake.",
          "Stripe's test clock is the differentiator for subscription teams: you can fast-forward billing cycles and exercise proration, dunning, and cancellations deterministically.",
          "Razorpay's sandbox is fine for Indian rails but thinner for recurring-billing edge cases — subscription logic tends to get tested against production-like data.",
          "Neither charges for sandbox usage; both have webhook test tools and CLI-driven local testing (Stripe CLI, Razorpay's equivalents).",
        ],
      },
      {
        type: "h2",
        text: "PCI scope and compliance",
      },
      {
        type: "ul",
        items: [
          "Use the hosted checkout or redirect flow and card data never touches your servers — that keeps you on the narrow SAQ-A questionnaire with either gateway.",
          "Custom iframe/hosted-fields integrations stay low-scope; rendering raw card inputs yourself drags you into SAQ-D territory and is rarely worth it.",
          "Both platforms hold PCI-DSS certification and act as the merchant of record on card data; your scope is defined by how you integrate, not which you choose.",
          "Razorpay handles Indian compliance (PA-CB/aggregator licensing, GST invoicing); Stripe India is licensed in-country but its product surface is smaller.",
        ],
      },
      {
        type: "h2",
        text: "India-specific rails",
      },
      {
        type: "ul",
        items: [
          "UPI: Razorpay's UPI intent and collect flows are first-party and battle-tested; Stripe India's UPI support exists but with less depth — verify current coverage for your flow.",
          "Recurring: Razorpay owns UPI AutoPay mandate creation end to end; Stripe's recurring strength is card eMandates and Stripe Billing's global engine.",
          "Payouts: RazorpayX-style instant payouts and settlement routing are Razorpay territory; Stripe India payouts are more basic.",
          "If your product is Indian consumer payments, the native-rails gap is the biggest DX difference on this page — it is engineering time spent on workarounds otherwise.",
        ],
      },
      {
        type: "h2",
        text: "Which should your team build on?",
      },
      {
        type: "ul",
        items: [
          "UPI-heavy Indian checkout → Razorpay: native UPI intents, AutoPay mandates, and payouts are features you would otherwise build around.",
          "Global SaaS with subscriptions → Stripe: Billing, test clock, event model, and the cleanest API for metered logic.",
          "Hybrid (Indian consumers + global customers) → run both: keep the Indian rails on Razorpay and route international card/subscription volume to Stripe.",
          "Small team, one codebase, mostly cards → Stripe: the API quality directly reduces integration and maintenance time.",
        ],
      },
      {
        type: "h2",
        text: "Run your own numbers",
      },
      {
        type: "p",
        text: "DX decides velocity, but fees decide the P&L — run your volume and international mix through the gateway fee calculator with both providers selected.",
      },
      {
        type: "p",
        text: "Editorial note: capabilities and tooling described are indicative of the 2026 catalog vintage — Stripe India's UPI coverage and Razorpay's API surface both move; verify current docs before committing an architecture.",
      },
    ],
  },
  {
    slug: "razorpay-vs-cashfree-for-ecommerce",
    author: "FinTech Atlas editorial team",
    title: "Razorpay vs Cashfree for ecommerce",
    description:
      "Checkout plugins, EMI and pay-later coverage, COD reconciliation, and international selling — the operational differences that decide the gateway for an Indian online store.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["razorpay", "cashfree"],
    relatedArticleSlugs: ["razorpay-vs-cashfree-indian-gateways", "payment-gateway-for-subscription-businesses", "best-payment-gateway-shopify-india"],
    ctas: [
      { slug: "razorpay", label: "Visit Razorpay", placement: "compare-vs" },
      { slug: "cashfree", label: "Visit Cashfree", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/calculator", label: "Estimate gateway fees" },
    body: [
      {
        type: "p",
        text: "For an online store, Razorpay and Cashfree are again identical on headline price — 2% + 18% GST on domestic payments, covered in the general gateway comparison — so the ecommerce decision turns on store operations: how the checkout fits your cart, how EMI and pay-later options are surfaced, how COD gets reconciled, and whether you can sell internationally on the same account. Both gateways cover all of these; the differences are in checkout conversion features, integration depth, and which one your store platform supports best.",
      },
      {
        type: "h2",
        text: "Capability at a glance",
      },
      {
        type: "table",
        headers: ["Capability", "Razorpay", "Cashfree"],
        rows: [
          ["Cart plugins (WooCommerce/Shopify)", "First-party", "First-party"],
          ["EMI / pay-later at checkout", "Yes — coverage by agreement", "Yes — coverage by agreement"],
          ["UPI intent checkout", "First-class", "First-class"],
          ["COD reconciliation", "Dashboard + auto-reconcile", "Dashboard + bulk tools"],
          ["International cards (₹ account)", "Up to 3%", "From 2.95%"],
          ["Settlement", "T+1 standard", "T+1 default"],
        ],
      },
      {
        type: "h2",
        text: "Checkout and store integrations",
      },
      {
        type: "ul",
        items: [
          "Both ship first-party plugins for WooCommerce, Shopify, and the major Indian carts — check the plugin's update cadence, because abandoned plugins are how stores end up on outdated SDKs.",
          "Hosted payment pages and links: both offer them for quick launches; Razorpay's payment-page builder and Cashfree's equivalents are comparable for low-volume stores.",
          "Headless or custom checkout: both publish SDKs and APIs; the checkout UX (one-click UPI, saved cards, smart retry) is where the platforms differentiate — evaluate with a demo store, not a feature list.",
          "Conversion features worth testing: express checkouts, one-click reorders for logged-in customers, and UPI intent flows that avoid app-switching friction.",
        ],
      },
      {
        type: "h2",
        text: "EMI, pay-later, and UPI at checkout",
      },
      {
        type: "ul",
        items: [
          "Both cover card EMI and net-banking EMI; the real question is which banks and tenors are live for your merchant account — coverage varies by agreement, not by gateway brand.",
          "Pay-later instruments (buy-now-pay-later wallets and card-linked options) are available on both; availability at checkout depends on the customer's instrument, so the merchant-side choice matters less than the coverage list.",
          "UPI is table stakes — the conversion difference is intent flow design and whether the checkout offers UPI as a first-class option or an afterthought.",
          "Verify the EMI/pay-later settlement terms: some schemes settle the full amount with a subvention fee, which changes your cash-flow math.",
        ],
      },
      {
        type: "h2",
        text: "COD and order reconciliation",
      },
      {
        type: "ul",
        items: [
          "COD is a logistics rail, not a payment rail: the gateway reconciles the COD amount your logistics partner collects. Both platforms support it; the difference is in the reconciliation dashboard.",
          "Look for auto-reconciliation against your order system — manual matching scales badly past a few hundred orders a day.",
          "Refunds and partial refunds: both handle them, but the speed of the refund loop (and whether the gateway auto-reconciles it with the original order) affects your customer-service workload.",
          "Chargebacks and disputes: both provide a dispute interface; response windows are short, so dashboard alerting matters more than the form itself.",
        ],
      },
      {
        type: "h2",
        text: "International ecommerce",
      },
      {
        type: "ul",
        items: [
          "Selling to foreign customers from an Indian store: Razorpay International and Cashfree's cross-border options both let you charge foreign cards on a rupee account — the merchant keeps INR, the customer pays in their currency.",
          "Published international rates sit at ~3% (Razorpay up to 3%, Cashfree from 2.95%) — close enough that coverage, settlement, and documentation decide.",
          "If you sell via Shopify Markets or a marketplace, check the gateway's plugin support for multi-currency checkout before committing.",
          "For larger international volume, compare against a merchant-of-record or a local acquiring setup — the ~3% band is not the floor once cross-border volume is meaningful.",
        ],
      },
      {
        type: "h2",
        text: "Which store type should pick which",
      },
      {
        type: "ul",
        items: [
          "D2C store on Shopify/WooCommerce → whichever plugin your stack runs best on; both are first-party, so this is a tie-breaker you can settle with a demo checkout.",
          "High-volume marketplace or multi-vendor → Cashfree's verification suite and bulk-payout rails fit marketplace settlement flows; Razorpay's equivalent covers similar ground — compare the payout API for your split logic.",
          "Headless or custom storefront → evaluate SDK quality and checkout components hands-on; the conversion features above are the differentiator.",
          "COD-heavy catalogue → whichever gateway's reconciliation workflow you can wire to your order system with least glue code.",
          "International-first catalogue → check the cross-border product's currency and settlement terms on your merchant agreement before signing.",
        ],
      },
      {
        type: "h2",
        text: "Run your own numbers",
      },
      {
        type: "p",
        text: "Operations decide the gateway; volume decides the cost. Run your average order value, volume, and international share through the gateway fee calculator for both providers.",
      },
      {
        type: "p",
        text: "Editorial note: capabilities, EMI/pay-later coverage, and cross-border terms are indicative of the 2026 catalog vintage and vary by merchant agreement — verify the current feature matrix and your signed terms before deciding.",
      },
    ],
  },
  {
    slug: "receiving-1000-usd-from-us-client-in-india",
    author: "FinTech Atlas editorial team",
    title: "Receiving $1,000 from a US client in India",
    description:
      "The freelancer-milestone guide: at $1,000 flat fees and percentage fees balance out, marketplace rails (Upwork/Fiverr) route you to Payoneer, and FIRC documentation habits start.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india", "receiving-5000-usd-from-us-client-in-india", "fira-vs-firc-payment-methods", "quarterly-india-cross-border-fee-index", "payoneer-fees-india", "gusto-vs-adp-vs-paychex-us-payroll", "best-payment-method-upwork-india", "best-payment-method-fiverr-india", "best-way-to-receive-usd-in-india", "paypal-vs-payoneer-india"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
      { slug: "paypal", label: "Visit PayPal", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/remittance", label: "Estimate transfer costs" },
    body: [
      {
        type: "p",
        text: "A $1,000 payment is the freelancer milestone — the typical Upwork or Fiverr payout, the size where clients stop asking how to pay and you should start caring about how you receive it. It sits exactly where the two fee structures balance: the flat fees that dominated at $500 (Wise's $0.50, PayPal's $4.99) have shrunk into the noise, while percentage costs still matter — the spread between the cheapest and priciest channels is about ₹7,000 — roughly 7.4% of the money. The short version: take the payment on the rail your client or platform prefers, pick Wise or Revolut when you choose, and use the first $1,000 receipts to build the documentation habit — invoice pairs, FIRCs, and a folder per project.",
      },
      {
        type: "h2",
        text: "The numbers at $1,000",
      },
      {
        type: "table",
        headers: ["Channel", "You receive (₹)", "Fee model", "FX markup"],
        rows: [
          ["Wise", "≈ ₹94,942", "0.43% + $0.50", "0%"],
          ["Revolut", "≈ ₹94,923", "0.5%", "0%"],
          ["Payoneer (2% corridor illustrated)", "≈ ₹93,492", "1–4% corridor", "In-spread"],
          ["PayPal / Xoom", "≈ ₹91,602", "$4.99 flat", "3.5%"],
          ["Illustrative bank wire", "≈ ₹87,918", "$35 flat", "4.5%"],
        ],
      },
      {
        type: "p",
        text: "Figures computed from the same fee models and ₹95.40/USD snapshot (2026-08-12) as the Quarterly India Cross-Border Payment Fee Index — the $500 and $5,000 companion tables live in the sibling guides for those amounts.",
      },
      {
        type: "h2",
        text: "Where the fee structures flip",
      },
      {
        type: "ul",
        items: [
          "At $500 the flat fees decided everything — Wise's $0.50 versus PayPal's $4.99 plus a 3.5% spread made the channels differ by more than 10%.",
          "At $1,000 the flat fees are rounding error; the percentage spread is what separates the rails — about 3.5% between Wise and PayPal, and about 7.4% between the best and the bank wire.",
          "At $5,000 the percentages converge too, and the decision moves to timing and documentation — the milestone progression is the point: each size has one dominant question.",
          "For $1,000 the dominant question is which rail your client or platform already uses — switching costs usually exceed the ~3.5% you would save.",
        ],
      },
      {
        type: "h2",
        text: "Marketplace rails: Upwork and Fiverr",
      },
      {
        type: "ul",
        items: [
          "Upwork direct contracts pay via the platform's rails; Fiverr pays out on its schedule — in both cases the platform, not you, picks most of the routing.",
          "Payoneer is the common withdrawal path for marketplace balances, which is why the Payoneer corridor (1–4%) shows up even when you would never choose it for a direct client payment.",
          "Withdrawals from a marketplace balance to your bank are the same rail decision as any receipt: compare the corridor rate shown at withdrawal time against the Wise/Revolut route.",
          "If the platform lets you choose the receiving account, a Wise USD balance often beats the platform's built-in conversion — worth a test withdrawal at your first payout size.",
        ],
      },
      {
        type: "h2",
        text: "Start the documentation habit here",
      },
      {
        type: "ul",
        items: [
          "This is the size where banks routinely issue FIRCs and where export-of-services claims start getting examined — keep the invoice and the credit advice as a pair.",
          "One folder per client project: invoice, payment record, and (if it arrives) the FIRC — the habit costs minutes per receipt and saves a tax-season scramble.",
          "If the bank queries the source of a credit, the invoice-plus-FIRC pair answers it; a $1,000 credit without an invoice invites the question.",
          "44ADA lets eligible freelancers declare 50% of gross receipts as profit without full bookkeeping — the documentation habit keeps the 50% claim defensible.",
        ],
      },
      {
        type: "h2",
        text: "Which channel should you pick?",
      },
      {
        type: "ul",
        items: [
          "Direct client, you choose → Wise or Revolut (within ₹20 of each other here) — give them your USD account details for an ACH payment and convert when you like.",
          "Client insists on PayPal → acceptable at this size: the ~3.5% gap is a rounding-error class cost on one payment, and the client-friction saving is real.",
          "Marketplace balance → withdraw through the platform's rails (usually Payoneer), but check the corridor rate before confirming — it moves the outcome by up to 3%.",
          "Bank wire → only when the client's bank requires it; it is the worst row in the table at every size.",
        ],
      },
      {
        type: "h2",
        text: "Run your own numbers",
      },
      {
        type: "p",
        text: "The table is a fixed snapshot — run your exact amount through the Cross-Border FX Estimator, and compare against the full fee index for the $500 and $5,000 companion scenarios.",
      },
      {
        type: "p",
        text: "Editorial note: figures are computed from the site's published fee models and ₹95.40/USD snapshot (2026-08-12) — the same inputs as the FX estimator. Platform payout rails, Payoneer corridors, and bank practices vary; this is editorial guidance, not tax or legal advice.",
      },
    ],
  },
  {
    slug: "gusto-vs-adp-vs-paychex-us-payroll",
    author: "FinTech Atlas editorial team",
    title: "Gusto vs ADP vs Paychex for US payroll",
    description:
      "US payroll for global teams: contractor payments, W-2 tax filing, benefits, and PEO options across Gusto, ADP, and Paychex — and when an Indian company actually needs them.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payroll",
    relatedCompanySlugs: ["gusto", "adp", "paychex"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india", "receiving-1000-usd-from-us-client-in-india", "brex-vs-relay-business-banking"],
    ctas: [
      { slug: "gusto", label: "Visit Gusto", placement: "compare-vs" },
      { slug: "adp", label: "Visit ADP", placement: "compare-vs" },
      { slug: "paychex", label: "Visit Paychex", placement: "compare-vs" },
    ],
    body: [
      {
        type: "p",
        text: "If you are hiring in the US — contractors or employees — the choice comes down to Gusto for first-time employers and small teams (the smoothest self-serve setup and transparent per-person pricing), ADP for scale and multi-state compliance (the deepest capability, quote-based), and Paychex for SMBs that want a human account manager. One honest caveat for Indian companies: none of the three is required to pay a US contractor — contractor payments are the only feature that matters at that stage, and the receiving-money guides on this site cover cheaper direct rails.",
      },
      {
        type: "p",
        text: "Editorial note: plans, per-person fees, and features vary by state, headcount, and contract; everything here is the 2026 catalog vintage and educational guidance, not tax or legal advice.",
      },
      { type: "h2", text: "Capability at a glance" },
      {
        type: "table",
        headers: ["Capability", "Gusto", "ADP", "Paychex"],
        rows: [
          ["Contractor payments (1099)", "Yes — self-serve, per-contractor fee", "Yes — via Run and TotalSource", "Yes — via Flex"],
          ["W-2 payroll + tax filing", "Yes, all 50 states", "Yes, all 50 states", "Yes, all 50 states"],
          ["Benefits administration", "Yes (medical, 401(k), commuter)", "Yes, incl. large-plan HR tools", "Yes, guided setup"],
          ["Pricing model", "Flat per-person monthly", "Quote-based, tiered", "Entry plan + quote tiers"],
          ["Global / EOR", "Gusto Global (international contractor payments)", "TotalSource PEO", "PEO via Flex"],
          ["Best for", "First-time employers, small teams", "Mid-market to enterprise", "SMBs wanting an account manager"],
        ],
      },
      { type: "h2", text: "Contractor payments: the India-relevant part" },
      {
        type: "ul",
        items: [
          "US companies pay international contractors through payroll platforms like Gusto (a per-contractor monthly fee); the platform files 1099-NEC paperwork only for US payees — foreign contractors are paid without US tax withholding.",
          "If you are the Indian contractor on the receiving side, the payment lands like any other USD receipt — the receiving-$500 and receiving-$1,000 guides compare the rails (Wise, Payoneer, bank wire) that decide what you actually keep.",
          "Contractor vs employee classification (1099 vs W-2) carries real misclassification risk in the US, and payroll platforms won't decide it for you — get professional advice if a worker looks like a full-time employee.",
        ],
      },
      { type: "h2", text: "Which to pick" },
      {
        type: "ul",
        items: [
          "You hire a few US contractors and no employees → Gusto, or skip payroll software entirely and pay through the transfer rails in our receiving-money guides.",
          "You hire your first US W-2 employee → Gusto; setup is self-serve and the tax-filing workflow is the easiest to start.",
          "You scale past roughly 20 employees or go multi-state → ADP; the compliance surface (state registrations, tax calendars) is the deepest.",
          "You want a named account manager to lean on → Paychex; its service model is the most relationship-driven.",
        ],
      },
      {
        type: "p",
        text: "All three are legitimate; the differentiators are size, state count, and how much hand-holding you want. None of them is required to pay a US contractor — compare the direct rails in the receiving-money guides first.",
      },
    ],
  },
  {
    slug: "brex-vs-relay-business-banking",
    author: "FinTech Atlas editorial team",
    title: "Brex vs Relay: business banking for startups",
    description:
      "Corporate cards and rewards vs free business checking: which US business-banking stack fits a VC-backed startup, and which fits a bootstrapped SMB.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Business Banking",
    relatedCompanySlugs: ["brex", "relay"],
    relatedArticleSlugs: ["best-neobanks-2026", "best-payment-gateway-small-business", "gusto-vs-adp-vs-paychex-us-payroll", "cash-app-vs-venmo"],
    ctas: [
      { slug: "brex", label: "Visit Brex", placement: "compare-vs" },
      { slug: "relay", label: "Visit Relay", placement: "compare-vs" },
    ],
    body: [
      {
        type: "p",
        text: "Brex and Relay both run the app-first business-banking model, but they target different companies. Brex is built for venture-backed startups: corporate cards with spend limits and rewards plus cash management, priced around your spend rather than a monthly fee. Relay is built for bootstrapped SMBs: free business checking with up to 20 sub-accounts, high-yield savings, and per-account debit cards, with no monthly fees or minimums. Choose Brex if you're raising and want cards plus rewards; choose Relay if you want free, well-organized banking without upsells.",
      },
      {
        type: "p",
        text: "Editorial note: both are US-market products — an India-registered company typically needs a US entity (EIN) to open either. Fees, APYs, and features change; this is the 2026 catalog vintage and educational guidance, not financial advice.",
      },
      { type: "h2", text: "Capability at a glance" },
      {
        type: "table",
        headers: ["Capability", "Brex", "Relay"],
        rows: [
          ["Monthly fee", "None on core checking", "None — the free plan is the flagship"],
          ["Accounts", "Business checking + cash management", "Business checking + high-yield savings"],
          ["Cards", "Corporate charge cards with rewards", "Debit cards per sub-account"],
          ["Target customer", "VC-backed startups", "Bootstrapped SMBs"],
          ["Expense tools", "Spend limits, approvals, accounting export", "Sub-accounts, roles, receipt capture"],
          ["International payments", "Available (FX on business balances)", "US-focused — verify current coverage"],
        ],
      },
      { type: "h2", text: "Which to pick" },
      {
        type: "ul",
        items: [
          "You're a venture-backed startup raising rounds → Brex; rewards and cash-management features scale with spend.",
          "You're a bootstrapped SMB with simple needs → Relay; free sub-accounts keep tax, rent, and opex buckets cleanly separated.",
          "You need corporate cards with granular per-employee limits → Brex.",
          "You want multiple accounts without paying for them → Relay.",
          "Neither replaces payroll software — the Gusto vs ADP vs Paychex guide covers paying people; and an Indian company paying only US contractors doesn't need US business banking at all.",
        ],
      },
      {
        type: "p",
        text: "The decision is funding stage, not feature count: Brex is a spend-management platform for companies that are scaling fast; Relay is free banking for companies that want to stay lean.",
      },
    ],
  },
  {
    slug: "stablecoins-for-cross-border-payments",
    author: "FinTech Atlas editorial team",
    title: "USDC vs bank wire: receiving USD in India",
    description:
      "How stablecoin rails (USDC) compare with Wise, Payoneer, and bank wires for receiving USD in India — fees, speed, and the regulatory caveats that matter.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["circle", "coinbase"],
    relatedArticleSlugs: ["quarterly-india-cross-border-fee-index", "international-payment-settlement-times", "receiving-5000-usd-from-us-client-in-india", "how-to-send-money-abroad-cheap", "receiving-payments-from-latin-america-in-india"],
    ctas: [
      { slug: "circle", label: "About USDC", placement: "compare-vs" },
      { slug: "coinbase", label: "Coinbase on-ramp", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/remittance", label: "Compare bank rails" },
    body: [
      {
        type: "p",
        text: "If you are weighing stablecoin rails against the usual ways to receive USD in India, the honest headline is: USDC can be faster (24×7 settlement, no bank hours) and structurally cheaper on large sums, but it carries regulatory, tax, and documentation caveats that Wise, Payoneer, and bank wires simply do not — so it is a complementary rail for specific situations, not the default. Use it for large one-off receipts, weekend-urgent transfers, or payers who already hold USDC; use bank rails for routine receipts where you want a FIRC and the least paperwork.",
      },
      {
        type: "p",
        text: "Editorial note: crypto regulation in India remains unsettled and exchange spreads move; everything here is the 2026 catalog vintage and educational guidance, not tax or legal advice. Verify current rules and quoted spreads before your first transfer.",
      },
      { type: "h2", text: "How a USDC transfer actually works" },
      {
        type: "p",
        text: "A USDC transfer is three legs, and the total cost is the sum of all three: on-ramp — you buy USDC with USD at an exchange such as Coinbase, paying the exchange's spread (typically a fraction of a percent to ~1%, depending on venue and order size); send — the USDC moves on-chain to your own wallet for a network fee that ranges from cents on Solana or TRON to a few dollars on Ethereum L1 during congestion; off-ramp — you convert USDC back to INR at an exchange's INR market or via a P2P marketplace, paying another spread plus a withdrawal fee. The bank rails in the site's fee index do all of this in one step — which is why their headline percentage often beats a naive reading of 'zero-fee crypto'.",
      },
      { type: "h2", text: "Capability at a glance" },
      {
        type: "table",
        headers: ["Capability", "USDC rail", "Wise", "Payoneer", "Bank wire"],
        rows: [
          ["Fee model", "On/off-ramp spreads (typ. ~0.1–1% per leg) + network fee", "0.43% + $0.50", "1–4% corridor, in-spread", "$35 flat + 4.5% margin (illustrative)"],
          ["FX markup", "Whatever the exchange's INR market quotes", "0% — mid-market", "1–4%", "≈ 4.5% (illustrative)"],
          ["Settlement time", "Minutes–hours, 24×7", "Minutes–hours", "1–2 business days", "2–5 business days (SWIFT)"],
          ["FIRC / bank documentation", "None — no AD bank involved", "Bank-dependent", "Bank-dependent", "Yes (SWIFT)"],
          ["Regulatory friction (India)", "Highest — unsettled rules", "Low", "Low", "Low"],
          ["Dispute / refund recourse", "None on-chain", "Provider support", "Provider support", "Bank + correspondent chain"],
        ],
      },
      { type: "h2", text: "Where the costs actually land" },
      {
        type: "ul",
        items: [
          "At $500, Wise lands ≈ ₹47,447 at the index's ₹95.40 snapshot, and a USDC round trip with ~1% total spread lands within a similar band — at this size the differentiator is speed and 24×7 availability, not price.",
          "At $5,000, percentage fees dominate: Wise charges ≈ $22 (0.43% + $0.50), the illustrative wire costs $35 plus a 4.5% margin, and a USDC trip with a tight ~0.3–0.5% total spread lands within a hair of Wise — far ahead of the wire. This is where the rail becomes worth benchmarking.",
          "The quoted exchange rate is the hidden variable on both sides: an illiquid USDC→INR market can carry a wide spread, exactly like Payoneer's 1–4% corridor — always compare the quoted INR against the mid-market rate before converting (the exchange-rate markup calculator does this for any rate you are offered).",
          "Network choice matters: sending on Ethereum L1 during congestion can cost more than Wise's whole fee; Solana, TRON, and Base-style networks typically settle in cents — the address you give a sender decides the fee.",
        ],
      },
      { type: "h2", text: "India-specific caveats" },
      {
        type: "ul",
        items: [
          "As of the catalog vintage, India taxes crypto (VDA) gains at 30% under Section 115BBH and applies 1% TDS on VDA transfers above the threshold under Section 194S — neither applies to a plain foreign-exchange receipt through a bank, which is a real paperwork difference.",
          "The Reserve Bank of India has repeatedly cautioned against cryptocurrencies, and banks have at times restricted crypto-related flows; the legal position has shifted before and can shift again — the primary reason this rail is not the default.",
          "A USDC receipt produces no FIRC — only an authorised-dealer bank issues FIRCs. Exporters and GST claimants who rely on FIRC-based documentation must treat crypto receipts as a documentation gap and take professional advice (the FIRA vs FIRC guide covers what bank channels do issue).",
          "Whether a cross-border crypto receipt is a current-account or capital-account transaction under FEMA is unsettled — do not rely on this guide for compliance; get professional advice before using the rail for business receipts.",
        ],
      },
      { type: "h2", text: "When USDC wins" },
      {
        type: "ul",
        items: [
          "Large one-off receipts ($5,000+) where percentage fees dominate the total cost — benchmark it against the estimator's bank-rail results at your exact amount.",
          "Weekend or same-hour urgency — crypto rails run 24×7 while SWIFT, FX markets, and bank processing pause (see the settlement-times guide).",
          "A payer who already holds USDC — the on-ramp leg disappears and the trip is network fee plus off-ramp spread.",
          "Diversifying away from a single corridor or a provider's freeze risk.",
          "A payer in a high-inflation corridor (for example Argentina) who already lives in stablecoins — USDC sidesteps the devaluation window between invoice and settlement; the Latin America guide walks that corridor end to end.",
        ],
      },
      { type: "h2", text: "When bank rails win" },
      {
        type: "ul",
        items: [
          "Routine, smaller receipts where the fee difference is noise and settled rules are worth more than a percent or two.",
          "Any business receipt with GST-export or DTAA documentation needs — bank rails produce the certificates; crypto rails produce none.",
          "If you have no existing crypto setup — the onboarding, KYC, and learning cost is real, and the savings may not pay for it.",
          "Regulatory comfort — the bank rails' rules are settled; crypto's are not.",
        ],
      },
      { type: "h2", text: "Which to pick" },
      {
        type: "ul",
        items: [
          "First transfer, small amount, documentation matters → Wise or Payoneer per the fee index — nothing else to set up.",
          "Large or urgent receipt, technically comfortable, documentation not a blocker → benchmark a USDC rail with a tight-spread exchange against the estimator's numbers before deciding.",
          "Everything in between → run your amount through the Cross-Border FX Estimator for the bank rails, then compare the exchange's quoted USDC→INR spread — the decision should be a number comparison, not a vibe.",
        ],
      },
      {
        type: "p",
        text: "Neither rail is universally better: USDC's edge is speed and the structure of its fees; bank rails' edge is settled rules and paperwork. The calculators on this site quantify the bank side; the stablecoin side has no published schedule by design — always compute from the live quoted spread.",
      },
    ],
  },
  {
    slug: "cash-app-vs-venmo",
    author: "FinTech Atlas editorial team",
    title: "Cash App vs Venmo: US peer-to-peer payments",
    description:
      "The two dominant US P2P apps compared — personal and business fees, cards, speed, and why neither is built for receiving international payments into India.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["cash-app", "venmo", "paypal"],
    relatedArticleSlugs: ["best-neobanks-2026", "brex-vs-relay-business-banking", "how-to-send-money-abroad-cheap", "receiving-500-usd-from-us-client-in-india", "plaid-vs-indias-account-aggregator"],
    ctas: [
      { slug: "cash-app", label: "Visit Cash App", placement: "compare-vs" },
      { slug: "venmo", label: "Visit Venmo", placement: "compare-vs" },
    ],
    body: [
      {
        type: "p",
        text: "Cash App and Venmo are the two dominant US person-to-person payment apps, and for someone living in the US the honest difference is: Venmo for social, widely-adopted payments between people (it is PayPal's consumer app and the default among US millennials); Cash App for a more banking-like experience — debit card, direct deposit, bitcoin — with cheaper business-payment fees. Neither supports India, INR, or cross-border transfers in any useful sense, so for receiving money from a US client into India they are the wrong tool entirely; the receiving-money guides cover the rails that actually work.",
      },
      {
        type: "p",
        text: "Editorial note: both are US-market consumer apps; fees and features change and vary by account state. This is the 2026 catalog vintage and educational guidance, not financial advice.",
      },
      { type: "h2", text: "Capability at a glance" },
      {
        type: "table",
        headers: ["Capability", "Cash App", "Venmo"],
        rows: [
          ["Personal transfers (bank-funded)", "Free", "Free"],
          ["Business / goods & services payments", "≈ 0.75% per payment (min $0.25)", "1.9% + $0.10"],
          ["Instant transfer to bank", "0.5–1.75% (varies by account)", "1.75% (min $0.25, max $25)"],
          ["Debit card", "Yes — Cash Card", "Yes — Venmo card"],
          ["Direct deposit", "Yes", "Yes"],
          ["Bitcoin", "Yes — buy/sell in app", "No"],
          ["Social feed", "Minimal", "Yes — the feed is the differentiator"],
          ["Parent company", "Block", "PayPal"],
          ["International availability", "US (+ limited UK)", "US only"],
        ],
      },
      { type: "h2", text: "The India angle: neither is for cross-border money" },
      {
        type: "ul",
        items: [
          "Both require a US phone number and a US bank account or card; neither supports INR or Indian banks.",
          "Workarounds — opening accounts through US intermediaries, or sending to a US contact to forward — violate both apps' terms and routinely end in frozen balances. The fee you avoid is not worth the principal you can lose.",
          "US P2P apps also create US reporting surface: 1099-K thresholds apply to business payments received through them.",
          "For an Indian freelancer paid by a US client, the correct comparison is Wise, Payoneer, PayPal, or a bank wire — the receiving-$500 guide works the numbers at the amount most freelancers start with.",
          "Both apps link your US bank account through data-sharing APIs of the Plaid kind — the Plaid vs India's Account Aggregator guide explains that layer and why India built a consent-based counterpart instead.",
        ],
      },
      { type: "h2", text: "Which to pick" },
      {
        type: "ul",
        items: [
          "You live in the US and pay friends, rent, or group expenses → Venmo; its feed and adoption make it the path of least resistance.",
          "You live in the US and want one app for payments, a card, direct deposit, and bitcoin → Cash App.",
          "You run a small US business taking in-app payments → compare the business fee: Cash App's ~0.75% beats Venmo's 1.9% + $0.10 at most ticket sizes (verify current rates).",
          "You are an Indian freelancer or business receiving USD → neither; use the receiving guides instead.",
        ],
      },
      {
        type: "p",
        text: "The choice matters only inside the US. Once money has to cross a border, both apps step out of the picture — and the exchange-rate markup calculator is the tool that exposes what the rails that do cross it actually cost.",
      },
    ],
  },
  {
    slug: "plaid-vs-indias-account-aggregator",
    author: "FinTech Atlas editorial team",
    title: "Plaid vs India's Account Aggregator",
    description:
      "Plaid connects US apps to 12,000+ banks; India's Account Aggregator framework does the same job with RBI-regulated consent. How the two compare and which one your product needs.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["plaid"],
    relatedArticleSlugs: ["best-neobanks-2026", "cash-app-vs-venmo"],
    ctas: [{ slug: "plaid", label: "Visit Plaid", placement: "compare-vs" }],
    body: [
      {
        type: "p",
        text: "Plaid and India's Account Aggregator (AA) framework solve the same underlying problem — letting a financial app read a user's bank data with permission — but from opposite ends of the regulatory spectrum. Plaid is a commercial US API company whose connections span 12,000+ financial institutions, powering account linking inside apps like Venmo, Cash App, and Betterment. India's AA framework is an RBI-regulated network of licensed Account Aggregators (NBFC-AA) that move consented financial data between banks (FIPs) and financial users (FIUs) without the user's credentials ever leaving the bank. Which one matters to you depends entirely on where your users' bank accounts are.",
      },
      {
        type: "p",
        text: "Editorial note: Plaid's product surface and the AA framework's participant coverage both evolve quickly; this is the 2026 catalog vintage and educational guidance, not regulatory or legal advice.",
      },
      { type: "h2", text: "What Plaid actually does" },
      {
        type: "ul",
        items: [
          "Auth — verifies a user's bank account in seconds and returns account details for initiating payments.",
          "Transactions — returns cleansed, categorized transaction history for budgeting, underwriting, and personal-finance apps.",
          "Identity — ties identity verification to bank-account ownership at KYC time.",
          "Transfer — initiates ACH and real-time payments from the linked account.",
          "It is the connective tissue behind most US fintech account linking: when a US app asks you to 'link your bank', Plaid-style APIs are usually doing the work.",
        ],
      },
      { type: "h2", text: "What India's Account Aggregator is" },
      {
        type: "ul",
        items: [
          "An RBI-regulated framework launched in 2021: licensed NBFCs (Account Aggregators) manage consent for financial-data sharing between banks and financial-information users.",
          "Consent-first by design — the user's credentials stay with the bank; the AA relays data only after explicit, revocable consent per purpose and duration.",
          "The Sahamati network connects AAs, banks (FIPs), and users (FIUs); participation has grown steadily but coverage across smaller banks and use cases is still uneven.",
          "RBI introduced a self-regulatory-organization (SRO) framework for the AA ecosystem in 2025, formalizing how the network governs itself.",
        ],
      },
      { type: "h2", text: "How they compare" },
      {
        type: "table",
        headers: ["Dimension", "Plaid", "India's AA framework"],
        rows: [
          ["Geographic reach", "US, Canada (+ expanding)", "India"],
          ["Regulator", "None (commercial company)", "RBI (NBFC-AA license)"],
          ["Connection model", "Credentials + API keys", "Consent-based, credential-free"],
          ["Typical data", "Balances, transactions, identity, payments", "Bank, insurance, tax (GSTN) data"],
          ["Who pays", "Apps pay per connection", "FIUs pay; users don't"],
          ["Best for", "US-facing fintech products", "India-facing fintech products"],
        ],
      },
      { type: "h2", text: "Why this matters for India" },
      {
        type: "ul",
        items: [
          "An Indian startup building for US users will almost certainly integrate Plaid (or a similar US aggregator) — the network effect of 12,000+ institutions is hard to bypass.",
          "An India-facing product reading bank data should plan around the AA framework instead: consent-based access, no credential handling, and a regulator-approved path.",
          "The two models are not interchangeable — a Plaid integration does not transfer to the AA ecosystem, and vice versa; the data-sharing contracts differ in consent semantics, liability, and certification.",
          "The neobanks and US P2P guides on this site sit on exactly this layer — the account linking they describe runs on Plaid-style APIs, and India's AA is the domestic counterpart.",
        ],
      },
      { type: "h2", text: "Which to pick" },
      {
        type: "ul",
        items: [
          "Your users' banks are in the US → integrate Plaid; it is the default path with the deepest institution coverage.",
          "Your users' banks are in India → plan around the AA framework; consent-based access is the sanctioned route and avoids credential risk entirely.",
          "You serve both → you will likely maintain both integrations; budget for two data contracts, not one.",
          "You are evaluating both for the first time → start with the one that matches your primary market, then add the other only when user demand justifies the second integration.",
        ],
      },
      {
        type: "p",
        text: "The honest summary: Plaid is a product you buy; India's AA framework is a regulation you join. Both exist to make bank data flow with permission — the right choice is decided by where the account holder's bank sits, not by the feature list.",
      },
    ],
  },
  {
    slug: "receiving-payments-from-latin-america-in-india",
    author: "FinTech Atlas editorial team",
    title: "How to get paid from Latin America in India",
    description:
      "Brazil, Argentina, and Mexico clients pay with PIX, Mercado Pago, and PicPay — but those rails stop at their border. The channels that actually reach an Indian bank account.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["mercado-pago", "picpay", "wise", "payoneer"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india", "stablecoins-for-cross-border-payments"],
    ctas: [
      { slug: "mercado-pago", label: "Visit Mercado Pago", placement: "compare-vs" },
      { slug: "picpay", label: "Visit PicPay", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/exchange-rate-markup-calculator", label: "Check FX markup" },
    body: [
      {
        type: "p",
        text: "If your client is in Brazil, Argentina, or Mexico, the honest headline is: they will pay you through local rails — PIX in Brazil, Mercado Pago QR codes and wallets across the region, PicPay for person-to-person in Brazil — and none of those rails reach an Indian bank account directly. You receive the money through a cross-border corridor (Wise, Payoneer, PayPal, or a bank wire) and the local payment is only the first leg. The practical difference versus US clients is that your client's 'pay' button points at a domestic wallet, so your invoice needs to route around that instead of assuming SWIFT or a USD transfer.",
      },
      {
        type: "p",
        text: "Editorial note: LatAm payment rails and corridor fees change often; this is the 2026 catalog vintage and educational guidance, not financial advice. Verify current availability and rates before quoting a client.",
      },
      { type: "h2", text: "How your LatAm client actually pays" },
      {
        type: "table",
        headers: ["Country", "Dominant rail", "How it works"],
        rows: [
          ["Brazil", "PIX", "Instant, typically free transfers between any Brazilian accounts, by key (phone, CPF, email) — the default way businesses pay"],
          ["Argentina", "Mercado Pago + bank transfer", "QR-code wallet payments and local bank transfers in ARS; Mercado Pago is ubiquitous"],
          ["Mexico", "SPEI + cards", "Instant interbank transfers (SPEI) plus card rails; Mercado Pago also operates locally"],
          ["All three", "Domestic only", "Every one of these rails settles within the country — none can push money across the border"],
        ],
      },
      { type: "h2", text: "The corridors that reach India" },
      {
        type: "ul",
        items: [
          "Wise — you get BRL account details; your Brazilian client pushes PIX to them, and you convert to INR at the mid-market rate with a transparent fee. Availability and exact BRL support depend on your Wise profile and region — check in-app before promising it to a client.",
          "Payoneer — the marketplace corridor: LatAm freelance platforms such as Workana pay out via Payoneer, and you withdraw to India in USD/INR. Receiving is $0; the withdrawal conversion carries a corridor spread (1–4% range, check the in-account rate).",
          "PayPal — works across LatAm and converts to INR, but the FX spread is typically the priciest option (≈ 3.5% plus fees) — fine for small amounts, expensive at scale.",
          "Bank wire (SWIFT) — always works if the client's bank offers it, but it is the slowest (2–5 business days) and carries double-ended fees plus the bank's FX margin; for a one-off large payment it can still be the cleanest paper trail.",
        ],
      },
      { type: "h2", text: "What the local wallets are for" },
      {
        type: "ul",
        items: [
          "Mercado Pago is Latin America's largest payments platform — the QR wallet your client scans in shops. It is not a receiving rail for an Indian freelancer; you cannot hold or withdraw INR through it.",
          "PicPay is Brazil's social P2P app with free person-to-person transfers. It settles in BRL domestically — useful to know when a Brazilian client offers to 'send it on PicPay', which only works if you have a Brazilian account.",
          "Think of these as the payment method your client is used to, not as a channel you can receive through — your invoice should specify the corridor you can actually collect on.",
        ],
      },
      { type: "h2", text: "Currency risk and quoting" },
      {
        type: "ul",
        items: [
          "ARS has a long history of devaluation, and BRL moves; quoting in local currency can erode your margin before the money lands.",
          "Quote in USD where the client can pay USD — it moves the FX risk to them and keeps your income stable in INR terms.",
          "If the client can only pay in local currency, price in enough margin to absorb a 5–10% move and convert promptly rather than holding the balance.",
          "For high-inflation corridors, some clients already hold USDC and can pay that way — the stablecoin guide covers the India-side tax and documentation caveats before you accept it.",
        ],
      },
      { type: "h2", text: "FIRC, records, and tax" },
      {
        type: "p",
        text: "Whatever the corridor, a receipt into your Indian bank account is recorded under FEMA like any other foreign receipt, and the documentation habits are identical to the US-receiving guides: keep the credit advice, request a FIRC when you need one, and treat the amount as business income (Section 44ADA presumptive taxation applies when eligible). The receiving-$500 guide walks through the full playbook at a worked amount — the corridor changes, the paperwork does not.",
      },
      { type: "h2", text: "Which to pick" },
      {
        type: "ul",
        items: [
          "Brazilian client paying in BRL → Wise with BRL details (if available on your profile): PIX is instant and Wise converts at mid-market.",
          "Work from LatAm freelance platforms (Workana and similar) → Payoneer: it is the rail the platform already uses, and receiving is $0.",
          "One-off large payment and the client has no corridor → SWIFT wire for the clean documentation trail, accepting the fees.",
          "Client insists on PayPal → accept for small amounts, but ask them to cover the fee or switch to a cheaper corridor once the relationship is established.",
          "Client holds USDC or the corridor is unstable → benchmark the stablecoin route against the bank rails before committing (see the stablecoin guide).",
        ],
      },
    ],
  },
  {
    slug: "best-payment-gateway-shopify-india",
    author: "FinTech Atlas editorial team",
    title: "Best payment gateway for Shopify India (2026)",
    description:
      "Shopify Payments is not available in India, so every Indian store pairs Shopify with a third-party gateway. Razorpay, Cashfree, Paytm, PayPal, and Braintree compared for UPI, cards, and international buyers.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["razorpay", "cashfree", "paytm", "paypal", "braintree", "apple-pay"],
    relatedArticleSlugs: ["razorpay-vs-cashfree-for-ecommerce", "best-payment-gateway-small-business", "payment-gateway-fee-comparison-india"],
    ctas: [
      { slug: "razorpay", label: "Visit Razorpay", placement: "compare-vs" },
      { slug: "cashfree", label: "Visit Cashfree", placement: "compare-vs" },
      { slug: "paypal", label: "Visit PayPal", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/calculator", label: "Estimate gateway fees" },
    body: [
      {
        type: "p",
        text: "The first fact that shapes every Shopify decision in India: Shopify Payments — the built-in gateway that removes third-party fees elsewhere — is not available to India-registered merchants. Every Indian store therefore pairs Shopify with a separate gateway, pays that gateway's transaction fees, and also pays Shopify's third-party transaction fee unless a plan-level waiver applies. The actual choice is between Indian payment service providers (Razorpay, Cashfree, Paytm) for the UPI-first domestic checkout, and international processors (PayPal, and via it Braintree) when a large share of buyers pay in USD with cards.",
      },
      {
        type: "p",
        text: "Editorial note: gateway availability, fee schedules, and Shopify's own policies change often; this is the 2026 catalog vintage and educational guidance, not financial advice. Verify current availability and rates before onboarding.",
      },
      { type: "h2", text: "Why Shopify Payments doesn't settle this" },
      {
        type: "p",
        text: "Shopify Payments is powered by a third-party processor (Stripe) in the markets where it runs. India is not among them: Shopify directs Indian merchants to its supported third-party gateway list instead. The practical consequences: separate KYC and merchant onboarding with your gateway, settlements that follow the gateway's schedule (not Shopify's), and transaction fees charged by both Shopify and the gateway. That is why the gateway choice — not the Shopify plan — is the main cost lever for an Indian store.",
      },
      { type: "h2", text: "The gateways Indian Shopify stores actually use" },
      {
        type: "table",
        headers: ["Gateway", "Domestic rate (published)", "International cards", "Settlement", "Shopify fit"],
        rows: [
          ["Razorpay", "2% + 18% GST", "+1% surcharge", "T+2 typical", "Dedicated Shopify app; subscriptions, EMI, smart routing"],
          ["Cashfree Payments", "2% + 18% GST", "+0.99% surcharge", "Same/next-day options", "Official Shopify partner; strong plugin and payouts tooling"],
          ["Paytm Payment Gateway", "~2% + GST (published schedule)", "Premium/international cards higher", "T+1/T+2", "Shopify app; strong wallet + UPI presence"],
          ["PayPal (India)", "Cross-border pricing; no domestic MDR schedule", "3.5% + $0.49 (US-style schedule, India variants apply)", "Instant to ~1 day after capture", "PayPal Express on Shopify checkout"],
          ["Braintree (via PayPal)", "Not an India domestic gateway", "US-style card pricing, ~2.59% + $0.49 blended", "Daily", "Third-party gateway on Shopify's list; eligibility depends on PayPal onboarding"],
        ],
      },
      {
        type: "p",
        text: "The domestic 2% + 18% GST rows match the site's gateway fee calculator and the published India schedules — the calculator adds the GST line for you, so a ₹10,000 domestic card payment costs ₹200 in platform fee plus ₹36 GST, and you receive ₹9,764. International-card surcharges (Razorpay and Stripe India +1%, Cashfree +0.99%) apply on top of the domestic percentage for non-Indian cards.",
      },
      { type: "h2", text: "Wallets and Apple Pay at checkout" },
      {
        type: "ul",
        items: [
          "Apple Pay is not available in India — the wallet has never launched there. 2026 reports describe an expected launch later in the year, initially card-based without UPI, but as of this vintage it does not exist as a payment method for Indian buyers.",
          "International buyers can still pay with Apple Pay on a Shopify store: Shopify checkout presents the wallet when the gateway supports it. So an Apple-heavy US customer base is a reason to confirm your gateway's Apple Pay support rather than ignore the wallet.",
          "The Indian equivalent of the wallet moment is UPI: PhonePe, Paytm, Google Pay, and BHIM dominate checkout. UPI support is table stakes — the differentiator is whether the gateway routes UPI payments reliably (QR, intent flow, and auto-pay for subscriptions).",
        ],
      },
      { type: "h2", text: "Braintree as the third-party option" },
      {
        type: "p",
        text: "Braintree is PayPal's developer gateway — the API-first card processor behind many US and Canadian storefronts, and a long-standing third-party gateway on Shopify's supported list. For an Indian store it is relevant in exactly one scenario: a customer base that pays in USD with cards and wallets, where the store wants a dedicated card processor rather than PayPal's branded checkout. The caveats are real: Braintree onboarding for India-registered merchants runs through PayPal's regional entity and eligibility varies, there is no domestic INR schedule, and settlements land in a linked bank account rather than through Indian rails. For the UPI-first Indian checkout it is the wrong tool; for the US export storefront it is a genuine alternative to PayPal Express.",
      },
      { type: "h2", text: "Which to pick" },
      {
        type: "ul",
        items: [
          "Indian customers, UPI-heavy store, subscriptions or EMI → Razorpay: the dedicated Shopify app plus auto-pay, smart routing, and the same 2% + GST domestic schedule as its peers.",
          "Cash-flow-sensitive store → Cashfree: same-day/next-day settlement options and payout automation are the differentiators; an official Shopify partner with a mature plugin.",
          "Mostly international (USD) buyers → PayPal Express for simplicity, or Braintree via PayPal onboarding if you want the branded-less card checkout; accept the cross-border pricing on both.",
          "High average order value and premium cards → compare the international surcharge rows above — a +1% surcharge difference at ₹10,000 is only ₹100, but it compounds across your card mix.",
          "Evaluate the total, not the headline: Shopify's own third-party transaction fee plus gateway fee plus GST is what you actually pay — run the gateway fee calculator with your volume and card mix.",
        ],
      },
      {
        type: "p",
        text: "The gateway fee comparison guide covers the same published schedules across Razorpay, Cashfree, Stripe India, Paytm, and PhonePe in more detail, including the GST math and what the rate tables leave out.",
      },
    ],
  },
  {
    slug: "payment-gateway-fee-comparison-india",
    author: "FinTech Atlas editorial team",
    title: "Payment gateway fees compared: India (2026)",
    description:
      "What Indian merchants actually pay: platform fee plus 18% GST, international-card surcharges, and the costs the rate tables hide — Razorpay, Cashfree, Stripe India, Paytm, and PhonePe on the same schedule.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["razorpay", "cashfree", "stripe", "paytm", "phonepe"],
    relatedArticleSlugs: ["razorpay-vs-stripe-payments-india", "razorpay-vs-cashfree-indian-gateways", "payment-gateway-for-subscription-businesses", "best-payment-gateway-small-business", "quarterly-india-cross-border-fee-index", "best-payment-gateway-shopify-india"],
    ctas: [
      { slug: "razorpay", label: "Visit Razorpay", placement: "compare-vs" },
      { slug: "cashfree", label: "Visit Cashfree", placement: "compare-vs" },
      { slug: "stripe", label: "Visit Stripe India", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/calculator", label: "Estimate gateway fees" },
    body: [
      {
        type: "p",
        text: "The headline number Indian gateways advertise is a percentage — 2% — but what you actually pay is that percentage plus 18% GST on the fee, plus an international-card surcharge when the card is foreign, plus the costs that never appear in a rate table: settlement timing, refund and chargeback handling, monthly or annual plans, and interchange-plus contracts for high volume. This guide puts Razorpay, Cashfree, Stripe India, Paytm, and PhonePe on one schedule with the same math, so the comparison is apples to apples. It complements the head-to-head guides: this one is the fee structure itself, not a two-way feature comparison.",
      },
      {
        type: "p",
        text: "Editorial note: all rates are the published India schedules of the 2026 catalog vintage and are indicative only — high-volume merchants regularly negotiate interchange++ or custom pricing that materially differs. Verify the current schedule with the provider before planning around any figure.",
      },
      { type: "h2", text: "Fee anatomy" },
      {
        type: "table",
        headers: ["Component", "What it is", "Who charges it"],
        rows: [
          ["Platform fee (MDR)", "Percentage of the transaction value — the advertised 2%", "Gateway"],
          ["GST on the fee", "18% of the platform fee, not of the transaction — ₹36 on a ₹200 fee", "Gateway (pass-through)"],
          ["International surcharge", "Additional percentage for cards issued outside India", "Gateway"],
          ["Settlement & hold", "T+1 to T+3 payout timing, rolling reserves for high-risk categories", "Gateway"],
          ["Refund fees", "Many gateways refund the MDR; some do not, or charge per refund", "Gateway"],
          ["Setup / annual", "₹0 on standard plans; enterprise tiers can carry setup and annual fees", "Gateway"],
        ],
      },
      { type: "h2", text: "Published India schedules (same math applied)" },
      {
        type: "table",
        headers: ["Gateway", "Domestic platform fee", "Effective with 18% GST", "International cards", "Effective international"],
        rows: [
          ["Razorpay", "2%", "2.36%", "2% + 1% surcharge", "3.54%"],
          ["Cashfree Payments", "2%", "2.36%", "2% + 0.99% surcharge", "3.53%"],
          ["Stripe India", "2%", "2.36%", "2% + 1% surcharge", "3.54%"],
          ["Paytm Payment Gateway", "~2% (published schedule)", "~2.36%", "Premium and international cards priced higher", "Verify current"],
          ["PhonePe Payment Gateway", "Under 2% (recent entrant; merchant agreement)", "Below 2.36%", "International pricing per agreement", "Verify current"],
        ],
      },
      {
        type: "p",
        text: "The Razorpay, Cashfree, and Stripe India rows are the same schedules the site's gateway fee calculator runs — the calculator applies the GST line automatically, so any amount you compute there matches this table. Paytm and PhonePe rows are hedged because their schedules move with merchant agreements; treat the direction (at or near 2%, GST on top) as the planning assumption and confirm the number in onboarding.",
      },
      { type: "h2", text: "The GST math" },
      {
        type: "ul",
        items: [
          "GST applies to the platform fee, not the transaction: a ₹10,000 sale at 2% carries a ₹200 fee and ₹36 GST — total ₹236, or 2.36% effective. Quoting '2% plus GST' without the arithmetic understates your cost by a sixth.",
          "At ₹1,00,000 monthly volume the difference between 2% and 2.36% effective is ₹360 a month — small, but it is the same order as many settlement and plan differences, so it should be in the comparison.",
          "International cards take the effective rate past 3.5% at most Indian gateways: a ₹10,000 international-card sale costs ₹354 in fee plus GST. For export-facing stores the surcharge often exceeds the domestic fee difference between gateways.",
        ],
      },
      { type: "h2", text: "What the rate tables leave out" },
      {
        type: "ul",
        items: [
          "Settlement timing: T+1 at most gateways for Indian cards, but T+2 or rolling reserves for high-risk categories — the same 2% fee with a week of held cash flow is a different product.",
          "Refund economics: if the MDR is not refunded on refunded orders, a 10% return rate adds a hidden ~0.2% to your effective cost.",
          "Success rates: routing quality (smart routing, retries) moves conversion by more than the fee differences here; a 1% conversion gain beats a 0.3% fee saving for most stores.",
          "Custom pricing: interchange++ or flat-per-transaction contracts start being available around ₹10–25 lakh monthly volume — the published 2% is not the ceiling.",
        ],
      },
      { type: "h2", text: "Which to pick" },
      {
        type: "ul",
        items: [
          "Standard Indian checkout, no international exposure → any of the three published-schedule gateways; the fees are identical, so decide on settlement speed, UPI reliability, and support.",
          "International cards are a material share → compare the surcharge rows (3.53–3.54% effective) and check whether your gateway routes those cards at the advertised rate or requires a premium tier.",
          "High volume → ask every shortlist for interchange++ pricing before comparing published rates; the comparison above stops being relevant above roughly ₹10 lakh monthly.",
          "Subscriptions → add the auto-pay rails (UPI AutoPay, card eMandates) to the fee math — the subscription guide covers which gateways carry them and the setup timelines.",
          "Shopify store → the Shopify India guide applies these same schedules to the platform's third-party-gateway requirement.",
        ],
      },
      {
        type: "p",
        text: "Run your own volume and card mix through the gateway fee calculator — it computes the GST line and the international split for you, so the estimate matches the schedules above exactly.",
      },
    ],
  },
  {
    slug: "best-payment-method-upwork-india",
    author: "FinTech Atlas editorial team",
    title: "Best payment method for Upwork India (2026)",
    description:
      "Upwork's payout rails for India: Direct to Local Bank ($0.99) vs Payoneer's 1–4% corridor vs the USD two-step via Wise — plus the service fee that hits before withdrawal.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "paypal"],
    relatedArticleSlugs: ["best-payment-method-fiverr-india", "payoneer-fees-india", "receiving-1000-usd-from-us-client-in-india", "quarterly-india-cross-border-fee-index", "wise-vs-payoneer-business-payouts", "fira-vs-firc-payment-methods"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/exchange-rate-markup-calculator", label: "Measure the conversion markup" },
    body: [
      {
        type: "p",
        text: "Upwork's payment decision has two stages, and most fee guides only cover the second. Stage one is the service fee Upwork takes from every contract — the percentage you see when you bid is locked for that contract. Stage two is the withdrawal rail that moves your balance to India. The short version for 2026: the rail choice costs you 0% to roughly 4% of the money depending on who converts USD to INR for you, and the headline $0.99 bank fee is rarely the number that decides it.",
      },
      {
        type: "h2",
        text: "What Upwork takes before you withdraw",
      },
      {
        type: "p",
        text: "The Freelancer Service Fee ranges from 0% to 15% per contract and is fixed once the contract begins — the exact percentage is shown when a client sends an offer or you submit a proposal, and it stays on the contract details. Most marketplace contracts land at or near 10%, which is the figure the worked example below uses. Direct Contracts carry a reduced fee; Any Hire and Upwork Payroll contracts are excluded.",
      },
      {
        type: "ul",
        items: [
          "The fee is per contract and locked — a new client can be quoted a different percentage than a repeat client.",
          "If a payment is refunded, the service fee on the refunded portion comes back with it.",
          "Connects are the cost of proposing, not of getting paid — they do not touch the withdrawal.",
        ],
      },
      {
        type: "h2",
        text: "Withdrawal rails for India",
      },
      {
        type: "table",
        headers: ["Rail", "Withdrawal fee", "FX cost", "Speed", "Bottom line"],
        rows: [
          ["Direct to Local Bank", "$0.99 (+ possible incoming bank fee)", "Upwork's conversion — reported ~2–4% markup; the rate shown on screen is authoritative", "Within 4 business days", "Cheapest headline; min $5"],
          ["Payoneer", "Upwork's small per-transfer fee", "Payoneer's 1–4% INR corridor (fee-index model)", "2–5 business days to bank", "Same corridor as the fee index; consolidates with other marketplace balances"],
          ["Direct to US Bank (Wise two-step)", "Free ACH", "Wise: mid-market + ~0.43% + $0.50 (fee-index model)", "1–2 business days to Wise, then your choice", "Lowest FX cost; needs a Wise USD balance with US account details"],
        ],
      },
      {
        type: "p",
        text: "Direct to Local Bank is the default for good reason: $0.99 per withdrawal, a $5 minimum, and money within four business days. The catch is the conversion — Upwork sends INR, and the rate it applies carries a markup that 2026 reports put in the 2–4% range. Check the rate shown on your Get Paid screen before confirming: it, not the $0.99, decides the real cost of this rail.",
      },
      {
        type: "p",
        text: "The two-step trick costs nothing to try: link a Wise USD balance — Wise provides real US routing and account numbers — as your Direct to US Bank destination. Upwork sends the withdrawal as a free ACH transfer, no conversion happens at Upwork, and you convert inside Wise at the mid-market rate plus roughly 0.43% + $0.50, the same model the site's fee index publishes. The caveat: this route is designed for people with US banks, and whether your account can use it is decided by Upwork's Get Paid page, not by any guide.",
      },
      {
        type: "h2",
        text: "The $1,000 worked example",
      },
      {
        type: "p",
        text: "A $1,000 milestone at a 10% service fee leaves $900 to withdraw. Direct to Local Bank: $0.99 plus the conversion markup — at a 2–4% markup that is roughly $18–36 of the $900. Payoneer at the corridor's 2% midpoint: roughly $18. The Wise two-step: about $4.40. The spread between cheapest and most expensive rail is $15–30 on a single milestone — smaller than the service fee, but an order of magnitude larger than the $0.99 headline suggests. The markup calculator runs this arithmetic on any snapshot rate.",
      },
      {
        type: "h2",
        text: "Documents, not just money",
      },
      {
        type: "ul",
        items: [
          "Every withdrawal that lands in India is a foreign inward remittance — the bank's credit advice (or FIRC) paired with the Upwork invoice is the evidence file your CA will ask for.",
          "Export of services stays zero-rated under GST; marketplace payouts do not change that.",
          "The FIRA vs FIRC guide covers the bank-side formats — the same rules apply to marketplace credits.",
        ],
      },
      {
        type: "h2",
        text: "Which rail should you pick?",
      },
      {
        type: "ul",
        items: [
          "Small balances ($5–200) → Direct to Local Bank; the $0.99 flat beats every percentage option at this size even with the markup.",
          "Regular $1,000+ milestones → the Wise two-step if your Get Paid page offers it; otherwise Direct to Local Bank — just compare the conversion rate shown at withdrawal.",
          "You already use Payoneer for other marketplaces or receiving accounts → consolidate there; the corridor is the price of one balance and one conversion.",
          "Clients paying you directly, outside Upwork → that is a different decision entirely; the receiving guides and the fee index cover it.",
        ],
      },
      {
        type: "p",
        text: "Editorial note: service-fee range and rail mechanics above are from Upwork's official help center (accessed 4 August 2026); conversion markups are the site's fee-index models and 2026 reports. The fee percentage on your specific contract and the conversion rate shown on your Get Paid screen before you confirm are authoritative.",
      },
    ],
  },
  {
    slug: "best-payment-method-fiverr-india",
    author: "FinTech Atlas editorial team",
    title: "Best payment method for Fiverr India (2026)",
    description:
      "Fiverr pays in USD only — PayPal, bank transfer via Payoneer, or a Payoneer account. The 20% commission, the 14-day clearance, and which withdrawal rail wins for INR.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["payoneer", "paypal"],
    relatedArticleSlugs: ["best-payment-method-upwork-india", "payoneer-fees-india", "receiving-1000-usd-from-us-client-in-india", "quarterly-india-cross-border-fee-index", "fira-vs-firc-payment-methods", "paypal-vs-payoneer-india"],
    ctas: [
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
      { slug: "paypal", label: "Visit PayPal", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/exchange-rate-markup-calculator", label: "Measure the withdrawal markup" },
    body: [
      {
        type: "p",
        text: "Fiverr's money flow has three stages that matter for India: the 20% commission on every order, the clearance period before earnings become withdrawable, and the withdrawal rail that converts USD to INR. Fiverr pays only in USD — there is no INR rail — so the conversion markup is baked into your choice of withdrawal method. The short version for 2026: bank transfer via Payoneer is the standard pick, PayPal wins only where minimums bind, and the Payoneer account option is worth its $3 when you want to time the conversion yourself.",
      },
      {
        type: "h2",
        text: "The 20% commission comes first",
      },
      {
        type: "p",
        text: "Fiverr keeps a flat 20% of every completed order — including extras and tips — before anything reaches your earnings balance. There are no tiers and no volume discounts. On a $100 order you can withdraw $80, and the withdrawal math below starts from that net.",
      },
      {
        type: "ul",
        items: [
          "The commission applies per order at completion, including tips.",
          "Cancellations and refunds reverse the commission on the refunded amount.",
          "Fiverr's buyer-side service fee is paid by the client, not by you — it is not a seller cost.",
        ],
      },
      {
        type: "h2",
        text: "Clearance: 14 days, or 7",
      },
      {
        type: "p",
        text: "Earnings become withdrawable only after a clearance period from order completion: 14 days for most sellers, 7 days for Top Rated, PRO, and Seller Plus Premium sellers. That is the platform's cash-flow tax — budget for it even when the client pays instantly.",
      },
      {
        type: "h2",
        text: "Withdrawal methods, per Fiverr's own table",
      },
      {
        type: "table",
        headers: ["Method", "Fee", "Minimum", "Timing", "INR path"],
        rows: [
          ["PayPal", "$0", "$1", "24 hours", "Convert and withdraw inside PayPal — its conversion markup applies"],
          ["Bank transfer (via Payoneer)", "$1", "$20", "1–3 business days local currency; 5–7 days USD wire", "Payoneer converts at its 1–4% corridor"],
          ["Payoneer account", "$3", "$10", "Up to 2 business days", "Hold USD in Payoneer, convert when you choose"],
          ["Fiverr Revenue Card", "$1–$3", "$30", "Up to 2 business days", "Discontinued December 2022 — existing cardholders only"],
        ],
      },
      {
        type: "p",
        text: "Two official caveats shape the decision. First, Fiverr sends the full amount you withdraw; the provider's conversion is the only place money is lost — the help center says so explicitly. Second, withdrawals cap at $5,000 per transaction, and waiting periods apply (24 hours after the first withdrawal or a method change, 48 hours after a phone-number update), which catches sellers who switch methods mid-flow.",
      },
      {
        type: "h2",
        text: "What each rail actually costs in INR",
      },
      {
        type: "ul",
        items: [
          "Bank transfer via Payoneer ($1) is the default: on a $100 withdrawal the fee is 1%, and the conversion runs through the same 1–4% corridor the site's fee index tracks for Payoneer.",
          "PayPal is free to withdraw to but converts at PayPal's own markup — the fee index models it around 3.5%, i.e. roughly $3.50 hidden in the rate on $100. It beats the $1 rail only at balances where the $20 bank-transfer minimum binds.",
          "The Payoneer account option ($3, $10 minimum) is the FX-timing play: keep the USD in Payoneer and convert when the rate suits you — the same hold-and-time decision the $5,000 guide discusses for EEFC accounts, without the bank account.",
          "The USD wire (5–7 days) exists for sellers who want dollars at their own bank; it is slower than the local-currency option and still costs $1.",
        ],
      },
      {
        type: "h2",
        text: "Fiverr vs Upwork in one paragraph",
      },
      {
        type: "p",
        text: "The two platforms differ more in the earning stage than the withdrawal stage: Upwork's service fee is typically 10% and locked per contract, Fiverr's is a flat 20%. The rails are similar — Payoneer dominates both — but Fiverr adds the clearance delay and Upwork adds a cheaper bank rail ($0.99 direct to your Indian bank). The Upwork guide's rail logic applies here too: compare the conversion, not the headline fee.",
      },
      {
        type: "h2",
        text: "Documents",
      },
      {
        type: "ul",
        items: [
          "Fiverr credits are foreign inward remittances like any other export earning — keep the withdrawal record paired with your Fiverr invoice for the FIRC or credit-advice file.",
          "Export of services is zero-rated under GST; the FIRA vs FIRC guide covers the bank-side paperwork.",
        ],
      },
      {
        type: "h2",
        text: "Which should you pick?",
      },
      {
        type: "ul",
        items: [
          "Most India sellers → bank transfer via Payoneer: $1, $20 minimum, INR in 1–3 business days.",
          "Balances under $20 → wait for the bank-transfer minimum, or use PayPal if you already hold a USD balance there — the $1 rail cannot start below its floor.",
          "Large, infrequent conversions → the Payoneer account: pay $3, hold USD, convert when the rate is right.",
          "You need USD at your own bank (an EEFC plan, for example) → the USD wire, and accept the 5–7 day wait.",
        ],
      },
      {
        type: "p",
        text: "Editorial note: fees and timings above are from Fiverr's official help center (accessed 4 August 2026); conversion markups are the site's fee-index models (Payoneer 1–4% corridor, PayPal ~3.5%) and can differ at the moment of withdrawal. The rate shown in your provider account before you confirm is authoritative.",
      },
    ],
  },
  {
    slug: "paypal-vs-payoneer-india",
    author: "FinTech Atlas editorial team",
    title: "PayPal vs Payoneer India (2026)",
    description:
      "PayPal India's receiving schedule — 4.4% + $0.30, then a 3% conversion — vs Payoneer's $0 receiving accounts and 1–4% corridor, priced with a $1,000 worked example.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["paypal", "payoneer", "wise"],
    relatedArticleSlugs: ["best-way-to-receive-usd-in-india", "payoneer-fees-india", "receiving-1000-usd-from-us-client-in-india", "wise-vs-payoneer-business-payouts", "best-payment-method-fiverr-india"],
    ctas: [
      { slug: "paypal", label: "Visit PayPal", placement: "compare-vs" },
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/exchange-rate-markup-calculator", label: "Measure the conversion markup" },
    body: [
      {
        type: "p",
        text: "PayPal and Payoneer are the two classic rails for getting paid from abroad into India without a bank wire, and they price the same journey completely differently. PayPal charges on the way in — 4.4% plus a fixed fee on every international receipt, then 3% when you convert — so a $1,000 payment costs roughly 7% before it is INR. Payoneer charges on the way out: receiving is usually $0, and the exit to INR runs on a 1–4% corridor. The 2026 short version: Payoneer wins wherever you can choose the rail, PayPal wins only where the client insists on it.",
      },
      {
        type: "h2",
        text: "How PayPal India prices a receipt",
      },
      {
        type: "p",
        text: "PayPal India's official merchant schedule (fee page updated 28 March 2024) applies 4.40% plus a fixed fee to every international commercial receipt — $0.30 for USD, ₹3.00 for INR. There is no domestic rail: PayPal India accounts only support international payments, so this rate hits every payment a freelancer receives, personal or business account. On a $1,000 receipt the fee is $44.30 before anything else.",
      },
      {
        type: "p",
        text: "The conversion is the second layer. Converting a balance or payments received into another currency costs 3.0% above the base exchange rate (India consumer fees page). Withdrawing to your linked bank is free on the standard schedule, but Indian bank accounts settle in INR, so the 3% conversion applies on the way out either way — and 18% GST applies on PayPal's fees for Indian accounts (2026 industry sources). Net on $1,000: $44.30 fee, then the remaining $955.70 converts at roughly 3% above base — about $927 lands in INR, near ₹88,436 at the site's ₹95.40 snapshot.",
      },
      {
        type: "h2",
        text: "How Payoneer India prices a receipt",
      },
      {
        type: "p",
        text: "Payoneer's published India pricing (updated June 2026) is the mirror image: receiving accounts in your local currency are free, non-local receiving accounts cost a fixed fee or 1%, US ACH bank debits cost 1%, and card-funded payment requests cost 2.90% + $0.49. Marketplace payouts are priced by each marketplace, not by Payoneer. The exit is the real cost: converting a USD balance to INR runs 1–4% of the amount depending on the corridor, and for India-based users withdrawals to the linked bank are automatic within 48 hours.",
      },
      {
        type: "p",
        text: "Two structural notes. First, the annual account fee of $29.95 applies only if you receive under $6,000 in any 12 consecutive months — most working freelancers never see it. Second, Payoneer's India operations run under the RBI's Payment Aggregator – Cross Border (PA-CB) framework that replaced the older OPGSP regime (per January 2026 industry sources; treat as context, not advice). Net on $1,000: $0 receiving fee, then the corridor — at the 2% midpoint $980 lands, about ₹93,492; at 1%, ₹94,446.",
      },
      {
        type: "h2",
        text: "The $1,000 worked example",
      },
      {
        type: "table",
        headers: ["Rail", "Receiving fee", "Conversion", "Net (₹95.40 snapshot)"],
        rows: [
          ["PayPal", "4.4% + $0.30 (≈ $44.30)", "3.0% above base (official)", "≈ ₹88,436"],
          ["Payoneer — 2% corridor midpoint", "$0", "1–4% corridor (2% shown)", "≈ ₹93,492"],
          ["Payoneer — 1% corridor", "$0", "1% corridor", "≈ ₹94,446"],
          ["Wise (benchmark)", "≈ $0 via ACH", "0.43% + $0.50 (fee-index model)", "≈ ₹94,942"],
        ],
      },
      {
        type: "p",
        text: "The gap between PayPal and Payoneer's midpoint is roughly ₹4,400 on this $1,000 — about 5.3 percentage points of the payment — and Wise's benchmark sits a further ₹1,300 ahead. The same arithmetic scales: the receiving fee and the conversion are both percentages, so the ₹ gap grows with every dollar, which is why recurring freelancers should treat PayPal as a last resort rather than a habit.",
      },
      {
        type: "h2",
        text: "Where PayPal genuinely wins",
      },
      {
        type: "ul",
        items: [
          "The client insists — PayPal's email-payment habit and buyer protections make it the path of least resistance with US clients who are not payment-savvy. On a one-off small receipt the absolute loss is the cost of keeping the client; the receiving guides reach the same conclusion.",
          "You want to hold USD — PayPal lets you keep the balance in dollars and convert when you choose; Payoneer's India accounts auto-withdraw within 48 hours, so the exit timing is theirs, not yours.",
          "The conversion timing is worth more than the fee — if you are deliberately waiting for a better rate, PayPal's hold-and-convert model is a feature, priced at 3% per conversion.",
        ],
      },
      {
        type: "h2",
        text: "What the fee index models (and why this guide differs)",
      },
      {
        type: "p",
        text: "The site's calculator and fee-index tables model PayPal with its send-side schedule — roughly $4.99 flat plus a ~3.5% spread — for cross-provider comparisons. Receiving is priced differently by PayPal itself: 4.4% + $0.30 on the way in, then 3.0% on the conversion. This guide prices the actual receive flow; the cross-provider tables keep the send-side model for consistency. When you see PayPal in a receiving comparison on this site, the real receive-side cost is the higher one.",
      },
      {
        type: "h2",
        text: "Which should you pick?",
      },
      {
        type: "ul",
        items: [
          "Marketplace payouts (Upwork, Fiverr, and most platforms) → Payoneer. The platform rails already route through it, and the corridor is the price of one balance and one conversion — the platform-specific math is in the Upwork and Fiverr guides.",
          "Recurring direct clients, and you can choose the method → neither, if you can help it: a Wise USD balance costs ~0.5% total and is the benchmark in the table. Payoneer is the fallback that keeps client friction near zero.",
          "Client insists on PayPal → accept and price it consciously: ~7% at $1,000. Below roughly $300 the absolute loss is small enough to be the cost of doing business; above that, asking for a bank transfer or Wise payment is worth ₹4,000+ per receipt.",
          "Large one-off receipts → neither rail; the EEFC and wire math lives in the $5,000 guide.",
        ],
      },
      {
        type: "p",
        text: "Editorial note: PayPal figures are from PayPal India's official consumer and merchant fee pages (consumer page updated 31 May 2021, merchant page 28 March 2024 — both live at access on 4 August 2026); Payoneer figures from its India pricing page (updated 18 June 2026). The ₹95.40 snapshot is the FX estimator's 2026-08-12 rate. GST treatment is per 2026 industry sources. The fee shown in your account before you confirm a transaction is authoritative.",
      },
    ],
  },
  {
    slug: "best-way-to-receive-usd-in-india",
    author: "FinTech Atlas editorial team",
    title: "Best way to receive USD in India (2026)",
    description:
      "The decision map for getting paid in USD from US clients: Wise USD details, Payoneer, PayPal, bank wire, USDC and EEFC — routed by who pays, how much, and how often, with links to the deep dives.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "paypal", "payoneer"],
    relatedArticleSlugs: ["paypal-vs-payoneer-india", "receiving-500-usd-from-us-client-in-india", "receiving-1000-usd-from-us-client-in-india", "receiving-5000-usd-from-us-client-in-india", "payoneer-fees-india", "fira-vs-firc-payment-methods"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
      { slug: "paypal", label: "Visit PayPal", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/exchange-rate-markup-calculator", label: "Measure any quoted conversion" },
    body: [
      {
        type: "p",
        text: "There is no single best way to receive USD in India — there is a best rail per situation, and the situation is decided by three questions: who is paying (a platform or a direct client), how much, and how often. This guide is the map; the amount-specific guides are the deep dives. The 2026 default: give direct clients USD account details (Wise-class, ~0.5% total), let marketplaces route through their own rails (usually Payoneer), and treat PayPal as the client-convenience tax rather than a first choice.",
      },
      {
        type: "h2",
        text: "The rail matrix",
      },
      {
        type: "table",
        headers: ["Rail", "How money moves", "Cost to INR", "Speed", "Paperwork"],
        rows: [
          ["Wise USD balance", "Client pays ACH to your US account details", "0.43% + $0.50, mid-market (fee-index model)", "Minutes–hours", "Bank credit advice"],
          ["Payoneer", "Client or platform pays your receiving account", "$0 receive + 1–4% corridor", "≤48h auto-withdrawal", "Bank credit advice"],
          ["PayPal", "Client pays your email", "4.4% + $0.30 + 3.0% conversion (official)", "~24h to balance", "No FIRC — domestic settlement"],
          ["Bank wire (SWIFT)", "Client's bank to your bank", "~4.5% margin + $35-class + incoming fees (site model)", "2–5 business days", "FIRC automatic"],
          ["USDC", "On-chain to your wallet, then INR", "~0.1–1% per leg (site model)", "Minutes, 24×7", "None — unsettled rules"],
          ["EEFC account", "Export receipts held in USD at your AD bank", "Your bank's conversion — timing is yours", "2–5 business days", "FIRC on credit"],
        ],
      },
      {
        type: "h2",
        text: "Route by who pays",
      },
      {
        type: "ul",
        items: [
          "Marketplace seller (Upwork, Fiverr, and similar) → you mostly do not choose: the platform's payout rails decide, and Payoneer dominates both. The Upwork and Fiverr guides price the platform-specific options.",
          "Direct client, you choose the method → Wise USD details for a domestic ACH payment — best rate, and you decide when to convert. Revolut-class alternatives land within pennies at most sizes.",
          "Client insists on PayPal → accept for small receipts, but know the price: the PayPal vs Payoneer guide prices it at roughly 7% of a $1,000 payment end to end.",
          "Client's bank only does wires → ask the client to quote the outgoing fees in advance; the wire row is the worst in the table at every size once double-ended fees apply.",
          "Crypto-native client → the USDC corridor works 24×7 and can undercut every bank rail, with regulatory caveats — the USDC vs bank wire guide covers the spread.",
        ],
      },
      {
        type: "h2",
        text: "Route by size",
      },
      {
        type: "ul",
        items: [
          "Under $500 → flat fees decide everything; the $500 guide works the numbers. Wise's $0.50 versus PayPal's percentage stack can differ by more than 10% at this size.",
          "$500–1,000 → percentage spreads decide; the $1,000 guide covers the crossover and the client-friction tradeoffs.",
          "$1,000–5,000 → channels converge within ~3% of each other; the $5,000 guide covers EEFC accounts, FIRC discipline, and advance payments.",
          "Recurring $1,000+ every month → the conversion markup compounds: consolidate on one low-cost rail (Wise or Payoneer) and batch withdrawals instead of switching per payment.",
        ],
      },
      {
        type: "h2",
        text: "The paperwork follows the rail",
      },
      {
        type: "p",
        text: "Bank wires and EEFC credits generate FIRCs automatically. Wise and Payoneer land as domestic credits with bank credit advice — the evidence file is the advice paired with your invoice. PayPal settles domestically, so PayPal-only freelancers get no FIRC at all and should keep withdrawal statements instead; the FIRA vs FIRC guide covers the bank-side formats. Export of services stays zero-rated under GST on every rail.",
      },
      {
        type: "h2",
        text: "The short answer",
      },
      {
        type: "ul",
        items: [
          "Default for direct clients → a Wise USD balance (or Revolut-class equivalent): ~0.5% total, mid-market rate, convert when you choose.",
          "Default for marketplaces → Payoneer, because the platform rails already run through it.",
          "Only when the client insists → PayPal, at ~7% per $1,000 — priced, not ignored.",
          "Only when a bank requires it → a wire, and consider an EEFC account if large or frequent receipts make conversion timing matter.",
          "USDC for the 24×7 crypto corridor — cheapest at large sizes on cheap networks, with the unsettled-rules caveat.",
        ],
      },
      {
        type: "p",
        text: "Editorial note: fee models are the site's published index inputs (Wise 0.43% + $0.50; Payoneer 1–4% corridor; bank wire ~4.5% + $35-class; USDC ~0.1–1% per leg) and PayPal India's official schedules (4.4% + $0.30 receiving, 3.0% conversion). The ₹95.40 snapshot is the FX estimator's 2026-08-12 rate. Each linked guide carries its own sources and hedges; the rate shown in your provider account before you confirm is authoritative.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
