import { test, expect } from "@playwright/test";

// Critical user flows exercised against the static export (`npm run build`
// then `npm run test:e2e`). Covers the audit #52 checklist.

test.describe("critical flows", () => {
  test("homepage loads and shows the header", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: /Primary/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  });

  test("company profile opens from a deep link", async ({ page }) => {
    await page.goto("/companies/stripe/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Stripe/i }),
    ).toBeVisible();
  });

  test("unknown URL returns the 404 page", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    // The pinned static host serves the app's emitted 404 document with a
    // real 404 status (production static hosts do the same with 404.html).
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/doesn't exist or has moved/i)).toBeVisible();
  });

  test("calculator renders providers and a single lowest estimate", async ({ page }) => {
    await page.goto("/tools/calculator/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Payment Gateway Fee Calculator" }),
    ).toBeVisible();
    for (const name of ["Stripe", "PayPal", "Square", "Adyen"]) {
      await expect(page.getByText(name, { exact: false }).first()).toBeVisible();
    }
    await expect(page.getByText("Lowest comparable estimate")).toHaveCount(1);
    await expect(page.getByText("Custom contract")).toBeVisible();
  });

  test("command palette opens with Ctrl/Cmd+K", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
    const dialog = page.getByRole("dialog", { name: "Search" });
    await expect(dialog).toBeVisible();
    // Wait until the input is focused — this confirms the palette's keydown
    // listener (registered in a React effect on open) is attached before we
    // press Escape, avoiding a flaky race under parallel workers.
    await expect(page.getByPlaceholder(/Search companies/)).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("compare deep link preserves the selected companies", async ({ page }) => {
    await page.goto("/compare?companies=stripe,paypal");
    await expect(page.getByText("Stripe", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("PayPal", { exact: false }).first()).toBeVisible();
  });

  test("theme toggle switches the data-theme attribute", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /^Theme:/ });
    const before = await page.evaluate(() =>
      document.documentElement.getAttribute("data-theme"),
    );
    await toggle.click();
    const after = await page.evaluate(() =>
      document.documentElement.getAttribute("data-theme"),
    );
    // First click from the default "system" goes to "light".
    expect(after).toBe("light");
    expect(before).not.toBeNull();
  });

  test("company profile renders a disclosed partner CTA", async ({ page }) => {
    await page.goto("/companies/stripe/");
    const cta = page.getByRole("link", { name: /Visit Stripe/ });
    await expect(cta).toBeVisible();
    // All outbound CTAs must open in a new tab safely (noopener present).
    await expect(cta).toHaveAttribute("rel", /noopener/);
  });

  test("no earning disclosure shows while no offer is commercial", async ({ page }) => {
    // Honesty inverse: with no commercial relationship yet configured, the
    // affiliate disclosure must NOT appear on a company profile.
    await page.goto("/companies/stripe/");
    await expect(page.getByText(/may earn a commission/i)).toHaveCount(0);
  });

  test("calculator rows expose a partner CTA", async ({ page }) => {
    await page.goto("/tools/calculator/");
    await expect(
      page.getByRole("link", { name: /Visit Stripe/ }).first(),
    ).toBeVisible();
  });

  test("remittance rows expose an open CTA", async ({ page }) => {
    await page.goto("/tools/remittance/");
    await expect(
      page.getByRole("link", { name: /Open Wise/ }).first(),
    ).toBeVisible();
  });

  test("compare columns expose a partner CTA", async ({ page }) => {
    await page.goto("/compare?companies=stripe,paypal");
    await expect(
      page.getByRole("link", { name: /Visit Stripe/ }).first(),
    ).toBeVisible();
  });
});
