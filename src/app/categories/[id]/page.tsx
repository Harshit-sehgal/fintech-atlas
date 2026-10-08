import { notFound } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getCategoryBySlug, categories, getCompaniesByCategory, glossary, categoryGlossaryMap } from "@/data";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage, clampDescription } from "@/lib/shared-metadata";
import { formatValuationShort } from "@/lib/format-company";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryIcon } from "@/components/ui/category-icon";
import { CompanyLogo } from "@/components/ui/company-logo";
import { Reveal } from "@/components/ui/reveal";
import { GridBackdrop } from "@/components/ui/grid-backdrop";

export async function generateStaticParams() {
  return categories.map((c) => ({ id: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cat = getCategoryBySlug(id);
  if (!cat) return { title: "Not Found" };
  // Intent-led description: the category's one-liner is ~60 chars on
  // its own — lead with the comparison intent and the curated count
  // so the snippet says what the page does, clamped to the SERP budget.
  const companyCount = getCompaniesByCategory(id).length;
  const description = clampDescription(
    `${cat.name} companies in India — ${cat.short} Compare ${companyCount} curated ${cat.name} profiles with fees, ratings and India availability on FinTech Atlas.`,
  );
  // Page-level openGraph is required: Next.js shallowly replaces the inherited
  // root openGraph — without this the OG card would show the homepage's
  // title/description/url for every category share.
  return {
    title: cat.name,
    description,
    alternates: { canonical: canonicalUrl(`/categories/${cat.slug}`) },
    openGraph: {
      ...openGraphImage,
      title: `${cat.name} — FinTech Category Guide`,
      description,
      url: canonicalUrl(`/categories/${cat.slug}`),
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cat = getCategoryBySlug(id);
  if (!cat) notFound();

  const companyList = getCompaniesByCategory(id);

  // Look up related glossary terms from the data-driven category map.
  // Falls back to an empty list (no "Key Domain Terminology" section) for any
  // category without an explicit entry — never throws on a missing mapping.
  const targetSlugs = categoryGlossaryMap[id] ?? [];
  const relatedGlossary = glossary.filter((g) => targetSlugs.includes(g.slug));

  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      {/* Soft grid backdrop so the page feels alive without dominating */}
      <GridBackdrop />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Categories", href: "/categories" },
          { name: cat.name, href: `/categories/${cat.slug}` },
        ]}
      />

      {/* Category Header */}
      <Reveal>
        <div
          className="relative overflow-hidden rounded-sm border border-[var(--border-color)] bg-[var(--card)] p-7"
          style={{ ["--accent"]: cat.accent } as CSSProperties}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm bg-[var(--accent-glow)]">
                <CategoryIcon icon={cat.icon} color={cat.accent} size={40} />
              </div>
              <div>
                <span className="eyebrow">Category guide</span>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">{cat.name}</h1>
                <p className="mt-1 text-base text-[var(--muted-text)]">{cat.short}</p>
              </div>
            </div>

            {companyList.length >= 2 && (
              <Link
                href={`/compare?companies=${companyList.slice(0, 3).map((c) => c.slug).join(",")}`}
                className="btn-primary shrink-0"
                title="Side-by-side comparison of the top 3 companies in this category"
              >
                Compare Top 3
              </Link>
            )}
          </div>
        </div>
      </Reveal>

      {/* Description */}
      <Reveal delay={0.1}>
        <div className="mt-8 border-t border-[var(--border-color)] pt-5 text-sm leading-relaxed text-[var(--foreground)]">
          <h2 className="eyebrow mb-3">Domain Overview</h2>
          <p className="max-w-3xl">{cat.description}</p>
        </div>
      </Reveal>

      {/* Companies */}
      <Reveal delay={0.15}>
        <section className="mt-12">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <h2 className="text-xl font-bold tracking-tight">
              Companies in {cat.name} ({companyList.length})
            </h2>
          </div>

          {companyList.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {companyList.map((c) => (
                <Link
                  key={c.slug}
                  href={`/companies/${c.slug}`}
                  className="box-card group relative flex flex-col justify-between p-5"
                  style={{ ["--accent"]: c.accent } as CSSProperties}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <CompanyLogo slug={c.slug} name={c.name} size={40} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent-ink)]">
                            <span className="hl-link">{c.name}</span>
                          </h3>
                          <p className="text-sm text-[var(--muted-text)]">{formatValuationShort(c.valuation)}</p>
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-sm font-semibold text-success-text">
                        ★ {c.userReviews.rating}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)] line-clamp-2">{c.tagline}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[var(--border-color)] pt-3 text-xs font-semibold text-[var(--accent-ink)]">
                    <span>View company breakdown</span>
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 border-y border-dashed border-[var(--border-color)] py-8 text-center text-sm text-[var(--muted-text)]">
              No company profiles have been added to this category yet. It exists as a reference domain.
            </div>
          )}
        </section>
      </Reveal>

      {/* Relevant Glossary Concepts */}
      {relatedGlossary.length > 0 && (
        <Reveal delay={0.2}>
          <section className="mt-12">
            <h2 className="border-b border-[var(--border-color)] pb-3 text-xl font-semibold tracking-tight text-[var(--foreground)]">
              Key Domain Terminology
            </h2>
            <div className="mt-4 grid border-t border-[var(--border-color)] sm:grid-cols-2">
              {relatedGlossary.map((g) => (
                <Link
                  key={g.slug}
                  href={`/glossary#${g.slug}`}
                  className="group border-b border-[var(--border-color)] py-4 transition-colors sm:odd:border-r sm:odd:pr-6 sm:even:pl-6"
                >
                  <span className="text-sm font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">{g.term}</span>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted-text)]">{g.short}</p>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Other Categories Switcher */}
      <Reveal delay={0.25}>
        <section className="mt-16 border-t border-[var(--border-color)] pt-8">
          <h3 className="eyebrow mb-4 text-[var(--muted-text)]">Explore Other Categories</h3>
          <div className="flex flex-wrap gap-x-6">
            {categories.filter((c) => c.slug !== cat.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="inline-flex items-center gap-2 border-b border-[var(--border-color)] py-3 text-sm font-medium text-[var(--muted-text)] transition-colors hover:text-[var(--accent)]"
              >
                <CategoryIcon icon={c.icon} color={c.accent} size={18} />
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
