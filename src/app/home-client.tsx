"use client";

import Link from "next/link";
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
import { Highlight, MarkerRule } from "@/components/ui/highlight";
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

      {/* Proof band — honest, checkable specifics instead of vanity metrics.
          No band, no rules: three marked phrases on warm paper. */}
      <section data-placement="proof-band" className="mx-auto max-w-6xl px-5 pt-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm leading-relaxed text-[var(--muted-text)]">
            <Highlight color="yellow">Every number dated</Highlight> — re-verified or flagged after 60 days.
            {" "}<Highlight color="green">Formulas in the open</Highlight> — dispute our arithmetic, not just read it.
            {" "}<Highlight color="pink">No pay-to-rank</Highlight> — commercial ties never move a rating.
          </p>
        </div>
        <MarkerRule className="mt-10" color="green" />
      </section>

      {/* Intent chooser — plan §7 #1: "Choose what you are trying to do".
          No boxes, no grid rules: ink numerals + titles that sweep a marker
          on hover, breathing room doing the separating. */}
      <section data-placement="intent-chooser" className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
        <SectionHeading
          eyebrow="Start here"
          title="What are you trying to do?"
          description="Pick the decision you're facing — every entry opens the tool, comparison or guide built for it."
        />
        <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {INTENTS.map((intent, i) => (
            <Link
              key={intent.title}
              href={intent.href}
              className="group block rounded-sm focus-visible:outline-none focus-visible:ring-[var(--ring)]"
            >
              <div className="flex items-start gap-3.5">
                <span aria-hidden="true" className="font-display text-xl font-semibold tabular-nums text-[var(--muted-dim)] transition-colors group-hover:text-[var(--accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-base font-bold leading-snug text-[var(--foreground)]">
                    <span className="hl-link">{intent.title}</span>
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-[var(--muted-text)]">
                    {intent.desc}
                  </span>
                  <span className="mt-2.5 block text-xs font-semibold text-[var(--accent)]">
                    {intent.cta} →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand wall — the full catalog as a breathing grid (credibility strip).
          No band, no rules: logos on warm paper, names that mark on hover. */}
      <section data-placement="brand-wall" className="relative py-10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">
                <Highlight color="green">{companySummaries.length} companies</Highlight> · Updated {DATA_AS_OF}
              </p>
              <Link
                href="/companies"
                className="hidden text-xs font-semibold text-[var(--accent)] sm:inline"
              >
                <span className="hl-link">View all {companySummaries.length}</span>
              </Link>
            </div>
          </Reveal>
        </div>
        <BrandWall logos={marqueeLogos} />
      </section>

      {/* Interactive Tools Teaser — no band, no box: one highlighted promise + the tools. */}
      <section data-placement="tools-teaser" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <Reveal>
          <div className="py-4">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                  Interactive decision suite
                </p>
                <h2 className="text-2xl font-semibold leading-tight text-[var(--foreground)] md:text-3xl">
                  Calculate <Highlight>real costs</Highlight> &amp; compare services
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
        <MarkerRule className="mt-12" color="pink" />
      </section>

      {/* Popular comparisons — quick-start presets from the compare tool.
          No boxed grid: a breathing list where each preset title sweeps a
          marker on hover, logos leading the eye. */}
      <section data-placement="popular-comparisons" className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
        <SectionHeading
          eyebrow="Start With a Preset"
          title="Popular Comparisons"
          description="Jump straight into a side-by-side benchmark — pick a preset and compare fees, pricing models, and platform fit in one view."
        />

        <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((preset) => (
            <Link
              key={preset.name}
              href={`/compare?companies=${preset.slugs.join(",")}`}
              className="group block rounded-sm focus-visible:outline-none focus-visible:ring-[var(--ring)]"
            >
              <div className="flex items-center gap-2">
                {preset.slugs.map((slug) => (
                  <CompanyLogo key={slug} slug={slug} name={slug} size={26} decorative />
                ))}
              </div>
              <h3 className="mt-3.5 text-base font-bold leading-snug text-[var(--foreground)]">
                <span className="hl-link">{preset.name}</span>
              </h3>
              <p className="mt-1.5 text-xs text-[var(--muted-text)]">
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
            className="group inline-flex items-center gap-2.5 text-sm font-semibold text-[var(--foreground)]"
          >
            <span className="hl-link">Browse every payment gateway &amp; international payments option for India</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Recently verified updates — no boxes: each guide title marks on hover. */}
      <section data-placement="latest-guides" className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
        <SectionHeading
          eyebrow="Recently Verified"
          title="Latest Guides & Comparisons"
          description="The newest researched articles, with the dates they were last verified."
        />
        <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {recentArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="group block rounded-sm focus-visible:outline-none focus-visible:ring-[var(--ring)]"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted-text)]">
                {a.category} · <Highlight color="yellow">{a.displayDate}</Highlight>
              </p>
              <h3 className="mt-2 text-base font-bold leading-snug text-[var(--foreground)]">
                <span className="hl-link">{a.title}</span>
              </h3>
              <p className="mt-2 text-sm text-[var(--muted-text)]">Read the guide →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured companies — a marked ledger, not a card grid: logo, name that
          sweeps a marker on hover, tagline, and the chooser facts. No rules. */}
      <section data-placement="india-first" className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
        <SectionHeading
          eyebrow="India-First"
          title="India-First Providers"
          description="Profiles of the payment gateways and FX services Indian freelancers and businesses choose most — fee structures, strengths, weaknesses, and editorial sentiment."
        />
        <div className="mt-10 space-y-9">
          {featuredWithCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/companies/${c.slug}`}
              className="group flex flex-col gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-[var(--ring)] sm:flex-row sm:items-center sm:gap-6"
            >
              <div className="flex min-w-0 items-center gap-4 sm:w-[30%]">
                <CompanyLogo slug={c.slug} name={c.name} size={40} />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-[var(--foreground)]">
                    <span className="hl-link">{c.name}</span>
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
        <MarkerRule className="mt-12" color="green" />
        <div className="mt-10 text-center">
          <Link href="/companies" className="btn-ghost text-xs">
            View all {companySummaries.length} companies
          </Link>
        </div>
      </section>

      {/* Trust & independence — plan §7 #6 + #7, merged into one statement.
          No boxes, no ruled columns: proof lives in highlighted specifics. */}
      <section data-placement="trust" className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
        <SectionHeading
          eyebrow="Independence & Method"
          title="How FinTech Atlas Stays Trustworthy"
          description="The site stays free because it is honest about how it is funded — and keeps editorial choices separate from commercial inventory."
        />
        <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
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
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-base font-bold text-[var(--foreground)]">
                <Highlight color="yellow">{item.title}</Highlight>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)]">
                {item.desc}
              </p>
              <Link
                href={item.href}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]"
              >
                <span className="hl-link">{item.cta}</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter (plan §7 homepage section 8) — no box, no rules: one
          highlighted invitation with a marker stroke beneath. */}
      <section data-placement="newsletter" className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              Newsletter
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
              Fee changes &amp; <Highlight>new calculators</Highlight>, marked for you
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">
              A low-frequency update when pricing changes, tools ship, or new
              comparisons land. No tracking pixels, no resale — just the
              research.
            </p>
            <NewsletterOptIn />
          </div>
        </div>
        <MarkerRule className="mt-14" color="pink" />
      </section>

      {/* Compare CTA — a closing statement, not a box: big serif line with the
          cost of being wrong highlighted, two concrete next actions. */}
      <section data-placement="compare-cta" className="relative">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
          <h2 className="text-balance font-serif text-3xl font-bold leading-tight text-[var(--foreground)] md:text-4xl">
            The wrong gateway quietly costs <Highlight>1–3% of every rupee</Highlight> you earn.
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
