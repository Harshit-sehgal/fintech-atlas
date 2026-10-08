"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  globalDirectoryClusterNames,
  globalDirectoryCategoryNames,
  globalDirectorySummaries,
} from "@/generated/global-directory-summaries";
import { EmptyState } from "@/components/ui/empty-state";
import { Highlight, MarkerRule } from "@/components/ui/highlight";
import { HighlightedText } from "@/components/ui/highlighted-text";
import { Disclosure } from "@/components/ui/disclosure";
import { groupDirectory } from "@/lib/directory-groups";
import { fuzzyMatchAny } from "@/lib/fuzzy";
import { downloadCsv } from "@/lib/share";
import { SITE_URL } from "@/lib/site-config";
import { writeUrlFilters } from "@/lib/url-filters";

/** Companies shown per country before "See all" is offered. */
const PREVIEW = 5;

type Row = readonly [slug: string, name: string, categoryIndex: number, clusterIndex: number];

/** Download the current (filtered) view as CSV. */
function exportCsv(rows: readonly Row[]): void {
  downloadCsv("fintech-atlas-global-directory.csv", [
    ["Name", "Category", "Region and country", "Profile URL"],
    ...rows.map(([slug, name, categoryIndex, clusterIndex]) => [
      name,
      globalDirectoryCategoryNames[categoryIndex] ?? "",
      globalDirectoryClusterNames[clusterIndex] ?? "",
      `${SITE_URL}/global-directory/${slug}`,
    ]),
  ]);
}

/** Validate and apply `?q/region` filters shared via URL. */
export function readGlobalFiltersFromParams(params: URLSearchParams): {
  query: string;
  region: string;
} | null {
  if (!params.has("q") && !params.has("region")) return null;
  return {
    query: (params.get("q") ?? "").slice(0, 200),
    region: (params.get("region") ?? "").slice(0, 120),
  };
}

