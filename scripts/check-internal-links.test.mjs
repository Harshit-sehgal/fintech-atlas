import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const script = path.resolve("scripts/check-internal-links.mjs");
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "fintech-atlas-links-"));

function write(relativePath, content = "") {
  const file = path.join(fixture, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function run(basePath = "") {
  return spawnSync(process.execPath, [script], {
    cwd: process.cwd(),
    env: { ...process.env, ARTIFACT_DIR: fixture, NEXT_PUBLIC_BASE_PATH: basePath },
    encoding: "utf8",
  });
}

try {
  write("index.html", `
    <a href="/about/">About</a>
    <script src="/_next/static/chunk.js"></script>
  `);
  write("about/index.html", "<title>About</title>");
  let result = run();
  assert.equal(result.status, 0, result.stderr);

  write("index.html", `
    <a href="/fintech-atlas/about/">About</a>
    <script src="/fintech-atlas/_next/static/chunk.js"></script>
  `);
  result = run("/fintech-atlas");
  assert.equal(result.status, 0, result.stderr);

  write("index.html", '<a href="/fintech-atlas/missing/">Missing</a>');
  result = run("/fintech-atlas");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /broken internal reference/);

  write("index.html", '<a href="/%2e%2e/%2e%2e/etc/passwd">Traversal</a>');
  result = run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /broken internal reference/);

  write("index.html", '<a href="/%ZZ">Malformed</a>');
  result = run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /broken internal reference/);
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}

console.log("Internal-link checker fixtures passed.");
