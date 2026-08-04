import Link from "next/link";
import { canonicalUrl } from "@/lib/canonical-url";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

/**
 * Visible breadcrumb nav + matching BreadcrumbList JSON-LD (schema.org).
 * Server component — safe to use on any statically exported page. The last
 * item renders as the current page (aria-current) and points at the page URL
 * in the structured data, per Google's breadcrumb guidance.
 */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = breadcrumbJsonLd(items);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 font-mono text-xs text-[var(--muted-text)]"
      >
        {items.map((item, index) => (
          <span key={item.href} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page" className="font-medium text-[var(--foreground)]">
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className="transition-colors hover:text-[var(--foreground)]">
                {item.name}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

/**
 * BreadcrumbList JSON-LD object for pages that already render their own
 * visible breadcrumb nav (e.g. tool pages whose client islands draw the nav).
 * Server-side only — canonicalUrl resolves from build-time SITE_URL.
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]): {
  "@context": string;
  "@type": string;
  itemListElement: { "@type": string; position: number; name: string; item: string }[];
} {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.href),
    })),
  };
}
