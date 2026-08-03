import type { Metadata } from "next";
import { Suspense } from "react";
import ComparePageClient from "./compare-client";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Benchmark FinTech companies across pricing, user rating, strengths, weaknesses, and notable customers. Select up to 3 companies or use our preset battle cards.";

export const metadata: Metadata = {
  title: "Compare FinTech Companies Side-by-Side",
  description,
  alternates: { canonical: "/compare" },
  openGraph: {
    ...openGraphImage,
    title: "Compare FinTech Companies Side-by-Side — FinTech Atlas",
    description,
    url: `${SITE_URL}/compare`,
  },
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading comparison…</div>}>
      <ComparePageClient />
    </Suspense>
  );
}