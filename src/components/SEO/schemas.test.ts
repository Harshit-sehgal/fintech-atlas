import { describe, it, expect } from "vitest";
import {
  organizationSchema,
  websiteSchema,
  sanitiseJsonLd,
  ORGANIZATION_ID,
} from "./schemas";
import { SITE_URL } from "@/lib/site-config";
import { itemListSchema } from "./StructuredData";

describe("JSON-LD shared schemas", () => {
  it("organizationSchema pins stable @id so other schemas can reference it", () => {
    expect(organizationSchema["@id"]).toBe(ORGANIZATION_ID);
    expect(ORGANIZATION_ID).toBe(`${SITE_URL}#organization`);
  });

  it("websiteSchema references the Organization by @id (Knowledge Graph cross-link)", () => {
    expect(websiteSchema.publisher).toEqual({ "@id": ORGANIZATION_ID });
  });

  it("both schemas use the schema.org @context", () => {
    expect(organizationSchema["@context"]).toBe("https://schema.org");
    expect(websiteSchema["@context"]).toBe("https://schema.org");
  });

  it("organizationSchema follows the schema.org docs (no trailing slash on `url`)", () => {
    // schema.org Organization examples omit the trailing slash on `url`; the
    // site URL is the bare origin. `logo` and `description` are required so
    // Search Console accepts the entity.
    expect(organizationSchema.url).toBe(SITE_URL);
    expect(organizationSchema.logo).toBe(`${SITE_URL}/apple-touch-icon.png`);
    expect(organizationSchema.description).toBeTruthy();
  });

  it("websiteSchema omits SearchAction (site has no /search endpoint — server-side search would 404)", () => {
    expect(websiteSchema).not.toHaveProperty("potentialAction");
  });

  it("directory ItemList URLs use the shared trailing-slash canonical helper", () => {
    const items = itemListSchema.itemListElement;
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.url).toMatch(new RegExp(`^${SITE_URL}/companies/[^/]+/$`));
    }
  });

  describe("sanitiseJsonLd — XSS guard", () => {
    it("escapes `<` to prevent tag-injection when rendered via dangerouslySetInnerHTML", () => {
      // `<script>alert(1)</script>` inside a JSON-LD <script> block would
      // otherwise break out of the script element and execute. The guard
      // turns every `<` into `\u003c`, which JSON.parse() un-escapes back to
      // `<` for the parsed schema but keeps the literal sequence safe in HTML.
      const malicious = { name: "</script><script>alert(1)</script>" };
      expect(sanitiseJsonLd(malicious)).toBe(
        '{"name":"\\u003c/script>\\u003cscript>alert(1)\\u003c/script>"}'
      );
    });

    it("does not alter non-`<` characters (identity transformation otherwise)", () => {
      const safe = { name: "FinTech Atlas", url: "https://example.com" };
      expect(sanitiseJsonLd(safe)).toBe(JSON.stringify(safe));
    });

    it("renders both schemas without injecting any `<`", () => {
      // Belt-and-braces: confirm the production-shape payloads are safe too.
      expect(sanitiseJsonLd(organizationSchema)).not.toMatch(/</);
      expect(sanitiseJsonLd(websiteSchema)).not.toMatch(/</);
    });
  });
});
