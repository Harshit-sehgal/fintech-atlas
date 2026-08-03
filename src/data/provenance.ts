import type { Company, SourceReference } from "./types";

/** Field identifiers accepted by SourceReference.supports. Extend this list as
 * structured catalog fields are migrated; unknown identifiers are rejected so
 * evidence cannot silently point at a misspelled field. */
export const PROVENANCE_FIELDS = new Set([
  "company-profile",
  "founders",
  "employees",
  "valuation",
  "pricing",
  "products",
  "customers",
  "strengths",
  "weaknesses",
  "editorial-sentiment",
  "rating-methodology",
]);

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2}))?$/;

function validDate(value: string | undefined): boolean {
  return Boolean(value && ISO_DATE.test(value) && !Number.isNaN(Date.parse(value)));
}

function validateSource(source: SourceReference, index: number): string[] {
  const issues: string[] = [];
  const prefix = `sourceReferences[${index}]`;
  if (!source.id.trim()) issues.push(`${prefix}.id is required`);
  if (!source.publisher.trim()) issues.push(`${prefix}.publisher is required`);
  if (!source.title.trim()) issues.push(`${prefix}.title is required`);
  if (!validDate(source.accessedAt)) issues.push(`${prefix}.accessedAt must be an ISO date`);
  if (source.effectiveAt && !validDate(source.effectiveAt)) {
    issues.push(`${prefix}.effectiveAt must be an ISO date when provided`);
  }
  if (source.url && !/^https?:\/\/[^\s]+$/.test(source.url)) {
    issues.push(`${prefix}.url must be an absolute http(s) URL when provided`);
  }
  if (source.supports.length === 0 || source.supports.some((field) => !field.trim())) {
    issues.push(`${prefix}.supports must name at least one non-empty field`);
  }
  for (const field of source.supports) {
    if (field.trim() && !PROVENANCE_FIELDS.has(field)) {
      issues.push(`${prefix}.supports contains unknown field: ${field}`);
    }
  }
  return issues;
}

/**
 * Validate only the optional structured evidence fields. Legacy string labels
 * remain supported until the catalog receives a source-research migration.
 */
export function validateCompanyProvenance(company: Company): string[] {
  const issues: string[] = [];
  const references = company.sourceReferences ?? [];
  const referenceIds = new Set<string>();

  references.forEach((source, index) => {
    issues.push(...validateSource(source, index));
    if (referenceIds.has(source.id)) issues.push(`duplicate source id: ${source.id}`);
    referenceIds.add(source.id);
  });

  const sourcedValues = [
    ["employeesSourced", company.employeesSourced],
    ["financialValue", company.financialValue],
  ] as const;
  for (const [field, value] of sourcedValues) {
    if (!value) continue;
    if ("asOf" in value && value.asOf && !validDate(value.asOf)) {
      issues.push(`${field}.asOf must be an ISO date when provided`);
    }
    if (value.sourceIds.length === 0) issues.push(`${field}.sourceIds must not be empty`);
    for (const sourceId of value.sourceIds) {
      if (!referenceIds.has(sourceId)) issues.push(`${field} references unknown source id: ${sourceId}`);
    }
  }

  return issues;
}
