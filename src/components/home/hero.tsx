"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { companies, categories, glossary } from "@/data";
import { DATA_AS_OF } from "@/lib/site-config";
import { CountUp } from "@/components/ui/count-up";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { formatValuationShort } from "@/lib/format-company";

/**
 * Build the terminal-mock step sequence from a real catalog entry, so the
 * hero product showcase reflects live data (rating, valuation…) rather than
 * hardcoded strings. The hero cycles through a curated set of recognizable
 * profiles so the showcase never feels static.
 */
const HERO_PROFILE_SLUGS = [
  "stripe",
  "revolut",
  "coinbase",
  "klarna",
  "wise",
  "robinhood",
];

/** Resolve a slug to its catalog entry, skipping any that have drifted away. */
const heroProfiles = HERO_PROFILE_SLUGS.map((slug) =>
  companies.find((c) => c.slug === slug),
).filter((c): c is NonNullable<typeof c> => Boolean(c));

/** Compute the animated step sequence for a given catalog entry. */
function buildSteps(c: (typeof companies)[number]): { label: string; detail: string }[] {
  return [
    {
      label: "profile loaded",
      detail: `${c.name.toLowerCase()} · ${
        categories.find((x) => c.categories.includes(x.slug))?.name?.toLowerCase() ??
        c.categories?.[0] ?? ""
      }`,
    },
    { label: "founded", detail: String(c.founded) },
    { label: "valuation sourced", detail: formatValuationShort(c.valuation) },
    { label: "rating verified", detail: `★ ${c.userReviews.rating} / 5.0` },
    { label: "profile ready", detail: "open in atlas" },
  ];
}

/** Hook that rotates through heroProfiles every few seconds, returning the
 *  active profile entry. */
function useRotatingProfile(interval = 4500) {
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

export function HomeHero() {
  const activeProfile = useRotatingProfile();
  const steps = buildSteps(activeProfile);
  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-24 pt-28 md:pb-32 md:pt-40 overflow-hidden">
      {/* Layered ambient backdrop: dotted grid + two offset radial accents */}
      <GridBackdrop fullBleed variant="bold" />
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full blur-[130px]"
          style={{ background: "var(--accent)", opacity: 0.07, animation: "glow-pulse 9s ease-in-out infinite" }}
        />
        <div
          className="absolute top-2/3 left-[18%] w-[420px] h-[420px] rounded-full blur-[110px]"
          style={{ background: "var(--success)", opacity: 0.05, animation: "glow-pulse 11s ease-in-out infinite" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="eyebrow mb-5 mx-auto"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--term-green)] live-pulse" />
          Educational Resource · Updated {DATA_AS_OF}
        </motion.p>

        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Understand the companies{" "}
          <span className="gradient-text">reshaping</span> finance
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-[var(--muted-text)] sm:text-lg">
          A plain-language guide to {companies.length}+ FinTech companies — what each does, how they make money,
          how they differ, and what real users think. No jargon without explanation.
        </p>

        {/* CTA buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link href="/companies" className="btn-primary">
            Browse companies →
          </Link>
          <Link href="/compare" className="btn-ghost">
            Compare side-by-side
          </Link>
          <Link href="/glossary" className="btn-ghost">
            Glossary
          </Link>
        </div>

        {/* Key facts — real count-up */}
        <div className="mt-14 grid grid-cols-2 gap-5 text-center md:grid-cols-4">
          {[
            { value: companies.length, label: "Company profiles" },
            { value: categories.length, label: "Categories" },
            { value: glossary.length, label: "Glossary terms" },
            { value: 0, label: "Data as of" },
          ].map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
              className="surface-raised relative rounded-xl py-4 px-2"
            >
              <div className="text-2xl font-bold tracking-tight tabular-nums gradient-text">
                {label === "Data as of" ? DATA_AS_OF : <CountUp target={value} />}
              </div>
              <div className="text-xs text-[var(--muted-text)] mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Hero terminal mock — waitlayer-style product showcase */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-14 max-w-2xl"
      >
        {/* "Now showing" indicator — announces the profile rotating in */}
        <div className="mb-3 flex items-center justify-between px-2 text-[11px] font-mono text-[var(--muted-text)]">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--term-green)]">
              <span className="absolute inset-0 rounded-full bg-[var(--term-green)] animate-ping opacity-60" />
            </span>
            <span className="uppercase tracking-wider text-[10px]">live preview</span>
            <span className="dot-sep" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={activeProfile.slug}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-[var(--foreground)] font-semibold"
              >
                {activeProfile.name}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="hidden gap-1 sm:flex">
            {heroProfiles.map((p, i) => (
              <span
                key={p.slug}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: heroProfiles[i]?.slug === activeProfile.slug ? 16 : 6,
                  background:
                    heroProfiles[i]?.slug === activeProfile.slug
                      ? "var(--accent)"
                      : "var(--border-color)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="surface rounded-2xl p-1.5 shadow-2xl shadow-black/40">
          <div className="rounded-xl bg-[var(--background)] overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 hairline-b">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/70" />
              <span className="ml-2 font-mono text-[11px] text-[var(--muted-text)]">fintech-atlas — ~/profiles</span>
            </div>
            {/* Body */}
            <div className="px-4 py-4 sm:px-6 sm:py-5 text-left font-mono text-[12.5px] leading-relaxed">
              <div className="text-[var(--muted-text)]">
                <span className="text-[var(--term-green)]">$</span> atlas open --profile {activeProfile.slug}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.3 }}
                className="mt-3 space-y-2"
              >
                {steps.map((step, i) => (
                  <motion.div
                    /* re-mount on each profile so the stagger replays */
                    key={`${activeProfile.slug}-${step.label}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + i * 0.18, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-[var(--term-green)]">✓</span>
                    <span className="text-[var(--fg-dim)]">{step.label}</span>
                    <span className="dot-sep" />
                    <span className="text-[var(--accent)]">{step.detail}</span>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 0.4 }}
                className="mt-3 flex items-center gap-2"
              >
                <span className="text-[var(--term-green)]">+</span>
                <span className="text-[var(--muted-text)]">profile ready —</span>
                <Link href={`/companies/${activeProfile.slug}`} className="text-[var(--accent)] hover:underline">
                  open in atlas →
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.3, duration: 0.3 }}
                className="mt-2 text-[var(--muted-dim)]"
              >
                <span className="text-[var(--term-green)]">$</span>{" "}
                <span className="inline-block w-2 h-3.5 translate-y-0.5 bg-[var(--term-green)] live-pulse" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}