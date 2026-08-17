/**
 * Company matching — resolves snapshot entries to canonical companies using
 * fuzzy name matching (src/lib/fuzzy.ts). Requires a minimum score; ambiguous
 * matches surface in the review queue rather than being silently applied.
 */
import { fuzzyRank, fuzzyScore } from "@/lib/fuzzy";
import type { Company } from "../types";

export interface MatchResult {
  companyId?: string;
  companyName: string;
  score: number;
  matchedName?: string;
  ambiguous: boolean;
}

const MIN_SCORE = 40;

/** Normalizes a company name for matching (suffixes, casing, entities). */
export function normalizeCompanyName(value: string): string {
  return value
    .toLowerCase()
    .replace(/\(india\)|\(indias\)/gi, "")
    .replace(/\b(indiaideas\.com|gobrisk)\b/gi, "")
    .replace(/\bprivate limited\b|\bprivate ltd\b|\blimited\b|\bltd\b|\bllp\b/gi, "")
    .replace(/\bpayment(s)?\b/gi, "")
    .replace(/\btechnolog(ies|y)?\b/gi, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const nameFields = (c: Company) => [
  normalizeCompanyName(c.displayName),
  normalizeCompanyName(c.legalName),
];

function scoreOf(c: Company, query: string): number {
  return Math.max(...nameFields(c).map((name) => fuzzyScore(name, query)));
}

const exactDisplayMatch = (c: Company, rawName: string) =>
  c.displayName.toLowerCase() === rawName.toLowerCase() ||
  c.legalName.toLowerCase() === rawName.toLowerCase();

/** Picks the best matching canonical company for a snapshot entry name. */
export function matchCompany(entryName: string, companies: Company[]): MatchResult {
  const query = normalizeCompanyName(entryName);

  // 1. Exact display/legal match wins outright and is never ambiguous
  //    (e.g. "Cashfree Payments" vs the distinct "Cashfree Payments PPI" record).
  const exact = companies.filter((c) => exactDisplayMatch(c, entryName));
  if (exact.length === 1) {
    const candidate = exact[0];
    return {
      companyId: candidate.id,
      companyName: entryName,
      matchedName: candidate.displayName,
      score: scoreOf(candidate, query),
      ambiguous: false,
    };
  }

  // 2. Unique normalized exact match.
  const normalizedExact = companies.filter((c) => nameFields(c).some((n) => n === query));
  if (normalizedExact.length === 1) {
    const candidate = normalizedExact[0];
    return {
      companyId: candidate.id,
      companyName: entryName,
      matchedName: candidate.displayName,
      score: scoreOf(candidate, query),
      ambiguous: false,
    };
  }

  // 3. Fuzzy fallback — flag ties so they surface in the review queue.
  const ranked = fuzzyRank(companies, query, nameFields);
  const top = ranked.slice(0, 3);
  const best = top[0];
  if (!best) {
    return { companyName: entryName, score: 0, ambiguous: false };
  }

  const score = scoreOf(best, query);
  if (score < MIN_SCORE) {
    return { companyName: entryName, score, ambiguous: false };
  }

  const ambiguous =
    top.length > 1 &&
    top.some((other) => other.id !== best.id && Math.abs(scoreOf(other, query) - score) < 6);

  return {
    companyId: best.id,
    companyName: entryName,
    matchedName: best.displayName,
    score,
    ambiguous,
  };
}

/** Resolves every entry; unmatched/ambiguous results need human review. */
export function matchAll(
  entries: Array<{ companyName: string }>,
  companies: Company[],
): MatchResult[] {
  return entries.map((entry) => matchCompany(entry.companyName, companies));
}