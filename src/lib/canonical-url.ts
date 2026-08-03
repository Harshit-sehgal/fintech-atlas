/**
 * Single source of truth for canonical URLs.
 *
 * The site builds with `trailingSlash: true` (next.config.ts), so every route's
 * canonical form ends in a trailing slash — except the homepage (`/`). Using
 * this helper everywhere (canonicals, Open Graph urls, JSON-LD, sitemap, share
 * links) guarantees a single, consistent policy instead of a mix of slashed
 * and un-slashed strings.
 */
import { SITE_URL } from "@/lib/site-config";

export function canonicalUrl(pathname: string): string {
  if (!pathname || pathname === "/") return SITE_URL;
  const normalized = `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
  return `${SITE_URL}${normalized}`;
}
