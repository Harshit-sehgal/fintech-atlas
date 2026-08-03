import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.cwd(), "out");
const siteUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://fintech-atlas.example.com"
).trim().replace(/\/+$/, "");

const excludedRoutes = new Set(["404", "_not-found", "bookmarks"]);

function collectIndexFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectIndexFiles(entryPath);
    return entry.name === "index.html" ? [entryPath] : [];
  });
}

function xmlEscape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

if (!fs.existsSync(outDir)) {
  throw new Error(`Static export directory not found: ${outDir}`);
}

const buildLastmod = new Date().toISOString().slice(0, 10);

const routes = collectIndexFiles(outDir)
  .map((file) => {
    const relativeDirectory = path.relative(outDir, path.dirname(file));
    if (!relativeDirectory) return "/";

    const segments = relativeDirectory.split(path.sep);
    if (segments.length === 1 && excludedRoutes.has(segments[0])) return null;
    return `/${segments.join("/")}/`;
  })
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b));

// Assign priority by path depth: homepage highest, major sections medium,
// individual detail pages lower. Computed from path *segments* (not slash
// count), so `/companies/` (1 segment) is treated as a top-level section.
function priorityForRoute(route) {
  if (route === "/") return "1.0";
  const depth = route.split("/").filter(Boolean).length;
  if (depth === 1) return "0.8";
  if (depth === 2) return "0.6";
  return "0.5";
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
    .map((route) => {
      const loc = xmlEscape(`${siteUrl}${route}`);
      const priority = priorityForRoute(route);
      // lastmod is the build date: every static page is regenerated each build.
      return `  <url><loc>${loc}</loc><lastmod>${buildLastmod}</lastmod><priority>${priority}</priority></url>`;
    })
    .join("\n")}
</urlset>
`;

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${xmlEscape(`${siteUrl}/sitemap-0.xml`)}</loc></sitemap>
</sitemapindex>
`;

fs.writeFileSync(path.join(outDir, "sitemap-0.xml"), sitemap);
fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemapIndex);

const robots = `# Allow all public pages to be crawled.
User-agent: *
Allow: /
Disallow: /bookmarks/

Host: ${siteUrl}
Sitemap: ${siteUrl}/sitemap.xml
`;
fs.writeFileSync(path.join(outDir, "robots.txt"), robots);

console.log(`Generated ${routes.length} sitemap URLs, sitemap index, and robots.txt in ${outDir}`);
