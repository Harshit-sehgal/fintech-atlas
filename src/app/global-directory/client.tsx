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
import { groupByCategory, groupDirectory } from "@/lib/directory-groups";
import { fuzzyMatchAny } from "@/lib/fuzzy";
import { downloadCsv } from "@/lib/share";
import { SITE_URL } from "@/lib/site-config";
import { writeUrlFilters } from "@/lib/url-filters";

/** Companies shown in a group before "See all" is offered. */
const PREVIEW = 6;

type Axis = "region" | "industry";
type Row = readonly [slug: string, name: string, categoryIndex: number, clusterIndex: number];

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

export function readGlobalFiltersFromParams(params: URLSearchParams): {
  query: string;
  region: string;
  axis: Axis;
} | null {
  if (!params.has("q") && !params.has("region") && !params.has("by")) return null;
  return {
    query: (params.get("q") ?? "").slice(0, 200),
    region: (params.get("region") ?? "").slice(0, 120),
    axis: params.get("by") === "industry" ? "industry" : "region",
  };
}

/** Fuzzy match across a company's name, category and region-and-country. */
function matchesRow(row: Row, q: string): boolean {
  return fuzzyMatchAny(
    [row[1], globalDirectoryCategoryNames[row[2]] ?? "", globalDirectoryClusterNames[row[3]] ?? ""],
    q,
  );
}

/** A dense, Wikipedia-ish company row: link + right-aligned meta. */
function CompanyRow({ row, query }: { row: Row; query: string }) {
  const [slug, name, categoryIndex] = row;
  return (
    <li>
      <Link
        href={`/global-directory/${slug}`}
        className="flex items-baseline justify-between gap-3 rounded-sm border-b border-[var(--border-color)] py-1.5 text-sm transition-colors hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
      >
        <span className="text-[var(--accent)] hover:underline">
          <HighlightedText text={name} query={query} />
        </span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[var(--muted-text)]">
          <HighlightedText text={globalDirectoryCategoryNames[categoryIndex] ?? ""} query={query} color="green" />
        </span>
      </Link>
    </li>
  );
}

