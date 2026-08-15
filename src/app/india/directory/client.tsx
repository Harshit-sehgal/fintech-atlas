"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  indiaDirectoryClusterNames,
  indiaDirectorySummaries,
} from "@/generated/india-directory-summaries";

const PAGE_SIZE = 50;

export function IndiaDirectoryClient() {
  const [query, setQuery] = useState("");
  const [clusterIndex, setClusterIndex] = useState(0);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return indiaDirectorySummaries.filter((summary) => {
      if (clusterIndex > 0 && summary.clusterIndex !== clusterIndex - 1) return false;
      if (!q) return true;
      const clusterName = indiaDirectoryClusterNames[summary.clusterIndex] ?? "";
      return (
        summary.name.toLowerCase().includes(q) ||
        summary.category.toLowerCase().includes(q) ||
        clusterName.toLowerCase().includes(q)
      );
    });
  }, [query, clusterIndex]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = (fn: () => void) => {
    setPage(1);
    fn();
  };

  const goToPage = (target: number) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div data-placement="india-directory" className="mt-10">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
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
            placeholder="Search companies by name, category, or cluster..."
            value={query}
            onChange={(e) => resetPage(() => setQuery(e.target.value))}
            aria-label="Search India fintech directory"
            className="w-full surface rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40"
          />
          {query && (
            <button
              onClick={() => resetPage(() => setQuery(""))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <select
          aria-label="Filter by cluster"
          value={clusterIndex}
          onChange={(e) => resetPage(() => setClusterIndex(Number(e.target.value)))}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-2 text-sm font-medium text-[var(--foreground)] outline-none transition-colors hover:border-[var(--border-strong)] sm:max-w-64"
        >
          <option value={0}>All clusters ({indiaDirectorySummaries.length})</option>
          {indiaDirectoryClusterNames.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-[var(--muted-text)]" aria-live="polite">
        {filtered.length === indiaDirectorySummaries.length
          ? `${filtered.length} companies`
          : `${filtered.length} of ${indiaDirectorySummaries.length} companies`}
        {query && <> matching &ldquo;{query}&rdquo;</>}
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((summary) => (
          <li key={summary.slug}>
            <Link
              href={`/india/directory/${summary.slug}`}
              className="flex h-full flex-col gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--accent)]"
            >
              <span className="font-semibold text-[var(--foreground)]">
                {summary.name}
              </span>
              <span className="text-sm text-[var(--fg-dim)]">{summary.category}</span>
              <span className="mt-1 inline-flex w-fit rounded-full border border-[var(--border-color)] px-2.5 py-0.5 text-xs text-[var(--muted-text)]">
                {indiaDirectoryClusterNames[summary.clusterIndex]}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {pageItems.length === 0 && (
        <div className="mt-6 rounded-xl border border-[var(--border-color)] bg-[var(--subtle-bg)]/40 p-10 text-center">
          <p className="font-medium">No companies matched your criteria.</p>
          <p className="mt-1 text-sm text-[var(--muted-text)]">
            Try a different search term or cluster.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Directory pagination"
          className="mt-8 flex items-center justify-center gap-4"
        >
          <button
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage <= 1}
            className="rounded-lg border border-[var(--border-color)] px-3.5 py-2 text-sm font-medium transition-colors hover:border-[var(--border-strong)] disabled:pointer-events-none disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-sm text-[var(--muted-text)]">
            Page {safePage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage >= totalPages}
            className="rounded-lg border border-[var(--border-color)] px-3.5 py-2 text-sm font-medium transition-colors hover:border-[var(--border-strong)] disabled:pointer-events-none disabled:opacity-40"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}
