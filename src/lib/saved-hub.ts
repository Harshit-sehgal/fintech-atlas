/**
 * Saved hub (T112): enumerates every locally-persisted surface so /bookmarks
 * can present one consolidated "Saved" view — bookmarks, private notes,
 * calculator sessions and radar state.
 *
 * Storage keys involved:
 *  - `reviews_<slug>`          → private notes on company/radar profiles
 *  - `fintech_atlas_tool_<id>` → tool sessions (fee estimator, calculators…)
 *  - `fintech_atlas_radar_watchlist`   → watched radar companies
 *  - `fintech_atlas_saved_searches`    → named radar searches
 *
 * Everything here is read-only and defensive: malformed or foreign storage
 * entries are skipped, never thrown. Pure helpers are exported separately
 * from the localStorage-scanning functions so both are unit-testable.
 */

import { parseReviews } from "@/lib/reviews";
import { loadSavedSearches } from "@/lib/saved-searches";
import { loadWatchlist } from "@/lib/watchlists";
import { companySummaries } from "@/generated/company-summaries";
import { indiaDirectorySummaries } from "@/generated/india-directory-summaries";

const NOTES_PREFIX = "reviews_";

/** A private note set attached to a company profile. */
export interface NoteSummary {
  slug: string;
  name: string;
  href: string;
  count: number;
  latestDate: string | null;
}

/** A stored tool session the visitor can jump back into. */
export interface ToolSessionSummary {
  key: string;
  label: string;
  href: string;
}

function nameForSlug(slug: string): { name: string; href: string } | null {
  const global = companySummaries.find((c) => c.slug === slug);
  if (global) return { name: global.name, href: `/companies/${slug}` };
  const india = indiaDirectorySummaries.find((c) => c.slug === slug);
  if (india) return { name: india.name, href: `/radar/company/${slug}` };
  return null;
}

/** Map a `reviews_<slug>` storage key to its slug; null for foreign keys. */
export function noteKeyToSlug(key: string): string | null {
  return key.startsWith(NOTES_PREFIX) && key.length > NOTES_PREFIX.length
    ? key.slice(NOTES_PREFIX.length)
    : null;
}

/**
 * Scan localStorage for every note set. Slugs that no longer resolve to a
 * known company are still listed (data must not silently disappear) using a
 * prettified slug as the label, but without a link target.
 */
export function enumerateNotes(): NoteSummary[] {
  if (typeof window === "undefined") return [];
  const out: NoteSummary[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      const slug = key ? noteKeyToSlug(key) : null;
      if (!slug || !key) continue;
      const raw = window.localStorage.getItem(key);
      const reviews = raw ? parseReviews(raw) : [];
      if (reviews.length === 0) continue;
      const resolved = nameForSlug(slug);
      const latest = reviews
        .map((r) => r.date)
        .filter(Boolean)
        .sort()
        .at(-1);
      out.push({
        slug,
        name: resolved?.name ?? slug.replaceAll("-", " "),
        href: resolved?.href ?? "",
        count: reviews.length,
        latestDate: latest ?? null,
      });
    }
  } catch {
    return out;
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

const TOOL_SESSIONS: Array<{ key: string; label: string; href: string }> = [
  { key: "fee_calculator", label: "Gateway fee estimator session", href: "/tools/calculator" },
  { key: "remittance", label: "Cross-border remittance session", href: "/tools/remittance" },
  { key: "markup_calculator", label: "Exchange-rate markup session", href: "/tools/exchange-rate-markup-calculator" },
  { key: "matchmaker", label: "Matchmaker quiz answers", href: "/tools/matchmaker" },
];

/**
 * True when the storage key belongs to a per-calculator session (`calc_<id>`).
 * Deliberately does NOT import the calculator catalogue to resolve display
 * names — that would pull the whole config into this chunk for a label. The
 * calculators hub renders the exact tool names on arrival anyway.
 */
export function calcSessionId(key: string): string | null {
  if (!key.startsWith("calc_")) return null;
  const id = key.slice("calc_".length);
  return /^[a-z][a-z0-9-]*$/.test(id) ? id : null;
}

/**
 * Enumerate restorable tool sessions. Only keys whose tool is still in the
 * catalogue are listed — an orphaned session for a removed tool would be a
 * dead link.
 */
export function enumerateToolSessions(): ToolSessionSummary[] {
  if (typeof window === "undefined") return [];
  const out: ToolSessionSummary[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith("fintech_atlas_tool_")) continue;
      const id = key.slice("fintech_atlas_tool_".length);
      const fixed = TOOL_SESSIONS.find((t) => t.key === id);
      if (fixed) {
        out.push({ key: id, label: fixed.label, href: fixed.href });
        continue;
      }
      if (calcSessionId(id)) {
        out.push({
          key: id,
          label: "Saved calculator session",
          href: "/tools/calculators",
        });
      }
    }
  } catch {
    return out;
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}

export interface RadarSavedSummary {
  watchlistCount: number;
  savedSearchCount: number;
}

/** Counts for the radar block of the saved hub. Never throws. */
export function radarSavedSummary(): RadarSavedSummary {
  if (typeof window === "undefined") return { watchlistCount: 0, savedSearchCount: 0 };
  try {
    return {
      watchlistCount: loadWatchlist().length,
      savedSearchCount: loadSavedSearches().length,
    };
  } catch {
    return { watchlistCount: 0, savedSearchCount: 0 };
  }
}
