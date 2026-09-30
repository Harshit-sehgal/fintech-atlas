import { describe, expect, it } from "vitest";
import { companies } from "@/data";
import { indiaDirectorySummaries } from "@/generated/india-directory-summaries";
import {
  companyToResearchProfile,
  getCompanyForResearchProfile,
  getResearchProfileForCompany,
} from "@/lib/company-directory-links";

const companySlugs = new Set(companies.map((c) => c.slug));
const researchSlugs = new Set(indiaDirectorySummaries.map((p) => p.slug));

describe("company ↔ research profile cross-links", () => {
  it("maps only real company slugs to real research profile slugs", () => {
    for (const [company, research] of Object.entries(companyToResearchProfile)) {
      expect(companySlugs.has(company), `unknown company slug: ${company}`).toBe(true);
      expect(researchSlugs.has(research), `unknown research slug: ${research}`).toBe(true);
    }
  });

  it("declares every mapping on the Company record itself", () => {
    for (const [company, research] of Object.entries(companyToResearchProfile)) {
      const record = companies.find((c) => c.slug === company);
      expect(record?.researchProfileSlug, `${company} missing researchProfileSlug`).toBe(research);
    }
  });

  it("round-trips in both directions", () => {
    for (const [company, research] of Object.entries(companyToResearchProfile)) {
      expect(getResearchProfileForCompany(company)).toBe(research);
      expect(getCompanyForResearchProfile(research)).toBe(company);
    }
    expect(getResearchProfileForCompany("n26")).toBeNull();
    expect(getCompanyForResearchProfile("m2p-fintech")).toBeNull();
  });

  it("does not duplicate the same research profile across companies", () => {
    const values = Object.values(companyToResearchProfile);
    expect(new Set(values).size).toBe(values.length);
  });
});
