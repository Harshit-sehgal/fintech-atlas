"use client";

import { Suspense, useMemo, type CSSProperties } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { companies, type Company } from "@/data";
import { CompanyLogo } from "@/components/ui/company-logo";
import { SectionHeading } from "@/components/ui/section-heading";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { useToast } from "@/lib/toast-context";
import { animationPresets as animation } from "@/lib/animation";
import { parseCompareSlugs } from "@/lib/compare";
import { formatHeadquartersCity, formatValuationForStats } from "@/lib/format-company";

import { PRESETS } from "@/data/compare-presets";
import { PartnerCta } from "@/components/ui/partner-cta";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  // Derive the selected slugs directly from the URL on every render. This is the
  // source of truth: toggling a company calls updateUrl, which calls router.replace,
  // updating searchParams and re-rendering with the new selection — no derived state
  // or syncing effect needed (avoids the setState-in-effect anti-pattern).
  //
  // We distinguish three URL shapes:
  //   - no params at all       → first visit, fall back to the Stripe vs Adyen default
  //   - `?companies=` (empty)   → user explicitly cleared; show the empty state
  //   - `?companies=stripe,adyen` → explicit selection
  //
  // Every slug is validated against the company list by parseCompareSlugs, so no
  // untrusted query string can surface an unknown slug in the render layer.
  const selectedSlugs = parseCompareSlugs(searchParams, companies);

  const updateUrl = (slugs: string[]) => {
    if (slugs.length > 0) {
      router.replace(`/compare?companies=${slugs.join(",")}`, { scroll: false });
    } else {
      // Empty `companies=` lets getSlugs know this was an explicit clear, not a
      // bare-navigated /compare (which would fall back to the default selection).
      router.replace(`/compare?companies=`, { scroll: false });
    }
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
  const selectedCompanies: Company[] = selectedSlugs
    .map((s) => companies.find((c) => (c.slug as string) === s))
    .filter((c): c is Company => c !== undefined);

  const rows = useMemo(
    () => [
      { label: "Tagline", fn: (c: Company) => c.tagline },
      { label: "Founded & HQ", fn: (c: Company) => `${c.founded} — ${formatHeadquartersCity(c.headquarters)}` },
      { label: "Employees (reported)", fn: (c: Company) => c.employees },
      { label: "Valuation / market value", fn: (c: Company) => formatValuationForStats(c) },
      { label: "Pricing Model", fn: (c: Company) => c.pricing.model },
      { label: "Editorial sentiment", fn: (c: Company) => `${c.userReviews.rating} / 5.0` },
      { label: "Primary Advantage", fn: (c: Company) => c.strengths?.[0] ?? "None listed" },
      { label: "Key Tradeoff", fn: (c: Company) => c.weaknesses?.[0] ?? "None listed" },
      { label: "Notable Customers", fn: (c: Company) => c.whoUses.slice(0, 4).join(", ") },
    ],
    []
  );

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
      <SectionHeading
        headingLevel={1}
        eyebrow="Side-by-Side Analysis"
        title="Compare FinTech Companies"
        description="Select up to 3 companies or choose a preset comparison. Values have different dates and methodologies, so use this as an orientation tool rather than a like-for-like benchmark."
      />

      {/* Preset Quick Benchmark Buttons */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)] mr-2 font-mono">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => updateUrl(p.slugs)}
            className="rounded-full border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3.5 py-1.5 text-xs font-medium text-[var(--foreground)] transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--subtle-bg)] hover:scale-105 focus-visible:outline-none focus-visible:ring-[var(--ring)]"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Selector Grid */}
      <div className="surface mt-8 rounded-2xl border border-[var(--border-color)] p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="eyebrow !text-[var(--muted-text)] !tracking-widest">
            Select Companies to Compare ({selectedSlugs.length}/3)
          </span>
          {selectedSlugs.length > 0 && (
            <button
              onClick={() => updateUrl([])}
              className="text-xs text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded"
            >
              Clear selection
            </button>
          )}
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((c) => {
            const active = selectedSlugs.includes(c.slug);
            return (
              <motion.button
                key={c.slug}
                layout
                onClick={() => toggleSelect(c.slug)}
                whileTap={{ scale: 0.97 }}
                aria-pressed={active}
                style={{ ["--accent"]: c.accent } as CSSProperties}
                className={`relative flex items-center justify-between rounded-xl border p-3 text-left transition-all overflow-hidden ${
                  active
                    ? "border-[var(--accent)] bg-[var(--background)] card-glow"
                    : "border-[var(--border-color)] hover:border-[var(--border-strong)] text-[var(--muted-text)] hover:bg-[var(--background)]/40"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={`compare-select-${c.slug}`}
                    className="absolute inset-0 -z-10 rounded-xl bg-[var(--accent)]/8"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <div className="flex items-center gap-2.5 min-w-0">
                  <CompanyLogo slug={c.slug} name={c.name} size={28} />
                  <span className="text-xs truncate text-[var(--foreground)]">{c.name}</span>
                </div>
                <motion.span
                  initial={false}
                  animate={{
                    scale: active ? 1 : 0,
                    opacity: active ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-bold text-[var(--accent)]"
                >
                  ✓
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Comparison table */}
      <AnimatePresence mode="wait">
        {selectedCompanies.length > 0 ? (
          <motion.section
            key="table"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--background)] shadow-lg"
          >
            {/* Header controls inside table */}
            <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-6 py-3 text-xs text-[var(--muted-text)]">
              <span>Orientation Matrix</span>
              <button
                onClick={shareLink}
                className="flex items-center gap-1.5 btn-ghost text-xs px-3 py-1"
              >
                <span>🔗 Share comparison link</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption>Comparison of selected companies across key dimensions</caption>
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
                          <div className="flex items-center justify-between gap-2">
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
                              className="shrink-0 text-xs text-[var(--muted-text)] hover:text-danger-text focus-visible:text-danger-text focus-visible:outline-none focus-visible:ring-[var(--ring)] rounded p-1"
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
                  {rows.map((row) => (
                    <tr key={row.label} className="hover:bg-[var(--subtle-bg)]/30 transition-colors">
                      <th scope="row" className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--muted-text)]">
                        {row.label}
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
                            className="p-4 text-sm leading-relaxed align-top"
                          >
                            {row.fn(c)}
                          </motion.td>
                        ))}
                      </AnimatePresence>
                    </tr>
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
              </table>
            </div>
          </motion.section>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 rounded-2xl border border-dashed border-[var(--border-color)] p-12 text-center"
          >
            <p className="text-sm text-[var(--muted-text)]">
              Select 1 to 3 companies above or click a preset benchmark to start comparing.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ComparePageClient() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-sm text-[var(--muted-text)]">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}