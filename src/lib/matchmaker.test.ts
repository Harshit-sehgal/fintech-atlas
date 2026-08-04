import { describe, it, expect } from "vitest";
import {
  computeMatchScores,
  getTopRecommendations,
  getScoreBreakdown,
} from "@/lib/matchmaker";
import type { Company } from "@/data";
import { companies } from "@/data";

function getCompanyBySlug(slug: string): Company {
  const company = companies.find((c) => c.slug === slug);
  if (!company) throw new Error(`Company not found: ${slug}`);
  return company;
}

const testCompanies: Company[] = [
  "stripe", "paypal", "square", "wise", "revolut", "chime",
  "robinhood", "brex", "gusto", "adyen", "plaid", "nubank",
].map(getCompanyBySlug);

const emptyState = { userType: "", priority: "", globalNeed: "", scale: "" };

function score(state: typeof emptyState, slug: string): number {
  return computeMatchScores(state, testCompanies).find((s) => s.company.slug === slug)?.score ?? 0;
}

describe("matchmaker capability scoring", () => {
  it("returns zero scores when no questions answered", () => {
    for (const { score: s } of computeMatchScores(emptyState, testCompanies)) {
      expect(s).toBe(0);
    }
  });

  it("scores companies whose capabilities satisfy a single dimension", () => {
    const state = { userType: "personal", priority: "", globalNeed: "", scale: "" };
    // personal => customerTypes:personal(4), useCases:banking(3), investing(2)
    expect(score(state, "revolut")).toBe(9); // personal+banking+investing
    expect(score(state, "nubank")).toBe(9);
    expect(score(state, "chime")).toBe(7);
    expect(score(state, "robinhood")).toBe(6);
    expect(score(state, "stripe")).toBe(0); // no personal/banking/investing
    expect(score(state, "plaid")).toBe(0);
  });

  it("scores developer-API answers against api capabilities", () => {
    const state = { userType: "", priority: "api", globalNeed: "", scale: "" };
    expect(score(state, "stripe")).toBe(8); // developer-apis(5) + api(3)
    expect(score(state, "plaid")).toBe(8);
    expect(score(state, "adyen")).toBe(8);
    expect(score(state, "square")).toBe(0);
  });

  it("accumulates points across multiple dimensions", () => {
    const state = { userType: "startup", priority: "low_fee", globalNeed: "", scale: "" };
    // startup => startup(4), banking(3), payroll(2); low_fee => low-fee(5), no-fees(4)
    expect(score(state, "revolut")).toBe(12); // startup+banking+low-fee
    expect(score(state, "chime")).toBe(12); // banking+low-fee+no-fees
    expect(score(state, "brex")).toBe(7); // startup+banking (no low-fee)
    expect(score(state, "gusto")).toBe(6); // startup+payroll
  });

  it("keeps every selectable answer meaningful (some company scores)", () => {
    const states = [
      { userType: "freelancer", priority: "", globalNeed: "", scale: "" },
      { userType: "", priority: "all_in_one", globalNeed: "", scale: "" },
      { userType: "", priority: "", globalNeed: "low", scale: "" },
      { userType: "", priority: "", globalNeed: "", scale: "early" },
      { userType: "", priority: "", globalNeed: "", scale: "growing" },
    ];
    for (const state of states) {
      expect(computeMatchScores(state, testCompanies).some(({ score: s }) => s > 0)).toBe(true);
    }
  });

  it("does not throw for unknown company slugs", () => {
    const state = { userType: "startup", priority: "", globalNeed: "", scale: "" };
    expect(() => computeMatchScores(state, testCompanies)).not.toThrow();
  });
});

describe("getTopRecommendations()", () => {
  it("returns the top-scoring companies in order", () => {
    const state = { userType: "personal", priority: "", globalNeed: "", scale: "" };
    const top = getTopRecommendations(state, testCompanies, 3);
    // scores: revolut 9, nubank 9, chime 7, robinhood 6, ...
    expect(top.map((c) => c.slug)).toEqual(["revolut", "nubank", "chime"]);
  });

  it("returns fewer than requested when few companies score", () => {
    expect(getTopRecommendations(emptyState, testCompanies, 3)).toEqual([]);
  });
});

describe("getScoreBreakdown()", () => {
  it("attributes points to the contributing question", () => {
    const state = { userType: "personal", priority: "", globalNeed: "", scale: "" };
    const breakdown = getScoreBreakdown(state, testCompanies);
    expect(breakdown.revolut.score).toBe(9);
    expect(breakdown.revolut.breakdown.userType).toBe(9);
    expect(breakdown.plaid.score).toBe(0);
    expect(breakdown.plaid.breakdown.userType).toBeUndefined();
  });
});
