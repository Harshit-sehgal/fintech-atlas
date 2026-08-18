/**
 * Stages the proprietary Radar data-platform pieces into
 * `data-platform/staging/` for the private repository
 * (`fintech-atlas-platform`), per the public/private split in ADR-002.
 *
 * The staging folder is git-ignored by default (see .gitignore) so the public
 * repo never accidentally commits it. Run via `npm run platform:export`.
 *
 * Copies:
 *   - database/schema.sql            (canonical PostgreSQL DDL)
 *   - src/data-platform/**           (canonical model, import, evidence, rbi)
 *   - data/regulatory/**             (regulator snapshots)
 *   - data-platform/out/**           (generated canonical dataset + seed.sql)
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const staging = resolve(root, "data-platform/staging");

const sources = [
  "database",
  "src/data-platform",
  "data/regulatory",
  "data-platform/out",
];

rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });

let copied = 0;
for (const source of sources) {
  const from = resolve(root, source);
  if (!existsSync(from)) {
    console.log(`  skip (missing): ${source}`);
    continue;
  }
  const to = resolve(staging, source.replace("src/", ""));
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
  copied += 1;
  console.log(`  copied ${source} → ${to}`);
}

const manifest = [
  "// STAGING MANIFEST — content staged for the private platform repository.",
  `// Generated ${new Date().toISOString().slice(0, 10)} by scripts/export-platform-package.ts.`,
  ...sources.filter((s) => existsSync(resolve(root, s))).map((s) => `- ${s}`),
  "",
].join("\n");
const manifestPath = resolve(staging, "STAGING-MANIFEST.txt");
mkdirSync(staging, { recursive: true });
writeFileSync(manifestPath, manifest);

console.log(`Staged ${copied} source(s) into ${staging}.`);