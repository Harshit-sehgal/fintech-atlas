/**
 * RBI ingestion orchestrator — parse → match → diff → review.
 * The pipeline is pure (no I/O) so it is fully unit-testable; the CLI wrapper
 * (scripts/ingest-rbi.ts) supplies file paths and emits JSON artifacts.
 */
import type { Company, LicenceStatus } from "../types";
import { baselineEvents, diffLicenceSnapshots, type LicenceKey, type RadarEvent } from "../events";
import type { RbiEntry, RbiSnapshot } from "./parse";
import { matchAll, type MatchResult } from "./match";
import { reviewItemsFor, type ReviewItem } from "./review";

export interface IngestResult {
  snapshotId: string;
  fetchedOn: string;
  regulator: string;
  entries: number;
  matched: number;
  unmatched: Array<{ companyName: string }>;
  ambiguous: MatchResult[];
  events: RadarEvent[];
  review: ReviewItem[];
  baseline: boolean;
}

interface IngestInput {
  snapshot: RbiSnapshot;
  companies: Company[];
  previous?: RbiEntry[]; // absent → baseline import
  detectedOn?: string;
}

export function toLicenceKeys(entries: RbiEntry[], resolved: Map<string, MatchResult>): LicenceKey[] {
  return entries.map((entry) => {
    const match = resolved.get(entry.companyName);
    return {
      companyId: match?.companyId,
      companyName: match?.companyId ? undefined : entry.companyName,
      code: entry.code,
      status: entry.status as LicenceStatus,
      effectiveDate: entry.effectiveDate,
    };
  });
}

export function ingestSnapshot(input: IngestInput): IngestResult {
  const { snapshot, companies, previous, detectedOn = snapshot.fetchedOn } = input;

  const matches = matchAll(snapshot.entries, companies);
  const resolved = new Map(snapshot.entries.map((e, i) => [e.companyName, matches[i]]));
  const unmatched = snapshot.entries
    .map((e, i) => ({ companyName: e.companyName, match: matches[i] }))
    .filter((row) => !row.match.companyId || row.match.ambiguous)
    .map((row) => ({ companyName: row.companyName }));
  const ambiguous = matches.filter((m) => m.ambiguous && m.companyId !== undefined);

  const keys = toLicenceKeys(snapshot.entries, resolved);
  const matchedKeys = keys.filter((k) => k.companyId);
  const events = previous
    ? diffLicenceSnapshots(toLicenceKeys(previous, resolved), keys, detectedOn)
    : baselineEvents(
        matchedKeys.map((k) => ({
          companyId: k.companyId,
          companyName: "",
          code: k.code,
          status: k.status,
          effectiveDate: k.effectiveDate,
          detectedOn,
        })),
        detectedOn,
      );

  const review = reviewItemsFor(snapshot.id, events, unmatched);

  return {
    snapshotId: snapshot.id,
    fetchedOn: detectedOn,
    regulator: snapshot.regulator,
    entries: snapshot.entries.length,
    matched: snapshot.entries.length - unmatched.length,
    unmatched,
    ambiguous,
    events,
    review,
    baseline: !previous,
  };
}