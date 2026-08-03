/**
 * Logo manifest — single source of truth for how each company's brand mark
 * is rendered by <CompanyLogo /> in src/components/ui/company-logo.tsx.
 *
 * Each entry is the `slugs.simpleicons.org` slug for the brand's OFFICIAL
 * logo (the actual brand mark, served by simple-icons under CC0-friendly
 * terms). The fetch-logos.ts script downloads these into public/logos/.
 *
 *   - A string slug  → render the downloaded /logos/<fintechSlug>.svg on a
 *                     neutral tile (or brand-tinted tile if `bg` is set).
 *   - null           → fall back to the hand-drawn inline shape in
 *                     company-logo.tsx's `logoShapes` map.
 *
 * Keeping this as a `.ts` module (not JSON) means the build and the editor
 * both type-check the mapping against the slug strings.
 */


export type LogoEntry = { si: string | null; bg?: string };

/**
 * Map of fintechSlug -> { si: simpleiconsSlug }. Brands whose official mark
 * simple-icons does not carry are `null` and render via the inline fallback.
 * `bg` overrides the neutral tile color for brands with a branded background
 * (Apple Pay, Wise, Klarna …) so the mark sits on its authentic surface.
 */
export const LOGO_MANIFEST: Record<string, LogoEntry> = {
  // ── Payments / cards (real official marks) ──
  stripe: { si: "stripe" },
  paypal: { si: "paypal" },
  adyen: { si: "adyen" },
  square: { si: "square" },
  "cash-app": { si: "cashapp" },
  "apple-pay": { si: "applepay", bg: "#000000" },
  "google-pay": { si: "googlepay" },
  "visa-direct": { si: "visa" },
  "mastercard-send": { si: "mastercard" },
  razorpay: { si: "razorpay" },
  moneygram: { si: "moneygram" },

  // ── Neobanks (real) ──
  revolut: { si: "revolut" },
  nubank: { si: "nubank" },
  n26: { si: "n26" },
  monzo: { si: "monzo" },
  starling: { si: "starlingbank" },
  bunq: { si: "bunq" },

  // ── Investing (real) ──
  robinhood: { si: "robinhood" },
  coinbase: { si: "coinbase" },
  "trade-republic": { si: null }, // not in simple-icons — inline fallback
  "scalable-capital": { si: null },
  "trading-212": { si: null },

  // ── Crypto / digital assets (real) ──
  binance: { si: "binance" },
  okx: { si: "okx" },
  gemini: { si: null },
  bitstamp: { si: null },
  bybit: { si: null },
  circle: { si: "circle" },
  kraken: { si: null },
  ledger: { si: null },
  fireblocks: { si: null },

  // ── BNPL (real) ──
  klarna: { si: "klarna", bg: "#FFA8CD" },
  afterpay: { si: "afterpay" },
  affirm: { si: null },
  zip: { si: null },
  sezzle: { si: null },
  splitit: { si: null },

  // ── Cross-border / FX (real) ──
  wise: { si: "wise", bg: "#9FE870" },
  remitly: { si: null },
  xe: { si: null },
  ofx: { si: null },
  airwallex: { si: null },
  nium: { si: null },
  dlocal: { si: null },
  ebanx: { si: null },
  payoneer: { si: "payoneer" },

  // ── Infrastructure / BaaS (inline) ──
  plaid: { si: null },
  marqeta: { si: null },
  synapse: { si: null },
  galileo: { si: null },
  unit: { si: null },
  increase: { si: null },
  "modern-treasury": { si: null },
  rapyd: { si: null },
  "cross-river": { si: null },
  column: { si: null },
  "lead-bank": { si: null },

  // ── Spend / cards (real partial) ──
  ramp: { si: null },
  brex: { si: "brex", bg: "#FF5C00" },
  divvy: { si: null },
  airbase: { si: null },
  melio: { si: null },

  // ── Payroll / HR (real) ──
  gusto: { si: "gusto" },
  deel: { si: null },
  rippling: { si: null },
  remote: { si: null },
  adp: { si: "adp" },
  paychex: { si: "paychex" },
  "papaya-global": { si: null },
  multiplier: { si: null },
  "velocity-global": { si: null },
  oyster: { si: null },
  workmotion: { si: null },

  // ── Fraud / identity (inline) ──
  socure: { si: null },
  sift: { si: null },
  forter: { si: null },
  sumsub: { si: null },
  onfido: { si: null },

  // ── Insurtech (inline) ──
  lemonade: { si: null },
  hippo: { si: null },
  oscar: { si: null },
  "next-insurance": { si: null },

  // ── PropTech (inline) ──
  opendoor: { si: null },
  "rocket-mortgage": { si: null },
  "better-com": { si: null },
  blend: { si: null },

  // ── LATAM / Asia / EMEA (real partial) ──
  "mercado-pago": { si: "mercadopago" },
  paytm: { si: "paytm" },
  phonepe: { si: "phonepe" },
  qonto: { si: null },

  // ── Other entries kept inline (no simple-icons availability) ──
  block: { si: null },
  braintree: { si: "braintree" },
  worldpay: { si: null },
  "checkout-com": { si: null },
  mollie: { si: null },
  payu: { si: null },
  chime: { si: null },
  varo: { si: null },
  current: { si: null },
  mercury: { si: null },
  sofi: { si: null },
  ally: { si: null },
  dave: { si: null },
  moneylion: { si: null },
  greenlight: { si: null },
  fidelity: { si: null },
  wealthfront: { si: null },
  betterment: { si: null },
  public: { si: null },
  etoro: { si: null },
  acorns: { si: null },
  stash: { si: null },
  freetrade: { si: null },
  "ig-group": { si: null },
  upgrade: { si: null },
  lendingclub: { si: null },
  upstart: { si: null },
  ondeck: { si: null },
  prosper: { si: null },
  avant: { si: null },
  freshbooks: { si: null },
  taxact: { si: null },
  venmo: { si: "venmo" },
  bitpanda: { si: null },
  "best-egg": { si: null },
  zopa: { si: null },

  // ── Batch #2 additions (95 → 154). Only `relay` resolved on simple-icons;
  // the rest are inline fallbacks (no official mark in the simple-icons set).
  relay: { si: "relay" },
  "amazon-pay": { si: null },
  "anchorage-digital": { si: null },
  bond: { si: null },
  clearbank: { si: null },
  factorial: { si: null },
  gr4vy: { si: null },
  "green-dot": { si: null },
  griffin: { si: null },
  kakaobank: { si: null },
  lendable: { si: null },
  mambu: { si: null },
  "mesh-payments": { si: null },
  monese: { si: null },
  oaknorth: { si: null },
  omnipresent: { si: null },
  ppro: { si: null },
  picpay: { si: "picpay" }, // confirmed available on simple-icons CDN
  "root-insurance": { si: null },
  shift4: { si: null },
  stax: { si: null },
  thunes: { si: null },
  toss: { si: null },
  trulioo: { si: null },
  "uniswap-labs": { si: null },
  vanta: { si: null },
  vivid: { si: null },
  wefox: { si: null },
};

/**
 * Convenience: list of fintech slugs that DO have a real simple-icons logo.
 * The fetch script iterates this to download files into public/logos/.
 */
export const REAL_LOGO_SLUGS: { fintech: string; si: string }[] = Object.entries(
  LOGO_MANIFEST,
)
  .filter(([, v]) => v.si)
  .map(([k, v]) => ({ fintech: k, si: v.si as string }));
