import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildFilterQuery,
  cancelPendingFilterWrites,
  oneOf,
  parseBoundedInt,
  parseOptionalInt,
  parseIntList,
  writeUrlFilters,
} from "./url-filters";

afterEach(() => {
  cancelPendingFilterWrites();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("buildFilterQuery", () => {
  it("returns an empty string when nothing remains", () => {
    expect(buildFilterQuery("", {})).toBe("");
  });

  it("deletes keys for null, undefined and empty-string values", () => {
    expect(buildFilterQuery("?a=1&b=2&c=3", { a: null, b: undefined, c: "" })).toBe("");
  });

  it("sets string and number values and preserves existing keys", () => {
    const q = buildFilterQuery("?keep=1", { q: "stripe", page: 3 });
    expect(q).toBe("keep=1&q=stripe&page=3");
  });

  it("joins arrays, drops empty entries, and deletes on an empty array", () => {
    expect(buildFilterQuery("", { ids: [1, 3, 14] })).toBe("ids=1%2C3%2C14");
    expect(buildFilterQuery("?ids=9", { ids: [null, undefined, "", 2] })).toBe("ids=2");
    expect(buildFilterQuery("?ids=9", { ids: [] })).toBe("");
  });
});

describe("parseIntList", () => {
  it("returns an empty list for null/empty input", () => {
    expect(parseIntList(null)).toEqual([]);
    expect(parseIntList("")).toEqual([]);
  });

  it("keeps integers and drops non-integer parts", () => {
    expect(parseIntList("1,3,14")).toEqual([1, 3, 14]);
    expect(parseIntList("1,x,2.5,-4")).toEqual([1, -4]);
  });
});

describe("parseBoundedInt", () => {
  it("falls back for absent, non-integer and out-of-range input", () => {
    expect(parseBoundedInt(null, 1, 10, 5)).toBe(5);
    expect(parseBoundedInt("abc", 1, 10, 5)).toBe(5);
    expect(parseBoundedInt("0", 1, 10, 5)).toBe(5);
    expect(parseBoundedInt("11", 1, 10, 5)).toBe(5);
  });

  it("returns in-range integers", () => {
    expect(parseBoundedInt("7", 1, 10, 5)).toBe(7);
  });
});

describe("parseOptionalInt", () => {
  it("returns null for absent, empty or invalid input", () => {
    expect(parseOptionalInt(null, 0, 10)).toBeNull();
    expect(parseOptionalInt("", 0, 10)).toBeNull();
    expect(parseOptionalInt("x", 0, 10)).toBeNull();
    expect(parseOptionalInt("99", 0, 10)).toBeNull();
  });

  it("returns in-range integers", () => {
    expect(parseOptionalInt("4", 0, 10)).toBe(4);
  });
});

describe("oneOf", () => {
  it("returns the value when allowed and the fallback otherwise", () => {
    expect(oneOf("b", ["a", "b", "c"], "a")).toBe("b");
    expect(oneOf("z", ["a", "b"], "a")).toBe("a");
    expect(oneOf(null, ["a", "b"], "a")).toBe("a");
  });
});

describe("writeUrlFilters", () => {
  it("debounces writes and merges pending updates into one URL", () => {
    vi.useFakeTimers();
    const replace = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => undefined);
    window.history.pushState(null, "", "/");

    writeUrlFilters({ q: "stripe" });
    writeUrlFilters({ page: 2 });
    expect(replace).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(replace).toHaveBeenCalledTimes(1);
    const url = String(replace.mock.calls[0][2]);
    expect(url.startsWith("/?")).toBe(true);
    expect(url).toContain("q=stripe");
    expect(url).toContain("page=2");
  });

  it("drops a scheduled write when the path changed", () => {
    vi.useFakeTimers();
    const replace = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => undefined);
    window.history.pushState(null, "", "/one");
    writeUrlFilters({ q: "x" });
    window.history.pushState(null, "", "/two");

    vi.advanceTimersByTime(300);
    expect(replace).not.toHaveBeenCalled();
  });

  it("is a no-op without a window (SSR)", () => {
    vi.stubGlobal("window", undefined);
    expect(() => writeUrlFilters({ q: "x" })).not.toThrow();
  });

  it("cancels a pending write", () => {
    vi.useFakeTimers();
    const replace = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => undefined);
    writeUrlFilters({ q: "x" });
    cancelPendingFilterWrites();
    vi.advanceTimersByTime(300);
    expect(replace).not.toHaveBeenCalled();
    // second call with no pending timer is also safe
    expect(() => cancelPendingFilterWrites()).not.toThrow();
  });
});
