import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join, relative } from "node:path";

const appRoot = resolve(process.cwd(), "src/app");
const read = (p: string) => readFileSync(p, "utf8");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const pageFiles = walk(appRoot).filter((f) => f.endsWith("page.tsx"));

/**
 * A route's visible trail is not always in its own page file. Three shapes
 * exist in this app:
 *
 *  1. server pages that render <Breadcrumbs> directly;
 *  2. thin server shells whose body is a client island (/companies, /compare,
 *     /bookmarks, /about) — the trail sits in the sibling client module;
 *  3. shared page components used by several routes (LegalPage) — the trail
 *     sits in the component, reached by import.
 *
 * So the scan follows the page's siblings and its `@/components/*` imports. This
 * is a heuristic, but it fails loudly (see the sanity test below) rather than
 * silently passing an empty file list.
 */
const surfaceSource = (pageFile: string): string => {
  const dir = pageFile.replace(/page\.tsx$/, "");
  const collected = new Set<string>([pageFile]);

  for (const entry of readdirSync(dir)) {
    if (entry.endsWith(".tsx") && entry !== "page.tsx") collected.add(join(dir, entry));
  }

  for (const file of [...collected]) {
    for (const m of read(file).matchAll(/from "(@\/components\/[^"]+)"/g)) {
      // "@/components/x" -> "<cwd>/src/components/x" (the tsconfig path alias)
      const target = resolve(process.cwd(), `src/${m[1].slice(2)}.tsx`);
      if (existsSync(target)) collected.add(target);
    }
  }

  return [...collected].map(read).join("\n");
};

/** Routes that legitimately have no breadcrumb trail. */
const EXEMPT = new Set([
  "src/app/page.tsx", // homepage — a lone "Home" crumb tells a reader nothing
]);

const routeOf = (f: string) =>
  `/${relative(appRoot, f).replace(/page\.tsx$/, "").replace(/\/$/, "")}` || "/";

describe("Breadcrumb coverage", () => {
  it("scans a non-empty route tree", () => {
    expect(pageFiles.length).toBeGreaterThan(30);
  });

  it("follows client islands and shared page components", () => {
    // Guards the scanner itself. Without this, a broken resolver would make
    // the coverage test below pass by never finding any source at all.
    // /bookmarks keeps its trail in a sibling client module; /privacy keeps it
    // in a shared component reached by import.
    const bookmarks = pageFiles.find((f) => f.endsWith("app/bookmarks/page.tsx"))!;
    const privacy = pageFiles.find((f) => f.endsWith("app/privacy/page.tsx"))!;
    expect(surfaceSource(bookmarks)).toContain("<Breadcrumbs");
    expect(surfaceSource(privacy)).toContain("<Breadcrumbs");
    // Sanity: the raw page files genuinely do NOT contain it, which is exactly
    // why following siblings/imports is required.
    expect(read(bookmarks)).not.toContain("<Breadcrumbs");
    expect(read(privacy)).not.toContain("<Breadcrumbs");
  });

  it("gives every routable page a breadcrumb trail", () => {
    // <Breadcrumbs> emits the BreadcrumbList JSON-LD alongside the visible nav,
    // so a page needs one of the two mechanisms — not both.
    const missing: string[] = [];
    for (const file of pageFiles) {
      if (EXEMPT.has(relative(process.cwd(), file))) continue;
      const src = surfaceSource(file);
      if (!/<Breadcrumbs\b/.test(src) && !/breadcrumbJsonLd/.test(src)) {
        missing.push(routeOf(file));
      }
    }
    expect(missing).toEqual([]);
  });

  it("leaves no hand-rolled breadcrumb nav behind", () => {
    // The ad-hoc versions had no accessible name, so assistive tech announced
    // them as an unlabelled run of links. Only <Breadcrumbs> may own the pattern.
    const offenders = pageFiles
      .filter((f) => /<nav className="mb-6/.test(surfaceSource(f)))
      .map(routeOf);
    expect(offenders).toEqual([]);
  });

  it("never renders the current page as a link in the trail", () => {
    // Every consumer depends on this; a regression would ship a self-link.
    const src = read("src/components/breadcrumbs.tsx");
    expect(src).toContain('aria-current="page"');
    expect(src).toMatch(/index === items\.length - 1/);
  });

  it("keeps the built trail reachable in the exported output", () => {
    // Cheap guard that the component still emits into server HTML: the check
    // above is static, this one is behavioural.
    const src = read("src/components/breadcrumbs.tsx");
    expect(src).toContain('type="application/ld+json"');
    expect(src).toContain('aria-label="Breadcrumb"');
  });
});