"use client";

import Link from "next/link";
import {
  companySummaries,
  categoryNames,
  getCompanySummaryBySlug,
} from "@/generated/company-summaries";
import { DATA_AS_OF } from "@/lib/site-config";
import { CompanyLogo } from "@/components/ui/company-logo";
import { Highlight, MarkerRule } from "@/components/ui/highlight";
import { formatValuationShort } from "@/lib/format-company";

/**
 * The hero shows one real catalog entry in a quiet "directory index card".
 * It deliberately avoids terminal/CLI styling - the goal is an editorial,
 * human reference driven by live data.
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

/* One fixed entry, not a rotation. This used to cycle every 5s, which meant the
   card's contents, logo, stats and destination all changed underneath the
   reader — including mid-click, which is why the old code had to cancel the
   timer on pointerdown/touchstart/focusin. A rotating hero also re-ran the
   entry animation every few seconds. Naming a single company makes the block
   stable, readable, and safe to click. */
const heroProfile = heroProfiles[0];

export function HomeHero({
  glossaryCount = 0,
  articleCount = 0,
}: {
  glossaryCount?: number;
  articleCount?: number;
}) {
  const activeProfile = heroProfile;
  const categoryName =
    activeProfile.categories.map((slug) => categoryNames[slug]).find(Boolean) ??
    activeProfile.categories?.[0] ??
    "";

  return (
    <section data-placement="home-hero" className="relative mx-auto max-w-5xl px-5 pb-14 pt-14 md:pb-28 md:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          FinTech Atlas · the world&rsquo;s fintech, in one directory
        </p>

        <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
          Make sense of the companies reshaping{" "}
          <em className="font-serif italic text-[var(--accent)]">finance</em>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-[var(--muted-text)] sm:text-lg">
          Explore a global directory of banks, neobanks, payments and fintech —
          compare services, calculate real fees, and get every term explained in
          plain English.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link href="/global-directory" className="btn-primary">Explore the directory</Link>
          <Link href="/compare" className="btn-ghost">Compare providers</Link>
        </div>
      </div>

      {/* Key facts — no rules, no dividers: numerals sit on warm paper with a
          single marker stroke underneath. Numbers do the talking. */}
      <div className="mx-auto mt-12 max-w-3xl md:mt-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {[
            { value: companySummaries.length, label: "Company profiles" },
            { value: Object.keys(categoryNames).length, label: "Industry categories" },
            { value: glossaryCount, label: "Glossary terms" },
            { value: articleCount, label: "Guides & comparisons" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl font-semibold tabular-nums text-[var(--foreground)] md:text-4xl">
                {label === "Data as of" ? DATA_AS_OF : value}
              </div>
              <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-[var(--muted-text)]">
                {label}
              </div>
            </div>
          ))}
        </div>
        <MarkerRule className="mt-10" />
      </div>

      {/* Directory spotlight — the human, paper-like counterpart to a terminal.
          No card, no border: logo, ink, and one highlighted phrase. */}
      <div className="mx-auto mt-14 max-w-xl text-center">
        <div className="mb-5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-text)]">
            From the directory
          </span>
        </div>

        <div>
          <div className="flex items-center justify-center gap-4">
            <CompanyLogo slug={activeProfile.slug} name={activeProfile.name} size={44} />
            <div className="text-left">
              <h2 className="text-lg font-semibold leading-tight text-[var(--foreground)]">
                {activeProfile.name}
              </h2>
              <p className="text-xs text-[var(--muted-text)]">{categoryName}</p>
            </div>
          </div>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--fg-dim)]">
            {activeProfile.tagline}
          </p>

          <p className="mt-5 text-sm text-[var(--muted-text)]">
            Founded <Highlight color="yellow">{String(activeProfile.founded)}</Highlight>
            {" · "}
            <Highlight color="green">{formatValuationShort(activeProfile.valuation)}</Highlight>
            {" · ★ "}
            {activeProfile.rating.toFixed(1)}
          </p>

          <div className="mt-5">
            <Link
              href={`/companies/${activeProfile.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)]"
            >
              <span className="hl-link">View full profile</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
