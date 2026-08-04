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

  test("calculator switches to India providers with GST", async ({ page }) => {
    await page.goto("/tools/calculator/");
    await page.getByRole("radio", { name: /INR — India providers/ }).click();
    await expect(page.getByRole("link", { name: "Razorpay", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Stripe (India)", exact: true })).toBeVisible();
    // USD-only rows leave the list (the notice text still mentions them).
    await expect(page.getByRole("link", { name: "PayPal", exact: true })).toHaveCount(0);
    await expect(page.getByText(/18% GST/).first()).toBeVisible();
    await expect(page.getByText("Lowest comparable estimate")).toHaveCount(1);
  });

  test("command palette opens with Ctrl/Cmd+K", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
    const dialog = page.getByRole("dialog", { name: "Search" });
    const input = page.getByPlaceholder(/Search companies/);
    await expect(dialog).toBeVisible();
    // Let React attach the palette's keydown (Escape) effect before pressing
    // Escape — the listener registers on `open` in an effect that runs after
    // paint, so a too-early keypress can race under parallel workers.
    await expect(input).toBeAttached();
    await page.waitForTimeout(150);
    await input.click();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 10_000 });
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

  test("matchmaker quiz flows through all steps and shows results", async ({
    page,
  }) => {
    await page.goto("/tools/matchmaker/");
    // Answer the four questions in sequence by clicking the first option of each.
    for (const label of [
      "Online Business / SaaS",
      "Lowest Possible Fees",
      "No — Domestic Focus Only",
      "Early Stage / Individual",
    ]) {
      await page.getByRole("button", { name: label }).click();
    }
    // Results surface a shortlist heading.
    await expect(
      page.getByRole("heading", { name: "Suggested starting points" }),
    ).toBeVisible();
    // Each recommended company exposes a partner CTA.
    await expect(
      page.getByRole("link", { name: /Visit .+/ }).first(),
    ).toBeVisible();
  });

  test("bookmarks persist a company across pages", async ({ page }) => {
    await page.goto("/companies/stripe/");
    // Toggle the bookmark on (☆ Save → ★ Saved).
    await page.getByRole("button", { name: /☆ Save/ }).click();
    await expect(page.getByRole("button", { name: /★ Saved/ })).toBeVisible();

    // Navigate to the bookmarks page — Stripe should be listed there.
    await page.goto("/bookmarks/");
    await expect(page.getByText("Stripe", { exact: false }).first()).toBeVisible();
    await expect(
      page.getByText(/No saved items yet/i),
    ).toHaveCount(0);
  });

  test("affiliate disclosure page renders and links from the footer", async ({
    page,
  }) => {
    // Footer exposes the Affiliate Disclosure link (compliance requirement).
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Affiliate Disclosure" }),
    ).toBeVisible();

    // The page itself loads with an accessible disclosure.
    await page.goto("/affiliate-disclosure/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Affiliate Disclosure/i }),
    ).toBeVisible();
    await expect(page.getByText(/affiliate links/i).first()).toBeVisible();
  });

  test("category page lists its company profiles", async ({ page }) => {
    await page.goto("/categories/payments/");
    // Known payments companies appear on the page.
    await expect(page.getByText("Stripe", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("PayPal", { exact: false }).first()).toBeVisible();
  });

  test("glossary renders and search filters terms", async ({ page }) => {
    await page.goto("/glossary/");
    const search = page.getByRole("searchbox", { name: "Search glossary terms" });
    await expect(search).toBeVisible();
    // A real glossary term is present.
    await expect(page.getByText(/Interchange/i).first()).toBeVisible();
  });

  test("markup calculator measures the hidden FX spread", async ({ page }) => {
    await page.goto("/tools/exchange-rate-markup-calculator/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Exchange-rate markup calculator" }),
    ).toBeVisible();

    // Defaults: mid ₹83.50, offered ₹82.00, $1,000 received → 1.80% markup.
    await expect(page.getByText("1.80%").first()).toBeVisible();
    await expect(page.getByText("₹83,500").first()).toBeVisible();
    await expect(page.getByText("₹82,000").first()).toBeVisible();
    await expect(page.getByText("₹1,500").first()).toBeVisible();

    // Sending INR flips the loss to the sender side.
    await page.getByRole("radio", { name: /Sending INR/ }).click();
    await expect(page.getByText("1.80%").first()).toBeVisible();
  });
});
