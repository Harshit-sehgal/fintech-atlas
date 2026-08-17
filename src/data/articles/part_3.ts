// GENERATED SPLIT — do not hand-edit; see src/data/articles/index.ts (barrel).

import type { Article } from "./types";

export const part_3_Articles: Article[] = [
  {
    slug: "plaid-vs-indias-account-aggregator",
    author: "FinTech Atlas editorial team",
    title: "Plaid vs India's Account Aggregator",
    description:
      "Plaid connects US apps to 12,000+ banks; India's Account Aggregator framework does the same job with RBI-regulated consent. How the two compare and which one your product needs.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Payments",
    regions: ["india"],
    relatedCompanySlugs: ["plaid"],
    relatedArticleSlugs: ["best-neobanks-2026","cash-app-vs-venmo"],
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
    regions: ["india"],
    relatedCompanySlugs: ["mercado-pago", "picpay", "wise", "payoneer"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india","stablecoins-for-cross-border-payments"],
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
    regions: ["india"],
    relatedCompanySlugs: ["razorpay", "cashfree", "paytm", "paypal", "braintree", "apple-pay"],
    relatedArticleSlugs: ["razorpay-vs-cashfree-for-ecommerce","best-payment-gateway-small-business","payment-gateway-fee-comparison-india"],
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
    regions: ["india"],
    relatedCompanySlugs: ["razorpay", "cashfree", "stripe", "paytm", "phonepe"],
    relatedArticleSlugs: ["razorpay-vs-stripe-payments-india","razorpay-vs-cashfree-indian-gateways","payment-gateway-for-subscription-businesses","best-payment-gateway-small-business","quarterly-india-cross-border-fee-index","best-payment-gateway-shopify-india","best-payment-gateway-indian-startups","best-payment-gateway-indian-saas","razorpay-international-payment-fees"],
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
    regions: ["india"],
    relatedCompanySlugs: ["wise", "payoneer", "paypal"],
    relatedArticleSlugs: ["best-payment-method-fiverr-india","payoneer-fees-india","receiving-1000-usd-from-us-client-in-india","quarterly-india-cross-border-fee-index","wise-vs-payoneer-business-payouts","fira-vs-firc-payment-methods"],
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
    regions: ["india"],
    relatedCompanySlugs: ["payoneer", "paypal"],
    relatedArticleSlugs: ["best-payment-method-upwork-india","payoneer-fees-india","receiving-1000-usd-from-us-client-in-india","quarterly-india-cross-border-fee-index","fira-vs-firc-payment-methods","paypal-vs-payoneer-india"],
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
    regions: ["india"],
    relatedCompanySlugs: ["paypal", "payoneer", "wise"],
    relatedArticleSlugs: ["best-way-to-receive-usd-in-india","payoneer-fees-india","receiving-1000-usd-from-us-client-in-india","wise-vs-payoneer-business-payouts","best-payment-method-fiverr-india","razorpay-international-payment-fees"],
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
    regions: ["india"],
    relatedCompanySlugs: ["wise", "paypal", "payoneer"],
    relatedArticleSlugs: ["paypal-vs-payoneer-india","receiving-500-usd-from-us-client-in-india","receiving-1000-usd-from-us-client-in-india","receiving-5000-usd-from-us-client-in-india","payoneer-fees-india","fira-vs-firc-payment-methods","razorpay-international-payment-fees"],
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
  {
    slug: "best-payment-gateway-indian-startups",
    author: "FinTech Atlas editorial team",
    title: "Best payment gateway for Indian startups (2026)",
    description: "Razorpay, Cashfree, Stripe (India) and Paytm compared for Indian startups — the flat 2% + 18% GST model, UPI as the zero-MDR default rail, and which gateway fits D2C, payouts-heavy, and global-first teams.",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    category: "Payments",
    regions: ["india"],
    relatedCompanySlugs: ["razorpay","cashfree","stripe","paytm","phonepe"],
    relatedArticleSlugs: ["razorpay-vs-stripe-payments-india","razorpay-vs-cashfree-indian-gateways","payment-gateway-fee-comparison-india","best-payment-gateway-small-business","best-payment-gateway-indian-saas"],
    ctas: [
      { slug: "razorpay", label: "Visit Razorpay", placement: "compare-vs" },
      { slug: "cashfree", label: "Visit Cashfree", placement: "compare-vs" },
      { slug: "stripe", label: "Visit Stripe", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/razorpay-fee-calculator", label: "Run your own fee math" },
    body: [
      {
        type: "p",
        text: "For an India-registered startup, the payment gateway decision is less about features and more about which payment mix you can accept out of the box. The Indian default is UPI — it carries zero MDR by regulation and powers most domestic transactions — so a gateway is really a bundle of rails behind one flat price. Razorpay, Cashfree, Stripe (India) and Paytm all quote around 2% on domestic payments plus 18% GST on the platform fee; the differences are settlement speed, payouts, developer ergonomics, and how they price cards issued outside India.",
      },
      {
        type: "table",
        headers: ["Gateway","Domestic rate","International cards","Setup / monthly","Best fit"],
        rows: [
          ["Razorpay","2% on all instruments","Up to 3%","₹0 / ₹0","UPI-first D2C & subscriptions"],
          ["Cashfree","2% on all instruments","~2.99%","₹0 / ₹0","Payouts-heavy teams & marketplaces"],
          ["Stripe (India)","2% on India-issued cards","3%","₹0 / ₹0","Global-first SaaS & platforms"],
          ["Paytm Payment Gateway","~2% on all instruments","Up to 3%","₹0 / ₹0","Paytm-wallet & QR-heavy merchants"],
        ],
      },
      {
        type: "h2",
        text: "What actually matters at startup stage",
      },
      {
        type: "ul",
        items: [
          "Flat-rate simplicity: a single 2%-plus-GST number beats a 0.1%-cheaper tiered sheet your CTO has to maintain. All four fit this.",
          "UPI-first checkout: because UPI is free for consumers and zero-MDR for merchants, the gateway's UPI experience and success rate decide your conversion.",
          "Settlement speed: T+1 with instant-settlement options is the modern baseline; a gateway stuck on T+2 or weekly batches will fight your cash flow.",
          "Onboarding & compliance: self-serve KYC that you can complete in hours matters more than sales-team demos when you are three people.",
          "No fixed monthly fee: ₹0 setup and ₹0 AMC keep the fixed cost near zero while you find product-market fit.",
          "Developer ergonomics: docs, SDKs, test mode, and webhooks — the APIs you ship against today become the infrastructure you rebuild later.",
        ],
      },
      {
        type: "h2",
        text: "UPI is the default rail",
      },
      {
        type: "p",
        text: "UPI carries zero MDR by regulation, so Indian gateways bundle it into the flat 2% rather than pricing it separately. That is why a UPI-heavy checkout tends to be cheaper in practice on Razorpay or Cashfree (which treat UPI, netbanking, and wallets as first-class rails) than on a card-centric pricing sheet. For a domestic-first startup, this bundling is the single biggest reason the flat-rate gateways win.",
      },
      {
        type: "h2",
        text: "When to start with Razorpay",
      },
      {
        type: "p",
        text: "Razorpay is the sensible default for most Indian startups: flat 2% on all domestic instruments, up to 3% on international cards, ₹0 setup, T+1 settlement with instant-settlement options, and a local support and compliance stack tuned to Indian requirements. Its Route and payment-link products cover most early use cases without buying a second platform. The Razorpay vs Stripe guide works through the head-to-head, and the subscription guide covers recurring-billing specifics if you already know you will charge monthly.",
      },
      {
        type: "h2",
        text: "When Cashfree wins",
      },
      {
        type: "p",
        text: "Cashfree prices its domestic business at the same 2%, but it is strongest when payouts are the hard problem — marketplaces, gig platforms, and disbursement-heavy flows. Its payouts API, bulk-settlement tooling, and automation suite are the differentiators. The Razorpay vs Cashfree guide covers the trade-offs; if half your engineering problem is sending money out, start your evaluation there.",
      },
      {
        type: "h2",
        text: "When Stripe (India) wins",
      },
      {
        type: "p",
        text: "Stripe India's 2%-on-India-cards pricing is competitive, but its real edge is global: deep billing tooling (Stripe Billing), Connect for marketplaces, and the smoothest path if you plan to sell internationally or register abroad later. For a startup whose roadmap is global-first, the 3% international card rate is worth it for the ecosystem. The SaaS deep-dive and the developers' comparison cover this path in detail.",
      },
      {
        type: "h2",
        text: "The short answer",
      },
      {
        type: "ul",
        items: [
          "Default for a domestic-first Indian startup → Razorpay: flat 2% all-in bundle, ₹0 fixed cost, strongest UPI experience.",
          "Payouts-heavy or marketplace-shaped → Cashfree: same 2%, best payouts tooling.",
          "Global-first SaaS or platform → Stripe (India): 2% on India cards, 3% international, deepest billing ecosystem.",
          "Paytm-wallet and QR-heavy offline → Paytm Payment Gateway, if your customers already live in that wallet.",
        ],
      },
      {
        type: "p",
        text: "Editorial note: rates are the site's published fee-index model (Razorpay and Cashfree at 2% domestic + 18% GST on the platform fee; Stripe India at 2% on India-issued cards; international cards up to 3%), consistent with the Fee Calculator and the linked comparison guides. They are published schedules from the catalog vintage, not quotes — verify current terms and your GST/volume profile with the provider before deciding.",
      },
    ],
  },
  {
    slug: "best-payment-gateway-indian-saas",
    author: "FinTech Atlas editorial team",
    title: "Best payment gateway for Indian SaaS (2026)",
    description: "How Indian SaaS teams pick a gateway when half their revenue is INR subscriptions and the other half arrives in USD — Razorpay, Stripe, and Cashfree on recurring billing, dunning, GST invoicing, and cross-border cards.",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    category: "Payments",
    regions: ["india"],
    relatedCompanySlugs: ["razorpay","stripe","cashfree","phonepe"],
    relatedArticleSlugs: ["razorpay-vs-stripe-payments-india","razorpay-vs-stripe-for-developers","payment-gateway-for-subscription-businesses","payment-gateway-fee-comparison-india","best-payment-gateway-indian-startups"],
    ctas: [
      { slug: "stripe", label: "Visit Stripe", placement: "compare-vs" },
      { slug: "razorpay", label: "Visit Razorpay", placement: "compare-vs" },
      { slug: "cashfree", label: "Visit Cashfree", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/razorpay-fee-calculator", label: "Run your own fee math" },
    body: [
      {
        type: "p",
        text: "An Indian SaaS business has two payment problems at once: collecting monthly INR subscriptions domestically (UPI mandates, cards, netbanking) and collecting recurring USD from international customers. The gateway that wins is the one that does both without two separate accounting stacks. In practice that narrows the field to Razorpay (domestic-first, flat 2% on all instruments), Stripe India (2% on India-issued cards, 3% international, the deepest billing ecosystem), and Cashfree (2% domestic, strong payouts and automation).",
      },
      {
        type: "table",
        headers: ["Factor","Razorpay","Stripe (India)","Cashfree"],
        rows: [
          ["Domestic subscription rate","2% all instruments","2% India-issued cards","2% all instruments"],
          ["International cards","Up to 3%","3%","~2.99%"],
          ["Recurring-billing tooling","Subscriptions + UPI mandates","Stripe Billing (mature)","Subscriptions API"],
          ["GST invoicing","Invoice stack for Indian billing","Partial (INR GST via Stripe Tax)","Built-in invoicing"],
          ["Dunning / retries","Configurable","Best-in-class","Configurable"],
          ["Payouts & automation","Good","Global rails","Best-in-class payouts"],
        ],
      },
      {
        type: "h2",
        text: "Domestic subscriptions: UPI mandates change the math",
      },
      {
        type: "p",
        text: "For INR revenue, the subscription playbook now runs through UPI AutoPay mandates. Razorpay treats UPI as a first-class rail and its flat 2% covers mandates, cards, and netbanking under one number; Stripe India prices cards specifically, so a UPI-mandate-heavy Indian book can work out cheaper on Razorpay. The subscription-business guide goes deep on mandate setup, e-mandate flows, and the recurring-invoice mechanics for the Indian market.",
      },
      {
        type: "h2",
        text: "International customers: the card rate and the FX tax",
      },
      {
        type: "p",
        text: "When a US or EU customer pays, the gateway charges its international card rate (up to 3% on Razorpay, 3% on Stripe India) and converts the proceeds to INR — the conversion is bundled, so compare the all-in number, not just the card rate. The Razorpay international fees guide breaks that all-in cost down, and the USD-receiving map compares the gateway route against Wise-class accounts and Payoneer when the customer prefers invoicing rather than card.",
      },
      {
        type: "h2",
        text: "Stripe's edge: billing maturity",
      },
      {
        type: "p",
        text: "Stripe Billing is the deepest recurring-revenue toolset on the market — usage-based pricing, metered billing, prorations, and dunning are production-grade. For a SaaS that sells seat-based or usage-based plans and plans to expand globally, Stripe India's 2%-on-India-cards pricing plus that billing layer is hard to beat, even at 3% on international cards. The Razorpay vs Stripe guide and the developers' comparison weigh this against Razorpay's local compliance speed.",
      },
      {
        type: "h2",
        text: "When Cashfree fits a SaaS stack",
      },
      {
        type: "p",
        text: "Cashfree is the pick when your SaaS also moves money out — marketplace payouts, revenue share, vendor disbursement — because its payouts and automation suite is the strongest of the three. Domestic pricing matches Razorpay at 2%, and its international rate lands around 2.99%. It is a better second pick than a second payment platform.",
      },
      {
        type: "h2",
        text: "The short answer",
      },
      {
        type: "ul",
        items: [
          "Domestic-first Indian SaaS → Razorpay: flat 2% on all instruments, UPI mandates first-class, GST-friendly local stack.",
          "Global-first or billing-complex SaaS → Stripe (India): 2% on India cards, 3% international, unmatched Billing maturity.",
          "SaaS with payout-heavy flows → Cashfree: same 2%, best payouts and automation.",
          "Still deciding on the INR-vs-USD split → run the Fee Calculator on both a domestic-only and a 50% international mix before choosing.",
        ],
      },
      {
        type: "p",
        text: "Editorial note: rates are the site's published fee-index model (2% domestic + 18% GST on the platform fee; international cards up to 3%), consistent with the Fee Calculator and the linked comparison guides. Stripe India's card-centric pricing and the cross-border conversion are bundled, so the all-in cost depends on your international mix — verify current schedules before committing.",
      },
    ],
  },
  {
    slug: "razorpay-international-payment-fees",
    author: "FinTech Atlas editorial team",
    title: "Razorpay international payment fees (2026)",
    description: "What Razorpay actually charges when an international customer pays you in INR terms — the up-to-3% international card rate, the 1% surcharge over domestic, 18% GST, currency conversion, and how the MoneySaver export account changes the FIRC paperwork.",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-15",
    category: "Cross-Border",
    regions: ["india"],
    relatedCompanySlugs: ["razorpay","wise","payoneer","paypal"],
    relatedArticleSlugs: ["razorpay-vs-stripe-payments-india","best-way-to-receive-usd-in-india","paypal-vs-payoneer-india","payoneer-fees-india","payment-gateway-fee-comparison-india"],
    ctas: [
      { slug: "razorpay", label: "See Razorpay pricing", placement: "compare-vs" },
      { slug: "wise", label: "Compare with Wise", placement: "compare-vs" },
      { slug: "payoneer", label: "Compare with Payoneer", placement: "compare-vs" },
    ],
    relatedTool: { href: "/tools/exchange-rate-markup-calculator", label: "Measure any quoted conversion" },
    body: [
      {
        type: "p",
        text: "When an international customer pays your Razorpay checkout, you pay more than the domestic 2%: Razorpay's published model adds an international surcharge, taking cards issued outside India to up to 3%, with 18% GST on the platform fee on top. The conversion to INR is bundled into that number. This guide unpacks the all-in cost, when the international route is worth it, and how Razorpay's export-account product changes the FIRC paperwork for cross-border sellers.",
      },
      {
        type: "h2",
        text: "The international price, line by line",
      },
      {
        type: "table",
        headers: ["Component","Rate (published model)","What it covers"],
        rows: [
          ["Domestic platform fee","2% of transaction","All INR payment instruments"],
          ["International card surcharge","+1% (up to 3% total)","Cards issued outside India"],
          ["GST","18% on the platform fee","Applied on the fee, not the sale"],
          ["Currency conversion","Bundled","Included in the surcharge"],
          ["Setup / monthly","₹0 / ₹0","No fixed cost"],
        ],
      },
      {
        type: "h2",
        text: "The all-in number",
      },
      {
        type: "p",
        text: "A ₹10,000 international card payment works out to a 3% fee (₹300) plus 18% GST on that fee (₹54) — ₹354 all-in, 3.54%. The same ticket on a domestic UPI payment is ₹200 plus ₹36 GST, ₹236 all-in. So a 10% international mix moves your blended rate from ~2.36% toward ~2.5%. The Fee Calculator shows this on your own volumes, and the fee-comparison index lines it up against Stripe India and Cashfree on the same inputs.",
      },
      {
        type: "h2",
        text: "Is the 3% worth it?",
      },
      {
        type: "ul",
        items: [
          "Yes for checkout conversion: if the customer wants to pay by card at your checkout, 3% is the price of the rail — and often cheaper than the customer's own cross-border card fee.",
          "No for B2B invoices: when a US client will wire or pay an account-based rail, the gateway route at 3%+ loses to Wise (~0.5% total) or a bank wire, and the USD-receiving map picks the right rail by amount.",
          "Watch the FX: the conversion is bundled, so compare against the mid-market rate — the exchange-rate markup calculator measures any quoted conversion against the interbank rate.",
        ],
      },
      {
        type: "h2",
        text: "The export-account path: MoneySaver",
      },
      {
        type: "p",
        text: "For exporters and service businesses receiving recurring foreign currency, Razorpay's MoneySaver Export Account is the relevant product: it gives you virtual international account details to share with foreign buyers, and Razorpay reports the inbound as export proceeds with automated FIRC/EFIRC generation — a meaningful paperwork win over manual FIRC collection. Pricing is transaction-based and differs from the gateway's card surcharge, so treat any figure as indicative and confirm the current schedule before relying on it. The FIRA vs FIRC guide explains what each document is for.",
      },
      {
        type: "h2",
        text: "Alternatives worth pricing",
      },
      {
        type: "p",
        text: "For occasional card-heavy international revenue, the 3% gateway rate is fine. For recurring B2B invoices, Wise-class accounts land around 0.5% total with mid-market conversion, and Payoneer's 1–4% corridor suits marketplace payouts — the Payoneer fees guide and the PayPal comparison cover those corridors, and the fee-index keeps the quarterly numbers current.",
      },
      {
        type: "h2",
        text: "The short answer",
      },
      {
        type: "ul",
        items: [
          "Cards at your checkout → Razorpay international, up to 3% + 18% GST on the fee — bundled conversion, ₹0 fixed cost.",
          "Recurring B2B USD → a Wise-class account, not the gateway; ~0.5% total and you choose the conversion moment.",
          "Marketplace payouts → Payoneer's corridor, because the platform rails already run through it.",
          "Export accounting → the MoneySaver export account when you want automated FIRC/EFIRC on inbound foreign currency.",
        ],
      },
      {
        type: "p",
        text: "Editorial note: the up-to-3% international card rate, 2% domestic fee, and 18% GST on the platform fee are the site's published fee-index model (Razorpay pricing page, catalog vintage), consistent with the Fee Calculator and comparison guides. MoneySaver pricing is transaction-based and indicative — confirm the current schedule with Razorpay before relying on it. The rate in your provider account at confirmation is authoritative.",
      },
    ],
  }
];
