import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

/**
 * The measurement ID is read at module load (site-config), so each case
 * stubs the env, resets the module registry, then imports the component
 * fresh — mirroring how the build inlines the value.
 */
async function load() {
  vi.resetModules();
  return (await import("./GoogleAnalytics")).GoogleAnalytics;
}

describe("GoogleAnalytics", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("renders nothing when no measurement ID is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "");
    const GoogleAnalytics = await load();
    expect(renderToStaticMarkup(<GoogleAnalytics />)).toBe("");
  });

  it("renders the loader and inline bootstrap when configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST1234");
    const GoogleAnalytics = await load();
    const html = renderToStaticMarkup(<GoogleAnalytics />);
    expect(html).toContain('src="https://www.googletagmanager.com/gtag/js?id=G-TEST1234"');
    expect(html).toContain("window.dataLayer");
    expect(html).toContain('"G-TEST1234"');
  });
});
