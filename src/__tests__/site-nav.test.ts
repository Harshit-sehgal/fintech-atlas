import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  primaryNav,
  moreNav,
  moreNavGroups,
  bottomNav,
  footerExploreLinks,
  footerAboutLinks,
} from "@/lib/site-nav";

const read = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");

const hrefs = (items: Array<{ href: string }>) => items.map((i) => i.href);
const duplicates = (items: string[]) => items.filter((h, i) => items.indexOf(h) !== i);

describe("Site navigation registry", () => {
  it("declares every secondary destination exactly once", () => {
    // moreNav is derived from the groups, so a duplicate inside a group would
    // surface here — and render the same link twice in the menu.
    expect(duplicates(hrefs(moreNav))).toEqual([]);
  });

  it("keeps the flat secondary list in sync with the grouped source", () => {
    expect(moreNav).toEqual(moreNavGroups.flatMap((g) => g.items));
  });

  it("does not repeat a primary destination in the More menu", () => {
    // /companies and /radar are already in the top bar; repeating them in More
    // gives two competing entry points to the same page.
    const overlap = hrefs(moreNav).filter((h) => hrefs(primaryNav).includes(h));
    expect(overlap).toEqual([]);
  });

  it("gives every grouped destination a non-empty heading and description", () => {
    for (const group of moreNavGroups) {
      expect(group.heading.trim()).not.toBe("");
      for (const item of group.items) {
        expect(item.description, `${item.href} needs a clarifier`).toBeTruthy();
        expect(item.description?.trim()).not.toBe("");
      }
    }
  });

  it("uses distinct headings so the menu never shows two identical clusters", () => {
    const headings = moreNavGroups.map((g) => g.heading.toLowerCase());
    expect(duplicates(headings)).toEqual([]);
  });

  it("keeps every footer Explore destination reachable from navigation", () => {
    // The footer is the fallback site map, so a footer-only page is an orphan.
    const navHrefs = new Set([...hrefs(primaryNav), ...hrefs(moreNav)]);
    const orphans = footerExploreLinks
      .map((l) => l.href)
      .filter((h) => !navHrefs.has(h));
    expect(orphans).toEqual([]);
  });

  it("does not duplicate a destination inside a single footer column", () => {
    expect(duplicates(hrefs(footerExploreLinks))).toEqual([]);
    expect(duplicates(hrefs(footerAboutLinks))).toEqual([]);
  });

  it("keeps the mobile bottom bar within thumb-sized budget", () => {
    // Five targets is the stated cap: a sixth drops each below ~58px on a
    // 360px viewport, which fails the touch-target gate.
    expect(bottomNav.length).toBeLessThanOrEqual(5);
  });

  it("never renders a raw path as a link label", () => {
    // Regression: the footer strip once read "See /about" with "/about" as the
    // anchor text, which reads as a broken link to a reader.
    const allLinks = [
      ...primaryNav,
      ...moreNav,
      ...bottomNav,
      ...footerExploreLinks,
      ...footerAboutLinks,
    ];
    for (const link of allLinks) {
      expect(link.label, `${link.href} label looks like a path`).not.toMatch(/^\/|https?:\/\//);
    }
    expect(read("src/components/layout/site-footer.tsx")).not.toMatch(
      />\s*\/about\s*</,
    );
  });
});