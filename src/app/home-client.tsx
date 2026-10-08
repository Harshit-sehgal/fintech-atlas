"use client";

import Link from "next/link";
import { useState } from "react";
import { companySummaries } from "@/generated/company-summaries";
import { Highlight, MarkerRule } from "@/components/ui/highlight";
import { CountUp } from "@/components/ui/count-up";
import { BrandWall } from "@/components/ui/brand-wall";
import { SponsorSlots } from "@/components/ui/sponsor-slots";

interface HomeProps {
  regions: { name: string; total: number; countries: number }[];
  companiesCount: number;
  countriesCount: number;
  recentArticles: { slug: string; title: string; category: string; displayDate: string }[];
  articleCount: number;
  glossaryCount: number;
}

const TOOLS: { label: string; href: string }[] = [
  { label: "Payment fee estimator", href: "/tools/calculator" },
  { label: "All calculators", href: "/tools/calculators" },
  { label: "FX markup calculator", href: "/tools/exchange-rate-markup-calculator" },
  { label: "Cross-border FX comparison", href: "/tools/remittance" },
  { label: "Matchmaker quiz", href: "/tools/matchmaker" },
  { label: "Razorpay fee calculator", href: "/tools/razorpay-fee-calculator" },
];

const REFERENCE: { label: string; href: string }[] = [
  { label: "Glossary", href: "/glossary" },
  { label: "About & method", href: "/about" },
  { label: "Changelog", href: "/changelog" },
  { label: "Saved", href: "/bookmarks" },
];

