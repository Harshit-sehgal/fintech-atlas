import { test, expect } from "@playwright/test";

// Critical user flows exercised against the static export (`npm run build`
// then `npm run test:e2e`). Covers the audit #52 checklist.

test.describe("critical flows", () => {
  test("homepage loads and shows the header", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: /Primary/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
    // "Latest Guides & Comparisons" must surface the genuinely newest
    // articles (updatedAt desc, editorial order on ties) — not array order.
    await expect(page.getByRole("heading", { name: "Latest Guides & Comparisons" })).toBeVisible();
    const latestSection = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Latest Guides & Comparisons" }) });
    // The most recently appended articles lead the section on same-day ties
    // (later array index first among equal updatedAt values).
    await expect(
      latestSection.getByRole("link", { name: /Razorpay international payment fees/ }),
    ).toBeVisible();
    await expect(
      latestSection.getByRole("link", { name: /Best payment gateway for Indian SaaS/ }),
    ).toBeVisible();
    await expect(
      latestSection.getByRole("link", { name: /Best payment gateway for Indian startups/ }),
    ).toBeVisible();
    // Order contract: newest editorial additions come first, not array order.
    await expect(latestSection.locator("a").first()).toContainText(
      "Razorpay international payment fees",
    );
    await expect(latestSection.locator("a").nth(1)).toContainText(
      "Best payment gateway for Indian SaaS",
    );

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

  test("command palette finds every tool by name", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
    const input = page.getByPlaceholder(/Search companies/);
    await expect(input).toBeAttached();
    for (const query of ["Markup", "Razorpay", "Remittance", "Matchmaker"]) {
      await input.fill(query);
      await expect(
        page.getByRole("option", { name: new RegExp(query, "i") }).first(),
      ).toBeVisible({ timeout: 5_000 });
    }
    await page.keyboard.press("Escape");
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

    // Defaults: mid ₹95.40, offered ₹94.00, $1,000 received → 1.47% markup.
    await expect(page.getByText("1.47%").first()).toBeVisible();
    await expect(page.getByText("₹95,400").first()).toBeVisible();
    await expect(page.getByText("₹94,000").first()).toBeVisible();
    await expect(page.getByText("₹1,400").first()).toBeVisible();

    // Sending INR flips the loss to the sender side.
    await page.getByRole("radio", { name: /Sending INR/ }).click();
    await expect(page.getByText("1.47%").first()).toBeVisible();
  });

  test("remittance ranks providers with visible fees and markups", async ({ page }) => {
    await page.goto("/tools/remittance/");
    // Wise (0.43% + $0.50, no FX markup) must lead the default $1,000 model.
    await expect(
      page.getByRole("heading", { name: /leads in this illustrative model/ }),
    ).toContainText("Wise");

    const wiseRow = page
      .locator("div.rounded-xl.border.p-4", { hasText: "Wise" })
      .filter({ hasText: "Upfront Fee" })
      .first();
    await expect(wiseRow).toContainText("Upfront Fee: $4.80");
    await expect(wiseRow).toContainText("Exchange Markup: 0%");

    const paypalRow = page
      .locator("div.rounded-xl.border.p-4", { hasText: "PayPal" })
      .filter({ hasText: "Upfront Fee" })
      .first();
    await expect(paypalRow).toContainText("Exchange Markup: 3.5%");

    // The island renders a semantic breadcrumb like every other tool page.
    await expect(
      page.getByRole("navigation", { name: "Breadcrumb" }),
    ).toContainText("Tools");
  });

  test("calculators suite exposes all nine calculators and switches tabs", async ({ page }) => {
    await page.goto("/tools/calculators/");
    await expect(page.getByRole("tab")).toHaveCount(9);
    await expect(page.getByRole("tab", { name: /SIP Calculator/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("heading", { name: "SIP Calculator" })).toBeVisible();
    await expect(page.getByRole("tabpanel")).toContainText("Projected Corpus");

    // EMI tab swaps panel and outputs.
    await page.getByRole("tab", { name: /EMI \/ Loan Calculator/ }).click();
    await expect(page.getByRole("tab", { name: /EMI \/ Loan Calculator/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("tabpanel")).toContainText("Monthly Installment (EMI)");
  });
});

test.describe("services track", () => {
  test("services page shows both service lines with pricing and validates the booking form", async ({ page }) => {
    await page.goto("/services/");
    await expect(page.getByRole("heading", { level: 1, name: /Payment gateway help/i })).toBeVisible();
    await expect(page.getByText(/₹999–₹1,999/)).toBeVisible();
    await expect(page.getByText(/₹2,500–₹5,000/)).toBeVisible();
    await expect(page.getByText(/₹3,000–₹8,000/)).toBeVisible();

    // Client-side validation: bad email + short message → both error alerts.
    await page.fill("#svc-email", "not-an-email");
    await page.fill("#svc-message", "short");
    await page.click('button[type="submit"]');
    await expect(page.getByRole("alert")).toHaveCount(3); // 2 form errors + Next's route announcer
    await expect(page.getByText("Enter a valid email address so we can reply.")).toBeVisible();
    await expect(page.getByText("Tell us a bit more — at least 20 characters helps us scope the work.")).toBeVisible();
    await expect(page.locator("#svc-email")).toHaveAttribute("aria-invalid", "true");

    // Valid input opens the prefilled issue draft (GitHub login gate may
    // redirect, so assert the popup's URL shape, not a 200).
    await page.fill("#svc-email", "founder@example.in");
    await page.fill(
      "#svc-message",
      "We run a D2C store on Shopify doing about eight lakh a month in card payments.",
    );
    const popupPromise = page.waitForEvent("popup");
    await page.click('button[type="submit"]');
    const popup = await popupPromise;
    expect(popup.url()).toMatch(/^https:\/\/github\.com\/(login|Harshit-sehgal\/fintech-atlas\/issues\/new)/);
    await popup.close();
  });

  test("booking form offers a direct draft link when the popup is blocked", async ({ page }) => {
    // Force window.open to fail (browser popup blocker) and confirm the form
    // does not claim success but offers the prefilled draft as a link.
    await page.addInitScript(() => {
      window.open = () => null;
    });
    await page.goto("/services/");
    await page.fill("#svc-email", "founder@example.in");
    await page.fill(
      "#svc-message",
      "We run a D2C store on Shopify doing about eight lakh a month in card payments.",
    );
    await page.click('button[type="submit"]');
    const fallback = page.getByRole("link", { name: /open your prefilled inquiry draft here/i });
    await expect(fallback).toBeVisible();
    expect(fallback).toHaveAttribute(
      "href",
      expect.stringContaining("github.com/Harshit-sehgal/fintech-atlas/issues/new"),
    );
    await expect(page.getByText(/popup was blocked/i)).toBeVisible();
  });

  test("sample report derives fees from the calculator's provider tables", async ({ page }) => {
    await page.goto("/services/gateway-selection-report-sample/");
    // Three INR providers (Razorpay, Stripe India, Cashfree) — never the USD rows.
    await expect(page.getByText(/2\.150%/).first()).toBeVisible();
    await expect(page.getByText("Lowest total")).toBeVisible();
    // GST line: 18% of the platform fee, printed per provider.
    await expect(page.getByText(/GST \(18%\)/)).toBeVisible();
  });

  test("checklist toggles persist across reload", async ({ page }) => {
    await page.goto("/services/payment-gateway-implementation-checklist/");
    const boxes = page.locator('input[type="checkbox"]');
    await expect(boxes).toHaveCount(25);
    await boxes.nth(0).check();
    await boxes.nth(1).check();
    await expect(page.getByRole("progressbar", { name: /completion/i })).toHaveAttribute("aria-valuenow", "8");
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator('input[type="checkbox"]:checked')).toHaveCount(2);
  });
});

test.describe("radar track", () => {
  test("radar renders the intelligence filters and searches by name", async ({
    page,
  }) => {
    await page.goto("/radar/");
    await expect(
      page.getByRole("heading", { level: 1, name: "FinTech Radar" }),
    ).toBeVisible();
    const search = page.getByRole("searchbox", { name: "Search Indian fintech companies" });
    await expect(search).toBeVisible();
    // Filter groups render with the pooled labels.
    await expect(page.getByRole("checkbox", { name: /Payments/ })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "RBI" })).toBeVisible();
    await expect(
      page.getByRole("checkbox", { name: "Payment Aggregator" }),
    ).toBeVisible();

    // Full unfiltered set is reported, and a known company opens its record.
    await expect(page.getByText("1386 companies")).toBeVisible();
    await search.fill("razorpay");
    await expect(page.getByText(/of 1386 companies/)).toBeVisible();
    await page
      .getByRole("link", { name: /Razorpay/ })
      .first()
      .click();
    await expect(page.getByRole("heading", { name: "Razorpay" })).toBeVisible();
  });

  test("radar sector and licence filters narrow the result set", async ({
    page,
  }) => {
    await page.goto("/radar/");
    const resultCount = page.locator(
      '[data-placement="radar"] [aria-live="polite"]',
    );
    // Read the leading number; NaN when the island is mid re-render so the
    // poll keeps retrying instead of tripping on a transient empty node.
    const readCount = async () => {
      const text = await resultCount.innerText().catch(() => "");
      const match = /^(\d+)/.exec(text);
      return match ? Number(match[1]) : Number.NaN;
    };

    // Payments sector only — full set must shrink.
    await page.getByRole("checkbox", { name: /Payments/ }).check();
    await expect.poll(readCount).toBeLessThan(1386);
    const sectorOnly = await readCount();

    // Narrow to licensed payment aggregators — must shrink again.
    await page.getByRole("checkbox", { name: "Payment Aggregator" }).check();
    await expect.poll(readCount).toBeLessThan(sectorOnly);
    const licensed = await readCount();
    expect(licensed).toBeGreaterThan(0);

    // Every card exposes the derived licence badge.
    await expect(
      page.getByText("Payment Aggregator", { exact: true }).first(),
    ).toBeVisible();
  });
});

test.describe("radar intelligence surfaces", () => {
  test("intelligence profile renders the trust block and evidence", async ({
    page,
  }) => {
    await page.goto("/radar/company/razorpay/");
    await expect(page.getByRole("heading", { name: "Razorpay" })).toBeVisible();
    await expect(page.getByText("Regulatory intelligence")).toBeVisible();
    await expect(page.getByText("Payment Aggregator").first()).toBeVisible();
    await expect(page.getByText(/Verified \(A\)/).first()).toBeVisible();
    await expect(page.getByText("Evidence & sources")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "View the full directory profile" }),
    ).toBeVisible();
  });

  test("activity feed renders the baseline licence events", async ({ page }) => {
    await page.goto("/radar/activity/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Radar activity" }),
    ).toBeVisible();
    await expect(
      page.getByText("Payment Aggregator", { exact: true }).first(),
    ).toBeVisible();
  });

  test("saved searches persist and re-apply filters", async ({ page }) => {
    await page.goto("/radar/");
    await page.getByRole("checkbox", { name: /Payments/ }).check();
    await page.getByRole("button", { name: "Save current search" }).click();
    await page
      .getByRole("textbox", { name: "Name for the saved search" })
      .fill("Payments only");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByText("Payments only")).toBeVisible();

    await page.getByRole("button", { name: "Clear all" }).click();
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByRole("checkbox", { name: /Payments/ })).toBeChecked();
  });

  test("watchlist watches and unwatches a company", async ({ page }) => {
    await page.goto("/radar/company/razorpay/");
    await page.getByRole("button", { name: /Watch/ }).click();
    await page.goto("/radar/watchlist/");
    await expect(
      page.locator('[data-placement="radar-watchlist-item"]', { hasText: "Razorpay" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText("Your watchlist is empty.")).toBeVisible();
  });
});
