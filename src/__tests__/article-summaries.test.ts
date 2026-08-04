import { describe, expect, it } from "vitest";
import { articles } from "@/data/articles";
import {
  articleSummaries,
  getArticleSummaryBySlug,
} from "@/generated/article-summaries";

/**
 * Contract: the generated client-safe article summaries must mirror the
 * server-side catalog exactly for every field clients render. Drift here means
 * either the generator script or a client import is out of sync — fail loudly.
 */
describe("article summaries (generated client subset)", () => {
  it("has one summary per catalog article, both directions", () => {
    expect(articleSummaries).toHaveLength(articles.length);
    const summarySlugs = new Set(articleSummaries.map((s) => s.slug));
    for (const article of articles) {
      expect(summarySlugs.has(article.slug), `missing summary for ${article.slug}`).toBe(true);
    }
    for (const summary of articleSummaries) {
      expect(summary.slug.length).toBeGreaterThan(0);
    }
  });

  it("mirrors every rendered field from the catalog entry", () => {
    for (const summary of articleSummaries) {
      const article = articles.find((a) => a.slug === summary.slug)!;
      expect(summary.title).toBe(article.title);
      expect(summary.description).toBe(article.description);
      expect(summary.category).toBe(article.category);
      expect(summary.relatedCompanySlugs).toEqual(article.relatedCompanySlugs);
    }
  });

  it("keeps heavy editorial payloads out of the client subset", () => {
    for (const summary of articleSummaries) {
      expect("body" in summary).toBe(false);
      expect("ctas" in summary).toBe(false);
      expect("relatedTool" in summary).toBe(false);
      expect("relatedArticleSlugs" in summary).toBe(false);
      expect("publishedAt" in summary).toBe(false);
    }
  });

  it("resolves summaries by slug like the catalog", () => {
    for (const article of articles) {
      expect(getArticleSummaryBySlug(article.slug)?.title).toBe(article.title);
    }
    expect(getArticleSummaryBySlug("does-not-exist")).toBeUndefined();
  });
});
