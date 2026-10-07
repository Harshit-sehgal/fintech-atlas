import Link from "next/link";
import { memo } from "react";
import { CompanyLogo } from "./company-logo";

type BrandWallProps = {
  /** Pairs of (slug, name) to render. */
  logos: { slug: string; name: string }[];
};

/**
 * The brand wall: every company in the catalog as a breathing grid.
 *
 * No boxes, no rules — logos sit directly on warm paper with room to
 * breathe, and each name sweeps a marker swipe on hover. Scannable,
 * keyboard-navigable in DOM order, links to every company, sits still.
 */
export const BrandWall = memo(function BrandWall({ logos }: BrandWallProps) {
  return (
    <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-5 px-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {logos.map((l) => (
        <li key={l.slug}>
          <Link
            href={`/companies/${l.slug}`}
            className="group flex items-center gap-2.5 rounded-sm py-1 focus-visible:outline-none focus-visible:ring-[var(--ring)]"
          >
            <CompanyLogo slug={l.slug} name={l.name} size={28} />
            <span className="min-w-0 truncate text-xs font-medium text-[var(--muted-text)] transition-colors group-hover:text-[var(--foreground)]">
              <span className="hl-link">{l.name}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
});