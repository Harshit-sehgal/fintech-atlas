"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { categories } from "@/data/categories";
import {
  companySummaries,
  categoryNames,
  type CompanySummary,
} from "@/generated/company-summaries";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { CompanyLogo } from "@/components/ui/company-logo";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { Highlight } from "@/components/ui/highlight";
import { useBookmarks } from "@/lib/bookmarks-context";
import { useToast } from "@/lib/toast-context";
import { formatValuationShort, formatHeadquartersCity, getValuationAmountUsd } from "@/lib/format-company";
import { fuzzyMatchAny } from "@/lib/fuzzy";
import { downloadCsv } from "@/lib/share";
import { SITE_URL } from "@/lib/site-config";
import { oneOf, writeUrlFilters } from "@/lib/url-filters";
import { useUiMode } from "@/lib/ui-mode-context";

type SortOption = "name" | "rating" | "valuation" | "founded";

const SORT_OPTIONS = ["rating", "valuation", "name", "founded"] as const;
const REGION_OPTIONS = ["all", "india", "global"] as const;
type RegionOption = (typeof REGION_OPTIONS)[number];

type ExportableCompany = CompanySummary & { valuationNum: number | null };

/** Download the current (filtered) directory view as CSV. */
function exportCompaniesCsv(companies: readonly ExportableCompany[]): void {
  const rows: string[][] = [
    ["Name", "Founded", "Headquarters", "Employees", "Valuation USD", "Rating", "Categories", "Profile URL"],
    ...companies.map((c) => [
      c.name,
      String(c.founded),
      formatHeadquartersCity(c.headquarters),
      c.employees,
      c.valuationNum === null ? "" : String(c.valuationNum),
      String(c.rating),
      c.categories.join("; "),
      `${SITE_URL}/companies/${c.slug}`,
    ]),
  ];
  downloadCsv("fintech-atlas-directory.csv", rows);
}

/** Validate and apply `?q/category/region/sort` filters shared via URL. */
export function readFiltersFromParams(params: URLSearchParams): {
  search: string;
  selectedCategory: string;
  region: RegionOption;
  sortBy: SortOption;
} | null {
  const categorySlugs = ["all", ...categories.map((c) => c.slug)] as const;
  const next = {
    search: (params.get("q") ?? "").slice(0, 200),
    selectedCategory: oneOf(params.get("category"), categorySlugs, "all"),
    region: oneOf(params.get("region"), REGION_OPTIONS, "all"),
    sortBy: oneOf(params.get("sort"), SORT_OPTIONS, "rating"),
  };
  const touched =
    params.has("q") || params.has("category") || params.has("region") || params.has("sort");
  return touched ? next : null;
}

/**
 * Boring directory — a from-scratch, monochrome, fully-structured register.
 * No brand colour, no icons, no hover-lift. Companies are grouped by category
 * into a plain numbered ledger; each row reveals as it scrolls into view
 * (vertical motion only) and the layout never overflows horizontally.
 */
