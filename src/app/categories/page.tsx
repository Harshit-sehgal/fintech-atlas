import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { categories, companies } from "@/data";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryIcon } from "@/components/ui/category-icon";
import { GridBackdrop } from "@/components/ui/grid-backdrop";

const description =
  "Browse FinTech domains from Payments & Processing and Digital Banks to InsurTech, Lending, and beyond. Each category maps the key companies and industry patterns.";

export const metadata: Metadata = {
  title: "All FinTech Categories",
  description,
  alternates: { canonical: "/categories" },
  openGraph: {
    ...openGraphImage,
    title: "All FinTech Categories — FinTech Atlas",
    description,
    url: `${SITE_URL}/categories`,
  },
};

export default function CategoriesPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      {/* Soft grid backdrop to match the rest of the site */}
      <GridBackdrop />

      <SectionHeading
        headingLevel={1}
        eyebrow="All Domains"
        title="Categories"
        description="FinTech spans many domains. Each category represents a distinct problem being solved in global finance."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 reveal-stagger">
        {categories.map((cat) => {
          const count = companies.filter((c) => c.categories.includes(cat.slug)).length;
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              style={{ ["--accent"]: cat.accent } as CSSProperties}
              className="group relative block h-full rounded-2xl border border-[var(--border-color)] p-6 transition-all duration-300 card-glow"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-glow)] group-hover:scale-110 transition-transform duration-300">
                  <CategoryIcon icon={cat.icon} color={cat.accent} size={32} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{cat.name}</h2>
                    <span className="shrink-0 rounded-full border border-[var(--border-color)] px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[var(--muted-text)]">
                      {count} compan{count === 1 ? "y" : "ies"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted-text)] leading-relaxed">{cat.short}</p>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--muted-text)] line-clamp-2">{cat.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}