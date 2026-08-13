import fs from "node:fs";
import path from "node:path";
import { articles } from "@/data/articles";
import { changelog } from "@/data/changelog";
import { resolveSiteUrl } from "./lib/site-url.mjs";

const outDir = path.resolve(process.cwd(), "out");
const siteUrl = resolveSiteUrl();

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

const items = articles
  .map((article, index) => ({ article, index }))
  .sort(
    (a, b) =>
      b.article.updatedAt.localeCompare(a.article.updatedAt) || b.index - a.index,
  )
  .map(({ article }) => {
    const url = `${siteUrl}/articles/${article.slug}/`;
    return `    <item>
      <title>${xmlEscape(article.title)}</title>
      <description>${xmlEscape(article.description)}</description>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${new Date(`${article.updatedAt}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${xmlEscape(article.category)}</category>
    </item>`;
  })
  .join("\n");

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

const changelogItems = changelog
  .map((entry) => {
    const url = entry.href.startsWith("http")
      ? entry.href
      : `${siteUrl}${entry.href}`;
    return `    <item>
      <title>${xmlEscape(entry.title)}</title>
      <description>${xmlEscape(entry.description)}</description>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${new Date(`${entry.date}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${xmlEscape(changelogKindLabel(entry.kind))}</category>
    </item>`;
  })
  .join("\n");

const changelogFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>FinTech Atlas — Site Changelog</title>
    <description>New guides, tools, fee updates, and fixes on FinTech Atlas.</description>
    <link>${xmlEscape(`${siteUrl}/changelog/`)}</link>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${changelogItems}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(outDir, "changelog.xml"), changelogFeed);
console.log(
  `Generated changelog RSS feed with ${changelog.length} item(s) in ${outDir}`,
);

function changelogKindLabel(kind: string): string {
  switch (kind) {
    case "article":
      return "Article";
    case "tool":
      return "Tool";
    case "fix":
      return "Fix";
    default:
      return "Site";
  }
}
