/**
 * Meta-description gate — scans every emitted HTML page and fails
 * the build if any meta description is missing, outside the
 * 70–160 character SERP display budget, or a byte-for-byte
 * duplicate of another page's. Run via `postbuild` (CI).
 *
 * Length is measured on the rendered attribute value — the HTML
 * source is already escaped by React (`&` → `&amp;`, `'` →
 * `&#x27;`, …), which is exactly the form Google measures, so
 * no re-escaping happens here.
 */
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.cwd(), "out");

function collectHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(entryPath);
    return entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

if (!fs.existsSync(outDir)) {
  throw new Error(`Static export directory not found: ${outDir}`);
}

const files = collectHtmlFiles(outDir);
const problems = [];
const seen = new Map();

// The not-found boundary renders the same component at several
// export paths (404.html, 404/ and _not-found/); their identical
// description is expected, not a duplicate-content defect.
const ERROR_PAGE_RE = /(^|\/)(404|_not-found)(\.html)?(?=\/|$)/;

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const match = html.match(/<meta name="description" content="([\s\S]*?)"/);
  if (!match) {
    problems.push(`${file}: no meta description`);
    continue;
  }
  const description = match[1];
  if (description.length < 70) {
    problems.push(`${file}: description too short (${description.length} chars)`);
  } else if (description.length > 160) {
    problems.push(`${file}: description over the 160-char SERP budget (${description.length} chars)`);
  }
  if (seen.has(description)) {
    const first = seen.get(description);
    const bothErrorPages =
      ERROR_PAGE_RE.test(first) && ERROR_PAGE_RE.test(file);
    if (!bothErrorPages) {
      problems.push(`${file}: description duplicates ${first}`);
    }
  } else {
    seen.set(description, file);
  }
}

if (problems.length > 0) {
  console.error(`Meta-description gate: ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(
  `Meta-description gate passed: ${files.length} pages, all within the 70–160 char budget and unique`,
);
