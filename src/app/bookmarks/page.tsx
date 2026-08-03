import type { Metadata } from "next";
import { Suspense } from "react";
import BookmarksPageClient from "./bookmarks-client";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Your saved FinTech company profiles and glossary terms, stored locally in your browser. Build a personal FinTech knowledge base.";

export const metadata: Metadata = {
  title: "Saved Items & Bookmarks",
  description,
  alternates: { canonical: canonicalUrl("/bookmarks") },
  openGraph: {
    ...openGraphImage,
    title: "Saved Items & Bookmarks — FinTech Atlas",
    description,
    url: canonicalUrl("/bookmarks"),
  },
};

export default function BookmarksPage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading bookmarks…</div>}>
      <BookmarksPageClient />
    </Suspense>
  );
}
