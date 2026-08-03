"use client";

import { useState, useMemo, useCallback, type CSSProperties } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { companies, categories, type Company, type Category } from "@/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { CompanyLogo } from "@/components/ui/company-logo";
import { useBookmarks } from "@/lib/bookmarks-context";
import { useToast } from "@/lib/toast-context";
import { formatValuationShort, formatHeadquartersCity } from "@/lib/format-company";
import { animationPresets as animation } from "@/lib/animation";

type SortOption = "name" | "rating" | "valuation" | "founded";

export function CompaniesClient() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { showToast } = useToast();

  // Precompute per-category company counts once so we don't filter the full
  // companies array per category pill on every render.
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of companies) {
      for (const cat of c.categories as readonly string[]) {
        counts.set(cat, (counts.get(cat) ?? 0) + 1);
      }
    }
    return counts;
  }, []);

  const parseValuation = (valStr: string) => {
    const match = valStr.match(/\$(\d+(\.\d+)?)[B|M]/);
    if (!match) return 0;
    const num = parseFloat(match[1]);
    return valStr.includes("B") ? num * 1000 : num;
  };

  // Create a map for O(1) category lookup by slug instead of using .find()
  const categoriesMap = useMemo(() => {
    const map = new Map<string, Category>();
    for (const category of categories) {
      map.set(category.slug, category);
    }
    return map;
  }, []);

  const filteredCompanies = useMemo(() => {
    // Precompute valuation numbers once to avoid calling parseValuation twice per comparison in sort
    const companiesWithVal = companies.map(c => ({
      ...c,
      valuationNum: parseValuation(c.valuation)
    }));

    // Filter and sort using precomputed values
    return companiesWithVal
      .filter((c) => {
        const matchesCategory =
          selectedCategory === "all" || (c.categories as readonly string[]).includes(selectedCategory);

        const query = search.trim().toLowerCase();
        const matchesQuery =
          query === "" ||
          c.name.toLowerCase().includes(query) ||
          c.tagline.toLowerCase().includes(query) ||
          c.oneLiner.toLowerCase().includes(query) ||
          c.founders.some((f) => f.toLowerCase().includes(query));

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "rating") return b.userReviews.rating - a.userReviews.rating;
        if (sortBy === "valuation") return b.valuationNum - a.valuationNum;
        if (sortBy === "founded") return b.founded - a.founded;
        return 0;
      });
  }, [search, selectedCategory, sortBy]);

  const handleBookmarkToggle = useCallback((e: React.MouseEvent, c: Company) => {
    // The bookmark button sits inside a card-wrapping <Link>. Without
    // stopping propagation the click bubbles up and navigates to the company
    // page, so the user clicks "Save" and unexpectedly leaves the directory.
    e.preventDefault();
    e.stopPropagation();
    const bookmarked = isBookmarked(c.slug);
    toggleBookmark(c.slug);
    showToast(
      bookmarked ? `Removed ${c.name} from saved items` : `Saved ${c.name} to bookmarks!`,
      bookmarked ? "info" : "success"
    );
  }, [isBookmarked, toggleBookmark, showToast]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <SectionHeading
        headingLevel={1}
        eyebrow="01 · Directory Index"
        title="FinTech Companies Directory"
        description="Search, filter, and compare top financial technology companies worldwide."
      />

      {/* Control Bar: Search, Filters, Sorting & View toggle */}
      <div className="mt-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-text)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search companies by name, product, founder..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search companies"
              className="w-full surface rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort & View options */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted-text)] hidden sm:inline">Sort:</span>
              <select
                aria-label="Sort companies"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-2 text-xs font-medium text-[var(--foreground)] outline-none transition-colors hover:border-[var(--border-strong)]"
              >
                <option value="rating">Rating (Highest)</option>
                <option value="valuation">Valuation (Highest)</option>
                <option value="name">Name (A-Z)</option>
                <option value="founded">Founded (Newest)</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex rounded-lg border border-[var(--border-color)] p-0.5 bg-[var(--subtle-bg)]/50 relative">
              {viewMode === "grid" && (
                <motion.span
                  layoutId="view-toggle"
                  className="absolute inset-y-0.5 left-0.5 right-1/2 rounded bg-[var(--background)] shadow-xs"
                  transition={animation.transition.springDefault}
                />
              )}
              {viewMode === "list" && (
                <motion.span
                  layoutId="view-toggle"
                  className="absolute inset-y-0.5 left-1/2 right-0.5 rounded bg-[var(--background)] shadow-xs"
                  transition={animation.transition.springDefault}
                />
              )}
              <button
                onClick={() => setViewMode("grid")}
                className={`relative z-10 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  viewMode === "grid" ? "text-[var(--foreground)]" : "text-[var(--muted-text)] hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)]"
                } focus-visible:outline-none focus-visible:ring-[var(--ring)]`}
                aria-label="Grid view"
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`relative z-10 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  viewMode === "list" ? "text-[var(--foreground)]" : "text-[var(--muted-text)] hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)]"
                } focus-visible:outline-none focus-visible:ring-[var(--ring)]`}
                aria-label="List view"
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
              selectedCategory === "all"
                ? "text-[var(--background)]"
                : "border border-[var(--border-color)] text-[var(--muted-text)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)]"
            }`}
          >
            {selectedCategory === "all" && (
              <motion.span
                layoutId="cat-pill"
                className="absolute inset-0 rounded-full bg-[var(--foreground)] -z-10"
                transition={animation.transition.springBouncier}
              />
            )}
            All Companies ({companies.length})
          </button>
          {categories.map((cat) => {
            const count = categoryCounts.get(cat.slug) ?? 0;
            const active = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
                  active
                    ? "text-[var(--background)]"
                    : "border border-[var(--border-color)] text-[var(--muted-text)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-full bg-[var(--foreground)] -z-10"
                    transition={animation.transition.springBouncier}
                  />
                )}
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Counter */}
      <div className="mt-6 flex items-center justify-between text-xs text-[var(--muted-text)] font-mono border-b border-[var(--border-color)] pb-3">
        <span aria-live="polite">Showing <span className="text-[var(--foreground)] font-bold">{filteredCompanies.length}</span> of {companies.length} companies</span>
        {search && <span>Filtered by &ldquo;{search}&rdquo;</span>}
      </div>

      {/* Company Cards Grid / List */}
      <div className="mt-8">
        {filteredCompanies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-color)] p-12 text-center text-sm text-[var(--muted-text)]">
            No companies matched your criteria. Try adjusting your search query or category filter.
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredCompanies.map((c, i) => {
                const bookmarked = isBookmarked(c.slug);

                return (
                  <motion.div
                    key={c.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3), ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={`/companies/${c.slug}`}
                      className="group relative flex flex-col justify-between rounded-xl border border-[var(--border-color)] p-5 transition-all duration-300 card-glow h-full"
                      style={{ ["--accent"]: c.accent } as CSSProperties}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="group-hover:scale-105 transition-transform duration-300">
                              <CompanyLogo slug={c.slug} size={40} />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                                {c.name}
                              </h3>
                              <p className="text-xs text-[var(--muted-text)] font-mono">
                                {c.founded} · {formatHeadquartersCity(c.headquarters)}
                              </p>
                            </div>
                          </div>

                          {/* Bookmark Button */}
                          <button
                            onClick={(e) => handleBookmarkToggle(e, c)}
                            className={`rounded-full p-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
                              bookmarked ? "text-warning-text bg-warning/10" : "text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--subtle-bg)] focus-visible:bg-[var(--subtle-bg)] focus-visible:text-[var(--foreground)]"
                            }`}
                            title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
                            aria-label={bookmarked ? `${c.name} bookmarked` : `Bookmark ${c.name}`}
                          >
                            {bookmarked ? "★" : "☆"}
                          </button>
                        </div>

                        <p className="mt-4 text-xs leading-relaxed text-[var(--muted-text)] line-clamp-2">
                          {c.tagline}
                        </p>
                      </div>

                      <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-[var(--border-color)]">
                          <span className="rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20 px-2 py-0.5 font-bold text-success-text">
                            ★ {c.userReviews.rating}
                          </span>
                          <span className="text-[var(--muted-text)]">{formatValuationShort(c.valuation)}</span>
                        </div>

                        {/* Animated rating meter — fills from 0 → rating on view, per-company accent */}
                        <div className="flex items-center gap-2">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--border-color)]">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(c.userReviews.rating / 5) * 100}%` }}
                              viewport={{ once: true, margin: "-40px" }}
                              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: Math.min(i * 0.02, 0.3) }}
                              className="h-full rounded-full"
                              style={{ background: `linear-gradient(to right, ${c.accent}, ${c.accent}cc)` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-[var(--muted-text)]">/5</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {c.categories.map((cs) => {
                            const cat = categoriesMap.get(cs);
                            return cat ? (
                              <span
                                key={cs}
                                className="rounded-full border border-[var(--border-color)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--muted-text)] group-hover:border-[var(--accent)]/30 transition-colors"
                              >
                                {cat.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            <AnimatePresence>
              {filteredCompanies.map((c, i) => {
                const bookmarked = isBookmarked(c.slug);

                return (
                  <motion.div
                    key={c.slug}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.22, delay: Math.min(i * 0.015, 0.25), ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={`/companies/${c.slug}`}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[var(--border-color)] p-4 transition-all duration-300 hover:border-[var(--accent)]/40 hover:bg-[var(--subtle-bg)]/50"
                      style={{ ["--accent"]: c.accent } as CSSProperties}
                    >
                      <div className="flex items-center gap-4">
                        <div className="group-hover:scale-105 transition-transform duration-300">
                          <CompanyLogo slug={c.slug} size={40} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{c.name}</h3>
                            <span className="rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20 px-2 py-0.5 text-[10px] font-mono font-bold text-success-text">
                              ★ {c.userReviews.rating}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--muted-text)]">{c.tagline}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs text-[var(--muted-text)]">
                        <div className="text-right hidden md:block">
                          <div className="text-[var(--foreground)] font-bold">{formatValuationShort(c.valuation)}</div>
                          <div>{c.employees} emp</div>
                        </div>

                        <button
                          onClick={(e) => handleBookmarkToggle(e, c)}
                          className={`rounded-full p-2 text-base transition-all focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
                            bookmarked ? "text-warning-text bg-warning/10" : "text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--subtle-bg)] focus-visible:bg-[var(--subtle-bg)] focus-visible:text-[var(--foreground)]"
                          }`}
                          aria-label={bookmarked ? `${c.name} bookmarked` : `Bookmark ${c.name}`}
                        >
                          {bookmarked ? "★" : "☆"}
                        </button>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
