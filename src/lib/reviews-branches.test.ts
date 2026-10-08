import { afterEach, describe, expect, it, vi } from "vitest";
import { createReviewId, parseReviews } from "./reviews";

afterEach(() => vi.unstubAllGlobals());

describe("parseReviews edge cases", () => {
  it("returns [] for empty, non-JSON and non-array payloads", () => {
    expect(parseReviews("")).toEqual([]);
    expect(parseReviews("{bad")).toEqual([]);
    expect(parseReviews('{"a":1}')).toEqual([]);
  });

  it("drops malformed entries and keeps valid ones", () => {
    const value = JSON.stringify([
      null,
      "string",
      { id: "a", rating: 9, author: "A", role: "R", text: "t", date: "d" },
      { id: "b", rating: 4, author: "A", role: "R", text: "t", date: "d" },
    ]);
    const parsed = parseReviews(value);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe("b");
  });
});

describe("createReviewId fallbacks", () => {
  it("uses getRandomValues when randomUUID is unavailable", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (arr: Uint32Array) => {
        arr[0] = 123;
        arr[1] = 456;
        return arr;
      },
    });
    expect(createReviewId()).toMatch(/^review-[a-z0-9]+-[a-z0-9]+$/);
  });

  it("falls back to a timestamp id without crypto", () => {
    vi.stubGlobal("crypto", undefined);
    expect(createReviewId()).toMatch(/^review-\d+-\d+$/);
  });
});
