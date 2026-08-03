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
  /** Optional structured metadata for records migrated to the audited schema. */
  sourceReferences?: SourceReference[];
  employeesSourced?: SourcedValue<string>;
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
