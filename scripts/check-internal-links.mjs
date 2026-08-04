import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.cwd(), process.env.ARTIFACT_DIR || "out");
const configuredBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || "")
  .trim()
  .replace(/^\/+|\/+$/g, "");
const basePath = configuredBasePath ? `/${configuredBasePath}` : "";

if (!fs.existsSync(outDir)) {
  console.error(`✗ Static export directory not found: ${outDir}`);
  process.exit(1);
}

function collectHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(entryPath);
    return entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

function normalizeReference(reference) {
  if (!reference.startsWith("/") || reference.startsWith("//")) return null;
  if (basePath && (reference === basePath || reference.startsWith(`${basePath}/`))) {
    return reference.slice(basePath.length) || "/";
  }
  return reference;
}

function targetCandidates(reference) {
  let pathname;
  try {
    pathname = decodeURIComponent(reference).replace(/^\/+/, "");
  } catch {
    return [];
  }
  if (!pathname) return [path.join(outDir, "index.html")];

  const candidates = [
    path.join(outDir, pathname),
    path.join(outDir, pathname, "index.html"),
    path.join(outDir, `${pathname}.html`),
  ];
  return candidates.every((candidate) => {
    const relative = path.relative(outDir, candidate);
    return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
  })
    ? candidates
    : [];
}

const htmlFiles = collectHtmlFiles(outDir);
const references = new Map();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const rawReference = match[1].split("#", 1)[0].split("?", 1)[0];
    if (!rawReference) continue;

    const reference = normalizeReference(rawReference);
    if (!reference || reference.startsWith("/_next/")) continue;

    const targets = targetCandidates(reference);
    if (targets.some((target) => fs.existsSync(target))) continue;

    const sources = references.get(rawReference) || [];
    sources.push(path.relative(outDir, file));
    references.set(rawReference, sources);
  }
}

if (references.size > 0) {
  console.error(`✗ Found ${references.size} broken internal reference(s):`);
  for (const [reference, sources] of references) {
    console.error(`  ${reference} (from ${sources.slice(0, 3).join(", ")}${sources.length > 3 ? ", …" : ""})`);
  }
  process.exit(1);
}

console.log(`Internal-link verification passed: ${htmlFiles.length} HTML files checked.`);
