import type { Metadata } from "next";
import Link from "next/link";
import { companies } from "@/data";
import { globalDirectorySummaries } from "@/generated/global-directory-summaries";
import { indiaDirectorySummaries } from "@/generated/india-directory-summaries";
import { pageMetadata } from "@/lib/shared-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { Reveal } from "@/components/ui/reveal";
import { MarkerRule } from "@/components/ui/highlight";

function DirectoryIcon({ tier }: { tier: "curated" | "research" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-[var(--accent-ink)]"
    >
      {tier === "curated" ? (
        <>
          <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
          <path d="M9 7h6M9 11h6M9 15h4" />
        </>
      ) : (
        <>
          <path d="M12 3l8 4.5-8 4.5-8-4.5z" />
          <path d="M4 12l8 4.5 8-4.5" />
          <path d="M4 16.5L12 21l8-4.5" />
        </>
      )}
    </svg>
  );
}

export const metadata: Metadata = pageMetadata({
  pathname: "/directory",
  title: "FinTech Directory",
  description:
    "Three tiers of fintech profiles: curated editorial breakdowns, the worldwide research directory, and the full research directory of India fintech companies.",
});

export default async function DirectoryPage() {
  const curatedCount = companies.length;

  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "All directories", href: "/directory" },
        ]}
      />

      <Reveal>
        <header>
          <span className="eyebrow">FinTech Atlas directory</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
            The FinTech <span className="font-serif italic text-[var(--accent)]">Directory</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted-text)]">
            Every company on FinTech Atlas lives in one of three tiers. The
            curated profiles are editorial breakdowns — reviews, pricing,
            availability, ratings. The research directories are data-driven
            indexes: one worldwide, one India-specific, with funding,
            licences and verification notes.
          </p>
        </header>
      </Reveal>

      <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        <Reveal delay={0.1}>
          <Link
            href="/companies"
            data-placement="directory-curated"
            className="group flex h-full flex-col py-2 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 text-[var(--accent)]">
                <DirectoryIcon tier="curated" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  <span className="hl-link">Curated profiles</span>
                </h2>
                <p className="text-sm text-[var(--muted-text)]">{curatedCount} companies</p>
              </div>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted-text)]">
              Editorial breakdowns of the gateways, banks and fintech companies
              that matter most — with reviews, pricing, availability and India
              ratings, researched and written by the FinTech Atlas team.
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[var(--accent-ink)]">
              <span className="hl-link">Browse curated profiles</span> <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </Reveal>

        <Reveal delay={0.15}>
          <Link
            href="/global-directory"
            data-placement="directory-global-research"
            className="group flex h-full flex-col py-2 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 text-[var(--accent)]">
                <DirectoryIcon tier="research" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  <span className="hl-link">Global research directory</span>
                </h2>
                <p className="text-sm text-[var(--muted-text)]">
                  {globalDirectorySummaries.length.toLocaleString()} companies
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted-text)]">
              The data-driven index of fintech worldwide — payments, neobanks,
              lending, infrastructure and more across every region — with
              founding dates, funding, valuation and regulatory notes.
              Searchable and filterable.
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[var(--accent-ink)]">
              <span className="hl-link">Browse global research profiles</span>{" "}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </Reveal>

        <Reveal delay={0.2}>
          <Link
            href="/india/directory"
            data-placement="directory-research"
            className="group flex h-full flex-col py-2 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 text-[var(--accent)]">
                <DirectoryIcon tier="research" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  <span className="hl-link">India research directory</span>
                </h2>
                <p className="text-sm text-[var(--muted-text)]">
                  {indiaDirectorySummaries.length.toLocaleString("en-IN")} companies
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted-text)]">
              The data-driven index of Indian fintech — payments, lending,
              cross-border, wealth and more — with founding dates, funding,
              valuation and regulatory licence notes. Searchable and filterable.
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[var(--accent-ink)]">
              <span className="hl-link">Browse research profiles</span> <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </Reveal>
      </div>

      <Reveal delay={0.25}>
        <section className="mt-12">
          <MarkerRule color="green" />
          <h2 className="eyebrow mb-3 mt-6">Which tier should I use?</h2>
          <ul className="space-y-3 text-sm leading-relaxed text-[var(--muted-text)]">
            <li>
              <span className="font-semibold text-[var(--foreground)]">Compare gateways or services</span>{" "}
              — use curated profiles, which include pricing, reviews and ratings.
            </li>
            <li>
              <span className="font-semibold text-[var(--foreground)]">Research a market or discover companies</span>{" "}
              — use the research directories (global or India) to browse by
              cluster and category, with funding and regulatory notes.
            </li>
            <li>
              <span className="font-semibold text-[var(--foreground)]">You spot one name on two tiers</span>{" "}
              — each profile links to its counterpart, so you can move between
              the editorial breakdown and the research profile.
            </li>
          </ul>
        </section>
      </Reveal>
    </div>
  );
}
