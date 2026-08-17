/**
 * Radar facets — the derived filter dimensions for the /radar product surface.
 *
 * Radar does not invent new company data. It re-derives, deterministically,
 * four filter dimensions from what the research directory already publishes:
 *
 *   sector     — normalised from the researcher-assigned cluster name
 *   regulator  — normalised from the cluster name (never asserted per-company)
 *   licences   — from licence-labelled clusters + licence strings in the record
 *   founded / funding — parsed from the record's own text fields
 *
 * Every rule is keyword-based over the 99 cluster names in the enriched
 * research file; ambiguous multi-sector clusters are pinned via the override
 * maps below. The generator (`scripts/generate-radar-facets.ts`) runs every
 * build, so a cluster renamed in the research markdown re-derives facets from
 * the same rules without manual edits.
 */

import type { IndiaDirectoryRecord } from "./india-directory-parse";

export type RadarSector =
  | "payments"
  | "cross-border"
  | "lending"
  | "wealth"
  | "insurance"
  | "banking"
  | "crypto"
  | "infrastructure"
  | "other";

export const RADAR_SECTORS: readonly RadarSector[] = [
  "payments",
  "cross-border",
  "lending",
  "wealth",
  "insurance",
  "banking",
  "crypto",
  "infrastructure",
  "other",
] as const;

export const RADAR_SECTOR_LABELS: Record<RadarSector, string> = {
  payments: "Payments",
  "cross-border": "Cross-border & FX",
  lending: "Lending & Credit",
  wealth: "Wealth & Investing",
  insurance: "Insurance",
  banking: "Banking",
  crypto: "Crypto & Web3",
  infrastructure: "Infrastructure & B2B SaaS",
  other: "Other / mixed",
};

export type RadarRegulator = "RBI" | "SEBI" | "IRDAI" | "NPCI" | "FIU" | "mixed";

export const RADAR_REGULATORS: readonly RadarRegulator[] = [
  "RBI",
  "SEBI",
  "IRDAI",
  "NPCI",
  "FIU",
  "mixed",
] as const;

export const RADAR_REGULATOR_LABELS: Record<RadarRegulator, string> = {
  RBI: "RBI",
  SEBI: "SEBI",
  IRDAI: "IRDAI",
  NPCI: "NPCI",
  FIU: "FIU (crypto VASP)",
  mixed: "None / mixed",
};

export type RadarLicence =
  | "PA"
  | "PA-CB"
  | "PPI"
  | "AA"
  | "P2P"
  | "TPAP"
  | "MTSS"
  | "SFB"
  | "AD-II"
  | "ATM"
  | "BBPOU";

export const RADAR_LICENCES: readonly RadarLicence[] = [
  "PA",
  "PA-CB",
  "PPI",
  "AA",
  "P2P",
  "TPAP",
  "MTSS",
  "SFB",
  "AD-II",
  "ATM",
  "BBPOU",
] as const;

export const RADAR_LICENCE_LABELS: Record<RadarLicence, string> = {
  PA: "Payment Aggregator",
  "PA-CB": "PA Cross-Border (PA-CB)",
  PPI: "Prepaid Payment Instrument (PPI)",
  AA: "Account Aggregator",
  P2P: "NBFC-P2P",
  TPAP: "UPI Third-Party App (TPAP)",
  MTSS: "MTSS / Remittance",
  SFB: "Small Finance Bank",
  "AD-II": "Authorised Dealer-II",
  ATM: "White-label ATM operator",
  BBPOU: "BBPOU (bill payments)",
};

export interface RadarFacets {
  sector: RadarSector;
  regulator: RadarRegulator;
  licences: RadarLicence[];
  foundedYear: number | null;
  fundingUsdM: number | null;
}

/** Ambiguous or multi-sector clusters pinned explicitly to avoid mislabelling. */
const SECTOR_OVERRIDES: Record<string, RadarSector> = {
  "WEALTH, INVESTING, INSURANCE & CRYPTO CLUSTER": "other",
  "LENDING & BANKING CLUSTER": "other",
  "NEW-GEN STARTUPS (2020+) & INDIAN FINTECH APPS": "other",
  "GLOBAL PLAYERS SERVING INDIA": "other",
  "GLOBAL PLAYERS SERVING INDIA (cross-border agents)": "cross-border",
  "AI FINTECH": "infrastructure",
  "EXCHANGES & TRADING PLATFORMS": "crypto",
  "GCC / GLOBAL EXCHANGES WITH INDIA OPERATIONS": "crypto",
  "BOND / INVOICE & SCF MARKETPLACES": "lending",
  "EDUCATION & PERSONAL FINANCE": "wealth",
  "WEALTHTECH, BROKING & INVESTING": "wealth",
  "GLOBAL SME-BANKING & TREASURY FINTECHS": "cross-border",
  "GLOBAL BROKERS & CROSS-BORDER INVESTING PLATFORMS": "cross-border",
  "GLOBAL ASSET MANAGERS": "wealth",
  "GLOBAL MARKET DATA, ANALYTICS & RATINGS": "infrastructure",
  "GLOBAL CARD NETWORKS": "payments",
  "NICHE FINANCIAL SOFTWARE & MEDIA": "infrastructure",
  "GCC EXCHANGE HOUSES - INDIA REMITTANCE CORRIDOR": "cross-border",
  "CROSS-BORDER, NRI & DIASPORA": "cross-border",
  "CROSS-BORDER REMITTANCE & PAYOUT PLATFORMS": "cross-border",
  "ACCOUNT AGGREGATORS": "payments",
  "CORE BANKING & BFSI SOFTWARE PRODUCTS": "infrastructure",
  "ATM SOFTWARE & CASH MANAGEMENT": "infrastructure",
  "SME BILLING & ACCOUNTING SOFTWARE": "infrastructure",
  "EDUCATION FINANCE": "lending",
  "HEALTHCARE FINANCING": "lending",
  "VEHICLE / EV / MOBILITY FINANCE": "lending",
  "RENT / SECURITY-DEPOSIT / NICHE FINANCING": "lending",
  "BHARAT / VERNACULAR / GIG-ECONOMY FINANCE": "other",
  "MSME, DISTRIBUTION & PROPERTY INFRA": "infrastructure",
  "IRDAI WEB AGGREGATORS": "insurance",
};

