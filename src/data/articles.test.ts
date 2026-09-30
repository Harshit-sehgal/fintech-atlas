import { describe, expect, it } from "vitest";
import { articles, getArticleBySlug, articleCategories, getArticleCategory, categoryHref } from "./articles";
import { companies } from "./companies";

describe("articles catalog", () => {
  it("resolves known and unknown slugs", () => {
    expect(getArticleBySlug(articles[0].slug)).toBe(articles[0]);
    expect(getArticleBySlug("does-not-exist")).toBeUndefined();
  });

  it("uses only categories from the controlled vocabulary", () => {
    const categoryNames = new Set(articleCategories.map((c) => c.name));
    for (const article of articles) {
      expect(
        categoryNames.has(article.category),
        `${article.slug} uses uncontrolled category "${article.category}"`,
      ).toBe(true);
      expect(
        categoryHref(article.category).startsWith("/articles/category/"),
        `${article.slug} categoryHref should be a real category route`,
      ).toBe(true);
      expect(getArticleCategory(article.category)).toBeDefined();
    }
  });

  it("has unique category slugs", () => {
    const slugs = articleCategories.map((c) => c.slug);
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

  it("relatedTool links point at an existing tool route", () => {
    const toolRoutes = new Set([
      "/tools/calculator",
      "/tools/razorpay-fee-calculator",
      "/tools/remittance",
      "/tools/matchmaker",
      "/tools/calculators",
      "/tools/exchange-rate-markup-calculator",
    ]);
    for (const article of articles) {
      if (article.relatedTool) {
        expect(
          toolRoutes.has(article.relatedTool.href),
          `${article.slug} relatedTool -> ${article.relatedTool.href}`,
        ).toBe(true);
        expect(article.relatedTool.label.length).toBeGreaterThan(0);
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

  it("relatedArticleSlugs point at real articles, never self, and stay symmetric", () => {
    const bySlug = new Map(articles.map((a) => [a.slug, a]));
    for (const article of articles) {
      for (const slug of article.relatedArticleSlugs ?? []) {
        expect(bySlug.has(slug), `${article.slug} -> ${slug} (unknown)`).toBe(true);
        expect(slug).not.toBe(article.slug);
        expect(
          bySlug.get(slug)?.relatedArticleSlugs?.includes(article.slug),
          `${article.slug} <-> ${slug} (one-way)`,
        ).toBe(true);
      }
    }
  });
});
