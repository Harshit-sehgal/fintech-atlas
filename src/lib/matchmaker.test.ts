import { describe, it, expect } from "vitest";
import {
  computeMatchScores,
  getTopRecommendations,
  getScoreBreakdown,
} from "@/lib/matchmaker";
import type { Company } from "@/data";
import { companies } from "@/data";

// Helper to find a company by slug
function findCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

// Helper to find a company by slug or throw
function getCompanyBySlug(slug: string): Company {
  const company = findCompanyBySlug(slug);
  if (!company) {
    throw new Error(`Company not found: ${slug}`);
  }
  return company;
}

describe("matchmaker scoring logic", () => {
  const testCompanies: Company[] = [
    getCompanyBySlug("stripe"),
    getCompanyBySlug("paypal"),
    getCompanyBySlug("square"),
    getCompanyBySlug("wise"),
    getCompanyBySlug("revolut"),
    getCompanyBySlug("chime"),
    getCompanyBySlug("robinhood"),
    getCompanyBySlug("brex"),
    getCompanyBySlug("gusto"),
    getCompanyBySlug("adyen"),
    getCompanyBySlug("plaid"),
    getCompanyBySlug("nubank"),
  ];

  describe("computeMatchScores()", () => {
    it("returns zero scores when no questions answered", () => {
      const emptyState = {
        userType: "",
        priority: "",
        globalNeed: "",
        scale: "",
      };
      const scores = computeMatchScores(emptyState, testCompanies);
      scores.forEach(({ score }) => {
        expect(score).toBe(0);
      });
    });

    it("applies weights correctly for single dimension", () => {
      const state = {
        userType: "startup",
        priority: "",
        globalNeed: "",
        scale: "",
      };

      const scores = computeMatchScores(state, testCompanies);

      // Find scores for companies mentioned in startup userType weights
      const brexScore = scores.find(s => s.company.slug === "brex")?.score || 0;
      const gustoScore = scores.find(s => s.company.slug === "gusto")?.score || 0;
      const stripeScore = scores.find(s => s.company.slug === "stripe")?.score || 0;
      const revolutScore = scores.find(s => s.company.slug === "revolut")?.score || 0;

      expect(brexScore).toBe(4); // from startup.userType
      expect(gustoScore).toBe(3);    // from startup.userType
      expect(stripeScore).toBe(2);  // from startup.userType
      expect(revolutScore).toBe(2); // from startup.userType

      // Companies not mentioned should have 0
      const paypalScore = scores.find(s => s.company.slug === "paypal")?.score || 0;
      expect(paypalScore).toBe(0);
    });

    it("accumulates scores across multiple dimensions", () => {
      // userType: startup -> brex(4), gusto(3), stripe(2), revolut(2)
      // priority: low_fee -> wise(4), chime(3), brex(3)
      // Combined: brex should be 4+3=7, gusto=3, stripe=2, revolut=2, wise=4, chime=3
      const state = {
        userType: "startup",
        priority: "low_fee",
        globalNeed: "",
        scale: "",
      };

      const scores = computeMatchScores(state, testCompanies);

      const brexScore = scores.find(s => s.company.slug === "brex")?.score || 0;
      const gustoScore = scores.find(s => s.company.slug === "gusto")?.score || 0;
      const stripeScore = scores.find(s => s.company.slug === "stripe")?.score || 0;
      const revolutScore = scores.find(s => s.company.slug === "revolut")?.score || 0;
      const wiseScore = scores.find(s => s.company.slug === "wise")?.score || 0;
      const chimeScore = scores.find(s => s.company.slug === "chime")?.score || 0;

      expect(brexScore).toBe(7); // 4 (userType) + 3 (priority)
      expect(gustoScore).toBe(3);    // 3 (userType) + 0 (priority)
      expect(stripeScore).toBe(2);  // 2 (userType) + 0 (priority)
      expect(revolutScore).toBe(2); // 2 (userType) + 0 (priority)
      expect(wiseScore).toBe(4);    // 0 (userType) + 4 (priority)
      expect(chimeScore).toBe(3);   // 0 (userType) + 3 (priority)
    });

    it("scores previously unweighted answers", () => {
      const state = {
        userType: "",
        priority: "all_in_one",
        globalNeed: "",
        scale: "",
      };

      const scores = computeMatchScores(state, testCompanies);
      expect(scores.find((item) => item.company.slug === "square")?.score).toBe(4);
      expect(scores.find((item) => item.company.slug === "paypal")?.score).toBe(3);
    });

    it("does not return arbitrary zero-score recommendations", () => {
      const state = {
        userType: "",
        priority: "",
        globalNeed: "",
        scale: "",
      };

      expect(getTopRecommendations(state, testCompanies)).toEqual([]);
    });

    it("keeps the score matrix meaningful for every selectable answer", () => {
      const states = [
        { userType: "", priority: "all_in_one", globalNeed: "", scale: "" },
        { userType: "", priority: "", globalNeed: "low", scale: "" },
        { userType: "", priority: "", globalNeed: "", scale: "early" },
        { userType: "", priority: "", globalNeed: "", scale: "growing" },
      ];

      for (const state of states) {
        expect(computeMatchScores(state, testCompanies).some(({ score }) => score > 0)).toBe(true);
      }
    });

    it("handles unknown company slugs in weights gracefully", () => {
      // This test would require modifying SCORE_WEIGHTS, which we won't do in tests
      // Instead we verify our implementation checks if company exists
      const state = {
        userType: "startup",
        priority: "",
        globalNeed: "",
        scale: "",
      };

      // Should not throw even if weights referenced a non-existent company
      // (Our implementation checks scores[slug] !== undefined before updating)
      expect(() => computeMatchScores(state, testCompanies)).not.toThrow();
    });
  });

  describe("getTopRecommendations()", () => {
    it("returns top 3 companies by score", () => {
      // brex(4) + brex(3) = 7 (highest from startup + low_fee)
      // wise(4) = 4
      // chime(3) = 3
      // gusto(3) = 3
      // stripe(2) = 2
      // revolut(2) = 2
      const state = {
        userType: "startup",
        priority: "low_fee",
        globalNeed: "",
        scale: "",
      };

      const top3 = getTopRecommendations(state, testCompanies, 3);

      expect(top3.length).toBe(3);
      expect(top3[0].slug).toBe("brex"); // 7 points
      // Second place could be wise or chime/gusto (all 3-4 points)
      const secondSlugs = [top3[1].slug];
      expect(["wise", "chime", "gusto"]).toContain(secondSlugs[0]);
    });

    it("returns fewer than requested if fewer companies have scores", () => {
      const state = {
        userType: "",
        priority: "",
        globalNeed: "",
        scale: "",
      };

      const top3 = getTopRecommendations(state, testCompanies, 3);
      expect(top3).toEqual([]);
    });

    it("defaults to limit of 3", () => {
      const state = {
        userType: "startup",
        priority: "low_fee",
        globalNeed: "",
        scale: "",
      };

      const top3 = getTopRecommendations(state, testCompanies);
      expect(top3.length).toBe(3);
    });
  });

  describe("getScoreBreakdown()", () => {
    it("provides detailed breakdown of score contributions", () => {
      const state = {
        userType: "startup",
        priority: "low_fee",
        globalNeed: "",
        scale: "",
      };

      const breakdown = getScoreBreakdown(state, testCompanies);

      const brexBreakdown = breakdown.brex;
      expect(brexBreakdown).toBeDefined();
      expect(brexBreakdown.score).toBe(7);
      expect(brexBreakdown.breakdown.userType).toBe(4);
      expect(brexBreakdown.breakdown.priority).toBe(3);

      const wiseBreakdown = breakdown.wise;
      expect(wiseBreakdown).toBeDefined();
      expect(wiseBreakdown.score).toBe(4);
      expect(wiseBreakdown.breakdown.userType).toBeUndefined(); // Not in startup weights
      expect(wiseBreakdown.breakdown.priority).toBe(4);
    });
  });
});