import type { Metadata } from "next";
import { Suspense } from "react";
import HomePageClient from "./home-client";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";
import { articles } from "@/data/articles";

const description =
  "Compare Razorpay, Stripe, Cashfree, Wise, Payoneer and other payment services. Calculate fees, settlement amounts and provider differences for India.";

export const metadata: Metadata = {
  title: "Payment Gateway & International Payment Comparisons India",
  description,
  alternates: { canonical: "/" },
  // Page-level openGraph keeps og:title in sync with <title> (the title template
  // appends " — FinTech Atlas") and pins og:url to the homepage.
  openGraph: {
    ...openGraphImage,
    title: "Payment Gateway & International Payment Comparisons India — FinTech Atlas",
    description,
    url: SITE_URL,
  },
};

export default function HomePage() {
  // Plan §7 homepage section "Recently verified updates": newest three
  // articles, computed server-side so the client bundle never imports the
  // full articles data.
  const recentArticles = articles
    .map((article, index) => ({ article, index }))
    .sort(
      (a, b) =>
        b.article.updatedAt.localeCompare(a.article.updatedAt) || b.index - a.index,
    )
    .slice(0, 3)
    .map(({ article: a }) => ({
      slug: a.slug,
      title: a.title,
      category: a.category,
      displayDate: new Date(a.updatedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));

  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading…</div>}>
      <HomePageClient recentArticles={recentArticles} />
    </Suspense>
  );
}
