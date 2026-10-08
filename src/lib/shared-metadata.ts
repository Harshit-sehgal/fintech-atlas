/**
 * Shared Open Graph image fragment + page-metadata builder.
 *
 * Next.js shallowly merges metadata across segments: a page that sets
 * `openGraph` *replaces* the entire inherited `openGraph` object (it does not
 * merge `og:title`/`og:description` from the page's own `title`/`description`).
 * The result — every page inherits the root layout's OG block verbatim, so
 * `og:title` / `og:description` / `og:url` all read as the homepage's values on
 * per-page shares (a known footgun documented in the Next.js metadata guide).
 *
 * To keep the branded OG image across every route while letting pages own
 * their own title/description/url, every page spreads this fragment:
 *
 *   export const metadata = {
 *     title: "…",
 *     description: "…",
 *     alternates: { canonical: "/about" },
 *     openGraph: {
 *       ...openGraphImage,
 *       title: "…",
 *       description: "…",
 *       url: `${SITE_URL}/about`,
 *     },
 *   }
 *
 * The `pageMetadata` helper below packages exactly that boilerplate so pages
 * don't repeat it. See: node_modules/next/dist/docs/.../generate-metadata.md
 * ("Merging").
 */
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import { canonicalUrl } from "@/lib/canonical-url";

export const openGraphImage = {
  images: [
    {
      url: `${SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
      alt: "FinTech Atlas — Understand the companies reshaping finance",
    },
  ],
  siteName: "FinTech Atlas",
  type: "website" as const,
};

interface PageMetadataOptions {
  pathname: string;
  title: string;
  description: string;
  /** Override the base used for og:title when it differs from `title`
   *  (browser-tab <title> vs social-card title). Defaults to `title`. */
  ogTitle?: string;
  /** Override og:description when it differs from `description`. Defaults to
   *  `description`. */
  ogDescription?: string;
  /** OG type override — set "article" for articles (required by schema.org). */
  type?: "website" | "article";
  /** Separator used before the site name in the og:title (kept per-page for
   *  existing titles; new pages should use the default "—"). */
  ogSeparator?: "—" | "·";
  /** Extra openGraph fields to merge (e.g. article metadata). */
  extraOg?: Record<string, unknown>;
  /** Extra alternates (e.g. hreflang pairs). */
  extraAlternates?: Metadata["alternates"];
}

/**
 * HTML-escaped length of a string as it appears inside a
 * double-quoted HTML attribute — `&`, `"`, `<` and `>` all
 * expand, so a raw 150-char description can render over the
 * 160-char SERP budget. The title builder budgets for the same
 * expansion; descriptions must too. Exported so generators that
 * concatenate a fixed suffix (radar company profiles) can
 * budget the suffix accurately.
 */
export function htmlAttrLength(value: string): number {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .length;
}

/**
 * SERP display budget: Google truncates meta descriptions around
 * 155–160 characters. Trim to the last whole word at or under the
 * budget so snippets never cut mid-word; descriptions already
 * within budget pass through untouched. Used by every metadata
 * builder so no page ships an over-long description.
 */
export function clampDescription(description: string, max = 155): string {
  const d = description.trim();
  if (htmlAttrLength(d) <= max) return d;
  // Walk back to the longest prefix whose escaped form (plus the
  // closing ellipsis) still fits the budget…
  let cut = d.length;
  while (cut > 0 && htmlAttrLength(d.slice(0, cut)) + 1 > max) cut -= 1;
  // …then retreat to the last whole word so the snippet never
  // breaks mid-word. A cut that short would leave a stub, so only
  // retreat when the word boundary sits past the halfway mark.
  const word = d.lastIndexOf(" ", cut);
  if (word > max * 0.5) cut = word;
  return `${d.slice(0, cut).replace(/[\s.,;:!?—–-]+$/, "")}…`;
}

/**
 * Builds a page's Metadata from the shared branded-OG fragment, eliminating
 * the 10-line canonical + openGraph boilerplate every page previously copied.
 * Pages with bespoke needs (articles, directory profiles) can still spread
 * `openGraphImage` directly.
 */
export function pageMetadata({
  pathname,
  title,
  description,
  ogTitle = title,
  ogDescription = description,
  type = "website",
  ogSeparator = "—",
  extraOg,
  extraAlternates,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description: clampDescription(description),
    alternates: {
      canonical: canonicalUrl(pathname),
      ...extraAlternates,
    },
    openGraph: {
      ...openGraphImage,
      type,
      title: `${ogTitle} ${ogSeparator} FinTech Atlas`,
      description: clampDescription(ogDescription),
      url: canonicalUrl(pathname),
      ...extraOg,
    },
  };
}
