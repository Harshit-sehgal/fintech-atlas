import { describe, it, expect } from "vitest";
import { glossary } from "@/data/glossary";
import { glossarySummaries } from "@/generated/glossary-summaries";

/**
 * Contract: the generated client-safe glossary summaries must mirror the
 * full glossary for the fields clients render (homepage teaser cards).
 * Drift here means the generator script or a client import is out of sync.
 */
describe("glossary summaries (generated client subset)", () => {
  it("has one summary per glossary term, mirroring term and short", () => {
    expect(glossarySummaries).toHaveLength(glossary.length);
    const bySlug = new Map(glossary.map((g) => [g.slug, g]));
    for (const summary of glossarySummaries) {
      const term = bySlug.get(summary.slug);
      expect(term, `summary for unknown slug ${summary.slug}`).toBeDefined();
      expect(summary.term).toBe(term!.term);
      expect(summary.short).toBe(term!.short);
    }
  });

  it("keeps long-form definitions out of the client subset", () => {
    for (const summary of glossarySummaries) {
      expect(summary).not.toHaveProperty("long");
      expect(summary).not.toHaveProperty("related");
      expect(summary).not.toHaveProperty("full");
    }
  });
});

/**
 * Content-graph integrity for the glossary. These invariants keep the
 * "related terms" cross-reference network navigable in both directions:
 * every link must resolve to a defined term, and every defined term should
 * be reachable from at least one other term (no orphan entries that users
 * can never navigate *to* via related links).
 */
describe("glossary cross-reference integrity", () => {
  const slugs = glossary.map((g) => g.slug);
  const slugSet = new Set(slugs);

  it("has no duplicate slugs", () => {
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(dupes, `duplicate slugs: ${dupes.join(", ")}`).toEqual([]);
  });

  it("every related slug resolves to a defined term (no dangling refs)", () => {
    const dangling: string[] = [];
    for (const term of glossary) {
      for (const rel of term.related) {
        if (!slugSet.has(rel)) dangling.push(`${term.slug} -> ${rel}`);
      }
    }
    expect(dangling, `dangling refs: ${dangling.join(", ")}`).toEqual([]);
  });

  it("every term is referenced by at least one other term (no orphans)", () => {
    const referenced = new Set<string>();
    for (const term of glossary) {
      for (const rel of term.related) referenced.add(rel);
    }
    const orphans = slugs.filter((s) => !referenced.has(s));
    expect(orphans, `orphan terms: ${orphans.join(", ")}`).toEqual([]);
  });

  it("no term references itself", () => {
    const selfRef = glossary.filter((g) => g.related.includes(g.slug));
    expect(selfRef.map((g) => g.slug)).toEqual([]);
  });
});
