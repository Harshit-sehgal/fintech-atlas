import { describe, expect, it } from "vitest";
import { fuzzyMatchAny, fuzzyRank, fuzzyScore } from "./fuzzy";

describe("fuzzyScore", () => {
  it("returns 1 for an empty query and 0 for empty text", () => {
    expect(fuzzyScore("Stripe", "  ")).toBe(1);
    expect(fuzzyScore("", "stripe")).toBe(0);
  });

  it("scores an anchored substring highest", () => {
    expect(fuzzyScore("Stripe", "st")).toBe(120);
  });

  it("applies a word-boundary bonus", () => {
    // "world" sits after a space → 100 - 6 + 20
    expect(fuzzyScore("hello world", "world")).toBe(114);
    // "ipe" is mid-word → no bonus
    expect(fuzzyScore("Stripe", "ipe")).toBe(97);
  });

  it("matches a typo-tolerant subsequence with a lower score", () => {
    const score = fuzzyScore("stripe", "srp");
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it("returns 0 when the query cannot be found at all", () => {
    expect(fuzzyScore("stripe", "zzz")).toBe(0);
  });
});

describe("fuzzyMatchAny", () => {
  it("matches everything for an empty query", () => {
    expect(fuzzyMatchAny(["a", "b"], "   ")).toBe(true);
  });

  it("is true when any candidate clears the threshold and false otherwise", () => {
    expect(fuzzyMatchAny(["Stripe", "Adyen"], "str")).toBe(true);
    expect(fuzzyMatchAny(["Stripe", "Adyen"], "zzzz")).toBe(false);
  });
});

describe("fuzzyRank", () => {
  const items = [
    { name: "Adyen" },
    { name: "Stripe" },
    { name: "Striped horse" },
  ];
  const fields = (i: { name: string }) => [i.name];

  it("returns the original list for an empty query", () => {
    expect(fuzzyRank(items, "  ", fields)).toBe(items);
  });

  it("filters below the threshold and sorts by score then original index", () => {
    const ranked = fuzzyRank(items, "stripe", fields);
    expect(ranked[0].name).toBe("Stripe");
    expect(ranked.map((r) => r.name)).not.toContain("Adyen");
  });

  it("de-duplicates repeated references", () => {
    const dup = { name: "Stripe" };
    const ranked = fuzzyRank([dup, dup, { name: "Stripe Ltd" }], "stripe", fields);
    expect(ranked.filter((r) => r === dup)).toHaveLength(1);
  });
});