/** Ordered keyword rules — first match wins. Order matters. */
const SECTOR_RULES: Array<[RadarSector, RegExp]> = [
  ["cross-border", /CROSS-BORDER|GCC EXCHANGE|REMITTANCE|AUTHORISED DEALER|MTSS|TREASURY, FX/],
  ["payments", /PAYMENT|PPI|UPI|TPAP|WALLET|CARD|ATM|BILLING|GIFT CARD|SUPERAPP/],
  ["insurance", /INSUR|REINSUR|POSP|MICROINSURANCE/],
  ["crypto", /CRYPTO|WEB3|NFT|VASP|TOKENISATION|ON-RAMP|FIU-REGISTERED/],
  [
    "wealth",
    /WEALTH|INVESTING|BROKER|MUTUAL|PORTFOLIO|ROBO|ESOP|AIF |TRADING|STOCK|CROWDFUNDING|ALGO|PERSONAL FINANCE|MICRO-INVESTING|DERIVATIVES/,
  ],
  ["lending", /LENDING|CREDIT|NBFC|MICROFINANCE|TREDS|FACTORING|FINANCING|P2P|EWA|SCF|BUREAU|COLLECTIONS|LOAN/],
  ["banking", /BANK|NEOBANK/],
  [
    "infrastructure",
    /INFRASTRUCTURE|BAAS|BFSI|CORE BANKING|RAILS|SWITCH|SOFTWARE|SAAS|TECH|ENABLERS|AGENT NETWORK|E-SIGN|E-STAMP|DIGITAL TRUST|EXPENSE|SPEND MANAGEMENT|ACCOUNTING|KYC|COMPLIANCE|FRAUD|RISK|ONBOARDING/,
  ],
];

const REGULATOR_OVERRIDES: Record<string, RadarRegulator> = {
  "WEALTH, INVESTING, INSURANCE & CRYPTO CLUSTER": "mixed",
  "LENDING & BANKING CLUSTER": "mixed",
  "PAYROLL / TALENT FINANCIAL TECH": "mixed",
  "EDUCATION & PERSONAL FINANCE": "mixed",
  "EDUCATION FINANCE": "RBI",
  "VEHICLE / EV / MOBILITY FINANCE": "RBI",
  "BOND / INVOICE & SCF MARKETPLACES": "mixed",
  "CROSS-BORDER, NRI & DIASPORA": "mixed",
  "CROSS-BORDER REMITTANCE & PAYOUT PLATFORMS": "mixed",
  "GLOBAL PLAYERS SERVING INDIA (cross-border agents)": "mixed",
  "CORE BANKING & BFSI SOFTWARE PRODUCTS": "mixed",
  "SME BILLING & ACCOUNTING SOFTWARE": "mixed",
  "GLOBAL SME-BANKING & TREASURY FINTECHS": "mixed",
  "GCC EXCHANGE HOUSES - INDIA REMITTANCE CORRIDOR": "RBI",
  "EXCHANGES & TRADING PLATFORMS": "FIU",
  "GCC / GLOBAL EXCHANGES WITH INDIA OPERATIONS": "FIU",
  "AI FINTECH": "mixed",
  "IRDAI WEB AGGREGATORS": "IRDAI",
  "ATM SOFTWARE & CASH MANAGEMENT": "mixed",
};

