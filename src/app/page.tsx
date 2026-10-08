import type { Metadata } from "next";
import HomePageClient from "./home-client";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";
import { articles } from "@/data/articles";
import { glossary } from "@/data/glossary";

const description =
  "Browse 3,000+ fintech companies and financial institutions worldwide, compare payment services, and calculate real fees in the open.";

export const metadata: Metadata = {
  title: "FinTech Atlas — Global FinTech Directory & Tools",
  description,
  alternates: { canonical: "/" },
  // Page-level openGraph keeps og:title in sync with <title> (Next.js renders
  // the root page title verbatim, without the layout's template) and pins
  // og:url to the homepage.
  openGraph: {
    ...openGraphImage,
    title: "FinTech Atlas — Global FinTech Directory & Tools",
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

  // Note: No Suspense wrapper around HomePageClient — static export pre-renders
  // the page fully at build time. A Suspense boundary around a client component
  // causes Next.js to defer rendering and ship only the fallback skeleton,
  // triggering React hydration error #418 on mount.
  // `glossaryCount` is resolved here rather than imported in the client
  // component: the hero's stat band took a `glossaryCount` prop with a default
  // of 0 that nothing ever passed, so the homepage advertised "0 Glossary
  // terms" while the glossary had 53. Passing it server-side keeps the fix free
  // of client-bundle cost (the generated glossary summaries are 53 entries).
  return (
    <HomePageClient
      recentArticles={recentArticles}
      articleCount={articles.length}
      glossaryCount={glossary.length}
    />
  );
}
