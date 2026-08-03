/**
 * Structured, machine-readable valuation amounts (whole US dollars) keyed by
 * company slug, used for numeric sorting and comparison.
 *
 * Storing the amount here means the directory never has to parse the
 * human-readable `valuation` display string at runtime — the display text and
 * the sort value are kept apart (audit #37). Values are an editorial snapshot
 * consistent with the catalog vintage (`DATA_AS_OF`); treat them as indicative,
 * not live quotes.
 *
 * Companies without their own independently comparable valuation — subsidiaries
 * or products of a parent company, or units acquired into a larger group — are
 * intentionally omitted so they sort after companies with a known value.
 */

export const valuationAmountUsdBySlug: Record<string, number> = {
  stripe: 65_000_000_000,
  paypal: 67_000_000_000,
  square: 37_000_000_000,
  adyen: 47_000_000_000,
  wise: 11_600_000_000,
  revolut: 33_000_000_000,
  brex: 12_300_000_000,
  gusto: 9_500_000_000,
  plaid: 13_400_000_000,
  nubank: 45_000_000_000,
  chime: 25_000_000_000,
  robinhood: 12_000_000_000,
  klarna: 6_800_000_000,
  afterpay: 29_000_000_000,
  monzo: 4_500_000_000,
  n26: 9_000_000_000,
  adp: 100_000_000_000,
  affirm: 9_300_000_000,
  binance: 4_500_000_000,
  bunq: 1_900_000_000,
  circle: 9_000_000_000,
  coinbase: 28_000_000_000,
  moneygram: 1_800_000_000,
  okx: 10_000_000_000,
  paychex: 49_000_000_000,
  payoneer: 3_300_000_000,
  paytm: 9_100_000_000,
  phonepe: 12_500_000_000,
  sofi: 8_100_000_000,
  picpay: 2_000_000_000,
  razorpay: 7_500_000_000,
  starling: 3_200_000_000,
  relay: 360_000_000,
};
