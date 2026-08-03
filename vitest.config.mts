/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json-summary"],
      // Thresholds guard against regression on the highest-value logic
      // (financial calculations and interaction helpers). Prioritise verifying
      // those over chasing broad coverage for its own sake.
      // Route shells and test-only adapter components are exercised by the
      // browser/build gates rather than unit coverage. This is explicitly a
      // reusable-logic coverage gate, not a substitute for browser-flow tests.
      // Keep the denominator focused on reusable product logic, data, and
      // interaction utilities.
      exclude: [
        "src/app/**",
        "src/test/**",
        "src/components/ui/company-logo.tsx",
        "src/components/SEO/StructuredData.tsx",
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
