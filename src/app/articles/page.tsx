import type { Metadata } from "next";
import Link from "next/link";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Guides & Comparisons",
  description:
    "Plain-language comparisons and explainers of FinTech fees, providers, and platforms — written to help you choose, with free calculators to run the numbers.",
  alternates: { canonical: canonicalUrl("/articles") },
  openGraph: {
    ...openGraphImage,
    title: "Guides & Comparisons — FinTech Atlas",
    description:
      "Plain-language comparisons and explainers of FinTech fees and providers, with free calculators.",
    url: canonicalUrl("/articles"),
  },
};

export default function ArticlesIndexPage() {
  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />
      <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--muted-text)] font-mono">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-medium">Articles</span>
      </nav>

      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl text-[var(--foreground)]">
        Guides &amp; Comparisons
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted-text)]">
        Long-form comparisons and explainers that go with our interactive tools. Fees shown are
        illustrative published-rate assumptions from the catalog vintage, not live quotes.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {articles
          .map((article, index) => ({ article, index }))
          .sort(
            (a, b) =>
              b.article.updatedAt.localeCompare(a.article.updatedAt) || b.index - a.index,
          )
          .map(({ article: a }) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="surface rounded-2xl border border-[var(--border-color)] p-5 hover:border-[var(--foreground)]/30 hover:-translate-y-0.5 transition-all"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-text)]">
                {a.category}
              </span>
              <h2 className="mt-2 text-base font-bold text-[var(--foreground)]">{a.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted-text)]">{a.description}</p>
              <span className="mt-3 inline-block text-xs font-bold text-[var(--accent)]">Read →</span>
            </Link>
          ))}
      </div>
    </div>
  );
}
