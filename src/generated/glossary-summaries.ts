// GENERATED FILE — do not edit by hand.
// Derived from src/data/glossary.ts by
// scripts/generate-glossary-summaries.ts (runs automatically in `prebuild`).
// Client-safe subset: only term + one-line definition. The long-form
// definitions live server-side on the static glossary page.

export interface GlossarySummary {
  slug: string;
  term: string;
  short: string;
}

export const glossarySummaries: GlossarySummary[] = [
  { slug: "api", term: "API", short: "A contract that lets one piece of software talk to another." },
  { slug: "apr", term: "APR", short: "The yearly cost of borrowing, expressed as a percentage." },
  { slug: "baas", term: "BaaS", short: "Outsourcing bank operations to a licensed provider so you can offer banking features inside your own app." },
  { slug: "bnpl", term: "BNPL", short: "Splitting a purchase into interest-free installments at checkout." },
  { slug: "chargeback", term: "Chargeback", short: "A reversal of a card payment initiated by the cardholder's bank." },
  { slug: "crypto", term: "Cryptocurrency", short: "A digital asset secured by cryptography and recorded on a public ledger called a blockchain." },
  { slug: "defi", term: "DeFi", short: "Financial applications built on public blockchains, with no bank in the middle." },
  { slug: "fraud", term: "Fraud Detection", short: "Using signals and machine learning to block unauthorized or illegitimate transactions." },
  { slug: "fx", term: "FX", short: "Converting one currency to another, with a fee that is sometimes hidden in the rate." },
  { slug: "interchange", term: "Interchange Fee", short: "The fee the merchant's bank pays the cardholder's bank for processing a card transaction." },
  { slug: "kyc", term: "KYC / AML", short: "Regulations that require financial firms to verify customer identity and monitor for suspicious activity." },
  { slug: "mid-market-rate", term: "Mid-Market Exchange Rate", short: "The midpoint between the buy and sell prices of a currency on global FX markets — the 'real' rate." },
  { slug: "neobank", term: "Neobank", short: "A digital-only bank with no physical branches, usually built on top of a licensed bank." },
  { slug: "open-banking", term: "Open Banking", short: "Regulated data sharing between banks and licensed third parties, with the customer's consent." },
  { slug: "pci-dss", term: "PCI-DSS", short: "A set of security rules for any company that stores, processes, or transmits cardholder data." },
  { slug: "stablecoin", term: "Stablecoin", short: "A cryptocurrency whose value is pegged to a traditional asset, usually the US dollar." },
  { slug: "treasury", term: "Treasury (Product)", short: "A product that lets a business manage cash, run payments, and earn yield on idle balances." },
  { slug: "upi", term: "UPI", short: "India's instant bank-to-bank payment rail — the default way Indians pay." },
  { slug: "mdr", term: "MDR", short: "The fee merchants pay per card or UPI transaction — zero for UPI in India." },
  { slug: "firc", term: "FIRC / FIRA", short: "The document proving foreign currency legally received in India." },
  { slug: "fema", term: "FEMA", short: "India's law governing how foreign currency can be received, held, and converted." },
  { slug: "t-plus-one", term: "T+1 Settlement", short: "Payment funds land in your account one business day after the transaction." },
  { slug: "rtp", term: "RTP", short: "Payment networks that settle in seconds, 24/7/365 — UPI in India, FedNow in the US." },
  { slug: "rbi", term: "RBI", short: "India's central bank and the regulator that licenses most payment and lending companies." },
  { slug: "nbfc", term: "NBFC", short: "A company registered with the RBI that lends or invests, without being a bank." },
  { slug: "nbfc-mfi", term: "NBFC-MFI", short: "An RBI-registered NBFC that lends small amounts to low-income borrowers." },
  { slug: "nbfc-p2p", term: "NBFC-P2P", short: "An RBI-registered platform that matches retail lenders with borrowers." },
  { slug: "hfc", term: "HFC", short: "An RBI-regulated NBFC that specialises in home loans." },
  { slug: "payment-aggregator", term: "Payment Aggregator (PA)", short: "The RBI-licensed middle layer between a merchant and the customer's payment method." },
  { slug: "coa", term: "CoA", short: "The RBI document that proves a payment company is licensed to operate." },
  { slug: "ppi", term: "PPI", short: "RBI-licensed wallets and prepaid cards that hold money before it is spent." },
  { slug: "tpap", term: "TPAP", short: "An RBI-designated UPI app that runs on a bank's UPI infrastructure." },
  { slug: "bbopu", term: "BBPOU", short: "An NPCI-authorized operator of the Bharat BillPay bill-payment network." },
  { slug: "small-finance-bank", term: "Small Finance Bank (SFB)", short: "A full banking licence with a mandate to serve unserved and underserved customers." },
  { slug: "payment-bank", term: "Payments Bank", short: "A bank licence limited to deposits and payments — no lending." },
  { slug: "account-aggregator", term: "Account Aggregator (AA)", short: "An RBI-licensed consent layer that shares your bank data with apps you approve." },
  { slug: "business-correspondent", term: "Business Correspondent (BC)", short: "An agent who delivers banking services in areas without bank branches." },
  { slug: "sebi", term: "SEBI", short: "India's regulator for markets, brokers, advisers, and asset managers." },
  { slug: "ria", term: "RIA", short: "A SEBI-registered professional who gives paid, fiduciary investment advice." },
  { slug: "pms", term: "PMS", short: "A SEBI-registered service where a professional manages a bespoke portfolio for you." },
  { slug: "amfi", term: "AMFI", short: "The industry body that registers mutual-fund distributors in India." },
  { slug: "irdai", term: "IRDAI", short: "India's regulator for insurers, brokers, and insurance agents." },
  { slug: "soundbox", term: "Payment Soundbox", short: "The small speaker merchants get that announces every UPI payment aloud." },
  { slug: "imps", term: "IMPS", short: "India's instant 24/7 interbank transfer rail — the engine behind UPI." },
  { slug: "neft", term: "NEFT", short: "India's batch interbank transfer rail, free for most consumers." },
  { slug: "rtgs", term: "RTGS", short: "India's same-day, per-transaction settlement rail for large-value transfers." },
  { slug: "nach", term: "NACH", short: "India's bulk debit/credit rail — how EMIs, SIPs, and salaries are collected." },
  { slug: "lrs", term: "LRS", short: "The RBI scheme that lets Indians send up to $250,000 a year abroad." },
  { slug: "swift", term: "SWIFT", short: "The global messaging network most international bank transfers run on." },
  { slug: "treds", term: "TReDS", short: "RBI-regulated platforms where MSMEs discount their unpaid invoices." },
  { slug: "vda", term: "VDA", short: "India's legal category for crypto — taxed and FIU-regulated, not banned." },
  { slug: "unicorn", term: "Unicorn", short: "A private company valued at $1 billion or more." },
  { slug: "emi", term: "EMI", short: "A fixed monthly payment that repays a loan — principal plus interest — over a set term." },
];
