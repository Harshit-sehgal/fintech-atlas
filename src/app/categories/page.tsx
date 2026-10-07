import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { categories, companies } from "@/data";
import { pageMetadata } from "@/lib/shared-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryIcon } from "@/components/ui/category-icon";
import { GridBackdrop } from "@/components/ui/grid-backdrop";

const description =
  "Browse FinTech domains from Payments & Processing and Digital Banks to InsurTech, Lending, and beyond. Each category maps the key companies and industry patterns.";

export const metadata: Metadata = pageMetadata({
  pathname: "/categories",
  title: "All FinTech Categories",
  description,
});

// Group the flat category list into intent themes so the page works as a
// decision entry point (mirroring the homepage "What are you trying to do?")
// rather than a catalogue dump. Every category is assigned exactly once; any
// unassigned slug falls into a trailing "More domains" bucket so nothing is
// dropped if the catalog grows.
const CATEGORY_GROUPS: {
  id: string;
  title: string;
  blurb: string;
  slugs: string[];
}[] = [
  {
    id: "payments",
    title: "Accept & move payments",
    blurb: "Gateways, rails and the infrastructure that actually moves money.",
    slugs: ["payments", "infrastructure", "cross-border"],
  },
  {
    id: "banking",
    title: "Bank, borrow & lend",
    blurb: "Neobanks, credit, BNPL and payroll for people and businesses.",
    slugs: ["neobanks", "lending", "bnpl", "payroll-hr"],
  },
  {
    id: "wealth",
    title: "Invest & build wealth",
    blurb: "Markets, insurtech and property — growing and protecting capital.",
    slugs: ["investing", "insurtech", "proptech"],
  },
  {
    id: "ops",
    title: "Run & secure the business",
    blurb: "Spend control, fraud prevention and enterprise risk tooling.",
    slugs: ["spend-management", "fraud-security"],
  },
];

export default function CategoriesPage() {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const assigned = new Set(CATEGORY_GROUPS.flatMap((g) => g.slugs));
  const moreGroups = categories.filter((c) => !assigned.has(c.slug));

  const groups = [
    ...CATEGORY_GROUPS.map((g) => ({
      ...g,
      items: g.slugs.map((s) => bySlug.get(s)).filter((c): c is NonNullable<typeof c> => Boolean(c)),
    })),
    ...(moreGroups.length > 0
      ? [{ id: "more", title: "More domains", blurb: "Additional specialised FinTech areas.", slugs: moreGroups.map((c) => c.slug), items: moreGroups }]
      : []),
  ];

  return (
    <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      {/* Soft grid backdrop to match the rest of the site */}
      <GridBackdrop />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Categories", href: "/categories" },
        ]}
      />

      <SectionHeading
        headingLevel={1}
        eyebrow="All Domains"
        title="Categories"
        description="FinTech spans many domains. Pick the problem you're solving — each category maps the key companies and the patterns behind them."
      />

      <div className="mt-12 space-y-14">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`group-${group.id}`}>
            <div className="mb-6 max-w-2xl">
              <h2 id={`group-${group.id}`} className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                {group.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--muted-text)]">{group.blurb}</p>
            </div>

            <div className="grid md:grid-cols-2">
              {group.items.map((cat) => {
                const count = companies.filter((c) => c.categories.includes(cat.slug)).length;
                return (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    style={{ ["--accent"]: cat.accent } as CSSProperties}
                    className="group relative block py-6 transition-colors md:odd:pr-8 md:even:pl-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                        <CategoryIcon icon={cat.icon} color={cat.accent} size={26} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
                            <span className="hl-link">{cat.name}</span>
                          </h3>
                          <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">
                            {count} compan{count === 1 ? "y" : "ies"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--muted-text)]">{cat.short}</p>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)] line-clamp-2">{cat.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
