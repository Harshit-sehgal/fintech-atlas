import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (file: string) => readFileSync(resolve(root, file), "utf8");

describe("Static deployment contracts", () => {
  it("documents and exposes all four interactive tools", () => {
    const readme = read("README.md");
    expect(readme).toContain("4 interactive tools");
    expect(readme).not.toContain("3 interactive tools");
    expect(readme).toContain("Compare Tool");
    expect(readme).toContain("Fee Calculator");
    expect(readme).toContain("FX Remittance");
    expect(readme).toContain("Matchmaker Quiz");
  });

  it("keeps the environment template aligned with documented configuration", () => {
    const envExample = read(".env.example");
    expect(envExample).toContain("SITE_URL=https://fintech-atlas.example.com");
    expect(read("README.md")).toContain("Copy `.env.example` to `.env.local`");
  });

  it("keeps logo tooling available from a clean install", () => {
    const packageJson = JSON.parse(read("package.json")) as {
      scripts?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const lock = JSON.parse(read("package-lock.json")) as {
      packages?: Record<string, { devDependencies?: Record<string, string> }>;
    };

    expect(packageJson.scripts?.["logos:fetch"]).toBe("tsx scripts/fetch-logos.ts");
    expect(packageJson.devDependencies?.tsx).toBeTruthy();
    expect(lock.packages?.[""]?.devDependencies?.tsx).toBe(packageJson.devDependencies?.tsx);
    expect(packageJson.devDependencies?.["next-sitemap"]).toBeUndefined();
  });

  it("pins the build to this project and static export mode", () => {
    const config = read("next.config.ts");
    expect(config).toContain('output: "export"');
    expect(config).toContain("trailingSlash: true");
    expect(config).toContain("root: process.cwd()");
  });

  it("declares a raster install icon in the web manifest", () => {
    const manifest = JSON.parse(read("public/manifest.json")) as {
      icons?: Array<{ src?: string; sizes?: string; type?: string }>;
    };
    expect(manifest.icons).toContainEqual({
      src: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
      purpose: "any maskable",
    });
    expect(existsSync(resolve(root, "public/apple-touch-icon.png"))).toBe(true);
  });

  it("generates robots.txt from the same SITE_URL as the sitemap", () => {
    const script = read("scripts/generate-sitemap.mjs");
    expect(script).toContain("fs.writeFileSync(path.join(outDir, \"robots.txt\"), robots)");
    expect(script).toContain(".trim().replace(/\\/+$/, \"\")");
    expect(script).toContain("Sitemap: ${siteUrl}/sitemap.xml");
  });
});
