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

/** Resolve a reference's path to a concrete HTML file, or null when missing. */
function resolvePage(reference) {
  const targets = targetCandidates(reference);
  const found = targets.find((target) => fs.existsSync(target));
  if (!found) return null;
  if (fs.statSync(found).isDirectory()) {
    const index = path.join(found, "index.html");
    return fs.existsSync(index) ? index : null;
  }
  return found;
}

/** True when the file declares the given fragment id (anchors are plain `id` attributes). */
function hasFragment(file, fragment) {
  try {
    const html = fs.readFileSync(file, "utf8");
    const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`id=["']${escaped}["']`).test(html);
  } catch {
    return false;
  }
}

const htmlFiles = collectHtmlFiles(outDir);
const brokenPaths = new Map();
const brokenFragments = new Map();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const rawReference = match[1];
    const hashIndex = rawReference.indexOf("#");
    const pathPart = (hashIndex >= 0 ? rawReference.slice(0, hashIndex) : rawReference).split("?", 1)[0];
    let fragment = null;
    if (hashIndex >= 0) {
      try {
        fragment = decodeURIComponent(rawReference.slice(hashIndex + 1));
      } catch {
        continue;
      }
    }
    if (!fragment) fragment = null;

    // Fragment-only reference: must resolve on the page itself.
    if (!pathPart) {
      if (!fragment) continue;
      if (!hasFragment(file, fragment)) {
        const sources = brokenFragments.get(`#${fragment}`) || [];
        sources.push(path.relative(outDir, file));
        brokenFragments.set(`#${fragment}`, sources);
      }
      continue;
    }

    const reference = normalizeReference(pathPart);
    if (!reference || reference.startsWith("/_next/")) continue;

    const page = resolvePage(reference);
    if (!page) {
      const sources = brokenPaths.get(rawReference) || [];
      sources.push(path.relative(outDir, file));
      brokenPaths.set(rawReference, sources);
      continue;
    }

    if (fragment && !hasFragment(page, fragment)) {
      const sources = brokenFragments.get(`${rawReference} (missing id="${fragment}")`) || [];
      sources.push(path.relative(outDir, file));
      brokenFragments.set(`${rawReference} (missing id="${fragment}")`, sources);
    }
  }
}

let failed = false;
if (brokenPaths.size > 0) {
  failed = true;
  console.error(`✗ Found ${brokenPaths.size} broken internal reference(s):`);
  for (const [reference, sources] of brokenPaths) {
    console.error(`  ${reference} (from ${sources.slice(0, 3).join(", ")}${sources.length > 3 ? ", …" : ""})`);
  }
}
if (brokenFragments.size > 0) {
  failed = true;
  console.error(`✗ Found ${brokenFragments.size} unresolvable fragment target(s):`);
  for (const [reference, sources] of brokenFragments) {
    console.error(`  ${reference} (from ${sources.slice(0, 3).join(", ")}${sources.length > 3 ? ", …" : ""})`);
  }
}
if (failed) process.exit(1);

console.log(`Internal-link verification passed: ${htmlFiles.length} HTML files checked.`);
