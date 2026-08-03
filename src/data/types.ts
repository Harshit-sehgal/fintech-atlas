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

export interface CompanyUserReviews {
  rating: number;
  summary: string;
  pros: string[];
  cons: string[];
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
