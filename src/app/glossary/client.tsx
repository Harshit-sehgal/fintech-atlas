"use client";

import { useState, useMemo, useEffect } from "react";
import { glossary, type GlossaryTerm } from "@/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { useBookmarks } from "@/lib/bookmarks-context";
import { useToast } from "@/lib/toast-context";

export function GlossaryClient() {
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");

  const { isGlossaryBookmarked, toggleGlossaryBookmark } = useBookmarks();
  const { showToast } = useToast();

  // Static exports can restore a hash before the client-rendered term cards
  // exist. Re-run the browser's anchor scroll after hydration so deep links
  // from bookmarks, search, and the command palette land on the right term.
  useEffect(() => {
    const slug = window.location.hash.slice(1);
    if (!slug) return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(slug)?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const letters = ["ALL", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

  const filteredTerms = useMemo(() => {
    return glossary.filter((g) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        g.term.toLowerCase().includes(query) ||
        g.short.toLowerCase().includes(query) ||
        g.long.toLowerCase().includes(query) ||
        ("full" in g && g.full && g.full.toLowerCase().includes(query));

      const firstChar = g.term.charAt(0).toUpperCase();
      const matchesLetter = selectedLetter === "ALL" || firstChar === selectedLetter;

      return matchesSearch && matchesLetter;
    });
  }, [search, selectedLetter]);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/glossary#${slug}`;
    navigator.clipboard.writeText(url).then(
      () => showToast("Direct link copied to clipboard!", "success"),
      () => showToast("Couldn't copy the link — clipboard access was blocked.", "error"),
    );
  };

  const handleBookmarkToggle = (g: GlossaryTerm) => {
    const bookmarked = isGlossaryBookmarked(g.slug);
    toggleGlossaryBookmark(g.slug);
    showToast(
      bookmarked ? `Removed ${g.term} from saved terms` : `Saved ${g.term} to glossary bookmarks!`,
      bookmarked ? "info" : "success"
    );
  };

  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <SectionHeading
        headingLevel={1}
        eyebrow="Jargon Decoder"
        title="FinTech Glossary & Terminology"
        description="Plain-language definitions of financial technology concepts, payment rails, and regulatory standards."
      />

      {/* Search & A-Z Jump Bar */}
      <div className="mt-10 space-y-4">
        {/* Search */}
        <div className="relative">
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
            type="search"
            placeholder="Search glossary terms (e.g. ACH, Interchange, Open Banking, BaaS)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search glossary terms"
              className="w-full surface rounded-xl border border-[var(--border-color)] py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40"
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

        {/* A-Z Index */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-b border-[var(--border-color)] pb-4">
          {letters.map((lettr) => {
            const hasTerms = lettr === "ALL" || glossary.some((g) => g.term.charAt(0).toUpperCase() === lettr);
            const active = selectedLetter === lettr;

            return (
              <button
                key={lettr}
                aria-disabled={!hasTerms}
                onClick={() => {
                  if (hasTerms) setSelectedLetter(lettr);
                }}
                className={`relative flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-xs font-mono font-bold transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
                  active
                    ? "text-[var(--background)]"
                    : hasTerms
                    ? "text-[var(--foreground)] hover:bg-[var(--subtle-bg)] focus-visible:bg-[var(--subtle-bg)]"
                    : "text-[var(--border-color)] cursor-not-allowed opacity-60"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 -z-10 rounded bg-[var(--foreground)]" />
                )}
                {lettr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted-text)] font-mono border-b border-[var(--border-color)] pb-3">
        <span aria-live="polite">Showing <span className="text-[var(--foreground)] font-bold">{filteredTerms.length}</span> of {glossary.length} terms</span>
        {selectedLetter !== "ALL" && <span>Letter filter: &ldquo;{selectedLetter}&rdquo;</span>}
      </div>

      {/* Glossary Term Cards */}
      <div className="mt-8 space-y-4 reveal-stagger">
        {filteredTerms.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border-color)] p-8 text-center text-sm text-[var(--muted-text)]">
            No terms found for &ldquo;{search}&rdquo;. Try another term.
          </div>
        ) : (
          filteredTerms.map((g) => {
            const bookmarked = isGlossaryBookmarked(g.slug);

            return (
              <section key={g.slug} id={g.slug} className="scroll-mt-24">
                <div className="group surface relative rounded-2xl border border-[var(--border-color)] p-5 transition-all hover:border-[var(--accent)]/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--accent-glow)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-base font-bold text-[var(--foreground)]">{g.term}</h2>
                      {"full" in g && g.full && (g.full as string) !== (g.term as string) && (
                        <span className="text-xs text-[var(--muted-text)] font-mono">({g.full})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleBookmarkToggle(g)}
                        className={`text-sm p-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
                          bookmarked
                            ? "text-warning-text bg-warning/10"
                            : "text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--subtle-bg)] focus-visible:bg-[var(--subtle-bg)] focus-visible:text-[var(--foreground)]"
                        }`}
                        title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
                        aria-label={bookmarked ? `Remove ${g.term} bookmark` : `Save ${g.term} bookmark`}
                      >
                        {bookmarked ? "★" : "☆"}
                      </button>
                      <button
                        onClick={() => handleCopyLink(g.slug)}
                        className="text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] p-1.5 rounded-full hover:bg-[var(--subtle-bg)] focus-visible:bg-[var(--subtle-bg)] focus-visible:text-[var(--foreground)] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-[var(--ring)] transition-opacity"
                        title="Copy Link"
                        aria-label={`Copy link to ${g.term}`}
                      >
                        🔗
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed font-medium text-[var(--foreground)]">{g.short}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">{g.long}</p>

                  {g.related.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--muted-text)]">
                      <span className="font-semibold text-[var(--foreground)] mr-1">See also:</span>
                      {g.related.map((r, idx) => {
                        const rel = glossary.find((x) => x.slug === r);
                        return rel ? (
                          <a key={r} href={`#${r}`} className="text-[var(--accent)] hover:underline mr-2">
                            {rel.term}{idx < g.related.length - 1 ? "," : ""}
                          </a>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
