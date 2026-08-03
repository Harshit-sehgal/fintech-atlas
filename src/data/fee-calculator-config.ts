/**
 * Payment gateway fee calculator — provider pricing tables.
 *
 * Rates below are standard published card-not-present rates and are indicative
 * only. High-volume merchants may qualify for interchange++ or custom enterprise
 * pricing that materially differs. Update these values when a provider changes
 * its public schedule.
 */

export interface ProviderFeeConfig {
  slug: string;
  name: string;
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
    /** Domestic per-transaction fixed fee in dollars. */
    domFixed: number;
    /** International surcharge percentage added on top of domPct. */
    intlSurcharge: number;
    /** International per-transaction fixed fee in dollars. */
    intlFixed: number;
  };
  /** In-person / POS rates. */
  inPerson?: {
    /** In-person percentage. */
    pct: number;
    /** In-person per-transaction fixed fee in dollars. */
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

export const PROVIDER_FEE_CONFIGS: ProviderFeeConfig[] = [
  {
    slug: "stripe",
    name: "Stripe",
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
    logo: "#0ABF53",
    note: "Blended estimate uses total volume; mix does not change this model",
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
];