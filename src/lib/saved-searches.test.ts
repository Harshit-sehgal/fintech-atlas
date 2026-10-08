import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addSavedSearch,
  createSearchId,
  deleteSavedSearch,
  isDefaultSearchState,
  loadSavedSearches,
  SAVED_SEARCHES_KEY,
  SAVED_SEARCH_EVENT,
  type SavedSearchState,
} from "./saved-searches";

const baseState: SavedSearchState = {
  query: "",
  sectors: [],
  regulators: [],
  licences: [],
  foundedMin: "",
  foundedMax: "",
  fundingMin: "",
  fundingMax: "",
  sort: "alpha",
};

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("isDefaultSearchState", () => {
  it("is true for the untouched default state", () => {
    expect(isDefaultSearchState(baseState)).toBe(true);
  });

  it("is false when any field carries a value", () => {
    const variants: Partial<SavedSearchState>[] = [
      { query: "x" },
      { sectors: [1] },
      { regulators: [1] },
      { licences: [1] },
      { foundedMin: "2000" },
      { foundedMax: "2020" },
      { fundingMin: "1" },
      { fundingMax: "2" },
      { sort: "funding" },
    ];
    for (const v of variants) {
      expect(isDefaultSearchState({ ...baseState, ...v })).toBe(false);
    }
  });

  it("treats a whitespace-only query as empty", () => {
    expect(isDefaultSearchState({ ...baseState, query: "   " })).toBe(true);
  });
});

describe("loadSavedSearches", () => {
  it("returns [] without a window", () => {
    vi.stubGlobal("window", undefined);
    expect(loadSavedSearches()).toEqual([]);
  });

  it("returns [] when nothing is stored", () => {
    expect(loadSavedSearches()).toEqual([]);
  });

  it("returns [] for invalid JSON and for non-array payloads", () => {
    window.localStorage.setItem(SAVED_SEARCHES_KEY, "{not json");
    expect(loadSavedSearches()).toEqual([]);
    window.localStorage.setItem(SAVED_SEARCHES_KEY, '"a string"');
    expect(loadSavedSearches()).toEqual([]);
  });

  it("returns the stored array", () => {
    const list = [{ id: "1", name: "n", state: baseState, createdAt: "now" }];
    window.localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(list));
    expect(loadSavedSearches()).toEqual(list);
  });
});

describe("addSavedSearch / deleteSavedSearch", () => {
  it("ignores blank names", () => {
    expect(addSavedSearch("   ", baseState)).toEqual([]);
  });

  it("adds a search, replacing one with the same name", () => {
    const dispatch = vi.spyOn(window, "dispatchEvent");
    addSavedSearch("My search", baseState);
    const next = addSavedSearch("My search", { ...baseState, query: "stripe" });

    expect(next).toHaveLength(1);
    expect(next[0].state.query).toBe("stripe");
    const events = dispatch.mock.calls.map((c) => (c[0] as Event).type);
    expect(events).toContain(SAVED_SEARCH_EVENT);
    expect(events).toContain("fintech-atlas-storage-change");
  });

  it("deletes by id", () => {
    const list = addSavedSearch("A", baseState);
    const remaining = deleteSavedSearch(list[0].id);
    expect(remaining).toEqual([]);
  });

  it("creates distinct-looking ids", () => {
    expect(createSearchId()).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
  });
});
