import { describe, expect, it } from "vitest";
import { Breadcrumbs, breadcrumbJsonLd, type BreadcrumbItem } from "@/components/breadcrumbs";
import { SITE_URL } from "@/lib/site-config";
import { renderToString } from "react-dom/server";

const items: BreadcrumbItem[] = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Fee Estimator", href: "/tools/calculator" },
];

describe("breadcrumbJsonLd", () => {
  it("builds a BreadcrumbList with sequential positions", () => {
    const ld = breadcrumbJsonLd(items);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(ld.itemListElement.map((i) => i.name)).toEqual(["Home", "Tools", "Fee Estimator"]);
  });

  it("normalizes item URLs through canonicalUrl (trailing slash policy)", () => {
    const ld = breadcrumbJsonLd(items);
    expect(ld.itemListElement[0].item).toBe(SITE_URL);
    expect(ld.itemListElement[1].item).toBe(`${SITE_URL}/tools/`);
    expect(ld.itemListElement[2].item).toBe(`${SITE_URL}/tools/calculator/`);
  });

  it("marks the last item as current page in the visible nav", () => {
    const html = renderToString(<Breadcrumbs items={items} />);
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Fee Estimator");
    expect(html).not.toContain('href="/tools/calculator/"'); // last item is not a link
  });

  it("renders link items with hrefs and emits valid JSON-LD", () => {
    const html = renderToString(<Breadcrumbs items={items} />);
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/tools"');
    expect(html).toContain('type="application/ld+json"');
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(match).not.toBeNull();
    const parsed = JSON.parse(match![1]);
    expect(parsed["@type"]).toBe("BreadcrumbList");
    expect(parsed.itemListElement).toHaveLength(3);
  });

  it("handles a single-item breadcrumb", () => {
    const html = renderToString(<Breadcrumbs items={[{ name: "Home", href: "/" }]} />);
    expect(html).toContain('aria-current="page"');
    expect(html).not.toContain('<span aria-hidden="true">/</span>');
  });
});
