import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getCompanyBySlug, companies, categories } from "@/data";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";
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
    title: `${c.name} — ${c.tagline}`,
    description: c.oneLiner,
    alternates: { canonical: `/companies/${c.slug}/` },
    openGraph: {
      ...openGraphImage,
      title: `${c.name} — ${c.tagline}`,
      description: c.oneLiner,
      url: `${SITE_URL}/companies/${c.slug}/`,
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

  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading profile…</div>}>
      <CompanyPageClient company={company} relatedCategories={relatedCategories} />
    </Suspense>
  );
}