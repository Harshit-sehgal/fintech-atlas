import type { Metadata } from "next";
import { glossary } from "@/data/glossary";
import type { GlossaryTerm } from "@/data/types";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";
import { SectionHeading } from "@/components/ui/section-heading";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { GlossaryToolbar } from "./toolbar";
import { TermActions } from "./term-actions";

const description =
  "Plain-language definitions of the FinTech terms used on this site — UPI and payment aggregators to FEMA, FIRCs, and RBI licences.";

export const metadata: Metadata = {
  title: "FinTech Glossary & Terminology",
  description,
  alternates: { canonical: canonicalUrl("/glossary") },
  openGraph: {
    ...openGraphImage,
    title: "FinTech Glossary & Terminology — FinTech Atlas",
    description,
    url: canonicalUrl("/glossary"),
  },
};

// Server-side search surface: every card carries a lower-cased data-search
// attribute covering term + full + short + long, so the client toolbar can
// filter the static HTML without shipping the definitions in the JS bundle.
function buildSearchData(g: GlossaryTerm): string {
  return [g.term, g.full, g.short, g.long]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();
}

export default function GlossaryPage() {
  const availableLetters = [
    ...new Set(glossary.map((g) => g.term.charAt(0).toUpperCase())),
  ].sort();

  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <SectionHeading
        headingLevel={1}
        eyebrow="Jargon Decoder"
        title="FinTech Glossary & Terminology"
        description="Plain-language definitions of financial technology concepts, payment rails, and regulatory standards."
      />

      <GlossaryToolbar
        totalCount={glossary.length}
        availableLetters={availableLetters}
      />

      <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted-text)] font-mono border-b border-[var(--border-color)] pb-3">
        <span aria-live="polite" id="glossary-count">
          Showing {glossary.length} of {glossary.length} terms
        </span>
        <span id="glossary-filter-note" hidden>
          Letter filter active
        </span>
      </div>

      <div className="mt-8 space-y-4 reveal-stagger">
        {glossary.map((g) => {
          const fullName = g.full && g.full !== g.term ? g.full : undefined;
          return (
            <section
              key={g.slug}
              id={g.slug}
              className="scroll-mt-24"
              data-glossary-card
              data-letter={g.term.charAt(0).toUpperCase()}
              data-search={buildSearchData(g)}
            >
              <div className="group surface relative rounded-2xl border border-[var(--border-color)] p-5 transition-all hover:border-[var(--accent)]/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--accent-glow)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-base font-bold text-[var(--foreground)]">{g.term}</h2>
                    {fullName && (
                      <span className="text-xs text-[var(--muted-text)] font-mono">({fullName})</span>
                    )}
                  </div>
                  <TermActions slug={g.slug} term={g.term} />
                </div>

                <p className="mt-2 text-sm leading-relaxed font-medium text-[var(--foreground)]">{g.short}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">{g.long}</p>

                {g.related.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--muted-text)]">
                    <span className="font-semibold text-[var(--foreground)] mr-1">See also:</span>
                    {g.related.map((slug, idx) => {
                      const related = glossary.find((x) => x.slug === slug);
                      return related ? (
                        <a
                          key={slug}
                          href={`#${slug}`}
                          className="text-[var(--accent)] underline underline-offset-2 mr-2"
                        >
                          {related.term}
                          {idx < g.related.length - 1 ? "," : ""}
                        </a>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </section>
          );
        })}

        <div
          id="glossary-empty"
          hidden
          className="rounded-xl border border-dashed border-[var(--border-color)] p-8 text-center text-sm text-[var(--muted-text)]"
        >
          No terms found. Try another search term.
        </div>
      </div>
    </div>
  );
}
