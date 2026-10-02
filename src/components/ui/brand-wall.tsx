import Link from "next/link";
import { memo } from "react";
import { CompanyLogo } from "./company-logo";

type BrandWallProps = {
  /** Pairs of (slug, name) to render. */
  logos: { slug: string; name: string }[];
};

/**
 * The brand wall: every company in the catalog as a static, ruled grid.
 *
 * This replaced an infinite auto-scrolling marquee. A marquee was the wrong
 * instrument for a reference index on three counts: the loop never let the eye
 * land, so nothing was actually readable; it duplicated the whole list in the
 * DOM purely to make the loop seamless; and it ran forever on a page whose
 * subject is *browsing* companies at your own pace.
 *
 * As a grid it is scannable, keyboard-navigable in DOM order, links to every
 * company, and sits still. The hairline cell borders match the rest of the
 * site's "ruled document" language rather than needing a fade mask.
 */
export const BrandWall = memo(function BrandWall({ logos }: BrandWallProps) {
  return (
    <ul className="mx-auto grid max-w-6xl grid-cols-2 border-t border-l border-[var(--border-color)] px-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {logos.map((l) => (
        <li key={l.slug} className="border-b border-r border-[var(--border-color)]">
          <Link
            href={`/companies/${l.slug}`}
            className="group flex items-center gap-2.5 px-3 py-3 transition-colors hover:bg-[var(--subtle-bg)]/60"
          >
            <CompanyLogo slug={l.slug} name={l.name} size={28} />
            <span className="min-w-0 truncate text-xs font-medium text-[var(--muted-text)] transition-colors group-hover:text-[var(--foreground)]">
              {l.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
});