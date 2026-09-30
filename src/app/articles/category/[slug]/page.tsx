import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { articleCategories, articles } from "@/data/articles";
import { Breadcrumbs } from "@/components/breadcrumbs";
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
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Guides", href: "/articles" },
          { name: cat.name, href: `/articles/category/${cat.slug}` },
        ]}
      />

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

      <ul className="mt-8 border-t border-[var(--border-color)]">
        {categoryArticles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/articles/${article.slug}`}
              className="group flex flex-col gap-1 border-b border-[var(--border-color)] py-5 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-base font-bold tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                  {article.title}
                </h2>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-[var(--muted-text)]">
                  {formatDate(article.updatedAt)}
                </span>
              </div>
              <p className="max-w-3xl text-sm leading-relaxed text-[var(--muted-text)]">{article.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-14 border-t border-[var(--border-color)] pt-8">
        <h2 className="eyebrow mb-4 text-[var(--muted-text)]">All categories</h2>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {articleCategories
            .filter((c) => c.slug !== cat.slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/articles/category/${c.slug}`}
                className="text-sm font-medium text-[var(--muted-text)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
              >
                {c.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
