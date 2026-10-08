import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearWatchlist,
  isWatched,
  loadWatchlist,
  toggleWatch,
  WATCHLIST_KEY,
  WATCHLIST_EVENT,
} from "./watchlists";

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("watchlists", () => {
  it("returns [] without a window", () => {
    vi.stubGlobal("window", undefined);
    expect(loadWatchlist()).toEqual([]);
  });

  it("returns [] when nothing is stored", () => {
    expect(loadWatchlist()).toEqual([]);
  });

  it("parses a stored list and drops non-strings", () => {
    window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(["a", 1, "b", null]));
    expect(loadWatchlist()).toEqual(["a", "b"]);
  });

  it("returns [] for invalid JSON and non-array payloads", () => {
    window.localStorage.setItem(WATCHLIST_KEY, "{bad");
    expect(loadWatchlist()).toEqual([]);
    window.localStorage.setItem(WATCHLIST_KEY, '"x"');
    expect(loadWatchlist()).toEqual([]);
  });

  it("toggles membership and notifies listeners", () => {
    const dispatch = vi.spyOn(window, "dispatchEvent");
    expect(toggleWatch("razorpay")).toEqual(["razorpay"]);
    expect(isWatched("razorpay")).toBe(true);
    expect(toggleWatch("razorpay")).toEqual([]);
    expect(isWatched("razorpay")).toBe(false);
    const types = dispatch.mock.calls.map((c) => (c[0] as Event).type);
    expect(types).toContain(WATCHLIST_EVENT);
    expect(types).toContain("fintech-atlas-storage-change");
  });

  it("clears the watchlist", () => {
    toggleWatch("stripe");
    expect(clearWatchlist()).toEqual([]);
    expect(loadWatchlist()).toEqual([]);
  });
});
