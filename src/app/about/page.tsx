import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutClient } from "./client";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "How FinTech Atlas was built: methodology, data sources, and what this site does and doesn't claim to do.";

export const metadata: Metadata = {
  title: "About & Methodology",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    ...openGraphImage,
    title: "About & Methodology — FinTech Atlas",
    description,
    url: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading…</div>}>
      <AboutClient />
    </Suspense>
  );
}