import { afterEach, describe, expect, it, vi } from "vitest";

async function load() {
  vi.resetModules();
  return import("./site-config");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("site-config base path + url", () => {
  it("normalises a base path with surrounding slashes", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/fintech-atlas/");
    const cfg = await load();
    expect(cfg.PUBLIC_BASE_PATH).toBe("/fintech-atlas");
    expect(cfg.assetPath("/globe.svg")).toBe("/fintech-atlas/globe.svg");
    expect(cfg.assetPath("globe.svg")).toBe("/fintech-atlas/globe.svg");
  });

  it("treats a root base path as empty", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/");
    const cfg = await load();
    expect(cfg.PUBLIC_BASE_PATH).toBe("");
    expect(cfg.assetPath("/x.png")).toBe("/x.png");
  });

  it("strips a trailing slash from the site url", async () => {
    vi.stubEnv("SITE_URL", "https://example.test/");
    const cfg = await load();
    expect(cfg.SITE_URL).toBe("https://example.test");
  });
});
