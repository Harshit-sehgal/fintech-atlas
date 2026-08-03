/**
 * Provenance coverage gate for the published company catalog.
 * Run via `npm run check:provenance`.
 */

import { companies } from "../src/data/companies";
import { validateCompanyProvenance } from "../src/data/provenance";

const total = companies.length;
const missing = companies.filter((company) => company.sourceReferences.length === 0);
const invalid: string[] = [];

for (const company of companies) {
  const issues = validateCompanyProvenance(company);
  if (issues.length > 0) {
    invalid.push(`${company.slug}:\n      ${issues.join("\n      ")}`);
  }
}

console.log("\n— Provenance coverage —");
console.log(`Structured sourceReferences: ${total - missing.length}/${total} companies`);

if (missing.length > 0) {
  console.error(`\n✗ Missing structured provenance:\n  ${missing.map((company) => company.slug).join("\n  ")}`);
  process.exit(1);
}

if (invalid.length > 0) {
  console.error("\n✗ Invalid provenance records:\n      " + invalid.join("\n      "));
  process.exit(1);
}

console.log("\n✓ All company provenance records validate.\n");
