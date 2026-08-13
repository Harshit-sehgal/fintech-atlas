import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.cwd(), process.env.ARTIFACT_DIR || "out");

const requiredFiles = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "sitemap-0.xml",
  "feed.xml",
  "sw.js",
  "offline.html",
  "_headers",
  "manifest.json",
  ".well-known/security.txt",
];

const representativeRoutes = [
  "about/index.html",
  "articles/index.html",
  "categories/index.html",
  "categories/payments/index.html",
  "companies/index.html",
  "companies/stripe/index.html",
  "compare/index.html",
  "glossary/index.html",
  "tools/index.html",
  "tools/calculator/index.html",
  "tools/calculators/index.html",
  "tools/matchmaker/index.html",
  "tools/remittance/index.html",
  "privacy/index.html",
  "terms/index.html",
  "affiliate-disclosure/index.html",
  "services/index.html",
  "services/gateway-selection-report-sample/index.html",
  "services/payment-gateway-implementation-checklist/index.html",
];

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(outDir)) {
  fail(`Static export directory not found: ${outDir}`);
  process.exit(1);
}

for (const relativePath of [...requiredFiles, ...representativeRoutes]) {
  if (!fs.existsSync(path.join(outDir, relativePath))) {
    fail(`Missing artifact: ${relativePath}`);
  }
}

const read = (relativePath) => fs.readFileSync(path.join(outDir, relativePath), "utf8");

if (fs.existsSync(path.join(outDir, "robots.txt"))) {
  const robots = read("robots.txt");
  if (!/^Sitemap:\s+https?:\/\/[^\s]+\/sitemap\.xml$/m.test(robots)) {
    fail("robots.txt does not point to an absolute sitemap.xml URL");
  }
}

if (fs.existsSync(path.join(outDir, "sitemap.xml"))) {
  const sitemapIndex = read("sitemap.xml");
  if (!sitemapIndex.includes("sitemap-0.xml")) {
    fail("sitemap.xml does not reference sitemap-0.xml");
  }
}

if (fs.existsSync(path.join(outDir, "sitemap-0.xml"))) {
  const sitemap = read("sitemap-0.xml");
  if (!sitemap.includes("<urlset") || !sitemap.includes("<url><loc>")) {
    fail("sitemap-0.xml does not contain URL entries");
  }
}

if (fs.existsSync(path.join(outDir, "feed.xml"))) {
  const feed = read("feed.xml");
  if (!feed.includes("<rss") || !feed.includes("<channel>") || !feed.includes("<item>")) {
    fail("feed.xml does not contain a valid RSS channel with items");
  }
}

for (const [file, requiredText] of [["sw.js", "addEventListener"], ["offline.html", "You’re offline"]]) {
  if (fs.existsSync(path.join(outDir, file)) && !read(file).includes(requiredText)) {
    fail(`${file} is missing expected offline-support content`);
  }
}

if (fs.existsSync(path.join(outDir, "_headers"))) {
  const headers = read("_headers");
  for (const requiredHeader of [
    "Strict-Transport-Security:",
    "X-Content-Type-Options:",
    "Referrer-Policy:",
    "Permissions-Policy:",
    "X-Frame-Options:",
  ]) {
    if (!headers.includes(requiredHeader)) fail(`_headers is missing ${requiredHeader}`);
  }
}

// CSP lives per-page as a <meta> tag (host-agnostic; _headers is ignored on
// GitHub Pages). Every shipping HTML page must carry one.
if (fs.existsSync(path.join(outDir, "index.html"))) {
  const homepage = read("index.html");
  if (!/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/i.test(homepage)) {
    fail("index.html is missing its per-page Content-Security-Policy meta tag");
  }
}

if (fs.existsSync(path.join(outDir, "manifest.json"))) {
  try {
    const manifest = JSON.parse(read("manifest.json"));
    if (manifest.name == null || !Array.isArray(manifest.icons)) {
      fail("manifest.json is missing name or icons");
    }
  } catch (error) {
    fail(`manifest.json is invalid JSON: ${error.message}`);
  }
}

if (fs.existsSync(path.join(outDir, ".well-known/security.txt"))) {
  const security = read(".well-known/security.txt");
  if (!/^Contact:\s+\S+/m.test(security) || !/^Policy:\s+\S+/m.test(security)) {
    fail("security.txt is missing Contact or Policy");
  }
}

if (process.exitCode) {
  process.exit(1);
}

console.log(
  `Static artifact verification passed: ${requiredFiles.length} required files and ${representativeRoutes.length} representative routes.`,
);
