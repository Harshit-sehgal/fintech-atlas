"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookmarks } from "@/lib/bookmarks-context";
import { glossary } from "@/data/glossary";
import { companySummaries } from "@/generated/company-summaries";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { CompanyLogo } from "@/components/ui/company-logo";
import { IconStar } from "@/components/ui/icons";
import type { NoteSummary, ToolSessionSummary } from "@/lib/saved-hub";
import { formatValuationShort } from "@/lib/format-company";
import { Reveal } from "@/components/ui/reveal";
import { GridBackdrop } from "@/components/ui/grid-backdrop";

export default function BookmarksPageClient() {
  const { bookmarks, toggleBookmark, glossaryBookmarks, toggleGlossaryBookmark } = useBookmarks();

  // The notes / sessions / radar surfaces live in localStorage, which is only
  // available client-side. Enumerate once after mount using the established
  // deferred pattern so hydration matches the SSR output.
  //
  // saved-hub is dynamically imported because it pulls the calculator
  // catalogue ids (for per-calculator session labels); keeping it out of the
  // page's first-load chunk helps the compressed-JS budget gate.
  const [notes, setNotes] = useState<NoteSummary[]>([]);
  const [toolSessions, setToolSessions] = useState<ToolSessionSummary[]>([]);
  const [radarCounts, setRadarCounts] = useState({ watchlistCount: 0, savedSearchCount: 0 });

  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(() => {
      void import("@/lib/saved-hub").then(
        ({ enumerateNotes, enumerateToolSessions, radarSavedSummary }) => {
          if (cancelled) return;
          setNotes(enumerateNotes());
          setToolSessions(enumerateToolSessions());
          setRadarCounts(radarSavedSummary());
        },
      );
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  const savedCompanies = useMemo(
    () => companySummaries.filter((c) => bookmarks.includes(c.slug)),
    [bookmarks] // companySummaries is an imported constant
  );
  const savedGlossary = useMemo(
    () => glossary.filter((g) => glossaryBookmarks.includes(g.slug)),
    [glossaryBookmarks] // glossary is imported constant
  );

  const totalCount =
    savedCompanies.length +
    savedGlossary.length +
    notes.length +
    toolSessions.length +
    radarCounts.watchlistCount +
    radarCounts.savedSearchCount;

  return (
    <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Saved", href: "/bookmarks" },
        ]}
      />
      <SectionHeading
        headingLevel={1}
        eyebrow="Personal Knowledge Base"
        title="Saved items"
        description="Everything you have saved or started on this device — bookmarks, private notes, tool sessions and radar state — stored locally in your browser."
      />

      {totalCount === 0 ? (
        <Reveal>
          <div className="mt-10 rounded-lg border border-dashed border-[var(--border-color)] p-12 text-center">
            <IconStar size={28} className="mx-auto text-warning-text" />
            <h2 className="mt-4 text-lg font-bold text-[var(--foreground)]">Nothing saved yet</h2>
            <p className="mt-2 text-sm text-[var(--muted-text)] max-w-md mx-auto">
              Star any company profile or glossary term, take notes on a provider, or start a
              calculator — everything you save on this device collects here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/companies" className="btn-primary text-xs">
                Browse Companies →
              </Link>
              <Link href="/tools" className="btn-ghost text-xs">
                Open a Calculator
              </Link>
              <Link href="/glossary" className="btn-ghost text-xs">
                Browse Glossary
              </Link>
            </div>
          </div>
        </Reveal>
      ) : (
        <div className="mt-10 space-y-12">
          {/* Compare bar if 2+ companies saved */}
          <AnimatePresence>
            {savedCompanies.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between border-y border-[var(--accent)]/30 py-4 text-sm"
              >
                <div className="flex items-center gap-2 text-[var(--foreground)] font-medium">
                  <span>You have {savedCompanies.length} saved companies — ready to compare?</span>
                </div>
                <Link
                  href={`/compare?companies=${savedCompanies.map((c) => c.slug).join(",")}`}
                  className="btn-primary text-xs"
                >
                  Compare Saved →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Saved Companies */}
          {savedCompanies.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[var(--foreground)] border-b border-[var(--border-color)] pb-2">
                Saved Companies
                <span className="ml-2 text-xs font-mono text-[var(--muted-text)]">({savedCompanies.length})</span>
              </h2>

              <div className="grid border-t border-[var(--border-color)] sm:grid-cols-2 lg:grid-cols-3">
                {savedCompanies.map((c) => (
                  <div
                    key={c.slug}
                    style={{ ["--accent"]: c.accent } as CSSProperties}
                    className="group relative flex flex-col justify-between border-b border-[var(--border-color)] py-5 transition-colors sm:pr-6"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <CompanyLogo slug={c.slug} name={c.name} size={40} />
                          <div>
                            <h3 className="font-bold text-base text-[var(--foreground)]">{c.name}</h3>
                            <p className="text-xs text-[var(--muted-text)] font-mono">{formatValuationShort(c.valuation)}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleBookmark(c.slug)}
                          className="text-warning-text hover:opacity-75 focus-visible:opacity-75 text-lg p-1 rounded-full hover:bg-warning/10 focus-visible:bg-warning/10 transition-all focus-visible:outline-none focus-visible:ring-[var(--ring)]"
                          title="Remove bookmark"
                          aria-label={`Remove ${c.name} bookmark`}
                        >
                          ★
                        </button>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-[var(--muted-text)]">{c.tagline}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                      <Link
                        href={`/companies/${c.slug}`}
                        className="text-xs font-semibold text-[var(--accent)] hover:underline"
                      >
                        View Full Profile →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Saved Glossary Terms */}
          {savedGlossary.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[var(--foreground)] border-b border-[var(--border-color)] pb-2">
                Saved Glossary Terms
                <span className="ml-2 text-xs font-mono text-[var(--muted-text)]">({savedGlossary.length})</span>
              </h2>

              <div className="grid border-t border-[var(--border-color)] sm:grid-cols-2">
                {savedGlossary.map((g) => (
                  <div
                    key={g.slug}
                    className="flex items-start justify-between gap-4 border-b border-[var(--border-color)] py-4 transition-colors sm:pr-6"
                  >
                    <div>
                      <Link
                        href={`/glossary#${g.slug}`}
                        className="font-bold text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                      >
                        {g.term} {"full" in g && g.full && <span className="font-normal text-xs text-[var(--muted-text)]">({g.full})</span>}
                      </Link>
                      <p className="mt-1 text-xs text-[var(--muted-text)] leading-relaxed">{g.short}</p>
                    </div>

                    <button
                      onClick={() => toggleGlossaryBookmark(g.slug)}
                      className="text-warning-text hover:opacity-75 focus-visible:opacity-75 text-lg rounded-full hover:bg-warning/10 focus-visible:bg-warning/10 transition-all p-1 focus-visible:outline-none focus-visible:ring-[var(--ring)]"
                      title="Remove bookmark"
                      aria-label={`Remove ${g.term} bookmark`}
                    >
                      ★
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
          {/* Private notes (T112) — reviews_<slug> sets from profile pages */}
          {notes.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[var(--foreground)] border-b border-[var(--border-color)] pb-2">
                Private Notes
                <span className="ml-2 text-xs font-mono text-[var(--muted-text)]">({notes.length})</span>
              </h2>
              <p className="text-xs leading-relaxed text-[var(--muted-text)] max-w-2xl">
                Notes you wrote on provider profiles. They stay on this device and are never published.
              </p>
              <div className="grid border-t border-[var(--border-color)] sm:grid-cols-2">
                {notes.map((n) => {
                  const body = (
                    <>
                      <span className="text-sm font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                        {n.name}
                      </span>
                      <span className="mt-1 block font-mono text-sm text-[var(--muted-text)]">
                        {n.count} note{ n.count === 1 ? "" : "s" }
                        {n.latestDate ? ` · last ${n.latestDate}` : ""}
                      </span>
                    </>
                  );
                  return n.href ? (
                    <Link
                      key={n.slug}
                      href={n.href}
                      className="group flex items-start justify-between gap-4 border-b border-[var(--border-color)] py-4 transition-colors sm:pr-6"
                    >
                      {body}
                      <span aria-hidden className="shrink-0 text-xs text-[var(--muted-text)] transition-colors group-hover:text-[var(--accent)]">→</span>
                    </Link>
                  ) : (
                    <div
                      key={n.slug}
                      className="flex items-start justify-between gap-4 border-b border-dashed border-[var(--border-color)] py-4 sm:pr-6"
                    >
                      {body}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Restorable tool sessions (T112) */}
          {toolSessions.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[var(--foreground)] border-b border-[var(--border-color)] pb-2">
                Calculator Sessions
                <span className="ml-2 text-xs font-mono text-[var(--muted-text)]">({toolSessions.length})</span>
              </h2>
              <div className="grid border-t border-[var(--border-color)] sm:grid-cols-2">
                {toolSessions.map((s) => (
                  <Link
                    key={s.key}
                    href={s.href}
                    className="group flex items-center justify-between gap-4 border-b border-[var(--border-color)] py-4 transition-colors sm:pr-6"
                  >
                    <span className="text-sm font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                      {s.label}
                    </span>
                    <span aria-hidden className="shrink-0 text-xs text-[var(--muted-text)] transition-colors group-hover:text-[var(--accent)]">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Radar state (T112) — watchlist + named searches */}
          {(radarCounts.watchlistCount > 0 || radarCounts.savedSearchCount > 0) && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[var(--foreground)] border-b border-[var(--border-color)] pb-2">
                Radar
                <span className="ml-2 text-xs font-mono text-[var(--muted-text)]">
                  ({radarCounts.watchlistCount + radarCounts.savedSearchCount})
                </span>
              </h2>
              <div className="grid border-t border-[var(--border-color)] sm:grid-cols-2">
                {radarCounts.watchlistCount > 0 && (
                  <Link
                    href="/radar/watchlist"
                    className="group flex items-center justify-between gap-4 border-b border-[var(--border-color)] py-4 transition-colors sm:pr-6"
                  >
                    <span className="text-sm font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                      Watchlist
                    </span>
                    <span className="shrink-0 font-mono text-sm text-[var(--muted-text)]">
                      {radarCounts.watchlistCount} watched
                    </span>
                  </Link>
                )}
                {radarCounts.savedSearchCount > 0 && (
                  <Link
                    href="/radar"
                    className="group flex items-center justify-between gap-4 border-b border-[var(--border-color)] py-4 transition-colors sm:pl-6"
                  >
                    <span className="text-sm font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                      Saved Searches
                    </span>
                    <span className="shrink-0 font-mono text-sm text-[var(--muted-text)]">
                      {radarCounts.savedSearchCount} saved
                    </span>
                  </Link>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
