/**
 * Pure, immutable list helpers shared by the bookmarks context and its tests,
 * so unit tests exercise the *actual* production logic rather than a re-typed
 * copy that can silently drift.
 */

/** Add `value` to `values` if absent, otherwise remove it. Returns a new array. */
export function toggleListValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

/** Filter items to only those whose `slug` is present in `bookmarks`. */
export function filterByBookmarks<T extends { slug: string }>(
  items: T[],
  bookmarks: string[],
): T[] {
  return items.filter((item) => bookmarks.includes(item.slug));
}