export function GlobalDirectoryClient() {
  const [query, setQuery] = useState("");
  const [axis, setAxis] = useState<Axis>("region");
  const [region, setRegion] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [openClusters, setOpenClusters] = useState<Record<string, boolean>>({});

  const hydratedRef = useRef(false);
  useEffect(() => {
    const id = window.setTimeout(() => {
      const filters = readGlobalFiltersFromParams(new URLSearchParams(window.location.search));
      if (filters) {
        setQuery(filters.query);
        setRegion(filters.region);
        setAxis(filters.axis);
      }
      hydratedRef.current = true;
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    writeUrlFilters({
      q: query,
      by: axis === "industry" ? "industry" : null,
      region: axis === "region" && region ? region : null,
    });
  }, [query, axis, region]);

  const regions = useMemo(
    () => groupDirectory(globalDirectoryClusterNames, globalDirectorySummaries, (r) => r[3]),
    [],
  );
  const industries = useMemo(
    () => groupByCategory(globalDirectorySummaries, (r) => globalDirectoryCategoryNames[r[2]] ?? ""),
    [],
  );

  const q = query.trim();

  const regionView = useMemo(
    () =>
      regions
        .filter((r) => !region || r.name === region)
        .map((r) => {
          const blocks = r.clusters
            .map((c) => ({
              key: String(c.index),
              label: c.label,
              items: q ? c.items.filter((row) => matchesRow(row, q)) : c.items,
            }))
            .filter((b) => b.items.length > 0);
          return {
            name: r.name,
            count: q ? blocks.reduce((n, b) => n + b.items.length, 0) : r.total,
            blocks,
          };
        })
        .filter((r) => r.count > 0),
    [regions, region, q],
  );

  const industryView = useMemo(
    () =>
      industries
        .map((g) => ({ name: g.name, items: q ? g.items.filter((row) => matchesRow(row, q)) : g.items }))
        .filter((g) => g.items.length > 0),
    [industries, q],
  );

  const visibleRows = useMemo<Row[]>(
    () =>
      axis === "region"
        ? regionView.flatMap((r) => r.blocks.flatMap((b) => b.items))
        : industryView.flatMap((g) => g.items),
    [axis, regionView, industryView],
  );

  const total = q
    ? axis === "region"
      ? regionView.reduce((n, r) => n + r.count, 0)
      : industryView.reduce((n, g) => n + g.items.length, 0)
    : axis === "region"
      ? regions.filter((r) => !region || r.name === region).reduce((n, r) => n + r.total, 0)
      : globalDirectorySummaries.length;

  const toggle = (set: typeof setOpenGroups, key: string) =>
    set((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div data-placement="global-directory" className="mt-8">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search companies by name, category, or country…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the global fintech directory"
            className="w-full rounded-sm border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[var(--accent)]"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-xs text-[var(--muted-text)] hover:text-[var(--foreground)]">
              Clear
            </button>
          )}
        </div>

        {/* Axis switch */}
        <div role="group" aria-label="Group companies by" className="flex shrink-0 rounded-sm border border-[var(--border-color)] p-0.5 text-xs font-medium">
          {(["region", "industry"] as Axis[]).map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={axis === a}
              onClick={() => setAxis(a)}
              className={`rounded-[3px] px-3 py-1.5 transition-colors ${
                axis === a ? "bg-[var(--accent)] text-[var(--background)]" : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
              }`}
            >
              By {a}
            </button>
          ))}
        </div>

        {axis === "region" && (
          <select
            aria-label="Filter by region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-sm border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-2 text-sm font-medium outline-none transition-colors hover:border-[var(--border-strong)] sm:max-w-52"
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r.name} value={r.name}>{r.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--muted-text)]" aria-live="polite">
        <span>
          {total === globalDirectorySummaries.length ? (
            <>
              <Highlight color="green">{globalDirectorySummaries.length.toLocaleString()} companies</Highlight>{" "}
              · {axis === "region" ? `${regions.length} regions` : `${industries.length} industries`}
            </>
          ) : (
            <>
              <Highlight color="green">{total.toLocaleString()}</Highlight> of {globalDirectorySummaries.length.toLocaleString()} companies
              {q && <> matching &ldquo;{q}&rdquo;</>}
            </>
          )}
        </span>
        {total > 0 && (
          <button
            onClick={() => exportCsv(visibleRows)}
            className="rounded text-xs font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-[var(--ring)]"
          >
            Export CSV
          </button>
        )}
      </div>

      {/* Region axis: region → country */}
      {axis === "region" && (
        <div className="mt-5">
          {regionView.map((group) => {
            const open = !!q || !!openGroups[`r:${group.name}`];
            return (
              <section key={group.name} className="border-b border-[var(--border-color)]">
                <Disclosure
                  open={open}
                  onToggle={() => toggle(setOpenGroups, `r:${group.name}`)}
                  summaryClassName="flex w-full items-baseline gap-3 py-3.5 text-left transition-colors hover:bg-[var(--subtle-bg)]/40 focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded-sm"
                  summary={(expanded) => (
                    <>
                      <span aria-hidden="true" className={`inline-block text-[var(--muted-text)] transition-transform ${expanded ? "rotate-90" : ""}`}>▸</span>
                      <span className="text-base font-semibold tracking-tight text-[var(--foreground)]">
                        <HighlightedText text={group.name} query={q} color="green" />
                      </span>
                      <span className="ml-auto shrink-0 text-xs text-[var(--muted-text)]">
                        <Highlight color="yellow">{group.count.toLocaleString()}</Highlight> {group.blocks.length} {group.blocks.length === 1 ? "country" : "countries"}
                      </span>
                    </>
                  )}
                >
                  <div className="pb-5 pl-6">
                    <MarkerRule className="mb-4" />
                    {group.blocks.map((block) => {
                      const clusterOpen = !!q || !!openClusters[`c:${block.key}`];
                      const shown = clusterOpen ? block.items : block.items.slice(0, PREVIEW);
                      const collapsible = !q && block.items.length > PREVIEW;
                      return (
                        <Disclosure
                          key={block.key}
                          open={clusterOpen}
                          onToggle={() => toggle(setOpenClusters, `c:${block.key}`)}
                          className="mt-5 first:mt-0"
                          summaryClassName={`flex w-full items-baseline gap-3 rounded-sm text-left ${collapsible ? "cursor-pointer hover:opacity-90" : "cursor-default"} focus-visible:outline-none focus-visible:ring-[var(--ring)]`}
                          summary={(expanded) => (
                            <>
                              <h3 className="text-sm font-semibold text-[var(--foreground)]"><HighlightedText text={block.label} query={q} /></h3>
                              <span className="text-xs text-[var(--muted-text)]">{block.items.length}</span>
                              {collapsible && <span className="ml-auto text-xs font-semibold text-[var(--accent)]">{expanded ? "Show less" : `See all ${block.items.length} →`}</span>}
                            </>
                          )}
                        >
                          <ul className="mt-3 grid gap-x-8 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-3">
                            {shown.map((row) => <CompanyRow key={row[0]} row={row} query={q} />)}
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
      )}

      {/* Industry axis: industry → companies */}
      {axis === "industry" && (
        <div className="mt-5">
          {industryView.map((group) => {
            const key = `i:${group.name}`;
            const open = !!q || !!openGroups[key];
            const shown = open ? group.items : group.items.slice(0, PREVIEW);
            const collapsible = !q && group.items.length > PREVIEW;
            return (
              <section key={group.name} className="border-b border-[var(--border-color)]">
                <Disclosure
                  open={open}
                  onToggle={collapsible ? () => toggle(setOpenGroups, key) : () => {}}
                  summaryClassName={`flex w-full items-baseline gap-3 py-3.5 text-left rounded-sm ${collapsible ? "cursor-pointer hover:bg-[var(--subtle-bg)]/40" : "cursor-default"} focus-visible:outline-none focus-visible:ring-[var(--ring)]`}
                  summary={(expanded) => (
                    <>
                      <span aria-hidden="true" className={`inline-block text-[var(--muted-text)] transition-transform ${expanded ? "rotate-90" : ""}`}>▸</span>
                      <span className="text-base font-semibold tracking-tight text-[var(--foreground)]"><HighlightedText text={group.name} query={q} color="green" /></span>
                      <span className="ml-auto shrink-0 text-xs text-[var(--muted-text)]">
                        <Highlight color="yellow">{group.items.length.toLocaleString()}</Highlight>
                      </span>
                      {collapsible && <span className="shrink-0 text-xs font-semibold text-[var(--accent)]">{expanded ? "Show less" : "See all →"}</span>}
                    </>
                  )}
                >
                  <div className="pb-5 pl-6">
                    <ul className="grid gap-x-8 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-3">
                      {shown.map((row) => <CompanyRow key={row[0]} row={row} query={q} />)}
                    </ul>
                  </div>
                </Disclosure>
              </section>
            );
          })}
        </div>
      )}

      {total === 0 && (
        <div className="mt-6">
          <EmptyState
            title="No companies matched your search."
            description="Try a different name, category, or country."
            action={
              <button
                onClick={() => { setQuery(""); setRegion(""); }}
                className="rounded-sm border border-[var(--border-color)] px-4 py-2 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)]"
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
