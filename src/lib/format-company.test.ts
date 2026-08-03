import { describe, it, expect } from "vitest";
import { formatValuationShort, formatHeadquartersCity, getValuationAmountUsd, financialValueTypeLabel, formatValuationForStats } from "./format-company";
import { getCompanyBySlug } from "@/data";

describe("formatValuationShort", () => {
  it("returns the part before the first left-paren", () => {
    expect(formatValuationShort("Private ($45B)")).toBe("Private");
  });

  it("returns the dollar amount before the parenthetical year", () => {
    expect(formatValuationShort("$3.2B (2025)")).toBe("$3.2B");
  });

  it("returns the string unchanged when there is no parenthesis", () => {
    expect(formatValuationShort("Public")).toBe("Public");
  });

  it("trims whitespace between the value and the parenthetical", () => {
    expect(formatValuationShort("$1.8B  (2024)")).toBe("$1.8B");
  });
});

describe("formatHeadquartersCity", () => {
  it("returns the city before the first comma", () => {
    expect(formatHeadquartersCity("San Francisco, CA, USA")).toBe("San Francisco");
  });

  it("returns the city for a shorter comma-separated location", () => {
    expect(formatHeadquartersCity("London, UK")).toBe("London");
  });

  it("returns the whole string when there is no comma", () => {
    expect(formatHeadquartersCity("Singapore")).toBe("Singapore");
  });
});

describe("getValuationAmountUsd", () => {
  it("returns the structured numeric valuation for a company with one", () => {
    const stripe = getCompanyBySlug("stripe");
    expect(stripe).toBeDefined();
    expect(getValuationAmountUsd(stripe!)).toBe(65_000_000_000);
  });

  it("returns null for a subsidiary/product without an own valuation", () => {
    const venmo = getCompanyBySlug("venmo");
    expect(venmo).toBeDefined();
    expect(getValuationAmountUsd(venmo!)).toBeNull();
  });

  it("returns null for an unknown/missing company", () => {
    expect(getValuationAmountUsd({} as never)).toBeNull();
  });
});

describe("financialValueTypeLabel / formatValuationForStats", () => {
  it("labels private companies as private valuations", () => {
    const stripe = getCompanyBySlug("stripe")!;
    expect(financialValueTypeLabel(stripe)).toBe("Private valuation");
    expect(formatValuationForStats(stripe)).toBe("$65B · Private valuation");
  });

  it("labels publicly traded companies as market capitalisation", () => {
    const paypal = getCompanyBySlug("paypal")!;
    expect(financialValueTypeLabel(paypal)).toBe("Market capitalisation");
    expect(formatValuationForStats(paypal)).toBe("$67B · Market capitalisation");
  });

  it("labels subsidiaries as not publicly disclosed", () => {
    const venmo = getCompanyBySlug("venmo")!;
    expect(financialValueTypeLabel(venmo)).toBe("Not publicly disclosed");
    expect(formatValuationForStats(venmo)).toBe("Part of PayPal · Not publicly disclosed");
  });

  it("does not append a label when the type is unclassified", () => {
    const unclassified: CompanyLike = { slug: "unknown-co", valuation: "$1B" };
    expect(financialValueTypeLabel(unclassified as never)).toBeNull();
    expect(formatValuationForStats(unclassified as never)).toBe("$1B");
  });
});

interface CompanyLike {
  slug: string;
  valuation: string;
}