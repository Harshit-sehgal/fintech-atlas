import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutClient } from "./client";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "How FinTech Atlas was built: methodology, data sources, and what this site does and doesn't claim to do.";

export const metadata: Metadata = {
  title: "About & Methodology",
  description,
  alternates: { canonical: canonicalUrl("/about") },
  openGraph: {
    ...openGraphImage,
    title: "About & Methodology — FinTech Atlas",
    description,
    url: canonicalUrl("/about"),
  },
};

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading…</div>}>
      <AboutClient />
    </Suspense>
  );
}