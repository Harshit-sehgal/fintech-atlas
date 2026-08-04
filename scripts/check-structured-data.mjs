/**
 * Structured-data validation gate — scans every emitted HTML file for
 * JSON-LD `<script type="application/ld+json">` blocks and fails the build if
 * any block is malformed or missing a schema `@type`. Run via `postbuild` (CI).
 */
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.cwd(), "out");

function collectIndexFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectIndexFiles(entryPath);
    return entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

const JSONLD_RE = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

if (!fs.existsSync(outDir)) {
  throw new Error(`Static export directory not found: ${outDir}`);
}

const files = collectIndexFiles(outDir);
const problems = [];
let blocks = 0;

// Every tool page (hub + individual) must carry a BreadcrumbList — server
// shell or editorial page. The site-wide Organization/WebSite blocks come
// from the root layout.
const TOOL_PAGE_RE = /\/tools(?:\/[^/]+)?\/index\.html$/;
for (const file of files.filter((f) => TOOL_PAGE_RE.test(f))) {
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes('"BreadcrumbList"')) {
    problems.push(`${file}: missing BreadcrumbList JSON-LD`);
  }
}

// Per-type required properties — a well-formed block that omits its headline
// or items is worse than a typo: it is silently ignored by search engines.
const REQUIRED_PROPS = {
  Article: ["headline", "datePublished"],
  BreadcrumbList: ["itemListElement"],
  WebSite: ["name", "url"],
  Organization: ["name"],
};

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  let match;
  JSONLD_RE.lastIndex = 0;
  while ((match = JSONLD_RE.exec(html)) !== null) {
    blocks += 1;
    const raw = match[1].trim();
    if (!raw) {
      problems.push(`${file}: empty JSON-LD block`);
      continue;
    }
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      problems.push(`${file}: invalid JSON-LD (${err.message})`);
      continue;
    }
    const nodes = Array.isArray(data) ? data : data["@graph"] ?? [data];
    for (const node of nodes) {
      if (!node || typeof node !== "object" || !node["@type"]) {
        problems.push(`${file}: JSON-LD node missing @type`);
        continue;
      }
      for (const type of Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]) {
        for (const prop of REQUIRED_PROPS[type] ?? []) {
          if (node[prop] === undefined || node[prop] === null || node[prop] === "") {
            problems.push(`${file}: ${type} missing required property "${prop}"`);
          }
        }
      }
    }
  }
}

if (problems.length > 0) {
  console.error(`\n✗ Structured-data validation failed (${problems.length}):`);
  for (const p of problems) console.error("    " + p);
  process.exit(1);
}

console.log(
  `Structured-data validation passed: ${blocks} JSON-LD block(s) across ${files.length} HTML files.`,
);
