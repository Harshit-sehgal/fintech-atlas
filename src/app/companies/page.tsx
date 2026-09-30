import type { Metadata } from "next";
import Link from "next/link";
import { CompaniesClient } from "./client";
import { indiaDirectorySummaries } from "@/generated/india-directory-summaries";
import { companySummaries } from "@/generated/company-summaries";
import { pageMetadata } from "@/lib/shared-metadata";
import StructuredData from "@/components/SEO/StructuredData";

const description =
  "Browse, filter, and compare top FinTech companies worldwide including Stripe, PayPal, Wise, Revolut, Robinhood, Plaid, and more.";

const pathname = "/companies";

export const metadata: Metadata = pageMetadata({
  pathname,
  title: "FinTech Companies Directory",
  description,
});

export default function CompaniesPage() {
  return (
    <>
      <StructuredData />
      <CompaniesClient />
      {/* Two-tier signpost (directory restructure): the curated catalog here
          is {companySummaries.length} deep; the research directory is far
          deeper. Say so, and route to the hub that indexes both — resolved
          server-side so the counts never ship to the client bundle. */}
      <div className="mx-auto max-w-6xl px-5 pb-16">
        <div className="flex flex-col items-start justify-between gap-4 border-t border-[var(--border-color)] pt-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-bold text-[var(--foreground)]">
              Looking beyond these {companySummaries.length} curated profiles?
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted-text)]">
              The India research directory tracks{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {indiaDirectorySummaries.length.toLocaleString()} companies
              </span>{" "}
              with licence and funding data — or browse both tiers from the hub.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/directory" className="btn-primary text-xs">
              Directory hub
            </Link>
            <Link href="/india/directory" className="btn-ghost text-xs">
              India research directory
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}