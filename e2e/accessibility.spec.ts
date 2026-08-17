import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Automated WCAG accessibility gate (axe-core) over every page template, in
// both color themes. Route lists cover each server template plus the
// client-island tools; the settle delay lets framer-motion reveal fades
// finish so mid-animation color blends never produce false contrast
// failures. The dark pass forces the theme via localStorage before hydration
// (the ThemeProvider reads it on mount).

const ROUTES: Array<[string, string]> = [
  ["homepage", "/"],
  ["article", "/articles/wise-vs-payoneer-business-payouts/"],
  ["articles index", "/articles/"],
  ["categories", "/categories/"],
  ["category detail", "/categories/payments/"],
  ["compare", "/compare/"],
  ["404 page", "/does-not-exist/"],
  ["company profile (bright brand)", "/companies/stripe/"],
  ["glossary", "/glossary/"],
  ["about", "/about/"],
  ["india directory", "/india/directory/"],
  ["india directory profile", "/india/directory/razorpay/"],
  ["bookmarks", "/bookmarks/"],
  ["tools hub", "/tools/"],
  ["fee calculator island", "/tools/calculator/"],
  ["razorpay fee calculator", "/tools/razorpay-fee-calculator/"],
  ["remittance island", "/tools/remittance/"],
  ["matchmaker island", "/tools/matchmaker/"],
  ["calculators suite", "/tools/calculators/"],
  ["markup calculator", "/tools/exchange-rate-markup-calculator/"],
  ["company profile", "/companies/payoneer/"],
  ["services", "/services/"],
  ["services sample report", "/services/gateway-selection-report-sample/"],
  ["services checklist", "/services/payment-gateway-implementation-checklist/"],
  ["changelog", "/changelog/"],
  ["article with tables + related guides", "/articles/receiving-5000-usd-from-us-client-in-india/"],
  ["fee-index table article", "/articles/quarterly-india-cross-border-fee-index/"],
  ["privacy", "/privacy/"],
  ["terms", "/terms/"],
  ["affiliate disclosure", "/affiliate-disclosure/"],
  ["radar review queue", "/radar/review/"],
];

// Dark theme exercises the light accent twins (per-tool/calculator/category
// palettes) and the dark tokens; includes bright-brand companies.
const DARK_ROUTES: Array<[string, string]> = [
  ["homepage", "/"],
  ["article", "/articles/wise-vs-payoneer-business-payouts/"],
  ["category detail", "/categories/payments/"],
  ["glossary", "/glossary/"],
  ["tools hub", "/tools/"],
  ["fee calculator island", "/tools/calculator/"],
  ["razorpay fee calculator", "/tools/razorpay-fee-calculator/"],
  ["remittance island", "/tools/remittance/"],
  ["matchmaker island", "/tools/matchmaker/"],
  ["calculators suite", "/tools/calculators/"],
  ["markup calculator", "/tools/exchange-rate-markup-calculator/"],
  ["company profile (bright brand)", "/companies/stripe/"],
  ["changelog", "/changelog/"],
  ["article with tables + related guides", "/articles/receiving-5000-usd-from-us-client-in-india/"],
  ["services", "/services/"],
  ["services checklist", "/services/payment-gateway-implementation-checklist/"],
];

async function expectAxeClean(page: Page, route: string) {
  await page.waitForTimeout(1500);
  const results = await new AxeBuilder({ page }).analyze();
  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`,
  );
  expect(summary, `axe violations on ${route}`).toEqual([]);
}

for (const [name, route] of ROUTES) {
  test(`no axe violations on ${name} (${route})`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await expectAxeClean(page, route);
  });
}

for (const [name, route] of DARK_ROUTES) {
  test(`no axe violations on ${name} in dark theme (${route})`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto(route, { waitUntil: "networkidle" });
    await expectAxeClean(page, `${route} [dark]`);
  });
}
