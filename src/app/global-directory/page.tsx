import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import {
  globalDirectoryCount,
  globalDirectoryClusters,
} from "@/generated/global-directory";
import { GlobalDirectoryClient } from "./client";

export const metadata: Metadata = generateDirectoryMetadata();

function generateDirectoryMetadata(): Metadata {
  const title = `Global FinTech Directory (${globalDirectoryCount.toLocaleString()} companies)`;
  return {
    title,
    description:
      "Searchable directory of fintech companies worldwide — founders, funding, valuations, regulatory notes, and websites compiled from public sources.",
    alternates: { canonical: canonicalUrl("/global-directory") },
    openGraph: {
      ...openGraphImage,
      title,
      description:
        "Searchable directory of fintech companies worldwide — founders, funding, valuations, regulatory notes, and websites.",
      url: canonicalUrl("/global-directory"),
    },
  };
}

export default function GlobalDirectoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "All directories", href: "/directory" },
          { name: "Global directory", href: "/global-directory" },
        ]}
      />

      <header className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Global FinTech Directory
        </h1>
        <p className="mt-4 text-[var(--fg-dim)]">
          {globalDirectoryCount.toLocaleString()} fintech companies worldwide
          across {globalDirectoryClusters.length} research clusters — founders,
          funding raised, valuations, regulatory notes, and websites, compiled
          from public sources. Search by name or category, filter by cluster,
          and open a profile for the full record.
        </p>
      </header>

      <GlobalDirectoryClient />

      <section className="mt-16 border-t border-[var(--border-color)] pt-8">
        <h2 className="text-lg font-semibold">Clusters covered</h2>
        <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {globalDirectoryClusters.map((cluster) => (
            <li key={cluster.name} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-[var(--fg-dim)]">{cluster.name}</span>
              <span className="shrink-0 text-xs text-[var(--muted-text)]">{cluster.count}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-[var(--muted-text)]">
          Research-only data compiled from public sources. Fields marked
          &ldquo;n/a&rdquo; could not be publicly verified; &ldquo;~&rdquo;
          marks approximate values. Companies headquartered in India are
          indexed separately in the India research directory. See the
          companion research file in the project repository for methodology.
        </p>
      </section>
    </div>
  );
}
