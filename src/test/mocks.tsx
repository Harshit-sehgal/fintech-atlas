import { vi } from "vitest";

/**
 * Shared test mocks so client components render in jsdom without a real
 * browser. Import this module FIRST in a component test file so the mocks are
 * registered before the component module is loaded.
 *
 * - framer-motion → plain DOM passthrough (no animation, no layout observers)
 * - next/link       → plain <a> so routing works without the Next runtime
 */

vi.mock("framer-motion", () => {
  // Props that only framer-motion understands; dropping them avoids React
  // "unrecognized prop" warnings when motion elements render as plain DOM.
  const motionProps = new Set([
    "initial", "animate", "exit", "whileInView", "whileHover", "whileTap",
    "whileFocus", "whileDrag", "layout", "layoutId", "transition", "variants",
    "drag", "dragConstraints", "dragElastic", "dragMomentum", "dragSnapToOrigin",
    "onAnimationStart", "onAnimationComplete", "onDrag", "onDragStart", "onDragEnd",
    "viewport", "inherit", "static",
  ]);
  const passthrough = (props: { children?: unknown; [k: string]: unknown }) => {
    const { children, ...rest } = props;
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) {
      if (!motionProps.has(k)) clean[k] = v;
    }
    return <div {...clean}>{children as React.ReactNode}</div>;
  };
  return {
    motion: new Proxy(
      {},
      {
        get: () => passthrough,
      },
    ),
    AnimatePresence: (props: { children?: unknown }) =>
      (props.children as React.ReactNode) ?? null,
    LayoutGroup: (props: { children?: unknown }) =>
      (props.children as React.ReactNode) ?? null,
    useMotionValue: () => ({ get: () => 0 }),
    useTransform: () => 0,
    useSpring: () => ({ get: () => 0 }),
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useInView: () => true,
    useTime: () => 0,
    animate: () => ({}),
  };
});

vi.mock("next/link", () => ({
  default: (props: { href: unknown; children?: unknown; [k: string]: unknown }) => {
    const { href, children, ...rest } = props;
    return (
      <a href={typeof href === "string" ? href : "/"} {...rest}>
        {children as React.ReactNode}
      </a>
    );
  },
}));
