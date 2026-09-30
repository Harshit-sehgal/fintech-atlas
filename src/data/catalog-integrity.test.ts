import { describe, expect, it } from "vitest";
import { companies } from "./companies";
import { financialValueTypeBySlug, valuationAmountUsdBySlug } from "./financial-values";

const ownershipTypes = new Set([
  "public",
  "private",
  "subsidiary",
  "division",
  "acquired",
  "not-disclosed",
]);

function sourceIdsFor(company: (typeof companies)[number]): Set<string> {
  return new Set(company.sourceReferences.map((source) => source.id));
}

describe("catalog integrity", () => {
  it("audits availability for every published company", () => {
    for (const company of companies) {
      expect(company.availability, `${company.slug} is missing availability`).toBeDefined();
      expect(company.availability!.supportedRegions.length, company.slug).toBeGreaterThan(0);
      expect(company.availability!.asOf, company.slug).toMatch(/^(\d{4}-Q[1-4]|\d{4}-\d{2}-\d{2})$/);

      const sourceIds = sourceIdsFor(company);
      for (const sourceId of company.availability!.sourceIds) {
        expect(sourceIds.has(sourceId), `${company.slug} availability -> ${sourceId}`).toBe(true);
      }
    }
  });

  it("has no unknown or unreferenced valuation records", () => {
    const companyBySlug = new Map(companies.map((company) => [company.slug, company]));
    for (const [slug, amountUsd] of Object.entries(valuationAmountUsdBySlug)) {
      expect(companyBySlug.has(slug), `unknown valuation slug: ${slug}`).toBe(true);
      expect(amountUsd, `${slug} valuation`).toBeGreaterThan(0);
    }
    for (const company of companies) {
      if (company.valuationAmountUsd !== undefined) {
        expect(valuationAmountUsdBySlug[company.slug], company.slug).toBe(company.valuationAmountUsd);
      }
    }
  });

  it("classifies every catalog valuation and documents whether it is comparable", () => {
    for (const company of companies) {
      const valueType = financialValueTypeBySlug[company.slug];
      expect(valueType, `${company.slug} valuation type`).toBeDefined();
      expect(ownershipTypes.has(company.ownershipType), company.slug).toBe(true);

      if (valueType === "not-disclosed") {
        expect(company.valuationAmountUsd, company.slug).toBeUndefined();
        continue;
      }

      expect(company.valuationAmountUsd, company.slug).toBeGreaterThan(0);
      expect(company.valuation, company.slug).not.toMatch(/N\/A|part of|Part of|Acquired by/i);
    }
  });
});
