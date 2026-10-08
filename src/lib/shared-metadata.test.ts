import { describe, expect, it } from "vitest";
import { clampDescription, htmlAttrLength, pageMetadata } from "./shared-metadata";

describe("htmlAttrLength", () => {
  it("counts the escaped attribute length", () => {
    expect(htmlAttrLength("a&b")).toBe(7); // a&amp;b
    expect(htmlAttrLength('say "hi"')).toBeGreaterThan(7);
  });
});

describe("clampDescription", () => {
  it("passes through descriptions within budget", () => {
    const short = "A short description.";
    expect(clampDescription(short)).toBe(short);
  });

  it("trims long descriptions at a word boundary with an ellipsis", () => {
    const long = `${"word ".repeat(60)}end`;
    const clamped = clampDescription(long, 50);
    expect(clamped.endsWith("…")).toBe(true);
    expect(htmlAttrLength(clamped)).toBeLessThanOrEqual(51);
  });

  it("does not retreat to a word boundary when the cut is past halfway", () => {
    // One very long token: lastIndexOf(" ") is -1 → no retreat.
    const clamped = clampDescription("x".repeat(200), 50);
    expect(clamped).toBe(`${"x".repeat(49)}…`);
  });
});

describe("pageMetadata", () => {
  it("builds canonical, openGraph and applies defaults", () => {
    const meta = pageMetadata({ pathname: "/about", title: "About", description: "About page." });
    expect(meta.alternates?.canonical).toContain("/about");
    expect(meta.openGraph?.title).toBe("About — FinTech Atlas");
    expect((meta.openGraph as { type?: string })?.type).toBe("website");
  });

  it("honours overrides: type, separator, extraOg and extraAlternates", () => {
    const meta = pageMetadata({
      pathname: "/x",
      title: "X",
      description: "Desc.",
      ogTitle: "Custom",
      ogDescription: "Custom desc",
      type: "article",
      ogSeparator: "·",
      extraOg: { section: "Guides" },
      extraAlternates: { canonical: "https://example.com/override" },
    });
    expect(meta.openGraph?.title).toBe("Custom · FinTech Atlas");
    expect((meta.openGraph as { type?: string })?.type).toBe("article");
    expect((meta.openGraph as Record<string, unknown>).section).toBe("Guides");
    expect(meta.alternates?.canonical).toBe("https://example.com/override");
  });
});
