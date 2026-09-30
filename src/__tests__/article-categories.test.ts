import { describe, expect, it } from "vitest";
import {
  articleCategories,
  getArticleCategory,
  categoryHref,
} from "@/data/articles/types";

describe("article categories", () => {
  it("looks a category up by name", () => {
    const first = articleCategories[0];
    expect(getArticleCategory(first.name)).toEqual(first);
  });

  it("returns undefined for an unknown name", () => {
    // Callers rely on this rather than throwing, so a typo in a stored
    // category cannot take a page down.
    expect(getArticleCategory("No Such Category")).toBeUndefined();
  });

  it("builds the canonical category href from a name", () => {
    const first = articleCategories[0];
    expect(categoryHref(first.name)).toBe(`/articles/category/${first.slug}`);
  });

  it("falls back to the guides index for an unknown name", () => {
    // Every article renders a category link; an unrecognised category must
    // still produce a working link instead of a dead /undefined/ path.
    expect(categoryHref("No Such Category")).toBe("/articles");
  });

  it("has unique slugs and names", () => {
    // Both back the slug-keyed and name-keyed lookups above; a duplicate would
    // silently shadow one of them.
    const slugs = articleCategories.map((c) => c.slug);
    const names = articleCategories.map((c) => c.name);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(names).size).toBe(names.length);
  });
});