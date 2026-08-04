"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import { categories } from "@/data/categories";
import { glossary } from "@/data/glossary";
import {
  companySummaries,
  companySummaryCountByCategory,
  getCompanySummaryBySlug,
} from "@/generated/company-summaries";
import { PRESETS } from "@/data/compare-presets";
import { DATA_AS_OF } from "@/lib/site-config";
import { SectionHeading } from "@/components/ui/section-heading";
import { CompanyLogo } from "@/components/ui/company-logo";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Reveal } from "@/components/ui/reveal";
import { HomeHero } from "@/components/home/hero";
import { LogoMarquee } from "@/components/ui/logo-marquee";
import { formatValuationShort } from "@/lib/format-company";

// India-first featured providers (plan §7: "India-specific provider
// directory"). Curated order so the homepage leads with the Indian market.
const FEATURED_SLUGS: readonly string[] = ["razorpay", "cashfree", "payoneer", "wise", "phonepe", "paytm"];

export default function HomePageClient({
  recentArticles,
}: {
  recentArticles: { slug: string; title: string; category: string; displayDate: string }[];
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
    name: c.name
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

  // Precompute glossary slice to avoid slicing on every render
  const glossaryPreview = useMemo(() => glossary.slice(0, 12), []);

  return (
    <>
      <HomeHero glossaryCount={glossary.length} />

      {/* Brand wall — auto-scrolling, hover-to-pause logo marquee */}
      <section className="relative border-y border-[var(--border-color)] bg-[var(--subtle-bg)]/30 py-10 overflow-hidden">
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
        <LogoMarquee logos={marqueeLogos} />
      </section>

      {/* Interactive Tools Teaser */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <Reveal>
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-8 md:p-12">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                  Interactive decision suite
                </p>
                <h2 className="text-2xl font-semibold leading-tight text-[var(--foreground)] md:text-3xl">
                  Calculate real costs &amp; compare services
                </h2>
                <p className="text-sm leading-relaxed text-[var(--muted-text)]">
                  Estimate payment processing fees, explore illustrative
                  cross-border FX scenarios, or take the matchmaker quiz to
                  build an initial fintech shortlist.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/tools/calculator" className="btn-primary text-xs">
                  Fee Estimator
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
      <section className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <SectionHeading
          eyebrow="Start With a Preset"
          title="Popular Comparisons"
          description="Jump straight into a side-by-side benchmark — pick a preset and compare fees, pricing models, and platform fit in one view."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger">
          {PRESETS.map((preset) => (
            <Link
              key={preset.name}
              href={`/compare?companies=${preset.slugs.join(",")}`}
              className="group block rounded-2xl border border-[var(--border-color)] p-5 transition-all duration-300 card-glow h-full"
            >
              <div className="flex items-center gap-2">
                {preset.slugs.map((slug) => (
                  <CompanyLogo key={slug} slug={slug} name={slug} size={28} decorative />
                ))}
              </div>
              <h3 className="mt-4 text-base font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                {preset.name}
              </h3>
              <p className="mt-1 text-xs text-[var(--muted-text)]">Open the side-by-side comparison →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently verified updates — plan §7 homepage section */}
      <section className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <SectionHeading
          eyebrow="Recently Verified"
          title="Latest Guides & Comparisons"
          description="The newest researched articles, with the dates they were last verified."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3 reveal-stagger">
          {recentArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="group block rounded-2xl border border-[var(--border-color)] p-5 transition-all duration-300 card-glow h-full"
            >
              <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-text)]">
                {a.category} · {a.displayDate}
              </p>
              <h3 className="mt-2 text-base font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                {a.title}
              </h3>
              <p className="mt-2 text-xs text-[var(--muted-text)]">Read the guide →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* What is FinTech */}
      <section className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <SectionHeading
          eyebrow="The Big Picture"
          title="What is FinTech?"
          description="'FinTech' — short for Financial Technology — is software-powered financial services: the app you use to pay a friend, the API that charges a card on a website, the digital-only bank in your pocket. In India it means UPI instant payments, QR-first checkouts, and gateways like Razorpay moving hundreds of millions of transactions every month."
        />
        <Reveal delay={0.1}>
          <div className="mt-10 grid gap-5 md:grid-cols-3 reveal-stagger">
            {[
              {
                title: "Speed & Automation",
                desc: "Transactions that used to take days now clear in seconds. Accounts open in minutes instead of weeks.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
                  </svg>
                ),
              },
              {
                title: "Financial Inclusion",
                desc: "FinTechs serve populations traditional banks ignored: thin-file borrowers, gig workers, immigrants, and startups.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                ),
              },
              {
                title: "Pricing Transparency",
                desc: "Hidden bank markups are replaced by transparent pricing, mid-market FX rates, and clear breakdowns.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M9 13h6M9 17h4" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="surface rounded-2xl border border-[var(--border-color)] p-6 card-glow group">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-glow)] text-[var(--accent)] group-hover:scale-110 group-hover:bg-[var(--accent)]/20 transition-all duration-300">
                  {item.svg}
                </div>
                <h3 className="mt-4 text-base font-bold text-[var(--foreground)]">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--muted-text)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Categories */}
      <section className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <SectionHeading
          eyebrow="Navigate by Domain"
          title="Industry Categories"
          description="FinTech spans many specialized domains. Each category addresses a distinct problem in global finance."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              style={{ ["--accent"]: cat.accent } as CSSProperties}
              className="group block rounded-2xl border border-[var(--border-color)] p-5 transition-all duration-300 card-glow h-full"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-glow)] group-hover:scale-110 transition-transform duration-300">
                  <CategoryIcon icon={cat.icon} color={cat.accent} size={28} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{cat.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--muted-text)] line-clamp-2">{cat.short}</p>
                  {(() => {
                    const count = companySummaryCountByCategory(cat.slug);
                    return count > 0 ? (
                      <p className="mt-3 text-xs font-medium text-[var(--muted-text)]">
                        {count} compan{count === 1 ? "y" : "ies"}
                      </p>
                    ) : null;
                  })()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured companies */}
      <section className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <SectionHeading
          eyebrow="India-First"
          title="India-First Providers"
          description="Profiles of the payment gateways and FX services Indian freelancers and businesses choose most — fee structures, strengths, weaknesses, and editorial sentiment."
        />
        <Reveal delay={0.1}>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger">
            {featuredWithCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/companies/${c.slug}`}
                style={{ ["--accent"]: c.accent } as CSSProperties}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--border-color)] p-5 transition-all duration-300 card-glow h-full"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <CompanyLogo slug={c.slug} name={c.name} size={40} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{c.name}</h3>
                        <p className="mt-0.5 truncate text-xs text-[var(--muted-text)]">{formatValuationShort(c.valuation)}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-lg bg-[var(--success)]/10 px-2.5 py-1 text-xs font-semibold text-success-text border border-[var(--success)]/20">
                      ★ {c.rating}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-[var(--muted-text)] leading-relaxed line-clamp-2">{c.tagline}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-[var(--border-color)]">
                  {c.categoryObjects.map((cat) => (
                    cat ? (
                      <span key={cat.slug} className="rounded-full border border-[var(--border-color)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--muted-text)] group-hover:border-[var(--accent)]/30 transition-colors">
                        {cat.name}
                      </span>
                    ) : null
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 text-center">
            <Link href="/companies" className="btn-ghost text-xs">
              View all {companySummaries.length} companies
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Glossary teaser */}
      <section className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <SectionHeading
          eyebrow="Jargon Decoder"
          title="Glossary &amp; Terms"
          description="Every term explained simply. Hover or click to decode financial jargon."
        />
        <Reveal delay={0.1}>
          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger">
            {glossaryPreview.map((g) => (
              <Link
                key={g.slug}
                href={`/glossary#${g.slug}`}
                className="surface rounded-xl border border-[var(--border-color)] p-3.5 text-xs transition-all hover:border-[var(--accent)]/40 hover:-translate-y-0.5 flex flex-col gap-1 group"
              >
                <div className="font-bold flex items-center justify-between">
                  <span className="group-hover:text-[var(--accent)] transition-colors">{g.term}</span>
                </div>
                <span className="text-[var(--muted-text)] text-[11px] truncate">{g.short}</span>
              </Link>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-6 text-center">
            <Link href="/glossary" className="btn-ghost text-xs">
              Browse all {glossary.length} terms
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Compare CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--card)] p-8 text-center md:p-14">
          <div>
            <Reveal>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                Side-by-Side
              </p>
              <h2 className="text-2xl font-semibold tracking-tight md:text-4xl text-[var(--foreground)]">
                Compare Side-by-Side
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted-text)]">
                Select up to 3 companies to see how they stack up across pricing,
                ratings, core features, strengths, and weaknesses — all in one view.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Link href="/compare" className="btn-primary mt-7">
                Open Comparison Matrix
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
