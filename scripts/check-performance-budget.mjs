import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const outDir = path.resolve(process.cwd(), "out");
const jsDir = path.join(outDir, "_next", "static");
// Baseline measured from the current static export (423 KB gzip). Keep this
// cap explicit and revisit it when client islands are split or lazy-loaded.
const MAX_GZIP_JS_BYTES = 450_000;

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
