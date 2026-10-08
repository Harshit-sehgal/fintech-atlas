/**
 * Highlighter — hand-marked emphasis, no boxes or rules.
 *
 * A marker swipe that paints behind text, matching the warm paper +
 * forest-ink editorial vibe. Use for anything that used to be a bordered
 * card title, a hairline-separated stat, or an active-nav underline.
 *
 * Usage:
 *   <Highlight>real fees</Highlight>
 *   <Highlight color="green" animate>international</Highlight>
 *
 * - `color`: yellow (default, warm butter), green (forest tint), pink (soft rose)
 * - `animate`: sweeps the marker in when scrolled into view (IntersectionObserver).
 *   Without it the mark is just there — still no box, still no border.
 * - Respects prefers-reduced-motion (marks appear instantly, no sweep).
 * - Light theme only: dark paper drops the wash and emphasises with
 *   ink + semantic colour instead (a translucent mark over light ink
 *   reads as a smudge).
 */
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type HighlightColor = "yellow" | "green" | "pink";

export function Highlight({
  children,
  color = "yellow",
  animate = true,
  className = "",
  as: Tag = "span",
}: {
  children: ReactNode;
  color?: HighlightColor;
  animate?: boolean;
  className?: string;
  as?: "span" | "em" | "strong" | "mark";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // No observer (old browser / SSR edge): reveal on next frame instead of
      // a sync setState-in-effect, keeping the lint rule + perf happy.
      const t = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);

  return (
    <Tag
      // ref callback keeps the generic Tag simple for TS
      ref={ref as never}
      className={`hl hl-${color}${animate ? " hl-animate" : ""}${
        inView ? " is-inview" : ""
      }${className ? ` ${className}` : ""}`}
    >
      {children}
    </Tag>
  );
}

/**
 * Small hand-drawn divider: a single marker stroke, centered. Replaces
 * `border-t` section rules. With `animate`, the stroke draws left→right when
 * it scrolls into view (respects reduced-motion and boring mode).
 */
export function MarkerRule({
  className = "",
  color = "yellow",
  animate = false,
}: {
  className?: string;
  color?: HighlightColor;
  animate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [inView, setInView] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const t = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`marker-rule marker-rule-${color}${animate ? " marker-rule-animate" : ""}${
        inView ? " is-inview" : ""
      }${className ? ` ${className}` : ""}`}
    />
  );
}
