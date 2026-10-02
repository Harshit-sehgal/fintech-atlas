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
  easing: {
    editorial: [0.22, 1, 0.36, 1] as const,
  },
  transition: {
    layout: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
    layoutFast: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
    layoutEaseInOut: { duration: 0.25, ease: "easeInOut" as const },
    reveal: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
    /* Menus and overlays. A dropdown is a direct response to a click, so it
       has to feel immediate — `reveal`'s 0.48s read as lag on something the
       reader already asked for. Short, and with no travel distance. */
    dropdown: { duration: 0.14, ease: [0.22, 1, 0.36, 1] as const },
    /* The active-nav indicator slides between items (shared layoutId). A
       spring on a 1px underline looks wobbly, so this is a crisp ease. */
    underline: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
  },
};