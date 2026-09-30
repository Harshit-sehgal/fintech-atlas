/**
 * Freshness policy grading (Phase 22) — every fact carries a verification
 * date, and every fact family carries a refresh priority. High-priority facts
 * (regulatory status, pricing) go stale fast; low-priority facts (founded
 * year) age slowly. The grader turns `verifiedAt` into an explicit
 * fresh / due / stale state so operators know exactly what needs
 * re-verification next, and the product can surface "Verified 5 days ago"
 * honestly instead of presenting stale data as current.
 *
 * Pure and unit-testable; consumed by the review console (platform-level
 * stats) and by the /radar company profiles (per-record block).
 */
import type { CompanyRecord, DataPlatformSnapshot } from "./types";

export type FreshnessPriority = "high" | "medium" | "low" | "very-low";

export type FreshnessState = "fresh" | "due" | "stale";

export interface FreshnessPolicy {
  priority: FreshnessPriority;
  maxAgeDays: number;
  label: string;
}

/**
 * Refresh policies per evidence-field family. `licence.*` rows (one per
 * licence code) all share the regulatory policy. Families absent here get a
 * low default so nothing silently evades grading.
 */
export const FIELD_FRESHNESS_POLICIES: Record<string, FreshnessPolicy> = {
  "licence": { priority: "high", maxAgeDays: 30, label: "Regulatory licences" },
  "fundingUsdM": { priority: "medium", maxAgeDays: 90, label: "Funding" },
  "category": { priority: "low", maxAgeDays: 180, label: "Category" },
  "website": { priority: "low", maxAgeDays: 180, label: "Website" },
  "foundedYear": { priority: "very-low", maxAgeDays: 365, label: "Founded year" },
};

export const DEFAULT_FRESHNESS_POLICY: FreshnessPolicy = {
  priority: "low",
  maxAgeDays: 180,
  label: "Other fields",
};

/** Resolves the evidence-family name for a field ("licence.PA" → "licence"). */
export function evidenceFamily(fieldName: string): string {
  return fieldName.startsWith("licence.") ? "licence" : fieldName;
}

export function policyForFamily(family: string): FreshnessPolicy {
  return FIELD_FRESHNESS_POLICIES[family] ?? DEFAULT_FRESHNESS_POLICY;
}

/** Days between two ISO dates (fractional). */
export function daysBetween(fromIso: string, toIso: string): number {
  return (Date.parse(toIso) - Date.parse(fromIso)) / (24 * 60 * 60 * 1000);
}

/**
 * Graded state from an age vs the policy window: fresh inside the window,
 * "due" up to double the window, "stale" beyond that. A fact is never
 * silently current once its window has passed.
 */
export function freshnessStateForAge(ageDays: number, maxAgeDays: number): FreshnessState {
  if (ageDays <= maxAgeDays) return "fresh";
  if (ageDays <= maxAgeDays * 2) return "due";
  return "stale";
}

export interface FieldFreshness {
  family: string;
  label: string;
  priority: FreshnessPriority;
  maxAgeDays: number;
  ageDays: number;
  state: FreshnessState;
  verifiedAt: string;
}

export interface RecordFreshnessSummary {
  companyId: string;
  asOf: string;
  fields: FieldFreshness[];
  overallState: FreshnessState;
  oldestVerifiedAt: string;
  needsVerification: FieldFreshness[];
}

const STATE_RANK: Record<FreshnessState, number> = { fresh: 0, due: 1, stale: 2 };

function worstState(states: FreshnessState[]): FreshnessState {
  return states.reduce<FreshnessState>(
    (worst, next) => (STATE_RANK[next] > STATE_RANK[worst] ? next : worst),
    "fresh",
  );
}

/**
 * Graded freshness for one company record — one FieldFreshness per evidence
 * family present, graded against the family's policy window. The oldest
 * verifiedAt within a family drives its age (the most conservative signal).
 */
export function recordFreshness(record: CompanyRecord, asOf: string): RecordFreshnessSummary {
  const byFamily = new Map<string, string[]>();
  for (const row of record.evidence) {
    const family = evidenceFamily(row.fieldName);
    const list = byFamily.get(family) ?? [];
    list.push(row.verifiedAt);
    byFamily.set(family, list);
  }

  const fields: FieldFreshness[] = [];
  for (const [family, verifiedAts] of byFamily) {
    const oldest = verifiedAts.sort()[0];
    const policy = policyForFamily(family);
    const ageDays = Math.max(0, daysBetween(oldest, asOf));
    fields.push({
      family,
      label: policy.label,
      priority: policy.priority,
      maxAgeDays: policy.maxAgeDays,
      ageDays,
      state: freshnessStateForAge(ageDays, policy.maxAgeDays),
      verifiedAt: oldest,
    });
  }
  fields.sort((a, b) => STATE_RANK[b.state] - STATE_RANK[a.state]);

  const needsVerification = fields.filter((f) => f.state !== "fresh");
  const oldestVerifiedAt =
    fields.length > 0 ? fields.map((f) => f.verifiedAt).sort()[0] : asOf;

  return {
    companyId: record.company.id,
    asOf,
    fields,
    overallState: worstState(fields.map((f) => f.state)),
    oldestVerifiedAt,
    needsVerification,
  };
}

export interface SnapshotFreshnessStats {
  asOf: string;
  companies: number;
  fresh: number;
  due: number;
  stale: number;
  freshPct: number;
  /** The most overdue (company, family) pairs, worst first, top 10. */
  stalest: Array<{ companyId: string; family: string; state: FreshnessState; ageDays: number }>;
}

/** Platform-level freshness health over the whole canonical snapshot. */
export function snapshotFreshnessStats(
  snapshot: DataPlatformSnapshot,
  asOf: string,
): SnapshotFreshnessStats {
  let fresh = 0;
  let due = 0;
  let stale = 0;
  const stalest: SnapshotFreshnessStats["stalest"] = [];

  for (const record of snapshot.records) {
    const summary = recordFreshness(record, asOf);
    if (summary.overallState === "stale") stale += 1;
    else if (summary.overallState === "due") due += 1;
    else fresh += 1;

    for (const field of summary.needsVerification) {
      stalest.push({
        companyId: record.company.id,
        family: field.family,
        state: field.state,
        ageDays: field.ageDays,
      });
    }
  }

  stalest.sort((a, b) => b.ageDays - a.ageDays);

  const companies = snapshot.records.length;
  return {
    asOf,
    companies,
    fresh,
    due,
    stale,
    freshPct: companies === 0 ? 0 : Math.round((fresh / companies) * 100),
    stalest: stalest.slice(0, 10),
  };
}