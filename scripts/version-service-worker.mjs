// Stamp the service-worker cache name with a content-derived version so a
// deploy that ships changed static assets forces a cache purge on activate.
//
// public/sw.js keeps a static `fintech-atlas-vN` placeholder (used by local
// dev and by tests); this script rewrites the CACHE_NAME const in the emitted
// out/sw.js to `fintech-atlas-<sha256-of-_next-assets>` before deployment.
// The stamp is deterministic: rebuilds with unchanged assets keep the same
// cache name (no needless client purges), and any asset change rotates it.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const outDir = path.resolve(process.cwd(), process.env.ARTIFACT_DIR || "out");
const swPath = path.join(outDir, "sw.js");
const nextDir = path.join(outDir, "_next");

if (!fs.existsSync(swPath)) {
  console.error(`✗ Service worker not found in export: ${swPath}`);
  process.exit(1);
}
if (!fs.existsSync(nextDir)) {
  console.error(`✗ Build asset directory not found: ${nextDir}`);
  process.exit(1);
}

const assetFiles = [];
(function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(entryPath);
    else assetFiles.push(entryPath);
  }
})(nextDir);
assetFiles.sort();

const hash = crypto.createHash("sha256");
for (const file of assetFiles) hash.update(fs.readFileSync(file));
const cacheVersion = `fintech-atlas-${hash.digest("hex").slice(0, 10)}`;

const sw = fs.readFileSync(swPath, "utf8");
const stamped = sw.replace(
  /const CACHE_NAME = "fintech-atlas-v\d+";/,
  `const CACHE_NAME = "${cacheVersion}";`,
);
if (!stamped.includes(`CACHE_NAME = "${cacheVersion}"`)) {
  console.error(`✗ Could not stamp CACHE_NAME in ${swPath}`);
  process.exit(1);
}
fs.writeFileSync(swPath, stamped);
console.log(`Service-worker cache version stamped: ${cacheVersion} (${assetFiles.length} assets hashed)`);
