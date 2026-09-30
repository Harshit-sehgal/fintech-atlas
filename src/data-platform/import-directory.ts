/**
 * Import pipeline: research directory → canonical data platform records.
 *
 * The enriched markdown (docs/research/india-fintech-directory-enriched.md) is
 * the single source of truth for the import. Every row becomes a CompanyRecord
 * with categories, licences, funding and per-field evidence rows so nothing is
 * asserted without provenance (ADR-002).
 */
import type { IndiaDirectoryRecord } from "@/lib/india-directory-parse";
import {
  parseFoundedYear,
  parseFundingUsdM,
} from "@/lib/radar-facets";
import { buildLicenceRecords, evidenceFor } from "./evidence";
import { RESEARCH_COMPILED_AT, SOURCES } from "./sources";
import type { CompanyRecord, CoverageStats, DataPlatformSnapshot } from "./types";

const DEFAULT_SOURCE = "research-directory";

function normalizeWebsite(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "");
}

function stripMarks(value: string): string {
  return value.replace(/\*\*|`/g, "");
}

/** Normalizes a category label into a stable primary key (SQL-friendly). */
export function categoryId(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Collapses category labels into a canonical id → first-seen label map so two
 * labels that normalize identically (case/punctuation variants) produce one
 * row instead of a primary-key collision.
 */
export function collectCategoryIds(labels: Iterable<string>): Map<string, string> {
  const map = new Map<string, string>();
  for (const label of labels) {
    const id = categoryId(label);
    if (!map.has(id)) map.set(id, label);
  }
  return map;
}

export type CompanyStatus = "operating" | "acquired" | "merged" | "shut-down" | "unknown";

/**
 * Derives the schema's `company_status` enum value from the directory's
 * free-form valuation/status column. Explicit lifecycle markers win; the
 * directory catalogs operating fintechs, so a bare valuation implies
 * operating.
 */
export function mapCompanyStatus(text: string): CompanyStatus {
  const t = text.toLowerCase();
  if (/(acquired|acquisition)/.test(t)) return "acquired";
  if (/(merged|merger)/.test(t)) return "merged";
  if (/(shut|defunct|wound|bankrupt|insolven|closed|delisted)/.test(t)) return "shut-down";
  return "operating";
}

/** Maps one research row into a full canonical record with evidence. */
export function importDirectoryRecord(record: IndiaDirectoryRecord): CompanyRecord {
  const foundedYear = parseFoundedYear(record.founded);
  const fundingUsdM = parseFundingUsdM(record.funding);
  const website = normalizeWebsite(record.website);

  const licences = buildLicenceRecords(record.slug, record.cluster, record.licences);

  const evidence = [];
  evidence.push(evidenceFor(record.slug, "category", record.category, "D", DEFAULT_SOURCE));
  if (foundedYear !== null) {
    evidence.push(evidenceFor(record.slug, "foundedYear", String(foundedYear), "D", DEFAULT_SOURCE));
  }
  if (fundingUsdM !== null) {
    evidence.push(evidenceFor(record.slug, "fundingUsdM", String(fundingUsdM), "D", DEFAULT_SOURCE));
  }
  if (website) {
    evidence.push(evidenceFor(record.slug, "website", website, "D", DEFAULT_SOURCE));
  }
  for (const licence of licences) {
    evidence.push(
      evidenceFor(
        record.slug,
        `licence.${licence.code}`,
        `${licence.label} (${licence.regulator})`,
        licence.confidence,
        licence.sourceId,
        licence.notes,
      ),
    );
  }

  return {
    company: {
      id: record.slug,
      legalName: stripMarks(record.name),
      displayName: stripMarks(record.name),
      website,
      description: stripMarks(record.description),
      foundedYear: foundedYear ?? undefined,
      headquarters: stripMarks(record.hq) || undefined,
      cluster: record.cluster,
      category: record.category,
      valuationOrStatus: stripMarks(record.valuationOrStatus),
      status: stripMarks(record.valuationOrStatus),
    },
    categories: [
      {
        companyId: record.slug,
        category: record.category,
        confidence: "D",
        sourceId: DEFAULT_SOURCE,
      },
    ],
    licences,
    funding:
      fundingUsdM === null
        ? []
        : [
            {
              companyId: record.slug,
              totalUsdM: fundingUsdM,
              raw: record.funding,
              verifiedAt: RESEARCH_COMPILED_AT,
              sourceId: DEFAULT_SOURCE,
              confidence: "D",
            },
          ],
    evidence,
  };
}

/** Imports the full directory into a canonical snapshot. */
export function importDirectory(records: IndiaDirectoryRecord[]): DataPlatformSnapshot {
  return {
    generatedAt: new Date().toISOString(),
    researchCompiledAt: RESEARCH_COMPILED_AT,
    sources: SOURCES,
    records: records.map(importDirectoryRecord),
  };
}

export function coverageStats(snapshot: DataPlatformSnapshot): CoverageStats {
  let licences = 0;
  let funding = 0;
  let foundedYears = 0;
  let websites = 0;
  let evidenceRows = 0;
  for (const record of snapshot.records) {
    licences += record.licences.length;
    funding += record.funding.length;
    if (record.company.foundedYear !== undefined) foundedYears += 1;
    if (record.company.website) websites += 1;
    evidenceRows += record.evidence.length;
  }
  return {
    companies: snapshot.records.length,
    licences,
    funding,
    foundedYears,
    websites,
    evidenceRows,
  };
}