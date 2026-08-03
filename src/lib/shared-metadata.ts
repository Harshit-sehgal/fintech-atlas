/**
 * Shared Open Graph image fragment.
 *
 * Next.js shallowly merges metadata across segments: a page that sets
 * `openGraph` *replaces* the entire inherited `openGraph` object (it does not
 * merge `og:title`/`og:description` from the page's own `title`/`description`).
 * The result — every page inherits the root layout's OG block verbatim, so
 * `og:title` / `og:description` / `og:url` all read as the homepage's values on
 * per-page shares (a known footgun documented in the Next.js metadata guide).
 *
 * To keep the branded OG image across every route while letting pages own
 * their own title/description/url, pages spread this fragment:
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
 * See: node_modules/next/dist/docs/.../generate-metadata.md ("Merging").
 */
import { SITE_URL } from "@/lib/site-config";

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
