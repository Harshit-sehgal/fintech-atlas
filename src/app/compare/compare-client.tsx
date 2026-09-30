"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  companySummaries,
  type CompanySummary,
} from "@/generated/company-summaries";
import { CompanyLogo } from "@/components/ui/company-logo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { IconLink } from "@/components/ui/icons";
import { useToast } from "@/lib/toast-context";
import { animationPresets as animation } from "@/lib/animation";
import { DEFAULT_COMPARE_SLUGS, parseCompareSlugs, writeLastCompareSlugs } from "@/lib/compare";
import { fuzzyRank } from "@/lib/fuzzy";
import {
  COMPARE_ROWS,
  keyDifferences,
  rowsByGroup,
  verificationNote,
  verdictStatements,
  visibleRows,
} from "@/lib/compare-view";
import { trackEvent } from "@/lib/analytics";

import { PRESETS, SCENARIOS } from "@/data/compare-presets";
import { categories } from "@/data/categories";
import { PartnerCta } from "@/components/ui/partner-cta";

const SELECTOR_SEARCH_LABEL = "Search companies to compare";

function CompareContent() {
  const router = useRouter();
  const { showToast } = useToast();

  // The selection mirrors the URL query string (?companies=stripe,adyen), but it
  // is tracked as local state instead of `useSearchParams()`. Reading search
  // params forces Next.js to render this page inside a Suspense boundary, so the
  // static HTML would contain only the fallback box and hydration would swap in
  // the full page — a large layout shift (CLS ~0.26 in Lighthouse) plus a late
  // LCP. Baking the default page into the static HTML eliminates both.
  //
  // We distinguish three URL shapes:
  //   - no params at all       → first visit, fall back to the Stripe vs Adyen default.
  //     This is the build-time state, so the static export contains the real page.
  //   - `?companies=` (empty)   → user explicitly cleared; show the empty state
  //   - `?companies=stripe,adyen` → explicit selection
  //
  // Every slug is validated against the company list by parseCompareSlugs, so no
  // untrusted query string can surface an unknown slug in the render layer.
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => [...DEFAULT_COMPARE_SLUGS]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [showContext, setShowContext] = useState(false);
  const [selectorQuery, setSelectorQuery] = useState("");

  // Reconcile once with the real URL after mount. A no-op for a bare /compare
  // (keeps the pristine default), but restores a shared link's selection.
  // Deferred to a macrotask so the restore runs after paint and satisfies
  // react-hooks/set-state-in-effect (client-only URL hydrate) — same pattern
  // as the tool clients below.
  useEffect(() => {
    const parsed = parseCompareSlugs(new URLSearchParams(window.location.search), companySummaries);
    trackEvent("compare_view", {
      companies: parsed.length > 0 ? parsed.join(",") : DEFAULT_COMPARE_SLUGS.join(","),
    });
    const id = window.setTimeout(() => {
      setSelectedSlugs((prev) =>
        prev.length === parsed.length && prev.every((s, i) => s === parsed[i]) ? prev : parsed,
      );
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const updateUrl = (slugs: string[], scenarioId: string | null = null) => {
    setSelectedSlugs(slugs);
    setActiveScenarioId(scenarioId);
    writeLastCompareSlugs(slugs);
    if (slugs.length > 0) {
      router.replace(`/compare?companies=${slugs.join(",")}`, { scroll: false });
    } else {
      // Empty `companies=` lets getSlugs know this was an explicit clear, not a
      // bare-navigated /compare (which would fall back to the default selection).
      router.replace(`/compare?companies=`, { scroll: false });
    }
  };

  const applyScenario = (scenarioId: string) => {
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;
    updateUrl([...scenario.slugs], scenario.id);
  };

  const toggleSelect = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      updateUrl(selectedSlugs.filter((s) => s !== slug));
    } else {
      if (selectedSlugs.length >= 3) {
        showToast("You can compare up to 3 companies at a time", "info");
        return;
      }
      updateUrl([...selectedSlugs, slug]);
    }
  };

  // With only 42 companies, resolving the selected companies is cheap enough
  // to do on every render — avoids a useMemo whose deps tripped the compiler
  // (removed the previously "accepted" lint warning).
  const selectedCompanies: CompanySummary[] = selectedSlugs
    .map((s) => companySummaries.find((c) => (c.slug as string) === s))
    .filter((c): c is CompanySummary => c !== undefined);

  // Difference-first rendering (T106): agreeing decision rows are hidden once
  // two or more companies are selected.
  const decideRows = useMemo(
    () => visibleRows("decide", selectedCompanies),
    [selectedCompanies],
  );
  const verifyRows = rowsByGroup("verify");
  const contextRows = useMemo(
    () => visibleRows("context", selectedCompanies),
    [selectedCompanies],
  );
  const differences = keyDifferences(selectedCompanies);
  const verdicts = verdictStatements(selectedCompanies);

  const emphasizedRowIds = useMemo(() => {
    const scenario = SCENARIOS.find((s) => s.id === activeScenarioId);
    return new Set(scenario?.emphasize ?? []);
  }, [activeScenarioId]);

  // Selector ranking (T108): fuzzy over name + profile search terms. With an
  // empty query the natural catalog order is kept.
  const rankedCompanies = useMemo(
    () => fuzzyRankCompanies(selectorQuery),
    [selectorQuery],
  );

  // Group the ranked list by each company's first category so the picker reads
  // as a curated shelf rather than a flat 42-tile wall.
  const selectorGroups = useMemo(() => {
    return categories
      .map((cat) => ({
        cat,
        items: rankedCompanies.filter((c) => (c.categories as readonly string[])[0] === cat.slug),
      }))
      .filter((g) => g.items.length > 0);
  }, [rankedCompanies]);

  const shareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => showToast("Comparison link copied to clipboard!", "success"),
      () => showToast("Couldn't copy the link — clipboard access was blocked.", "error"),
    );
  };

  return (
    <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      <GridBackdrop fullBleed />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Compare", href: "/compare" },
        ]}
      />
      <SectionHeading
        headingLevel={1}
        eyebrow="Side-by-Side Analysis"
        title="Compare FinTech Companies"
        description="Pick the decision you are making, then adjust the line-up. Values have different dates and methodologies, so use this as an orientation tool rather than a like-for-like benchmark."
      />

      {/* Scenario router (T105) — the primary entry point */}
      <section aria-labelledby="scenario-router-heading" className="mt-10">
        <h2 id="scenario-router-heading" className="eyebrow !text-[var(--muted-text)] !tracking-widest">
          What are you deciding?
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {SCENARIOS.map((s) => {
            const active = s.id === activeScenarioId;
            return (
              <button
                key={s.id}
                onClick={() => applyScenario(s.id)}
                aria-pressed={active}
                className={`rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
                  active
                    ? "border-[var(--accent)] bg-[var(--accent-glow)]"
                    : "border-[var(--border-color)] surface hover:border-[var(--border-strong)]"
                }`}
              >
                <span className={`block text-sm font-bold ${active ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                  {s.question}
                </span>
                <span className="mt-1.5 block text-xs leading-relaxed text-[var(--muted-text)]">
                  {s.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Preset benchmarks — secondary quick-starts */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)] mr-2 font-mono">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => updateUrl([...p.slugs])}
            className="rounded-full border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3.5 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--subtle-bg)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Selector panel (T108): fuzzy search + category grouping */}
      <div className="mt-8 border-y border-[var(--border-color)] py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <span className="eyebrow !text-[var(--muted-text)] !tracking-widest">
            Select Companies to Compare ({selectedSlugs.length}/3)
          </span>
          <div className="flex items-center gap-3">
            <input
              type="search"
              value={selectorQuery}
              onChange={(e) => setSelectorQuery(e.target.value)}
              placeholder="Filter companies…"
              aria-label={SELECTOR_SEARCH_LABEL}
              className="w-full sm:w-56 rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-sm outline-none transition-colors placeholder:text-[var(--muted-text)] focus:border-[var(--accent)]"
            />
            {selectedSlugs.length > 0 && (
              <button
                onClick={() => updateUrl([])}
                className="shrink-0 text-xs text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>

        {/* Screen-reader announcements for selection + filter results */}
        <p aria-live="polite" className="sr-only">
          {selectedSlugs.length} of 3 companies selected.{" "}
          {selectorQuery ? `${rankedCompanies.length} companies match the filter.` : ""}
        </p>

        {selectorGroups.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--border-color)] p-6 text-center text-sm text-[var(--muted-text)]">
            No companies match &ldquo;{selectorQuery}&rdquo;.{" "}
            <button
              onClick={() => setSelectorQuery("")}
              className="text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded"
            >
              Clear the filter
            </button>
          </p>
        ) : (
          <div className="space-y-5">
            {selectorGroups.map(({ cat, items }) => (
              <div key={cat.slug}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)] font-mono">
                  {cat.name}
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((c) => {
                    const active = selectedSlugs.includes(c.slug);
                    return (
                      <motion.button
                        key={c.slug}
                        layout
                        onClick={() => toggleSelect(c.slug)}
                        whileTap={{ scale: 0.98 }}
                        aria-pressed={active}
                        style={{ ["--accent"]: c.accent } as CSSProperties}
                        className={`relative flex items-center justify-between rounded-lg border p-3 text-left transition-colors overflow-hidden ${
                          active
                            ? "border-[var(--accent)] bg-[var(--background)]"
                            : "border-[var(--border-color)] hover:border-[var(--border-strong)] text-[var(--muted-text)] hover:bg-[var(--background)]/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CompanyLogo slug={c.slug} name={c.name} size={28} />
                          <span className="text-xs truncate text-[var(--foreground)]">{c.name}</span>
                        </div>
                        {active && (
                          <span aria-hidden className="text-xs font-bold text-[var(--accent)]">
                            ✓
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comparison output */}
      <AnimatePresence mode="wait">
        {selectedCompanies.length > 0 ? (
          <motion.section
            key="table"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10"
          >
            {/* Key differences + verdict (T106/T107) — shown when comparing */}
            {differences.length > 0 && (
              <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card)] p-6">
                <h2 className="text-base font-bold tracking-tight text-[var(--foreground)]">Key differences</h2>
                <ul className="mt-3 space-y-2">
                  {differences.map((d) => (
                    <li key={d} className="flex gap-2 text-sm leading-relaxed text-[var(--foreground)]">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                {verdicts.length > 0 && (
                  <div className="mt-5 border-t border-[var(--border-color)] pt-4">
                    <h3 className="text-sm font-bold text-[var(--foreground)]">Where each option fits</h3>
                    <ul className="mt-2 space-y-2">
                      {verdicts.map((v) => (
                        <li key={v} className="text-sm leading-relaxed text-[var(--muted-text)]">
                          {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="mt-4 text-[11px] leading-relaxed text-[var(--muted-text)]">
                  These notes are derived from each profile&rsquo;s documented strengths and weaknesses — not a score, and not a recommendation to pick one provider outright.
                </p>
              </div>
            )}

            {/* Desktop table (T109: hidden below md, replaced by stacked cards) */}
            <div className="mt-6 hidden overflow-hidden border border-[var(--border-color)] md:block">
              {/* Header controls inside table */}
              <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-6 py-3 text-xs text-[var(--muted-text)]">
                <span>Orientation Matrix</span>
                <button
                  onClick={shareLink}
                  className="flex items-center gap-1.5 btn-ghost text-xs px-3 py-1"
                >
                  <IconLink size={13} />
                  <span>Share comparison link</span>
                </button>
              </div>

              <div>
                <table className="w-full text-sm">
                  <caption>Comparison of selected companies across decision factors, sources and background</caption>
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--subtle-bg)]/20">
                      <th scope="col" className="p-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-text)] w-1/4">
                        Dimension
                      </th>
                      <AnimatePresence initial={false}>
                        {selectedCompanies.map((c) => (
                          <motion.th
                            key={c.slug}
                            scope="col"
                            layout
                            initial={{ opacity: 0, x: -12, width: 0 }}
                            animate={{ opacity: 1, x: 0, width: "auto" }}
                            exit={{ opacity: 0, x: -12, width: 0 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            className="p-4 text-left min-w-[220px] overflow-hidden"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <CompanyLogo slug={c.slug} name={c.name} size={32} />
                                <div className="min-w-0">
                                  <div className="font-bold text-base text-[var(--foreground)] truncate">{c.name}</div>
                                  <div className="text-[11px] font-normal text-[var(--muted-text)] truncate">
                                    {c.categories.join(", ")}
                                  </div>
                                  <div className="mt-1.5">
                                    <PartnerCta
                                      slug={c.slug}
                                      placement="compare"
                                      label={`Visit ${c.name}`}
                                      variant="link"
                                      className="text-[11px]"
                                    />
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleSelect(c.slug)}
                                className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm text-[var(--muted-text)] hover:text-danger-text hover:bg-[var(--subtle-bg)] focus-visible:text-danger-text focus-visible:outline-none focus-visible:ring-[var(--ring)]"
                                title="Remove from comparison"
                                aria-label={`Remove ${c.name} from comparison`}
                              >
                                ✕
                              </button>
                            </div>
                          </motion.th>
                        ))}
                      </AnimatePresence>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {decideRows.map((row) => (
                      <ComparisonRow key={row.id} row={row} companies={selectedCompanies} emphasized={emphasizedRowIds.has(row.id)} />
                    ))}
                    {verifyRows.map((row) => (
                      <ComparisonRow key={row.id} row={row} companies={selectedCompanies} emphasized={false} />
                    ))}
                    <tr>
                      <th scope="row" className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--muted-text)]">
                        Full Profile Link
                      </th>
                      <AnimatePresence initial={false}>
                        {selectedCompanies.map((c) => (
                          <motion.td
                            key={c.slug}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={animation.transition.layoutFast}
                            className="p-4 text-sm"
                          >
                            <Link
                              href={`/companies/${c.slug}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                            >
                              View {c.name} page →
                            </Link>
                          </motion.td>
                        ))}
                      </AnimatePresence>
                    </tr>
                  </tbody>
                  {/* Context band (T102) — identity facts, collapsed by default */}
                  <tbody>
                    <tr className="border-t border-[var(--border-color)] bg-[var(--subtle-bg)]/30">
                      <td colSpan={selectedCompanies.length + 1} className="px-4 py-2">
                        <button
                          onClick={() => setShowContext((v) => !v)}
                          aria-expanded={showContext}
                          className="mx-auto flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-text)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded px-2 py-1.5"
                        >
                          <span aria-hidden>{showContext ? "−" : "+"}</span>
                          {showContext ? "Hide company background" : "Show company background (founding, size, valuation)"}
                        </button>
                      </td>
                    </tr>
                    {showContext &&
                      contextRows.map((row) => (
                        <ComparisonRow key={row.id} row={row} companies={selectedCompanies} emphasized={false} muted />
                      ))}
                  </tbody>
                </table>
              </div>

              <p className="border-t border-[var(--border-color)] bg-[var(--subtle-bg)]/30 px-6 py-3 text-[11px] leading-relaxed text-[var(--muted-text)]">
                {verificationNote()}
              </p>
            </div>

            {/* Mobile stacked cards (T109): every cell readable without horizontal scroll */}
            <div className="md:hidden mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--subtle-bg)]/40 px-4 py-2.5 text-xs text-[var(--muted-text)]">
                <span>Orientation summary</span>
                <button
                  onClick={shareLink}
                  className="flex items-center gap-1.5 rounded px-2 py-1.5 font-semibold text-[var(--accent)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
                >
                  <IconLink size={13} />
                  Share link
                </button>
              </div>

              {differences.length > 0 && (
                <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card)] p-4 text-sm">
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Key differences</h2>
                  <ul className="mt-2 space-y-2">
                    {differences.map((d) => (
                      <li key={d} className="leading-relaxed text-[var(--muted-text)]">{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedCompanies.map((c) => (
                <div
                  key={c.slug}
                  style={{ ["--accent"]: c.accent } as CSSProperties}
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--background)]"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <CompanyLogo slug={c.slug} name={c.name} size={36} />
                      <div className="min-w-0">
                        <div className="truncate font-bold text-[var(--foreground)]">{c.name}</div>
                        <div className="truncate text-[11px] text-[var(--muted-text)]">{c.categories.join(", ")}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSelect(c.slug)}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm text-[var(--muted-text)] hover:text-danger-text focus-visible:text-danger-text focus-visible:outline-none focus-visible:ring-[var(--ring)]"
                      title="Remove from comparison"
                      aria-label={`Remove ${c.name} from comparison`}
                    >
                      ✕
                    </button>
                  </div>
                  <dl className="divide-y divide-[var(--border-color)] px-4">
                    {[...decideRows, ...verifyRows].map((row) => (
                      <div key={row.id} className="py-3">
                        <dt className={`text-[10px] uppercase tracking-wider font-mono ${emphasizedRowIds.has(row.id) ? "text-[var(--accent)]" : "text-[var(--muted-text)]"}`}>
                          {row.label}
                        </dt>
                        <dd className="mt-1 text-sm leading-relaxed text-[var(--foreground)]">{row.value(c)}</dd>
                      </div>
                    ))}
                  </dl>
                  <details className="border-t border-[var(--border-color)] px-4 py-3">
                    <summary className="cursor-pointer text-xs font-semibold text-[var(--muted-text)] marker:content-none hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded">
                      Company background
                    </summary>
                    <dl className="mt-2 divide-y divide-[var(--border-color)]">
                      {contextRows.map((row) => (
                        <div key={row.id} className="py-2.5">
                          <dt className="text-[10px] uppercase tracking-wider font-mono text-[var(--muted-text)]">{row.label}</dt>
                          <dd className="mt-0.5 text-sm leading-relaxed text-[var(--foreground)]">{row.value(c)}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                  <div className="border-t border-[var(--border-color)] p-4">
                    <PartnerCta
                      slug={c.slug}
                      placement="compare"
                      label={`Visit ${c.name}`}
                      variant="link"
                      className="text-xs mr-4"
                    />
                    <Link
                      href={`/companies/${c.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                    >
                      View full profile →
                    </Link>
                  </div>
                </div>
              ))}

              <p className="px-1 text-[11px] leading-relaxed text-[var(--muted-text)]">
                {verificationNote()}
              </p>
            </div>
          </motion.section>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 rounded-lg border border-dashed border-[var(--border-color)] p-12 text-center"
          >
            <p className="text-sm text-[var(--muted-text)]">
              Pick a scenario above, choose a preset benchmark, or select 1–3 companies below to start comparing.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * One desktop-table row. Decision-driver rows (from an active scenario) carry
 * a quiet accent marker instead of a loud highlight — emphasis without
 * turning the table into a scoreboard.
 */
function ComparisonRow({
  row,
  companies,
  emphasized,
  muted = false,
}: {
  row: (typeof COMPARE_ROWS)[number];
  companies: CompanySummary[];
  emphasized: boolean;
  muted?: boolean;
}) {
  return (
    <tr className="hover:bg-[var(--subtle-bg)]/30 transition-colors">
      <th scope="row" className="p-4 align-top">
        <span className={`block text-xs font-bold uppercase tracking-wider ${emphasized ? "text-[var(--accent)]" : "text-[var(--muted-text)]"} ${muted ? "!font-medium" : ""}`}>
          {emphasized && <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] align-middle" />}
          {row.label}
        </span>
        {emphasized && (
          <span className="mt-1 block text-[10px] font-mono normal-case tracking-normal text-[var(--muted-text)]">
            decision driver
          </span>
        )}
      </th>
      <AnimatePresence initial={false}>
        {companies.map((c) => (
          <motion.td
            key={c.slug}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={animation.transition.layoutFast}
            className={`p-4 align-top ${muted ? "text-xs" : "text-sm"} leading-relaxed ${emphasized ? "font-medium text-[var(--foreground)]" : ""}`}
          >
            {row.value(c)}
          </motion.td>
        ))}
      </AnimatePresence>
    </tr>
  );
}

/** Fuzzy ranking over the summaries; empty query keeps catalog order. */
function fuzzyRankCompanies(query: string): CompanySummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...companySummaries];
  return fuzzyRank(companySummaries, q, (c) => [c.name, c.searchTerms], 20);
}

export default function ComparePageClient() {
  return <CompareContent />;
}
