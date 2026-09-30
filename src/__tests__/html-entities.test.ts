import { describe, expect, it } from "vitest";
import { decodeHtmlEntities } from "../../scripts/lib/html";

describe("decodeHtmlEntities (single-pass, CodeQL js/html-entity-unescaping)", () => {
  it("decodes the named entities RBI pages use", () => {
    expect(decodeHtmlEntities("Payments &amp; Settlements")).toBe("Payments & Settlements");
    expect(decodeHtmlEntities("CoA&nbsp;holders")).toBe("CoA holders");
    expect(decodeHtmlEntities("PA-O &ndash; Online")).toBe("PA-O - Online");
    expect(decodeHtmlEntities("&ldquo;quoted&rdquo;")).toBe('"quoted"');
    expect(decodeHtmlEntities("&lsquo;x&rsquo;")).toBe("'x'");
  });

  it("decodes decimal and hex character references", () => {
    expect(decodeHtmlEntities("&#39;")).toBe("'");
    expect(decodeHtmlEntities("&#8486;")).toBe("Ω");
    expect(decodeHtmlEntities("&#x263A;")).toBe("☺");
  });

  it("never double-unescapes — decoded ampersands stay literal", () => {
    expect(decodeHtmlEntities("&amp;amp;")).toBe("&amp;");
    expect(decodeHtmlEntities("&amp;#39;")).toBe("&#39;");
  });

  it("leaves unknown entities and plain text untouched", () => {
    expect(decodeHtmlEntities("&unknown;")).toBe("&unknown;");
    expect(decodeHtmlEntities("no entities here")).toBe("no entities here");
    expect(decodeHtmlEntities("")).toBe("");
    // Out-of-range code point falls back to the raw match.
    expect(decodeHtmlEntities("&#999999999;")).toBe("&#999999999;");
  });
});
