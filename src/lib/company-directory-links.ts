import { companies } from "@/data";
import { indiaDirectorySummaries } from "@/generated/india-directory-summaries";

// Bridges the profile surfaces:
// - /companies/[slug]        → curated editorial profiles (42, global + India)
// - /global-directory/[slug] → data-driven research profiles (worldwide)
// - /india/directory/…       → data-driven research profiles (1,386, India only)
//
// The India bridge is declared ON each curated company record
// (Company.researchProfileSlug in src/data/companies.ts) — the bridge
// here just inverts it and adds name lookups. Mappings stay
// hand-curated at the data layer: name matching is unreliable
// ("Paytm Payment Gateway (One97 Communications)" vs "paytm"), and a
// wrong mapping is worse than no mapping.
//
// The global directory bridge is different: the global research file
// uses the company's canonical name for its slug, so a curated company
// and its global research record share a slug by construction. The
// bridge is a plain slug lookup — no hand-curation needed, and no
// mapping can be wrong because it only fires on an exact slug match.
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

const companyBySlug = new Map(companies.map((c) => [c.slug, c]));

/** Curated editorial profile for a global research record, matched by slug. */
export function getCompanyForGlobalProfile(globalSlug: string): string | null {
  return companyBySlug.has(globalSlug) ? globalSlug : null;
}

const researchProfileLookup = new Map(indiaDirectorySummaries.map((p) => [p.slug, p.name]));

export function getResearchProfileName(slug: string): string {
  return researchProfileLookup.get(slug) ?? "";
}

const companyLookup = new Map(companies.map((c) => [c.slug, c.name]));

export function getCompanyName(slug: string): string {
  return companyLookup.get(slug) ?? "";
}