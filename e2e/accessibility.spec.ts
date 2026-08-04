import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Automated WCAG accessibility gate (axe-core) over every page template.
// Route list covers each server template plus the client-island tools; the
// settle delay lets framer-motion reveal fades finish so mid-animation color
// blends never produce false contrast failures.

const ROUTES: Array<[string, string]> = [
  ["homepage", "/"],
  ["article", "/articles/wise-vs-payoneer-business-payouts/"],
  ["articles index", "/articles/"],
  ["categories", "/categories/"],
  ["compare", "/compare/"],
  ["glossary", "/glossary/"],
  ["about", "/about/"],
  ["bookmarks", "/bookmarks/"],
  ["tools hub", "/tools/"],
  ["fee calculator island", "/tools/calculator/"],
  ["razorpay fee calculator", "/tools/razorpay-fee-calculator/"],
  ["remittance island", "/tools/remittance/"],
  ["matchmaker island", "/tools/matchmaker/"],
  ["calculators suite", "/tools/calculators/"],
  ["markup calculator", "/tools/exchange-rate-markup-calculator/"],
  ["company profile", "/companies/payoneer/"],
];

for (const [name, route] of ROUTES) {
  test(`no axe violations on ${name} (${route})`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    const results = await new AxeBuilder({ page }).analyze();
    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`,
    );
    expect(summary, `axe violations on ${route}`).toEqual([]);
  });
}
