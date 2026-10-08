import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  clusterGroups,
  parseGlobalDirectory,
} from "@/lib/global-directory-parse";
import {
  getGlobalDirectoryRecordBySlug,
  getGlobalDirectoryRecordsByCluster,
  globalDirectoryClusters,
  globalDirectoryCount,
  globalDirectoryRecords,
} from "@/generated/global-directory";
import {
  globalDirectoryCategoryNames,
  globalDirectoryClusterNames,
  globalDirectorySummaries,
} from "@/generated/global-directory-summaries";

const markdownPath = resolve(
  process.cwd(),
  "docs/research/global-fintech-directory.md",
);

/**
 * Contract: the generated directory modules must mirror the research
 * markdown exactly — the site's pages are generated from it, so drift
 * here means either the generator script or a stale generated file is
 * out of sync.
 */
describe("global directory (generated from research markdown)", () => {
  const freshRecords = parseGlobalDirectory(readFileSync(markdownPath, "utf8"));

  it("parses every company from the research file", () => {
    // Scale floor: the global directory exists to index the long tail
    // beyond the curated catalog — a few hundred rows means the
    // research pass was not run properly.
    expect(freshRecords.length).toBeGreaterThanOrEqual(1000);
    expect(globalDirectoryRecords).toHaveLength(freshRecords.length);
    expect(globalDirectoryCount).toBe(freshRecords.length);
  });

  it("generated records match the research file field-for-field", () => {
    expect(globalDirectoryRecords).toEqual(freshRecords);
  });

  it("has unique, URL-safe slugs", () => {
    const slugs = globalDirectoryRecords.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug, `unexpected slug: ${slug}`).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("cluster groups match the records they contain", () => {
    const freshGroups = clusterGroups(freshRecords);
    expect(globalDirectoryClusters).toEqual(freshGroups);
    const total = globalDirectoryClusters.reduce((sum, c) => sum + c.count, 0);
    expect(total).toBe(freshRecords.length);
    for (const cluster of globalDirectoryClusters) {
      expect(getGlobalDirectoryRecordsByCluster(cluster.name)).toHaveLength(
        cluster.count,
      );
    }
  });

  it("summaries mirror the full records they link to", () => {
    expect(globalDirectorySummaries).toHaveLength(freshRecords.length);
    const bySlug = new Map(globalDirectoryRecords.map((r) => [r.slug, r]));
    for (const [slug, name, categoryIndex, clusterIndex] of globalDirectorySummaries) {
      const record = bySlug.get(slug);
      expect(record, `summary for unknown slug ${slug}`).toBeDefined();
      expect(name).toBe(record!.name);
      expect(globalDirectoryCategoryNames[categoryIndex]).toBe(record!.category);
      expect(globalDirectoryClusterNames[clusterIndex]).toBe(record!.cluster);
    }
  });

  it("pooled cluster names cover every cluster index", () => {
    for (const [, , categoryIndex, clusterIndex] of globalDirectorySummaries) {
      expect(clusterIndex).toBeGreaterThanOrEqual(0);
      expect(clusterIndex).toBeLessThan(globalDirectoryClusterNames.length);
      expect(categoryIndex).toBeGreaterThanOrEqual(0);
      expect(categoryIndex).toBeLessThan(globalDirectoryCategoryNames.length);
    }
    expect(new Set(globalDirectoryClusterNames)).toEqual(
      new Set(globalDirectoryClusters.map((c) => c.name)),
    );
    expect(new Set(globalDirectoryCategoryNames)).toEqual(
      new Set(freshRecords.map((r) => r.category)),
    );
  });

  it("keeps the client subset to a compact 4-field tuple", () => {
    for (const summary of globalDirectorySummaries) {
      expect(Array.isArray(summary)).toBe(true);
      expect(summary).toHaveLength(4);
    }
  });

  it("lookup helpers resolve both known and unknown slugs", () => {
    expect(getGlobalDirectoryRecordBySlug("stripe")?.name).toBe("Stripe");
    expect(getGlobalDirectoryRecordBySlug("no-such-company")).toBeUndefined();
  });
});
