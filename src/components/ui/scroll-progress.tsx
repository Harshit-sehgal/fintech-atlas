"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin scroll-progress indicator — fixed at the very top of the viewport.
 * Classic waitlayer/Linear/Vercel detail: fills accent color as you scroll
 * down the page. Hidden on hash-link jumps to avoid jitter.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-[var(--accent)] via-[var(--accent-strong)] to-emerald-400"
      style={{ scaleX }}
    />
  );
}
