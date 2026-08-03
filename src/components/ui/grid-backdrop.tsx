/**
 * Decorative grid-pattern backdrop used across page heroes.
 *
 * Wraps the `.grid-bg` CSS utility (a 44px dotted grid with a radial fade) in
 * a `<div aria-hidden>` so every page doesn't need to repeat the same
 * `pointer-events-none absolute ... h-72 grid-bg opacity-30` 70-character
 * class string.
 *
 * The component is purely decorative — it sits behind the page content,
 * ignores pointer events, and is hidden from assistive tech. Three opacity
 * presets cover the realistic contrast range (the hero banner uses 70% so
 * the grid is more visible; sub-page heroes use 30–40%; the footer uses 20%
 * with a different positioning variant).
 */

type GridBackdropProps = {
  /**
   * Visual intensity. Defaults to "hero" (mid-page, 30% opacity). Use
   * "subtle" for small-footprint placements (e.g. footer) and "bold"
   * for the homepage hero, which sits on a dark background.
   */
  variant?: "subtle" | "hero" | "bold";
  /**
   * Position the grid as a full-bleed page background instead of a
   * top-anchored 72-px hero band. Used by the homepage hero and the footer.
   */
  fullBleed?: boolean;
  className?: string;
};

const OPACITY: Record<NonNullable<GridBackdropProps["variant"]>, string> = {
  subtle: "opacity-20",
  hero: "opacity-30",
  bold: "opacity-70",
};

export function GridBackdrop({
  variant = "hero",
  fullBleed = false,
  className = "",
}: GridBackdropProps) {
  const position = fullBleed
    ? "absolute inset-0"
    : "pointer-events-none absolute inset-x-0 -top-10 -z-10 h-72";

  return (
    <div
      aria-hidden="true"
      className={`${position} grid-bg ${OPACITY[variant]} ${className}`.trim()}
    />
  );
}
