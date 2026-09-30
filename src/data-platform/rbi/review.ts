/**
 * Review queue — regulatory changes never silently mutate the database
 * (ADR-002). Diffs produce review items; operators approve or reject.
 */
import type { RadarEvent } from "../events";

export interface ReviewItem {
  id: string;
  snapshotId: string;
  companyId?: string;
  companyName?: string;
  action: "add_license" | "remove_license" | "update_status" | "new_company" | "unmatched_entry";
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  rationale: string;
  state: "pending" | "approved" | "rejected";
}

/** Maps a diff event into review actions. */
export function reviewItemsFor(
  snapshotId: string,
  events: RadarEvent[],
  unmatched: Array<{ companyName: string }>,
): ReviewItem[] {
  const items: ReviewItem[] = [];

  for (const event of events) {
    const code = String(event.detail.code ?? "");
    switch (event.type) {
      case "LICENSE_ADDED":
        items.push({
          id: `review-${event.id}`,
          snapshotId,
          companyId: event.companyId,
          companyName: event.companyName,
          action: "add_license",
          after: { code, status: event.detail.status },
          rationale: `Snapshot records licence ${code} for this company.`,
          state: "pending",
        });
        break;
      case "LICENSE_REMOVED":
        items.push({
          id: `review-${event.id}`,
          snapshotId,
          companyId: event.companyId,
          companyName: event.companyName,
          action: "remove_license",
          before: { code, status: event.detail.previousStatus },
          rationale: `Licence ${code} no longer present in the snapshot.`,
          state: "pending",
        });
        break;
      case "REGULATORY_STATUS_CHANGED":
        items.push({
          id: `review-${event.id}`,
          snapshotId,
          companyId: event.companyId,
          companyName: event.companyName,
          action: "update_status",
          before: { code, status: event.detail.before },
          after: { code, status: event.detail.after },
          rationale: `Licence ${code} status moved ${String(event.detail.before)} → ${String(event.detail.after)}.`,
          state: "pending",
        });
        break;
      default:
        break;
    }
  }

  for (const entry of unmatched) {
    items.push({
      id: `review-unmatched-${entry.companyName}`,
      snapshotId,
      companyName: entry.companyName,
      action: "unmatched_entry",
      rationale: `Snapshot entry "${entry.companyName}" did not match any canonical company.`,
      state: "pending",
    });
  }

  return items;
}

export interface ReviewSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byAction: Record<ReviewItem["action"], number>;
}

/** Queue statistics — used by the research console and the ingest CLI. */
export function reviewSummary(items: ReviewItem[]): ReviewSummary {
  const byAction = {} as Record<ReviewItem["action"], number>;
  let pending = 0;
  let approved = 0;
  let rejected = 0;
  for (const item of items) {
    byAction[item.action] = (byAction[item.action] ?? 0) + 1;
    if (item.state === "pending") pending += 1;
    else if (item.state === "approved") approved += 1;
    else rejected += 1;
  }
  return { total: items.length, pending, approved, rejected, byAction };
}

export type ReviewDecision = ReviewItem["state"];

/**
 * Applies an operator's decisions map (review id → state) to a queue,
 * returning a new array. Never mutates the input. Decisions for unknown ids
 * are ignored so a stale decisions file cannot corrupt a newer queue.
 */
export function applyReviewDecisions(
  items: ReviewItem[],
  decisions: Record<string, ReviewDecision>,
): ReviewItem[] {
  return items.map((item) =>
    decisions[item.id] ? { ...item, state: decisions[item.id] } : item,
  );
}

/**
 * Renders the review queue into the operator apply-batch payload — the JSON
 * an operator copies from the research console (or saves from the CLI) for
 * the database apply step. Every item carries its decision state, so the
 * payload is the single hand-off artifact between review and apply. Accepts
 * both the canonical ReviewItem shape and the generated client-safe shape.
 */
export function buildApplyBatch(
  items: Array<{
    id: string;
    snapshotId: string;
    state: string;
    action: string;
    companyId?: string;
    companyName?: string;
    before?: unknown;
    after?: unknown;
  }>,
): Array<{
  id: string;
  snapshotId: string;
  state: ReviewItem["state"];
  action: ReviewItem["action"];
  companyId?: string;
  companyName?: string;
  before: unknown;
  after: unknown;
}> {
  return items.map(({ id, snapshotId, state, action, companyId, companyName, before, after }) => ({
    id,
    snapshotId,
    state: state as ReviewItem["state"],
    action: action as ReviewItem["action"],
    companyId,
    companyName,
    before: before ?? null,
    after: after ?? null,
  }));
}