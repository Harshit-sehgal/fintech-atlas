import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import {
  indiaDirectoryCount,
  indiaDirectoryClusters,
} from "@/generated/india-directory";
import { IndiaDirectoryClient } from "./client";

export const metadata: Metadata = {
  title: "India FinTech Directory (1,386 companies)",
  description:
    "Searchable directory of Indian fintech companies with founder, funding, valuation, RBI licence, and website data compiled from public sources.",
  alternates: { canonical: canonicalUrl("/india/directory") },
  openGraph: {
    ...openGraphImage,
    title: "India FinTech Directory (1,386 companies)",
    description:
      "Searchable directory of Indian fintech companies — founders, funding, valuations, licences, and websites.",
    url: canonicalUrl("/india/directory"),
  },
};

export default function IndiaDirectoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <Link
        href="/india/"
        className="inline-flex items-center gap-1 text-sm text-[var(--muted-text)] transition-colors hover:text-[var(--accent)]"
      >
        <span aria-hidden>←</span> Back to India hub
      </Link>

      <header className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          India FinTech Directory
        </h1>
        <p className="mt-4 text-[var(--fg-dim)]">
          {indiaDirectoryCount} Indian fintech companies across{" "}
          {indiaDirectoryClusters.length} research clusters — founders, funding
          raised, valuations, RBI licences, and websites, compiled from public
          sources. Search by name or category, filter by cluster, and open a
          profile for the full verified record.
        </p>
      </header>

      <IndiaDirectoryClient />

      <section className="mt-16 border-t border-[var(--border-color)] pt-8">
        <h2 className="text-lg font-semibold">Clusters covered</h2>
        <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {indiaDirectoryClusters.map((cluster) => (
            <li key={cluster.name} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-[var(--fg-dim)]">{cluster.name}</span>
              <span className="shrink-0 text-xs text-[var(--muted-text)]">{cluster.count}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-[var(--muted-text)]">
          Research-only data compiled 2026-08-15 from public sources. Fields
          marked &ldquo;n/a&rdquo; could not be publicly verified; &ldquo;~&rdquo;
          marks approximate values. See the companion research files in the
          project repository for methodology and the master name list.
        </p>
      </section>
    </div>
  );
}
