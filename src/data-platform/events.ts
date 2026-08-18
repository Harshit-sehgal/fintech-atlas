/**
 * Change / event engine — typed events produced by snapshot diffs and the
 * enrichment pipeline (docs/architecture/RADAR-ARCHITECTURE.md §5).
 */
import type { LicenceStatus } from "./types";

export type RadarEventType =
  | "REGULATORY_STATUS_CHANGED"
  | "LICENSE_ADDED"
  | "LICENSE_REMOVED"
  | "FUNDING_ROUND"
  | "ACQUISITION"
  | "FOUNDER_CHANGE"
  | "EXECUTIVE_CHANGE"
  | "NEW_PRODUCT"
  | "COMPANY_ADDED"
  | "COMPANY_STATUS_CHANGED";

export interface RadarEvent {
  id: string;
  type: RadarEventType;
  companyId?: string;
  companyName?: string;
  happenedOn: string;
  detectedOn: string;
  detail: Record<string, unknown>;
}

/** Deterministic 12-hex event id from its payload (stable across builds). */
export function makeEventId(parts: Array<string | undefined>): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (const part of parts) {
    for (let i = 0; i < (part ?? "").length; i++) {
      const c = (part ?? "").charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
      h2 = Math.imul(h2 ^ c, 0x01000193) >>> 0;
    }
  }
  const a = (h1 ^ (h2 >>> 13)).toString(16).padStart(6, "0");
  const b = (h2 ^ (h1 >>> 13)).toString(16).padStart(6, "0");
  return (a + b).slice(0, 12);
}

export interface LicenceKey {
  companyId?: string;
  companyName?: string;
  code: string;
  status: LicenceStatus;
  effectiveDate?: string;
}

/** Baseline: the initial import establishes every licence as a fact. */
export function baselineEvents(
  entries: Array<{ companyId?: string; companyName: string; code: string; status: LicenceStatus; effectiveDate?: string; detectedOn: string }>,
  detectedOn: string,
): RadarEvent[] {
  return entries.map((entry) => ({
    id: makeEventId(["LICENSE_ADDED", entry.companyId ?? entry.companyName, entry.code]),
    type: "LICENSE_ADDED",
    companyId: entry.companyId,
    companyName: entry.companyId ? undefined : entry.companyName,
    happenedOn: entry.effectiveDate ?? detectedOn,
    detectedOn: entry.detectedOn ?? detectedOn,
    detail: { code: entry.code, status: entry.status },
  }));
}

/** Diffs two snapshots of the same licence family into change events. */
export function diffLicenceSnapshots(
  before: LicenceKey[],
  after: LicenceKey[],
  detectedOn: string,
): RadarEvent[] {
  const afterCodes = new Set(after.map((l) => `${l.companyId ?? l.companyName}|${l.code}`));
  const beforeCodes = new Set(before.map((l) => `${l.companyId ?? l.companyName}|${l.code}`));

  const events: RadarEvent[] = [];

  for (const b of before) {
    const companyKey = b.companyId ?? b.companyName;
    if (!afterCodes.has(companyKey + "|" + b.code)) {
      events.push({
        id: makeEventId(["LICENSE_REMOVED", companyKey, b.code]),
        type: "LICENSE_REMOVED",
        companyId: b.companyId,
        companyName: b.companyId ? undefined : b.companyName,
        happenedOn: detectedOn,
        detectedOn,
        detail: { code: b.code, previousStatus: b.status },
      });
      continue;
    }
    const afterEntry = [...after].find(
      (a) => (a.companyId ?? a.companyName) === companyKey && a.code === b.code,
    );
    if (afterEntry && afterEntry.status !== b.status) {
      events.push({
        id: makeEventId(["REGULATORY_STATUS_CHANGED", companyKey, b.code, b.status, afterEntry.status]),
        type: "REGULATORY_STATUS_CHANGED",
        companyId: b.companyId,
        companyName: b.companyId ? undefined : b.companyName,
        happenedOn: detectedOn,
        detectedOn,
        detail: { code: b.code, before: b.status, after: afterEntry.status },
      });
    }
  }

  for (const a of after) {
    const companyKey = a.companyId ?? a.companyName;
    if (!beforeCodes.has(companyKey + "|" + a.code)) {
      events.push({
        id: makeEventId(["LICENSE_ADDED", companyKey, a.code]),
        type: "LICENSE_ADDED",
        companyId: a.companyId,
        companyName: a.companyId ? undefined : a.companyName,
        happenedOn: a.effectiveDate ?? detectedOn,
        detectedOn,
        detail: { code: a.code, status: a.status },
      });
    }
  }

  return events;
}