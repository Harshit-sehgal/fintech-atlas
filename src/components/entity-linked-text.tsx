/**
 * Prose renderer with inline entity links — wraps the
 * company and glossary-term mentions found by
 * findEntitySpans in links. Pure presentational component
 * (no hooks), so it works in server components.
 *
 * Link styling follows the article page's existing
 * inline-link convention (dotted underline, accent ink).
 */
import Link from "next/link";
import { findEntitySpans } from "@/lib/entity-links";

const LINK_CLASS =
  "text-[var(--accent-ink)] underline decoration-dotted underline-offset-2 transition-colors hover:text-[var(--foreground)]";

export function EntityLinkedText({
  text,
  usedEntities,
  excludeSlugs,
}: {
  text: string;
  /** Shared across a page's blocks for first-occurrence-per-page linking. */
  usedEntities?: Set<string>;
  /** Slugs that must never link (e.g. a glossary card's own term). */
  excludeSlugs?: Set<string>;
}) {
  const spans = findEntitySpans(text, usedEntities, excludeSlugs);
  // Fast path: no entities found — render the text as-is.
  if (spans.length === 1 && !spans[0].entity) {
    return <>{text}</>;
  }
  return (
    <>
      {spans.map((span, index) =>
        span.entity ? (
          <Link key={index} href={span.entity.href} className={LINK_CLASS}>
            {text.slice(span.start, span.end)}
          </Link>
        ) : (
          <span key={index}>{text.slice(span.start, span.end)}</span>
        ),
      )}
    </>
  );
}
