import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against the static export in `out/` (produced by
 * `npm run build`), served by `serve`. Build first, then run `npm run test:e2e`.
 */
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // Use the pinned local `serve` (v14) — it serves the app's emitted
    // `out/404.html` for unknown routes with a real 404 status. (`npx serve`
    // can resolve a newer major that ignores the custom 404 page.)
    command: `./node_modules/.bin/serve out -l ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
