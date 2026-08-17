import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/shared-metadata";
import { indiaDirectoryCount } from "@/generated/india-directory";
import {
  radarFacetCount,
  radarLicenceNames,
  radarRegulatorNames,
  radarSectorNames,
} from "@/generated/radar-facets";
import { RadarClient } from "./radar-client";

export const metadata: Metadata = pageMetadata({
  pathname: "/radar",
  title: "FinTech Radar — India Fintech Intelligence",
  description:
    "Search and filter the FinTech Atlas research directory of Indian fintech companies by sector, regulator, licence, founding year and funding — a free preview of the Radar intelligence surface.",
});

export default function RadarPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:py-20">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "India", href: "/india" },
          { name: "FinTech Radar", href: "/radar" },
        ]}
      />

      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          FinTech Radar
        </h1>
        <p className="mt-4 text-[var(--fg-dim)]">
          An intelligence view over the {indiaDirectoryCount.toLocaleString()} Indian
          fintech companies in the FinTech Atlas research directory. Search by
          name or category, then narrow by sector, regulator, licence, founding
          year and funding — the filter set a payments or regulated-fintech team
          actually uses. This is the free preview; every profile links back to
          the full verified directory record.
        </p>
      </header>

      <RadarClient />

      <section className="mt-16 border-t border-[var(--border-color)] pt-8">
        <h2 className="text-lg font-semibold">What filters mean</h2>
        <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm text-[var(--fg-dim)] sm:grid-cols-2 lg:grid-cols-3">
          <li>
            <span className="font-medium text-[var(--foreground)]">Sector</span> —{" "}
            {radarSectorNames.join(" · ")}
          </li>
          <li>
            <span className="font-medium text-[var(--foreground)]">Regulator</span> —{" "}
            {radarRegulatorNames.join(" · ")}
          </li>
          <li>
            <span className="font-medium text-[var(--foreground)]">Licence</span> —{" "}
            {radarLicenceNames.join(" · ")}
          </li>
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-[var(--muted-text)]">
          Sectors and regulators are derived from the research cluster names in
          the enriched directory, never asserted per company; licences come from
          licence-labelled clusters and each record&rsquo;s own licence text.
          Founded years and funding figures are parsed from the same records
          (&ldquo;n/a&rdquo; when the research file could not verify them).
          Companies without a known founding year or USD funding are excluded
          when a range filter is active. See the{" "}
          <Link
            href="/india/directory"
            className="font-medium text-[var(--accent)] transition-colors hover:underline"
          >
            full directory
          </Link>{" "}
          for the source records and methodology. {radarFacetCount.toLocaleString()}{" "}
          companies covered.
        </p>
      </section>
    </div>
  );
}