"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import { categories } from "@/data/categories";
import {
  categoryNames,
  companySummaries,
  getCompanySummaryBySlug,
} from "@/generated/company-summaries";
import { PRESETS } from "@/data/compare-presets";
import { DATA_AS_OF } from "@/lib/site-config";
import { SectionHeading } from "@/components/ui/section-heading";
import { CompanyLogo } from "@/components/ui/company-logo";
import { Reveal } from "@/components/ui/reveal";
import { HomeHero } from "@/components/home/hero";
import { BrandWall } from "@/components/ui/brand-wall";
import { NewsletterOptIn } from "@/components/ui/newsletter-opt-in";
import { formatValuationShort } from "@/lib/format-company";

/* slug -> human category label, for the preset cards' meta row. */
const CATEGORY_BY_COMPANY: Record<string, string> = Object.fromEntries(
  companySummaries.map((c) => [c.slug, categoryNames[c.categories?.[0] ?? ""] ?? ""]),
);

// India-first featured providers (plan §7: "India-specific provider
// directory"). Curated order so the homepage leads with the Indian market.
const FEATURED_SLUGS: readonly string[] = ["razorpay", "cashfree", "payoneer", "wise", "phonepe", "paytm"];

// The homepage's primary axis (plan §7 #1: "Choose what you are trying to do").
// Each card routes to the most relevant tool, comparison or guide rather than
// a generic listing.
const INTENTS: {
  title: string;
  desc: string;
  href: string;
  cta: string;
  svg: React.ReactNode;
}[] = [
  {
    title: "Choose a payment gateway",
    desc: "Razorpay, Stripe, Cashfree or Paytm — compare fees, models and fit side by side.",
    href: "/compare",
    cta: "Open comparison",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 14h8" />
      </svg>
    ),
  },
  {
    title: "Calculate gateway fees",
    desc: "Enter volume and method mix to see the real settlement after every fee and GST.",
    href: "/tools/calculator",
    cta: "Launch fee estimator",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M8 6h8M8 10h2M8 14h2M8 18h2M14 10h2v8h-2z" />
      </svg>
    ),
  },
  {
    title: "Receive money from abroad",
    desc: "Compare Wise, Payoneer and bank routes to land the most INR from a $500–$10,000 client payment.",
    href: "/articles/best-way-to-receive-usd-in-india",
    cta: "See the breakdown",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
      </svg>
    ),
  },
  {
    title: "Check FX markup on transfers",
    desc: "See exactly how much a provider's exchange-rate spread costs you on both directions.",
    href: "/tools/exchange-rate-markup-calculator",
    cta: "Measure the markup",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M4 8h13l-3-3M20 16H7l3 3" />
      </svg>
    ),
  },
  {
    title: "Compare two providers",
    desc: "Pick any two fintechs and get a difference-first verdict across pricing, features and fit.",
    href: "/compare?companies=razorpay,stripe",
    cta: "Start a comparison",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M12 3v18M5 8l-2 4 2 4M19 8l2 4-2 4" />
      </svg>
    ),
  },
  {
    title: "Find the right provider for India",
    desc: "Gateways, payouts, neobanks and compliance — browse the India decision hub.",
    href: "/india",
    cta: "Explore the hub",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
];

