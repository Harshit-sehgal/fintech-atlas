import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /**
   * Heading level for the title. Use `1` when this SectionHeading is the
   * page's primary title (the page has no other <h1>) — heading hierarchy
   * must start at <h1>, not skip to <h2>. Defaults to `2` for sub-sections.
   */
  headingLevel?: 1 | 2;
};

export function SectionHeading({ eyebrow, title, description, align = "left", headingLevel = 2 }: SectionHeadingProps) {
  const HeadingTag = (`h${headingLevel}` as "h1" | "h2");
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            <span className="inline-block h-px w-6 bg-[var(--accent)]/50" />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <HeadingTag className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          {title}
        </HeadingTag>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-pretty text-base leading-relaxed text-[var(--muted-text)]">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}