import { describe, expect, it } from "vitest";
import {
  buildFilterQuery,
  parseIntList,
  parseBoundedInt,
  parseOptionalInt,
  oneOf,
} from "./url-filters";

describe("buildFilterQuery", () => {
  it("sets new keys and overwrites existing ones", () => {
    expect(buildFilterQuery("?q=pay&sort=alpha", { sort: "founded-desc", page: 2 })).toBe(
      "q=pay&sort=founded-desc&page=2",
    );
  });

  it("deletes keys set to null, undefined or empty string", () => {
    expect(buildFilterQuery("?q=pay&page=2", { q: null, page: "" })).toBe("");
    expect(buildFilterQuery("?q=pay&view=grid", { view: undefined })).toBe("q=pay");
  });

  it("joins arrays with commas and deletes empty arrays", () => {
    expect(buildFilterQuery("", { sectors: [1, 3, 14] })).toBe("sectors=1%2C3%2C14");
    expect(buildFilterQuery("?sectors=1", { sectors: [] })).toBe("");
  });

  it("drops empty strings from arrays but keeps the rest", () => {
    expect(buildFilterQuery("", { ids: [1, "", 2] })).toBe("ids=1%2C2");
    expect(buildFilterQuery("", { ids: [""] })).toBe("");
  });

  it("stringifies numbers", () => {
    expect(buildFilterQuery("", { page: 3 })).toBe("page=3");
  });

  it("round-trips through URLSearchParams", () => {
    const query = buildFilterQuery("", { q: "upi", sectors: [0, 2] });
    const params = new URLSearchParams(query);
    expect(params.get("q")).toBe("upi");
    expect(parseIntList(params.get("sectors"))).toEqual([0, 2]);
  });
});

describe("parseIntList", () => {
  it("parses comma-separated integers", () => {
    expect(parseIntList("1,3,14")).toEqual([1, 3, 14]);
  });

  it("returns empty for null/empty input", () => {
    expect(parseIntList(null)).toEqual([]);
    expect(parseIntList("")).toEqual([]);
  });

  it("drops invalid parts without throwing", () => {
    expect(parseIntList("2,abc,5")).toEqual([2, 5]);
    expect(parseIntList("1.5")).toEqual([]);
  });
});

describe("parseBoundedInt", () => {
  it("accepts integers inside the range", () => {
    expect(parseBoundedInt("7", 1, 10, 1)).toBe(7);
  });

  it("falls back on out-of-range, non-integer and empty values", () => {
    expect(parseBoundedInt("11", 1, 10, 4)).toBe(4);
    expect(parseBoundedInt("0", 1, 10, 4)).toBe(4);
    expect(parseBoundedInt("2.5", 1, 10, 4)).toBe(4);
    expect(parseBoundedInt(null, 1, 10, 4)).toBe(4);
    expect(parseBoundedInt("", 1, 10, 4)).toBe(4);
  });
});

describe("parseOptionalInt", () => {
  it("returns null when absent or empty", () => {
    expect(parseOptionalInt(null, 1950, 2026)).toBeNull();
    expect(parseOptionalInt("", 1950, 2026)).toBeNull();
  });

  it("parses in-range integers and rejects everything else", () => {
    expect(parseOptionalInt("1999", 1950, 2026)).toBe(1999);
    expect(parseOptionalInt("1899", 1950, 2026)).toBeNull();
    expect(parseOptionalInt("later", 1950, 2026)).toBeNull();
  });
});

describe("oneOf", () => {
  const sorts = ["alpha", "founded-desc", "funding-asc"] as const;

  it("returns the raw value when it is allowed", () => {
    expect(oneOf("founded-desc", sorts, "alpha")).toBe("founded-desc");
  });

  it("falls back on unknown or missing values", () => {
    expect(oneOf("newest", sorts, "alpha")).toBe("alpha");
    expect(oneOf(null, sorts, "alpha")).toBe("alpha");
  });
});
