/**
 * Pure compare-page URL query parsing, extracted from the compare client
 * component so the slug-validation logic is unit-testable without rendering
 * React or wiring up next/navigation.
 *
 * The compare page derives its selection from URL search params. This module
 * owns the parsing rules:
 *
 *   - `?companies=stripe,adyen`  → the comma-separated slugs, validated against
 *     the real company list and capped at 3.
 *   - `?companies=`              → explicit "cleared" state → empty selection.
 *   - `?a=stripe&b=adyen`        → the legacy two-param shape → validated & capped.
 *   - no params                  → default Stripe-vs-Adyen selection.
 *
 * Every slug returned is validated against the provided company list, so no
 * untrusted query string can reach the render layer with an unknown slug.
 */


export const MAX_COMPARE = 3;
export const DEFAULT_COMPARE_SLUGS: string[] = ["stripe", "adyen"];

/**
 * localStorage key holding the last comparison selection (JSON array of
 * validated slugs). Written by the compare client on every change and read by
 * the profile → compare bridge (T101) so "Add to comparison" can join the
 * user's most recent line-up.
 */
export const LAST_COMPARE_STORAGE_KEY = "fintech_atlas_compare_last";

/**
 * Read the last stored comparison selection. When a company list is provided,
 * every slug is validated against it; otherwise raw (type-checked, deduped,
 * capped) slugs are returned for cheap callers like the profile bridge — the
 * compare page re-validates the final URL through {@link parseCompareSlugs}
 * regardless, so an unknown stored slug can never reach the render layer.
 */
export function readLastCompareSlugs(
  companies?: ReadonlyArray<{ slug: string }>,
): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LAST_COMPARE_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const strings = parsed.filter((s): s is string => typeof s === "string");
    const isValid = companies ? makeSlugValidator(companies) : () => true;
    return normalizeSlugs(strings, isValid);
  } catch {
    return [];
  }
}

/** Persist the selection for the profile bridge. Best-effort; never throws. */
export function writeLastCompareSlugs(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_COMPARE_STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // Storage unavailable (private mode etc.) — the bridge then simply falls
    // back to starting a fresh single-company comparison.
  }
}

/**
 * A minimal read-only view over the search params the parser needs. Mirrors the
 * methods from {@link URLSearchParams} / Next.js' `useSearchParams()` so the
 * parser is agnostic to its source — trivial to unit-test with a plain
 * `URLSearchParams` instance.
 */
export interface SearchParamSource {
  has(name: string): boolean;
  get(name: string): string | null;
}

/**
 * Test whether a slug appears in the given company list. Isolated so the
 * hot path avoids re-allocating a Set per check when callers pass a stable
 * list reference.
 */
function makeSlugValidator(companies: ReadonlyArray<{ slug: string }>) {
  const known = new Set(companies.map((c) => c.slug));
  return (slug: string) => known.has(slug);
}

/**
 * Parse the compare selection from a search-param source.
 *
 * @param params  the search params (e.g. `new URLSearchParams("?companies=...")`)
 * @param companies the full company list, used to validate every slug
 * @returns the ordered list of validated slugs (capped at {@link MAX_COMPARE})
 */
/**
 * Validate and de-duplicate a split slug list, dropping unknown/empty slugs
 * and capping the result at {@link MAX_COMPARE}. `new Set` preserves the first
 * occurrence's order while removing duplicates (e.g. `stripe,stripe,stripe`
 * becomes `["stripe"]`).
 */
function normalizeSlugs(slugs: string[], isValid: (s: string) => boolean): string[] {
  return [...new Set(slugs.map((s) => s.trim()).filter((s) => s.length > 0).filter(isValid))].slice(0, MAX_COMPARE);
}

export function parseCompareSlugs(
  params: SearchParamSource,
  companies: ReadonlyArray<{ slug: string }>,
): string[] {
  const isValid = makeSlugValidator(companies);

  // Explicit "cleared" state: companies param present but empty.
  if (params.has("companies") && !params.get("companies")) return [];

  const compParam = params.get("companies");
  if (compParam) {
    return normalizeSlugs(compParam.split(","), isValid);
  }

  // Legacy two-param shape (?a=&b=). Validate against the company list just
  // like the primary path — earlier code passed these through unvalidated.
  const paramA = params.get("a");
  const paramB = params.get("b");
  if (paramA || paramB) {
    return normalizeSlugs([paramA, paramB].filter((s): s is string => Boolean(s)), isValid);
  }

  return [...DEFAULT_COMPARE_SLUGS];
}
