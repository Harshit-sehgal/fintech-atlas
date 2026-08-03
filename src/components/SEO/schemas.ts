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
 * Serialize a JSON-LD payload and escape `<` to prevent tag-injection when the
 * payload is dropped into a `<script type="application/ld+json">` block via
 * `dangerouslySetInnerHTML`. See Next.js JSON-LD docs.
 */
export function sanitiseJsonLd(json: unknown): string {
  return JSON.stringify(json).replace(/</g, "\\u003c");
}
