// Shared canonical-site-URL resolver for postbuild scripts.
//
// Postbuild scripts run as separate node processes and do NOT inherit the
// SITE_URL that Next.js loads from .env.local, so they must resolve the
// canonical origin themselves. Precedence:
//   1. process.env.SITE_URL (CI/deploy.yml sets this explicitly)
//   2. process.env.NEXT_PUBLIC_SITE_URL
//   3. SITE_URL / NEXT_PUBLIC_SITE_URL from .env.local
//   4. A production default — never a placeholder, so an unconfigured
//      machine fails verification instead of silently shipping example.com.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function readLocalEnv() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return {};
  const result = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    if (!trimmed.includes("=")) continue;
    const sep = trimmed.indexOf("=");
    const key = trimmed.slice(0, sep).trim();
    let value = trimmed.slice(sep + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

export function resolveSiteUrl() {
  const env = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.trim().replace(/\/+$/, "");

  const local = readLocalEnv();
  const localUrl = local.SITE_URL || local.NEXT_PUBLIC_SITE_URL;
  if (localUrl) return localUrl.trim().replace(/\/+$/, "");

  return "https://fintech-atlas.com";
}