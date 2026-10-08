import type { Metadata } from "next";
import Link from "next/link";
import { globalDirectorySummaries } from "@/generated/global-directory-summaries";
import { pageMetadata } from "@/lib/shared-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { Reveal } from "@/components/ui/reveal";
import { MarkerRule } from "@/components/ui/highlight";

function SurfaceIcon({ kind }: { kind: "directory" | "industry" }) {
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
      {kind === "directory" ? (
        <>
          <path d="M12 3l8 4.5-8 4.5-8-4.5z" />
          <path d="M4 12l8 4.5 8-4.5" />
          <path d="M4 16.5L12 21l8-4.5" />
        </>
      ) : (
        <>
          <path d="M4 6h16M4 12h16M4 18h16" />
          <path d="M8 6v12" />
        </>
      )}
    </svg>
  );
}

export const metadata: Metadata = pageMetadata({
  pathname: "/directory",
  title: "FinTech Directory",
  description:
    "One searchable index of fintech companies worldwide — organised by region and country, and grouped by industry.",
});

export default function DirectoryPage() {
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
            One index of every company on FinTech Atlas —{" "}
            {globalDirectorySummaries.length.toLocaleString()} fintech firms and
            financial institutions worldwide. Browse it geographically, or group
            the same set by industry instead.
          </p>
        </header>
      </Reveal>

      <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
        <Reveal delay={0.1}>
          <Link
            href="/global-directory"
            data-placement="directory-global-research"
            className="group flex h-full flex-col py-2 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 text-[var(--accent)]">
                <SurfaceIcon kind="directory" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  <span className="hl-link">Directory</span>
                </h2>
                <p className="text-sm text-[var(--muted-text)]">
                  {globalDirectorySummaries.length.toLocaleString()} companies · by region and country
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted-text)]">
              The full index, organised as an atlas: open a region, expand a
              country, and drill into founding dates, funding, valuation and
              regulatory notes. Searchable end to end.
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[var(--accent-ink)]">
              <span className="hl-link">Browse the directory</span>{" "}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </Reveal>

        <Reveal delay={0.15}>
          <Link
            href="/categories"
            data-placement="directory-categories"
            className="group flex h-full flex-col py-2 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 text-[var(--accent)]">
                <SurfaceIcon kind="industry" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  <span className="hl-link">By industry</span>
                </h2>
                <p className="text-sm text-[var(--muted-text)]">Payments, banking, lending and more</p>
              </div>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted-text)]">
              The same companies grouped by sector instead of geography — useful
              when you know the category you want rather than the market.
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[var(--accent-ink)]">
              <span className="hl-link">Browse by industry</span>{" "}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <section className="mt-12">
          <MarkerRule color="green" />
          <h2 className="eyebrow mb-3 mt-6">How to use it</h2>
          <ul className="space-y-3 text-sm leading-relaxed text-[var(--muted-text)]">
            <li>
              <span className="font-semibold text-[var(--foreground)]">Know the market?</span>{" "}
              open the directory by region and country.
            </li>
            <li>
              <span className="font-semibold text-[var(--foreground)]">Know the sector?</span>{" "}
              group the companies by industry instead.
            </li>
            <li>
              <span className="font-semibold text-[var(--foreground)]">Know the name?</span>{" "}
              search the directory — matches are marked as you type.
            </li>
          </ul>
        </section>
      </Reveal>
    </div>
  );
}
