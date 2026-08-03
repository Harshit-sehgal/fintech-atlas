import type { Metadata } from "next";
import { Suspense } from "react";
import HomePageClient from "./home-client";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "A clear, plain-language guide to the FinTech industry: what each company does, how they differ, how they make money, and what real users think. Sourced from official companies and verified review aggregators.";

export const metadata: Metadata = {
  title: "Understand the companies reshaping finance",
  description,
  alternates: { canonical: "/" },
  // Page-level openGraph keeps og:title in sync with <title> (the title template
  // appends " — FinTech Atlas") and pins og:url to the homepage.
  openGraph: {
    ...openGraphImage,
    title: "Understand the companies reshaping finance — FinTech Atlas",
    description,
    url: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading…</div>}>
      <HomePageClient />
    </Suspense>
  );
}
