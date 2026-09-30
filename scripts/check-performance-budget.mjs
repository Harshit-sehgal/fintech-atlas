import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const outDir = path.resolve(process.cwd(), "out");
const jsDir = path.join(outDir, "_next", "static");
// History of this cap (gzip total across the static export):
//   423,000 — original baseline.
//   450,000 — raised when the first client islands were split out.
//   475,000 — T101–T112 redesign (2026-08-23): rebuilt /compare around user
//             intent (scenario router, difference-first rows, mobile cards),
//             consolidated /bookmarks into a Saved hub (notes · tool sessions
//             · radar state, lazily imported via lib/saved-hub), URL
//             persistence + CSV export for directory/india/radar. Measured
//             465,448 at merge time vs 439,610 on the pre-redesign tree
//             (6b3ad1d): ~26 KB of genuine new decision-surface code. The
//             next JS-reduction milestone is T095/T096 (reduce/lazy-load);
//             revisit the cap there rather than letting it drift upward.
const MAX_GZIP_JS_BYTES = 475_000;

function collectJavaScript(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory()
      ? collectJavaScript(file)
      : entry.name.endsWith(".js")
        ? [file]
        : [];
  });
}

const files = collectJavaScript(jsDir);
const totalGzipBytes = files.reduce(
  (total, file) => total + gzipSync(fs.readFileSync(file), { level: 9 }).byteLength,
  0,
);

if (totalGzipBytes > MAX_GZIP_JS_BYTES) {
  throw new Error(
    `Compressed JavaScript budget exceeded: ${totalGzipBytes} bytes > ${MAX_GZIP_JS_BYTES} bytes. Split or lazy-load client features before deploying.`,
  );
}

console.log(
  `Compressed JavaScript budget passed: ${totalGzipBytes} / ${MAX_GZIP_JS_BYTES} bytes across ${files.length} assets.`,
);
