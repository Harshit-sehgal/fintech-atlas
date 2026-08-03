import { describe, it, expect } from "vitest";
import {
  relativeLuminance,
  contrastRatio,
  getContrastingText,
} from "@/lib/color";

describe("color contrast utilities", () => {
  it("computes WCAG relative luminance (white > gray > black)", () => {
    expect(relativeLuminance("#ffffff")).toBeGreaterThan(0.9);
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeGreaterThan(relativeLuminance("#808080"));
    expect(relativeLuminance("#808080")).toBeGreaterThan(relativeLuminance("#000000"));
  });

  it("computes contrast ratio correctly", () => {
    // White vs black maxes out at 21.
    expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21);
    // Same colour → 1.
    expect(contrastRatio("#1e6b4c", "#1e6b4c")).toBeCloseTo(1);
    // IndianRed over white should fail AA (white-on-red is ~4.0:1) — used to
    // prove the badge picks black or white correctly below.
    expect(contrastRatio("#ffffff", "#cd5c5c")).toBeLessThan(4.5);
  });

  it("returns white text for dark backgrounds and near-black for light", () => {
    expect(getContrastingText("#1e6b4c")).toBe("#ffffff");
    expect(getContrastingText("#f5deb3")).toBe("#111111");
    // Square's light brand grey-ish mark → dark text for legibility.
    expect(getContrastingText("#e9e9e9")).toBe("#111111");
  });

  it("picks the legible text colour for each background", () => {
    // A pure black/white pair cannot always reach 4.5:1 on every mid-tone brand
    // colour, so the contract is "return the better of black/white".
    for (const bg of ["#1e6b4c", "#635BFF", "#f5deb3", "#c8c8c8", "#0ABF53", "#e6007a"]) {
      const text = getContrastingText(bg);
      const white = contrastRatio("#ffffff", bg);
      const black = contrastRatio("#111111", bg);
      const chosen = contrastRatio(text, bg);
      // Returns whichever of black/white has the higher contrast.
      expect(chosen).toBeCloseTo(Math.max(white, black), 5);
      expect(["#ffffff", "#111111"]).toContain(text);
    }
  });

  it("achieves AA (4.5:1) for the brand colours used as rank badges", () => {
    // Known rank-badge backgrounds that DO clear AA with black or white.
    for (const bg of ["#1e6b4c", "#635BFF", "#0ABF53", "#003087", "#009CDE"]) {
      expect(contrastRatio(getContrastingText(bg), bg)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
