/**
 * Pure user-review persistence helpers, extracted from the company detail
 * client component so the parse/validate logic is unit-testable without
 * rendering React or touching localStorage.
 *
 * Reviews are stored per company slug under `reviews_<slug>` in localStorage as
 * a JSON array of {@link UserReviewItem} objects. {@link parseReviews} reads
 * untrusted storage and defensively validates the shape of every entry,
 * dropping anything that is malformed rather than throwing.
 */

const REVIEW_EVENT = "fintech-atlas-review-change";

export interface UserReviewItem {
  id: string;
  rating: number;
  author: string;
  role: string;
  text: string;
  date: string;
}

/**
 * Parse a JSON string from localStorage into a list of validated reviews.
 *
 * Returns an empty array for empty/ malformed input and silently drops any
 * entries that do not match the {@link UserReviewItem} shape (wrong field
 * types, out-of-range rating, non-object elements). Never throws.
 */
export function parseReviews(value: string): UserReviewItem[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((review): review is UserReviewItem => {
      if (!review || typeof review !== "object") return false;
      const item = review as Record<string, unknown>;
      return (
        typeof item.id === "string" &&
        typeof item.rating === "number" &&
        item.rating >= 1 &&
        item.rating <= 5 &&
        typeof item.author === "string" &&
        typeof item.role === "string" &&
        typeof item.text === "string" &&
        typeof item.date === "string"
      );
    });
  } catch {
    return [];
  }
}

let reviewIdCounter = 0;

/**
 * Create an opaque review identifier. Prefers `crypto.randomUUID`, falls
 * back to `crypto.getRandomValues`, finally to a `Date.now()`-based id so it
 * works in any jsdom/SSR environment. Pure modulo side-effect on the counter.
 */
export function createReviewId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const values = new Uint32Array(2);
    crypto.getRandomValues(values);
    return `review-${values[0].toString(36)}-${values[1].toString(36)}`;
  }
  return `review-${Date.now()}-${reviewIdCounter++}`;
}

export { REVIEW_EVENT };
