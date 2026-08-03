// Build-time environment reference — see /.env.example for configurable values

/** Keep every build-time SEO URL on the same slash-free canonical origin. */
export function normalizeSiteUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

/** Canonical public URL of the site — used for SEO metadata, structured data, and sitemap. */
export const SITE_URL: string = normalizeSiteUrl(
  process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://fintech-atlas.example.com",
);

/**
 * Human-readable vintage label for the catalog data (e.g. "Q3 2026", "mid-2026").
 * Baked at build time into the static export. Update this label when the
 * underlying company/glossary data is refreshed.
 */
export const DATA_AS_OF: string = "Q3 2026";
