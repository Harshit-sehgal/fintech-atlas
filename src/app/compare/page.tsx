import type { Metadata } from "next";
import { Suspense } from "react";
import ComparePageClient from "./compare-client";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Compare FinTech companies across pricing, editorial sentiment, strengths, weaknesses, and notable customers. Values may have different dates and methodologies; use the matrix as an orientation tool.";

export const metadata: Metadata = {
  title: "Compare FinTech Companies Side-by-Side",
  description,
  alternates: { canonical: canonicalUrl("/compare") },
  openGraph: {
    ...openGraphImage,
    title: "Compare FinTech Companies Side-by-Side — FinTech Atlas",
    description,
    url: canonicalUrl("/compare"),
  },
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading comparison…</div>}>
      <ComparePageClient />
    </Suspense>
  );
}