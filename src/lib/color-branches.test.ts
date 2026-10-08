import { describe, expect, it } from "vitest";
import { contrastRatio, getContrastingText, relativeLuminance } from "./color";

describe("relativeLuminance", () => {
  it("returns 0 for unparseable colours", () => {
    expect(relativeLuminance("#zzzzzz")).toBe(0);
    expect(relativeLuminance("not-a-colour")).toBe(0);
  });

  it("expands 3-digit hex and handles both channel-linearisation branches", () => {
    expect(relativeLuminance("#fff")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000")).toBe(0);
    expect(relativeLuminance("#101010")).toBeGreaterThan(0);
  });
});

describe("contrastRatio", () => {
  it("is highest between black and white and symmetric", () => {
    expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21, 0);
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(
      contrastRatio("#ffffff", "#000000"),
      5,
    );
  });
});

describe("getContrastingText", () => {
  it("picks black on light backgrounds and white on dark or invalid ones", () => {
    expect(getContrastingText("#ffffff")).toBe("#111111");
    expect(getContrastingText("#000000")).toBe("#ffffff");
    expect(getContrastingText("not-a-colour")).toBe("#ffffff");
  });
});
