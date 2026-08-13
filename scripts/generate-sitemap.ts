import fs from "node:fs";
import path from "node:path";
import { articles } from "@/data/articles";
import { resolveSiteUrl } from "./lib/site-url.mjs";

const outDir = path.resolve(process.cwd(), "out");
const siteUrl = resolveSiteUrl();

const excludedRoutes: Record<string, true> = {
  "404": true,
  "_not-found": true,
  bookmarks: true,
};

/**
 * Article pages carry their own lastmod: the article's `updatedAt`, so the
 * sitemap reflects the last *significant* content change instead of the build
 * date (the execution plan's sitemap criterion — a build date on every page
 * tells search engines nothing).
 */
const articleLastmodByRoute: Record<string, string> = Object.fromEntries(
  articles.map((article) => [`/articles/${article.slug}/`, article.updatedAt]),
);

function collectIndexFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectIndexFiles(entryPath);
    return entry.name === "index.html" ? [entryPath] : [];
  });
}

function xmlEscape(value: string): string {
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

// Fallback lastmod for non-article pages: every static page is regenerated
// each build, so the build date is accurate for them.
const buildLastmod = new Date().toISOString().slice(0, 10);

const routes = collectIndexFiles(outDir)
  .map((file) => {
    const relativeDirectory = path.relative(outDir, path.dirname(file));
    if (!relativeDirectory) return "/";

    const segments = relativeDirectory.split(path.sep);
    if (segments.length === 1 && excludedRoutes[segments[0]]) return null;
    return `/${segments.join("/")}/`;
  })
  .filter((route): route is string => Boolean(route))
  .sort((a, b) => a.localeCompare(b));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
    .map((route) => {
      const loc = xmlEscape(`${siteUrl}${route}`);
      const lastmod = articleLastmodByRoute[route] ?? buildLastmod;
      return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
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
