import { notFound } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getCategoryBySlug, categories, getCompaniesByCategory, glossary, categoryGlossaryMap } from "@/data";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { formatValuationShort } from "@/lib/format-company";
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
  // Page-level openGraph is required: Next.js shallowly replaces the inherited
  // root openGraph — without this the OG card would show the homepage's
  // title/description/url for every category share.
  return {
    title: cat.name,
    description: cat.short,
    alternates: { canonical: canonicalUrl(`/categories/${cat.slug}`) },
    openGraph: {
      ...openGraphImage,
      title: `${cat.name} — FinTech Category Guide`,
      description: cat.short,
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

      {/* Category Header */}
      <Reveal>
        <div className="flex items-center gap-2 text-xs text-[var(--muted-text)] mb-6">
          <Link href="/categories" className="hover:text-[var(--foreground)] transition-colors">Categories</Link>
          <span className="text-[var(--muted-text)]">/</span>
          <span className="text-[var(--foreground)] font-medium">{cat.name}</span>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-7"
          style={{ ["--accent"]: cat.accent } as CSSProperties}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-glow)]">
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
        <div className="surface mt-8 rounded-2xl p-6 leading-relaxed text-sm text-[var(--foreground)]">
          <h2 className="eyebrow mb-3">Domain Overview</h2>
          <p>{cat.description}</p>
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
            <div className="mt-6 grid gap-4 sm:grid-cols-2 reveal-stagger">
              {companyList.map((c) => (
                <Link
                  key={c.slug}
                  href={`/companies/${c.slug}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-[var(--border-color)] p-5 transition-all duration-300 card-glow h-full"
                  style={{ ["--accent"]: c.accent } as CSSProperties}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="group-hover:scale-105 transition-transform duration-300">
                          <CompanyLogo slug={c.slug} name={c.name} size={40} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--accent-ink)] transition-colors">{c.name}</h3>
                          <p className="text-xs text-[var(--muted-text)]">{formatValuationShort(c.valuation)}</p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-lg bg-[var(--success)]/10 px-2.5 py-1 text-xs font-semibold text-success-text border border-[var(--success)]/20">
                        ★ {c.userReviews.rating}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-[var(--muted-text)] line-clamp-2">{c.tagline}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-semibold text-[var(--accent-ink)]">
                    <span>View company breakdown</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-[var(--border-color)] p-8 text-center text-sm text-[var(--muted-text)]">
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
            <div className="mt-4 grid gap-3 sm:grid-cols-2 reveal-stagger">
              {relatedGlossary.map((g) => (
                <Link
                  key={g.slug}
                  href={`/glossary#${g.slug}`}
                  className="group surface rounded-xl border border-[var(--border-color)] p-4 hover:border-[var(--accent)]/40 transition-all hover:-translate-y-0.5"
                >
                  <span className="font-bold text-sm text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{g.term}</span>
                  <p className="mt-1 text-xs text-[var(--muted-text)] leading-relaxed">{g.short}</p>
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
          <div className="flex flex-wrap gap-2">
            {categories.filter((c) => c.slug !== cat.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] surface px-3.5 py-2 text-xs font-medium hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-all hover:-translate-y-0.5"
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