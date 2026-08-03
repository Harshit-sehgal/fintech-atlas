/**
 * Provenance coverage report — prints how many company records carry structured
 * `sourceReferences` (vs legacy string labels) and fails only if a migrated
 * record fails validation. Run via `npm run check:provenance`.
 *
 * The migration is incremental by design: a low coverage number is a work item,
 * not a broken build. Add entries in `src/data/provenance-records.ts`.
 */

import { companies } from "../src/data/companies";
import { validateCompanyProvenance } from "../src/data/provenance";

const migrated = companies.filter((c) => (c.sourceReferences?.length ?? 0) > 0);
const total = companies.length;

console.log("\n— Provenance coverage —");
console.log(
  `Structured sourceReferences: ${migrated.length}/${total} companies ` +
    `(${Math.round((migrated.length / total) * 100)}%)`,
);

const invalid: string[] = [];
for (const company of companies) {
  const issues = validateCompanyProvenance(company);
  if (issues.length > 0) {
    invalid.push(`${company.slug}:\n      ${issues.join("\n      ")}`);
  }
}

if (invalid.length > 0) {
  console.error("\n✗ Invalid provenance records:\n      " + invalid.join("\n      "));
  process.exit(1);
}

if (migrated.length === 0) {
  console.warn("\n⚠ No companies migrated yet. See src/data/provenance-records.ts.");
} else {
  console.log("\n✓ All migrated provenance records validate.\n");
  console.log("Migrated:", migrated.map((c) => c.slug).join(", "));
}
