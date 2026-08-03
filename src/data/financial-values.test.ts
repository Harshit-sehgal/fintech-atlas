import { describe, expect, it } from "vitest";
import { companies, getCompanyBySlug } from "./index";
import { valuationAmountUsdBySlug } from "./financial-values";

describe("structured valuation catalog", () => {
  it("contains only known companies with independently comparable display values", () => {
    for (const [slug, amountUsd] of Object.entries(valuationAmountUsdBySlug)) {
      const company = getCompanyBySlug(slug);
      expect(company, `valuation table contains unknown company slug: ${slug}`).toBeDefined();
      expect(amountUsd, `${slug} valuation must be positive`).toBeGreaterThan(0);
      expect(company!.valuation).not.toMatch(/N\/A|part of|Part of|Acquired by/i);
      expect(company!.valuationAmountUsd).toBe(amountUsd);
    }
  });

  it("does not leave a structured amount on a company omitted from the table", () => {
    const knownSlugs = new Set(Object.keys(valuationAmountUsdBySlug));
    for (const company of companies) {
      if (company.valuationAmountUsd !== undefined) {
        expect(knownSlugs.has(company.slug), `${company.slug} has no matching valuation table entry`).toBe(true);
      }
    }
  });
});
