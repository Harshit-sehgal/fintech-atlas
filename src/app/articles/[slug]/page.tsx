import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { PartnerCta } from "@/components/ui/partner-cta";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { articles, getArticleBySlug, type ArticleBlock } from "@/data/articles";
import { getCompanyBySlug } from "@/data";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CorrectionReportLink } from "@/components/ui/correction-report-link";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not Found" };
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: canonicalUrl(`/articles/${article.slug}`) },
    openGraph: {
      ...openGraphImage,
      type: "article",
      title: article.title,
      description: article.description,
      url: canonicalUrl(`/articles/${article.slug}`),
    },
  };
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-10 text-xl font-bold tracking-tight text-[var(--foreground)]">
          {block.text}
        </h2>
      );
    case "ul":
      return (
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--muted-text)]">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border-color)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--subtle-bg)]/40">
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--muted-text)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-[var(--border-color)] last:border-0">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-4 py-2 ${
                        j === 0 ? "font-semibold text-[var(--foreground)]" : "text-[var(--muted-text)]"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return (
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted-text)]">{block.text}</p>
      );
  }
}


export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = article.relatedCompanySlugs
    .map((s) => getCompanyBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: "FinTech Atlas" },
    publisher: {
      "@type": "Organization",
      name: "FinTech Atlas",
      url: canonicalUrl(""),
    },
    mainEntityOfPage: canonicalUrl(`/articles/${article.slug}`),
  };

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Articles", href: "/articles" },
    { name: article.category, href: `/articles/${article.slug}` },
  ];

  return (
    <div className="relative mx-auto max-w-3xl px-5 py-20 md:py-28">
      <GridBackdrop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <header>

        <span className="eyebrow">{article.category}</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl text-[var(--foreground)]">
          {article.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">{article.description}</p>
        <p className="mt-3 text-[11px] font-mono text-[var(--muted-text)]">
          {formatDate(article.updatedAt)} &middot; Updated regularly &middot; By{" "}
          <Link href="/about" className="underline decoration-dotted underline-offset-2 transition-colors hover:text-[var(--foreground)]">
            FinTech Atlas
          </Link>
          {" · "}
          <Link
            href="/about#methodology"
            className="underline decoration-dotted underline-offset-2 transition-colors hover:text-[var(--foreground)]"
          >
            Methodology
          </Link>
        </p>
      </header>

      <div className="mt-8">
        {article.body.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Related profiles</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/companies/${c.slug}`}
                className="rounded-full border border-[var(--border-color)] bg-[var(--subtle-bg)]/50 px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] hover:border-[var(--foreground)]/40 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {article.ctas.length > 0 && (
        <Suspense fallback={null}>
          <div className="surface mt-12 rounded-2xl border border-[var(--border-color)] p-5">
            <h2 className="text-sm font-bold text-[var(--foreground)]">Compare these providers yourself</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {article.ctas.map((cta) => (
                <PartnerCta
                  key={`${cta.slug}-${cta.placement}`}
                  slug={cta.slug}
                  placement={cta.placement}
                  label={cta.label}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        </Suspense>
      )}

      {article.relatedTool && (
        <div className="mt-6 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-glow)] p-5">
          <h2 className="text-sm font-bold text-[var(--foreground)]">Try the calculator</h2>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted-text)]">
            Run the numbers for your own volume and mix before you choose.
          </p>
          <Link href={article.relatedTool.href} className="btn-primary mt-3 inline-flex text-xs">
            {article.relatedTool.label}
          </Link>
        </div>
      )}

      <p className="mt-10 border-t border-[var(--border-color)] pt-5 text-xs text-[var(--muted-text)]">
        Editorial disclaimer: fee figures are illustrative published-rate assumptions from the
        catalog vintage, not live quotes. Always verify current terms directly with the provider
        before making a decision.
      </p>
      <CorrectionReportLink
        pageLabel={`${article.title} page`}
        pagePath={`/articles/${article.slug}`}
      />
    </div>
  );
}


