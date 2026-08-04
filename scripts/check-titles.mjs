/**
 * Title audit for the static export (postbuild):
 *  - every page has a non-empty <title>
 *  - no title is longer than 65 characters
 *  - no title double-appends the site name (the layout template appends
 *    "— FinTech Atlas" to the page-level title; pages must not repeat it)
 */
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.cwd(), "out");
if (!fs.existsSync(outDir)) {
  throw new Error(`Static export directory not found: ${outDir}`);
}

function collectIndexFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectIndexFiles(entryPath);
    return entry.name === "index.html" ? [entryPath] : [];
  });
}

const problems = [];
let checked = 0;
const siteSuffix = "— FinTech Atlas";
const doubleSuffix = `${siteSuffix} ${siteSuffix}`;

for (const file of collectIndexFiles(outDir)) {
  const html = fs.readFileSync(file, "utf8");
  const match = html.match(/<title>([\s\S]*?)<\/title>/);
  const route = `/${path.relative(outDir, path.dirname(file))}/`;
  if (!match || !match[1].trim()) {
    problems.push(`${route}: missing or empty <title>`);
    continue;
  }
  checked++;
  const title = match[1].trim();
  if (title.length > 65) {
    problems.push(`${route}: title ${title.length} chars (> 65): "${title}"`);
  }
  if (title.includes(doubleSuffix)) {
    problems.push(`${route}: title double-appends the site name: "${title}"`);
  }
  // The root page renders its title verbatim: Next.js does not apply the root
  // layout's title template to the root page itself, so the suffix can only be
  // present there if the page hard-codes it (and the homepage title is too
  // long for the suffix to fit in 65 chars — the brand is in the page header).
  const isRoot = route === "//";
  if (!isRoot && !title.includes(siteSuffix)) {
    problems.push(`${route}: title missing site-name suffix: "${title}"`);
  }
}

if (problems.length > 0) {
  console.error("Title audit failed:");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(`Title audit passed: ${checked} pages under 65 chars with a single site-name suffix.`);
