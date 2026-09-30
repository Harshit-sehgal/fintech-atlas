/**
 * Radar watchlists — client-side prototype (P10).
 *
 * The roadmap's paid watchlist DoD (persistence, change alerts, email,
 * unsubscribe, analytics) is gated behind the validation gate. This static
 * prototype mirrors the bookmark trust surface: slugs in localStorage.
 */
import { STORAGE_EVENT } from "@/lib/storage";

export const WATCHLIST_KEY = "fintech_atlas_radar_watchlist";
export const WATCHLIST_EVENT = "fintech-atlas-radar-watchlist-change";

function notify() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(WATCHLIST_EVENT));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
}

export function loadWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function isWatched(slug: string): boolean {
  return loadWatchlist().includes(slug);
}

/** Adds or removes a company from the watchlist; returns the new list. */
export function toggleWatch(slug: string): string[] {
  const current = loadWatchlist();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
  notify();
  return next;
}

export function clearWatchlist(): string[] {
  window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify([]));
  notify();
  return [];
}