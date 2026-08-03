import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const outDir = path.resolve(process.cwd(), "out");
const htmlFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith(".html")) htmlFiles.push(file);
  }
}

if (!fs.existsSync(outDir)) throw new Error(`Static export directory not found: ${outDir}`);
walk(outDir);

const hashes = new Set();
const inlineScriptPattern = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(inlineScriptPattern)) {
    const digest = crypto.createHash("sha256").update(match[1], "utf8").digest("base64");
    hashes.add(`'sha256-${digest}'`);
  }
}

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  `script-src 'self' ${[...hashes].sort().join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const headers = `# Generated from the static export by scripts/generate-security-headers.mjs.
# Replicate these headers when deploying outside Netlify/Cloudflare.

/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin
  X-Frame-Options: DENY
`;

fs.writeFileSync(path.join(outDir, "_headers"), headers);
console.log(`Generated hashed CSP with ${hashes.size} inline script hashes.`);
