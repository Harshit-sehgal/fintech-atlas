"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

type CountUpProps = {
  target: number;
  /** Number of decimal places (default: 0 = integer). */
  decimals?: number;
  suffix?: string;
  /** Animation duration in seconds. */
  duration?: number;
};

/**
 * Animated count-up: starts at 0 and eases to `target` once the element
 * scrolls into view. Used in the hero (integer counts) and the company
 * detail page (decimal rating, 2 fixed places).
 */
export function CountUp({ target, decimals = 0, suffix = "", duration = 1.2 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const formatted = useTransform(mv, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString(),
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, target, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, target, mv, duration]);

  return (
    <motion.span ref={ref}>
      <motion.span>{formatted}</motion.span>
      {suffix}
    </motion.span>
  );
}