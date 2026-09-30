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
    description,
    alternates: {
      canonical: canonicalUrl(pathname),
      ...extraAlternates,
    },
    openGraph: {
      ...openGraphImage,
      type,
      title: `${ogTitle} ${ogSeparator} FinTech Atlas`,
      description: ogDescription,
      url: canonicalUrl(pathname),
      ...extraOg,
    },
  };
}
