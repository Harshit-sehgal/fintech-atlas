/**
 * Inline entity linking — the internal-link graph's
 * last layer. Article prose and glossary definitions
 * mention companies and jargon terms as plain text;
 * this module finds those mentions (word-boundary,
 * longest-match-first, first occurrence per scope) so
 * the renderer can wrap them in links to the company
 * profiles and glossary entries.
 *
 * Matching rules:
 * - Longest name first, so "Cashfree Payments" wins
 *   over "Cashfree" and "Payment Aggregator (PA)" wins
 *   over "Payment Aggregator".
 * - Acronyms (every cased letter uppercase: UPI, SWIFT)
 *   and proper nouns that are also common words (Wise,
 *   Square, Stripe, Circle, Relay, Chime, Affirm, Plaid,
 *   Gusto) match CASE-SENSITIVELY — prose like "a wise
 *   choice", "a swift reply" or "a square table" must
 *   never become a link.
 * - Everything else matches case-insensitively so
 *   lowercase prose ("a payment aggregator", "an API")
 *   still links.
 */
import { companies, glossary } from "@/data";

export interface EntityRef {
  kind: "company" | "term";
  slug: string;
  href: string;
}

export interface TextSpan {
  start: number;
  end: number;
  entity?: EntityRef;
}

interface EntityName {
  name: string;
  ref: EntityRef;
  caseSensitive: boolean;
  pattern: RegExp;
}

/** Proper nouns whose lowercase form is an everyday word. */
const COMMON_WORD_PROPER_NOUNS = new Set([
  "wise",
  "square",
  "stripe",
  "circle",
  "relay",
  "chime",
  "affirm",
  "plaid",
  "gusto",
]);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isCaseSensitive(name: string): boolean {
  const letters = name.replace(/[^A-Za-z]/g, "");
  if (letters.length > 0 && letters === letters.toUpperCase()) {
    return true; // acronym: UPI, SWIFT, API, PCI-DSS
  }
  return COMMON_WORD_PROPER_NOUNS.has(name.toLowerCase());
}

/** Names to index for a glossary term: the term itself,
 *  its expanded form, and — for terms stored with a
 *  parenthetical qualifier ("Payment Aggregator (PA)") —
 *  the bare name prose actually uses. */
function glossaryNames(g: (typeof glossary)[number]): string[] {
  const names = [g.term];
  if (g.full && g.full !== g.term) names.push(g.full);
  const paren = g.term.indexOf(" (");
  if (paren > 3) names.push(g.term.slice(0, paren));
  return names;
}

const ENTITY_NAMES: EntityName[] = [
  ...companies.map((c) => ({
    name: c.name,
    ref: { kind: "company" as const, slug: c.slug, href: `/companies/${c.slug}/` },
    caseSensitive: isCaseSensitive(c.name),
  })),
  ...glossary.flatMap((g) =>
    glossaryNames(g).map((name) => ({
      name,
      ref: { kind: "term" as const, slug: g.slug, href: `/glossary/#${g.slug}` },
      caseSensitive: isCaseSensitive(name),
    })),
  ),
]
  .sort((a, b) => b.name.length - a.name.length)
  .map((entity) => ({
    ...entity,
    // Word boundaries on both sides, Unicode-aware, so
    // "UPI" matches inside "UPI Lite" but "Payment" never
    // matches inside "Payments".
    pattern: new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(entity.name)}(?![\\p{L}\\p{N}])`,
      entity.caseSensitive ? "u" : "iu",
    ),
  }));

/**
 * Find entity mentions in `text`. Each entity links at most
 * once per call unless `usedEntities` is supplied — pass the
 * same Set across a page's blocks to get first-occurrence-
 * per-page linking. Entities in `excludeSlugs` never link
 * (a glossary card must not link its own term back to itself).
 */
export function findEntitySpans(
  text: string,
  usedEntities?: Set<string>,
  excludeSlugs?: Set<string>,
): TextSpan[] {
  const spans: TextSpan[] = [];
  for (const entity of ENTITY_NAMES) {
    if (excludeSlugs?.has(entity.ref.slug)) continue;
    if (usedEntities?.has(entity.ref.slug)) continue;
    const match = entity.pattern.exec(text);
    if (!match || match.index === undefined) continue;
    const start = match.index;
    const end = start + entity.name.length;
    // Skip a hit that overlaps an already-claimed span
    // (a longer entity won the same words).
    if (spans.some((s) => start < s.end && end > s.start)) continue;
    spans.push({ start, end, entity: entity.ref });
    usedEntities?.add(entity.ref.slug);
  }
  spans.sort((a, b) => a.start - b.start);
  // Fill the gaps between entity spans with plain-text spans.
  const result: TextSpan[] = [];
  let cursor = 0;
  for (const span of spans) {
    if (span.start > cursor) {
      result.push({ start: cursor, end: span.start });
    }
    result.push(span);
    cursor = span.end;
  }
  if (cursor < text.length) {
    result.push({ start: cursor, end: text.length });
  }
  return result;
}
