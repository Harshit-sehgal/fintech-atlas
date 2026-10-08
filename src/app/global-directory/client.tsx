"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  globalDirectoryClusterNames,
  globalDirectorySummaries,
} from "@/generated/global-directory-summaries";
import { EmptyState } from "@/components/ui/empty-state";
import { fuzzyMatchAny } from "@/lib/fuzzy";
import { downloadCsv } from "@/lib/share";
import { SITE_URL } from "@/lib/site-config";
import { parseBoundedInt, writeUrlFilters } from "@/lib/url-filters";

const PAGE_SIZE = 50;

/** Download the current (filtered) global directory view as CSV. */
function exportGlobalDirectoryCsv(
  rowsIn: ReadonlyArray<{ slug: string; name: string; category: string; clusterIndex: number }>,
): void {
  downloadCsv("fintech-atlas-global-directory.csv", [
    ["Name", "Category", "Cluster", "Profile URL"],
    ...rowsIn.map((s) => [
      s.name,
      s.category,
      globalDirectoryClusterNames[s.clusterIndex] ?? "",
      `${SITE_URL}/global-directory/${s.slug}`,
    ]),
  ]);
}

/** Validate and apply `?q/cluster/page` filters shared via URL. */
export function readGlobalFiltersFromParams(params: URLSearchParams): {
  query: string;
  clusterIndex: number;
  page: number;
} | null {
  if (!params.has("q") && !params.has("cluster") && !params.has("page")) return null;
  return {
    query: (params.get("q") ?? "").slice(0, 200),
    clusterIndex: parseBoundedInt(
      params.get("cluster"),
      0,
      globalDirectoryClusterNames.length,
      0,
    ),
    page: parseBoundedInt(params.get("page"), 1, 10_000, 1),
  };
}

export function GlobalDirectoryClient() {
  const [query, setQuery] = useState("");
  const [clusterIndex, setClusterIndex] = useState(0);
  const [page, setPage] = useState(1);

  // URL persistence: restore once after mount (deferred past paint),
  // then mirror every filter change back into the query string.
  const hydratedRef = useRef(false);
  useEffect(() => {
    const id = window.setTimeout(() => {
      const filters = readGlobalFiltersFromParams(new URLSearchParams(window.location.search));
      if (filters) {
        setQuery(filters.query);
        setClusterIndex(filters.clusterIndex);
        setPage(filters.page);
      }
      hydratedRef.current = true;
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    writeUrlFilters({
      q: query,
      cluster: clusterIndex > 0 ? clusterIndex : null,
      page: page > 1 ? page : null,
    });
  }, [query, clusterIndex, page]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return globalDirectorySummaries.filter((summary) => {
      if (clusterIndex > 0 && summary.clusterIndex !== clusterIndex - 1) return false;
      if (!q) return true;
      const clusterName = globalDirectoryClusterNames[summary.clusterIndex] ?? "";
      // Fuzzy match: tolerates typos and partial words; exact
      // substrings still rank highest.
      return fuzzyMatchAny([summary.name, summary.category, clusterName], q);
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
    <div data-placement="global-directory" className="mt-10">
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
            aria-label="Search global fintech directory"
            className="w-full surface rounded-sm py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40"
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
          className="rounded-sm border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-2 text-sm font-medium text-[var(--foreground)] outline-none transition-colors hover:border-[var(--border-strong)] sm:max-w-64"
        >
          <option value={0}>All clusters ({globalDirectorySummaries.length})</option>
          {globalDirectoryClusterNames.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--muted-text)]" aria-live="polite">
        <span>
          {filtered.length === globalDirectorySummaries.length
            ? `${filtered.length.toLocaleString()} companies`
            : `${filtered.length.toLocaleString()} of ${globalDirectorySummaries.length.toLocaleString()} companies`}
          {query && <> matching &ldquo;{query}&rdquo;</>}
        </span>
        {filtered.length > 0 && (
          <button
            onClick={() => exportGlobalDirectoryCsv(filtered)}
            className="text-xs font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded"
          >
            Export CSV
          </button>
        )}
      </p>

      <ul className="mt-6 grid gap-4 border-t border-[var(--border-color)] sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((summary) => (
          <li key={summary.slug}>
            <Link
              href={`/global-directory/${summary.slug}`}
              className="box-card flex h-full flex-col gap-1 p-5"
            >
              <span className="hl-link font-semibold text-[var(--foreground)]">
                {summary.name}
              </span>
              <span className="text-sm text-[var(--fg-dim)]">{summary.category}</span>
              <span className="mt-1 w-fit font-mono text-[11px] uppercase tracking-wider text-[var(--muted-text)]">
                {globalDirectoryClusterNames[summary.clusterIndex]}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {pageItems.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title="No companies matched your criteria."
            description="Try a different search term or cluster."
            action={
              <button
                onClick={() => resetPage(() => {
                  setQuery("");
                  setClusterIndex(0);
                })}
                className="rounded-sm border border-[var(--border-color)] px-4 py-2 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
              >
                Clear all filters
              </button>
            }
          />
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
            className="rounded-sm border border-[var(--border-color)] px-3.5 py-2 text-sm font-medium transition-colors hover:border-[var(--border-strong)] disabled:pointer-events-none disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-sm text-[var(--muted-text)]">
            Page {safePage} of {totalPages.toLocaleString()}
          </span>
          <button
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage >= totalPages}
            className="rounded-sm border border-[var(--border-color)] px-3.5 py-2 text-sm font-medium transition-colors hover:border-[var(--border-strong)] disabled:pointer-events-none disabled:opacity-40"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}
