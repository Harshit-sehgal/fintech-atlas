import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnrichedDirectory } from "@/lib/india-directory-parse";
import { importDirectory } from "@/data-platform/import-directory";
import { parseRbiSnapshot } from "@/data-platform/rbi/parse";
import { ingestSnapshot } from "@/data-platform/rbi/ingest";
import {
  applyReviewDecisions,
  buildApplyBatch,
  reviewSummary,
} from "@/data-platform/rbi/review";
import type { ReviewItem } from "@/data-platform/rbi/review";
import {
  radarReviewFetchedOn,
  radarReviewIsBaseline,
  radarReviewItems,
  radarReviewSnapshotId,
  radarReviewSummary,
} from "@/generated/radar-review";

const markdownPath = resolve(
  process.cwd(),
  "docs/research/india-fintech-directory-enriched.md",
);
const snapshotPath = resolve(process.cwd(), "data/regulatory/rbi/payment-aggregators-v1.md");

function loadIngest() {
  const companies = importDirectory(
    parseEnrichedDirectory(readFileSync(markdownPath, "utf8")),
  ).records.map((r) => r.company);
  const snapshot = parseRbiSnapshot(readFileSync(snapshotPath, "utf8"), "payment-aggregators-v1");
  return ingestSnapshot({ snapshot, companies });
}

describe("radar review module (generated from the RBI snapshot)", () => {
  const result = loadIngest();

  it("mirrors the snapshot ingest exactly", () => {
    expect(radarReviewItems).toHaveLength(result.review.length);
    expect(radarReviewSnapshotId).toBe(result.snapshotId);
    expect(radarReviewFetchedOn).toBe(result.fetchedOn);
    expect(radarReviewIsBaseline).toBe(true);
  });

  it("carries pending state and a known action for every item", () => {
    for (const item of radarReviewItems) {
      expect(item.state).toBe("pending");
      expect([
        "add_license",
        "remove_license",
        "update_status",
        "new_company",
        "unmatched_entry",
      ]).toContain(item.action);
    }
  });

  it("summary matches reviewSummary over the raw items", () => {
    const expected = reviewSummary(radarReviewItems as unknown as ReviewItem[]);
    expect(radarReviewSummary).toEqual(expected);
    expect(radarReviewSummary.total).toBe(result.review.length);
    expect(radarReviewSummary.pending).toBe(result.review.length);
  });

  it("every item references a real company or a name", () => {
    for (const item of radarReviewItems) {
      expect(item.companyId || item.companyName).toBeTruthy();
    }
  });
});

describe("review queue helpers", () => {
  const items: ReviewItem[] = [
    {
      id: "r1",
      snapshotId: "s1",
      companyId: "razorpay",
      action: "add_license",
      after: { code: "PA", status: "authorised" },
      rationale: "Snapshot records licence PA.",
      state: "pending",
    },
    {
      id: "r2",
      snapshotId: "s1",
      companyId: "cashfree-payments",
      action: "update_status",
      before: { code: "PA-CB", status: "in-principle" },
      after: { code: "PA-CB", status: "authorised" },
      rationale: "Status moved.",
      state: "pending",
    },
  ];

  it("summarises states and action counts", () => {
    const summary = reviewSummary(items);
    expect(summary.total).toBe(2);
    expect(summary.pending).toBe(2);
    expect(summary.byAction).toEqual({ add_license: 1, update_status: 1 });
  });

  it("applies decisions without mutating the input and ignores unknown ids", () => {
    const before = JSON.stringify(items);
    const next = applyReviewDecisions(items, { r1: "approved", nope: "approved" });
    expect(next[0].state).toBe("approved");
    expect(next[1].state).toBe("pending");
    expect(JSON.stringify(items)).toBe(before);
  });

  it("buildApplyBatch emits the hand-off payload with resolved before/after", () => {
    const batch = buildApplyBatch(items);
    expect(batch).toHaveLength(2);
    expect(batch[1]).toMatchObject({
      id: "r2",
      before: { code: "PA-CB", status: "in-principle" },
      after: { code: "PA-CB", status: "authorised" },
    });
    expect(batch[0].before).toBeNull();
  });

  it("accepts the generated client-safe shape", () => {
    const generated = radarReviewItems.slice(0, 2).map((i) => ({
      ...i,
      state: "pending",
      action: i.action,
    }));
    const batch = buildApplyBatch(generated);
    expect(batch).toHaveLength(generated.length);
    for (const entry of batch) {
      expect(entry.state).toBe("pending");
      expect(entry.action).toBeTruthy();
    }
  });
});