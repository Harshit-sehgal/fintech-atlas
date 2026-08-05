export interface CompanyOffer {
  name: string;
  description: string;
}

export interface CompanyPricing {
  model: string;
  online?: string;
  inPerson?: string;
  monthly?: string;
  international?: string;
  notes?: string;
}

export type SourceType =
  | "official-documentation"
  | "regulatory-filing"
  | "company-report"
  | "review-aggregator"
  | "news-report"
  | "editorial-reference";

/**
 * Machine-checkable legal ownership status of a company (T009).
 *
 *  - "public"       → publicly traded on a stock exchange.
 *  - "private"      → privately held; not listed on any public exchange.
 *  - "subsidiary"   → wholly-owned subsidiary of a parent corporation.
 *  - "division"     → a business unit or product line of a larger company.
 *  - "acquired"     → acquired by a larger company and now operates as part of it.
 *  - "not-disclosed" → ownership status is not publicly verifiable.
 */
export type OwnershipType =
  | "public"
  | "private"
  | "subsidiary"
  | "division"
  | "acquired"
  | "not-disclosed";

export interface SourceReference {
  id: string;
  publisher: string;
  title: string;
  url?: string;
  accessedAt: string;
  /** Optional date on which the cited fact became effective or was published. */
  effectiveAt?: string;
  sourceType: SourceType;
  supports: string[];
}

export interface SourcedValue<T> {
  value: T;
  asOf: string;
  sourceIds: string[];
  confidence?: "high" | "medium" | "low";
}

export type CompanyFinancialValue =
  | {
      type: "private-valuation";
      display: string;
      /** Numeric amount in whole US dollars, used for sorting/comparison. */
      amountUsd?: number;
      asOf?: string;
      sourceIds: string[];
    }
  | {
      type: "public-market-cap";
      display: string;
      /** Numeric amount in whole US dollars, used for sorting/comparison. */
      amountUsd?: number;
      asOf?: string;
      sourceIds: string[];
    }
  | {
      type: "not-disclosed";
      display: string;
      sourceIds: string[];
    };

export interface CompanyUserReviews {
  /** Editorial sentiment summary, not a statistically weighted community aggregate. */
  rating: number;
  summary: string;
  pros: string[];
  cons: string[];
  methodology?: string;
  asOf?: string;
  sources?: SourceReference[];
}

export interface Company {
  slug: string;
  name: string;
  tagline: string;
  founded: number;
  founders: string[];
  headquarters: string;
  employees: string;
  /** Machine-checkable legal ownership classification (T009). */
  ownershipType: OwnershipType;
  valuation: string;
  website: string;
  categories: string[];
  logo: string;
  accent: string;
  oneLiner: string;
  whatIsIt: string;
  whatTheyOffer: CompanyOffer[];
  whoUses: string[];
  pricing: CompanyPricing;
  strengths: string[];
  weaknesses: string[];
  userReviews: CompanyUserReviews;
  sources: string[];
  /**
   * Structured numeric valuation (whole US dollars) used for numeric sorting.
   * Kept separate from the human-readable `valuation` display string so the
   * directory never has to parse display text at runtime (audit #37). Undefined
   * when the company has no independently comparable valuation (e.g. a
   * subsidiary/product of a parent), in which case it sorts after known values.
   */
  valuationAmountUsd?: number;
  /** Structured evidence required for every published catalog record. */
  sourceReferences: SourceReference[];
  employeesSourced?: SourcedValue<string>;
  availability?: CompanyAvailability;
  financialValue?: CompanyFinancialValue;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  accent: string;
  short: string;
  description: string;
  marketSize?: string;
  growth?: string;
  trends?: string[];
  keyPlayers?: string[];
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  short: string;
  long: string;
  full?: string;
  related: string[];
}

/**
 * Machine-readable capabilities used by the matchmaker so ANY company can be
 * scored (audit #30). Quiz answers express capability requirements; a company
 * scores when its capabilities satisfy them. Kept separate from the manual
 * slug→points matrix so adding a company is safe and automatic.
 */
/**
 * Structured geographic availability of a company (T010).
 * Surfaces what regions the service operates in, which are excluded, and
 * what provenance evidence supports each claim.
 */
export interface CompanyAvailability {
  /** Countries/regions where the company's services are available. */
  supportedRegions: string[];
  /** Known countries/regions where the services are expressly unavailable. */
  unavailableRegions: string[];
  /** ISO date the availability snapshot was last verified. */
  asOf: string;
  /**
   * Source IDs (must exist in sourceReferences) that verify availability.
   * Should include geographic-coverage evidence.
   */
  sourceIds: string[];
}

export interface CompanyCapabilities {
  /** High-level problems/solutions the product addresses. */
  useCases: string[];
  /** Who it serves. */
  customerTypes: string[];
  /** How it is delivered / reached. */
  channels: string[];
  /** Differentiating product traits. */
  features: string[];
}

/** Commercial relationship for outbound partner CTAs (affiliate / sponsored inventory). */
export type PartnerRelationship = "affiliate" | "sponsored" | "none";

/**
 * Per-company monetization config, kept separate from editorial company records
 * so ratings and narrative stay independent of commercial status.
 */
export interface PartnerOffer {
  companySlug: string;
  /**
   * Outbound URL used by Partner CTAs.
   * Use a real affiliate/partner URL once enrolled; otherwise the official site.
   */
  ctaUrl: string;
  /** Button label, e.g. "Visit Stripe" or "Open Wise". */
  ctaLabel: string;
  relationship: PartnerRelationship;
  /** When true, company may appear in Featured Partner inventory. */
  sponsored?: boolean;
  /** Badge copy when sponsored, e.g. "Featured partner". */
  sponsoredLabel?: string;
  /** Stable id for analytics / partner networks. */
  trackingId?: string;
  /** Sort weight for featured rails (lower = earlier). */
  priority?: number;
  /** Optional notes for operators (not shown in UI). */
  notes?: string;
}
