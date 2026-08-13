import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { resolveSiteUrl } from "./lib/site-url.mjs";

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

// Hash only *executable* inline scripts. Non-JS MIME blocks (JSON-LD structured
// data, speculation rules, import maps) are not subject to script-src, so
// hashing them would bloat the policy for zero protection.
const inlineScriptPattern = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
function isExecutableScript(attrs) {
  const typeMatch = attrs.match(/\btype\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+)/i);
  if (!typeMatch) return true; // no type → classic script
  const type = (typeMatch[2] ?? typeMatch[3] ?? typeMatch[1]).trim();
  if (!type) return true;
  if (/^text\/(javascript|ecmascript)$/i.test(type) || type === "module") return true;
  return false; // application/*, text/plain, speculationrules, importmap, …
}

function scriptHashes(html) {
  const hashes = new Set();
  for (const match of html.matchAll(inlineScriptPattern)) {
    if (/\bsrc\s*=/.test(match[1])) continue; // external script — covered by 'self'
    if (!isExecutableScript(match[1])) continue;
    const digest = crypto.createHash("sha256").update(match[2], "utf8").digest("base64");
    hashes.add(`'sha256-${digest}'`);
  }
  return hashes;
}

const analyticsDomain = (
  process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN || ""
).trim();

// Newsletter provider form endpoint (Phase 3). When set, its origin must be
// permitted for both connect-src (fetch POST) and form-action (native submit)
// or the CSP will block the subscription request.
const newsletterAction = (
  process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ACTION || ""
).trim();
let newsletterOrigin = "";
if (newsletterAction) {
  try {
    newsletterOrigin = new URL(newsletterAction).origin;
  } catch {
    // Malformed action URL — leave CSP unchanged so a bad env value can't
    // silently widen the policy; the fetch will fail loudly instead.
  }
}

const scriptSrcExtras = analyticsDomain ? "https://plausible.io" : "";
const connectSrcExtras = [
  analyticsDomain ? "https://plausible.io" : "",
  newsletterOrigin,
].filter(Boolean).join(" ");
const formActionExtras = newsletterOrigin || "";

// NOTE: frame-ancestors is deliberately NOT part of the meta CSP. The CSP3
// spec ignores it in <meta>-delivered policies and Chrome logs a console error
// for it, which would fail the errors-in-console Lighthouse gate. Clickjacking
// protection is provided by X-Frame-Options: DENY in the host-level _headers
// (and the header variant of this policy in the _headers template below).
function buildCsp(hashes) {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    `script-src 'self' ${[...hashes].sort().join(" ")}${scriptSrcExtras ? ` ${scriptSrcExtras}` : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src 'self'${connectSrcExtras ? ` ${connectSrcExtras}` : ""}`,
    `form-action 'self'${formActionExtras ? ` ${formActionExtras}` : ""}`,
    "upgrade-insecure-requests",
  ].join("; ");
}

function escapeAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

// Inject a per-page CSP as a <meta> tag. Each page only carries hashes for its
// own inline scripts, so the policy stays small (~1KB vs a ~60KB union header)
// and works on any static host — GitHub Pages ignores _headers, Netlify serves
// them, but the meta tag travels with the document on every host.
let largestCspBytes = 0;
let injectedCount = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const hashes = scriptHashes(html);
  const csp = buildCsp(hashes);
  largestCspBytes = Math.max(largestCspBytes, Buffer.byteLength(csp, "utf8"));

  const metaTag = `<meta http-equiv="Content-Security-Policy" content="${escapeAttr(csp)}" />`;
  // Drop any previously generated CSP meta so re-runs stay idempotent, then
  // inject the tag right after the first <head> so it applies to everything
  // parsed afterwards (scripts, styles, images, form actions).
  const withoutOldCsp = html.replace(
    /<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*\/?>/gi,
    "",
  );
  const updated = withoutOldCsp.replace(/<head([^>]*)>/i, `<head$1>${metaTag}`);
  if (updated !== html) {
    fs.writeFileSync(file, updated);
    injectedCount++;
  }
}

const hostHeaders = `# Generated from the static export by scripts/generate-security-headers.mjs.
# Host-level security headers. Content-Security-Policy is deliberately NOT set
# here: it is embedded per-page as a <meta http-equiv="Content-Security-Policy">
# tag by this script (hash-allowlisted to each page's own inline scripts), so a
# single ~60KB union header is never sent on every response. Replicate these
# headers when deploying outside Netlify/Cloudflare.

/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin
  X-Frame-Options: DENY
`;

fs.writeFileSync(path.join(outDir, "_headers"), hostHeaders);
console.log(
  `Injected per-page CSP meta into ${injectedCount}/${htmlFiles.length} HTML files (largest policy ${largestCspBytes} bytes).`,
);

// RFC 9116 security contact file. The GitHub issues inbox is the site's only
// public channel (same pattern as the services booking form). Expires must
// stay within 12 months of the current date — refresh it on the same cadence
// as RATES_AS_OF.
const siteUrl = resolveSiteUrl();
const securityTxt = `# Security contact for FinTech Atlas
# See https://www.rfc-editor.org/rfc/rfc9116

Contact: https://github.com/harshit-sehgal/fintech-atlas/issues
Expires: 2027-01-01
Policy: Report vulnerabilities via the Contact link above; coordinated disclosure expected, no bounty program.
Canonical: ${siteUrl}/.well-known/security.txt
`;
fs.mkdirSync(path.join(outDir, ".well-known"), { recursive: true });
fs.writeFileSync(path.join(outDir, ".well-known", "security.txt"), securityTxt);
console.log("Generated .well-known/security.txt (RFC 9116).");
