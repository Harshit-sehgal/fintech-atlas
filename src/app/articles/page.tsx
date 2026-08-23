import type { Metadata } from "next";
import Link from "next/link";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/shared-metadata";
import { articles, categoryHref } from "@/data/articles";

export const metadata: Metadata = pageMetadata({
  pathname: "/articles",
  title: "Guides & Comparisons",
  description:
    "Plain-language comparisons and explainers of FinTech fees, providers, and platforms — written to help you choose, with free calculators to run the numbers.",
  ogDescription:
    "Plain-language comparisons and explainers of FinTech fees and providers, with free calculators.",
});

export default function ArticlesIndexPage() {
  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Articles", href: "/articles" },
        ]}
      />

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
            // Whole-card navigation uses an overlay link (same pattern as the
            // companies directory): nesting the category <Link> inside a
            // card-wide <Link> produces invalid nested anchors — the HTML
            // parser closes the outer one early and strips its accessible
            // name.
            <div
              key={a.slug}
              className="group relative surface rounded-lg border border-[var(--border-color)] p-5 hover:border-[var(--foreground)]/30 hover:-translate-y-0.5 transition-all"
            >
              <Link
                href={`/articles/${a.slug}`}
                aria-label={`Read ${a.title}`}
                className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-[var(--ring)]"
              >
                <span className="sr-only">Read {a.title}</span>
              </Link>
              <Link
                href={categoryHref(a.category)}
                className="relative z-20 inline-block rounded px-1.5 py-1.5 -mx-1.5 -my-1 align-top text-[10px] font-mono uppercase tracking-widest text-[var(--muted-text)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)]"
              >
                {a.category}
              </Link>
              <h2 className="mt-2 text-base font-bold text-[var(--foreground)]">{a.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted-text)]">{a.description}</p>
              <span className="mt-3 inline-block text-xs font-bold text-[var(--accent)]">Read →</span>
            </div>
          ))}
      </div>
    </div>
  );
}
