import { describe, expect, it } from "vitest";
import { fuzzyMatchAny, fuzzyRank, fuzzyScore } from "./fuzzy";

describe("fuzzyScore", () => {
  it("scores exact substring highly", () => {
    expect(fuzzyScore("Stripe Payments", "stripe")).toBeGreaterThan(100);
  });

  it("matches subsequences for simple typos", () => {
    expect(fuzzyScore("PayPal", "pypl")).toBeGreaterThan(0);
    expect(fuzzyScore("Remittance", "remitance")).toBeGreaterThan(0);
  });

  it("returns 0 when characters are missing entirely", () => {
    expect(fuzzyScore("Wise", "zzzz")).toBe(0);
  });
});

describe("fuzzyRank", () => {
  it("orders better matches first and drops non-matches", () => {
    const items = [
      { name: "Stripe" },
      { name: "Square" },
      { name: "Adyen" },
    ];
    const ranked = fuzzyRank(items, "strp", (i) => [i.name]);
    expect(ranked[0]?.name).toBe("Stripe");
    expect(ranked.some((i) => i.name === "Adyen")).toBe(false);
  });
});

describe("fuzzyMatchAny", () => {
  it("matches against any candidate field", () => {
    expect(fuzzyMatchAny(["Fee Estimator", "payments"], "estimatr")).toBe(true);
  });
});
