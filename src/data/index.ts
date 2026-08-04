import { companies } from "./companies";
import { categories } from "./categories";
import { glossary, categoryGlossaryMap } from "./glossary";

import { Company, Category, GlossaryTerm, OwnershipType } from "./types";

export { companies, categories, glossary, categoryGlossaryMap };
export type { Company, Category, GlossaryTerm, OwnershipType };

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCompaniesByCategory(categorySlug: string): Company[] {
  return companies.filter((c) => c.categories.includes(categorySlug));
}