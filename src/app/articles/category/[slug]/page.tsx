import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { articleCategories, articles } from "@/data/articles";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { pageMetadata } from "@/lib/shared-metadata";

export function generateStaticParams() {
  return articleCategories.map((c) => ({ slug: c.slug }));
}

function getArticleCategoryBySlug(slug: string) {
  return articleCategories.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getArticleCategoryBySlug(slug);
  if (!cat) return { title: "Not Found" };
  return pageMetadata({
    pathname: `/articles/category/${cat.slug}`,
    title: `${cat.name} guides & comparisons`,
    description: cat.description,
  });
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ArticleCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getArticleCategoryBySlug(slug);
  if (!cat) notFound();

  const categoryArticles = articles
    .filter((a) => a.category === cat.name)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-[var(--muted-text)]">
        <Link href="/" className="transition-colors hover:text-[var(--foreground)]">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/articles" className="transition-colors hover:text-[var(--foreground)]">Articles</Link>
        <span aria-hidden>/</span>
        <span aria-current="page" className="font-medium text-[var(--foreground)]">{cat.name}</span>
      </nav>

      <header className="max-w-2xl">
        <span className="eyebrow">Guides by category</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl text-[var(--foreground)]">
          {cat.name} guides &amp; comparisons
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">{cat.description}</p>
        <p className="mt-2 text-xs font-mono text-[var(--muted-text)]">
          {categoryArticles.length} guide{categoryArticles.length === 1 ? "" : "s"}
        </p>
      </header>

      <ul className="mt-10 space-y-3">
        {categoryArticles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/articles/${article.slug}`}
              className="group flex flex-col gap-1 rounded-xl border border-[var(--border-color)] surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]/40"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-base font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {article.title}
                </h2>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-[var(--muted-text)]">
                  {formatDate(article.updatedAt)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--muted-text)]">{article.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-14 border-t border-[var(--border-color)] pt-8">
        <h2 className="eyebrow mb-4 text-[var(--muted-text)]">All categories</h2>
        <div className="flex flex-wrap gap-2">
          {articleCategories
            .filter((c) => c.slug !== cat.slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/articles/category/${c.slug}`}
                className="rounded-lg border border-[var(--border-color)] surface px-3.5 py-2 text-xs font-medium transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              >
                {c.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}