const REGULATOR_RULES: Array<[RadarRegulator, RegExp]> = [
  ["IRDAI", /INSUR|REINSUR|POSP|MICROINSURANCE/],
  ["NPCI", /UPI|TPAP/],
  ["FIU", /CRYPTO|WEB3|NFT|VASP|TOKENISATION|ON-RAMP|FIU/],
  [
    "SEBI",
    /BROKER|PORTFOLIO|AIF|MUTUAL|ROBO|STOCK|ESOP|EXCHANGE|TRADING|ALGO|CROWDFUNDING|DERIVATIVES|ASSET MANAGER|INVESTING|WEALTHTECH|PERSONAL FINANCE/,
  ],
  [
    "RBI",
    /PAYMENT|PPI|NBFC|ACCOUNT AGGREGATOR|SMALL FINANCE|ATM|MTSS|AUTHORISED DEALER|TREDS|MICROFINANCE|FACTORING|P2P|BANK|LENDING|CREDIT|WALLET|CARD|BILLING|PAYROLL|FINANCING|SUPERAPP|GIFT CARD|BUREAU|COLLECTIONS|EWA|RENT|SECURITY-DEPOSIT|BAAS|BFSI|RAILS|SWITCH|BBPOU/,
  ],
];

/** Clusters that label the licence they contain, so the licence is structural. */
const CLUSTER_LICENCES: Record<string, RadarLicence[]> = {
  "PAYMENT AGGREGATORS (PA-O / PA-P / PA-CB)": ["PA", "PA-CB"],
  "PPI ISSUERS (non-bank)": ["PPI"],
  "ACCOUNT AGGREGATORS": ["AA"],
  "NBFC-P2P PLATFORMS": ["P2P"],
  "SMALL FINANCE BANKS": ["SFB"],
  "WHITE-LABEL ATM OPERATORS": ["ATM"],
  "MTSS / REMITTANCE OVERSEAS PRINCIPALS": ["MTSS"],
  "AUTHORISED DEALER-II (FX)": ["AD-II"],
  "UPI THIRD-PARTY APPS (NPCI TPAP)": ["TPAP"],
};

const FIELD_LICENCE_RULES: Array<[RadarLicence, RegExp]> = [
  ["PA-CB", /\bPA[- ]CB\b|PA-CB-E&I/i],
  ["PA", /\bPA\b(?![- ]CB)/i],
  ["PPI", /\bPPI\b/i],
  ["AA", /\bAA\b|Account Aggregator/i],
  ["P2P", /\bP2P\b/i],
  ["TPAP", /\bTPAP\b|Third[- ]Party App/i],
  ["MTSS", /\bMTSS\b/i],
  ["SFB", /\bSFB\b|Small Finance Bank/i],
  ["AD-II", /\bAD[- ]II\b|Authorised Dealer/i],
  ["ATM", /ATM|white[- ]label/i],
  ["BBPOU", /\bBBPOU\b/i],
];

export function deriveSector(cluster: string): RadarSector {
  const pinned = SECTOR_OVERRIDES[cluster];
  if (pinned) return pinned;
  for (const [sector, rule] of SECTOR_RULES) {
    if (rule.test(cluster)) return sector;
  }
  return "other";
}

export function deriveRegulator(cluster: string): RadarRegulator {
  const pinned = REGULATOR_OVERRIDES[cluster];
  if (pinned) return pinned;
  for (const [regulator, rule] of REGULATOR_RULES) {
    if (rule.test(cluster)) return regulator;
  }
  return "mixed";
}

/** Extracts licences from the record's licence text (e.g. "RBI PA-O + PPI"). */
export function licencesFromField(value: string): RadarLicence[] {
  const found: RadarLicence[] = [];
  for (const [licence, rule] of FIELD_LICENCE_RULES) {
    if (rule.test(value)) found.push(licence);
  }
  return found;
}

export function deriveLicences(cluster: string, licencesField: string): RadarLicence[] {
  const fromCluster = CLUSTER_LICENCES[cluster] ?? [];
  const fromField = licencesFromField(licencesField);
  return [...new Set([...fromCluster, ...fromField])];
}

/** Parses a 4-digit year out of the "Founded" cell ("2014", "n/a"). */
export function parseFoundedYear(founded: string): number | null {
  const match = founded.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

/**
 * Parses the first USD amount in the "Funding" cell into USD millions
 * ("~$741M (12 rounds)" → 741, "~$1.24B+" → 1240, "~$375K" → 0.375).
 * INR-only figures ("IPO ₹18,300 Cr") return null rather than guessing an FX
 * conversion — the prototype only filters amounts that are already in USD.
 */
export function parseFundingUsdM(funding: string): number | null {
  const match = funding.match(/\$\s*([\d.,]+)\s*(M|B|K)?\b/i);
  if (!match) return null;
  const amount = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(amount)) return null;
  const unit = (match[2] ?? "M").toUpperCase();
  if (unit === "B") return amount * 1000;
  if (unit === "K") return amount / 1000;
  return amount;
}

export function deriveRadarFacets(
  record: Pick<IndiaDirectoryRecord, "cluster" | "licences" | "founded" | "funding">,
): RadarFacets {
  return {
    sector: deriveSector(record.cluster),
    regulator: deriveRegulator(record.cluster),
    licences: deriveLicences(record.cluster, record.licences),
    foundedYear: parseFoundedYear(record.founded),
    fundingUsdM: parseFundingUsdM(record.funding),
  };
}