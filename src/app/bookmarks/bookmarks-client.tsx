"use client";

import Link from "next/link";
import { useMemo, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookmarks } from "@/lib/bookmarks-context";
import { companies, glossary } from "@/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { CompanyLogo } from "@/components/ui/company-logo";
import { formatValuationShort } from "@/lib/format-company";
import { Reveal } from "@/components/ui/reveal";
import { GridBackdrop } from "@/components/ui/grid-backdrop";

export default function BookmarksPageClient() {
  const { bookmarks, toggleBookmark, glossaryBookmarks, toggleGlossaryBookmark } = useBookmarks();

  const savedCompanies = useMemo(
    () => companies.filter((c) => bookmarks.includes(c.slug)),
    [bookmarks] // companies is imported constant
  );
  const savedGlossary = useMemo(
    () => glossary.filter((g) => glossaryBookmarks.includes(g.slug)),
    [glossaryBookmarks] // glossary is imported constant
  );

  const totalCount = savedCompanies.length + savedGlossary.length;

  return (
    <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <SectionHeading
        headingLevel={1}
        eyebrow="Personal Knowledge Base"
        title="Saved Items & Bookmarks"
        description="Your saved fintech company profiles and glossary terms, stored locally in your browser."
      />

      {totalCount === 0 ? (
        <Reveal>
          <div className="mt-10 rounded-2xl border border-dashed border-[var(--border-color)] p-12 text-center">
            <motion.span
              className="inline-block text-4xl"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              ⭐
            </motion.span>
            <h3 className="mt-4 text-lg font-bold text-[var(--foreground)]">No saved items yet</h3>
            <p className="mt-2 text-sm text-[var(--muted-text)] max-w-md mx-auto">
              Click the star icon (☆) on any company profile or glossary term to save it for quick reference later.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/companies" className="btn-primary text-xs">
                Browse Companies →
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
                className="flex items-center justify-between rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-glow)] p-4 text-sm"
              >
                <div className="flex items-center gap-2 text-[var(--foreground)] font-medium">
                  <span>💡</span>
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
              <h2 className="text-xl font-bold text-[var(--foreground)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                <span>🏢 Saved Companies</span>
                <span className="text-xs font-mono text-[var(--muted-text)]">({savedCompanies.length})</span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger">
                {savedCompanies.map((c) => (
                  <div
                    key={c.slug}
                    style={{ ["--accent"]: c.accent } as CSSProperties}
                    className="group relative flex flex-col justify-between rounded-xl border border-[var(--border-color)] p-5 surface card-glow"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <CompanyLogo slug={c.slug} size={40} />
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
              <h2 className="text-xl font-bold text-[var(--foreground)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                <span>📖 Saved Glossary Terms</span>
                <span className="text-xs font-mono text-[var(--muted-text)]">({savedGlossary.length})</span>
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 reveal-stagger">
                {savedGlossary.map((g) => (
                  <div
                    key={g.slug}
                    className="flex items-start justify-between gap-4 rounded-xl border border-[var(--border-color)] p-4 surface hover:border-[var(--accent)]/30 transition-all"
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
        </div>
      )}
    </div>
  );
}
