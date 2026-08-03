"use client";

import Link from "next/link";
import { motion, useTime, useTransform } from "framer-motion";
import { useCallback, useMemo, useRef } from "react";
import { CompanyLogo } from "./company-logo";

type LogoMarqueeProps = {
  /** Pairs of (slug, name) to render. The component duplicates the list
   *  internally so the marquee can loop seamlessly. */
  logos: { slug: string; name: string }[];
  /** Approximate seconds for one full pass of the strip. */
  speed?: number;
};

/**
 * A continuously auto-scrolling, hover-to-pause row of company brand marks.
 *
 * We drive the x-position with framer-motion's `useTime` + `useTransform`
 * and gate advancement with a ref. When hovered, the phase freezes at the
 * current time then resumes from that same point when the pointer leaves.
 * The old `whileHover={{ animationPlayState: "paused" }}` was a no-op:
 * framer-motion drives transforms via JavaScript, not CSS animations.
 */
export function LogoMarquee({ logos, speed = 40 }: LogoMarqueeProps) {
  const items = useMemo(() => [...logos, ...logos], [logos]);
  const time = useTime();

  // Snapshot of wall-clock ms at the moment the pointer entered; 0 = running.
  const frozenAt = useRef<number>(0);

  const offset = useTransform(time, (t) => {
    if (frozenAt.current) return frozenAt.current;
    return t;
  });

  // Phase 0→1 maps to x 0% → -50% (one duplicate set width).
  const phase = useTransform(offset, (o) => ((o / 1000) / speed) % 1);
  const x = useTransform(phase, (p) => `calc(${-(p * 50).toFixed(4)}%)`);

  const handleEnter = useCallback(() => {
    frozenAt.current = time.get();
  }, [time]);

  const handleLeave = useCallback(() => {
    frozenAt.current = 0;
  }, []);

  return (
    <div className="marquee-mask relative w-full">
      <motion.div
        className="flex w-max gap-10 py-2"
        style={{ x, willChange: "transform" }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
      >
        {items.map((l, i) => (
          <Link
            key={`${l.slug}-${i}`}
            href={`/companies/${l.slug}`}
            title={l.name}
            className="group flex shrink-0 items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-[var(--border-color)] hover:bg-[var(--subtle-bg)]/60 hover-lift"
          >
            <div className="opacity-80 group-hover:opacity-100 transition-opacity">
              <CompanyLogo slug={l.slug} name={l.name} size={32} />
            </div>
            <span className="text-xs font-medium text-[var(--muted-text)] group-hover:text-[var(--foreground)] transition-colors">
              {l.name}
            </span>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}