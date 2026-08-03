/**
 * Cross-border FX / remittance calculator — currency & provider data.
 *
 * Exchange rates are mid-market snapshots and will diverge from live rates over
 * time. Update the `rate` values periodically or wire the calculator to a live
 * feed for production use. Provider fee models reflect publicly listed pricing
 * as of Q3 2026; they are indicative only.
 */

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  /** Mid-market rate: 1 USD → this many units of `code`. */
  rate: number;
}

export interface RemittanceProviderConfig {
  slug: string;
  name: string;
  /**
   * Fee model: "pct" = percentage of send amount, "fixed" = flat fee,
   * "pct_plus_fixed" = percentage + flat dollar amount.
   */
  feeModel: "pct" | "fixed" | "pct_plus_fixed";
  /** Percentage of send amount (only used by pct / pct_plus_fixed models). */
  feePct: number;
  /** Fixed dollar fee (only used by fixed / pct_plus_fixed models). */
  feeFixed: number;
  /** FX markup percentage applied to mid-market rate (e.g. 3.5 = 3.5 %). */
  fxMargin: number;
  /** Estimated transfer speed. */
  speed: string;
  /** One-line highlight shown underneath provider name. */
  highlight: string;
}

/** Available recipient currencies */
export const CURRENCIES: CurrencyOption[] = [
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.50 },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar", rate: 1.36 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.52 },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", rate: 5.45 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 157.20 },
];

/** Default currency selector value */
export const DEFAULT_CURRENCY: string = "EUR";

/** Default amount slider value */
export const DEFAULT_SEND_AMOUNT: number = 1000;

/** Remittance providers with their fee models */
export const REMITTANCE_PROVIDERS: RemittanceProviderConfig[] = [
  {
    slug: "wise",
    name: "Wise",
    feeModel: "pct_plus_fixed",
    feePct: 0.0043, // 0.43%
    feeFixed: 0.50,   // $0.50 fixed fee
    fxMargin: 0,      // 0% FX markup (mid-market rate)
    speed: "Instant to 1 Day",
    highlight: "Uses true mid-market rate",
  },
  {
    slug: "revolut",
    name: "Revolut",
    feeModel: "pct",
    feePct: 0.005,    // 0.5%
    feeFixed: 0,      // No fixed fee
    fxMargin: 0,      // 0% FX markup
    speed: "Instant",
    highlight: "Great for multi-currency accounts",
  },
  {
    slug: "paypal",
    name: "PayPal / Xoom",
    feeModel: "fixed",
    feePct: 0,        // No percentage fee
    feeFixed: 4.99,   // $4.99 fixed fee
    fxMargin: 3.5,    // 3.5% FX markup
    speed: "1 to 3 Days",
    highlight: "High brand familiarity, but expensive FX spread",
  },
  {
    slug: "bank",
    name: "Traditional Bank",
    feeModel: "fixed",
    feePct: 0,        // No percentage fee
    feeFixed: 35.00,  // $35.00 fixed fee
    fxMargin: 4.5,    // 4.5% FX markup
    speed: "2 to 5 Days",
    highlight: "Heavy wire fees & high exchange markup",
  },
];