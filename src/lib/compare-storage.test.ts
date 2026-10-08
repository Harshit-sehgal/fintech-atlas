import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LAST_COMPARE_STORAGE_KEY,
  readLastCompareSlugs,
  writeLastCompareSlugs,
} from "./compare";

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("readLastCompareSlugs", () => {
  it("returns [] without a window", () => {
    vi.stubGlobal("window", undefined);
    expect(readLastCompareSlugs()).toEqual([]);
  });

  it("returns [] when nothing is stored or the payload is not an array", () => {
    expect(readLastCompareSlugs()).toEqual([]);
    window.localStorage.setItem(LAST_COMPARE_STORAGE_KEY, '"not-array"');
    expect(readLastCompareSlugs()).toEqual([]);
  });

  it("filters non-strings and validates against a company list when given", () => {
    window.localStorage.setItem(LAST_COMPARE_STORAGE_KEY, JSON.stringify(["stripe", 5, "adyen", "ghost"]));
    expect(readLastCompareSlugs()).toEqual(["stripe", "adyen", "ghost"]);
    const validated = readLastCompareSlugs([{ slug: "stripe" }]);
    expect(validated).toEqual(["stripe"]);
  });

  it("returns [] when storage read throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readLastCompareSlugs()).toEqual([]);
  });
});

describe("writeLastCompareSlugs", () => {
  it("is a no-op without a window", () => {
    vi.stubGlobal("window", undefined);
    expect(() => writeLastCompareSlugs(["stripe"])).not.toThrow();
  });

  it("persists the selection", () => {
    writeLastCompareSlugs(["stripe", "adyen"]);
    expect(JSON.parse(window.localStorage.getItem(LAST_COMPARE_STORAGE_KEY)!)).toEqual([
      "stripe",
      "adyen",
    ]);
  });

  it("swallows storage errors", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => writeLastCompareSlugs(["stripe"])).not.toThrow();
  });
});
