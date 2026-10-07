import type { Metadata } from "next";
import Link from "next/link";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/shared-metadata";
import { articles, getArticleCategory } from "@/data/articles";
import { Highlight } from "@/components/ui/highlight";

export const metadata: Metadata = pageMetadata({
  pathname: "/articles",
  title: "Guides & Comparisons",
  description:
    "Plain-language comparisons and explainers of FinTech fees, providers, and platforms — written to help you choose, with free calculators to run the numbers.",
  ogDescription:
    "Plain-language comparisons and explainers of FinTech fees and providers, with free calculators.",
});

// Group every guide by its primary category (the article's own taxonomy,
// resolved through `getArticleCategory`) so the index reads as a topical hub
// instead of one long reverse-chronological wall. Order follows first appearance
// in the catalog, which keeps the most-established clusters near the top.
const articlesByCategory = (() => {
  const groups = new Map<string, typeof articles>();
  for (const a of articles) {
    if (!groups.has(a.category)) groups.set(a.category, []);
    groups.get(a.category)!.push(a);
  }
  return [...groups.entries()].map(([name, items]) => ({
    category: getArticleCategory(name) ?? null,
    name,
    items: [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  }));
})();

export default function ArticlesIndexPage() {
  return (
    <div className="relative mx-auto max-w-5xl px-5 py-20 md:py-28">
      <GridBackdrop />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Guides", href: "/articles" },
        ]}
      />

      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl text-[var(--foreground)]">
        Guides &amp; <span className="font-serif italic text-[var(--accent)]">Comparisons</span>
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted-text)]">
        Long-form comparisons and explainers that go with our interactive tools, grouped by the
        decision they help with. Fees shown are illustrative published-rate assumptions from the
        catalog vintage, not live quotes.
      </p>

      <div className="mt-12 space-y-14">
        {articlesByCategory.map(({ category, name, items }) => {
          const anchor = category?.slug ?? name;
          return (
          <section key={anchor} aria-labelledby={`articles-${anchor}`}>
            <div className="flex items-end justify-between gap-4 pb-3">
              <h2
                id={`articles-${anchor}`}
                className="text-xl font-bold tracking-tight text-[var(--foreground)]"
              >
                {category?.name ?? name}
                <span className="ml-2 align-middle text-sm font-normal text-[var(--muted-text)]">
                  {items.length}
                </span>
              </h2>
              {category && (
                <Link
                  href={`/articles/category/${category.slug}`}
                  className="hidden text-sm font-semibold text-[var(--accent)] hover:underline underline-offset-4 sm:inline"
                >
                  <span className="hl-link">View category →</span>
                </Link>
              )}
            </div>

            <div className="mt-4">
              {items.map((a) => (
                // Whole-row navigation uses an overlay link (same pattern as
                // the companies directory): nesting the category <Link> inside
                // a row-wide <Link> produces invalid nested anchors — the HTML
                // parser closes the outer one early and strips its accessible
                // name.
                <div
                  key={a.slug}
                  className="group relative py-5"
                >
                  <Link
                    href={`/articles/${a.slug}`}
                    aria-label={`Read ${a.title}`}
                    className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-[var(--ring)]"
                  >
                    <span className="sr-only">Read {a.title}</span>
                  </Link>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted-text)]">
                    Last verified <Highlight color="yellow" animate={false}>{new Date(a.updatedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}</Highlight>
                  </p>
                  <h3 className="mt-1.5 pr-8 text-base font-bold text-[var(--foreground)]">
                    <span className="hl-link">{a.title}</span>
                  </h3>
                  <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[var(--muted-text)]">{a.description}</p>
                  <span className="mt-2 inline-block text-xs font-bold text-[var(--accent)]">
                    <span className="hl-link">Read →</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
          );
        })}
      </div>
    </div>
  );
}