function Portal({
  title,
  href,
  cta,
  delayMs = 0,
  children,
}: {
  title: string;
  href: string;
  cta: string;
  delayMs?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rise" style={{ "--rise-delay": `${delayMs}ms` } as React.CSSProperties}>
      <div className="flex items-baseline justify-between gap-3 border-b border-[var(--border-color)] pb-1.5">
        <h2 className="font-serif text-lg font-bold tracking-tight text-[var(--foreground)]">{title}</h2>
        <Link href={href} className="shrink-0 text-xs font-medium text-[var(--accent)]">
          <span className="hl-link">{cta}</span> <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function LinkList({ items }: { items: { label: string; href: string; meta?: string }[] }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {items.map((item) => (
        <li key={item.href + item.label} className="flex items-baseline justify-between gap-3">
          <Link href={item.href} className="text-[var(--accent)] hover:underline">
            {item.label}
          </Link>
          {item.meta && (
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--muted-text)]">
              {item.meta}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function HomeSearch() {
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        window.location.href = query
          ? `/global-directory/?q=${encodeURIComponent(query)}`
          : "/global-directory/";
      }}
      className="mt-5 flex max-w-lg gap-2"
      role="search"
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search 3,000+ companies…"
        aria-label="Search the directory"
        className="w-full rounded-sm border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--accent)]"
      />
      <button type="submit" className="btn-primary shrink-0 text-xs">
        Go
      </button>
    </form>
  );
}

export default function HomePageClient({
  regions,
  companiesCount,
  countriesCount,
  recentArticles,
  articleCount,
  glossaryCount,
}: HomeProps) {
  const maxRegion = Math.max(...regions.map((r) => r.total));

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      {/* Lead */}
      <header className="border-b border-[var(--border-color)] pb-7">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
          FinTech Atlas
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-[var(--muted-text)] md:text-base">
          An open reference to the companies reshaping finance — a worldwide
          directory of banks, neobanks, payments and fintech, plus comparisons,
          calculators and plain-language guides.
        </p>
        <HomeSearch />
      </header>

      {/* Portal columns — an encyclopedia front page, not a marketing hero. */}
      <div className="grid gap-x-10 gap-y-9 py-8 sm:grid-cols-2 lg:grid-cols-3">
        <Portal title="Companies" href="/global-directory" cta={`All ${companiesCount.toLocaleString()}`} delayMs={0}>
          <p className="mb-3 text-xs text-[var(--muted-text)]">
            {regions.length} regions · {countriesCount} countries
          </p>
          <LinkList
            items={regions.map((r) => ({
              label: r.name,
              href: `/global-directory/?region=${encodeURIComponent(r.name)}`,
              meta: String(r.total),
            }))}
          />
        </Portal>

        <Portal title="By industry" href="/categories" cta="All industries" delayMs={60}>
          <LinkList
            items={[
              { label: "Payments", href: "/categories/payments" },
              { label: "Neobanking", href: "/categories/neobanks" },
              { label: "Lending", href: "/categories/lending" },
              { label: "Investing", href: "/categories/investing" },
              { label: "Cross-border", href: "/categories/cross-border" },
              { label: "BNPL", href: "/categories/bnpl" },
            ]}
          />
        </Portal>

        <Portal title="Tools" href="/tools" cta="All tools" delayMs={120}>
          <LinkList items={TOOLS} />
        </Portal>

        <Portal title="Reference" href="/glossary" cta={`${glossaryCount} terms`} delayMs={180}>
          <LinkList
            items={[
              { label: "Glossary", href: "/glossary", meta: String(glossaryCount) },
              ...REFERENCE.filter((r) => r.href !== "/glossary"),
            ]}
          />
        </Portal>
      </div>

      {/* Sponsors — ten labelled slots (see @/data/sponsors), placed early so
          they are seen above the fold-lines, not buried at the end. */}
      <section className="rise mt-10" style={{ "--rise-delay": "200ms" } as React.CSSProperties}>
        <div className="flex items-baseline justify-between gap-3 border-b border-[var(--border-color)] pb-1.5">
          <h2 className="font-serif text-lg font-bold tracking-tight text-[var(--foreground)]">
            Sponsors
          </h2>
          <Link href="/services" className="shrink-0 text-xs font-medium text-[var(--accent)]">
            <span className="hl-link">Become a sponsor</span> <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[var(--muted-text)]">
          Ten clearly-labelled slots. A sponsorship never affects a ranking or
          rating —{" "}
          <Link
            href="/affiliate-disclosure"
            className="text-[var(--accent)] underline underline-offset-2"
          >
            see how we disclose commercial ties
          </Link>
          .
        </p>
        <div className="mt-5">
          <SponsorSlots />
        </div>
      </section>

      {/* Visual band — real brand marks, then the geographic distribution. */}
      <section className="rise mt-10" style={{ "--rise-delay": "260ms" } as React.CSSProperties}>
        <div className="flex items-baseline justify-between gap-3 border-b border-[var(--border-color)] pb-1.5">
          <h2 className="font-serif text-lg font-bold tracking-tight text-[var(--foreground)]">
            Brands in the atlas
          </h2>
          <Link href="/companies" className="shrink-0 text-xs font-medium text-[var(--accent)]">
            <span className="hl-link">All profiles</span> <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-5">
          <BrandWall logos={companySummaries.slice(0, 24).map((c) => ({ slug: c.slug, name: c.name }))} />
        </div>
      </section>

      <section className="rise mt-10" style={{ "--rise-delay": "300ms" } as React.CSSProperties}>
        <div className="flex items-baseline justify-between gap-3 border-b border-[var(--border-color)] pb-1.5">
          <h2 className="font-serif text-lg font-bold tracking-tight text-[var(--foreground)]">
            Where the companies are
          </h2>
          <span className="shrink-0 text-xs text-[var(--muted-text)]">
            <Highlight color="green">
              <CountUp value={companiesCount} />
            </Highlight>{" "}
            companies
          </span>
        </div>
        <ul className="mt-4 space-y-2">
          {regions.map((r) => (
            <li
              key={r.name}
              className="grid grid-cols-[minmax(6rem,11rem)_1fr_auto] items-center gap-3 text-sm"
            >
              <Link
                href={`/global-directory/?region=${encodeURIComponent(r.name)}`}
                className="truncate text-[var(--accent)] hover:underline"
              >
                {r.name}
              </Link>
              <span aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-[var(--subtle-bg)]">
                <span
                  className="block h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${Math.round((r.total / maxRegion) * 100)}%` }}
                />
              </span>
              <span className="font-mono text-xs tabular-nums text-[var(--muted-text)]">
                {r.total.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <MarkerRule className="mt-4" animate />

      {/* Latest guides — newest first (updatedAt desc). Kept as its own section
          (not a portal) so the newest entry leads the list. */}
      <section className="rise mt-8" style={{ "--rise-delay": "300ms" } as React.CSSProperties}>
        <div className="border-b border-[var(--border-color)] pb-1.5">
          <h2 className="font-serif text-lg font-bold tracking-tight text-[var(--foreground)]">
            Latest Guides &amp; Comparisons
          </h2>
        </div>
        <ul className="mt-3 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentArticles.map((a) => (
            <li key={a.slug}>
              <Link href={`/articles/${a.slug}`} className="text-sm text-[var(--accent)] hover:underline">
                {a.title}
              </Link>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-[var(--muted-text)]">
                {a.category} · {a.displayDate}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          <Link href="/articles" className="text-sm text-[var(--accent)] underline underline-offset-2">
            All {articleCount} guides →
          </Link>
        </p>
      </section>

      {/* Regulatory changes — the "recent changes" strip of a reference work. */}
      <section className="rise mt-8" style={{ "--rise-delay": "360ms" } as React.CSSProperties}>
        <div className="flex items-baseline justify-between gap-3 border-b border-[var(--border-color)] pb-1.5">
          <h2 className="font-serif text-lg font-bold tracking-tight text-[var(--foreground)]">
            Regulatory changes
          </h2>
          <Link href="/radar/activity" className="shrink-0 text-xs font-medium text-[var(--accent)] hover:underline">
            Activity →
          </Link>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">
          Licence grants, suspensions and status changes across the paying-agent and
          authorisation registers.{" "}
          <Link
            href="/radar/activity"
            className="text-[var(--accent)] underline underline-offset-2"
          >
            See the latest events
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
