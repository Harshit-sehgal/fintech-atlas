import type { Metadata } from "next";
import { Suspense } from "react";
import CalculatorsClient from "./calculators-client";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Project SIP and SWP growth, estimate EMIs, inflation, retirement corpus, FIRE number, emergency fund, and net worth with illustrative calculators.";

export const metadata: Metadata = {
  title: "Personal Finance Calculators",
  description,
  alternates: { canonical: canonicalUrl("/tools/calculators") },
  openGraph: {
    ...openGraphImage,
    title: "Personal Finance Calculators — FinTech Atlas",
    description,
    url: canonicalUrl("/tools/calculators"),
  },
};

export default function CalculatorsPage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading calculators…</div>}>
      <CalculatorsClient />
    </Suspense>
  );
}
