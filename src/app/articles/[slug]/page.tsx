import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { ResolvedPartnerCtaLink } from "@/components/ui/resolved-partner-cta-link";
import { resolvePartnerCta, partnerRel } from "@/lib/partners";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage, clampDescription } from "@/lib/shared-metadata";
import { articles, getArticleBySlug, type ArticleBlock, categoryHref } from "@/data/articles";
import { getCompanyBySlug } from "@/data";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CorrectionReportLink } from "@/components/ui/correction-report-link";
import { Highlight } from "@/components/ui/highlight";
import { EntityLinkedText } from "@/components/entity-linked-text";

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
      description: clampDescription(article.description),
      alternates: { canonical: canonicalUrl(`/articles/${article.slug}`) },
      openGraph: {
        ...openGraphImage,
        type: "article",
        title: article.title,
        description: clampDescription(article.description),
        url: canonicalUrl(`/articles/${article.slug}`),
        // Article OG fields (schema.org Article / Google News signals):
        // published time, last-modified time, author and section.
        publishedTime: `${article.publishedAt}T00:00:00Z`,
        modifiedTime: `${article.updatedAt}T00:00:00Z`,
        authors: [article.author],
        section: article.category,
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

function Block({
  block,
  usedEntities,
}: {
  block: ArticleBlock;
  /** Shared across blocks so each entity links once per page. */
  usedEntities: Set<string>;
}) {
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
              <span>
                <EntityLinkedText text={item} usedEntities={usedEntities} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="mt-4 overflow-x-auto rounded-sm border border-[var(--border-color)]">
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
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted-text)]">
          <EntityLinkedText text={block.text} usedEntities={usedEntities} />
        </p>
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
    author: { "@type": "Person", name: article.author },
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
    { name: article.category, href: categoryHref(article.category) },
    { name: article.title, href: `/articles/${article.slug}` },
  ];

  // Inline entity linking: one shared set per page so
  // each company and glossary term links on its first
  // prose occurrence only.
  const linkedEntities = new Set<string>();

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
          Last independently verified: {formatDate(article.updatedAt)} &middot; By{" "}
          <Link href="/about" className="underline decoration-dotted underline-offset-2 transition-colors hover:text-[var(--foreground)]">
            {article.author}
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
          <Block key={i} block={block} usedEntities={linkedEntities} />
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Related profiles</h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/companies/${c.slug}`}
                className="group text-sm font-semibold text-[var(--foreground)]"
              >
                <span className="hl-link">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {article.relatedArticleSlugs && article.relatedArticleSlugs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Related guides</h2>
          <div className="mt-3 grid border-t border-[var(--border-color)] sm:grid-cols-2">
            {article.relatedArticleSlugs.map((s) => {
              const relatedArticle = getArticleBySlug(s);
              if (!relatedArticle) return null;
              return (
                <Link
                  key={s}
                  href={`/articles/${s}`}
                  className="group border-b border-[var(--border-color)] py-4 transition-colors sm:odd:border-r sm:odd:pr-6 sm:even:pl-6"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted-text)]">
                    {relatedArticle.category}
                  </span>
                   <h3 className="mt-1.5 text-sm font-bold leading-snug text-[var(--foreground)]">
                     <span className="hl-link">{relatedArticle.title}</span>
                   </h3>
                  <span className="mt-2 inline-block text-xs font-bold text-[var(--accent)]">Read →</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {article.ctas.length > 0 && (
        <Suspense fallback={null}>
          <div className="mt-12 border-t border-[var(--border-color)] pt-5">
            <h2 className="text-sm font-bold text-[var(--foreground)]">Compare these providers yourself</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {article.ctas.map((cta) => {
                // Resolve server-side: keeps lib/partners (and the company
                // catalog it reads) out of this route's client bundle.
                const resolved = resolvePartnerCta(cta.slug, cta.placement);
                if (!resolved) return null;
                return (
                  <ResolvedPartnerCtaLink
                    key={`${cta.slug}-${cta.placement}`}
                    href={resolved.href}
                    label={cta.label ?? resolved.label}
                    rel={partnerRel(resolved.isCommercial)}
                    isCommercial={resolved.isCommercial}
                    companySlug={cta.slug}
                    placement={cta.placement}
                    relationship={resolved.relationship}
                    trackingId={resolved.trackingId}
                    variant="compact"
                  />
                );
              })}
            </div>
          </div>
        </Suspense>
      )}

      {article.relatedTool && (
        <div className="mt-6 border-t border-[var(--border-color)] pt-5">
          <h2 className="text-sm font-bold text-[var(--foreground)]">
            <Highlight color="yellow">Try the calculator</Highlight>
          </h2>
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


