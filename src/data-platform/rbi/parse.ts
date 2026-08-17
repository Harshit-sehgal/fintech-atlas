/**
 * RBI snapshot format — one markdown file per regulator list family.
 *
 * Format (see data/regulatory/rbi/payment-aggregators-v1.md):
 *   # title
 *   - Regulator: RBI
 *   - Source: https://...
 *   - Fetched: 2026-08-15
 *   - Snapshot: v1 (baseline)
 *   | Company | Licence | Status | Effective | Notes |
 *   | --- | --- | --- | --- | --- |
 *   | <company> | PA | authorised | 2025-12 | ... |
 */
import type { LicenceStatus } from "../types";

export interface RbiEntry {
  companyName: string;
  code: string;
  status: LicenceStatus;
  effectiveDate?: string;
  notes?: string;
}

export interface RbiSnapshot {
  id: string;
  regulator: string;
  sourceUrl: string;
  fetchedOn: string;
  entries: RbiEntry[];
}

const STATUSES: LicenceStatus[] = ["authorised", "in-principle", "application", "unknown"];

export function parseRbiSnapshot(markdown: string, id: string): RbiSnapshot {
  const meta = new Map<string, string>();
  const rows: string[][] = [];
  let inTable = false;

  for (const line of markdown.split("\n")) {
    const metaMatch = line.match(/^-\s+([^:]+):\s*(.*)$/);
    if (metaMatch) {
      meta.set(metaMatch[1].trim().toLowerCase(), metaMatch[2].trim());
      continue;
    }
    if (line.trim().startsWith("| Company")) {
      inTable = true;
      continue;
    }
    if (line.trim().startsWith("| ---")) {
      continue;
    }
    if (line.startsWith("|") && inTable) {
      const cells = line
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim());
      if (cells.length >= 2) rows.push(cells);
    }
  }

  const entries: RbiEntry[] = rows.map((cells) => {
    const [companyName, code, status = "unknown", effectiveDate, notes] = cells;
    return {
      companyName,
      code,
      status: (STATUSES.includes(status as LicenceStatus) ? status : "unknown") as LicenceStatus,
      effectiveDate: effectiveDate || undefined,
      notes: notes || undefined,
    };
  });

  return {
    id,
    regulator: meta.get("regulator") ?? "unknown",
    sourceUrl: meta.get("source") ?? "",
    fetchedOn: meta.get("fetched") ?? "",
    entries,
  };
}