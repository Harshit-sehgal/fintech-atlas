import { describe, it, expect } from "vitest";
import {
  parseReviews,
  createReviewId,
  type UserReviewItem,
} from "@/lib/reviews";

function validReview(overrides: Partial<UserReviewItem> = {}): UserReviewItem {
  return {
    id: "abc-123",
    rating: 5,
    author: "Jane Doe",
    role: "Engineer",
    text: "Great product.",
    date: "2026-01-01",
    ...overrides,
  };
}

describe("parseReviews()", () => {
  it("returns [] for empty input", () => {
    expect(parseReviews("")).toEqual([]);
  });

  it("returns [] for malformed JSON", () => {
    expect(parseReviews("{not json")).toEqual([]);
    expect(parseReviews("undefined")).toEqual([]);
    expect(parseReviews("null")).toEqual([]);
  });

  it("returns [] when root is not an array", () => {
    expect(parseReviews(JSON.stringify({ id: "x" }))).toEqual([]);
    expect(parseReviews(JSON.stringify("hello"))).toEqual([]);
    expect(parseReviews(JSON.stringify(42))).toEqual([]);
  });

  it("keeps fully valid reviews", () => {
    const reviews = [validReview(), validReview({ id: "abc-456", rating: 3 })];
    const result = parseReviews(JSON.stringify(reviews));
    expect(result.length).toBe(2);
    expect(result[0].id).toBe("abc-123");
    expect(result[1].rating).toBe(3);
  });

  it("rejects entries with out-of-range ratings", () => {
    const reviews = [
      validReview({ rating: 0 }), // below min
      validReview({ rating: 6 }), // above max
      validReview({ rating: 1 }), // boundary min - kept
      validReview({ rating: 5 }), // boundary max - kept
    ];
    const result = parseReviews(JSON.stringify(reviews));
    expect(result.length).toBe(2);
    expect(result[0].rating).toBe(1);
    expect(result[1].rating).toBe(5);
  });

  it("rejects entries with missing agent fields", () => {
    const reviews = [
      { ...validReview(), author: 123 }, // wrong type
      { ...validReview(), role: true }, // wrong type
      { id: "x", rating: 4, author: "", role: "", text: "", date: "" }, // empty strings - kept (string type)
    ];
    // The author/role fields with wrong types are dropped; empty strings remain.
    const result = parseReviews(JSON.stringify(reviews));
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("x");
  });

  it("rejects entry missing the rating field entirely", () => {
    const reviews = [{ id: "x", author: "a", role: "r", text: "t", date: "d" }];
    expect(parseReviews(JSON.stringify(reviews))).toHaveLength(0);
  });

  it("rejects entry missing the id field", () => {
    const reviews = [{ rating: 3, author: "a", role: "r", text: "t", date: "d" }];
    expect(parseReviews(JSON.stringify(reviews))).toHaveLength(0);
  });

  it("rejects non-object array elements (null, number, string)", () => {
    const reviews = [validReview(), null, 42, "not an object", validReview({ id: "second" })];
    const result = parseReviews(JSON.stringify(reviews));
    expect(result.length).toBe(2);
    expect(result[0].id).toBe("abc-123");
    expect(result[1].id).toBe("second");
  });

  it("accepts rating as a fractional in-range value", () => {
    const reviews = [validReview({ rating: 3.5 })];
    expect(parseReviews(JSON.stringify(reviews))[0].rating).toBe(3.5);
  });
});

describe("createReviewId()", () => {
  it("returns a non-empty string", () => {
    expect(typeof createReviewId()).toBe("string");
    expect(createReviewId().length).toBeGreaterThan(0);
  });

  it("returns unique-looking values across sequential calls", () => {
    const ids = new Set(Array.from({ length: 10 }, () => createReviewId()));
    expect(ids.size).toBe(10);
  });
});
