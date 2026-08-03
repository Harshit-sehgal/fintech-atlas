"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { animationPresets as animation } from "@/lib/animation";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Fade + slide-up reveal triggered when the element scrolls into view.
 * Designed to be subtle: short distance, gentle easing.
 */
export function Reveal({ children, delay = 0, y = 16, className, as = "div" }: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ ...animation.transition.reveal, delay }}
    >
      {children}
    </MotionTag>
  );
}