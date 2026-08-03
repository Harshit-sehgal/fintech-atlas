"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import { companies, categories, glossary, getCompaniesByCategory } from "@/data";
import { DATA_AS_OF } from "@/lib/site-config";
import { SectionHeading } from "@/components/ui/section-heading";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { CompanyLogo } from "@/components/ui/company-logo";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Reveal } from "@/components/ui/reveal";
import { HomeHero } from "@/components/home/hero";
import { LogoMarquee } from "@/components/ui/logo-marquee";
import { formatValuationShort } from "@/lib/format-company";

export default function HomePageClient() {
  const featured = useMemo(() => companies.slice(0, 6), []);
  const marquee = useMemo(() => companies.slice(0, 32), []);

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
      <HomeHero />

      {/* Brand wall — auto-scrolling, hover-to-pause logo marquee */}
      <section className="relative border-y border-[var(--border-color)] bg-[var(--subtle-bg)]/30 py-10 overflow-hidden">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="mb-6 flex items-center justify-between">
              <p className="eyebrow">
                {companies.length}+ Brands · Updated {DATA_AS_OF}
              </p>
              <Link
                href="/companies"
                className="hidden text-xs font-semibold text-[var(--accent)] hover:underline decoration-[var(--accent)]/50 underline-offset-4 sm:inline"
              >
                View all {companies.length} →
              </Link>
            </div>
          </Reveal>
        </div>
        <LogoMarquee logos={marqueeLogos} />
      </section>

      {/* Verification ticker — data freshness & source coverage strip */}
      <section className="relative border-b border-[var(--border-color)] bg-[var(--subtle-bg)] py-6 overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 text-[11px] font-mono text-[var(--muted-text)]">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success">
              <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />
            </span>
            <span className="uppercase tracking-wider text-[var(--foreground)]">Verified</span>
            <span>{companies.length} brand profiles</span>
          </div>
          <span className="hidden sm:inline text-[var(--border-strong)]">/</span>
          <div className="flex items-center gap-2">
            <span className="text-success-text">▴</span>
            <span><strong className="text-[var(--foreground)] tabular-nums">{categories.length}</strong> industry categories</span>
          </div>
          <span className="hidden sm:inline text-[var(--border-strong)]">/</span>
          <div className="flex items-center gap-2">
            <span className="text-success-text">▴</span>
            <span><strong className="text-[var(--foreground)] tabular-nums">{glossary.length}+</strong> glossary terms decoded</span>
          </div>
          <span className="hidden sm:inline text-[var(--border-strong)]">/</span>
          <div className="flex items-center gap-2">
            <span className="text-warning-text">●</span>
            <span>Data refreshed <strong className="text-[var(--foreground)]">{DATA_AS_OF}</strong></span>
          </div>
          <span className="hidden sm:inline text-[var(--border-strong)]">/</span>
          <div className="flex items-center gap-2">
            <span className="text-success-text">✓</span>
            <span>12 independent sources cross-checked</span>
          </div>
        </div>
      </section>

      {/* Interactive Tools Teaser */}
      <section className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 overflow-hidden">
        <GridBackdrop fullBleed className="opacity-40" />
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border-color)] bg-gradient-to-br from-[var(--accent)]/10 via-[var(--accent-strong)]/5 to-emerald-500/10 p-8 md:p-12 shadow-2xl ambient-border">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/5 via-transparent to-emerald-500/5 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="max-w-xl space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/25 px-3 py-1 text-xs font-mono font-bold text-[var(--accent)]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  00 · Interactive Decision Suite
                </span>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-[var(--foreground)]">
                  Calculate Real Costs &amp; Compare Services
                </h2>
                <p className="text-sm text-[var(--muted-text)] leading-relaxed max-w-lg">
                  Estimate payment processing fees, calculate cross-border FX transfer markups, or take our interactive matchmaker quiz to find your ideal fintech stack.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/tools/calculator" className="btn-primary text-xs">
                  Fee Estimator →
                </Link>
                <Link href="/tools/remittance" className="btn-ghost text-xs">
                  Cross-Border FX →
                </Link>
                <Link href="/tools/matchmaker" className="btn-ghost text-xs">
                  Matchmaker Quiz →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* What is FinTech */}
      <section className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <SectionHeading
          eyebrow="01 · The Big Picture"
          title="What is FinTech?"
          description="'FinTech' — short for Financial Technology — is the broad name for software-powered financial services. It covers everything from the app you use to pay a friend (Venmo) to the API that charges a credit card on a website (Stripe) to the digital-only bank in your pocket (Chime, Revolut, Nubank)."
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
          eyebrow="02 · Navigate by Domain"
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
                    const count = getCompaniesByCategory(cat.slug).length;
                    return count > 0 ? (
                      <p className="mt-3 text-xs font-semibold text-[var(--accent)] font-mono">
                        {count} compan{count === 1 ? "y" : "ies"} →
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
          eyebrow="03 · Key Players"
          title="Featured Companies"
          description="Each profile breaks down product lines, fee structures, strengths, weaknesses, and verified user ratings."
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
                        <CompanyLogo slug={c.slug} size={40} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{c.name}</h3>
                        <p className="mt-0.5 truncate text-xs text-[var(--muted-text)] font-mono">{formatValuationShort(c.valuation)}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-lg bg-[var(--success)]/10 px-2.5 py-1 text-xs font-mono font-bold text-success-text border border-[var(--success)]/20">
                      ★ {c.userReviews.rating}
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
              View all {companies.length} companies →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Glossary teaser */}
      <section className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)]">
        <SectionHeading
          eyebrow="04 · Jargon Decoder"
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
                  <span className="text-[10px] font-mono text-[var(--muted-text)] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
                <span className="text-[var(--muted-text)] text-[11px] truncate">{g.short}</span>
              </Link>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-6 text-center">
            <Link href="/glossary" className="btn-ghost text-xs">
              Browse all {glossary.length} terms →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Compare CTA */}
      <section className="relative mx-auto max-w-6xl px-5 py-16 md:py-24 border-t border-[var(--border-color)] overflow-hidden">
        <GridBackdrop fullBleed />
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--subtle-bg)]/40 p-8 text-center md:p-14 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <Reveal>
              <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)] font-mono">
                <span className="inline-block h-px w-6 bg-[var(--accent)]/50" />
                05 · Side-by-Side
              </p>
              <h2 className="text-2xl font-bold tracking-tight md:text-4xl text-[var(--foreground)]">
                Compare Side-by-Side
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted-text)]">
                Select up to 3 companies to see how they stack up across pricing, ratings, core features, strengths, and weaknesses — all in one view.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Link href="/compare" className="btn-primary mt-7">
                Open Comparison Matrix →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
