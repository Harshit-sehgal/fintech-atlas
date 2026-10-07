"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  indiaDirectoryClusterNames,
  indiaDirectorySummaries,
} from "@/generated/india-directory-summaries";
import {
  radarFoundedYears,
  radarFundingUsdM,
  radarLicenceMasks,
  radarLicenceNames,
  radarRegulatorIndexes,
  radarRegulatorNames,
  radarSectorIndexes,
  radarSectorNames,
} from "@/generated/radar-facets";
import type { SavedSearchState } from "@/lib/saved-searches";
import { EmptyState } from "@/components/ui/empty-state";
import { downloadCsv } from "@/lib/share";
import { SITE_URL } from "@/lib/site-config";
import {
  oneOf,
  parseBoundedInt,
  parseIntList,
  parseOptionalInt,
  writeUrlFilters,
} from "@/lib/url-filters";
import { SavedSearchBar } from "./saved-searches";

const PAGE_SIZE = 50;
const UNKNOWN = -1;

type SortKey =
  | "alpha"
  | "founded-desc"
  | "founded-asc"
  | "funding-desc"
  | "funding-asc";

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "alpha", label: "Alphabetical" },
  { value: "founded-desc", label: "Founded (newest first)" },
  { value: "founded-asc", label: "Founded (oldest first)" },
  { value: "funding-desc", label: "Funding (highest first)" },
  { value: "funding-asc", label: "Funding (lowest first)" },
];

const SORT_KEYS = SORT_OPTIONS.map((o) => o.value);

/**
 * Validate and apply `?q/sectors/regulators/licences/fmin/fmax/gmin/gmax/sort/page`
 * from the URL (T110). Out-of-range facet indexes are dropped so a stale or
 * hand-edited link can never select a nonexistent facet.
 */
export function readFiltersFromParams(params: URLSearchParams): {
  query: string;
  sectorIndexes: Set<number>;
  regulatorIndexes: Set<number>;
  licenceIndexes: Set<number>;
  foundedMin: string;
  foundedMax: string;
  fundingMin: string;
  fundingMax: string;
  sort: SortKey;
  page: number;
} | null {
  if (
    !params.has("q") &&
    !params.has("sectors") &&
    !params.has("regulators") &&
    !params.has("licences") &&
    !params.has("fmin") &&
    !params.has("fmax") &&
    !params.has("gmin") &&
    !params.has("gmax") &&
    !params.has("sort") &&
    !params.has("page")
  ) {
    return null;
  }
  const inRange = (max: number) => (n: number) => n >= 0 && n < max;
  const foundedMin = parseOptionalInt(params.get("fmin"), 1900, 2100);
  const foundedMax = parseOptionalInt(params.get("fmax"), 1900, 2100);
  const fundingMin = parseOptionalInt(params.get("gmin"), 0, 1_000_000);
  const fundingMax = parseOptionalInt(params.get("gmax"), 0, 1_000_000);
  return {
    query: (params.get("q") ?? "").slice(0, 200),
    sectorIndexes: new Set(parseIntList(params.get("sectors")).filter(inRange(radarSectorNames.length))),
    regulatorIndexes: new Set(parseIntList(params.get("regulators")).filter(inRange(radarRegulatorNames.length))),
    licenceIndexes: new Set(parseIntList(params.get("licences")).filter(inRange(radarLicenceNames.length))),
    foundedMin: foundedMin === null ? "" : String(foundedMin),
    foundedMax: foundedMax === null ? "" : String(foundedMax),
    fundingMin: fundingMin === null ? "" : String(fundingMin),
    fundingMax: fundingMax === null ? "" : String(fundingMax),
    sort: oneOf(params.get("sort"), SORT_KEYS, "alpha"),
    page: parseBoundedInt(params.get("page"), 1, 10_000, 1),
  };
}

function formatFunding(usdM: number): string | null {
  if (usdM === UNKNOWN) return null;
  if (usdM >= 1000) return `~$${Number((usdM / 1000).toFixed(2))}B`;
  if (usdM >= 100) return `~$${Math.round(usdM)}M`;
  if (usdM >= 1) return `~$${Number(usdM.toFixed(1))}M`;
  return `~$${Math.round(usdM * 1000)}K`;
}

function licenceIndexesFor(mask: number): number[] {
  const indexes: number[] = [];
  for (let i = 0; i < radarLicenceNames.length; i += 1) {
    if (mask & (1 << i)) indexes.push(i);
  }
  return indexes;
}

