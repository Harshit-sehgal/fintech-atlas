"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  companySummaries,
  categoryNames,
  getCompanySummaryBySlug,
} from "@/generated/company-summaries";
import { DATA_AS_OF } from "@/lib/site-config";
import { CountUp } from "@/components/ui/count-up";
import { CompanyLogo } from "@/components/ui/company-logo";
import { formatValuationShort } from "@/lib/format-company";

/**
 * The hero showcases a rotating selection of real catalog entries in a quiet
 * "directory index card". It deliberately avoids terminal/CLI styling - the
 * goal is an editorial, human reference driven by live data.
 */
const HERO_PROFILE_SLUGS = [
  "razorpay",
  "stripe",
  "revolut",
  "phonepe",
  "wise",
  "robinhood",
];

/* Resolve a slug to its catalog entry, skipping any that have drifted away. */
const heroProfiles = HERO_PROFILE_SLUGS.map((slug) =>
  getCompanySummaryBySlug(slug),
).filter((c): c is NonNullable<typeof c> => Boolean(c));

/* Hook that rotates through heroProfiles every few seconds. */
function useRotatingProfile(interval = 5000) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (heroProfiles.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % heroProfiles.length),
      interval,
    );
    return () => clearInterval(id);
  }, [interval]);
  return heroProfiles[index] ?? heroProfiles[0];
}

export function HomeHero({ glossaryCount = 0 }: { glossaryCount?: number }) {
  const activeProfile = useRotatingProfile();
  const categoryName =
    activeProfile.categories.map((slug) => categoryNames[slug]).find(Boolean) ??
    activeProfile.categories?.[0] ??
    "";

  return (
    <section className="relative mx-auto max-w-5xl px-5 pb-20 pt-20 md:pb-28 md:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]"
        >
          FinTech Atlas · India payment decisions, compared
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl"
        >
          Compare payment gateways &{" "}
          <em className="font-serif italic text-[var(--accent)]">international</em> payments for India
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-[var(--muted-text)] sm:text-lg"
        >
          Calculate real fees, settlement amounts and provider differences
          before choosing — {companySummaries.length} company profiles, no jargon
          without an explanation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3 text-sm"
        >
          <Link href="/compare" className="btn-primary">Compare payment gateways</Link>
          <Link href="/tools/calculator" className="btn-ghost">Calculate gateway fees</Link>
        </motion.div>
      </div>

      {/* Key facts - quiet editorial stat row (hairline-separated serif numerals). */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-16 max-w-2xl border-y border-[var(--border-color)]"
      >
        <div className="grid grid-cols-2 divide-x divide-[var(--border-color)] md:grid-cols-4">
          {[
            { value: companySummaries.length, label: "Company profiles" },
            { value: Object.keys(categoryNames).length, label: "Industry categories" },
            { value: glossaryCount, label: "Glossary terms" },
          ].map(({ value, label }) => (
            <div key={label} className="px-3 py-6 text-center">
              <div className="font-display text-3xl font-semibold tabular-nums text-[var(--foreground)] md:text-4xl">
                {label === "Data as of" ? DATA_AS_OF : <CountUp target={value} />}
              </div>
              <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-[var(--muted-text)]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Directory index card - the human, paper-like counterpart to a terminal. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-14 max-w-xl"
      >
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-text)]">
            From the directory
          </span>
          <div className="flex items-center gap-1.5">
            {heroProfiles.map((p, i) => (
              <span
                key={p.slug}
                className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
                style={{
                  background:
                    heroProfiles[i]?.slug === activeProfile.slug
                      ? "var(--accent)"
                      : "var(--border-strong)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeProfile.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
                  <CompanyLogo slug={activeProfile.slug} name={activeProfile.name} size={34} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold leading-tight text-[var(--foreground)]">
                    {activeProfile.name}
                  </h2>
                  <p className="text-xs text-[var(--muted-text)]">{categoryName}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[var(--fg-dim)]">
                {activeProfile.tagline}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--border-color)]">
                <div className="bg-[var(--card)] px-3 py-3">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-text)]">Founded</div>
                  <div className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--foreground)]">{activeProfile.founded}</div>
                </div>
                <div className="bg-[var(--card)] px-3 py-3">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-text)]">Valuation</div>
                  <div className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--foreground)]">{formatValuationShort(activeProfile.valuation)}</div>
                </div>
                <div className="bg-[var(--card)] px-3 py-3">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-text)]">Rating</div>
                  <div className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--foreground)]">★ {activeProfile.rating.toFixed(1)}</div>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  href={`/companies/${activeProfile.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:underline underline-offset-4"
                >
                  View full profile
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
