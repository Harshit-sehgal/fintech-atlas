import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { tools } from "@/data/tools";
import { SectionHeading } from "@/components/ui/section-heading";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { pageMetadata } from "@/lib/shared-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";

const description =
  "Estimate payment gateway processing costs, compare reference FX scenarios, or build an initial fintech shortlist with our interactive tools.";

export const metadata: Metadata = pageMetadata({
  pathname: "/tools",
  title: "Interactive FinTech Tools",
  description,
});

const toolsList = tools.map(({ id, href, name, badge, description, features }) => ({
  id,
  href,
  name,
  badge,
  description,
  features,
}));

// Per-tool accent CSS variables (globals.css): deep shades in the light
// theme, light twins in dark — readable text ("Launch tool", badges) clears
// WCAG AA in both. The 20/33/10% alpha tints use color-mix so they follow
// the theme variable too.
const TOOL_ACCENTS: Record<string, string> = Object.fromEntries(
  tools.map((t) => [t.id, t.accentVar]),
);

export default function ToolsPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      <GridBackdrop />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
        ]}
      />

      <SectionHeading
        headingLevel={1}
        eyebrow="Interactive Decision Suite"
        title="FinTech Tools & Calculators"
        description="Data-driven tools to help you calculate real costs, compare exchange rates, and choose the right fintech services."
      />

      <div className="mt-12 border-t border-[var(--border-color)]">
        {toolsList.map((tool, index) => {
          const accent = TOOL_ACCENTS[tool.id] ?? "var(--tool-acc-calculator)";
          return (
            <Link
              key={tool.id}
              href={tool.href}
              style={{ ["--accent"]: accent } as CSSProperties}
              className="group grid gap-4 border-b border-[var(--border-color)] py-7 transition-colors md:grid-cols-[auto_1fr_auto] md:items-start md:gap-8"
            >
              {/* Editorial index numeral instead of an icon — the tool name
                  carries the meaning. Neutral surface; accent lives in the
                  numeral and the "Launch" affordance only. */}
              <span
                aria-hidden
                className="font-mono text-sm font-bold tabular-nums"
                style={{ color: accent }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                    {tool.name}
                  </h2>
                  <span className="rounded-full border border-[var(--border-color)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--muted-text)]">
                    {tool.badge}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted-text)]">
                  {tool.description}
                </p>
                <p className="mt-3 max-w-2xl text-xs leading-relaxed text-[var(--muted-text)]">
                  {tool.features.map((feat, i) => (
                    <span key={feat}>
                      {i > 0 && <span aria-hidden className="px-2 text-[var(--border-strong)]">·</span>}
                      {feat}
                    </span>
                  ))}
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-sm font-bold text-[var(--accent)] transition-transform group-hover:translate-x-1 md:justify-self-end">
                <span>Launch</span>
                <span aria-hidden>→</span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* Services cross-link (plan: internal links from existing pages) */}
      <section aria-labelledby="tools-services-cta" className="mt-10">
        <div className="flex flex-col items-start justify-between gap-4 border-y border-[var(--border-color)] py-6 sm:flex-row sm:items-center">
          <div>
            <h2 id="tools-services-cta" className="text-base font-bold tracking-tight">Need a human to do the analysis?</h2>
            <p className="mt-1 text-sm text-[var(--muted-text)]">
              Gateway selection audits and integration work for Indian businesses — independent of any provider.
            </p>
          </div>
          <Link href="/services" className="btn-primary shrink-0">See services</Link>
        </div>
      </section>
    </div>
  );
}
