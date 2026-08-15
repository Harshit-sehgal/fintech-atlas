"use client";

import { useState } from "react";

const LETTERS = ["ALL", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

/**
 * Search + A–Z filter for the server-rendered glossary cards.
 *
 * The cards are static HTML (every definition is in the export — good for
 * SEO and the JS budget); this island filters them by DOM attributes and
 * updates the count/empty state, so the full glossary data never ships in
 * the client bundle.
 */
export function GlossaryToolbar({
  totalCount,
  availableLetters,
}: {
  totalCount: number;
  availableLetters: string[];
}) {
  const [query, setQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");

  const applyFilters = (q: string, letter: string) => {
    const needle = q.toLowerCase().trim();
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-glossary-card]"),
    );
    let visible = 0;
    for (const card of cards) {
      const matchesLetter =
        letter === "ALL" || card.dataset.letter === letter;
      const matchesSearch =
        needle === "" || (card.dataset.search ?? "").includes(needle);
      const show = matchesLetter && matchesSearch;
      card.hidden = !show;
      if (show) visible += 1;
    }
    const count = document.getElementById("glossary-count");
    if (count) count.textContent = `Showing ${visible} of ${totalCount} terms`;
    const note = document.getElementById("glossary-filter-note");
    if (note) {
      note.hidden = letter === "ALL";
      note.textContent = `Letter filter: "${letter}"`;
    }
    const empty = document.getElementById("glossary-empty");
    if (empty) empty.hidden = visible > 0;
  };

  return (
    <div className="mt-10 space-y-4">
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-text)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search glossary terms (e.g. UPI, Payment Aggregator, FEMA, TPAP)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            applyFilters(e.target.value, selectedLetter);
          }}
          aria-label="Search glossary terms"
          className="w-full surface rounded-xl border border-[var(--border-color)] py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              applyFilters("", selectedLetter);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-b border-[var(--border-color)] pb-4">
        {LETTERS.map((letter) => {
          const hasTerms =
            letter === "ALL" || availableLetters.includes(letter);
          const active = selectedLetter === letter;
          return (
            <button
              key={letter}
              aria-disabled={!hasTerms}
              onClick={() => {
                if (!hasTerms) return;
                setSelectedLetter(letter);
                applyFilters(query, letter);
              }}
              className={`relative flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-xs font-mono font-bold transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
                active
                  ? "text-[var(--background)]"
                  : hasTerms
                    ? "text-[var(--foreground)] hover:bg-[var(--subtle-bg)] focus-visible:bg-[var(--subtle-bg)]"
                    : "text-[var(--border-color)] cursor-not-allowed opacity-60"
              }`}
            >
              {active && (
                <span className="absolute inset-0 -z-10 rounded bg-[var(--foreground)]" />
              )}
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
