import { companies } from "@/data";
import { indiaDirectorySummaries } from "@/generated/india-directory-summaries";

// Bridges the two profile surfaces:
// - /companies/[slug]    → curated editorial profiles (42, global + India)
// - /india/directory/…   → data-driven research profiles (1,386, India only)
//
// When a company exists on both surfaces, each profile links to the other so
// visitors can move between the editorial breakdown and the full research
// profile. The association is declared ON each curated company record
// (Company.researchProfileSlug in src/data/companies.ts) rather than in a
// separate parallel map — the bridge here just inverts it and adds name
// lookups. Mappings stay hand-curated at the data layer: name matching is
// unreliable ("Paytm Payment Gateway (One97 Communications)" vs "paytm"),
// and a wrong mapping is worse than no mapping.
export const companyToResearchProfile: Record<string, string> = Object.fromEntries(
  companies
    .filter((c): c is typeof c & { researchProfileSlug: string } => Boolean(c.researchProfileSlug))
    .map((c) => [c.slug, c.researchProfileSlug]),
);

const researchToCompany: Record<string, string> = Object.fromEntries(
  Object.entries(companyToResearchProfile).map(([company, research]) => [research, company]),
);

export function getResearchProfileForCompany(companySlug: string): string | null {
  return companyToResearchProfile[companySlug] ?? null;
}

export function getCompanyForResearchProfile(researchSlug: string): string | null {
  return researchToCompany[researchSlug] ?? null;
}

const researchProfileLookup = new Map(indiaDirectorySummaries.map((p) => [p.slug, p.name]));

export function getResearchProfileName(slug: string): string {
  return researchProfileLookup.get(slug) ?? "";
}

const companyLookup = new Map(companies.map((c) => [c.slug, c.name]));

export function getCompanyName(slug: string): string {
  return companyLookup.get(slug) ?? "";
}