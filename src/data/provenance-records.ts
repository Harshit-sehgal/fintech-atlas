/**
 * Structured provenance migration, kept separate from the editorial company
 * records in `companies.ts` so the two concerns stay loosely coupled.
 *
 * Each entry structures the same broad references the company's legacy
 * `sources: string[]` labels already claimed (official site, aggregators,
 * company reports) into the audited `SourceReference` model:
 * ISO `accessedAt`, a `sourceType`, and which fields the source supports.
 *
 * This is an *editorial migration of already-cited references*, not a claim of
 * new facts. As sources are re-verified, add/refresh links and `effectiveAt`.
 * Access dates default to the migration date; update on re-verification.
 *
 * Track overall coverage with `npm run check:provenance`.
 */

import type { SourceReference } from "./types";

/** Access date for the migration pass. Bump when a record is re-verified. */
export const PROVENANCE_ACCESSED_AT = "2026-08-03";

export const sourceReferencesBySlug: Partial<Record<string, SourceReference[]>> = {
  stripe: [
    {
      id: "official-website",
      publisher: "Stripe",
      title: "Stripe — Official website & developer documentation",
      url: "https://stripe.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "pricing", "products", "customers"],
    },
    {
      id: "crunchbase",
      publisher: "Crunchbase",
      title: "Stripe company profile (founding & funding)",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "editorial-reference",
      supports: ["founders", "employees", "valuation"],
    },
  ],
  adyen: [
    {
      id: "official-website",
      publisher: "Adyen",
      title: "Adyen — Official company site",
      url: "https://www.adyen.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
    {
      id: "filing",
      publisher: "Adyen",
      title: "Adyen annual report — financial disclosures",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "company-report",
      supports: ["employees", "valuation"],
    },
  ],
  paypal: [
    {
      id: "official-website",
      publisher: "PayPal",
      title: "PayPal — Official company site & product docs",
      url: "https://www.paypal.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "pricing", "products", "customers"],
    },
    {
      id: "annual-report",
      publisher: "PayPal",
      title: "PayPal Annual Report (financial disclosures)",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "regulatory-filing",
      supports: ["employees", "valuation"],
    },
  ],
  square: [
    {
      id: "official-website",
      publisher: "Square (Block)",
      title: "Square — Official product site",
      url: "https://squareup.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "pricing", "products", "customers"],
    },
    {
      id: "company-report",
      publisher: "Square (Block)",
      title: "Square (Block) quarterly report — financial disclosures",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "company-report",
      supports: ["employees", "valuation"],
    },
  ],
  wise: [
    {
      id: "official-website",
      publisher: "Wise",
      title: "Wise — Official site & fee transparency pages",
      url: "https://wise.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "pricing", "products", "customers"],
    },
    {
      id: "filing",
      publisher: "Wise",
      title: "Wise annual report — financial disclosures",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "company-report",
      supports: ["employees", "valuation"],
    },
  ],
  revolut: [
    {
      id: "official-website",
      publisher: "Revolut",
      title: "Revolut — Official company site",
      url: "https://www.revolut.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  plaid: [
    {
      id: "official-website",
      publisher: "Plaid",
      title: "Plaid — Official site & API documentation",
      url: "https://plaid.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  brex: [
    {
      id: "official-website",
      publisher: "Brex",
      title: "Brex — Official company site",
      url: "https://www.brex.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  razorpay: [
    {
      id: "official-website",
      publisher: "Razorpay",
      title: "Razorpay — Official company site",
      url: "https://razorpay.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  braintree: [
    {
      id: "official-website",
      publisher: "Braintree",
      title: "Braintree — Official company site",
      url: "https://www.braintreepayments.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  payoneer: [
    {
      id: "official-website",
      publisher: "Payoneer",
      title: "Payoneer — Official company site",
      url: "https://www.payoneer.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  moneygram: [
    {
      id: "official-website",
      publisher: "MoneyGram",
      title: "MoneyGram — Official company site",
      url: "https://www.moneygram.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
    {
      id: "filing",
      publisher: "MoneyGram",
      title: "MoneyGram SEC filing — financial disclosures",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "regulatory-filing",
      supports: ["employees", "valuation"],
    },
  ],
  chime: [
    {
      id: "official-website",
      publisher: "Chime",
      title: "Chime — Official company site",
      url: "https://www.chime.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  monzo: [
    {
      id: "official-website",
      publisher: "Monzo",
      title: "Monzo — Official company site",
      url: "https://monzo.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  n26: [
    {
      id: "official-website",
      publisher: "N26",
      title: "N26 — Official company site",
      url: "https://n26.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  robinhood: [
    {
      id: "official-website",
      publisher: "Robinhood",
      title: "Robinhood — Official company site",
      url: "https://robinhood.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
    {
      id: "filing",
      publisher: "Robinhood",
      title: "Robinhood SEC filing — financial disclosures",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "regulatory-filing",
      supports: ["employees", "valuation"],
    },
  ],
  sofi: [
    {
      id: "official-website",
      publisher: "SoFi",
      title: "SoFi — Official company site",
      url: "https://www.sofi.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
    {
      id: "filing",
      publisher: "SoFi",
      title: "SoFi SEC filing — financial disclosures",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "regulatory-filing",
      supports: ["employees", "valuation"],
    },
  ],
  affirm: [
    {
      id: "official-website",
      publisher: "Affirm",
      title: "Affirm — Official company site",
      url: "https://www.affirm.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
    {
      id: "filing",
      publisher: "Affirm",
      title: "Affirm SEC filing — financial disclosures",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "regulatory-filing",
      supports: ["employees", "valuation"],
    },
  ],
  klarna: [
    {
      id: "official-website",
      publisher: "Klarna",
      title: "Klarna — Official company site",
      url: "https://www.klarna.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  gusto: [
    {
      id: "official-website",
      publisher: "Gusto",
      title: "Gusto — Official company site",
      url: "https://gusto.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  nubank: [
    {
      id: "official-website",
      publisher: "Nubank",
      title: "Nubank — Official company site",
      url: "https://nubank.com.br",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  afterpay: [
    {
      id: "official-website",
      publisher: "Afterpay",
      title: "Afterpay — Official company site",
      url: "https://www.afterpay.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  adp: [
    {
      id: "official-website",
      publisher: "ADP",
      title: "ADP — Official company site",
      url: "https://www.adp.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  "apple-pay": [
    {
      id: "official-website",
      publisher: "Apple",
      title: "Apple Pay — Official product site",
      url: "https://www.apple.com/apple-pay/",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products"],
    },
  ],
  binance: [
    {
      id: "official-website",
      publisher: "Binance",
      title: "Binance — Official company site",
      url: "https://www.binance.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  bunq: [
    {
      id: "official-website",
      publisher: "bunq",
      title: "bunq — Official company site",
      url: "https://www.bunq.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  "cash-app": [
    {
      id: "official-website",
      publisher: "Cash App",
      title: "Cash App — Official product site",
      url: "https://cash.app",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products"],
    },
  ],
  circle: [
    {
      id: "official-website",
      publisher: "Circle",
      title: "Circle — Official company site",
      url: "https://www.circle.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  coinbase: [
    {
      id: "official-website",
      publisher: "Coinbase",
      title: "Coinbase — Official company site",
      url: "https://www.coinbase.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
    {
      id: "filing",
      publisher: "Coinbase",
      title: "Coinbase SEC filing — financial disclosures",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "regulatory-filing",
      supports: ["employees", "valuation"],
    },
  ],
  "google-pay": [
    {
      id: "official-website",
      publisher: "Google",
      title: "Google Pay — Official product site",
      url: "https://pay.google.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products"],
    },
  ],
  "mastercard-send": [
    {
      id: "official-website",
      publisher: "Mastercard",
      title: "Mastercard Send — Official product site",
      url: "https://www.mastercard.com/send",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products"],
    },
  ],
  "mercado-pago": [
    {
      id: "official-website",
      publisher: "Mercado Pago",
      title: "Mercado Pago — Official company site",
      url: "https://www.mercadopago.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  okx: [
    {
      id: "official-website",
      publisher: "OKX",
      title: "OKX — Official company site",
      url: "https://www.okx.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  paychex: [
    {
      id: "official-website",
      publisher: "Paychex",
      title: "Paychex — Official company site",
      url: "https://www.paychex.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  paytm: [
    {
      id: "official-website",
      publisher: "Paytm",
      title: "Paytm — Official company site",
      url: "https://paytm.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  phonepe: [
    {
      id: "official-website",
      publisher: "PhonePe",
      title: "PhonePe — Official company site",
      url: "https://www.phonepe.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  picpay: [
    {
      id: "official-website",
      publisher: "PicPay",
      title: "PicPay — Official company site",
      url: "https://picpay.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  starling: [
    {
      id: "official-website",
      publisher: "Starling Bank",
      title: "Starling Bank — Official company site",
      url: "https://www.starlingbank.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  relay: [
    {
      id: "official-website",
      publisher: "Relay",
      title: "Relay — Official company site",
      url: "https://relayfi.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products", "pricing", "customers"],
    },
  ],
  venmo: [
    {
      id: "official-website",
      publisher: "Venmo",
      title: "Venmo — Official product site",
      url: "https://venmo.com",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products"],
    },
  ],
  "visa-direct": [
    {
      id: "official-website",
      publisher: "Visa",
      title: "Visa Direct — Official product site",
      url: "https://usa.visa.com/solutions/visa-direct.html",
      accessedAt: PROVENANCE_ACCESSED_AT,
      sourceType: "official-documentation",
      supports: ["company-profile", "products"],
    },
  ],
};
