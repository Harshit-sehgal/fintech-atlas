import { describe, expect, it } from "vitest";
import { companySummaries, type CompanySummary } from "@/generated/company-summaries";
import {
  COMPARE_ROWS,
  isDivergent,
  keyDifferences,
  rowsByGroup,
  verdictStatements,
  verificationNote,
  visibleRows,
} from "./compare-view";
import { DATA_AS_OF } from "./site-config";

const base = companySummaries[0];
const mk = (over: Partial<CompanySummary>): CompanySummary => ({ ...base, ...over });

const withDifferences = mk({
  name: "Alpha",
  pricingModel: "Subscription",
  primaryStrength: "Speed",
  primaryWeakness: "Cost",
});
const other = mk({
  name: "Beta",
  pricingModel: "Interchange",
  primaryStrength: "Scale",
  primaryWeakness: "Complexity",
});

describe("compare rows", () => {
  it("groups rows by their section", () => {
    expect(rowsByGroup("decide").every((r) => r.group === "decide")).toBe(true);
    expect(rowsByGroup("verify").map((r) => r.id)).toContain("source");
    expect(rowsByGroup("context").length).toBeGreaterThan(0);
  });

  it("treats every row as divergent below two companies", () => {
    const row = COMPARE_ROWS[0];
    expect(isDivergent(row, [withDifferences])).toBe(true);
    expect(isDivergent(row, [withDifferences, other])).toBe(true);
    expect(isDivergent(row, [withDifferences, { ...withDifferences, name: "Alpha2" }])).toBe(false);
  });

  it("hides agreeing rows only when two or more are selected", () => {
    expect(visibleRows("decide", [withDifferences])).toEqual(rowsByGroup("decide"));
    const visible = visibleRows("decide", [withDifferences, other]);
    expect(visible.every((r) => isDivergent(r, [withDifferences, other]))).toBe(true);
  });
});

describe("keyDifferences", () => {
  it("returns nothing below two companies and when all agree", () => {
    expect(keyDifferences([withDifferences])).toEqual([]);
    const same = { ...withDifferences };
    expect(keyDifferences([withDifferences, same])).toEqual([]);
  });

  it("summarises decision rows that differ", () => {
    const bullets = keyDifferences([withDifferences, other]);
    expect(bullets.length).toBeGreaterThan(0);
    expect(bullets[0]).toContain("Alpha");
    expect(bullets[0]).toContain("Beta");
  });

  it("skips a decision row that is undocumented for one side", () => {
    const documented = mk({ name: "Doc", pricingModel: "X", primaryStrength: "Speed" });
    const undocumented = mk({ name: "Undoc", pricingModel: "X", primaryStrength: undefined, primaryWeakness: undefined });
    const bullets = keyDifferences([documented, undocumented]);
    expect(bullets.some((b) => b.startsWith("Primary advantage"))).toBe(false);
  });

  it("caps the summary at three bullets", () => {
    const bullets = keyDifferences([withDifferences, other]);
    expect(bullets.length).toBeLessThanOrEqual(3);
  });
});

describe("verdictStatements", () => {
  it("returns nothing below two companies", () => {
    expect(verdictStatements([withDifferences])).toEqual([]);
  });

  it("templates strength+weakness, strength-only and thin profiles", () => {
    const both = mk({ name: "Both", primaryStrength: "Speed", primaryWeakness: "Cost" });
    const strengthOnly = mk({ name: "Strength", primaryStrength: "Scale", primaryWeakness: undefined });
    const thin = mk({ name: "Thin", primaryStrength: undefined, primaryWeakness: undefined });
    const lines = verdictStatements([both, strengthOnly, thin]);
    expect(lines[0]).toContain("documented tradeoff");
    expect(lines[1]).toContain("does not document a specific tradeoff");
    expect(lines[2]).toContain("does not yet document enough");
  });
});

describe("verificationNote", () => {
  it("mentions the data vintage", () => {
    expect(verificationNote()).toContain(DATA_AS_OF);
  });
});
