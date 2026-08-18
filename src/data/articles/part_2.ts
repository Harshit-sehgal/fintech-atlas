// GENERATED SPLIT — do not hand-edit; see src/data/articles/index.ts (barrel).

import type { Article } from "./types";

export const part_2_Articles: Article[] = [
  {
    slug: "receiving-500-usd-from-us-client-in-india",
    author: "FinTech Atlas editorial team",
    title: "Receiving $500 from a US client in India",
    description:
      "What actually lands in your INR account when a US client sends $500 — Wise, Payoneer, PayPal, and bank wire compared with a worked rupee example, plus FIRC and tax notes.",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    category: "Cross-Border",
    regions: ["india"],
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    relatedArticleSlugs: ["receiving-1000-usd-from-us-client-in-india","receiving-5000-usd-from-us-client-in-india","fira-vs-firc-payment-methods","quarterly-india-cross-border-fee-index","how-to-send-money-abroad-cheap","international-payment-settlement-times","gusto-vs-adp-vs-paychex-us-payroll","cash-app-vs-venmo","receiving-payments-from-latin-america-in-india","best-way-to-receive-usd-in-india"],
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
    regions: ["india"],
    relatedCompanySlugs: ["razorpay", "cashfree", "stripe", "wise", "payoneer", "paytm", "phonepe", "google-pay", "visa-direct", "mastercard-send"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india","quarterly-india-cross-border-fee-index","stablecoins-for-cross-border-payments"],
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
    regions: ["india"],
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india","receiving-1000-usd-from-us-client-in-india","receiving-5000-usd-from-us-client-in-india","best-payment-method-upwork-india","best-payment-method-fiverr-india","best-way-to-receive-usd-in-india"],
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
    regions: ["india"],
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india","receiving-1000-usd-from-us-client-in-india","receiving-5000-usd-from-us-client-in-india","payoneer-fees-india","wise-vs-revolut-international-transfers","international-payment-settlement-times","stablecoins-for-cross-border-payments","payment-gateway-fee-comparison-india","best-payment-method-upwork-india","best-payment-method-fiverr-india"],
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
    regions: ["india"],
    relatedCompanySlugs: ["razorpay", "cashfree", "stripe"],
    relatedArticleSlugs: ["razorpay-vs-stripe-payments-india","razorpay-vs-stripe-for-developers","razorpay-vs-cashfree-for-ecommerce","payment-gateway-fee-comparison-india","best-payment-gateway-indian-saas"],
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
    regions: ["india"],
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india","receiving-1000-usd-from-us-client-in-india","fira-vs-firc-payment-methods","quarterly-india-cross-border-fee-index","stablecoins-for-cross-border-payments","best-way-to-receive-usd-in-india"],
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
    regions: ["india"],
    relatedCompanySlugs: ["razorpay", "stripe"],
    relatedArticleSlugs: ["razorpay-vs-stripe-payments-india","payment-gateway-for-subscription-businesses","best-payment-gateway-indian-saas"],
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
    regions: ["india"],
    relatedCompanySlugs: ["razorpay", "cashfree"],
    relatedArticleSlugs: ["razorpay-vs-cashfree-indian-gateways","payment-gateway-for-subscription-businesses","best-payment-gateway-shopify-india"],
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
    regions: ["india"],
    relatedCompanySlugs: ["wise", "payoneer", "paypal", "revolut"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india","receiving-5000-usd-from-us-client-in-india","fira-vs-firc-payment-methods","quarterly-india-cross-border-fee-index","payoneer-fees-india","gusto-vs-adp-vs-paychex-us-payroll","best-payment-method-upwork-india","best-payment-method-fiverr-india","best-way-to-receive-usd-in-india","paypal-vs-payoneer-india"],
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
    regions: ["global"],
    relatedCompanySlugs: ["gusto", "adp", "paychex"],
    relatedArticleSlugs: ["receiving-500-usd-from-us-client-in-india","receiving-1000-usd-from-us-client-in-india","brex-vs-relay-business-banking"],
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
    regions: ["global"],
    relatedCompanySlugs: ["brex", "relay"],
    relatedArticleSlugs: ["best-neobanks-2026","best-payment-gateway-small-business","gusto-vs-adp-vs-paychex-us-payroll","cash-app-vs-venmo"],
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
    regions: ["india"],
    relatedCompanySlugs: ["circle", "coinbase"],
    relatedArticleSlugs: ["quarterly-india-cross-border-fee-index","international-payment-settlement-times","receiving-5000-usd-from-us-client-in-india","how-to-send-money-abroad-cheap","receiving-payments-from-latin-america-in-india"],
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
    regions: ["global"],
    relatedCompanySlugs: ["cash-app", "venmo", "paypal"],
    relatedArticleSlugs: ["best-neobanks-2026","brex-vs-relay-business-banking","how-to-send-money-abroad-cheap","receiving-500-usd-from-us-client-in-india","plaid-vs-indias-account-aggregator"],
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
  }
];
