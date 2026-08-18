import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { metadata as privacyMetadata } from "@/app/privacy/page";
import { metadata as termsMetadata } from "@/app/terms/page";

const root = process.cwd();
const read = (file: string) => readFileSync(resolve(root, file), "utf8");

describe("Static deployment contracts", () => {
  it("documents and exposes all interactive tools", () => {
    const readme = read("README.md");
    expect(readme).toContain("6 interactive tools");
    expect(readme).not.toContain("3 interactive tools");
    expect(readme).toContain("Compare Tool");
    expect(readme).toContain("Fee Calculator");
    expect(readme).toContain("FX Remittance");
    expect(readme).toContain("FX Markup Calculator");
    expect(readme).toContain("Matchmaker Quiz");
  });

  it("keeps the environment template aligned with documented configuration", () => {
    const envExample = read(".env.example");
    expect(envExample).toContain("SITE_URL=https://fintech-atlas.com");
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
      icons?: Array<{ src?: string; sizes?: string; type?: string; purpose?: string }>;
    };
    expect(manifest.icons).toContainEqual({
      src: "./icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    });
    expect(manifest.icons).toContainEqual({
      src: "./icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    });
    expect(manifest.icons).toContainEqual({
      src: "./maskable-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    });
    for (const icon of ["icon-192.png", "icon-512.png", "maskable-512.png"]) {
      expect(existsSync(resolve(root, `public/${icon}`))).toBe(true);
    }
    expect(existsSync(resolve(root, "public/apple-touch-icon.png"))).toBe(true);
  });

  it("ships a strict per-page CSP and host-level header policy", () => {
    const generator = read("scripts/generate-security-headers.mjs");
    // CSP is embedded per-page as a meta tag, hash-allowlisted and host-agnostic.
    expect(generator).toContain('http-equiv="Content-Security-Policy"');
    expect(generator).toContain("script-src 'self'");
    expect(generator).not.toContain("script-src 'self' 'unsafe-inline'");
    // frame-ancestors is ignored in <meta>-delivered CSPs and Chrome logs a
    // console error for it, which fails the errors-in-console gate. Clickjacking
    // protection stays in the header policy (X-Frame-Options: DENY).
    expect(generator).not.toContain("frame-ancestors 'none'");
    // The host-level template must not carry a broken catch-all CSP.
    const headers = read("public/_headers");
    expect(headers).not.toContain("Content-Security-Policy:");
    expect(headers).toContain("Strict-Transport-Security:");
    expect(read("src/app/layout.tsx")).toContain('assetPath("/theme-init.js")');
    expect(read("src/app/layout.tsx")).toContain('strategy="beforeInteractive"');
    expect(existsSync(resolve(root, "public/theme-init.js"))).toBe(true);
  });

  it("publishes the legal and incident-readiness surfaces", () => {
    expect(existsSync(resolve(root, "src/app/privacy/page.tsx"))).toBe(true);
    expect(existsSync(resolve(root, "src/app/terms/page.tsx"))).toBe(true);
    // Footer About links now come from the shared nav registry.
    expect(read("src/lib/site-nav.ts")).toContain('href: "/privacy"');
    expect(read("src/lib/site-nav.ts")).toContain('href: "/terms"');
    expect(existsSync(resolve(root, "docs/incident-runbook.md"))).toBe(true);
    expect(read("src/app/privacy/page.tsx")).toContain("pageMetadata(");
    expect(read("src/app/terms/page.tsx")).toContain("pageMetadata(");
    expect(privacyMetadata.openGraph).toMatchObject({
      title: "Privacy Notice — FinTech Atlas",
      url: expect.stringContaining("/privacy/"),
      images: expect.arrayContaining([expect.objectContaining({ url: expect.stringContaining("/og-image.png") })]),
    });
    expect(termsMetadata.openGraph).toMatchObject({
      title: "Terms of Use — FinTech Atlas",
      url: expect.stringContaining("/terms/"),
      images: expect.arrayContaining([expect.objectContaining({ url: expect.stringContaining("/og-image.png") })]),
    });
  });

  it("generates robots.txt from the same SITE_URL as the sitemap", () => {
    const script = read("scripts/generate-sitemap.ts");
    expect(script).toContain("fs.writeFileSync(path.join(outDir, \"robots.txt\"), robots)");
    expect(script).toContain('Sitemap: ${siteUrl}/sitemap.xml');
    expect(script).toContain("const siteUrl = resolveSiteUrl();");
    expect(script).not.toContain("<priority>");
  });

  it("defines local artifact and deployed-site verification gates", () => {
    const packageJson = JSON.parse(read("package.json")) as {
      scripts?: Record<string, string>;
    };
    expect(packageJson.scripts?.["check:artifact"]).toContain("node scripts/check-static-artifact.mjs");
    expect(packageJson.scripts?.["check:artifact"]).toContain("node scripts/check-internal-links.mjs");
    expect(packageJson.scripts?.["check:deployment"]).toBe("node scripts/check-deployment.mjs");
    expect(read("package.json")).toContain("node scripts/check-static-artifact.mjs");
    expect(read("scripts/check-deployment.mjs")).toContain("content-security-policy");
    expect(read("scripts/check-deployment.mjs")).toContain("/.well-known/security.txt");
    expect(read("scripts/check-static-artifact.mjs")).toContain("Contact or Policy");
    expect(read("scripts/check-static-artifact.mjs")).toContain("feed.xml");
    expect(read("scripts/check-static-artifact.mjs")).toContain("offline.html");
    expect(read("scripts/check-internal-links.mjs")).toContain("broken internal reference");
    expect(read("package.json")).toContain("node scripts/check-internal-links.mjs");
    expect(read("package.json")).toContain("node scripts/check-internal-links.test.mjs");
    expect(existsSync(resolve(root, "scripts/check-internal-links.test.mjs"))).toBe(true);
    expect(read("scripts/check-deployment.mjs")).toContain("DEPLOY_URL must use HTTPS");
    expect(read("scripts/check-deployment.mjs")).toContain("const basePath");
    expect(read(".github/workflows/ci.yml")).toContain("actions/download-artifact@v4");
    expect(read(".github/workflows/ci.yml")).toContain("npm run test:links");
    expect(read(".github/workflows/ci.yml")).toContain("contents: read");
    expect(read(".github/workflows/uptime.yml")).toContain("exit 1");
    expect(read(".github/workflows/lighthouse.yml")).toContain('"**"');
    expect(read(".github/workflows/deploy.yml")).toContain("verify-live:");
  });

  it("ships the static feed and offline enhancement", () => {
    expect(read("package.json")).toContain("tsx scripts/generate-rss.ts");
    expect(existsSync(resolve(root, "scripts/generate-rss.ts"))).toBe(true);
    expect(existsSync(resolve(root, "public/sw.js"))).toBe(true);
    expect(existsSync(resolve(root, "public/offline.html"))).toBe(true);
    expect(read("src/app/layout.tsx")).toContain("ServiceWorkerRegister");
    const serviceWorker = read("public/sw.js");
    expect(serviceWorker).toMatch(/const CACHE_NAME = ["'][^"']+-v\d+["']/);
    expect(serviceWorker).toContain('new URL("offline.html", SCOPE)');
    expect(serviceWorker).toContain("requestUrl.search === \"\"");
    expect(read("public/manifest.json")).toContain('"scope": "./"');
  });

  it("keeps the recovery and deployment docs linked to executable checks", () => {
    expect(read("docs/incident-runbook.md")).toContain("npm run check:artifact");
    expect(read("docs/incident-runbook.md")).toContain("npm run check:deployment");
    expect(read("docs/deployment-providers.md")).toContain("DEPLOY_URL=");
  });
});
