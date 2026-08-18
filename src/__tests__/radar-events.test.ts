import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnrichedDirectory } from "@/lib/india-directory-parse";
import { importDirectory } from "@/data-platform/import-directory";
import { parseRbiSnapshot } from "@/data-platform/rbi/parse";
import { ingestSnapshot } from "@/data-platform/rbi/ingest";
import { getIndiaDirectoryRecordBySlug } from "@/generated/india-directory";
import { radarFeedEvents, radarFeedSnapshotId } from "@/generated/radar-events";

const markdownPath = resolve(
  process.cwd(),
  "docs/research/india-fintech-directory-enriched.md",
);
const snapshotPath = resolve(process.cwd(), "data/regulatory/rbi/payment-aggregators-v1.md");

describe("radar events (generated from the RBI snapshot)", () => {
  const companies = importDirectory(
    parseEnrichedDirectory(readFileSync(markdownPath, "utf8")),
  ).records.map((r) => r.company);

  const snapshot = parseRbiSnapshot(readFileSync(snapshotPath, "utf8"), "payment-aggregators-v1");
  const result = ingestSnapshot({ snapshot, companies });
  const expectedMatched = result.events.filter((e) => e.companyId).length;

  it("mirrors the snapshot ingest exactly", () => {
    expect(radarFeedEvents).toHaveLength(expectedMatched);
    expect(radarFeedSnapshotId).toBe(snapshot.id);
    for (const event of radarFeedEvents) {
      const sourceEvent = result.events.find(
        (e) => e.companyId === event.companyId && e.detail.code === event.code,
      );
      expect(sourceEvent).toBeDefined();
    }
  });

  it("only emits baseline LICENSE_ADDED events (no fabricated changes)", () => {
    for (const event of radarFeedEvents) {
      expect(event.type).toBe("LICENSE_ADDED");
      expect(["PA", "PA-CB"]).toContain(event.code);
    }
  });

  it("every event company resolves to a directory record", () => {
    for (const event of radarFeedEvents) {
      expect(getIndiaDirectoryRecordBySlug(event.companyId)).toBeDefined();
    }
  });

  it("covers the known PA and PA-CB licensee set", () => {
    const companiesWithEvents = new Set(radarFeedEvents.map((e) => e.companyId));
    for (const name of ["Razorpay", "Cashfree Payments", "Pine Labs", "Easebuzz", "Skydo", "EximPe"]) {
      const record = parseEnrichedDirectory(readFileSync(markdownPath, "utf8")).find(
        (r) => r.name === name,
      );
      expect(companiesWithEvents.has(record!.slug), `should cover ${name}`).toBe(true);
    }
  });
});