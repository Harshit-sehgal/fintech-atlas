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
  /** Related interactive tool (plan T049: every article links its calculator). */
  relatedTool?: { href: string; label: string };
  body: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: "stripe-vs-adyen-fees",
    title: "Stripe vs Adyen: fees & platform differences",
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
    title: "Wise vs Revolut: international transfers compared",
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
    title: "Stripe vs PayPal: online payments compared",
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
    title: "Best neobanks: Chime, Monzo, N26 & SoFi",
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
  {
    slug: "coinbase-vs-robinhood-crypto-investing",
    title: "Coinbase vs Robinhood: buying crypto and stocks",
    description:
      "A practical comparison of Coinbase and Robinhood for retail investors — trading fees, crypto selection, regulation, and who each fits best.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Investing",
    relatedCompanySlugs: ["coinbase", "robinhood", "sofi"],
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
        text: "Editorial note: this is educational, not investment advice. Crypto is volatile and may not be suitable for all investors.",
      },
    ],
  },
  {
    slug: "best-payment-gateway-small-business",
    title: "Best payment gateway for a small business",
    description:
      "A small-business buyer's guide to the three most common US gateways — Square vs Stripe vs PayPal across setup, fees, in-person, and online needs.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Payments",
    relatedCompanySlugs: ["square", "stripe", "paypal", "adyen"],
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
    title: "Wise vs Payoneer for freelancers & businesses",
    description:
      "A comparison of Wise and Payoneer for cross-border payments — receiving client money, holding balances, and paying out suppliers as a freelancer or small business.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "revolut", "paypal"],
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
    title: "How to send money abroad cheaply",
    description:
      "An evergreen guide to avoiding hidden FX markups when sending money internationally — what mid-market rate means, what to compare, and which providers to run numbers on.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "revolut", "paypal", "moneygram"],
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
    title: "Square vs Stripe: retail vs online platforms",
    description:
      "The honest Square vs Stripe comparison for businesses that sell in person, online, or both — setup, rates, hardware, and which one fits your store.",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-03",
    category: "Payments",
    relatedCompanySlugs: ["square", "stripe", "paypal", "adyen"],
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
    title: "Razorpay vs Stripe (India): fees & platforms",
    description:
      "Razorpay and Stripe India both charge a flat 2% on domestic payments plus 18% GST. A plain-language comparison of the two leading India gateways — fees, settlement, and who each best fits.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["razorpay", "stripe"],
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
    title: "Razorpay vs Cashfree (India): gateway comparison",
    description:
      "Both Indian gateways charge a flat 2% on domestic payments plus 18% GST — the differences are international rates, settlement, and product depth. A plain-language comparison for Indian merchants.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["razorpay", "cashfree"],
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
    title: "Payoneer fees in India (2026): receiving USD",
    description:
      "Payoneer's published India pricing — free local receiving accounts, a 1–4% USD-to-INR withdrawal corridor, card-funded requests at 2.90% + $0.49, and the $29.95 annual fee — explained with a worked example.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["payoneer", "wise"],
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
        text: "Illustrative math at a mid-market snapshot of ₹83.50/USD (the FX estimator's 2026-08-01 rate): a $1,000 marketplace payout arrives with no Payoneer receiving fee. Withdrawing to INR at the published 1–4% corridor, at 1% you keep $990 — about ₹82,665 — and at 4% you keep $960 — about ₹80,160. If the client paid by credit card instead, the 2.90% + $0.49 request fee (≈ $29.49) applies first, and the withdrawal corridor then applies to what is left. The exact corridor rate is shown inside your account before you confirm the withdrawal.",
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
        text: "Figures above are Payoneer's published India pricing (payoneer.com/en-in/about/pricing/, updated 18 June 2026) and global pricing page (updated 1 January 2026). Marketplace payout fees are set by each marketplace and vary. The worked example assumes an illustrative ₹83.50/USD mid-market snapshot (the FX estimator's 2026-08-01 rate); actual exchange rates move continuously. The fee shown in your Payoneer account before you confirm a transaction is authoritative.",
      },
      {
        type: "p",
        text: "Editorial note: rates are published schedules from the catalog vintage, not live quotes — verify current terms in your Payoneer account before confirming any transaction.",
      },
    ],
  },
  {
    slug: "receiving-500-usd-from-us-client-in-india",
    title: "Receiving $500 from a US client in India",
    description:
      "What actually lands in your INR account when a US client sends $500 — Wise, Payoneer, PayPal, and bank wire compared with a worked rupee example, plus FIRC and tax notes.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
      { slug: "paypal", label: "Visit PayPal", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/remittance", label: "Estimate transfer costs" },
    body: [
      {
        type: "p",
        text: "A US client sends you $500. What lands in your INR account depends on the channel they use: the fee the provider takes, the exchange-rate spread, and how long the money takes. At the site's ₹83.50/USD mid-market snapshot (2026-08-01, the same rates the FX estimator uses), the cheapest and the priciest routes differ by roughly ₹4,450 — more than 10% of the amount. The short version: Wise and Revolut are the cheapest and fastest for most freelancers, bank wires hide their cost in the rate, PayPal is the most expensive, and Payoneer wins when the client already pays through marketplace rails.",
      },
      {
        type: "h2",
        text: "What each channel delivers for $500",
      },
      {
        type: "table",
        headers: ["Channel", "Upfront fee", "FX markup", "You receive (₹)", "Typical time"],
        rows: [
          ["Wise", "≈ $2.65 flat", "0% — mid-market rate", "≈ ₹41,529", "Minutes–hours"],
          ["Payoneer", "$0 to receive", "1–4% corridor (2% illustrated)", "≈ ₹40,915", "1–2 business days"],
          ["Bank wire (SWIFT)", "≈ $35 outgoing + sender's bank fees", "≈ 4.5% corridor", "≈ ₹37,080", "2–5 business days"],
          ["PayPal", "≈ $4.99 flat", "≈ 3.5% FX spread", "≈ ₹39,887", "1–3 days"],
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
          "Occasional $500 from a direct client → Wise (or Revolut — at this size they land within ₹12 of each other): cheapest, fastest, most transparent.",
          "Platform or marketplace payouts → Payoneer: the rail the platform already uses, and receiving is $0.",
          "Client insists on PayPal → accept, but know you are paying roughly 10% versus Wise — asking the client to cover the fee is reasonable.",
          "Large or recurring amounts → give the client your Wise USD account details so they can pay by domestic ACH transfer; receiving is $0 and there is no SWIFT chain.",
        ],
      },
      {
        type: "h2",
        text: "Run your own numbers",
      },
      {
        type: "p",
        text: "The exact gap depends on the day's rate and your specific corridor. Use the Cross-Border FX Estimator to compare providers for your actual amount, and the exchange-rate markup calculator to expose the hidden spread of any rate you are offered.",
      },
      {
        type: "p",
        text: "Editorial note: figures are illustrative from the 2026 catalog vintage (₹83.50/USD, the FX estimator's 2026-08-01 snapshot; fee models match the estimator's provider configs), not live quotes or financial advice. Fee schedules and FX programs change — verify the current rate before confirming any transfer.",
      },
    ],
  },
  {
    slug: "international-payment-settlement-times",
    title: "International payment settlement times (India)",
    description:
      "How fast money actually moves in India: UPI, IMPS, NEFT, RTGS, gateway T+1 settlement, Wise, SWIFT, and Payoneer — typical timelines and what slows them down.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["razorpay", "cashfree", "stripe", "wise", "payoneer"],
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
    title: "FIRA vs FIRC: payment-method comparison",
    description:
      "FIRA and FIRC are the two documents that prove money from abroad reached your Indian bank — what each is, when you need the certificate, and which payment methods produce one.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
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
    title: "Quarterly India Cross-Border Payment Fee Index",
    description:
      "The FinTech Atlas consolidated index of India cross-border payment fees: what Wise, Revolut, Payoneer, PayPal, and a bank wire actually deliver for $500, $1,000, and $5,000 — computed from the site's published fee schedules.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
      { slug: "revolut", label: "Open Revolut", placement: "compare-vs" },
    ],
    body: [
      {
        type: "p",
        text: "This is the FinTech Atlas consolidated fee index for receiving USD in India — what each channel actually delivers after fees and FX markup, for three representative amounts. Every figure is computed from the same provider fee models and the same ₹83.50/USD mid-market snapshot (2026-08-01) that power the site's Cross-Border FX Estimator, so the index and the calculator can never disagree. Treat it as a snapshot of the current vintage, not a live quote: schedules change, and your exact corridor can differ.",
      },
      {
        type: "h2",
        text: "The index: net INR for $500 / $1,000 / $5,000",
      },
      {
        type: "table",
        headers: ["Channel", "$500", "$1,000", "$5,000", "Fee model", "FX markup"],
        rows: [
          ["Wise", "≈ ₹41,529", "≈ ₹83,099", "≈ ₹4,15,663", "0.43% + $0.50", "0%"],
          ["Revolut", "≈ ₹41,541", "≈ ₹83,083", "≈ ₹4,15,413", "0.5%", "0%"],
          ["Payoneer (2% corridor illustrated)", "≈ ₹40,915", "≈ ₹81,830", "≈ ₹4,09,150", "1–4% corridor", "In-spread"],
          ["PayPal / Xoom", "≈ ₹39,887", "≈ ₹80,175", "≈ ₹4,02,485", "$4.99 flat", "3.5%"],
          ["Illustrative bank wire", "≈ ₹37,080", "≈ ₹76,952", "≈ ₹3,95,922", "$35 flat", "4.5%"],
        ],
      },
      {
        type: "h2",
        text: "How the index is computed",
      },
      {
        type: "p",
        text: "For each provider: the fee model (percentage, flat, or both) is applied to the send amount, then the FX markup is applied to the mid-market rate, and the net amount is converted. The mid-market snapshot is ₹83.50/USD (2026-08-01); the fee models are the ones published in the site's remittance configuration — the same inputs the Cross-Border FX Estimator runs. Payoneer has no fixed published percentage for USD→INR: the published 1–4% corridor is shown at its 2% midpoint for comparison, with the caveat that the actual rate is shown in your account before you confirm.",
      },
      {
        type: "h2",
        text: "Reading the index",
      },
      {
        type: "ul",
        items: [
          "At $500, Revolut and Wise land within ₹12 of each other — a rounding difference, not a decision; the tie breaks on speed, account features, and corridors you actually use.",
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
        text: "Editorial note: index figures are computed from the site's published provider fee models and the ₹83.50/USD snapshot of 2026-08-01 — the same inputs as the Cross-Border FX Estimator. They are illustrative, not live quotes; verify current schedules before planning around any figure.",
      },
    ],
  },
  {
    slug: "payment-gateway-for-subscription-businesses",
    title: "Payment gateway for Indian subscription businesses",
    description:
      "Razorpay, Cashfree, and Stripe India for recurring billing: UPI AutoPay mandates, card-on-file eMandates, eNACH, billing engines, and which gateway fits a subscription business.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["razorpay", "cashfree", "stripe"],
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
    title: "Receiving $5,000 from a US client in India",
    description:
      "At $5,000 the channel gap shrinks to ~3% — the real decisions are EEFC accounts (hold the dollars), FIRC documentation, and advance payments. Worked numbers from the site's fee index.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
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
          ["Wise", "≈ ₹4,15,663", "0.43% + $0.50", "0%"],
          ["Revolut", "≈ ₹4,15,413", "0.5%", "0%"],
          ["Payoneer (2% corridor illustrated)", "≈ ₹4,09,150", "1–4% corridor", "In-spread"],
          ["PayPal / Xoom", "≈ ₹4,02,485", "$4.99 flat", "3.5%"],
          ["Illustrative bank wire", "≈ ₹3,95,922", "$35 flat", "4.5%"],
        ],
      },
      {
        type: "p",
        text: "Figures computed from the same fee models and ₹83.50/USD snapshot (2026-08-01) as the Quarterly India Cross-Border Payment Fee Index — the full $500/$1,000/$5,000 matrix lives there.",
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
        text: "Editorial note: figures are computed from the site's published fee models and ₹83.50/USD snapshot (2026-08-01) — the same inputs as the FX estimator. EEFC eligibility, holding limits, and banking practice vary by bank and regulation; this is editorial guidance, not tax or legal advice. Verify current terms before acting.",
      },
    ],
  },
  {
    slug: "razorpay-vs-stripe-for-developers",
    title: "Razorpay vs Stripe for developers",
    description:
      "API design, SDKs, webhooks, test tooling, PCI scope, and India-specific rails — which gateway your engineering team will build faster on, and where the DX gap is real.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["razorpay", "stripe"],
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
    title: "Razorpay vs Cashfree for ecommerce",
    description:
      "Checkout plugins, EMI and pay-later coverage, COD reconciliation, and international selling — the operational differences that decide the gateway for an Indian online store.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    relatedCompanySlugs: ["razorpay", "cashfree"],
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
    title: "Receiving $1,000 from a US client in India",
    description:
      "The freelancer-milestone guide: at $1,000 flat fees and percentage fees balance out, marketplace rails (Upwork/Fiverr) route you to Payoneer, and FIRC documentation habits start.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    ctas: [
      { slug: "wise", label: "Open Wise", placement: "compare-vs" },
      { slug: "payoneer", label: "Visit Payoneer", placement: "compare-vs" },
      { slug: "paypal", label: "Visit PayPal", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/remittance", label: "Estimate transfer costs" },
    body: [
      {
        type: "p",
        text: "A $1,000 payment is the freelancer milestone — the typical Upwork or Fiverr payout, the size where clients stop asking how to pay and you should start caring about how you receive it. It sits exactly where the two fee structures balance: the flat fees that dominated at $500 (Wise's $0.50, PayPal's $4.99) have shrunk into the noise, while percentage costs still matter — the spread between the cheapest and priciest channels is roughly ₹6,100, about 7% of the money. The short version: take the payment on the rail your client or platform prefers, pick Wise or Revolut when you choose, and use the first $1,000 receipts to build the documentation habit — invoice pairs, FIRCs, and a folder per project.",
      },
      {
        type: "h2",
        text: "The numbers at $1,000",
      },
      {
        type: "table",
        headers: ["Channel", "You receive (₹)", "Fee model", "FX markup"],
        rows: [
          ["Wise", "≈ ₹83,099", "0.43% + $0.50", "0%"],
          ["Revolut", "≈ ₹83,083", "0.5%", "0%"],
          ["Payoneer (2% corridor illustrated)", "≈ ₹81,830", "1–4% corridor", "In-spread"],
          ["PayPal / Xoom", "≈ ₹80,175", "$4.99 flat", "3.5%"],
          ["Illustrative bank wire", "≈ ₹76,952", "$35 flat", "4.5%"],
        ],
      },
      {
        type: "p",
        text: "Figures computed from the same fee models and ₹83.50/USD snapshot (2026-08-01) as the Quarterly India Cross-Border Payment Fee Index — the $500 and $5,000 companion tables live in the sibling guides for those amounts.",
      },
      {
        type: "h2",
        text: "Where the fee structures flip",
      },
      {
        type: "ul",
        items: [
          "At $500 the flat fees decided everything — Wise's $0.50 versus PayPal's $4.99 plus a 3.5% spread made the channels differ by more than 10%.",
          "At $1,000 the flat fees are rounding error; the percentage spread is what separates the rails — about 3.5% between Wise and PayPal, and roughly 7% between the best and the bank wire.",
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
        text: "Editorial note: figures are computed from the site's published fee models and ₹83.50/USD snapshot (2026-08-01) — the same inputs as the FX estimator. Platform payout rails, Payoneer corridors, and bank practices vary; this is editorial guidance, not tax or legal advice.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
