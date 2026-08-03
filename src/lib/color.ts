/**
 * WCAG contrast utilities shared by the matchmaker rank badges and any
 * component that overlays text on a brand colour from the dataset. Because
 * company accent colours are arbitrary runtime values (not Tailwind classes),
 * they can't be validated statically — these helpers compute the contrast at
 * render time and pick a legible text colour.
 */

type RGB = { r: number; g: number; b: number };

/** Parse a `#rrggbb` (or `#rgb`) hex colour into 0-255 channels. */
function parseHex(hex: string): RGB | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const int = parseInt(h, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

/** Convert a 0-255 channel to the WCAG linearised value. */
function channelLinear(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/** WCAG relative luminance of a hex colour (0–1). */
export function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0;
  return (
    0.2126 * channelLinear(rgb.r) +
    0.7152 * channelLinear(rgb.g) +
    0.0722 * channelLinear(rgb.b)
  );
}

/** WCAG contrast ratio between two hex colours (1–21). */
export function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pick black or white text that clears WCAG AA (≥4.5:1) against `background`.
 * Falls back to white for unparseable colours.
 */
export function getContrastingText(background: string): string {
  const whiteRatio = contrastRatio(background, "#ffffff");
  const blackRatio = contrastRatio(background, "#111111");
  return blackRatio >= whiteRatio ? "#111111" : "#ffffff";
}
