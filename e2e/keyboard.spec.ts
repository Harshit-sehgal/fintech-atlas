import { test, expect, type Page } from "@playwright/test";

// Keyboard accessibility gate: skip-link behaviour (WCAG 2.4.1) and a
// visible focus indicator on every element reached by Tab (WCAG 2.4.7).
// The visible-indicator check accepts any of the patterns the site uses:
// an outline, a box-shadow ring, or a background change (skip links).

const ROUTES = [
  "/",
  "/articles/wise-vs-payoneer-business-payouts/",
  "/tools/calculators/",
  "/tools/calculator/",
  "/companies/payoneer/",
  "/compare/",
  "/glossary/",
];

// Elements whose focus indicator is not a visual signal (native controls the
// browser styles differently, or elements that are intentionally not
// keyboard-reachable in this test run).
const IGNORED = ["input", "select", "textarea", "[contenteditable]"];

async function hasVisibleIndicator(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    if (!el) return false;
    const s = getComputedStyle(el);
    const outline = s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0 && s.outlineColor !== "rgba(0, 0, 0, 0)";
    const shadow = s.boxShadow !== "none" && s.boxShadow.trim() !== "";
    // Skip links toggle from sr-only to a fixed, backgrounded chip on focus.
    const bg = s.backgroundColor;
    const hasBg = bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
    return outline || shadow || hasBg;
  });
}

test.describe("keyboard accessibility", () => {
  for (const route of ROUTES) {
    test(`every Tab stop has a visible focus indicator on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(1200);

      const failures: string[] = [];
      for (let i = 0; i < 60; i++) {
        await page.keyboard.press("Tab");
        const info = await page.evaluate((ignored) => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          if (ignored.some((sel) => el.matches(sel))) return "ignored";
          return {
            tag: el.tagName.toLowerCase(),
            text: (el.textContent ?? "").trim().slice(0, 40),
            cls: (el.className as string).slice(0, 60),
          };
        }, IGNORED);
        if (!info) break;
        if (info === "ignored") continue;
        const visible = await hasVisibleIndicator(page);
        if (!visible) {
          failures.push(`${info.tag}:${info.text || info.cls || "(untitled)"}`);
        }
      }

      expect(failures, `no visible focus indicator on ${route}`).toEqual([]);
    });
  }

  test("skip link jumps to main content", async ({ page }) => {
    await page.goto("/articles/wise-vs-payoneer-business-payouts/", { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeVisible();
    await skip.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("keyboard reaches main navigation links", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    const nav = page.getByRole("navigation", { name: /Primary/i });
    // Tab until the nav contains the focus, then confirm a nav link is focused.
    let found = false;
    for (let i = 0; i < 30 && !found; i++) {
      await page.keyboard.press("Tab");
      found = await nav.evaluate((n) => n.contains(document.activeElement));
    }
    expect(found, "Tab reaches the primary navigation").toBe(true);
  });
});
