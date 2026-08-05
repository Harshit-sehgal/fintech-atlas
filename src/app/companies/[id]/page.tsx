import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCompanyBySlug, companies, categories } from "@/data";
import { articles } from "@/data/articles";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CompanyPageClient } from "./client";

export async function generateStaticParams() {
  return companies.map((c) => ({ id: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = getCompanyBySlug(id);
  if (!c) return { title: "Not Found" };
  // Page-level openGraph is required: Next.js shallowly replaces the inherited
  // root openGraph, so without this the OG card would fall back to the
  // homepage's title/description/url for every company share.
  return {
    title: `${c.name} — fees, features & review`,
    description: c.oneLiner,
    alternates: { canonical: canonicalUrl(`/companies/${c.slug}`) },
    openGraph: {
      ...openGraphImage,
      title: `${c.name} — ${c.tagline}`,
      description: c.oneLiner,
      url: canonicalUrl(`/companies/${c.slug}`),
    },
  };
}

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = getCompanyBySlug(id);
  if (!company) notFound();

  const relatedCategories = categories.filter((cat) =>
    company.categories.includes(cat.slug)
  );
  const companyIndex = companies.findIndex((item) => item.slug === company.slug);
  const previousCompany = companies[companyIndex - 1];
  const nextCompany = companies[companyIndex + 1];
  const adjacent = {
    previous: previousCompany ? { slug: previousCompany.slug, name: previousCompany.name } : null,
    next: nextCompany ? { slug: nextCompany.slug, name: nextCompany.name } : null,
  };
  // Plan T051: every provider profile links the articles that mention it.
  // Minimal shape (slug/title/category) keeps the client flight payload small.
  const relatedArticles = articles
    .filter((a) => a.relatedCompanySlugs.includes(company.slug))
    .map((a) => ({ slug: a.slug, title: a.title, category: a.category }));

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Companies", href: "/companies" },
    { name: company.name, href: `/companies/${company.slug}` },
  ];

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-16 md:pt-24">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      {/* No Suspense wrapper: static export pre-renders fully at build time.
          A Suspense boundary around a client component causes Next.js to defer
          rendering and ship only the fallback, triggering hydration mismatch. */}
      <CompanyPageClient
        company={company}
        relatedCategories={relatedCategories}
        relatedArticles={relatedArticles}
        adjacent={adjacent}
      />
    </>
  );
}
