import { describe, expect, it } from "vitest";
import { articles, getArticleBySlug } from "./articles";
import { companies } from "./companies";

describe("articles catalog", () => {
  it("resolves known and unknown slugs", () => {
    expect(getArticleBySlug(articles[0].slug)).toBe(articles[0]);
    expect(getArticleBySlug("does-not-exist")).toBeUndefined();
  });

  it("has unique slugs", () => {
    const slugs = articles.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("references only real companies", () => {
    const known = new Set(companies.map((c) => c.slug));
    for (const article of articles) {
      for (const slug of article.relatedCompanySlugs) {
        expect(known.has(slug), `${article.slug} -> ${slug}`).toBe(true);
      }
      for (const cta of article.ctas) {
        expect(known.has(cta.slug), `${article.slug} cta -> ${cta.slug}`).toBe(true);
      }
    }
  });

  it("has well-formed tables and required fields", () => {
    for (const article of articles) {
      expect(article.title.length).toBeGreaterThan(0);
      expect(article.description.length).toBeGreaterThan(0);
      for (const block of article.body) {
        if (block.type === "table") {
          for (const row of block.rows) {
            expect(row.length).toBe(block.headers.length);
          }
        }
      }
    }
  });
});
