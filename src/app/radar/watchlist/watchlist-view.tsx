"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { indiaDirectorySummaries } from "@/generated/india-directory-summaries";
import {
  clearWatchlist,
  loadWatchlist,
  toggleWatch,
  WATCHLIST_EVENT,
} from "@/lib/watchlists";

export function WatchlistView() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setSlugs(loadWatchlist());
    refresh();
    window.addEventListener(WATCHLIST_EVENT, refresh);
    return () => window.removeEventListener(WATCHLIST_EVENT, refresh);
  }, []);

  const bySlug = new Map(indiaDirectorySummaries.map((s) => [s.slug, s]));
  const entries = slugs
    .map((slug) => bySlug.get(slug))
    .filter((summary): summary is NonNullable<typeof summary> => Boolean(summary));

  const handleRemove = useCallback((slug: string) => {
    toggleWatch(slug);
  }, []);

  const handleClear = useCallback(() => {
    clearWatchlist();
  }, []);

  if (entries.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-[var(--border-color)] bg-[var(--subtle-bg)]/40 p-10 text-center">
        <p className="font-medium">Your watchlist is empty.</p>
        <p className="mt-1 text-sm text-[var(--muted-text)]">
          Open a company&rsquo;s{" "}
          <Link
            href="/radar"
            className="font-medium text-[var(--accent)] transition-colors hover:underline"
          >
            Radar intelligence profile
          </Link>{" "}
          and press Watch.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted-text)]">
          {entries.length} watched {entries.length === 1 ? "company" : "companies"}
        </p>
        <button
          type="button"
          onClick={handleClear}
          data-placement="radar-watchlist-clear"
          className="rounded text-xs font-medium text-[var(--muted-text)] transition-colors hover:text-[var(--foreground)]"
        >
          Clear watchlist
        </button>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {entries.map((summary) => (
          <li
            key={summary.slug}
            className="flex flex-col gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card)] p-4"
          >
            <Link
              href={`/radar/company/${summary.slug}`}
              data-placement="radar-watchlist-item"
              className="group"
            >
              <span className="font-semibold transition-colors group-hover:text-[var(--accent)]">
                {summary.name}
              </span>
              <span className="mt-0.5 block text-sm text-[var(--fg-dim)]">
                {summary.category}
              </span>
            </Link>
            <div className="mt-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRemove(summary.slug)}
                className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--muted-text)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}