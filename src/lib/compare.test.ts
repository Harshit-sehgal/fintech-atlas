import { describe, it, expect } from "vitest";
import { parseCompareSlugs, DEFAULT_COMPARE_SLUGS, MAX_COMPARE } from "@/lib/compare";
import { companies } from "@/data";

describe("parseCompareSlugs()", () => {
  it("returns default selection when no search params are present", () => {
    const p = new URLSearchParams("");
    expect(parseCompareSlugs(p, companies)).toEqual(DEFAULT_COMPARE_SLUGS);
  });

  it("returns empty for explicit clear (?companies=)", () => {
    const p = new URLSearchParams("companies=");
    expect(parseCompareSlugs(p, companies)).toEqual([]);
  });

  it("parses a comma-separated ?companies= list and validates slugs", () => {
    const p = new URLSearchParams("companies=stripe,paypal,adyen");
    expect(parseCompareSlugs(p, companies)).toEqual(["stripe", "paypal", "adyen"]);
  });

  it("caps ?companies= at MAX_COMPARE", () => {
    const p = new URLSearchParams("companies=stripe,paypal,adyen,wise");
    expect(parseCompareSlugs(p, companies)).toEqual(["stripe", "paypal", "adyen"]);
    expect(parseCompareSlugs(p, companies).length).toBeLessThanOrEqual(MAX_COMPARE);
  });

  it("rejects slugs that are not in the company list", () => {
    const p = new URLSearchParams("companies=stripe,fakeSlug,adyen");
    expect(parseCompareSlugs(p, companies)).toEqual(["stripe", "adyen"]);
  });

  it("returns empty for ?companies= with only unknown slugs", () => {
    const p = new URLSearchParams("companies=fake1,fake2");
    expect(parseCompareSlugs(p, companies)).toEqual([]);
  });

  it("filters empty segments from ?companies=", () => {
    const p = new URLSearchParams("companies=stripe,,adyen");
    expect(parseCompareSlugs(p, companies)).toEqual(["stripe", "adyen"]);
  });

  it("treats ?companies (key present, value null) consistently", () => {
    // Real browsers: `URLSearchParams("companies")` stores the param with empty string,
    // so `has("companies")` is true and `get("companies")` returns "".
    // The explicit-clear branch fires, returning []. This is correct b/c a
    // bare `?companies` with no value means "just the key, no actual selection."
    const p = new URLSearchParams("companies");
    expect(parseCompareSlugs(p, companies)).toEqual([]);
  });

  describe("legacy ?a= / ?b= param shape", () => {
    it("parses and validates ?a=stripe&b=adyen", () => {
      const p = new URLSearchParams("a=stripe&b=adyen");
      expect(parseCompareSlugs(p, companies)).toEqual(["stripe", "adyen"]);
    });

    it("parses ?a=stripe with no b", () => {
      const p = new URLSearchParams("a=stripe");
      expect(parseCompareSlugs(p, companies)).toEqual(["stripe"]);
    });

    it("validates ?a= slugs against the company list (regression: unvalidated path)", () => {
      const p = new URLSearchParams("a=fakeSlug&b=adyen");
      expect(parseCompareSlugs(p, companies)).toEqual(["adyen"]);
    });

    it("caps the legacy path at MAX_COMPARE", () => {
      const p = new URLSearchParams("a=stripe&b=paypal&c=adyen");
      expect(parseCompareSlugs(p, companies).length).toBeLessThanOrEqual(MAX_COMPARE);
    });
  });
});