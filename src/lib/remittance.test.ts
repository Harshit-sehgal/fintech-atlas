import { describe, it, expect } from "vitest";
import {
  computeProviderPayout,
  computeProviderPayouts,
  computeFee,
  computeEffectiveRate,
  midMarketRate,
} from "@/lib/remittance";
import type { RemittanceProviderConfig, CurrencyOption } from "@/data/remittance-config";

describe("Remittance Calculator Logic", () => {
  const mockCurrencies: CurrencyOption[] = [
    {
      code: "EUR",
      symbol: "€",
      name: "Euro",
      rate: 0.92,
      source: "Test snapshot",
      sourceUrl: "https://example.test/rates",
    },
    {
      code: "GBP",
      symbol: "£",
      name: "British Pound",
      rate: 0.79,
      source: "Test snapshot",
      sourceUrl: "https://example.test/rates",
    },
  ];

  const mockConfigs: RemittanceProviderConfig[] = [
    {
      slug: "wise",
      name: "Wise",
      feeModel: "pct_plus_fixed",
      feePct: 0.0043, // 0.43%
      feeFixed: 0.50,   // $0.50 fixed fee
      fxMargin: 0,      // 0% FX markup
      speed: "Instant",
      highlight: "Mid-market rate",
    },
    {
      slug: "paypal",
      name: "PayPal",
      feeModel: "fixed",
      feePct: 0,
      feeFixed: 4.99,   // $4.99 fixed fee
      fxMargin: 3.5,    // 3.5% FX markup
      speed: "1-3 Days",
      highlight: "Brand recognition",
    },
  ];

  describe("midMarketRate()", () => {
    it("returns the rate for the given currency", () => {
      expect(midMarketRate(mockCurrencies[0])).toBe(0.92);
      expect(midMarketRate(mockCurrencies[1])).toBe(0.79);
    });
  });

  describe("computeFee()", () => {
    const sendAmount = 1000;

    it("calculates percentage fee correctly", () => {
      const pctConfig: RemittanceProviderConfig = {
        ...mockConfigs[0],
        feeModel: "pct",
        feePct: 0.01, // 1%
        feeFixed: 0,
        fxMargin: 0,
      };
      expect(computeFee(pctConfig, sendAmount)).toBeCloseTo(10);
    });

    it("calculates fixed fee correctly", () => {
      expect(computeFee(mockConfigs[1], sendAmount)).toBeCloseTo(4.99);
    });

    it("calculates percentage+fixed fee correctly", () => {
      // 1000 * 0.0043 + 0.50 = 4.30 + 0.50 = 4.80
      expect(computeFee(mockConfigs[0], sendAmount)).toBeCloseTo(4.80);
    });

    it("returns 0 for unknown feeModel", () => {
      const invalidFeeModel = "unknown" as unknown as RemittanceProviderConfig["feeModel"];
      const badConfig: RemittanceProviderConfig = {
        ...mockConfigs[0],
        // Deliberately exercise the runtime default branch with an invalid value.
        feeModel: invalidFeeModel,
      };
      expect(computeFee(badConfig, sendAmount)).toBe(0);
    });
  });

  describe("computeEffectiveRate()", () => {
    const midRate = 0.92; // 1 USD = 0.92 EUR

    it("returns mid-market rate for 0% markup", () => {
      expect(computeEffectiveRate({ ...mockConfigs[0], fxMargin: 0 }, midRate))
        .toBeCloseTo(0.92);
    });

    it("applies FX markup correctly", () => {
      // 3.5% markup on 0.92 = 0.92 * (1 - 0.035) = 0.8878
      expect(computeEffectiveRate(mockConfigs[1], midRate)).toBeCloseTo(0.8878);
    });
  });

  describe("computeProviderPayout()", () => {
    const inputs = {
      sendAmount: 1000,
      currency: mockCurrencies[0], // EUR
    };

    it("calculates Wise payout correctly", () => {
      // Fee: 1000 * 0.0043 + 0.50 = 4.80
      // Amount after fee: 1000 - 4.80 = 995.20
      // Rate: 0.92 (0% markup)
      // Payout: 995.20 * 0.92 = 915.584
      const payout = computeProviderPayout(mockConfigs[0], inputs);
      expect(payout.fee).toBeCloseTo(4.80);
      expect(payout.rate).toBeCloseTo(0.92);
      expect(payout.netPayout).toBeCloseTo(915.58);
    });

    it("calculates PayPal payout correctly", () => {
      // Fee: 4.99
      // Amount after fee: 1000 - 4.99 = 995.01
      // Rate: 0.92 * (1 - 0.035) = 0.8878
      // Payout: 995.01 * 0.8878 = 883.369878 → 883.37
      const payout = computeProviderPayout(mockConfigs[1], inputs);
      expect(payout.fee).toBeCloseTo(4.99);
      expect(payout.rate).toBeCloseTo(0.8878);
      expect(payout.netPayout).toBeCloseTo(883.37);
    });

    it("clamps amount after fee to >= 0", () => {
      // High fee that exceeds send amount
      const highFeeConfig: RemittanceProviderConfig = {
        ...mockConfigs[1],
        feeFixed: 1500, // > sendAmount
      };
      const payout = computeProviderPayout(highFeeConfig, inputs);
      expect(payout.fee).toBe(1500);
      expect(payout.netPayout).toBe(0); // (1000 - 1500) clamped to 0
    });
  });

  describe("computeProviderPayouts()", () => {
    const inputs = {
      sendAmount: 1000,
      currency: mockCurrencies[0], // EUR
    };

    it("sorts providers by net payout descending (best first)", () => {
      const payouts = computeProviderPayouts(mockConfigs, inputs);
      // Wise should be better than PayPal in this scenario
      expect(payouts[0].slug).toBe("wise");
      expect(payouts[1].slug).toBe("paypal");
      expect(payouts[0].netPayout).toBeGreaterThan(payouts[1].netPayout);
    });
  });
});