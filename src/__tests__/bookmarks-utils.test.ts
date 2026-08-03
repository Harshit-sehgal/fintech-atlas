import { describe, it, expect } from "vitest";

// Pure utility functions we can test without React/dependencies
// The bookmark logic is essentially: toggle slug in array, check if slug exists, filter by bookmark

describe("Bookmarks Logic (unit)", () => {
  describe("toggle slug in array", () => {
    function toggleSlug(list: string[], slug: string): string[] {
      return list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
    }

    it("adds a slug if not present", () => {
      const result = toggleSlug([], "stripe");
      expect(result).toContain("stripe");
      expect(result).toHaveLength(1);
    });

    it("removes a slug if already present", () => {
      const result = toggleSlug(["stripe", "paypal"], "stripe");
      expect(result).not.toContain("stripe");
      expect(result).toContain("paypal");
      expect(result).toHaveLength(1);
    });

    it("handles empty array", () => {
      const result = toggleSlug([], "wise");
      expect(result).toEqual(["wise"]);
    });

    it("does not mutate the original array", () => {
      const original = ["stripe", "paypal"];
      const result = toggleSlug(original, "stripe");
      expect(original).toEqual(["stripe", "paypal"]);
      expect(result).not.toBe(original);
    });

    it("handles adding multiple unique slugs", () => {
      let list: string[] = [];
      list = toggleSlug(list, "stripe");
      list = toggleSlug(list, "paypal");
      list = toggleSlug(list, "square");
      expect(list).toEqual(["stripe", "paypal", "square"]);
    });

    it("handles toggling same slug twice", () => {
      let list: string[] = [];
      list = toggleSlug(list, "stripe"); // add
      list = toggleSlug(list, "stripe"); // remove
      expect(list).toEqual([]);
    });
  });

  describe("isBookmarked", () => {
    function isBookmarked(list: string[], slug: string): boolean {
      return list.includes(slug);
    }

    it("returns true when slug is in list", () => {
      expect(isBookmarked(["stripe"], "stripe")).toBe(true);
    });

    it("returns false when slug is not in list", () => {
      expect(isBookmarked(["stripe"], "paypal")).toBe(false);
    });

    it("returns false for empty list", () => {
      expect(isBookmarked([], "stripe")).toBe(false);
    });
  });

  describe("filter bookmarks from full list", () => {
    function getBookmarkedItems<T extends { slug: string }>(items: T[], bookmarks: string[]): T[] {
      return items.filter((item) => bookmarks.includes(item.slug));
    }

    it("returns only bookmarked items", () => {
      const companies = [
        { slug: "stripe", name: "Stripe" },
        { slug: "paypal", name: "PayPal" },
        { slug: "square", name: "Square" },
      ];
      const bookmarks = ["stripe", "square"];
      const result = getBookmarkedItems(companies, bookmarks);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Stripe");
      expect(result[1].name).toBe("Square");
    });

    it("returns empty array when no bookmarks match", () => {
      const companies = [{ slug: "stripe", name: "Stripe" }];
      const result = getBookmarkedItems(companies, []);
      expect(result).toEqual([]);
    });
  });
});