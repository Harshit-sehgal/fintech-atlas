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

const toolsList = tools.map(({ id, href, icon, name, badge, description, features }) => ({
  id,
  href,
  icon,
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

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4 reveal-stagger">
        {toolsList.map((tool) => {
          const accent = TOOL_ACCENTS[tool.id] ?? "var(--tool-acc-calculator)";
          return (
            <Link
              key={tool.id}
              href={tool.href}
              style={{ ["--accent"]: accent } as CSSProperties}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-color)] surface p-6 transition-all duration-300 card-glow hover:-translate-y-1"
            >
              {/* Per-tool tinted ambient glow that intensifies on hover */}
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150"
                style={{ background: `color-mix(in srgb, ${accent} 20%, transparent)` }}
              />

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{tool.icon}</span>
                  <span
                    className="rounded-full border px-3 py-1 text-[11px] font-medium font-mono"
                    style={{ borderColor: `color-mix(in srgb, ${accent} 33%, transparent)`, background: `color-mix(in srgb, ${accent} 10%, transparent)`, color: accent }}
                  >
                    {tool.badge}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {tool.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)]">
                  {tool.description}
                </p>

                <div className="mt-6 space-y-2 border-t border-[var(--border-color)] pt-4">
                  {tool.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-[var(--foreground)]/80">
                      <span className="text-success-text">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[var(--accent)] group-hover:translate-x-1 transition-transform">
                <span>Launch tool</span>
                <span>→</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Services cross-link (plan: internal links from existing pages) */}
      <section aria-labelledby="tools-services-cta" className="mt-10">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6 sm:flex-row sm:items-center">
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
