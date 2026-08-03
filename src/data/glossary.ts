import { GlossaryTerm } from "./types";

// Glossary of FinTech terms referenced across the site.
// Definitions are written for a general audience and are intentionally short.
// Cross-references are made via the `related` field (slugs of other terms).

export const glossary: GlossaryTerm[] = [
  {
    slug: "ach",
    term: "ACH",
    full: "Automated Clearing House",
    short: "An electronic network for moving money between US bank accounts.",
    long:
      "ACH is the US system for batch-processed bank-to-bank transfers. It is the rails behind direct deposit, bill pay, and most bank transfers in apps like Venmo and Plaid. ACH transfers are slow (1–3 business days) but cheap (often under $0.10 per transfer), which is why most 'free' fintech products use ACH for funding. Newer versions like Same-Day ACH and the Real Time Payments (RTP) network have reduced settlement times significantly.",
    related: ["interchange", "wire-transfer", "real-time-payments"],
  },
  {
    slug: "apy",
    term: "APY",
    full: "Annual Percentage Yield",
    short: "The real rate of return on a deposit account, including compounding.",
    long:
      "APY tells you how much you'll earn on a savings account over a year, with compound interest factored in. A 4.50% APY on $1,000 means you'll have about $1,045 at the end of the year. APY is a US regulatory standard designed to make interest rates easy to compare. Note: APY is for deposits (what you earn), while APR is for loans (what you pay).",
    related: ["apr"],
  },
  {
    slug: "apr",
    term: "APR",
    full: "Annual Percentage Rate",
    short: "The yearly cost of borrowing, expressed as a percentage.",
    long:
      "APR is the rate a lender charges on a loan or credit card balance, before fees. A 20% APR on $1,000 of unpaid credit-card balance accrues about $200 of interest per year. APR is for what you pay; APY is for what you earn.",
    related: ["apy", "bnpl"],
  },
  {
    slug: "api",
    term: "API",
    full: "Application Programming Interface",
    short: "A contract that lets one piece of software talk to another.",
    long:
      "An API is a defined way for one program to request data or actions from another. In fintech, APIs power everything: when Robinhood routes an order to the stock exchange, when Plaid pulls a balance from your bank, or when Stripe charges a credit card. Stripe, Plaid, and others sell 'developer-first' APIs — meaning their products are designed to be used by software engineers, with documentation and code samples.",
    related: ["open-banking", "baas"],
  },
  {
    slug: "baas",
    term: "BaaS",
    full: "Banking-as-a-Service",
    short: "Outsourcing bank operations to a licensed provider so you can offer banking features inside your own app.",
    long:
      "BaaS providers (like Unit, Synctera, Stripe Treasury, and Treasury Prime) hold the bank charter or partner with one, and let non-banks offer FDIC-insured accounts, ACH, and card issuing inside their own products. Shopify Balance and Lyft Direct are real-world BaaS products: built on top of a partner bank, branded as the platform.",
    related: ["api", "fdic", "treasury", "pci-dss", "neobank"],
  },
  {
    slug: "bnpl",
    term: "BNPL",
    full: "Buy Now, Pay Later",
    short: "Splitting a purchase into interest-free installments at checkout.",
    long:
      "BNPL providers (Klarna, Afterpay, Affirm) pay the merchant in full at the time of sale, then collect the amount from the shopper in fixed installments — often four payments, the first due at the time of purchase. Merchants pay a fee (typically 4–9% of the order) because BNPL increases conversion and average order value. Shoppers pay 0% interest if they make every payment on time, but missed payments can hit credit reports and carry late fees. The model is roughly the modern version of layaway — except you get the product immediately.",
    related: ["interchange"],
  },
  {
    slug: "chargeback",
    term: "Chargeback",
    short: "A reversal of a credit-card payment initiated by the cardholder's bank.",
    long:
      "If a customer disputes a charge on their credit card — for fraud, non-delivery, or a defective product — their bank can pull the money back from the merchant, even if the merchant has already shipped. Chargebacks cost merchants the original sale, a fee (often $15–$25), and potentially a higher processing rate. Stripe, Adyen, and others help merchants fight chargebacks by submitting evidence (delivery confirmation, customer communications).",
    related: ["interchange", "fraud", "bnpl"],
  },
  {
    slug: "crypto",
    term: "Cryptocurrency",
    short: "A digital asset secured by cryptography and recorded on a public ledger called a blockchain.",
    long:
      "Cryptocurrencies like Bitcoin and Ethereum use cryptographic techniques to make transactions tamper-resistant. The blockchain (a shared, append-only ledger maintained by many computers) is the public record of who owns what. Cryptocurrencies enable peer-to-peer transfers without a bank, but the regulatory, tax, and security treatment varies widely by country. Robinhood, Revolut, Nubank, and others offer in-app crypto trading, while 'self-custody' wallets like MetaMask give users direct control.",
    related: ["defi", "stablecoin", "pfof"],
  },
  {
    slug: "defi",
    term: "DeFi",
    full: "Decentralized Finance",
    short: "Financial applications built on public blockchains, with no bank in the middle.",
    long:
      "DeFi protocols (Uniswap, Aave, Compound) recreate traditional financial services — lending, exchange, savings — using smart contracts on blockchains like Ethereum. Instead of trusting a bank, users trust code. The trade-off is complexity, risk of smart-contract bugs, and a regulatory landscape that is still being written.",
    related: ["crypto", "stablecoin"],
  },
  {
    slug: "e-money",
    term: "E-Money / E-Money Institution",
    short: "A license that lets a fintech hold customer funds in segregated accounts, without being a chartered bank.",
    long:
      "In Europe, the UK, and elsewhere, fintechs can apply for an e-money license (EMI) that lets them hold customer balances in segregated bank accounts and issue payment instruments like cards. The license has lighter capital and reporting requirements than a full bank charter, which is why Revolut, Wise, and many others start as e-money institutions and later pursue full banking licenses as they grow.",
    related: ["baas", "fdic", "neobank"],
  },
  {
    slug: "fdic",
    term: "FDIC",
    full: "Federal Deposit Insurance Corporation",
    short: "US agency that insures bank deposits up to $250,000 per depositor, per bank, per ownership category.",
    long:
      "The FDIC was created in 1933 to restore public confidence in banks after the Great Depression. Today, when a US bank fails, the FDIC reimburses insured deposits up to $250,000. Many fintechs (Chime, Revolut US, Mercury) are not themselves banks, but they partner with FDIC-insured banks so that customer deposits are protected. Some fintechs sweep deposits across multiple partner banks to extend coverage well above $250,000 — Mercury offers up to $5M in coverage via this model.",
    related: ["e-money", "baas"],
  },
  {
    slug: "fraud",
    term: "Fraud Detection",
    short: "Using signals and machine learning to block unauthorized or illegitimate transactions.",
    long:
      "Modern fraud engines analyze dozens of signals on every transaction: device fingerprint, IP geolocation, transaction velocity, behavioral history, card-network risk scores, and more. They return a real-time decision (allow, deny, review) within milliseconds. Stripe Radar, Adyen RevenueProtect, and SentiLink are examples of purpose-built fraud tools. The goal is to block fraud without also blocking good customers — a balance that's very hard to get right.",
    related: ["chargeback", "kyc"],
  },
  {
    slug: "fx",
    term: "FX",
    full: "Foreign Exchange",
    short: "Converting one currency to another, with a fee that is sometimes hidden in the rate.",
    long:
      "When you exchange dollars for euros, the bank or service is selling you one currency and buying another. They make money in two ways: an explicit fee, and/or a markup on the exchange rate. Wise and Revolut quote the real mid-market rate (the midpoint of the buy/sell prices on global FX markets) and show their fee separately. Banks typically hide a 1–3% markup in the rate itself, which is hard to see.",
    related: ["mid-market-rate", "wire-transfer"],
  },
  {
    slug: "interchange",
    term: "Interchange Fee",
    short: "The fee a merchant's bank pays the cardholder's bank for processing a card transaction.",
    long:
      "Every time you swipe a Visa or Mastercard, the merchant's bank pays a small percentage of the transaction to your bank. This is interchange. It's set by the card networks (not by your bank or by Stripe). For a US Visa debit card, interchange is around 0.05% + $0.21; for a rewards credit card, it can be 1.5%–2.5%. Processors like Stripe bundle interchange into their published rate; Adyen's Interchange++ pricing passes it through with a small markup on top.",
    related: ["chargeback", "ach"],
  },
  {
    slug: "kyc",
    term: "KYC / AML",
    full: "Know Your Customer / Anti-Money Laundering",
    short: "Regulations that require financial firms to verify customer identity and monitor for suspicious activity.",
    long:
      "KYC and AML are the compliance backbones of banking. When you sign up for a fintech account, you'll typically be asked to upload a government ID and a selfie. The fintech then verifies the documents, runs sanction-list checks, and monitors account activity for red flags. The rules are designed to prevent money laundering, terrorism financing, and identity fraud. Persona, Alloy, and Veriff are major KYC vendors.",
    related: ["fraud", "open-banking", "pci-dss"],
  },
  {
    slug: "mid-market-rate",
    term: "Mid-Market Exchange Rate",
    short: "The midpoint between the buy and sell prices of a currency on global FX markets — the 'real' rate.",
    long:
      "The mid-market rate is what banks and money-transfer services use when trading with each other. It's also the rate you'll see when you google 'USD to EUR.' When a bank or fintech quotes you a different rate, the difference is their markup. Wise and Revolut quote the mid-market rate and charge an explicit fee, while most banks keep the rate unfavorable and don't charge a separate fee — making it hard to compare.",
    related: ["fx"],
  },
  {
    slug: "neobank",
    term: "Neobank",
    short: "A digital-only bank with no physical branches, usually built on top of a partner bank's license.",
    long:
      "Neobanks like Chime, Revolut, Nubank, and Monzo offer checking accounts, debit cards, and increasingly credit and investing — all through a mobile app. Most are not chartered banks themselves; they partner with a regulated bank to hold deposits. The 'neo' refers to the fact that they have no branch network, no legacy IT, and are built from a clean sheet. Most neobanks make money from interchange (a small percentage of every swipe on their card).",
    related: ["fdic", "e-money", "baas"],
  },
  {
    slug: "open-banking",
    term: "Open Banking",
    short: "Regulations that require banks to share customer data with authorized third parties, with the customer's consent.",
    long:
      "In Europe, the UK, Brazil, and increasingly the US, regulations like PSD2 (EU), the CFPB's Section 1033 (US), and Open Finance (Brazil) require banks to expose customer data via standardized APIs, with the customer's permission. This is the regulatory foundation behind Plaid in the US and behind most cross-border and account-aggregation fintechs globally. The idea: you own your financial data, and you should be able to share it with whoever you trust.",
    related: ["api", "kyc"],
  },
  {
    slug: "pci-dss",
    term: "PCI-DSS",
    full: "Payment Card Industry Data Security Standard",
    short: "A set of security rules for any company that stores, processes, or transmits cardholder data.",
    long:
      "PCI-DSS is enforced by the card networks (Visa, Mastercard, Amex) rather than governments. Compliance has four levels depending on transaction volume, and the requirements get stricter at higher volumes. The practical implication: most startups use Stripe Elements or Checkout so that they never see raw card numbers and are not in PCI scope. Companies that store card numbers directly face an annual audit.",
    related: ["api", "fraud"],
  },
  {
    slug: "pfof",
    term: "PFOF",
    full: "Payment for Order Flow",
    short: "A practice where brokers are paid by market makers for routing customer orders to them.",
    long:
      "When you place a market order on Robinhood, the broker routes it to a market maker (Citadel Securities, Virtu) rather than directly to the NYSE or Nasdaq. The market maker pays the broker a fraction of a cent per share for the privilege. PFOF is how Robinhood, Webull, and others can offer zero-commission trading. Critics argue that the implicit 'price improvement' from PFOF is smaller than the broker claims; defenders argue it's a net win for retail traders.",
    related: ["interchange"],
  },
  {
    slug: "real-time-payments",
    term: "RTP",
    full: "Real-Time Payments",
    short: "Networks that settle bank transfers in seconds rather than days.",
    long:
      "In the US, the Real Time Payments network (run by The Clearing House, a consortium of large banks) and the Fed's FedNow service settle payments in seconds, 24/7/365. Brazil's Pix, India's UPI, and the UK's Faster Payments have all done similar things at much larger scale. As RTP rolls out, the ACH network will remain for batch payments but is increasingly displaced for consumer use cases.",
    related: ["ach", "wire-transfer"],
  },
  {
    slug: "stablecoin",
    term: "Stablecoin",
    short: "A cryptocurrency whose value is pegged to a traditional asset, usually the US dollar.",
    long:
      "Stablecoins like USDC, USDT, and PYUSD are designed to be 'stable' — $1 of USDC is always worth about $1. They achieve this by holding reserves (US Treasury bills in the case of USDC) or by algorithm. Stablecoins are the bridge between traditional finance and crypto: they make it easy to move dollars on a blockchain 24/7, which is why Stripe, Visa, and Mastercard are all building stablecoin rails.",
    related: ["crypto", "defi"],
  },
  {
    slug: "treasury",
    term: "Treasury (Product)",
    short: "In the fintech sense, a product that lets a business manage cash, run payments, and earn yield on idle balances.",
    long:
      "Beyond the corporate-finance function, 'Treasury' in fintech is used by Stripe (Stripe Treasury) and Mercury (Mercury Treasury) to describe a banking-and-cash-management product offered through a partner bank. It typically includes FDIC-insured accounts, ACH and wire capability, and yield on idle balances. In Brazil, the word 'tesouro' also refers to the government's bond program (Tesouro Direto) where citizens can buy sovereign debt directly.",
    related: ["baas", "fdic"],
  },
  {
    slug: "wire-transfer",
    term: "Wire Transfer",
    short: "A bank-to-bank transfer that settles same-day, typically with a fee.",
    long:
      "Domestic wires in the US typically settle within hours, and international wires take 1–2 business days. Fees range from $15 (US domestic) to $50+ (international). Wires are reliable but expensive, which is why fintechs prefer ACH for routine payments. SWIFT is the network used for most international wires.",
    related: ["ach", "real-time-payments"],
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
  payments: ["ach", "interchange", "chargeback", "api", "real-time-payments"],
  neobanks: ["baas", "fdic", "e-money", "apy", "neobank"],
  investing: ["crypto", "defi", "apy", "apr", "stablecoin", "pfof"],
  "cross-border": ["fx", "mid-market-rate", "e-money", "ach", "wire-transfer"],
  bnpl: ["bnpl", "interchange", "chargeback"],
  infrastructure: ["api", "baas", "open-banking", "treasury"],
  "spend-management": ["api", "treasury", "interchange"],
  lending: ["apr", "apy", "baas"],
  "payroll-hr": ["ach", "treasury"],
  "fraud-security": ["kyc", "fraud", "pci-dss", "chargeback"],
  insurtech: ["kyc", "fraud"],
  proptech: ["apr", "apy"],
};

export default glossary;