/** Download the current filtered+sorted radar view as CSV (T112). */
function exportRadarCsv(indexes: readonly number[]): void {
  const rows: string[][] = [
    ["Name", "Cluster", "Category", "Sector", "Regulator", "Founded", "Funding USD M", "Licences", "Directory URL", "Intelligence URL"],
    ...indexes.map((i) => {
      const summary = indiaDirectorySummaries[i];
      return [
        summary.name,
        indiaDirectoryClusterNames[summary.clusterIndex] ?? "",
        summary.category,
        radarSectorNames[radarSectorIndexes[i]] ?? "",
        radarRegulatorNames[radarRegulatorIndexes[i]] ?? "",
        radarFoundedYears[i] === UNKNOWN ? "" : String(radarFoundedYears[i]),
        radarFundingUsdM[i] === UNKNOWN ? "" : String(radarFundingUsdM[i]),
        licenceIndexesFor(radarLicenceMasks[i])
          .map((licenceIndex) => radarLicenceNames[licenceIndex])
          .join("; "),
        `${SITE_URL}/india/directory/${summary.slug}`,
        `${SITE_URL}/radar/company/${summary.slug}`,
      ];
    }),
  ];
  downloadCsv("fintech-atlas-radar.csv", rows);
}

function FacetGroup({
  title,
  names,
  counts,
  selected,
  onToggle,
  idPrefix,
}: {
  title: string;
  names: string[];
  counts: number[];
  selected: Set<number>;
  onToggle: (index: number) => void;
  idPrefix: string;
}) {
  return (
    <fieldset className="border-t border-[var(--border-color)] pt-4">
      <legend className="text-sm font-semibold">{title}</legend>
      <ul className="mt-3 space-y-2">
        {names.map((name, index) => (
          <li key={name}>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                id={`${idPrefix}-${index}`}
                checked={selected.has(index)}
                onChange={() => onToggle(index)}
                className="h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span className="flex-1">{name}</span>
              <span className="text-xs tabular-nums text-[var(--muted-text)]">
                {counts[index]}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

const numberInputClass =
  "w-full rounded-sm border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-2 text-sm outline-none transition-colors hover:border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40";

export function RadarClient() {
  const [query, setQuery] = useState("");
  const [sectorIndexes, setSectorIndexes] = useState<Set<number>>(new Set());
  const [regulatorIndexes, setRegulatorIndexes] = useState<Set<number>>(new Set());
  const [licenceIndexes, setLicenceIndexes] = useState<Set<number>>(new Set());
  const [foundedMin, setFoundedMin] = useState("");
  const [foundedMax, setFoundedMax] = useState("");
  const [fundingMin, setFundingMin] = useState("");
  const [fundingMax, setFundingMax] = useState("");
  const [sort, setSort] = useState<SortKey>("alpha");
  const [page, setPage] = useState(1);

  // URL persistence (T110): restore shared filter links once after mount
  // (deferred past paint), then mirror every change back into the query
  // string so radar views survive reload and can be shared as plain URLs.
  const hydratedRef = useRef(false);
  useEffect(() => {
    const id = window.setTimeout(() => {
      const filters = readFiltersFromParams(new URLSearchParams(window.location.search));
      if (filters) {
        setQuery(filters.query);
        setSectorIndexes(filters.sectorIndexes);
        setRegulatorIndexes(filters.regulatorIndexes);
        setLicenceIndexes(filters.licenceIndexes);
        setFoundedMin(filters.foundedMin);
        setFoundedMax(filters.foundedMax);
        setFundingMin(filters.fundingMin);
        setFundingMax(filters.fundingMax);
        setSort(filters.sort);
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
      sectors: sectorIndexes.size > 0 ? [...sectorIndexes].sort((a, b) => a - b) : null,
      regulators: regulatorIndexes.size > 0 ? [...regulatorIndexes].sort((a, b) => a - b) : null,
      licences: licenceIndexes.size > 0 ? [...licenceIndexes].sort((a, b) => a - b) : null,
      fmin: foundedMin || null,
      fmax: foundedMax || null,
      gmin: fundingMin || null,
      gmax: fundingMax || null,
      sort: sort === "alpha" ? null : sort,
      page: page > 1 ? page : null,
    });
  }, [query, sectorIndexes, regulatorIndexes, licenceIndexes, foundedMin, foundedMax, fundingMin, fundingMax, sort, page]);

  const toggleSector = (index: number) => {
    setSectorIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    setPage(1);
  };

  const toggleRegulator = (index: number) => {
    setRegulatorIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    setPage(1);
  };

  const toggleLicence = (index: number) => {
    setLicenceIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    setPage(1);
  };

  const sectorCounts = useMemo(() => {
    const counts = new Array<number>(radarSectorNames.length).fill(0);
    indiaDirectorySummaries.forEach((_, i) => {
      counts[radarSectorIndexes[i]] += 1;
    });
    return counts;
  }, []);

  const regulatorCounts = useMemo(() => {
    const counts = new Array<number>(radarRegulatorNames.length).fill(0);
    indiaDirectorySummaries.forEach((_, i) => {
      counts[radarRegulatorIndexes[i]] += 1;
    });
    return counts;
  }, []);

  const licenceCounts = useMemo(() => {
    const counts = new Array<number>(radarLicenceNames.length).fill(0);
    indiaDirectorySummaries.forEach((_, i) => {
      licenceIndexesFor(radarLicenceMasks[i]).forEach((index) => {
        counts[index] += 1;
      });
    });
    return counts;
  }, []);

  const licenceFilterMask = useMemo(
    () => [...licenceIndexes].reduce((mask, index) => mask | (1 << index), 0),
    [licenceIndexes],
  );

  const filteredIndexes = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fMin = foundedMin ? Number(foundedMin) : null;
    const fMax = foundedMax ? Number(foundedMax) : null;
    const gMin = fundingMin ? Number(fundingMin) : null;
    const gMax = fundingMax ? Number(fundingMax) : null;
    const out: number[] = [];
    indiaDirectorySummaries.forEach((summary, i) => {
      if (sectorIndexes.size > 0 && !sectorIndexes.has(radarSectorIndexes[i])) return;
      if (regulatorIndexes.size > 0 && !regulatorIndexes.has(radarRegulatorIndexes[i]))
        return;
      if (
        licenceFilterMask !== 0 &&
        (radarLicenceMasks[i] & licenceFilterMask) === 0
      )
        return;
      if (fMin !== null && (radarFoundedYears[i] === UNKNOWN || radarFoundedYears[i] < fMin))
        return;
      if (fMax !== null && (radarFoundedYears[i] === UNKNOWN || radarFoundedYears[i] > fMax))
        return;
      if (gMin !== null && (radarFundingUsdM[i] === UNKNOWN || radarFundingUsdM[i] < gMin))
        return;
      if (gMax !== null && (radarFundingUsdM[i] === UNKNOWN || radarFundingUsdM[i] > gMax))
        return;
      if (q) {
        const cluster = indiaDirectoryClusterNames[summary.clusterIndex] ?? "";
        const haystack =
          `${summary.name} ${summary.category} ${cluster} ${radarSectorNames[radarSectorIndexes[i]]}`.toLowerCase();
        if (!haystack.includes(q)) return;
      }
      out.push(i);
    });
    return out;
  }, [
    query,
    sectorIndexes,
    regulatorIndexes,
    licenceFilterMask,
    foundedMin,
    foundedMax,
    fundingMin,
    fundingMax,
  ]);

  const sortedIndexes = useMemo(() => {
    const indexes = [...filteredIndexes];
    const byName = (a: number, b: number) =>
      indiaDirectorySummaries[a].name.localeCompare(indiaDirectorySummaries[b].name);
    switch (sort) {
      case "founded-desc":
        indexes.sort(
          (a, b) =>
            (radarFoundedYears[b] ?? UNKNOWN) - (radarFoundedYears[a] ?? UNKNOWN) ||
            byName(a, b),
        );
        break;
      case "founded-asc":
        indexes.sort(
          (a, b) =>
            (radarFoundedYears[a] ?? UNKNOWN) - (radarFoundedYears[b] ?? UNKNOWN) ||
            byName(a, b),
        );
        break;
      case "funding-desc":
        indexes.sort(
          (a, b) =>
            (radarFundingUsdM[b] ?? UNKNOWN) - (radarFundingUsdM[a] ?? UNKNOWN) ||
            byName(a, b),
        );
        break;
      case "funding-asc":
        indexes.sort(
          (a, b) =>
            (radarFundingUsdM[a] ?? UNKNOWN) - (radarFundingUsdM[b] ?? UNKNOWN) ||
            byName(a, b),
        );
        break;
      default:
        indexes.sort(byName);
    }
    return indexes;
  }, [filteredIndexes, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedIndexes.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = sortedIndexes.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const hasActiveFilters =
    sectorIndexes.size > 0 ||
    regulatorIndexes.size > 0 ||
    licenceIndexes.size > 0 ||
    foundedMin !== "" ||
    foundedMax !== "" ||
    fundingMin !== "" ||
    fundingMax !== "" ||
    sort !== "alpha";

  const clearAll = () => {
    setQuery("");
    setSectorIndexes(new Set());
    setRegulatorIndexes(new Set());
    setLicenceIndexes(new Set());
    setFoundedMin("");
    setFoundedMax("");
    setFundingMin("");
    setFundingMax("");
    setSort("alpha");
    setPage(1);
  };

  const goToPage = (target: number) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentState: SavedSearchState = useMemo(
    () => ({
      query,
      sectors: [...sectorIndexes],
      regulators: [...regulatorIndexes],
      licences: [...licenceIndexes],
      foundedMin,
      foundedMax,
      fundingMin,
      fundingMax,
      sort,
    }),
    [
      query,
      sectorIndexes,
      regulatorIndexes,
      licenceIndexes,
      foundedMin,
      foundedMax,
      fundingMin,
      fundingMax,
      sort,
    ],
  );

  const applySavedSearch = (state: SavedSearchState) => {
    setQuery(state.query);
    setSectorIndexes(new Set(state.sectors));
    setRegulatorIndexes(new Set(state.regulators));
    setLicenceIndexes(new Set(state.licences));
    setFoundedMin(state.foundedMin);
    setFoundedMax(state.foundedMax);
    setFundingMin(state.fundingMin);
    setFundingMax(state.fundingMax);
    setSort(state.sort as SortKey);
    setPage(1);
  };

  return (
    <div data-placement="radar" className="mt-10">
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-text)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
          />
        </svg>
        <input
          type="search"
          placeholder="Search Indian fintechs..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          aria-label="Search Indian fintech companies"
          className="w-full rounded-sm border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors hover:border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setPage(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-xs text-[var(--muted-text)] transition-colors hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
          >
            Clear
          </button>
        )}
      </div>

      <SavedSearchBar state={currentState} onApply={applySavedSearch} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_1fr]">
        <aside aria-label="Radar filters" className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Filters</h2>
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="rounded text-xs font-medium text-[var(--accent)] transition-colors hover:underline focus-visible:outline-none focus-visible:ring-[var(--ring)]"
              >
                Clear all
              </button>
            )}
          </div>

          <FacetGroup
            title="Category"
            idPrefix="radar-sector"
            names={radarSectorNames}
            counts={sectorCounts}
            selected={sectorIndexes}
            onToggle={toggleSector}
          />

          <FacetGroup
            title="Regulator"
            idPrefix="radar-regulator"
            names={radarRegulatorNames}
            counts={regulatorCounts}
            selected={regulatorIndexes}
            onToggle={toggleRegulator}
          />

          <FacetGroup
            title="Licence"
            idPrefix="radar-licence"
            names={radarLicenceNames}
            counts={licenceCounts}
            selected={licenceIndexes}
            onToggle={toggleLicence}
          />

          <fieldset className="border-t border-[var(--border-color)] pt-4">
            <legend className="text-sm font-semibold">Founded year</legend>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min={1950}
                max={2026}
                placeholder="From"
                aria-label="Founded year minimum"
                value={foundedMin}
                onChange={(e) => {
                  setFoundedMin(e.target.value);
                  setPage(1);
                }}
                className={numberInputClass}
              />
              <span aria-hidden="true" className="text-[var(--muted-text)]">
                –
              </span>
              <input
                type="number"
                min={1950}
                max={2026}
                placeholder="To"
                aria-label="Founded year maximum"
                value={foundedMax}
                onChange={(e) => {
                  setFoundedMax(e.target.value);
                  setPage(1);
                }}
                className={numberInputClass}
              />
            </div>
          </fieldset>

          <fieldset className="border-t border-[var(--border-color)] pt-4">
            <legend className="text-sm font-semibold">Funding (USD)</legend>
            <div className="mt-3 flex items-center gap-2">
              <div className="relative flex-1">
                <span
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-text)]"
                >
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder="Min M"
                  aria-label="Funding minimum in USD millions"
                  value={fundingMin}
                  onChange={(e) => {
                    setFundingMin(e.target.value);
                    setPage(1);
                  }}
                  className={`${numberInputClass} pl-7`}
                />
              </div>
              <span aria-hidden="true" className="text-[var(--muted-text)]">
                –
              </span>
              <div className="relative flex-1">
                <span
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-text)]"
                >
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder="Max M"
                  aria-label="Funding maximum in USD millions"
                  value={fundingMax}
                  onChange={(e) => {
                    setFundingMax(e.target.value);
                    setPage(1);
                  }}
                  className={`${numberInputClass} pl-7`}
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--muted-text)]">
              Amounts in USD millions; companies without a verifiable USD figure
              are hidden when either field is set.
            </p>
          </fieldset>
        </aside>

        <section aria-label="Radar results">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--muted-text)]" aria-live="polite">
              {sortedIndexes.length === indiaDirectorySummaries.length
                ? `${sortedIndexes.length} companies`
                : `${sortedIndexes.length} of ${indiaDirectorySummaries.length} companies`}
              {query && <> matching &ldquo;{query}&rdquo;</>}
            </p>
            <div className="flex items-center gap-4">
              {sortedIndexes.length > 0 && (
                <button
                  onClick={() => exportRadarCsv(sortedIndexes)}
                  className="text-xs font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded"
                >
                  Export CSV
                </button>
              )}
              <label className="flex items-center gap-2 text-sm">
                <span className="text-[var(--muted-text)]">Sort</span>
                <select
                  aria-label="Sort radar results"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortKey);
                    setPage(1);
                  }}
                  className="rounded-sm border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-2 text-sm font-medium text-[var(--foreground)] outline-none transition-colors hover:border-[var(--border-strong)]"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <ul className="mt-6 grid gap-4 border-t border-[var(--border-color)] sm:grid-cols-2">
            {pageItems.map((index) => {
              const summary = indiaDirectorySummaries[index];
              const founded = radarFoundedYears[index];
              const funding = formatFunding(radarFundingUsdM[index]);
              const licences = licenceIndexesFor(radarLicenceMasks[index]);
              return (
                <li key={summary.slug} className="flex flex-col">
                  <Link
                    href={`/india/directory/${summary.slug}`}
                    data-placement="radar-result"
                    className="box-card flex flex-1 flex-col gap-2 p-5"
                  >
                    <span className="hl-link font-semibold text-[var(--foreground)]">
                      {summary.name}
                    </span>
                    <span className="text-sm text-[var(--fg-dim)]">
                      {summary.category}
                    </span>
                      <div className="mt-auto flex flex-wrap gap-x-2 gap-y-0.5 pt-1 text-[11px] font-mono text-[var(--muted-text)]">
                        <span>{radarSectorNames[radarSectorIndexes[index]]}</span>
                        <span aria-hidden className="text-[var(--muted-dim)]">·</span>
                        <span>{radarRegulatorNames[radarRegulatorIndexes[index]]}</span>
                        {founded !== UNKNOWN && (
                          <>
                            <span aria-hidden className="text-[var(--muted-dim)]">·</span>
                            <span>Founded {founded}</span>
                          </>
                        )}
                        {funding && (
                          <>
                            <span aria-hidden className="text-[var(--muted-dim)]">·</span>
                            <span>{funding} raised</span>
                          </>
                        )}
                      </div>
                      {licences.length > 0 && (
                        <p className="pt-0.5 text-[11px] font-mono text-[var(--accent-ink)]">
                          {licences.map((licence) => radarLicenceNames[licence]).join(" · ")}
                        </p>
                      )}
                  </Link>
                  <div className="mt-1 px-1">
                    <Link
                      href={`/radar/company/${summary.slug}`}
                      data-placement="radar-intelligence-profile"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] transition-colors hover:underline"
                    >
                      Regulatory intelligence <span aria-hidden>→</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          {pageItems.length === 0 && (
            <div className="mt-6">
              <EmptyState
                title="No companies matched your criteria."
                description="Try widening the filters, or clear them to see the full set."
                action={
                  hasActiveFilters ? (
                    <button
                      onClick={clearAll}
                      className="rounded-sm border border-[var(--border-color)] px-3.5 py-2 text-sm font-medium transition-colors hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
                    >
                      Clear all filters
                    </button>
                  ) : undefined
                }
              />
            </div>
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Radar pagination"
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
                Page {safePage} of {totalPages}
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
        </section>
      </div>
    </div>
  );
}