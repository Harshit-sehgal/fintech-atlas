import { describe, expect, it } from "vitest";
import {
  applyReviewDecisions,
  buildApplyBatch,
  reviewItemsFor,
  reviewSummary,
  type ReviewItem,
} from "./review";
import type { RadarEvent } from "../events";

const ev = (type: RadarEvent["type"], detail: Record<string, unknown> = {}): RadarEvent => ({
  id: `id-${type}`,
  type,
  companyId: "c1",
  happenedOn: "2026-01-01",
  detectedOn: "2026-01-01",
  detail,
});

describe("reviewItemsFor", () => {
  it("maps added, removed and status-changed events", () => {
    const items = reviewItemsFor(
      "snap-1",
      [
        ev("LICENSE_ADDED", { code: "RBI", status: "active" }),
        ev("LICENSE_REMOVED", { code: "SEBI", previousStatus: "active" }),
        ev("REGULATORY_STATUS_CHANGED", { code: "RBI", before: "active", after: "suspended" }),
      ],
      [],
    );
    expect(items.map((i) => i.action)).toEqual(["add_license", "remove_license", "update_status"]);
    expect(items[2].rationale).toContain("active → suspended");
  });

  it("ignores event types outside the licence family and appends unmatched entries", () => {
    const items = reviewItemsFor("snap-1", [ev("FUNDING_ROUND")], [{ companyName: "Ghost Co" }]);
    expect(items).toHaveLength(1);
    expect(items[0].action).toBe("unmatched_entry");
  });
});

describe("reviewSummary", () => {
  it("counts states and actions", () => {
    const items: ReviewItem[] = [
      { id: "1", snapshotId: "s", action: "add_license", rationale: "", state: "pending" },
      { id: "2", snapshotId: "s", action: "add_license", rationale: "", state: "approved" },
      { id: "3", snapshotId: "s", action: "remove_license", rationale: "", state: "rejected" },
    ];
    const summary = reviewSummary(items);
    expect(summary).toMatchObject({ total: 3, pending: 1, approved: 1, rejected: 1 });
    expect(summary.byAction.add_license).toBe(2);
    expect(summary.byAction.remove_license).toBe(1);
  });
});

describe("applyReviewDecisions", () => {
  it("applies known decisions and ignores unknown ids without mutating", () => {
    const items: ReviewItem[] = [
      { id: "1", snapshotId: "s", action: "add_license", rationale: "", state: "pending" },
      { id: "2", snapshotId: "s", action: "add_license", rationale: "", state: "pending" },
    ];
    const next = applyReviewDecisions(items, { "1": "approved", ghost: "rejected" });
    expect(next[0].state).toBe("approved");
    expect(next[1].state).toBe("pending");
    expect(items[0].state).toBe("pending");
  });
});

describe("buildApplyBatch", () => {
  it("carries decisions and normalises missing before/after to null", () => {
    const batch = buildApplyBatch([
      {
        id: "1",
        snapshotId: "s",
        state: "approved",
        action: "add_license",
        companyId: "c1",
        before: undefined,
        after: { code: "RBI" },
      },
    ]);
    expect(batch[0].state).toBe("approved");
    expect(batch[0].before).toBeNull();
    expect(batch[0].after).toEqual({ code: "RBI" });
  });
});