export function GlobalDirectoryClient() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [openRegions, setOpenRegions] = useState<Record<string, boolean>>({});
  const [openClusters, setOpenClusters] = useState<Record<number, boolean>>({});

  const hydratedRef = useRef(false);
  useEffect(() => {
    const id = window.setTimeout(() => {
      const filters = readGlobalFiltersFromParams(new URLSearchParams(window.location.search));
      if (filters) {
        setQuery(filters.query);
        setRegion(filters.region);
      }
      hydratedRef.current = true;
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    writeUrlFilters({ q: query, region: region || null });
  }, [query, region]);

  const regions = useMemo(
    () => groupDirectory(globalDirectoryClusterNames, globalDirectorySummaries, (row) => row[3]),
    [],
  );

  const q = query.trim();

  // Matches per cluster while searching (null when idle).
  const matches = useMemo(() => {
    if (!q) return null;
    const map = new Map<number, Row[]>();
    for (const group of regions) {
      for (const cluster of group.clusters) {
        const hits = cluster.items.filter((row) =>
          fuzzyMatchAny(
            [
              row[1],
              globalDirectoryCategoryNames[row[2]] ?? "",
              globalDirectoryClusterNames[row[3]] ?? "",
            ],
            q,
          ),
        );
        if (hits.length) map.set(cluster.index, hits);
      }
    }
    return map;
  }, [q, regions]);

  const showRegion = (name: string) => !region || region === name;

  const visibleRowCount = useMemo(() => {
    if (matches) return [...matches.values()].reduce((n, rows) => n + rows.length, 0);
    return regions.filter((r) => showRegion(r.name)).reduce((n, r) => n + r.total, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, regions, region]);

  const visibleRows = useMemo(() => {
    if (matches) return [...matches.values()].flat();
    return regions
      .filter((r) => showRegion(r.name))
      .flatMap((r) => r.clusters.flatMap((c) => c.items));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, regions, region]);

  const anyOpen = regions.some((r) => openRegions[r.name]);
  const toggleRegion = (name: string) =>
    setOpenRegions((prev) => ({ ...prev, [name]: !prev[name] }));
  const toggleCluster = (index: number) =>
    setOpenClusters((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleAllRegions = () =>
    setOpenRegions(Object.fromEntries(regions.map((r) => [r.name, !anyOpen])));

  return (
    <div data-placement="global-directory" className="mt-10">
      {/* Controls */}
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
            placeholder="Search 3,000+ companies by name, category, or country…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the global fintech directory"
            className="w-full surface rounded-sm py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-xs text-[var(--muted-text)] transition-colors hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
            >
              Clear
            </button>
          )}
        </div>
        <select
          aria-label="Filter by region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded-sm border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-2 text-sm font-medium text-[var(--foreground)] outline-none transition-colors hover:border-[var(--border-strong)] sm:max-w-56"
        >
          <option value="">All regions</option>
          {regions.map((r) => (
            <option key={r.name} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Result meta + actions */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--muted-text)]" aria-live="polite">
        <span>
          {visibleRowCount === globalDirectorySummaries.length ? (
            <>
              <Highlight color="green">{globalDirectorySummaries.length.toLocaleString()} companies</Highlight>{" "}
              in {regions.length} regions
            </>
          ) : (
            <>
              <Highlight color="green">{visibleRowCount.toLocaleString()}</Highlight> of{" "}
              {globalDirectorySummaries.length.toLocaleString()} companies
              {q && <> matching &ldquo;{q}&rdquo;</>}
            </>
          )}
        </span>
        {visibleRowCount > 0 && (
          <button
            onClick={() => exportCsv(visibleRows)}
            className="rounded text-xs font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-[var(--ring)]"
          >
            Export CSV
          </button>
        )}
        {!q && (
          <button
            onClick={toggleAllRegions}
            className="rounded text-xs font-semibold text-[var(--muted-text)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
          >
            {anyOpen ? "Collapse all regions" : "Expand all regions"}
          </button>
        )}
      </div>

      {/* Atlas: region → country → companies */}
      <div className="mt-6">
        {regions.map((group) => {
          if (!showRegion(group.name)) return null;
          const clusters = matches
            ? group.clusters.filter((c) => matches.has(c.index))
            : group.clusters;
          if (matches && clusters.length === 0) return null;

          const open = !!q || !!openRegions[group.name];
          const count = matches
            ? clusters.reduce((n, c) => n + (matches.get(c.index)?.length ?? 0), 0)
            : group.total;

          return (
            <section key={group.name} aria-label={group.name} className="border-b border-[var(--border-color)]">
              <Disclosure
                open={open}
                onToggle={() => toggleRegion(group.name)}
                summaryClassName="flex w-full items-baseline gap-3 py-3.5 text-left transition-colors hover:bg-[var(--subtle-bg)]/40 focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded-sm"
                summary={(expanded) => (
                  <>
                    <span
                      aria-hidden="true"
                      className={`inline-block text-[var(--muted-text)] transition-transform ${expanded ? "rotate-90" : ""}`}
                    >
                      ▸
                    </span>
                    <span className="text-base font-semibold tracking-tight text-[var(--foreground)]">
                      <HighlightedText text={group.name} query={q} color="green" />
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-[var(--muted-text)]">
                      <Highlight color="yellow">{count.toLocaleString()}</Highlight>{" "}
                      {clusters.length} {clusters.length === 1 ? "country" : "countries"}
                    </span>
                  </>
                )}
              >
                <div className="pb-5 pl-6">
                  <MarkerRule className="mb-4" />
                  {clusters.map((cluster) => {
                    const items = matches ? matches.get(cluster.index) ?? [] : cluster.items;
                    const clusterOpen = !!q || !!openClusters[cluster.index];
                    const shown = clusterOpen ? items : items.slice(0, PREVIEW);
                    const collapsible = !q && items.length > PREVIEW;
                    return (
                      <Disclosure
                        key={cluster.index}
                        open={clusterOpen}
                        onToggle={() => toggleCluster(cluster.index)}
                        className="mt-5 first:mt-0"
                        summaryClassName={`flex w-full items-baseline gap-3 rounded-sm text-left ${
                          collapsible ? "cursor-pointer hover:opacity-90" : "cursor-default"
                        } focus-visible:outline-none focus-visible:ring-[var(--ring)]`}
                        summary={(expanded) => (
                          <>
                            <h3 className="text-sm font-semibold text-[var(--foreground)]">
                              <HighlightedText text={cluster.label} query={q} />
                            </h3>
                            <span className="text-xs text-[var(--muted-text)]">{items.length}</span>
                            {collapsible && (
                              <span className="ml-auto text-xs font-semibold text-[var(--accent)]">
                                {expanded ? "Show less" : `See all ${items.length} →`}
                              </span>
                            )}
                          </>
                        )}
                      >
                        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {shown.map(([slug, name, categoryIndex]) => (
                            <li key={slug}>
                              <Link
                                href={`/global-directory/${slug}`}
                                className="box-card flex h-full flex-col gap-1 p-4"
                              >
                                <span className="font-semibold text-[var(--foreground)]">
                                  <HighlightedText text={name} query={q} />
                                </span>
                                <span className="text-xs text-[var(--fg-dim)]">
                                  <HighlightedText
                                    text={globalDirectoryCategoryNames[categoryIndex] ?? ""}
                                    query={q}
                                    color="green"
                                  />
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </Disclosure>
                    );
                  })}
                </div>
              </Disclosure>
            </section>
          );
        })}
      </div>

      {visibleRowCount === 0 && (
        <div className="mt-6">
          <EmptyState
            title="No companies matched your search."
            description="Try a different name, category, or country."
            action={
              <button
                onClick={() => {
                  setQuery("");
                  setRegion("");
                }}
                className="rounded-sm border border-[var(--border-color)] px-4 py-2 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
              >
                Clear all filters
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}
