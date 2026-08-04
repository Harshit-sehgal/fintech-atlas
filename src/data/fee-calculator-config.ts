/**
 * Payment gateway fee calculator — provider pricing tables.
 *
 * Rates below are standard published card-not-present rates and are indicative
 * only. High-volume merchants may qualify for interchange++ or custom enterprise
 * pricing that materially differs. Update these values when a provider changes
 * its public schedule.
 *
 * India (INR) rows follow the provider's published India schedule and carry an
 * explicit 18% GST line on the platform fee — the calculator adds it to the
 * estimate. USD and INR providers are never compared against each other; the
 * calculator works within one currency at a time (see `currency`).
 */

export type FeeCurrency = "USD" | "INR";

export type PricingModel =
  | "published-flat-rate"
  | "estimated"
  | "custom-contract"
  | "interchange-plus";

export interface ProviderFeeConfig {
  slug: string;
  name: string;
  /**
   * Denomination of the pricing schedule. The calculator compares providers
   * within one currency only — never converts across currencies, because
   * gateway rates are set per region and an FX conversion would fabricate
   * precision the source pricing does not have.
   */
  currency: FeeCurrency;
  /** Region label for disambiguation when a brand appears in multiple regions. */
  region?: string;
  /**
   * Goods & Services Tax applied ON TOP of the platform fee (India). The
   * calculator adds `base fee × gstPercent / 100` to the estimate. Only set
   * for providers whose published schedule carries an explicit GST line.
   */
  gstPercent?: number;
  /** How directly this estimate maps to a provider's public pricing. */
  pricingModel: PricingModel;
  /** Assumptions that materially limit comparability. */
  estimateAssumptions?: string[];
  /**
   * Bar-chart fill colour for this provider. Must stay visible against the
   * `--border-color` track in BOTH light and dark themes — the calculator's
   * track is a faint neutral, so avoid near-black brand colours here; use a
   * bright, recognisable brand tone (see company-logo.tsx for the canonical
   * per-brand mark colour).
   */
  logo: string;
  /** One-liner shown underneath the bar. */
  note: string;
  /** Domestic and international online rates. */
  online: {
    /** Domestic card-not-present percentage (e.g. 0.029 = 2.9%). */
    domPct: number;
    /** Domestic per-transaction fixed fee in the provider's currency. */
    domFixed: number;
    /** International surcharge percentage ADDED ON TOP of domPct (e.g. 0.025 = +2.5%). */
    intlSurcharge: number;
    /**
     * FULL international per-transaction fixed fee in the provider's currency
     * (e.g. Stripe US $0.30). This is the total international fixed fee — NOT
     * a surcharge to add on top of `domFixed`. The calculator uses it on its
     * own for international txns.
     */
    intlFixed: number;
  };
  /** In-person / POS rates. */
  inPerson?: {
    /** In-person percentage. */
    pct: number;
    /** In-person per-transaction fixed fee in the provider's currency. */
    fixed: number;
  };
  /**
   * Simple blended mode — one percentage of gross volume plus fixed per-txn.
   * When present, the calculator uses this instead of the online + inPerson breakdown.
   */
  blended?: {
    pct: number;
    fixed: number;
  };
}

/** Default slider value for monthly revenue. */
export const DEFAULT_MONTHLY_REVENUE = 25_000;
/** Default slider value for average order value. */
export const DEFAULT_AVG_ORDER_VALUE = 50;
/** Default slider value for international card percentage. */
export const DEFAULT_INTL_PERCENT = 10;
/** Default slider value for in-person POS percentage. */
export const DEFAULT_IN_PERSON_PERCENT = 0;
/** Default calculator currency (kept USD so the published US schedules stay the default view). */
export const DEFAULT_FEE_CURRENCY: FeeCurrency = "USD";

export const PROVIDER_FEE_CONFIGS: ProviderFeeConfig[] = [
  {
    slug: "stripe",
    name: "Stripe",
    currency: "USD",
    pricingModel: "published-flat-rate",
    logo: "#635BFF",
    note: "Best for SaaS, developer API & custom checkout",
    online: {
      domPct: 0.029,
      domFixed: 0.3,
      intlSurcharge: 0.025,
      intlFixed: 0.3,
    },
    inPerson: {
      pct: 0.027,
      fixed: 0.05,
    },
  },
  {
    slug: "paypal",
    name: "PayPal",
    currency: "USD",
    pricingModel: "published-flat-rate",
    logo: "#009CDE",
    note: "Higher rates, but high brand trust for buyers",
    online: {
      domPct: 0.0349,
      domFixed: 0.49,
      intlSurcharge: 0.015,
      intlFixed: 0.49,
    },
    inPerson: {
      pct: 0.0229,
      fixed: 0.09,
    },
  },
  {
    slug: "square",
    name: "Square",
    currency: "USD",
    pricingModel: "published-flat-rate",
    logo: "#71717A",
    note: "Great all-in-one for omnichannel & retail POS",
    online: {
      domPct: 0.029,
      domFixed: 0.3,
      intlSurcharge: 0.0085,
      intlFixed: 0.3,
    },
    inPerson: {
      pct: 0.026,
      fixed: 0.1,
    },
  },
  {
    slug: "adyen",
    name: "Adyen",
    currency: "USD",
    pricingModel: "custom-contract",
    estimateAssumptions: [
      "Illustrative blended processing estimate",
      "Actual pricing depends on payment method, region, interchange, and contract",
      "Not directly comparable to published flat-rate providers",
    ],
    logo: "#0ABF53",
    note: "Custom-contract pricing; illustrative blended estimate only",
    online: {
      domPct: 0,
      domFixed: 0,
      intlSurcharge: 0,
      intlFixed: 0,
    },
    blended: {
      pct: 0.0195,
      fixed: 0.13,
    },
  },
  {
    slug: "razorpay",
    name: "Razorpay",
    currency: "INR",
    region: "India",
    gstPercent: 18,
    pricingModel: "published-flat-rate",
    logo: "#3395FF",
    note: "India's leading gateway — flat 2% on all domestic instruments",
    online: {
      domPct: 0.02,
      domFixed: 0,
      intlSurcharge: 0.01,
      intlFixed: 0,
    },
  },
  {
    slug: "stripe",
    name: "Stripe (India)",
    currency: "INR",
    region: "India",
    gstPercent: 18,
    pricingModel: "published-flat-rate",
    logo: "#635BFF",
    note: "India Standard pricing: 2% domestic / 3% international cards",
    online: {
      domPct: 0.02,
      domFixed: 0,
      intlSurcharge: 0.01,
      intlFixed: 0,
    },
  },
  {
    slug: "cashfree",
    name: "Cashfree Payments",
    currency: "INR",
    region: "India",
    gstPercent: 18,
    pricingModel: "published-flat-rate",
    logo: "#663399",
    note: "2% domestic with zero setup — 180+ payment modes",
    online: {
      domPct: 0.02,
      domFixed: 0,
      intlSurcharge: 0.0099,
      intlFixed: 0,
    },
  },
];
