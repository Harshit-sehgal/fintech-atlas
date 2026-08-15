import { GlossaryTerm } from "./types";

// Glossary of FinTech terms referenced across the site.
// Definitions are written for a general audience and are intentionally short.
// The vocabulary tracks the site's actual content: the India fintech
// directory (RBI licence terms, UPI rails) and the cross-border guides.
// Cross-references are made via the `related` field (slugs of other terms).

export const glossary: GlossaryTerm[] = [
  {
    slug: "api",
    term: "API",
    full: "Application Programming Interface",
    short: "A contract that lets one piece of software talk to another.",
    long:
      "An API is a defined way for one program to request data or actions from another. In fintech, APIs power everything: a payment gateway processing a card charge, an account aggregator pulling a balance, or a UPI app checking whether a bank account is valid. Razorpay, Cashfree, and Juspay sell developer-first APIs — products designed to be used by software engineers, with documentation and sandboxes.",
    related: ["open-banking", "account-aggregator", "payment-aggregator", "tpap"],
  },
  {
    slug: "apr",
    term: "APR",
    full: "Annual Percentage Rate",
    short: "The yearly cost of borrowing, expressed as a percentage.",
    long:
      "APR is the rate a lender charges on a loan or credit card balance, before most fees. A 36% APR on a ₹50,000 personal loan costs roughly ₹1,500 of interest per month on the unpaid balance. Under RBI fair-lending rules, lenders must state the annualised cost — the all-in rate including processing fees — so that borrowing from an NBFC, a bank, or a fintech app can be compared fairly.",
    related: ["emi", "bnpl", "nbfc"],
  },
  {
    slug: "baas",
    term: "BaaS",
    full: "Banking-as-a-Service",
    short: "Outsourcing bank operations to a licensed provider so you can offer banking features inside your own app.",
    long:
      "BaaS providers hold a banking licence (or partner with a licensed bank) and let non-banks offer accounts, cards, and payments inside their own products. In India this shows up as fintechs embedding savings accounts, virtual cards, or fixed deposits by partnering with small finance banks and payment banks through APIs. The customer sees the fintech's brand; the regulated bank sits underneath.",
    related: ["small-finance-bank", "payment-bank", "api", "treasury"],
  },
  {
    slug: "bnpl",
    term: "BNPL",
    full: "Buy Now, Pay Later",
    short: "Splitting a purchase into interest-free installments at checkout.",
    long:
      "BNPL providers (Klarna globally; in India the model lives inside wallets like PhonePe Postpaid, Paytm Postpaid, and app-based lenders) pay the merchant at the time of sale, then collect from the shopper in fixed installments — often four payments, the first due immediately. Merchants pay a fee because BNPL lifts conversion and average order value. Missed payments can carry late fees and hit credit bureaus.",
    related: ["emi", "interchange", "chargeback", "mdr"],
  },
  {
    slug: "chargeback",
    term: "Chargeback",
    short: "A reversal of a card payment initiated by the cardholder's bank.",
    long:
      "If a customer disputes a card charge — fraud, non-delivery, or a defective product — their bank can pull the money back from the merchant even after it has shipped. Chargebacks cost merchants the sale, a fee, and possibly a higher processing rate. Indian gateways pass card-network dispute timelines down to merchants, who fight chargebacks by submitting evidence like delivery confirmation and customer communication.",
    related: ["interchange", "fraud", "payment-aggregator"],
  },
  {
    slug: "crypto",
    term: "Cryptocurrency",
    short: "A digital asset secured by cryptography and recorded on a public ledger called a blockchain.",
    long:
      "Cryptocurrencies like Bitcoin and Ethereum use cryptography to make transactions tamper-resistant, with a shared ledger as the public record of ownership. They enable peer-to-peer transfers without a bank. In India, crypto exchanges (CoinDCX, CoinSwitch, ZebPay) are registered as Virtual Asset Service Providers with the FIU and must comply with KYC rules; the tax regime treats virtual digital assets as property.",
    related: ["vda", "defi", "stablecoin"],
  },
  {
    slug: "defi",
    term: "DeFi",
    full: "Decentralized Finance",
    short: "Financial applications built on public blockchains, with no bank in the middle.",
    long:
      "DeFi protocols (Uniswap, Aave, Compound) recreate lending, exchange, and savings using smart contracts on blockchains. Instead of trusting a bank, users trust code. The trade-offs are complexity, smart-contract risk, and a regulatory landscape that is still being written — in India, around the FIU's VASP registration and the tax treatment of virtual digital assets.",
    related: ["crypto", "stablecoin", "vda"],
  },
  {
    slug: "fraud",
    term: "Fraud Detection",
    short: "Using signals and machine learning to block unauthorized or illegitimate transactions.",
    long:
      "Modern fraud engines score every transaction on dozens of signals: device fingerprint, IP geolocation, transaction velocity, behavioural history, and card-network risk scores. They return an allow/deny/review decision in milliseconds. Razorpay's RiskShield, Cashfree's Fraud Detect, and bank-side systems are Indian examples. The goal is to block fraud without also blocking good customers.",
    related: ["chargeback", "kyc", "pci-dss"],
  },
  {
    slug: "fx",
    term: "FX",
    full: "Foreign Exchange",
    short: "Converting one currency to another, with a fee that is sometimes hidden in the rate.",
    long:
      "When you exchange INR for USD, the bank or service is selling you one currency and buying another. They make money two ways: an explicit fee and/or a markup on the exchange rate. Wise and BookMyForex quote the real mid-market rate and show the fee separately; banks typically hide a 1–3% markup in the rate itself. The same markup math applies to the currency conversion leg of international cards.",
    related: ["mid-market-rate", "firc", "fema", "lrs"],
  },
  {
    slug: "interchange",
    term: "Interchange Fee",
    short: "The fee the merchant's bank pays the cardholder's bank for processing a card transaction.",
    long:
      "Every time a customer swipes a Visa or Mastercard, the merchant's bank pays a small percentage to the cardholder's bank. That is interchange — set by the card networks, not by the bank or the gateway. Indian debit-card interchange is regulated and lower than credit-card interchange (credit cards can run 1.5–2.5%). Processors like Razorpay and Cashfree bundle interchange into their published rate.",
    related: ["mdr", "chargeback", "payment-aggregator"],
  },
  {
    slug: "kyc",
    term: "KYC / AML",
    full: "Know Your Customer / Anti-Money Laundering",
    short: "Regulations that require financial firms to verify customer identity and monitor for suspicious activity.",
    long:
      "KYC and AML are the compliance backbone of Indian finance. Opening an account or wallet triggers ID verification (Aadhaar eKYC or PAN + selfie), sanction-list screening, and ongoing monitoring for red flags. The RBI, SEBI, and FIU all enforce KYC obligations on the entities they license. DigiO, Signzy, and similar vendors provide the verification layer most fintechs use.",
    related: ["fraud", "coa", "vda"],
  },
  {
    slug: "mid-market-rate",
    term: "Mid-Market Exchange Rate",
    short: "The midpoint between the buy and sell prices of a currency on global FX markets — the 'real' rate.",
    long:
      "The mid-market rate is what banks and money-transfer services trade at with each other, and roughly the rate you see when you search 'USD to INR'. When a bank or fintech quotes you a different rate, the gap is their markup. Wise quotes the mid-market rate and charges an explicit fee, while many banks keep the rate unfavourable and charge no separate fee — making comparisons hard.",
    related: ["fx", "swift"],
  },
  {
    slug: "neobank",
    term: "Neobank",
    short: "A digital-only bank with no physical branches, usually built on top of a licensed bank.",
    long:
      "Neobanks like Fi, Jupiter, and Open offer accounts, cards, and savings products through a mobile app. In India they are not banks themselves: they partner with small finance banks or payments banks that hold the licence, and wrap the experience in their own app. The 'neo' means no branches and no legacy systems — but also that deposits sit with the partner bank, whose licence rules apply.",
    related: ["small-finance-bank", "payment-bank", "baas", "ppi"],
  },
  {
    slug: "open-banking",
    term: "Open Banking",
    short: "Regulated data sharing between banks and licensed third parties, with the customer's consent.",
    long:
      "In India, open banking runs through the RBI's Account Aggregator framework: with one-time consent, an app can read balances and transactions across a customer's banks via licensed aggregators. The same idea drives Europe's PSD2 and Brazil's Open Finance. For fintechs, it turns bank data into a product — instant loan underwriting, spend insights, and portfolio tracking.",
    related: ["account-aggregator", "api", "neobank"],
  },
  {
    slug: "pci-dss",
    term: "PCI-DSS",
    full: "Payment Card Industry Data Security Standard",
    short: "A set of security rules for any company that stores, processes, or transmits cardholder data.",
    long:
      "PCI-DSS is enforced by the card networks (Visa, Mastercard, Amex) rather than governments. Compliance levels depend on transaction volume, and requirements tighten at higher volumes. Most Indian merchants and startups use gateway-hosted checkout so they never see raw card numbers and stay out of PCI scope — the gateway holds the certification.",
    related: ["payment-aggregator", "fraud", "coa"],
  },
  {
    slug: "stablecoin",
    term: "Stablecoin",
    short: "A cryptocurrency whose value is pegged to a traditional asset, usually the US dollar.",
    long:
      "Stablecoins like USDC and USDT are designed to hold a constant value, backed by reserves such as US Treasuries. They are the bridge between traditional finance and crypto: dollars that move on a blockchain 24/7, which is why global payment companies are building stablecoin rails for cross-border settlement. In India they remain part of the VDA framework for tax and FIU registration purposes.",
    related: ["crypto", "defi", "vda"],
  },
  {
    slug: "treasury",
    term: "Treasury (Product)",
    short: "A product that lets a business manage cash, run payments, and earn yield on idle balances.",
    long:
      "Beyond the corporate-finance function, 'Treasury' in fintech describes cash-management products: pooled accounts, bulk payments, and yield on idle balances, usually built on a partner bank's licence. Razorpay's Current account and Cashfree's settlement products are Indian examples — balances sit with partner banks, and the fintech layers payment automation on top.",
    related: ["baas", "api", "account-aggregator"],
  },
  {
    slug: "upi",
    term: "UPI",
    full: "Unified Payments Interface",
    short: "India's instant bank-to-bank payment rail — the default way Indians pay.",
    long:
      "UPI is the NPCI-run system that moves money between Indian bank accounts in seconds, 24/7, using a mobile number, UPI ID, or QR code. It is free for consumers and powers PhonePe, Google Pay, Paytm, and every bank's app. For merchants, UPI acceptance carries zero MDR by regulation, which is why Indian gateways bundle it with cards at one flat rate. Any India-focused payment stack must treat UPI as the default rail.",
    related: ["tpap", "ppi", "imps", "mdr", "rtp", "soundbox"],
  },
  {
    slug: "mdr",
    term: "MDR",
    full: "Merchant Discount Rate",
    short: "The fee merchants pay per card or UPI transaction — zero for UPI in India.",
    long:
      "MDR is the percentage (plus any fixed fee) a merchant pays for each payment — interchange plus gateway and processor costs. In India, UPI transactions carry zero MDR by regulation, while card MDRs typically run 1–2% and are set by the card networks. That is why gateway pricing like Razorpay's '2% on all domestic instruments' bundles UPI, cards, netbanking, and wallets at one flat rate.",
    related: ["interchange", "upi", "payment-aggregator"],
  },
  {
    slug: "firc",
    term: "FIRC / FIRA",
    full: "Foreign Inward Remittance Certificate / Advice",
    short: "The document proving foreign currency legally received in India.",
    long:
      "A FIRC (or FIRA, its bank-advice variant) is the certificate Indian banks issue for each inward foreign remittance, showing sender, amount, and exchange rate. Freelancers and exporters use FIRCs to prove income legally received under FEMA, to claim tax deductions, and to document export earnings. Keep a copy for every international payment you receive — you will need them for tax filings.",
    related: ["fema", "fx", "lrs"],
  },
  {
    slug: "fema",
    term: "FEMA",
    full: "Foreign Exchange Management Act",
    short: "India's law governing how foreign currency can be received, held, and converted.",
    long:
      "FEMA is the RBI-administered law regulating every foreign-exchange transaction involving India. For freelancers and businesses it matters in three ways: receiving payment for services is legal and automatic (no RBI approval needed), foreign currency received must be converted to INR or held in an eligible account, and conversion must happen through an authorised dealer or compliant platform. Violations carry penalties — which is why Wise and Payoneer route through RBI-compliant structures.",
    related: ["firc", "lrs", "fx"],
  },
  {
    slug: "t-plus-one",
    term: "T+1 Settlement",
    short: "Payment funds land in your account one business day after the transaction.",
    long:
      "T+1 means a transaction settles one business day after it happens: Monday's sales credit Tuesday, Friday's sales credit Monday. Indian gateways like Razorpay and Cashfree advertise T+1 as standard settlement, with instant options on request. T+1 matters for cash flow — a settlement delay can hurt a small business more than the processing fee itself.",
    related: ["rtgs", "imps", "payment-aggregator", "nach"],
  },
  {
    slug: "rtp",
    term: "RTP",
    full: "Real-Time Payments",
    short: "Payment networks that settle in seconds, 24/7/365 — UPI in India, FedNow in the US.",
    long:
      "Real-time payment networks settle in seconds, 24/7/365: India's UPI and IMPS, Brazil's Pix, the UK's Faster Payments, and in the US the FedNow service. The practical effect is that 'the money arrived instantly' is now the default expectation, and batch rails like NEFT are reserved for larger, time-tolerant transfers.",
    related: ["upi", "imps", "rtgs"],
  },
  {
    slug: "rbi",
    term: "RBI",
    full: "Reserve Bank of India",
    short: "India's central bank and the regulator that licenses most payment and lending companies.",
    long:
      "The RBI issues money, runs monetary policy, and regulates banks, NBFCs, payment aggregators, PPIs, small finance banks, and account aggregators. Its licences appear throughout this directory: PA-O (payment aggregator online), PPI (prepaid instruments), and CoA (Certificate of Authorisation). For any India fintech, an RBI licence is the difference between operating legally and in a grey zone.",
    related: ["payment-aggregator", "ppi", "nbfc", "coa", "irdai"],
  },
  {
    slug: "nbfc",
    term: "NBFC",
    full: "Non-Banking Financial Company",
    short: "A company registered with the RBI that lends or invests, without being a bank.",
    long:
      "NBFCs perform banking-like functions — lending, investing, leasing — but cannot accept demand deposits and are not covered by deposit insurance. They are the workhorse structure of Indian fintech: most digital lenders, fintech arms of business groups, and microfinance companies operate as RBI-registered NBFCs with a Certificate of Registration.",
    related: ["rbi", "hfc", "nbfc-mfi", "nbfc-p2p", "treds"],
  },
  {
    slug: "nbfc-mfi",
    term: "NBFC-MFI",
    full: "Non-Banking Financial Company – Micro Finance Institution",
    short: "An RBI-registered NBFC that lends small amounts to low-income borrowers.",
    long:
      "NBFC-MFIs are licensed by the RBI to provide micro-loans — typically small, short-tenor, group-based lending to low-income households. The RBI sets caps on loan size, interest rates, and margin, and requires fair-pricing disclosure. Many Indian digital lenders serving underserved borrowers hold this licence rather than a full banking one.",
    related: ["nbfc", "business-correspondent", "rbi"],
  },
  {
    slug: "nbfc-p2p",
    term: "NBFC-P2P",
    full: "NBFC – Peer-to-Peer Lending Platform",
    short: "An RBI-registered platform that matches retail lenders with borrowers.",
    long:
      "NBFC-P2P platforms (Faircent, LenDenClub, LiquiLoans) operate under an RBI certificate that lets them connect lenders and borrowers directly, without taking deposits or lending their own books. The RBI caps individual lending exposure per borrower and requires disclosure of risk and defaults. The platform earns a facilitation fee; the credit risk sits with the lender.",
    related: ["nbfc", "rbi", "apr"],
  },
  {
    slug: "hfc",
    term: "HFC",
    full: "Housing Finance Company",
    short: "An RBI-regulated NBFC that specialises in home loans.",
    long:
      "HFCs provide housing finance: home loans, loan-against-property, and construction finance. They were historically registered with the National Housing Bank and today are regulated by the RBI as a distinct NBFC class. Their loan products power the home-loan market alongside scheduled banks, and many are listed on Indian exchanges.",
    related: ["nbfc", "emi", "rbi"],
  },
  {
    slug: "payment-aggregator",
    term: "Payment Aggregator (PA)",
    short: "The RBI-licensed middle layer between a merchant and the customer's payment method.",
    long:
      "A payment aggregator is the RBI-licensed company that lets merchants accept cards, UPI, netbanking, and wallets — bundling them behind one integration. The licence marks matter: PA-O (online) authorises internet payments, PA-CB (cross-border) authorises inbound international payments, PA-CB-E&I covers exports and imports, and PA-P (offline) covers point-of-sale. Razorpay, Cashfree, and PayU hold these licences. Without a PA licence, no aggregating; gateways without it can only onboard their own merchants' flows.",
    related: ["coa", "ppi", "tpap", "mdr", "rbi", "bbopu"],
  },
  {
    slug: "coa",
    term: "CoA",
    full: "Certificate of Authorisation",
    short: "The RBI document that proves a payment company is licensed to operate.",
    long:
      "A Certificate of Authorisation is issued by the RBI to regulated payment entities — payment aggregators and PPI issuers — after they meet net-worth, capital, and governance requirements. When a directory profile lists 'RBI PA-O CoA', it means the company holds an authorisation certificate, not just a pending application. CoAs are public; you can verify them on the RBI's website.",
    related: ["payment-aggregator", "ppi", "rbi"],
  },
  {
    slug: "ppi",
    term: "PPI",
    full: "Prepaid Payment Instruments",
    short: "RBI-licensed wallets and prepaid cards that hold money before it is spent.",
    long:
      "PPIs are the RBI's category for wallets, prepaid cards, and gift cards — money loaded in advance, then spent. The RBI splits them into small (₹10,000 limit, minimal KYC), medium, and full-KYC tiers, and only full-KYC PPIs can be reloaded from bank accounts. Paytm Wallet and Amazon Pay balance are PPIs; merchant UPI QR payments are not.",
    related: ["payment-aggregator", "upi", "tpap", "coa"],
  },
  {
    slug: "tpap",
    term: "TPAP",
    full: "Third-Party Application Provider",
    short: "An RBI-designated UPI app that runs on a bank's UPI infrastructure.",
    long:
      "A TPAP is a UPI app (PhonePe, Google Pay, Paytm) that provides UPI to customers by connecting through a sponsor bank's PSP licence. The RBI requires each TPAP to have a sponsor bank and to meet criteria on the share of UPI transactions they process — the regulator has paused new TPAP onboarding to manage concentration risk. 'TPAP' in a company profile means the firm runs a consumer UPI app.",
    related: ["upi", "payment-aggregator", "ppi", "soundbox"],
  },
  {
    slug: "bbopu",
    term: "BBPOU",
    full: "Bharat BillPay Operating Unit",
    short: "An NPCI-authorized operator of the Bharat BillPay bill-payment network.",
    long:
      "Bharat BillPay is India's centralised bill-payment system, and BBPOUs are the NPCI-authorized operators (billers' banks and third parties) that connect billers to it. A company listed as a BBPOU — like BillDesk or PayU — can collect electricity, telecom, and insurance bill payments through the Bharat BillPay rails on behalf of agents and customers.",
    related: ["payment-aggregator", "upi", "coa"],
  },
  {
    slug: "small-finance-bank",
    term: "Small Finance Bank (SFB)",
    short: "A full banking licence with a mandate to serve unserved and underserved customers.",
    long:
      "SFBs are licensed banks with a social mandate: at least half their loans must go to small borrowers, micro-enterprises, and farmers, and they must open a share of branches in unbanked rural centres. Examples include AU Small Finance Bank, Equitas, and Ujjivan. Their licence lets them accept deposits and lend — and makes them popular BaaS partners for neobanks that cannot hold a licence themselves.",
    related: ["payment-bank", "neobank", "nbfc"],
  },
  {
    slug: "payment-bank",
    term: "Payments Bank",
    short: "A bank licence limited to deposits and payments — no lending.",
    long:
      "Payments banks (Airtel Payments Bank, India Post Payments Bank, Fino) can accept deposits up to ₹2 lakh per customer, issue cards and wallets, and run remittance and bill-pay services — but they cannot lend. They were designed to extend payment access to the unbanked. Their deposits are insured under the DICGC like any bank, and they frequently power fintech payment products underneath.",
    related: ["small-finance-bank", "ppi", "neobank"],
  },
  {
    slug: "account-aggregator",
    term: "Account Aggregator (AA)",
    short: "An RBI-licensed consent layer that shares your bank data with apps you approve.",
    long:
      "Account Aggregators (CAMS, FinsecAA, OneMoney) are RBI-licensed intermediaries in India's open-banking framework. With your one-time digital consent, they pull balances and transaction history from your banks and share them with the app you chose — lenders for instant underwriting, or wealth apps for portfolio tracking. The AA never sees the data; it only brokers consent.",
    related: ["open-banking", "rbi", "api"],
  },
  {
    slug: "business-correspondent",
    term: "Business Correspondent (BC)",
    short: "An agent who delivers banking services in areas without bank branches.",
    long:
      "Business correspondents are retail agents — kirana stores, post offices, mobile money agents — authorised by banks to open accounts, take deposits, and disburse loans on the bank's behalf. The BC model is how India extends banking to villages: companies like Paytm Payments Bank and Mswipe operate large BC networks for customer onboarding and cash-in/cash-out.",
    related: ["nbfc", "rbi", "ppi"],
  },
  {
    slug: "sebi",
    term: "SEBI",
    full: "Securities and Exchange Board of India",
    short: "India's regulator for markets, brokers, advisers, and asset managers.",
    long:
      "SEBI regulates stock exchanges, brokers, portfolio managers (PMS), registered investment advisers (RIAs), mutual funds, and — since 2023 — the crypto ecosystem's oversight partner for securities-like assets. A 'SEBI broker' or 'SEBI PMS' registration in a directory profile means the company is a registered market intermediary, subject to capital and conduct rules.",
    related: ["ria", "pms", "amfi", "vda", "unicorn"],
  },
  {
    slug: "ria",
    term: "RIA",
    full: "Registered Investment Adviser",
    short: "A SEBI-registered professional who gives paid, fiduciary investment advice.",
    long:
      "RIAs are SEBI-registered advisers who charge fees (not commissions) for investment advice, with a fiduciary duty to their clients. Platforms like WealthDesk and many robo-advisers operate under RIA registrations. The registration matters because unregistered 'advice' is a grey market — SEBI requires registration before anyone can charge for personalised investment guidance.",
    related: ["sebi", "pms"],
  },
  {
    slug: "pms",
    term: "PMS",
    full: "Portfolio Management Services",
    short: "A SEBI-registered service where a professional manages a bespoke portfolio for you.",
    long:
      "PMS is SEBI-regulated discretionary or non-discretionary management of a client's portfolio, typically with a minimum investment of ₹50 lakh. PMS firms charge a management fee and often a performance fee, and they build bespoke portfolios rather than off-the-shelf mutual funds. SEBI registration is mandatory and audited; 'SEBI PMS' in a profile means a registered manager.",
    related: ["sebi", "ria"],
  },
  {
    slug: "amfi",
    term: "AMFI",
    full: "Association of Mutual Funds in India",
    short: "The industry body that registers mutual-fund distributors in India.",
    long:
      "AMFI is the trade body of Indian mutual funds. Its ARN (AMFI Registration Number) is what distributors — including many fintech investment apps — hold to sell mutual funds and earn commissions. An 'AMFI distributor' registration in a directory profile means the company can distribute mutual funds under AMFI's code of conduct.",
    related: ["sebi", "ria"],
  },
  {
    slug: "irdai",
    term: "IRDAI",
    full: "Insurance Regulatory and Development Authority of India",
    short: "India's regulator for insurers, brokers, and insurance agents.",
    long:
      "IRDAI licenses life and general insurers, insurance brokers, TPAs (third-party administrators for claims), and web aggregators that sell policies online. Directory profiles carrying 'IRDAI life insurer' or 'IRDAI broker' registration are operating under insurance law, which carries solvency and conduct requirements — a meaningful trust signal compared with unregulated insurance resellers.",
    related: ["sebi", "rbi", "kyc"],
  },
  {
    slug: "soundbox",
    term: "Payment Soundbox",
    short: "The small speaker merchants get that announces every UPI payment aloud.",
    long:
      "A payment soundbox is a Bluetooth/speaker device merchants plug in next to their UPI QR code; when a customer pays, it announces the amount and success. It replaced the 'did the payment come?' anxiety of QR-only collecting and is now standard issue from PhonePe, Paytm, and BharatPe for street vendors and small merchants. Soundboxes are a distribution play: the device locks the merchant into one UPI app.",
    related: ["upi", "ppi", "payment-aggregator"],
  },
  {
    slug: "imps",
    term: "IMPS",
    full: "Immediate Payment Service",
    short: "India's instant 24/7 interbank transfer rail — the engine behind UPI.",
    long:
      "IMPS is the NPCI-run system for instant interbank transfers in India, operating 24/7/365. UPI sits on top of IMPS for settlements, which is why UPI payments move in seconds. IMPS also works through mobile banking and can be used without a UPI app. Unlike NEFT, IMPS has no batch windows — it is genuinely real-time.",
    related: ["upi", "neft", "rtgs"],
  },
  {
    slug: "neft",
    term: "NEFT",
    full: "National Electronic Funds Transfer",
    short: "India's batch interbank transfer rail, free for most consumers.",
    long:
      "NEFT is the RBI-run batch system for interbank transfers in India. Transactions settle in half-hourly batches through the day, with no minimum amount, and banks must not charge customers for NEFT. It is the workhorse for business payments and larger transfers that do not need instant settlement — choose UPI/IMPS for speed, NEFT for size and free cost.",
    related: ["imps", "rtgs", "t-plus-one"],
  },
  {
    slug: "rtgs",
    term: "RTGS",
    full: "Real Time Gross Settlement",
    short: "India's same-day, per-transaction settlement rail for large-value transfers.",
    long:
      "RTGS settles high-value interbank transfers individually (gross, not batched) in real time during banking hours. It is intended for large transactions — typically ₹2 lakh and above — and carries a small fee. Businesses use RTGS for vendor payments and salary runs that need same-day certainty, while consumers use UPI and NEFT for everything else.",
    related: ["neft", "imps", "t-plus-one"],
  },
  {
    slug: "nach",
    term: "NACH",
    full: "National Automated Clearing House",
    short: "India's bulk debit/credit rail — how EMIs, SIPs, and salaries are collected.",
    long:
      "NACH is the NPCI-run system for high-volume, recurring payments: loan EMIs, SIP investments, insurance premiums, and salary credits. Mandates are registered electronically (e-mandates), and debits run in daily cycles. UPI AutoPay has grown for smaller recurring payments, but NACH remains the standard for large and bank-level mandates.",
    related: ["upi", "imps", "payment-aggregator"],
  },
  {
    slug: "lrs",
    term: "LRS",
    full: "Liberalised Remittance Scheme",
    short: "The RBI scheme that lets Indians send up to $250,000 a year abroad.",
    long:
      "LRS is the RBI framework under which resident Indians can remit up to US$250,000 per financial year for education, travel, investment, and medical expenses. Every transfer goes through an authorised dealer bank, which reports it to the RBI and deducts TCS (tax collected at source) above thresholds. If you are sending money abroad as a resident individual, LRS is the legal channel.",
    related: ["fema", "firc", "fx"],
  },
  {
    slug: "swift",
    term: "SWIFT",
    short: "The global messaging network most international bank transfers run on.",
    long:
      "SWIFT is the network banks use to message each other across borders. Most international wires ride SWIFT messages, which is why they take 1–2 business days and carry correspondent-bank fees at both ends. Newer alternatives (Wise's own network, stablecoin rails) bypass SWIFT for speed and cost, but for bank-to-bank transfers SWIFT remains the default — and the reason 'receive the money in USD in your Indian bank' usually costs more than the headline rate.",
    related: ["fx", "mid-market-rate", "firc"],
  },
  {
    slug: "treds",
    term: "TReDS",
    full: "Trade Receivables Discounting System",
    short: "RBI-regulated platforms where MSMEs discount their unpaid invoices.",
    long:
      "TReDS is an RBI-regulated marketplace where micro, small, and medium enterprises can discount receivables from large corporate buyers — getting paid early while the buyer settles later. Three licensed platforms (M1xchange, Invoicemart, RXIL) run the system. For MSMEs it is a way to turn invoices into working capital without taking on loans.",
    related: ["nbfc", "rbi"],
  },
  {
    slug: "vda",
    term: "VDA",
    full: "Virtual Digital Assets",
    short: "India's legal category for crypto — taxed and FIU-regulated, not banned.",
    long:
      "VDA is the Income Tax Act term covering cryptocurrencies and similar digital assets. Key rules: 30% tax on gains plus 1% TDS on transfers, no loss offsetting, and mandatory FIU registration for exchanges and VASP services. The 30%+1% framework is the defining feature of Indian crypto — every exchange works within it, and 'FIU-registered VASP' in a profile means the exchange meets it.",
    related: ["crypto", "stablecoin", "sebi", "kyc"],
  },
  {
    slug: "unicorn",
    term: "Unicorn",
    short: "A private company valued at $1 billion or more.",
    long:
      "A unicorn is a private company whose valuation has crossed $1 billion — in India, think PhonePe, Razorpay, and CRED. The label comes from the startup-investing world and carries no legal weight; valuations are set by the latest funding round and can go down (markdowns) as well as up. Directory profiles use it as shorthand for 'large, VC-scale private company'.",
    related: ["nbfc", "sebi", "rbi"],
  },
  {
    slug: "emi",
    term: "EMI",
    full: "Equated Monthly Installment",
    short: "A fixed monthly payment that repays a loan — principal plus interest — over a set term.",
    long:
      "An EMI is the fixed amount you pay each month to repay a loan: it combines principal and interest so the balance is fully cleared by the term's end. Cardless EMI at checkout splits a purchase into 3–24 installments without a credit card, with the lender (often an NBFC partner) paying the merchant upfront — the same economics as BNPL, arranged through the bank/gateway stack.",
    related: ["bnpl", "apr", "hfc", "nbfc"],
  },
] as const;

