import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * GA / GSC values are read at module load, so stub the env then import the
 * module fresh for each configuration.
 */
async function load() {
  vi.resetModules();
  return import("./site-config");
}

describe("site-config analytics + verification", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("leaves GA and verification undefined when unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION", "");
    vi.stubEnv("GOOGLE_SITE_VERIFICATION", "");
    const cfg = await load();
    expect(cfg.GA_MEASUREMENT_ID).toBeUndefined();
    expect(cfg.GOOGLE_SITE_VERIFICATION).toBeUndefined();
  });

  it("trims a configured GA ID and prefers the NEXT_PUBLIC verification token", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "  G-TEST1234  ");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION", " public-token ");
    vi.stubEnv("GOOGLE_SITE_VERIFICATION", "server-token");
    const cfg = await load();
    expect(cfg.GA_MEASUREMENT_ID).toBe("G-TEST1234");
    expect(cfg.GOOGLE_SITE_VERIFICATION).toBe("public-token");
  });

  it("falls back to the server-only verification token", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION", "");
    vi.stubEnv("GOOGLE_SITE_VERIFICATION", " server-token ");
    const cfg = await load();
    expect(cfg.GOOGLE_SITE_VERIFICATION).toBe("server-token");
  });
});
