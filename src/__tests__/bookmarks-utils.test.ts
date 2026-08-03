import { describe, it, expect } from "vitest";
import { toggleListValue, filterByBookmarks } from "@/lib/list-utils";

// These tests exercise the REAL production helpers (src/lib/list-utils.ts),
// not re-typed copies — so they fail if production bookmark logic breaks.

describe("Bookmarks Logic (unit)", () => {
  describe("toggleListValue (real toggle helper)", () => {
    it("adds a slug if not present", () => {
      const result = toggleListValue([], "stripe");
      expect(result).toContain("stripe");
      expect(result).toHaveLength(1);
    });

    it("removes a slug if already present", () => {
      const result = toggleListValue(["stripe", "paypal"], "stripe");
      expect(result).not.toContain("stripe");
      expect(result).toContain("paypal");
      expect(result).toHaveLength(1);
    });

    it("handles empty array", () => {
      const result = toggleListValue([], "wise");
      expect(result).toEqual(["wise"]);
    });

    it("does not mutate the original array", () => {
      const original = ["stripe", "paypal"];
      const result = toggleListValue(original, "stripe");
      expect(original).toEqual(["stripe", "paypal"]);
      expect(result).not.toBe(original);
    });

    it("handles adding multiple unique slugs", () => {
      let list: string[] = [];
      list = toggleListValue(list, "stripe");
      list = toggleListValue(list, "paypal");
      list = toggleListValue(list, "square");
      expect(list).toEqual(["stripe", "paypal", "square"]);
    });

    it("handles toggling same slug twice", () => {
      let list: string[] = [];
      list = toggleListValue(list, "stripe"); // add
      list = toggleListValue(list, "stripe"); // remove
      expect(list).toEqual([]);
    });
  });

  describe("filterByBookmarks (real filter helper)", () => {
    it("returns only bookmarked items", () => {
      const companies = [
        { slug: "stripe", name: "Stripe" },
        { slug: "paypal", name: "PayPal" },
        { slug: "square", name: "Square" },
      ];
      const bookmarks = ["stripe", "square"];
      const result = filterByBookmarks(companies, bookmarks);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Stripe");
      expect(result[1].name).toBe("Square");
    });

    it("returns empty array when no bookmarks match", () => {
      const companies = [{ slug: "stripe", name: "Stripe" }];
      const result = filterByBookmarks(companies, []);
      expect(result).toEqual([]);
    });
  });
});
