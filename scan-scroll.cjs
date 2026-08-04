const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:4173/companies/payoneer/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(400);
  const y1 = await page.evaluate(() => window.scrollY);
  await page.click('header a[href="/"]');
  await page.waitForTimeout(1200);
  const y2 = await page.evaluate(() => window.scrollY);
  console.log("scrolled-to:", y1, "→ after nav:", y2);
  await browser.close();
})();
