// SEO-specific company data for structured data JSON-LD
// Contains only the slug and name fields needed for ItemList schema
// This keeps the SEO metadata bundle small by avoiding the full company dataset

import { companies } from "./companies";

// Extract only the fields needed for JSON-LD ItemList: slug and name
export const seoCompanies = companies.map(({ slug, name }) => ({ slug, name }));

// Export total count for convenience
export const seoCompaniesCount = seoCompanies.length;