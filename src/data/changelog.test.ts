import { describe, expect, it } from "vitest";
import { changelog, changelogKinds } from "./changelog";
import { articles } from "./articles";

describe("changelog data", () => {
  it("keeps every entry's kind within the declared set", () => {
    for (const entry of changelog) {
      expect(changelogKinds).toContain(entry.kind);
    }
  });

  it("keeps dates in strict descending order (newest first)", () => {
    for (let i = 1; i < changelog.length; i++) {
      expect(changelog[i - 1]!.date >= changelog[i]!.date).toBe(true);
    }
  });

  it("keeps every date valid and every (href, title) pair unique", () => {
    const seen = new Set<string>();
    for (const entry of changelog) {
      expect(/^\d{4}-\d{2}-\d{2}$/.test(entry.date)).toBe(true);
      expect(Number.isNaN(Date.parse(entry.date))).toBe(false);
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThanOrEqual(30);
      const key = `${entry.href}\u0000${entry.title}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });
  it("points every internal href at a real page", () => {
    const articleSlugs = new Set(articles.map((a) => `/articles/${a.slug}/`));
    for (const entry of changelog) {
      if (entry.href.startsWith("http")) continue;
      const internal = [
        "/",
        "/articles/",
        "/tools/",
        "/tools/calculators/",
        "/tools/calculator/",
        "/tools/razorpay-fee-calculator/",
        "/tools/remittance/",
        "/tools/exchange-rate-markup-calculator/",
        "/tools/matchmaker/",
        "/services/",
        "/changelog/",
      ];
      const isKnownRoute =
        articleSlugs.has(entry.href) || internal.includes(entry.href);
      expect(isKnownRoute, `unknown internal href: ${entry.href}`).toBe(true);
    }
  });
});