function BoringIndex({ companies }: { companies: readonly CompanySummary[] }) {
  const groups = useMemo(() => {
    const byCat = new Map<string, CompanySummary[]>();
    for (const c of companies) {
      const key = c.categories[0] ?? "other";
      if (!byCat.has(key)) byCat.set(key, []);
      byCat.get(key)!.push(c);
    }
    return categories
      .filter((cat) => byCat.has(cat.slug))
      .map((cat) => ({ cat, items: byCat.get(cat.slug)! }));
  }, [companies]);

  if (companies.length === 0) {
    return (
      <EmptyState
        title="No companies matched your criteria."
        description="Try a shorter search term, or clear the filters to see the full directory."
        action={
            <button
              onClick={() => {
                const ev = new CustomEvent("boring-clear-filters");
                window.dispatchEvent(ev);
              }}
              className="btn-ghost rounded-sm px-4 py-2 text-xs"
            >
              Clear all filters
            </button>
        }
      />
    );
  }

  return (
    <div className="space-y-10">
      {groups.map(({ cat, items }) => (
        <section key={cat.slug} aria-labelledby={`boring-cat-${cat.slug}`}>
          <h2
            id={`boring-cat-${cat.slug}`}
            className="flex items-baseline gap-2 pb-1 text-sm font-bold uppercase tracking-wider text-[var(--foreground)]"
          >
            <span><Highlight color="yellow" animate={false}>{categoryNames[cat.slug] ?? cat.name}</Highlight></span>
            <span className="font-normal text-[var(--muted-text)]">({items.length})</span>
          </h2>
          <ol className="mt-1">
            {items.map((c, i) => (
              <Reveal
                as="li"
                key={c.slug}
                y={12}
                className="border-b border-[var(--border)]"
              >
                <div className="flex items-baseline gap-3 py-2.5">
                  <span
                    aria-hidden="true"
                    className="w-6 shrink-0 text-right font-mono text-xs tabular-nums text-[var(--muted-text)]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={`/companies/${c.slug}`}
                    className="text-[var(--foreground)] underline-offset-2 hover:underline focus-visible:underline"
                  >
                    {c.name}
                  </Link>
                  <span className="ml-auto font-mono text-xs tabular-nums text-[var(--muted-text)]">
                    {c.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 pb-2.5 pl-9 font-mono text-[11px] leading-relaxed text-[var(--muted-text)]">
                  <span>Founded {c.founded}</span>
                  <span>{formatHeadquartersCity(c.headquarters)}</span>
                  <span className="max-w-full truncate">{c.pricingModel}</span>
                  <span>{formatValuationShort(c.valuation)}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

/** A single labelled spec field used inside the editorial directory row. */
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted-text)]">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-xs font-medium text-[var(--foreground)]">{value}</dd>
    </div>
  );
}

/**
 * Standard directory row — an editorial "ledger" entry rather than a
 * floating card. No rules, no side-bars: breathing room separates
 * entries, the company name sweeps a marker on hover, and a quiet
 * spec table carries the facts. Reveals on scroll; hover only sweeps
 * the name — no lift, no shadow.
 */
function DirectoryRow({
  c,
  index,
  bookmarked,
  onToggle,
}: {
  c: CompanySummary;
  index: number;
  bookmarked: boolean;
  onToggle: (e: React.MouseEvent, c: CompanySummary) => void;
}) {
  return (
      <Reveal
        as="article"
        y={14}
        className="box-card group relative p-4 sm:p-5"
      >
      {/* Whole-row navigation link — sibling of the bookmark button. */}
      <Link
        href={`/companies/${c.slug}`}
        aria-label={`View ${c.name}`}
        className="absolute inset-0 z-10 rounded-md focus-visible:outline-none focus-visible:ring-[var(--ring)]"
      >
        <span className="sr-only">View {c.name}</span>
      </Link>

      <div className="flex items-start gap-3 sm:gap-4">
        <span
          aria-hidden="true"
          className="hidden w-7 shrink-0 pt-1 text-right font-mono text-xs tabular-nums text-[var(--muted-dim)] sm:block"
        >
          {String(index).padStart(2, "0")}
        </span>

        <span className="mt-0.5 block">
          <CompanyLogo slug={c.slug} name={c.name} size={40} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h2 className="font-serif text-lg font-bold leading-tight text-[var(--foreground)]">
              <span className="hl-link">{c.name}</span>
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted-text)]">
              {categoryNames[c.categories[0]] ?? c.categories[0]}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-[var(--muted-text)]">{c.tagline}</p>

          <dl className="mt-2.5 grid grid-cols-2 gap-x-5 gap-y-1.5 sm:grid-cols-4">
            <Spec label="Founded" value={String(c.founded)} />
            <Spec label="HQ" value={formatHeadquartersCity(c.headquarters)} />
            <Spec label="Pricing" value={c.pricingModel} />
            <Spec label="Valuation" value={formatValuationShort(c.valuation)} />
          </dl>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between gap-3 pl-2">
          <button
            onClick={(e) => onToggle(e, c)}
            className={`pointer-events-auto relative z-20 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
              bookmarked
                ? "text-[var(--foreground)]"
                : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
            }`}
            aria-label={bookmarked ? `${c.name} bookmarked` : `Bookmark ${c.name}`}
          >
            {bookmarked ? "★" : "☆"}
          </button>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted-text)]">
              Rating
            </p>
            <p className="font-mono text-sm font-bold text-[var(--foreground)]">
              ★ {c.rating.toFixed(1)}
            </p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--accent-ink)]">
              {editorialVerdict(c.rating)}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * Editor's spotlight — an asymmetric composition, not a uniform card row:
 * the highest-rated provider gets a large "lead" card with its documented
 * strength/weakness and why it leads; the runners-up sit beside it as
 * compact entries. Deliberate imbalance reads as hand-set, not templated.
 */
function Spotlight({
  companies,
  isBookmarked,
  onToggle,
}: {
  companies: readonly CompanySummary[];
  isBookmarked: (slug: string) => boolean;
  onToggle: (e: React.MouseEvent, c: CompanySummary) => void;
}) {
  const [lead, ...runners] = companies;
  if (!lead) return null;

  return (
    <section aria-label="Editor's spotlight" className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-serif text-xl font-bold text-[var(--foreground)]">
          Editor&rsquo;s <Highlight color="green">spotlight</Highlight>
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted-text)]">
          Our three highest-rated
        </span>
      </div>

      <div className="mt-5 grid gap-8 lg:grid-cols-5">
        {/* Lead entry — 3-of-5 columns, the visual anchor. The
            hand-marked name still carries the emphasis. */}
        <Reveal
          as="article"
          className="box-card group relative flex flex-col justify-between p-5 lg:col-span-3"
        >
          <Link
            href={`/companies/${lead.slug}`}
            aria-label={`View ${lead.name}`}
            className="absolute inset-0 z-10 rounded-md focus-visible:outline-none focus-visible:ring-[var(--ring)]"
          >
            <span className="sr-only">View {lead.name}</span>
          </Link>
          <div>
            <div className="flex items-start justify-between gap-4 pr-12">
              <div className="flex items-center gap-4">
                <CompanyLogo slug={lead.slug} name={lead.name} size={56} />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent-ink)]">
                    {editorialVerdict(lead.rating)}
                  </p>
                  <h3 className="mt-0.5 font-serif text-2xl font-bold leading-tight text-[var(--foreground)]">
                    <Highlight color="yellow">{lead.name}</Highlight>
                  </h3>
                </div>
              </div>
              <span className="shrink-0 font-mono text-sm font-bold text-[var(--foreground)]">
                ★ {lead.rating.toFixed(1)}
              </span>
            </div>
            <p className="mt-4 max-w-md font-serif text-base leading-relaxed text-[var(--muted)]">
              {lead.tagline}
            </p>
            {lead.primaryStrength && (
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-success-text">
                    Where it wins
                  </dt>
                  <dd className="mt-1 text-xs leading-relaxed text-[var(--foreground)]">
                    {lead.primaryStrength}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted-text)]">
                    Where it doesn&rsquo;t
                  </dt>
                  <dd className="mt-1 text-xs leading-relaxed text-[var(--muted-text)]">
                    {lead.primaryWeakness ?? "Not documented yet."}
                  </dd>
                </div>
              </dl>
            )}
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">
            <span className="hl-link">Read the full profile &rarr;</span>
          </p>
          <button
            onClick={(e) => onToggle(e, lead)}
            className={`pointer-events-auto absolute right-3 top-3 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
              isBookmarked(lead.slug)
                ? "text-[var(--foreground)]"
                : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
            }`}
            aria-label={isBookmarked(lead.slug) ? `${lead.name} bookmarked` : `Bookmark ${lead.name}`}
          >
            {isBookmarked(lead.slug) ? "★" : "☆"}
          </button>
        </Reveal>

        {/* Runners-up — compact boxed entries beside the lead. */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          {runners.map((c) => (
            <Reveal
              as="article"
              key={c.slug}
              delay={0.08}
              className="box-card group relative flex flex-1 flex-col justify-between p-4"
            >
              <Link
                href={`/companies/${c.slug}`}
                aria-label={`View ${c.name}`}
                className="absolute inset-0 z-10 rounded-md focus-visible:outline-none focus-visible:ring-[var(--ring)]"
              >
                <span className="sr-only">View {c.name}</span>
              </Link>
              <div className="flex items-center justify-between gap-3 pr-10">
                <div className="flex min-w-0 items-center gap-3">
                  <CompanyLogo slug={c.slug} name={c.name} size={36} />
                  <div className="min-w-0">
                    <h3 className="truncate font-serif text-base font-bold leading-tight text-[var(--foreground)]">
                      <span className="hl-link">{c.name}</span>
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent-ink)]">
                      {editorialVerdict(c.rating)}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs font-bold text-[var(--foreground)]">
                  ★ {c.rating.toFixed(1)}
                </span>
              </div>
              {c.primaryStrength && (
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">
                  <span className="font-semibold text-[var(--foreground)]">Wins:</span>{" "}
                  {c.primaryStrength}
                </p>
              )}
              <button
                onClick={(e) => onToggle(e, c)}
                className={`pointer-events-auto absolute right-2 top-2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
                  isBookmarked(c.slug)
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
                }`}
                aria-label={isBookmarked(c.slug) ? `${c.name} bookmarked` : `Bookmark ${c.name}`}
              >
                {isBookmarked(c.slug) ? "★" : "☆"}
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Group companies by their primary (first) category, preserving the
 *  canonical category order so the directory reads like a curated index. */
function groupByPrimaryCategory(list: readonly CompanySummary[]) {
  const byCat = new Map<string, CompanySummary[]>();
  for (const c of list) {
    const key = c.categories[0] ?? "other";
    if (!byCat.has(key)) byCat.set(key, []);
    byCat.get(key)!.push(c);
  }
  return categories
    .filter((cat) => byCat.has(cat.slug))
    .map((cat) => ({ cat, items: byCat.get(cat.slug)! }));
}

/** A short editorial verdict — a human opinion, not a number — derived from
 *  our own rating. Opinionated on purpose: a safe word like "Recommended"
 *  is what a template would say. */
function editorialVerdict(rating: number): string {
  if (rating >= 4.5) return "Our favourite";
  if (rating >= 4.2) return "Strong pick";
  if (rating >= 4.0) return "Good, with caveats";
  return "Read the fine print";
}

export function CompaniesClient() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [region, setRegion] = useState<RegionOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("rating");

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { showToast } = useToast();
  const { uiMode } = useUiMode();

  // URL persistence: restore ?q/category/region/sort once after mount, then
  // mirror every change back into the query string.
  const hydratedRef = useRef(false);
  useEffect(() => {
    const id = window.setTimeout(() => {
      const filters = readFiltersFromParams(new URLSearchParams(window.location.search));
      if (filters) {
        setSearch(filters.search);
        setSelectedCategory(filters.selectedCategory);
        setRegion(filters.region);
        setSortBy(filters.sortBy);
      }
      hydratedRef.current = true;
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    writeUrlFilters({
      q: search,
      category: selectedCategory === "all" ? null : selectedCategory,
      region: region === "all" ? null : region,
      sort: sortBy === "rating" ? null : sortBy,
    });
  }, [search, selectedCategory, region, sortBy]);

  // Let the boring directory's "clear all filters" button reset this view.
  useEffect(() => {
    const onClear = () => {
      setSearch("");
      setSelectedCategory("all");
      setRegion("all");
    };
    window.addEventListener("boring-clear-filters", onClear);
    return () => window.removeEventListener("boring-clear-filters", onClear);
  }, []);

  // Precompute per-category company counts once.
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of companySummaries) {
      for (const cat of c.categories as readonly string[]) {
        counts.set(cat, (counts.get(cat) ?? 0) + 1);
      }
    }
    return counts;
  }, []);

  // Only categories that actually contain a provider are offered as filters.
  // The results list below is grouped by category and never renders an empty
  // group, so a zero-count pill is a dead control that resolves to a blank
  // page. Keeping them out also stops the wrapped pill row ending on a lonely
  // orphan chip.
  const populatedCategories = useMemo(
    () => categories.filter((cat) => (categoryCounts.get(cat.slug) ?? 0) > 0),
    [categoryCounts],
  );

  const filteredCompanies = useMemo(() => {
    const companiesWithVal = companySummaries.map((c) => ({
      ...c,
      valuationNum: getValuationAmountUsd(c),
    }));

    return companiesWithVal
      .filter((c) => {
        const matchesCategory =
          selectedCategory === "all" || (c.categories as readonly string[]).includes(selectedCategory);
        const matchesRegion =
          region === "all" || (region === "india" ? c.indiaFocus === true : c.indiaFocus !== true);
        const query = search.trim();
        const matchesQuery = query === "" || fuzzyMatchAny([c.name, c.tagline, c.searchTerms], query);
        return matchesCategory && matchesRegion && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "valuation") {
          if (a.valuationNum === null) return 1;
          if (b.valuationNum === null) return -1;
          return b.valuationNum - a.valuationNum;
        }
        if (sortBy === "founded") return b.founded - a.founded;
        return 0;
      });
  }, [search, selectedCategory, region, sortBy]);

  const indiaCount = useMemo(
    () => companySummaries.filter((c) => c.indiaFocus === true).length,
    [],
  );

  // Editor's spotlight: the three highest-rated providers, shown only on the
  // unfiltered directory so it reads as a human curation rather than a filter
  // artefact. Those three are then removed from the main list to avoid dupes.
  const showSpotlight =
    search === "" && selectedCategory === "all" && region === "all";
  const spotlight = useMemo(() => {
    if (!showSpotlight) return [];
    return [...companySummaries].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [showSpotlight]);
  const spotlightSlugs = useMemo(
    () => new Set(spotlight.map((s) => s.slug)),
    [spotlight],
  );
  const listedCompanies = useMemo(
    () =>
      showSpotlight
        ? filteredCompanies.filter((c) => !spotlightSlugs.has(c.slug))
        : filteredCompanies,
    [filteredCompanies, showSpotlight, spotlightSlugs],
  );
  const groupedCompanies = useMemo(
    () => groupByPrimaryCategory(listedCompanies),
    [listedCompanies],
  );

  const handleBookmarkToggle = useCallback((e: React.MouseEvent, c: CompanySummary) => {
    e.preventDefault();
    e.stopPropagation();
    const bookmarked = isBookmarked(c.slug);
    toggleBookmark(c.slug);
    showToast(
      bookmarked ? `Removed ${c.name} from saved items` : `Saved ${c.name} to bookmarks!`,
      bookmarked ? "info" : "success",
    );
  }, [isBookmarked, toggleBookmark, showToast]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Companies", href: "/companies" },
        ]}
      />
      <SectionHeading
        headingLevel={1}
        eyebrow="Directory Index"
        title="FinTech Companies Directory"
        description="Search, filter, and compare top financial technology companies worldwide."
      />

      {/* Control Bar: Search, Filters, Sorting */}
      <div className="mt-10 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
              placeholder="Search companies by name, product, founder..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search companies"
              className="w-full surface rounded-md py-2.5 pl-10 pr-12 text-sm outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex rounded-sm p-0.5"
              role="group"
              aria-label="Filter by region"
            >
              {(
                [
                  ["all", `All ${companySummaries.length}`],
                  ["india", `India ${indiaCount}`],
                  ["global", `Global ${companySummaries.length - indiaCount}`],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setRegion(value)}
                  aria-pressed={region === value}
                  className={`rounded-sm px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
                    region === value
                      ? "bg-[var(--foreground)] text-[var(--background)]"
                      : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted-text)] hidden sm:inline">Sort:</span>
              <select
                aria-label="Sort companies"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-sm bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--foreground)] outline-none"
              >
                <option value="rating">Rating (Highest)</option>
                <option value="valuation">Valuation (Highest)</option>
                <option value="name">Name (A-Z)</option>
                <option value="founded">Founded (Newest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category filters. The row is labelled and separated by
            breathing room rather than a rule: a small-caps label reads
            as a deliberate filter block, and it states how many
            categories are actually offered. */}
        <div className="pt-4">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--muted-text)]">
              Filter by category
            </span>
            {/* --muted, not --muted-dim: #a29c90 is only ~2.6:1 on the cream
                surface and fails WCAG AA at this size. --muted-dim is reserved
                for aria-hidden decorative numerals, which axe skips. */}
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
              {populatedCategories.length} categories
            </span>
          </div>
          <div className="js-category-pills -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-2 [mask-image:linear-gradient(to_right,#000_calc(100%-2.5rem),transparent)] md:mx-0 md:flex-wrap md:overflow-x-visible md:px-0 md:[mask-image:none]">
          <button
            onClick={() => setSelectedCategory("all")}
            aria-pressed={selectedCategory === "all"}
            className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
              selectedCategory === "all"
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
            }`}
          >
            All Companies ({companySummaries.length})
          </button>
          {populatedCategories.map((cat) => {
            const count = categoryCounts.get(cat.slug) ?? 0;
            const active = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                aria-pressed={active}
                className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
                  active
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {/* Results Header Counter */}
      <div className="mt-6 flex items-center justify-between gap-3 pb-1 text-xs font-mono text-[var(--muted-text)]">
        <span aria-live="polite">
          Showing <span className="font-bold text-[var(--foreground)]">{filteredCompanies.length}</span> of{" "}
          {companySummaries.length} companies
        </span>
        <span className="flex items-center gap-4">
          {search && <span>Filtered by &ldquo;{search}&rdquo;</span>}
          {filteredCompanies.length > 0 && (
            <button
              onClick={() => exportCompaniesCsv(filteredCompanies)}
              className="shrink-0 font-semibold underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded"
            >
              Export CSV
            </button>
          )}
        </span>
      </div>

      {/* Company results */}
      <div id="company-results" className="mt-8">
        {uiMode === "boring" ? (
          <BoringIndex companies={filteredCompanies} />
        ) : filteredCompanies.length === 0 ? (
          <EmptyState
            title="No companies matched your criteria."
            description="Try a shorter search term, or clear the filters to see the full directory."
            action={
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="btn-ghost rounded-sm px-4 py-2 text-xs"
              >
                Clear all filters
              </button>
            }
          />
        ) : (
          <>
            {/* Editorial lede — a human note, not marketing copy. */}
            <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-[var(--muted)]">
              A working index of every payment and fintech provider we cover —
              ranked by our own editorial rating, <Highlight color="green">never by ad spend</Highlight>. Open a name
              for the full, sourced profile.
            </p>

            {spotlight.length > 0 && (
              <Spotlight
                companies={spotlight}
                isBookmarked={isBookmarked}
                onToggle={handleBookmarkToggle}
              />
            )}

            <div className={spotlight.length > 0 ? "mt-14" : "mt-8"}>
              <div className="lg:flex lg:gap-10">
                {groupedCompanies.length > 1 && (
                  <aside className="hidden lg:block w-44 shrink-0">
                    <nav aria-label="Directory sections" className="sticky top-24">
                      <p className="eyebrow mb-3">Sections</p>
                      <ul>
                        {groupedCompanies.map(({ cat, items }) => (
                          <li key={cat.slug}>
                            <a
                              href={`#cat-${cat.slug}`}
                              className="block py-1.5 pl-3 text-sm text-[var(--muted-text)] transition-colors hover:text-[var(--foreground)]"
                            >
                              <span className="hl-link">{categoryNames[cat.slug] ?? cat.name}</span>
                              <span className="font-mono text-[10px]">
                                {" "}
                                {items.length}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </aside>
                )}
                <div className="min-w-0 flex-1">
                  {groupedCompanies.map(({ cat, items }) => (
                    <section
                      key={cat.slug}
                      aria-labelledby={`cat-${cat.slug}`}
                      className="mb-10"
                    >
                      <h2
                        id={`cat-${cat.slug}`}
                        className="flex items-baseline gap-2 pb-2"
                      >
                        <span className="font-serif text-base font-bold text-[var(--foreground)]">
                          {categoryNames[cat.slug] ?? cat.name}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted-text)]">
                          {items.length}
                        </span>
                      </h2>
                      <div className="mt-1 flex flex-col gap-3">
                        {items.map((c, i) => (
                          <DirectoryRow
                            key={c.slug}
                            c={c}
                            index={i + 1}
                            bookmarked={isBookmarked(c.slug)}
                            onToggle={handleBookmarkToggle}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
