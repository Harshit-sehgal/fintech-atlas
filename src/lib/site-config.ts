// Build-time environment reference — see /.env.example for configurable values

/** Keep every build-time SEO URL on the same slash-free canonical origin. */
export function normalizeSiteUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

/** Canonical public URL of the site — used for SEO metadata, structured data, and sitemap. */
const configuredSiteUrl = normalizeSiteUrl(
  process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://fintech-atlas.example.com",
);

// Fail loudly in production if the canonical URL was never configured, rather
// than silently shipping metadata/sitemap/OpenGraph that point at the example
// placeholder domain (defensive: site-config is imported at build time, where
// NODE_ENV is "production").
if (
  process.env.NODE_ENV === "production" &&
  configuredSiteUrl.includes("example.com")
) {
  throw new Error(
    "SITE_URL must be configured for production — refusing to build with the example.com placeholder. Set SITE_URL (or NEXT_PUBLIC_SITE_URL) in your environment.",
  );
}

export const SITE_URL: string = configuredSiteUrl;

/**
 * Human-readable vintage label for the catalog data (e.g. "Q3 2026", "mid-2026").
 * Baked at build time into the static export. Update this label when the
 * underlying company/glossary data is refreshed.
 */
export const DATA_AS_OF: string = "Q3 2026";

/**
 * Optional third-party form endpoint for the Pro / partner waitlist
 * (Formspree, Getform, Buttondown, etc.). When unset, the waitlist UI
 * explains how to configure it instead of silently failing.
 */
export const WAITLIST_ENDPOINT: string | undefined =
  process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT?.trim() || undefined;

/**
 * Optional cookieless analytics domain (e.g. Plausible site id).
 * When set, `AnalyticsScript` in the root layout loads Plausible.
 * See Privacy Notice for visitor-facing disclosure.
 */
export const ANALYTICS_DOMAIN: string | undefined =
  process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN?.trim() || undefined;
