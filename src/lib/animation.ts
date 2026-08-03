/**
 * Shared framer-motion transition presets. Imported as
 *   import { animationPresets as animation } from "@/lib/animation";
 *   <motion.div transition={animation.transition.springDefault} ... />
 *
 * Keep this object minimal — every field is referenced from a component or it
 * belongs in the git history, not here. Past iterations accumulated `spring`,
 * `duration`, `ease`, `stagger`, plus 8 unused `transition.*` sub-fields
 * (layoutSlower, fast/normal/slow/slower, transform, colors, all); they were
 * removed after a grep audit confirmed zero consumers.
 */
export const animationPresets = {
  transition: {
    // For motion components
    springDefault: { type: "spring" as const, stiffness: 380, damping: 30 },
    springBouncier: { type: "spring" as const, stiffness: 380, damping: 32 },
    layout: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
    layoutFast: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
    layoutEaseInOut: { duration: 0.25, ease: "easeInOut" as const },
  },
};