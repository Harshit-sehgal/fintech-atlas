/**
 * Pure localStorage list parse/serialize helpers, extracted from the bookmarks
 * context so the parse logic is unit-testable without rendering React.
 *
 * Stored lists are JSON arrays of strings. {@link parseStoredList} defensively
 * validates shape and returns an empty array for missing/ malformed input so
 * the calling context never sees a throw from corrupted storage. Never throws.
 */

export const BOOKMARKS_KEY = "fintech_atlas_bookmarks";
export const GLOSSARY_BOOKMARKS_KEY = "fintech_atlas_glossary_bookmarks";
export const STORAGE_EVENT = "fintech-atlas-storage-change";

/**
 * Parse a JSON string from localStorage into a validated array of strings.
 *
 * Returns an empty array for empty/ malformed input (wrong root type, a single
 * non-string element, invalid JSON). Never throws.
 */
export function parseStoredList(value: string): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}
