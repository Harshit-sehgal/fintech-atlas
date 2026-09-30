import { test, expect } from "@playwright/test";

/**
 * Horizontal-scroll audit: every key route must never overflow horizontally,
 * in BOTH ui modes (standard + boring), at mobile and desktop widths.
 */
const ROUTES = [
  "/",
  "/companies/",
  "/companies/stripe/",
  "/compare/",
  "/tools/calculator/",
  "/tools/remittance/",
  "/india/",
  "/services/",
  "/articles/razorpay-vs-stripe-payments-india/",
];

const WIDTHS: [string, number][] = [
  ["mobile-390", 390],
  ["desktop-1280", 1280],
];

for (const route of ROUTES) {
  for (const [label, width] of WIDTHS) {
    test(`no horizontal overflow: ${route} (${label}, standard)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} overflowed by ${overflow}px`).toBeLessThanOrEqual(0);
    });

    test(`no horizontal overflow: ${route} (${label}, boring)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route, { waitUntil: "networkidle" });
      await page.evaluate(() => {
        localStorage.setItem("ui-mode", "boring");
        document.documentElement.setAttribute("data-ui-mode", "boring");
      });
      await page.reload({ waitUntil: "networkidle" });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} overflowed by ${overflow}px`).toBeLessThanOrEqual(0);
    });
  }
}
