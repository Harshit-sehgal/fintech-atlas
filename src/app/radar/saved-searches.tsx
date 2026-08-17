"use client";

import { useCallback, useEffect, useState } from "react";
import {
  radarLicenceNames,
  radarRegulatorNames,
  radarSectorNames,
} from "@/generated/radar-facets";
import {
  addSavedSearch,
  deleteSavedSearch,
  isDefaultSearchState,
  loadSavedSearches,
  SAVED_SEARCH_EVENT,
  type SavedSearch,
  type SavedSearchState,
} from "@/lib/saved-searches";

function chipsFor(state: SavedSearchState): string[] {
  const chips: string[] = [];
  if (state.query.trim()) chips.push(`“${state.query.trim()}”`);
  state.sectors.forEach((i) => chips.push(radarSectorNames[i]));
  state.regulators.forEach((i) => chips.push(radarRegulatorNames[i]));
  state.licences.forEach((i) => chips.push(radarLicenceNames[i]));
  const founded = [state.foundedMin, state.foundedMax].filter(Boolean).join("–");
  if (founded) chips.push(`Founded ${founded}`);
  const funding = [state.fundingMin, state.fundingMax].filter(Boolean).join("–");
  if (funding) chips.push(`Funding ${funding}`);
  if (state.sort !== "alpha") chips.push(`Sort: ${state.sort}`);
  return chips;
}

export function SavedSearchBar({
  state,
  onApply,
}: {
  state: SavedSearchState;
  onApply: (state: SavedSearchState) => void;
}) {
  const [saved, setSaved] = useState<SavedSearch[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const refresh = () => setSaved(loadSavedSearches());
    refresh();
    window.addEventListener(SAVED_SEARCH_EVENT, refresh);
    return () => window.removeEventListener(SAVED_SEARCH_EVENT, refresh);
  }, []);

  const canSave = !isDefaultSearchState(state);

  const handleSave = useCallback(() => {
    const next = addSavedSearch(name, state);
    setSaved(next);
    setName("");
    setShowForm(false);
  }, [name, state]);

  const handleApply = useCallback(
    (search: SavedSearch) => {
      onApply(search.state);
    },
    [onApply],
  );

  const handleDelete = useCallback((id: string) => {
    setSaved(deleteSavedSearch(id));
  }, []);

  return (
    <section className="mt-8 rounded-xl border border-[var(--border-color)] bg-[var(--subtle-bg)]/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Saved searches</h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          disabled={!canSave}
          data-placement="radar-save-search-toggle"
          className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs font-medium transition-colors hover:border-[var(--border-strong)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {showForm ? "Cancel" : "Save current search"}
        </button>
      </div>

      {showForm && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search name (e.g. PA + cross-border)"
            aria-label="Name for the saved search"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-2 text-sm outline-none transition-colors hover:border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            data-placement="radar-save-search"
            className="rounded-lg bg-[var(--accent)] px-3.5 py-2 text-sm font-medium text-[var(--on-accent)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save
          </button>
        </div>
      )}

      {!canSave && (
        <p className="mt-3 text-xs text-[var(--muted-text)]">
          Set some filters (or a search term) to make a saved search worth
          keeping.
        </p>
      )}

      {saved.length > 0 && (
        <ul className="mt-3 space-y-2">
          {saved.map((search) => (
            <li
              key={search.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--card)] px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{search.name}</p>
                {chipsFor(search.state).length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {chipsFor(search.state).map((chip) => (
                      <span
                        key={chip}
                        className="inline-flex w-fit rounded-full border border-[var(--border-color)] px-2 py-0.5 text-[10px] text-[var(--muted-text)]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => handleApply(search)}
                  data-placement="radar-apply-search"
                  className="rounded-lg border border-[var(--accent)]/30 px-3 py-1.5 text-xs font-medium text-[var(--accent-ink)] transition-colors hover:bg-[var(--accent-glow)]"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(search.id)}
                  aria-label={`Delete saved search ${search.name}`}
                  className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--muted-text)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}