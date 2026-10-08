/**
 * JSON-LD schema.org helpers, shared between the root-layout (organization +
 * website) and the /companies page (organization + website + ItemList) variants
 * of <StructuredData{...}/>.
 *
 * Keeping the schemas in one place avoids drift between the two surfaces —
 * Google Search Console cross-references the `@id`s across pages, so the
 * Organization/Website identity MUST be identical everywhere it appears.
 *
 * ## XSS guard
 * `sanitiseJsonLd` escapes `<` to `<` per the Next.js JSON-LD guide
 * (node_modules/next/dist/docs/.../json-ld.md). The data is static today
 * (hardcoded company names / descriptions) so there is no active XSS vector,
 * but the guard prevents a latent vulnerability if user-generated content is
 * ever added to structured-data payloads.
 */

import { SITE_URL } from "@/lib/site-config";
import { canonicalUrl } from "@/lib/canonical-url";

/** Stable IRI for the Organization entity so other schemas can reference it by `@id`. */
export const ORGANIZATION_ID = `${SITE_URL}#organization`;

/** Organization schema (Google Organization docs example, no trailing slash on `url`). */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "FinTech Atlas",
  url: SITE_URL,
  logo: `${SITE_URL}/apple-touch-icon.png`,
  description:
    "A clear, plain-language guide to the FinTech industry: what each company does, how they differ, how they make money, and what the available editorial evidence suggests.",
} as const;

/**
 * WebSite schema. SearchAction is deliberately omitted — this is a static
 * export, and search happens client-side via the Command Palette, not via a
 * server-side /search endpoint. Pointing at a 404 would be worse than omitting.
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FinTech Atlas",
  url: SITE_URL,
  publisher: { "@id": ORGANIZATION_ID },
} as const;

/**
 * FAQPage schema for the About page's editorial FAQ. One
 * Question/acceptedAnswer pair per entry — Google renders these
 * as expandable rich results when the page earns them. Built
 * from the same `faqs` array that renders the accordion, so the
 * structured data can never drift from the visible content.
 */
export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
});

/**
 * ItemList schema for the glossary index. Each term lives on the
 * single glossary page under an anchor, so the item URL is the
 * canonical glossary URL plus `#<term-slug>` — the same fragment
 * the term headings use as their `id`.
 */
export const glossaryItemListSchema = (
  terms: { slug: string; term: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "FinTech Glossary",
  numberOfItems: terms.length,
  itemListElement: terms.map((g, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${canonicalUrl("/glossary")}#${g.slug}`,
    name: g.term,
  })),
});

/**
 * Serialize a JSON-LD payload and escape `<` to prevent tag-injection when the
 * payload is dropped into a `<script type="application/ld+json">` block via
 * `dangerouslySetInnerHTML`. See Next.js JSON-LD docs.
 */
export function sanitiseJsonLd(json: unknown): string {
  return JSON.stringify(json).replace(/</g, "\\u003c");
}
