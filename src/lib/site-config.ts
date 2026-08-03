// Build-time environment reference — see /.env.example for configurable values

/** Keep every build-time SEO URL on the same slash-free canonical origin. */
export function normalizeSiteUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

/**
 * Public subpath used by project-site deployments such as GitHub Pages.
 * Root deployments leave this unset. Next.js applies the same value to router
 * links when configured as `basePath`; public assets use `assetPath` below.
 */
export const PUBLIC_BASE_PATH = normalizeBasePath(
  process.env.NEXT_PUBLIC_BASE_PATH || "",
);

function normalizeBasePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") return "";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

/** Prefix a public asset path without producing `//` or missing subpaths. */
export function assetPath(pathname: string): string {
  const normalized = `/${pathname.replace(/^\/+/, "")}`;
  return `${PUBLIC_BASE_PATH}${normalized}`;
}

/** Canonical public URL of the site — used for SEO metadata, structured data, and sitemap. */
const configuredSiteUrl = normalizeSiteUrl(
  process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://fintech-atlas.example.com",
);

// Fail loudly at BUILD time if the canonical URL was never configured, rather
// than silently shipping metadata/sitemap/OpenGraph that point at the example
// placeholder domain. The check is server-only: SITE_URL is not inlined into
// client bundles (only NEXT_PUBLIC_* variables are), so evaluating the guard
// in the browser would always see the placeholder and crash every page.
if (
  typeof window === "undefined" &&
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
