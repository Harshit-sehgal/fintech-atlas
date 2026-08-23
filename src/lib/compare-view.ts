/**
 * Pure presentation logic for the /compare surface (T102, T106, T107).
 *
 * Extracted from the compare client so row grouping, divergence detection,
 * key-difference summarisation and verdict templating are unit-testable
 * without rendering React.
 *
 * Voice rules (matching the page's established tone):
 *  - No invented scores, no winners declared.
 *  - Hedged phrasing everywhere; the table is an orientation tool.
 */

import type { CompanySummary } from "@/generated/company-summaries";
import { DATA_AS_OF } from "@/lib/site-config";
import { formatHeadquartersCity } from "@/lib/format-company";

export type RowGroupId = "decide" | "verify" | "context";

export interface CompareRow {
  id: string;
  label: string;
  group: RowGroupId;
  value: (c: CompanySummary) => string;
}

export const COMPARE_ROWS: CompareRow[] = [
  // ── Decide: the factors that actually change a choice ──
  { id: "pricing-model", label: "Pricing model", group: "decide", value: (c) => c.pricingModel },
  { id: "advantage", label: "Primary advantage", group: "decide", value: (c) => c.primaryStrength ?? "Not documented" },
  { id: "tradeoff", label: "Key tradeoff", group: "decide", value: (c) => c.primaryWeakness ?? "Not documented" },
  { id: "customers", label: "Notable customers", group: "decide", value: (c) => c.customers.join(", ") },
  // ── Verify: where the claim can be checked ──
  { id: "source", label: "Verify at source", group: "verify", value: (c) => c.website },
  // ── Context: identity facts, collapsed by default ──
  { id: "tagline", label: "Tagline", group: "context", value: (c) => c.tagline },
  { id: "founded-hq", label: "Founded & HQ", group: "context", value: (c) => `${c.founded} — ${formatHeadquartersCity(c.headquarters)}` },
  { id: "employees", label: "Employees (reported)", group: "context", value: (c) => c.employees },
  { id: "valuation", label: "Valuation / market value", group: "context", value: (c) => c.valuation },
  { id: "sentiment", label: "Editorial sentiment", group: "context", value: (c) => `${c.rating} / 5` },
];

export function rowsByGroup(group: RowGroupId): CompareRow[] {
  return COMPARE_ROWS.filter((r) => r.group === group);
}

/**
 * True when the row actually differs between the selected companies.
 * With fewer than two companies there is nothing to differ — every row is
 * shown, so the caller skips divergence checks entirely.
 */
export function isDivergent(row: CompareRow, companies: CompanySummary[]): boolean {
  if (companies.length < 2) return true;
  const first = row.value(companies[0]);
  return companies.some((c) => row.value(c) !== first);
}

/**
 * Rows visible under difference-first rendering (T106): agreeing rows are
 * hidden whenever two or more companies are selected. Order preserved.
 */
export function visibleRows(group: RowGroupId, companies: CompanySummary[]): CompareRow[] {
  const rows = rowsByGroup(group);
  if (companies.length < 2) return rows;
  return rows.filter((r) => isDivergent(r, companies));
}

const DIFFERENCE_ROW_PRIORITY = ["pricing-model", "advantage", "tradeoff"] as const;

/**
 * Up to three plain-language bullets describing where the selections
 * disagree (T106). Only decision-relevant rows are summarised; every bullet
 * names each company so it stays readable out of context.
 */
export function keyDifferences(companies: CompanySummary[]): string[] {
  if (companies.length < 2) return [];
  const bullets: string[] = [];
  for (const id of DIFFERENCE_ROW_PRIORITY) {
    const row = COMPARE_ROWS.find((r) => r.id === id);
    if (!row) continue;
    const entries = companies.map((c) => ({ name: c.name, value: row.value(c) }));
    const first = entries[0].value;
    if (entries.every((e) => e.value === first)) continue;
    if (entries.some((e) => e.value === "Not documented")) continue;
    bullets.push(`${row.label}: ${entries.map((e) => `${e.name} — ${e.value}`).join("; ")}`);
    if (bullets.length >= 3) break;
  }
  return bullets;
}

/**
 * Hedged, template-derived verdict lines (T107). One per company, built only
 * from fields the profile already documents. Never declares a winner and
 * never scores anything.
 */
export function verdictStatements(companies: CompanySummary[]): string[] {
  if (companies.length < 2) return [];
  return companies.map((c) => {
    const strength = c.primaryStrength?.trim();
    const weakness = c.primaryWeakness?.trim();
    if (strength && weakness) {
      return `${c.name} generally suits teams that prioritise ${lowerFirst(strength)}. Weigh that against its documented tradeoff: ${lowerFirst(weakness)}.`;
    }
    if (strength) {
      return `${c.name} generally suits teams that prioritise ${lowerFirst(strength)}. The profile does not document a specific tradeoff.`;
    }
    return `${c.name}'s profile does not yet document enough detail for a verdict line.`;
  });
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** Static verification footnote under the table. */
export function verificationNote(): string {
  return `Profile figures were last reviewed ${DATA_AS_OF}. Values come from provider documentation and reporting at different dates — check each provider's own pricing page before deciding.`;
}
