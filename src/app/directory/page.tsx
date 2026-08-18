import type { Metadata } from "next";
import Link from "next/link";
import { companies } from "@/data";
import { indiaDirectorySummaries } from "@/generated/india-directory-summaries";
import { pageMetadata } from "@/lib/shared-metadata";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { Reveal } from "@/components/ui/reveal";

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
    "Two tiers of fintech profiles: curated editorial breakdowns of the companies that matter, plus the full research directory of India fintech companies.",
});

export default async function DirectoryPage() {
  const curatedCount = companies.length;

  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <Reveal>
        <header className="rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-7">
          <span className="eyebrow">FinTech Atlas directory</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
            The FinTech Directory
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted-text)]">
            Every company on FinTech Atlas lives in one of two tiers. The curated
            profiles are editorial breakdowns — reviews, pricing, availability,
            ratings. The research directory is a data-driven index of Indian
            fintech companies with funding, licences and verification notes.
          </p>
        </header>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Reveal delay={0.1}>
          <Link
            href="/companies"
            data-placement="directory-curated"
            className="group flex h-full flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6 transition-all duration-300 card-glow"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-glow)]">
                <DirectoryIcon tier="curated" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">Curated profiles</h2>
                <p className="text-xs text-[var(--muted-text)]">{curatedCount} companies</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted-text)]">
              Editorial breakdowns of the gateways, banks and fintech companies
              that matter most — with reviews, pricing, availability and India
              ratings, researched and written by the FinTech Atlas team.
            </p>
            <span className="mt-auto pt-5 text-sm font-semibold text-[var(--accent-ink)] inline-flex items-center gap-1.5">
              Browse curated profiles <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </span>
          </Link>
        </Reveal>

        <Reveal delay={0.15}>
          <Link
            href="/india/directory"
            data-placement="directory-research"
            className="group flex h-full flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6 transition-all duration-300 card-glow"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-glow)]">
                <DirectoryIcon tier="research" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">India research directory</h2>
                <p className="text-xs text-[var(--muted-text)]">
                  {indiaDirectorySummaries.length.toLocaleString("en-IN")} companies
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted-text)]">
              The data-driven index of Indian fintech — payments, lending,
              cross-border, wealth and more — with founding dates, funding,
              valuation and regulatory licence notes. Searchable and filterable.
            </p>
            <span className="mt-auto pt-5 text-sm font-semibold text-[var(--accent-ink)] inline-flex items-center gap-1.5">
              Browse research profiles <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </span>
          </Link>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <section className="mt-10 rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6">
          <h2 className="eyebrow mb-3">Which tier should I use?</h2>
          <ul className="space-y-3 text-sm leading-relaxed text-[var(--muted-text)]">
            <li>
              <span className="font-semibold text-[var(--foreground)]">Compare gateways or services</span>{" "}
              — use curated profiles, which include pricing, reviews and ratings.
            </li>
            <li>
              <span className="font-semibold text-[var(--foreground)]">Research the Indian market</span>{" "}
              — use the research directory to discover companies by cluster and
              category.
            </li>
            <li>
              <span className="font-semibold text-[var(--foreground)]">You spot one name on both tiers</span>{" "}
              — each profile links to its counterpart, so you can move between
              the editorial breakdown and the research profile.
            </li>
          </ul>
        </section>
      </Reveal>
    </div>
  );
}
