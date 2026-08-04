import { describe, it, expect } from "vitest";
import {
  computeProviderCost,
  computeProviderCosts,
  transactionCount,
} from "@/lib/fee-calculator";
import type { ProviderFeeConfig } from "@/data/fee-calculator-config";

describe("Fee Calculator Logic", () => {
  const mockConfigs: ProviderFeeConfig[] = [
    {
      slug: "stripe",
      name: "Stripe",
      currency: "USD",
      pricingModel: "published-flat-rate",
      logo: "#635BFF",
      note: "Best for SaaS",
      online: {
        domPct: 0.029,
        domFixed: 0.3,
        intlSurcharge: 0.025,
        intlFixed: 0.3,
      },
      inPerson: { pct: 0.027, fixed: 0.05 },
    },
    {
      slug: "adyen",
      name: "Adyen",
      currency: "USD",
      pricingModel: "custom-contract",
      logo: "#0ABF53",
      note: "Blended",
      online: { domPct: 0, domFixed: 0, intlSurcharge: 0, intlFixed: 0 },
      blended: { pct: 0.0195, fixed: 0.13 },
    },
    {
      slug: "razorpay",
      name: "Razorpay",
      currency: "INR",
      gstPercent: 18,
      pricingModel: "published-flat-rate",
      logo: "#3395FF",
      note: "India",
      online: { domPct: 0.02, domFixed: 0, intlSurcharge: 0.01, intlFixed: 0 },
    },
  ];

  describe("transactionCount()", () => {
    it("returns rounded volume ÷ AOV", () => {
      expect(transactionCount(25000, 50)).toBe(500);
      expect(transactionCount(10000, 33)).toBe(303);
      expect(transactionCount(1000, 1000)).toBe(1);
    });

    it("returns 0 for non-positive AOV", () => {
      expect(transactionCount(25000, 0)).toBe(0);
      expect(transactionCount(25000, -10)).toBe(0);
    });
  });

  describe("computeProviderCost()", () => {
    const inputs = {
      monthlyRevenue: 25000,
      avgOrderValue: 50,
      intlPercent: 10,
      inPersonPercent: 20,
      currency: "USD" as const,
    };

    it("calculates blended model correctly", () => {
      expect(computeProviderCost(mockConfigs[1], inputs)).toBeCloseTo(552.5);
    });

    it("calculates online+in-person model correctly", () => {
      expect(computeProviderCost(mockConfigs[0], inputs)).toBeCloseTo(890.0);
    });

    it("rejects a direct cross-currency calculation", () => {
      expect(() => computeProviderCost(mockConfigs[2], inputs)).toThrow(/Cannot calculate a INR provider with USD inputs/);
    });

    it("applies GST on top of an India platform fee", () => {
      const cost = computeProviderCost(mockConfigs[2], {
        monthlyRevenue: 100,
        avgOrderValue: 100,
        intlPercent: 0,
        inPersonPercent: 0,
        currency: "INR",
      });
      expect(cost).toBeCloseTo(2.36);
    });

    describe("exact international fixed-fee semantics", () => {
      it("calculates a fully international online transaction without double-counting", () => {
        expect(computeProviderCost(mockConfigs[0], {
          monthlyRevenue: 100,
          avgOrderValue: 100,
          intlPercent: 100,
          inPersonPercent: 0,
          currency: "USD",
        })).toBeCloseTo(5.70);
      });

      it("calculates a fully domestic online transaction", () => {
        expect(computeProviderCost(mockConfigs[0], {
          monthlyRevenue: 100,
          avgOrderValue: 100,
          intlPercent: 0,
          inPersonPercent: 0,
          currency: "USD",
        })).toBeCloseTo(3.20);
      });

      it("calculates a fully in-person transaction", () => {
        expect(computeProviderCost(mockConfigs[0], {
          monthlyRevenue: 100,
          avgOrderValue: 100,
          intlPercent: 0,
          inPersonPercent: 100,
          currency: "USD",
        })).toBeCloseTo(2.75);
      });

      it("handles zero revenue", () => {
        expect(computeProviderCost(mockConfigs[0], {
          monthlyRevenue: 0,
          avgOrderValue: 50,
          intlPercent: 100,
          inPersonPercent: 0,
          currency: "USD",
        })).toBe(0);
      });

      it("handles a very low average order value", () => {
        expect(computeProviderCost(mockConfigs[0], {
          monthlyRevenue: 100,
          avgOrderValue: 1,
          intlPercent: 100,
          inPersonPercent: 0,
          currency: "USD",
        })).toBeCloseTo(35.40);
      });
    });

    it("changes when in-person share changes", () => {
      const noInPerson = { ...inputs, inPersonPercent: 0 };
      const withInPerson = { ...inputs, inPersonPercent: 20 };
      expect(computeProviderCost(mockConfigs[0], noInPerson)).not.toBeCloseTo(
        computeProviderCost(mockConfigs[0], withInPerson),
      );
    });
    it("rejects non-finite inputs", () => {
      const base = {
        monthlyRevenue: 10000,
        avgOrderValue: 100,
        intlPercent: 0,
        inPersonPercent: 0,
        currency: "USD" as const,
      };
      expect(() => computeProviderCost(mockConfigs[0], { ...base, monthlyRevenue: NaN }))
        .toThrow(TypeError);
      expect(() => computeProviderCost(mockConfigs[0], { ...base, avgOrderValue: Infinity }))
        .toThrow(TypeError);
      expect(() => computeProviderCost(mockConfigs[0], { ...base, intlPercent: NaN }))
        .toThrow(TypeError);
      expect(() => computeProviderCost(mockConfigs[0], { ...base, inPersonPercent: Infinity }))
        .toThrow(TypeError);
    });
  });

  describe("computeProviderCosts()", () => {
    it("filters to the selected currency and sorts by cost", () => {
      const cheapUsd: ProviderFeeConfig = {
        slug: "cheap-usd",
        name: "Cheap USD",
        currency: "USD",
        pricingModel: "estimated",
        logo: "#000000",
        note: "Cheap",
        online: { domPct: 0, domFixed: 0, intlSurcharge: 0, intlFixed: 0 },
        blended: { pct: 0.01, fixed: 0.05 },
      };
      const expensiveUsd: ProviderFeeConfig = {
        slug: "expensive-usd",
        name: "Expensive USD",
        currency: "USD",
        pricingModel: "published-flat-rate",
        logo: "#000000",
        note: "Expensive",
        online: { domPct: 0.1, domFixed: 1, intlSurcharge: 0, intlFixed: 0 },
        inPerson: { pct: 0, fixed: 0 },
      };

      const costs = computeProviderCosts(
        [...mockConfigs, expensiveUsd, cheapUsd],
        {
          monthlyRevenue: 10000,
          avgOrderValue: 100,
          intlPercent: 0,
          inPersonPercent: 0,
          currency: "USD",
        },
      );
      expect(costs.every((provider) => provider.currency === "USD")).toBe(true);
      expect(costs[0].slug).toBe("cheap-usd");
      expect(costs.at(-1)?.slug).toBe("expensive-usd");
    });
  });
});
