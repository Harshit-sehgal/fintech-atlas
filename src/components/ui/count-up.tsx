"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a number up when it first mounts (T160). SSR-safe: the initial render
 * shows the final value, so no-JS and hydration both see the real number; the
 * client then rewinds to 0 and eases up. Respects prefers-reduced-motion and
 * the site's "boring" calm mode, which leave the value static.
 */
export function CountUp({
  value,
  duration = 900,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const boring = document.documentElement.getAttribute("data-ui-mode") === "boring";
    if (reduce || boring) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className={className}>{display.toLocaleString()}</span>;
}