export default function HomePageClient({
  recentArticles,
  articleCount,
  glossaryCount,
}: {
  recentArticles: { slug: string; title: string; category: string; displayDate: string }[];
  articleCount: number;
  glossaryCount: number;
}) {
  const featured = useMemo(
    () =>
      FEATURED_SLUGS.map((slug) => getCompanySummaryBySlug(slug))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [],
  );
  const marquee = useMemo(
    () => [...featured, ...companySummaries.filter((c) => !FEATURED_SLUGS.includes(c.slug))].slice(0, 32),
    [featured],
  );

  // Precompute marquee logos to avoid mapping on every render
  const marqueeLogos = useMemo(() => marquee.map((c) => ({
    slug: c.slug,
    name: c.name,
  })), [marquee]);

  // Precompute featured company categories to avoid nested mapping and finding
  const featuredWithCategories = useMemo(() => {
    return featured.map((company) => ({
      ...company,
      categoryObjects: company.categories
        .map((catSlug) => categories.find((cat) => cat.slug === catSlug))
        .filter((cat): cat is NonNullable<typeof cat> => cat !== undefined),
    }));
  }, [featured]);

  return (
    <>
      <HomeHero articleCount={articleCount} glossaryCount={glossaryCount} />

      {/* Proof band — the Mercury/Stripe move: honest, checkable specifics
          instead of vanity metrics. Numbers a human editor would defend. */}
      <section data-placement="proof-band" className="border-y border-[var(--border-color)] bg-[var(--subtle-bg)]/40">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-px sm:grid-cols-3">
            {[
              {
                stat: "Every number dated",
                note: "Each fee figure on the site carries the date we checked it. Anything older than 60 days gets re-verified or flagged.",
              },
              {
                stat: "Formulas in the open",
                note: "The calculators show their work — inputs, tax treatment, exclusions — so you can dispute our arithmetic, not just read it.",
              },
              {
                stat: "No pay-to-rank",
                note: "Commercial relationships are disclosed on the page where they exist, and they never move a rating or a ranking.",
              },
            ].map((item) => (
              <div key={item.stat} className="py-8 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <p className="font-serif text-lg font-bold text-[var(--foreground)]">{item.stat}</p>
                <p className="mt-2 max-w-xs text-xs leading-relaxed text-[var(--muted-text)]">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intent chooser — plan §7 #1: "Choose what you are trying to do".
          The homepage's primary navigation axis; each card routes to a
          concrete tool, comparison or guide rather than a generic listing. */}
      <section data-placement="intent-chooser" className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
        <SectionHeading
          eyebrow="Start here"
          title="What are you trying to do?"
          description="Pick the decision you're facing — every entry opens the tool, comparison or guide built for it."
        />
        <div className="mt-8 grid border-t border-l border-[var(--border-color)] sm:grid-cols-2 lg:grid-cols-3">
          {INTENTS.map((intent) => (
            <Link
              key={intent.title}
              href={intent.href}
              className="group flex flex-col border-b border-r border-[var(--border-color)] p-5 transition-colors hover:bg-[var(--subtle-bg)]/50"
            >
              <div className="flex h-9 w-9 items-center justify-center text-[var(--accent)]">
                {intent.svg}
              </div>
              <h3 className="mt-4 text-base font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                {intent.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-text)]">
                {intent.desc}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-[var(--accent)]">
                {intent.cta}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand wall — the full catalog as a static ruled grid (credibility strip). */}
      <section data-placement="brand-wall" className="relative border-b border-[var(--border-color)] bg-[var(--subtle-bg)]/30 py-10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">
                {companySummaries.length} companies · Updated {DATA_AS_OF}
              </p>
              <Link
                href="/companies"
                className="hidden text-xs font-semibold text-[var(--accent)] hover:underline underline-offset-4 sm:inline"
              >
                View all {companySummaries.length}
              </Link>
            </div>
          </Reveal>
        </div>
        <BrandWall logos={marqueeLogos} />
      </section>

      {/* Interactive Tools Teaser — a ruled band, not a boxed panel. */}
      <section data-placement="tools-teaser" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <Reveal>
          <div className="border-y border-[var(--border-color)] py-10 md:py-14">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                  Interactive decision suite
                </p>
                <h2 className="text-2xl font-semibold leading-tight text-[var(--foreground)] md:text-3xl">
                  Calculate real costs &amp; compare services
                </h2>
                <p className="text-sm leading-relaxed text-[var(--muted-text)]">
                  Estimate payment processing fees, measure hidden FX
                  markups on international transfers, or take the matchmaker
                  quiz to build an initial fintech shortlist.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/tools/calculator" className="btn-primary text-xs">
                  Fee Estimator
                </Link>
                <Link href="/tools/exchange-rate-markup-calculator" className="btn-ghost text-xs">
                  FX Markup
                </Link>
                <Link href="/tools/remittance" className="btn-ghost text-xs">
                  Cross-Border FX
                </Link>
                <Link href="/tools/matchmaker" className="btn-ghost text-xs">
                  Matchmaker Quiz
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Popular comparisons — quick-start presets from the compare tool */}
      <section data-placement="popular-comparisons" className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <SectionHeading
          eyebrow="Start With a Preset"
          title="Popular Comparisons"
          description="Jump straight into a side-by-side benchmark — pick a preset and compare fees, pricing models, and platform fit in one view."
        />

        {/* Preset grid.
            The old version gave every cell a `border-b` and put the column rule
            on via `sm:odd:border-r` / `lg:[&:nth-child(3n)]:border-r-0`, with
            the gutter carried only by `pr-*`. Two things were visibly wrong:

            1. The divider sat flush against the text in the middle and right
               columns — only the left side of each cell had padding — so the
               rule ran right through the descenders of every title.
            2. Seven cards in a 3-up grid leaves one card in the last row, and
               the right-hand divider of that card kept drawing past its own
               content: a rule hanging in empty space beside nothing.

            Both are structural, so the fix is structural. The rules now live on
            the GRID (`border-t border-l`) and each cell closes itself with
            `border-r border-b` plus its own padding, so every cell is a
            complete box. The column count is now a plain 1 / 2 / 3 by
            breakpoint, with no sibling-counting rules left to get wrong. */}
        <div className="mt-8 grid border-t border-l border-[var(--border-color)] sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((preset) => (
            <Link
              key={preset.name}
              href={`/compare?companies=${preset.slugs.join(",")}`}
              className="group flex flex-col border-b border-r border-[var(--border-color)] p-5 transition-colors hover:bg-[var(--subtle-bg)]/50 focus-visible:outline-none focus-visible:ring-[var(--ring)]"
            >
              <div className="flex items-center gap-2">
                {preset.slugs.map((slug) => (
                  <CompanyLogo key={slug} slug={slug} name={slug} size={28} decorative />
                ))}
              </div>
              <h3 className="mt-4 text-base font-bold leading-snug text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                {preset.name}
              </h3>
              {/* This row used to repeat "Open the side-by-side comparison →"
                  seven times, which told the reader nothing they could not see
                  from the card being a link. The category is the useful fact
                  instead. `mt-auto` pins it to the cell floor so it aligns
                  across a row even where one title wraps to two lines and its
                  neighbours do not. */}
              <p className="mt-auto pt-3 text-xs text-[var(--muted-text)]">
                {preset.slugs
                  .map((slug) => CATEGORY_BY_COMPANY[slug])
                  .filter(Boolean)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .join(" · ") || "Comparison preset"}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/india"
            className="group inline-flex items-center gap-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
          >
            <span aria-hidden className="rounded-sm border border-[var(--border-color)] px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-[var(--muted-text)]">
              IN
            </span>
            <span>Browse every payment gateway &amp; international payments option for India</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* Recently verified updates — plan §7 homepage section */}
      <section data-placement="latest-guides" className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <SectionHeading
          eyebrow="Recently Verified"
          title="Latest Guides & Comparisons"
          description="The newest researched articles, with the dates they were last verified."
        />
        <div className="mt-8 grid border-t border-l border-[var(--border-color)] sm:grid-cols-2 lg:grid-cols-3">
          {recentArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="group flex flex-col border-b border-r border-[var(--border-color)] p-5 transition-colors hover:bg-[var(--subtle-bg)]/50"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted-text)]">
                {a.category} · {a.displayDate}
              </p>
              <h3 className="mt-2 text-base font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                {a.title}
              </h3>
              <p className="mt-auto pt-2 text-sm text-[var(--muted-text)]">Read the guide →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured companies — a ledger, not a card grid: mirrors the
          directory's editorial rows so the site reads with one voice.
          Each entry carries the facts a chooser actually compares on. */}
      <section data-placement="india-first" className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <SectionHeading
          eyebrow="India-First"
          title="India-First Providers"
          description="Profiles of the payment gateways and FX services Indian freelancers and businesses choose most — fee structures, strengths, weaknesses, and editorial sentiment."
        />
        <div className="mt-10 border-t border-[var(--border-color)]">
          {featuredWithCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/companies/${c.slug}`}
              style={{ ["--accent"]: c.accent } as CSSProperties}
              className="group relative flex flex-col gap-3 border-b border-[var(--border-color)] py-5 transition-colors sm:flex-row sm:items-center sm:gap-6"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 hidden w-0.5 origin-top scale-y-0 bg-[var(--accent)] transition-transform duration-300 group-hover:scale-y-100 sm:block"
              />
              <div className="flex min-w-0 items-center gap-4 sm:w-[30%]">
                <CompanyLogo slug={c.slug} name={c.name} size={44} />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                    {c.name}
                  </h3>
                  <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted-text)]">
                    {c.categoryObjects[0]?.name ?? "Fintech"}
                  </p>
                </div>
              </div>
              <p className="min-w-0 flex-1 text-xs leading-relaxed text-[var(--muted-text)] sm:truncate">
                {c.tagline}
              </p>
              <div className="flex shrink-0 items-center gap-6 sm:justify-end">
                <div className="text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted-text)]">Pricing</p>
                  <p className="mt-0.5 max-w-[10rem] truncate text-xs text-[var(--foreground)]">{c.pricingModel}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted-text)]">Valuation</p>
                  <p className="mt-0.5 font-mono text-xs font-bold text-[var(--foreground)]">{formatValuationShort(c.valuation)}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted-text)]">Rating</p>
                  <p className="mt-0.5 font-mono text-xs font-bold text-[var(--foreground)]">★ {c.rating.toFixed(1)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/companies" className="btn-ghost text-xs">
            View all {companySummaries.length} companies
          </Link>
        </div>
      </section>

      {/* Trust & independence — plan §7 #6 + #7, merged into one band so the
          homepage reads as a single credibility statement rather than two
          separate marketing blocks. */}
      <section data-placement="trust" className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <SectionHeading
          eyebrow="Independence & Method"
          title="How FinTech Atlas Stays Trustworthy"
          description="The site stays free because it is honest about how it is funded — and keeps editorial choices separate from commercial inventory."
        />
        <div className="mt-8 grid border-t border-[var(--border-color)] md:grid-cols-3">
          {[
            {
              title: "Transparent methodology",
              desc: "Every fee figure, rating and claim traces back to a documented source with a verification date. Nothing is invented; nothing is paywalled.",
              href: "/about#methodology",
              cta: "See the sourcing & scoring method",
            },
            {
              title: "Honest monetisation",
              desc: "Affiliate links carry rel=\"sponsored\" and are disclosed on every page. Sponsored placements are clearly labelled and never buy a rating or ranking.",
              href: "/affiliate-disclosure",
              cta: "Read the full disclosure",
            },
            {
              title: "Independent calculators",
              desc: "Tool formulas are open and documented — see what is included, what is excluded, and how every number is derived before you decide.",
              href: "/tools/calculator",
              cta: "Try the fee estimator",
            },
          ].map((item, i) => (
            <Link
              key={item.title}
              href={item.href}
              className={`group flex flex-col border-b border-[var(--border-color)] py-6 transition-colors ${
                i < 2 ? "md:border-r md:pr-8" : ""
              } ${i > 0 ? "md:pl-8" : ""}`}
            >
              <h3 className="text-base font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-text)]">
                {item.desc}
              </p>
              <p className="mt-3 text-xs font-semibold text-[var(--accent)]">
                {item.cta} →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter (plan §7 homepage section 8) — a ruled band, not a box. */}
      <section data-placement="newsletter" className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <div className="border-b border-[var(--border-color)] pb-14">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              Newsletter
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
              Fee Changes, New Calculators &amp; Research Notes
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">
              A low-frequency update when pricing changes, tools ship, or new
              comparisons land. No tracking pixels, no resale — just the
              research.
            </p>
            <NewsletterOptIn />
          </div>
        </div>
      </section>

      {/* Compare CTA — a closing statement, not a box: big serif line, the
          two concrete next actions, and the honest cost of being wrong. */}
      <section data-placement="compare-cta" className="border-t border-[var(--border-color)]">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
          <h2 className="text-balance font-serif text-3xl font-bold leading-tight text-[var(--foreground)] md:text-4xl">
            The wrong gateway quietly costs 1–3% of every rupee you earn.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-[var(--muted-text)]">
            That is a rounding error on one invoice and a rounding error you
            never notice again. Spend ten minutes here before you sign up
            anywhere.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/compare" className="btn-primary">Compare payment gateways</Link>
            <Link href="/tools/calculator" className="btn-ghost">Run your numbers first</Link>
          </div>
        </div>
      </section>
    </>
  );
}
