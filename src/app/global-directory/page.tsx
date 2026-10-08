import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { globalDirectoryCount } from "@/generated/global-directory";
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
          {globalDirectoryCount.toLocaleString()} fintech companies and
          financial institutions, organised by region and country — founders,
          funding raised, valuations, regulatory notes, and websites, compiled
          from public sources. Search, or open a region and expand a country.
        </p>
      </header>

      <GlobalDirectoryClient />

      <p className="mt-10 max-w-2xl text-xs leading-relaxed text-[var(--muted-text)]">
        Research-only data compiled from public sources. Fields marked
        &ldquo;n/a&rdquo; could not be publicly verified; &ldquo;~&rdquo; marks
        approximate values. See the companion research file in the project
        repository for methodology and source dates.
      </p>
    </div>
  );
}