/**
 * Maps a category slug to the glossary slugs most relevant to that domain.
 * Maintained here (next to the glossary itself) so term additions stay in sync
 * with the categorized directory rather than being buried in a page component.
 * Only categories with a natural glossary linkage need an entry; categories
 * without one simply render no "Key Domain Terminology" section.
 */
export const categoryGlossaryMap: Record<string, string[]> = {
  payments: ["upi", "mdr", "interchange", "payment-aggregator", "ppi", "tpap", "chargeback", "t-plus-one", "nach"],
  neobanks: ["neobank", "small-finance-bank", "payment-bank", "ppi", "baas"],
  investing: ["sebi", "ria", "pms", "amfi", "crypto", "stablecoin"],
  "cross-border": ["fx", "mid-market-rate", "firc", "fema", "lrs", "swift", "imps"],
  bnpl: ["bnpl", "emi", "interchange", "chargeback"],
  infrastructure: ["api", "baas", "account-aggregator", "open-banking", "treasury"],
  "spend-management": ["api", "treasury", "payment-aggregator", "nach"],
  lending: ["nbfc", "nbfc-p2p", "nbfc-mfi", "hfc", "apr", "emi", "treds"],
  "payroll-hr": ["nach", "imps", "neft"],
  "fraud-security": ["kyc", "fraud", "pci-dss", "chargeback", "coa"],
  insurtech: ["irdai", "kyc", "fraud"],
  proptech: ["apr", "emi", "hfc"],
};

export default glossary;
