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
      pricingModel: "published-flat-rate",
      logo: "#635BFF",
      note: "Best for SaaS",
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
      slug: "adyen",
      name: "Adyen",
      pricingModel: "custom-contract",
      logo: "#0ABF53",
      note: "Blended",
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

  describe("transactionCount()", () => {
    it("returns rounded volume ÷ AOV", () => {
      expect(transactionCount(25000, 50)).toBe(500);
      expect(transactionCount(10000, 33)).toBe(303); // 10000/33 = 303.03...
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
    };

    it("calculates blended model correctly", () => {
      const cost = computeProviderCost(mockConfigs[1], inputs); // Adyen blended
      // Expected: 25000 * 0.0195 + 500 * 0.13 = 487.5 + 65 = 552.5
      expect(cost).toBeCloseTo(552.5);
    });

    it("calculates online+in-person model correctly", () => {
      const cost = computeProviderCost(mockConfigs[0], inputs); // Stripe
      // Breakdown: domestic online 630 + international online 120 + in-person 140.
      expect(cost).toBeCloseTo(890.0);
    });

    // Exact-value scenario tests (regression guard: the fixed fee must NOT be
    // double-counted as domFixed + intlFixed on international transactions).
    // Stripe: domPct 2.9% + domFixed $0.30 | intlSurcharge +2.5% | intlFixed $0.30
    describe("exact international fixed-fee semantics", () => {
      it("calculates a fully international online transaction (no double-count)", () => {
        const cost = computeProviderCost(mockConfigs[0], {
          monthlyRevenue: 100,
          avgOrderValue: 100, // 1 transaction
          intlPercent: 100,
          inPersonPercent: 0,
        });
        // 100 * (0.029 + 0.025) + 1 * 0.30 = 5.40 + 0.30 = 5.70
        expect(cost).toBeCloseTo(5.70);
      });

      it("calculates a fully domestic online transaction", () => {
        const cost = computeProviderCost(mockConfigs[0], {
          monthlyRevenue: 100,
          avgOrderValue: 100,
          intlPercent: 0,
          inPersonPercent: 0,
        });
        // 100 * 0.029 + 1 * 0.30 = 2.90 + 0.30 = 3.20
        expect(cost).toBeCloseTo(3.20);
      });

      it("calculates a fully in-person transaction", () => {
        const cost = computeProviderCost(mockConfigs[0], {
          monthlyRevenue: 100,
          avgOrderValue: 100,
          intlPercent: 0,
          inPersonPercent: 100,
        });
        // 100 * 0.027 + 1 * 0.05 = 2.70 + 0.05 = 2.75
        expect(cost).toBeCloseTo(2.75);
      });

      it("handles zero revenue", () => {
        const cost = computeProviderCost(mockConfigs[0], {
          monthlyRevenue: 0,
          avgOrderValue: 50,
          intlPercent: 100,
          inPersonPercent: 0,
        });
        expect(cost).toBe(0);
      });

      it("handles a very low average order value", () => {
        const cost = computeProviderCost(mockConfigs[0], {
          monthlyRevenue: 100,
          avgOrderValue: 1, // 100 transactions
          intlPercent: 100,
          inPersonPercent: 0,
        });
        // 100 * 0.054 + 100 * 0.30 = 5.40 + 30.00 = 35.40
        expect(cost).toBeCloseTo(35.40);
      });
    });

    it("ignores inPerson when inPersonPercent is 0", () => {
      const noInPerson = { ...inputs, inPersonPercent: 0 };
      const withInPerson = { ...inputs, inPersonPercent: 20 };
      const costNoInPerson = computeProviderCost(mockConfigs[0], noInPerson);
      const costWithInPerson = computeProviderCost(mockConfigs[0], withInPerson);

      // With 20% in-person, cost should be different (usually lower due to different rates)
      expect(costNoInPerson).not.toBeCloseTo(costWithInPerson);
    });
  });

  describe("computeProviderCosts()", () => {
    const inputs = {
      monthlyRevenue: 10000,
      avgOrderValue: 100,
      intlPercent: 0,
      inPersonPercent: 0,
    };

    it("sorts providers by cost ascending", () => {
      // For simplicity, let's make Adyen much cheaper than Stripe in this scenario
      const cheapBlended: ProviderFeeConfig = {
        slug: "cheap",
        name: "Cheap",
        pricingModel: "estimated",
        logo: "#000000",
        note: "Cheap",
        online: {
          domPct: 0,
          domFixed: 0,
          intlSurcharge: 0,
          intlFixed: 0,
        },
        blended: {
          pct: 0.01, // 1%
          fixed: 0.05,
        },
      };

      const expensive: ProviderFeeConfig = {
        slug: "expensive",
        name: "Expensive",
        pricingModel: "published-flat-rate",
        logo: "#000000",
        note: "Expensive",
        online: {
          domPct: 0.1, // 10%
          domFixed: 1.0,
          intlSurcharge: 0,
          intlFixed: 0,
        },
        inPerson: { pct: 0, fixed: 0 },
      };

      const costs = computeProviderCosts([expensive, cheapBlended], inputs);
      expect(costs[0].slug).toBe("cheap"); // Should be first (cheapest)
      expect(costs[1].slug).toBe("expensive"); // Should be second
    });
  });
});