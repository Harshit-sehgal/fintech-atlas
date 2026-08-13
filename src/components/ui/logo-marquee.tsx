import Link from "next/link";
import { memo } from "react";
import { CompanyLogo } from "./company-logo";

type LogoMarqueeProps = {
  /** Pairs of (slug, name) to render. The component duplicates the list
   *  internally so the marquee can loop seamlessly. */
  logos: { slug: string; name: string }[];
};

/**
 * A continuously auto-scrolling, hover-to-pause row of company brand marks.
 *
 * Pure CSS (no JavaScript animation loop): the strip overflows its masked
 * container and animates translateX(-50%) of the doubled list. Pausing on
 * hover is `animation-play-state`, and `prefers-reduced-motion` disables it.
 * Keeping the animation off the main thread protects interactivity on slow
 * connections (an rAF-based marquee never lets the page become "interactive"
 * while the strip is visible).
 */
export const LogoMarquee = memo(function LogoMarquee({ logos }: LogoMarqueeProps) {
  const items = [...logos, ...logos];

  const itemClass =
    "group flex shrink-0 items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-[var(--border-color)] hover:bg-[var(--subtle-bg)]/60 hover-lift";

  const content = (l: { slug: string; name: string }) => (
    <>
      <div className="opacity-80 group-hover:opacity-100 transition-opacity">
        <CompanyLogo slug={l.slug} name={l.name} size={32} />
      </div>
      <span className="text-xs font-medium text-[var(--muted-text)] group-hover:text-[var(--foreground)] transition-colors">
        {l.name}
      </span>
    </>
  );

  return (
    <div className="marquee-mask relative w-full overflow-hidden">
      <div className="marquee-strip flex w-max gap-10 py-2">
        {items.map((l, i) => {
          // The strip renders each brand twice for a seamless loop. The
          // duplicate copy is rendered as a plain span — not a link — so it
          // adds no keyboard tab stops and no duplicate announcements to
          // screen readers (aria-hidden/inert on the copy are both fragile:
          // the former trips axe's aria-hidden-focus rule, the latter is not
          // supported by this React build).
          const duplicate = i >= logos.length;
          return duplicate ? (
            <span key={`${l.slug}-${i}`} className={itemClass} aria-hidden="true">
              {content(l)}
            </span>
          ) : (
            <Link key={`${l.slug}-${i}`} href={`/companies/${l.slug}`} title={l.name} className={itemClass}>
              {content(l)}
            </Link>
          );
        })}
      </div>
    </div>
  );
});