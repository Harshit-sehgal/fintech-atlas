/**
 * Shared URL persistence for directory and radar filters (T110).
 *
 * Filter state lives in React state for rendering, but is mirrored into the
 * query string so a filtered view survives reload and can be shared as a
 * plain link. This follows the same parse/validate/deferred-apply pattern the
 * tool clients use (see remittance-client.tsx), extracted here because three
 * surfaces need it.
 *
 * Rules:
 *  - Every value read back from the URL is validated by the calling surface;
 *    this module only provides typed primitives that never throw.
 *  - Writes go through `history.replaceState` (no Next.js navigation, no
 *    re-render, static-export safe) and are debounced so typing in a search
 *    box does not spam the history API.
 */

export type FilterValue = string | number | null | undefined;

/**
 * Merge filter updates into an existing query string. Pure — no DOM access.
 *
 * `null`/`undefined`/empty-string values delete the key; arrays are joined
 * with commas (empty array deletes). Returns the resulting query string
 * without the leading `?`, or "" when nothing remains.
 */
export function buildFilterQuery(
  currentSearch: string,
  updates: Record<string, FilterValue | readonly FilterValue[]>,
): string {
  const params = new URLSearchParams(currentSearch);
  for (const [key, raw] of Object.entries(updates)) {
    if (raw === null || raw === undefined || raw === "") {
      params.delete(key);
      continue;
    }
    if (Array.isArray(raw)) {
      params.delete(key);
      const joined = raw.filter((v) => v !== null && v !== undefined && v !== "").join(",");
      if (joined) params.set(key, joined);
      continue;
    }
    params.set(key, String(raw));
  }
  return params.toString();
}

/** Read a comma-separated list of integers ("1,3,14"); invalid parts are dropped. */
export function parseIntList(raw: string | null): number[] {
  if (!raw) return [];
  const out: number[] = [];
  for (const part of raw.split(",")) {
    const n = Number(part);
    if (Number.isInteger(n)) out.push(n);
  }
  return out;
}

/**
 * Parse an integer within [min, max]; anything else (empty, NaN, out of
 * range, non-integer text) returns the fallback.
 */
export function parseBoundedInt(
  raw: string | null,
  min: number,
  max: number,
  fallback: number,
): number {
  if (!raw) return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) return fallback;
  return n;
}

/** Parse a bounded integer or null when absent/invalid. Empty string counts as absent. */
export function parseOptionalInt(raw: string | null, min: number, max: number): number | null {
  if (raw === null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

/** Return `raw` when it is one of `allowed`, otherwise the fallback. */
export function oneOf<T extends string>(
  raw: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes((raw ?? "") as T) ? (raw as T) : fallback;
}

const WRITE_DEBOUNCE_MS = 300;

let pendingUpdates: Record<string, FilterValue | readonly FilterValue[]> | null = null;
let writeTimer: number | null = null;

function flushWrites(pathname: string): void {
  writeTimer = null;
  if (!pendingUpdates || typeof window === "undefined") return;
  // A navigation may have happened between scheduling and flushing; never
  // stamp filters onto a different path.
  if (window.location.pathname !== pathname) {
    pendingUpdates = null;
    return;
  }
  const query = buildFilterQuery(window.location.search, pendingUpdates);
  pendingUpdates = null;
  window.history.replaceState(null, "", `${pathname}${query ? `?${query}` : ""}`);
}

/**
 * Mirror filter updates into the current URL. Calls are accumulated and
 * flushed once per debounce window; safe to call on every keystroke.
 * No-op during SSR.
 */
export function writeUrlFilters(
  updates: Record<string, FilterValue | readonly FilterValue[]>,
): void {
  if (typeof window === "undefined") return;
  const pathname = window.location.pathname;
  pendingUpdates = { ...(pendingUpdates ?? {}), ...updates };
  if (writeTimer !== null) window.clearTimeout(writeTimer);
  writeTimer = window.setTimeout(() => flushWrites(pathname), WRITE_DEBOUNCE_MS);
}

/** Test hook: drop any scheduled write and reset module state. */
export function cancelPendingFilterWrites(): void {
  if (writeTimer !== null && typeof window !== "undefined" && typeof window.clearTimeout === "function") {
    window.clearTimeout(writeTimer);
  }
  writeTimer = null;
  pendingUpdates = null;
}
