import fs from "node:fs";
import path from "node:path";
import { articles } from "@/data/articles";

const outDir = path.resolve(process.cwd(), "out");
const siteUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://fintech-atlas.example.com"
).trim().replace(/\/+$/, "");

if (!fs.existsSync(outDir)) {
  throw new Error(`Static export directory not found: ${outDir}`);
}

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const items = articles.map((article) => {
  const url = `${siteUrl}/articles/${article.slug}/`;
  return `    <item>
      <title>${xmlEscape(article.title)}</title>
      <description>${xmlEscape(article.description)}</description>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${new Date(`${article.updatedAt}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${xmlEscape(article.category)}</category>
    </item>`;
}).join("\n");

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>FinTech Atlas — Guides &amp; Comparisons</title>
    <description>Plain-language FinTech comparisons, explainers, and calculator guides.</description>
    <link>${xmlEscape(`${siteUrl}/articles/`)}</link>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(outDir, "feed.xml"), feed);
console.log(`Generated RSS feed with ${articles.length} article(s) in ${outDir}`);
