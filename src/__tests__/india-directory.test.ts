import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  clusterGroups,
  parseEnrichedDirectory,
} from "@/lib/india-directory-parse";
import {
  getIndiaDirectoryRecordBySlug,
  getIndiaDirectoryRecordsByCluster,
  indiaDirectoryClusters,
  indiaDirectoryCount,
  indiaDirectoryRecords,
} from "@/generated/india-directory";
import {
  indiaDirectoryClusterNames,
  indiaDirectorySummaries,
} from "@/generated/india-directory-summaries";

const markdownPath = resolve(
  process.cwd(),
  "docs/research/india-fintech-directory-enriched.md",
);

/**
 * Contract: the generated directory modules must mirror the enriched research
 * markdown exactly — the site's pages are generated from it, so drift here
 * means either the generator script or a stale generated file is out of sync.
 */
describe("india directory (generated from research markdown)", () => {
  const freshRecords = parseEnrichedDirectory(readFileSync(markdownPath, "utf8"));

  it("parses every company from the research file", () => {
    expect(freshRecords).toHaveLength(1386);
    expect(indiaDirectoryRecords).toHaveLength(1386);
    expect(indiaDirectoryCount).toBe(1386);
  });

  it("generated records match the research file field-for-field", () => {
    expect(indiaDirectoryRecords).toEqual(freshRecords);
  });

  it("has unique, URL-safe slugs", () => {
    const slugs = indiaDirectoryRecords.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug, `unexpected slug: ${slug}`).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("cluster groups match the records they contain", () => {
    const freshGroups = clusterGroups(freshRecords);
    expect(indiaDirectoryClusters).toEqual(freshGroups);
    const total = indiaDirectoryClusters.reduce((sum, c) => sum + c.count, 0);
    expect(total).toBe(1386);
    for (const cluster of indiaDirectoryClusters) {
      expect(getIndiaDirectoryRecordsByCluster(cluster.name)).toHaveLength(
        cluster.count,
      );
    }
  });

  it("summaries mirror the full records they link to", () => {
    expect(indiaDirectorySummaries).toHaveLength(1386);
    const bySlug = new Map(indiaDirectoryRecords.map((r) => [r.slug, r]));
    for (const summary of indiaDirectorySummaries) {
      const record = bySlug.get(summary.slug);
      expect(record, `summary for unknown slug ${summary.slug}`).toBeDefined();
      expect(summary.name).toBe(record!.name);
      expect(summary.category).toBe(record!.category);
      expect(indiaDirectoryClusterNames[summary.clusterIndex]).toBe(record!.cluster);
    }
  });

  it("pooled cluster names cover every cluster index", () => {
    for (const summary of indiaDirectorySummaries) {
      expect(summary.clusterIndex).toBeGreaterThanOrEqual(0);
      expect(summary.clusterIndex).toBeLessThan(indiaDirectoryClusterNames.length);
    }
    expect(new Set(indiaDirectoryClusterNames)).toEqual(
      new Set(indiaDirectoryClusters.map((c) => c.name)),
    );
  });

  it("keeps heavy research payloads out of the client subset", () => {
    for (const summary of indiaDirectorySummaries) {
      expect(summary).not.toHaveProperty("founded");
      expect(summary).not.toHaveProperty("hq");
      expect(summary).not.toHaveProperty("founders");
      expect(summary).not.toHaveProperty("funding");
      expect(summary).not.toHaveProperty("valuationOrStatus");
      expect(summary).not.toHaveProperty("licences");
      expect(summary).not.toHaveProperty("website");
      expect(summary).not.toHaveProperty("description");
      expect(summary).not.toHaveProperty("cluster");
    }
  });

  it("lookup helpers resolve both known and unknown slugs", () => {
    const razorpay = getIndiaDirectoryRecordBySlug("razorpay");
    expect(razorpay?.name).toBe("Razorpay");
    expect(getIndiaDirectoryRecordBySlug("no-such-company")).toBeUndefined();
  });
});
