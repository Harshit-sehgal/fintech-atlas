/**
 * Saved searches — client-side persistence for Radar filter state.
 *
 * Static prototype per the roadmap (P9): search state persists in
 * localStorage, the same trust surface as bookmarks. Server-side persistence
 * for saved searches is gated behind the validation gate (P13+).
 */
import { STORAGE_EVENT } from "@/lib/storage";

export const SAVED_SEARCHES_KEY = "fintech_atlas_saved_searches";
export const SAVED_SEARCH_EVENT = "fintech-atlas-saved-search-change";

export interface SavedSearchState {
  query: string;
  sectors: number[];
  regulators: number[];
  licences: number[];
  foundedMin: string;
  foundedMax: string;
  fundingMin: string;
  fundingMax: string;
  sort: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  state: SavedSearchState;
  createdAt: string;
}

/** True when the state carries nothing worth saving. */
export function isDefaultSearchState(state: SavedSearchState): boolean {
  return (
    state.query.trim() === "" &&
    state.sectors.length === 0 &&
    state.regulators.length === 0 &&
    state.licences.length === 0 &&
    state.foundedMin === "" &&
    state.foundedMax === "" &&
    state.fundingMin === "" &&
    state.fundingMax === "" &&
    state.sort === "alpha"
  );
}

function notify() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SAVED_SEARCH_EVENT));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
}

export function loadSavedSearches(): SavedSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedSearch[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(list: SavedSearch[]): void {
  window.localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(list));
  notify();
}

export function createSearchId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Adds a search, replacing one with the same name (so re-saving updates). */
export function addSavedSearch(name: string, state: SavedSearchState): SavedSearch[] {
  const trimmed = name.trim();
  if (!trimmed) return loadSavedSearches();
  const list = loadSavedSearches().filter((s) => s.name !== trimmed);
  const search: SavedSearch = {
    id: createSearchId(),
    name: trimmed,
    state,
    createdAt: new Date().toISOString(),
  };
  const next = [search, ...list];
  persist(next);
  return next;
}

export function deleteSavedSearch(id: string): SavedSearch[] {
  const next = loadSavedSearches().filter((s) => s.id !== id);
  persist(next);
  return next;
}