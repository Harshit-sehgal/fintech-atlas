import type { CompanyCapabilities } from "./types";

/**
 * Machine-readable capabilities per company (audit #30). The matchmaker scores
 * companies by matching these capabilities against the requirements implied by
 * each quiz answer — so every company can be recommended and adding a company
 * is simply a matter of describing its capabilities here.
 *
 * Vocabulary is intentionally coarse; extend a list rather than inventing
 * free-form strings so requirements can keep matching.
 */

export const COMPANY_CAPABILITIES: Record<string, CompanyCapabilities> = {
  stripe: {
    useCases: ["payments", "billing", "treasury"],
    customerTypes: ["startup", "saas", "ecommerce", "enterprise"],
    channels: ["online", "api"],
    features: ["developer-apis", "multi-currency", "high-volume"],
  },
  paypal: {
    useCases: ["payments", "wallet", "p2p"],
    customerTypes: ["ecommerce", "personal", "enterprise"],
    channels: ["online", "mobile"],
    features: ["trust", "international", "all-in-one"],
  },
  square: {
    useCases: ["pos", "payments", "banking"],
    customerTypes: ["retail", "startup"],
    channels: ["in-person", "online"],
    features: ["hardware", "no-code", "all-in-one"],
  },
  adyen: {
    useCases: ["payments", "acquiring"],
    customerTypes: ["enterprise", "ecommerce"],
    channels: ["api", "online"],
    features: ["developer-apis", "multi-currency", "high-volume"],
  },
  wise: {
    useCases: ["transfers", "multi-currency"],
    customerTypes: ["personal", "startup", "ecommerce"],
    channels: ["online", "mobile"],
    features: ["low-fee", "multi-currency", "international"],
  },
  revolut: {
    useCases: ["banking", "transfers", "investing"],
    customerTypes: ["personal", "startup"],
    channels: ["mobile", "online"],
    features: ["multi-currency", "all-in-one", "low-fee"],
  },
  brex: {
    useCases: ["banking", "corporate-cards", "expenses"],
    customerTypes: ["startup"],
    channels: ["online", "api"],
    features: ["all-in-one", "developer-apis"],
  },
  gusto: {
    useCases: ["payroll", "hr"],
    customerTypes: ["startup"],
    channels: ["online"],
    features: ["no-code", "all-in-one"],
  },
  plaid: {
    useCases: ["infrastructure", "data"],
    customerTypes: ["startup", "enterprise"],
    channels: ["api"],
    features: ["developer-apis"],
  },
  nubank: {
    useCases: ["banking", "cards", "investing"],
    customerTypes: ["personal"],
    channels: ["mobile"],
    features: ["low-fee", "all-in-one"],
  },
  chime: {
    useCases: ["banking", "cards"],
    customerTypes: ["personal"],
    channels: ["mobile"],
    features: ["low-fee", "no-fees"],
  },
  robinhood: {
    useCases: ["investing", "brokerage"],
    customerTypes: ["personal"],
    channels: ["mobile", "online"],
    features: ["low-fee"],
  },
  klarna: {
    useCases: ["bnpl", "payments"],
    customerTypes: ["ecommerce", "personal"],
    channels: ["online"],
    features: ["no-code", "all-in-one"],
  },
  afterpay: {
    useCases: ["bnpl", "payments"],
    customerTypes: ["ecommerce", "personal"],
    channels: ["online"],
    features: ["no-code", "all-in-one"],
  },
  monzo: {
    useCases: ["banking", "cards"],
    customerTypes: ["personal"],
    channels: ["mobile"],
    features: ["low-fee", "all-in-one"],
  },
  n26: {
    useCases: ["banking", "cards"],
    customerTypes: ["personal"],
    channels: ["mobile"],
    features: ["low-fee", "no-fees"],
  },
  adp: {
    useCases: ["payroll", "hr"],
    customerTypes: ["enterprise"],
    channels: ["online"],
    features: ["compliance", "high-volume"],
  },
  "apple-pay": {
    useCases: ["wallet", "payments"],
    customerTypes: ["personal"],
    channels: ["mobile", "in-person"],
    features: ["trust", "hardware"],
  },
  affirm: {
    useCases: ["bnpl", "lending"],
    customerTypes: ["ecommerce", "personal"],
    channels: ["online"],
    features: ["no-code"],
  },
  binance: {
    useCases: ["crypto", "investing"],
    customerTypes: ["personal"],
    channels: ["mobile", "online"],
    features: ["multi-currency"],
  },
  braintree: {
    useCases: ["payments"],
    customerTypes: ["ecommerce", "startup"],
    channels: ["api", "online"],
    features: ["developer-apis", "multi-currency"],
  },
  bunq: {
    useCases: ["banking", "cards"],
    customerTypes: ["personal", "startup"],
    channels: ["mobile"],
    features: ["no-fees", "all-in-one"],
  },
  "cash-app": {
    useCases: ["payments", "p2p", "investing"],
    customerTypes: ["personal"],
    channels: ["mobile"],
    features: ["all-in-one", "low-fee"],
  },
  circle: {
    useCases: ["crypto", "infrastructure"],
    customerTypes: ["startup", "enterprise"],
    channels: ["api"],
    features: ["developer-apis", "multi-currency"],
  },
  coinbase: {
    useCases: ["crypto", "investing"],
    customerTypes: ["personal"],
    channels: ["online", "mobile"],
    features: ["trust"],
  },
  "google-pay": {
    useCases: ["wallet", "payments"],
    customerTypes: ["personal"],
    channels: ["mobile", "in-person"],
    features: ["trust"],
  },
  "mastercard-send": {
    useCases: ["payments", "transfers", "disbursements"],
    customerTypes: ["enterprise"],
    channels: ["api"],
    features: ["developer-apis", "high-volume"],
  },
  "mercado-pago": {
    useCases: ["payments", "banking", "wallet"],
    customerTypes: ["ecommerce", "personal"],
    channels: ["online", "mobile"],
    features: ["all-in-one", "low-fee"],
  },
  moneygram: {
    useCases: ["transfers"],
    customerTypes: ["personal"],
    channels: ["online", "in-person"],
    features: ["international"],
  },
  okx: {
    useCases: ["crypto", "investing"],
    customerTypes: ["personal"],
    channels: ["mobile", "online"],
    features: ["multi-currency", "low-fee"],
  },
  paychex: {
    useCases: ["payroll", "hr"],
    customerTypes: ["startup", "enterprise"],
    channels: ["online"],
    features: ["compliance", "all-in-one"],
  },
  payoneer: {
    useCases: ["transfers", "banking", "payments"],
    customerTypes: ["ecommerce", "startup", "personal"],
    channels: ["online", "api"],
    features: ["international", "multi-currency"],
  },
  paytm: {
    useCases: ["payments", "wallet", "banking"],
    customerTypes: ["personal", "ecommerce"],
    channels: ["mobile"],
    features: ["all-in-one", "low-fee"],
  },
  phonepe: {
    useCases: ["payments", "wallet"],
    customerTypes: ["personal", "ecommerce"],
    channels: ["mobile"],
    features: ["all-in-one", "low-fee"],
  },
  sofi: {
    useCases: ["banking", "investing", "lending"],
    customerTypes: ["personal"],
    channels: ["mobile", "online"],
    features: ["all-in-one"],
  },
  picpay: {
    useCases: ["payments", "banking"],
    customerTypes: ["personal"],
    channels: ["mobile"],
    features: ["all-in-one", "low-fee"],
  },
  razorpay: {
    useCases: ["payments"],
    customerTypes: ["startup", "ecommerce", "saas", "enterprise"],
    channels: ["api", "online", "mobile"],
    features: ["developer-apis", "multi-currency", "international", "low-fee", "all-in-one", "no-code", "high-volume"],
  },
  cashfree: {
    useCases: ["payments"],
    customerTypes: ["ecommerce", "startup", "saas"],
    channels: ["api", "online"],
    features: ["developer-apis", "low-fee", "no-code"],
  },
  starling: {
    useCases: ["banking", "cards"],
    customerTypes: ["personal", "startup"],
    channels: ["mobile"],
    features: ["low-fee", "no-fees"],
  },
  relay: {
    useCases: ["banking"],
    customerTypes: ["startup"],
    channels: ["online"],
    features: ["no-fees", "all-in-one"],
  },
  venmo: {
    useCases: ["p2p", "payments"],
    customerTypes: ["personal"],
    channels: ["mobile"],
    features: ["trust", "low-fee"],
  },
  "visa-direct": {
    useCases: ["payments", "transfers", "disbursements"],
    customerTypes: ["enterprise"],
    channels: ["api"],
    features: ["developer-apis", "high-volume"],
  },
};

