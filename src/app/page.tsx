import type { Metadata } from "next";
import HomePageClient from "./home-client";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";
import { articles } from "@/data/articles";
import { glossary } from "@/data/glossary";
import {
  globalDirectoryClusterNames,
  globalDirectorySummaries,
} from "@/generated/global-directory-summaries";
import { groupDirectory } from "@/lib/directory-groups";

const description =
  "An open reference to the companies reshaping finance — 3,000+ firms listed by region and country, with comparisons, calculators and plain-language guides.";

export const metadata: Metadata = {
  title: "FinTech Atlas — Global FinTech Directory & Tools",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    ...openGraphImage,
    title: "FinTech Atlas — Global FinTech Directory & Tools",
    description,
    url: SITE_URL,
  },
};

export default function HomePage() {
  // Region index is computed server-side from the generated directory so the
  // homepage never ships the full 3,000-record client subset.
  const regions = groupDirectory(
    globalDirectoryClusterNames,
    globalDirectorySummaries,
    (row) => row[3],
  ).map((r) => ({ name: r.name, total: r.total, countries: r.clusters.length }));

  // Newest three articles, computed server-side.
  const recentArticles = articles
    .map((article, index) => ({ article, index }))
    .sort(
      (a, b) =>
        b.article.updatedAt.localeCompare(a.article.updatedAt) || b.index - a.index,
    )
    .slice(0, 4)
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
    <HomePageClient
      regions={regions}
      companiesCount={globalDirectorySummaries.length}
      countriesCount={globalDirectoryClusterNames.length}
      recentArticles={recentArticles}
      articleCount={articles.length}
      glossaryCount={glossary.length}
    />
  );
}
