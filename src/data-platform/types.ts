/**
 * Canonical types for the FinTech Atlas Radar data platform.
 *
 * These are the private-platform entity shapes (ADR-002). The public site only
 * consumes generated, safe subsets — never these full records directly.
 */

/** A–E verification hierarchy (see docs/architecture/RADAR-ARCHITECTURE.md §3). */
export type Confidence = "A" | "B" | "C" | "D" | "E";

export type SourceType =
  | "regulator"
  | "official-website"
  | "filing"
  | "publication"
  | "database"
  | "machine";

export interface Source {
  id: string;
  url?: string;
  publisher: string;
  sourceType: SourceType;
  accessedAt: string;
  effectiveAt?: string;
}

export interface Company {
  id: string;
  legalName: string;
  displayName: string;
  website?: string;
  description?: string;
  foundedYear?: number;
  headquarters?: string;
  cluster: string;
  category: string;
  valuationOrStatus: string;
  status: string;
}

export interface CategoryAssignment {
  companyId: string;
  category: string;
  confidence: Confidence;
  sourceId: string;
}

export type LicenceStatus = "authorised" | "in-principle" | "application" | "unknown";

export interface LicenceRecord {
  companyId: string;
  regulator: string;
  code: string;
  label: string;
  status: LicenceStatus;
  registrationNumber?: string;
  effectiveDate?: string;
  verifiedAt: string;
  sourceId: string;
  confidence: Confidence;
  notes?: string;
}

export interface FundingRecord {
  companyId: string;
  totalUsdM?: number;
  raw: string;
  verifiedAt: string;
  sourceId: string;
  confidence: Confidence;
}

export interface Evidence {
  companyId: string;
  fieldName: string;
  value: string;
  sourceId: string;
  confidence: Confidence;
  verifiedAt: string;
  effectiveAt?: string;
  notes?: string;
}

/** Full canonical record for one company. */
export interface CompanyRecord {
  company: Company;
  categories: CategoryAssignment[];
  licences: LicenceRecord[];
  funding: FundingRecord[];
  evidence: Evidence[];
}

export interface DataPlatformSnapshot {
  generatedAt: string;
  researchCompiledAt: string;
  sources: Source[];
  records: CompanyRecord[];
}

export interface CoverageStats {
  companies: number;
  licences: number;
  funding: number;
  foundedYears: number;
  websites: number;
  evidenceRows: number;
}