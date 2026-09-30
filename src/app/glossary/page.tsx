import type { Metadata } from "next";
import { glossary } from "@/data/glossary";
import type { GlossaryTerm } from "@/data/types";
import { pageMetadata } from "@/lib/shared-metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { GlossaryToolbar } from "./toolbar";
import { TermActions } from "./term-actions";

const description =
  "Plain-language definitions of the FinTech terms used on this site — UPI and payment aggregators to FEMA, FIRCs, and RBI licences.";

export const metadata: Metadata = pageMetadata({
  pathname: "/glossary",
  title: "FinTech Glossary & Terminology",
  description,
});

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

  // Group terms by their first letter into scannable A–Z sections. The toolbar
  // still filters individual cards by `data-letter`, and now also hides any
  // section left with no visible card.
  const letterGroups = availableLetters.map((letter) => ({
    letter,
    terms: glossary.filter((g) => g.term.charAt(0).toUpperCase() === letter),
  }));

  return (
    <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Glossary", href: "/glossary" },
        ]}
      />

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

      <div className="mt-8 space-y-10">
        {letterGroups.map(({ letter, terms }) => (
          <section
            key={letter}
            data-glossary-section
            data-letter={letter}
            aria-labelledby={`glossary-letter-${letter}`}
          >
            <h2
              id={`glossary-letter-${letter}`}
              className="sticky top-0 z-10 -mx-1 mb-4 bg-[var(--background)]/85 px-1 py-2 text-sm font-bold uppercase tracking-[0.2em] text-[var(--muted-text)] backdrop-blur"
            >
              {letter}
            </h2>
            <div className="border-t border-[var(--border-color)]">
              {terms.map((g) => {
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
                    <div className="group border-b border-[var(--border-color)] py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-base font-bold text-[var(--foreground)]">{g.term}</h3>
                          {fullName && (
                            <span className="font-mono text-xs text-[var(--muted-text)]">({fullName})</span>
                          )}
                        </div>
                        <TermActions slug={g.slug} term={g.term} />
                      </div>

                      <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-[var(--foreground)]">{g.short}</p>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted-text)]">{g.long}</p>

                      {g.related.length > 0 && (
                        <div className="mt-3 border-t border-[var(--border-color)] pt-3 text-xs text-[var(--muted-text)]">
                          <span className="mr-1 font-semibold text-[var(--foreground)]">See also:</span>
                          {g.related.map((slug, idx) => {
                            const related = glossary.find((x) => x.slug === slug);
                            return related ? (
                              <a
                                key={slug}
                                href={`#${slug}`}
                                className="mr-2 text-[var(--accent-ink)] underline underline-offset-2"
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
            </div>
          </section>
        ))}

        <div
          id="glossary-empty"
          hidden
          className="border-y border-dashed border-[var(--border-color)] py-8 text-center text-sm text-[var(--muted-text)]"
        >
          No terms found. Try another search term.
        </div>
      </div>
    </div>
  );
}
