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
        text: "Illustrative math at a mid-market snapshot of ₹86/USD: a $1,000 marketplace payout arrives with no Payoneer receiving fee. Withdrawing to INR at the published 1–4% corridor, at 1% you keep $990 — about ₹85,140 — and at 4% you keep $960 — about ₹82,560. If the client paid by credit card instead, the 2.90% + $0.49 request fee (≈ $29.49) applies first, and the withdrawal corridor then applies to what is left. The exact corridor rate is shown inside your account before you confirm the withdrawal.",
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
        text: "Figures above are Payoneer's published India pricing (payoneer.com/en-in/about/pricing/, updated 18 June 2026) and global pricing page (updated 1 January 2026). Marketplace payout fees are set by each marketplace and vary. The worked example assumes an illustrative ₹86/USD mid-market snapshot; actual exchange rates move continuously. The fee shown in your Payoneer account before you confirm a transaction is authoritative.",
      },
      {
        type: "p",
        text: "Editorial note: rates are published schedules from the catalog vintage, not live quotes — verify current terms in your Payoneer account before confirming any transaction.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
