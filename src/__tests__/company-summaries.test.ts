import { describe, expect, it } from "vitest";
import { companies, categories } from "@/data";
import {
  companySummaries,
  categoryNames,
  getCompanySummaryBySlug,
  getCompanySummariesByCategory,
  companySummaryCountByCategory,
} from "@/generated/company-summaries";

/**
 * Contract: the generated client-safe summaries must mirror the server-side
 * catalog exactly for every field clients render. Drift here means either the
 * generator script or a client import is out of sync — fail loudly.
 */
describe("company summaries (generated client subset)", () => {
  it("has one summary per catalog company, both directions", () => {
    expect(companySummaries).toHaveLength(companies.length);
    const summarySlugs = new Set(companySummaries.map((s) => s.slug));
    for (const c of companies) {
      expect(summarySlugs.has(c.slug), `missing summary for ${c.slug}`).toBe(true);
    }
    for (const s of companySummaries) {
      expect(
        companies.some((c) => c.slug === s.slug),
        `summary ${s.slug} has no catalog entry`,
      ).toBe(true);
    }
  });

  it("mirrors every rendered field from the catalog entry", () => {
    for (const summary of companySummaries) {
      const c = companies.find((x) => x.slug === summary.slug)!;
      expect(summary.name).toBe(c.name);
      expect(summary.tagline).toBe(c.tagline);
      expect(summary.founded).toBe(c.founded);
      expect(summary.headquarters).toBe(c.headquarters);
      expect(summary.website).toBe(c.website);
      expect(summary.valuation).toBe(c.valuation);
      expect(summary.valuationAmountUsd).toBe(c.valuationAmountUsd);
      expect(summary.categories).toEqual(c.categories);
      expect(summary.accent).toBe(c.accent);
      expect(summary.rating).toBe(c.userReviews.rating);
      expect(summary.pricingModel).toBe(c.pricing.model);
      expect(summary.employees).toBe(c.employees);
      expect(summary.customers).toEqual(c.whoUses.slice(0, 4));
      expect(summary.primaryStrength).toBe(
        c.strengths.length > 0 ? c.strengths[0] : undefined,
      );
      expect(summary.primaryWeakness).toBe(
        c.weaknesses.length > 0 ? c.weaknesses[0] : undefined,
      );
    }
  });

  it("searchTerms cover the directory search surface", () => {
    for (const summary of companySummaries) {
      const c = companies.find((x) => x.slug === summary.slug)!;
      const terms = summary.searchTerms;
      expect(terms).toBe(terms.toLowerCase());
      expect(terms).toContain(c.name.toLowerCase());
      expect(terms).toContain(c.tagline.toLowerCase());
      expect(terms).toContain(c.oneLiner.toLowerCase());
      for (const founder of c.founders) {
        expect(terms).toContain(founder.toLowerCase());
      }
      for (const offer of c.whatTheyOffer) {
        expect(terms).toContain(offer.name.toLowerCase());
      }
    }
  });

  it("keeps heavy editorial payloads out of the client subset", () => {
    for (const summary of companySummaries) {
      expect(summary).not.toHaveProperty("sources");
      expect(summary).not.toHaveProperty("sourceReferences");
      expect(summary).not.toHaveProperty("whatTheyOffer");
      expect(summary).not.toHaveProperty("whoUses");
      expect(summary).not.toHaveProperty("userReviews");
      expect(summary).not.toHaveProperty("oneLiner");
      expect(summary).not.toHaveProperty("whatIsIt");
      expect(summary).not.toHaveProperty("founders");
      expect(summary).not.toHaveProperty("logo");
      expect(summary).not.toHaveProperty("pricing");
    }
  });

  it("covers every category with a display name", () => {
    for (const cat of categories) {
      expect(categoryNames[cat.slug], `missing name for ${cat.slug}`).toBe(cat.name);
    }
  });

  it("category helpers agree with the server-side catalog", () => {
    for (const cat of categories) {
      const serverCount = companies.filter((c) => c.categories.includes(cat.slug)).length;
      expect(companySummaryCountByCategory(cat.slug)).toBe(serverCount);
      expect(getCompanySummariesByCategory(cat.slug)).toHaveLength(serverCount);
    }
    expect(getCompanySummaryBySlug("razorpay")?.name).toBe(
      companies.find((c) => c.slug === "razorpay")?.name,
    );
    expect(getCompanySummaryBySlug("no-such-company")).toBeUndefined();
  });
});
