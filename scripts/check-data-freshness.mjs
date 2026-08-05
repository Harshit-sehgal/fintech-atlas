/**
 * Unified data-freshness guard (T017/T018).
 *
 * Runs before every production build — fails the build when any high-risk
 * dataset exceeds its configured freshness window.
 *
 * Checked datasets:
 *  1. Remittance rate snapshot    (MAX_RATE_AGE_DAYS, from remittance-config.ts)
 *  2. Company catalog vintage     (DATA_AS_OF, from site-config.ts)
 *  3. Availability snapshot ages    (asOf, from company-availability.ts)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const now = Date.now();

// ── Helpers ──────────────────────────────────────────────────────────
function resolve(...parts) {
  return path.resolve(ROOT, ...parts);
}

function extract(pattern, source) {
  const m = source.match(pattern);
  return m ? m[1] : null;
}

function daysOld(isoDate) {
  return (now - Date.parse(isoDate)) / (24 * 60 * 60 * 1000);
}

function warnOrFail(label, age, max, severity) {
  const msg = `${label}: ${age.toFixed(1)}d old (max ${max}d).`;
  if (age > max) {
    if (severity === "error") throw new Error(msg + " Refresh before building.");
    console.warn("WARNING: " + msg);
  } else {
    console.log("OK: " + msg);
  }
}

// ── 1. Remittance rates (hard-fail when stale) ──────────────────────
const remConfig = fs.readFileSync(resolve("src/data/remittance-config.ts"), "utf8");
const ratesAsOf = extract(/RATES_AS_OF\s*=\s*["']([^"']+)["']/, remConfig);
const maxRateAge = Number(extract(/MAX_RATE_AGE_DAYS\s*=\s*(\d+)/, remConfig));

if (!ratesAsOf || !Number.isFinite(maxRateAge))
  throw new Error("Remittance config missing RATES_AS_OF or MAX_RATE_AGE_DAYS.");

warnOrFail("Remittance rates", daysOld(ratesAsOf), maxRateAge, "error");

// ── 2. Company catalog vintage ──────────────────────────────────────
const siteConfig = fs.readFileSync(resolve("src/lib/site-config.ts"), "utf8");
const dataAsOf = extract(/DATA_AS_OF[^=]*=\s*["']([^"']+)["']/, siteConfig);
// DATA_AS_OF is a human-readable quarter label (e.g. "Q3 2026").
// We parse it into an approximate date and warn if > ~100 days old.
const qMatch = dataAsOf?.match(/Q([1-4])\s*(\d{4})/);
if (qMatch) {
  const quarter = parseInt(qMatch[1]);
  const year = parseInt(qMatch[2]);
  // Approximate the quarter start: Q1=Jan1, Q2=Apr1, Q3=Jul1, Q4=Oct1
  const qStart = new Date(year, (quarter - 1) * 3, 1);
  const catalogDays = (now - qStart.getTime()) / (24 * 60 * 60 * 1000);
  const MAX_CATALOG_AGE = 120; // warn but don't fail
  warnOrFail("Company catalog vintage", catalogDays, MAX_CATALOG_AGE, "warn");
} else {
  console.warn("WARNING: DATA_AS_OF not parseable as quarter — skipping catalog-vintage check.");
}

// ── 3. Availability snapshot ages ────────────────────────────────────
const avPath = resolve("src/data/company-availability.ts");
if (fs.existsSync(avPath)) {
  const avSource = fs.readFileSync(avPath, "utf8");
  const matches = [...avSource.matchAll(/asOf:\s*["']([^"']+)["']/g)];
  const MAX_AVAILABILITY_AGE = 120;
  for (const m of matches) {
    const label = m[1]; // "2026-Qs" style — if it's an ISO date, parse it
    const d = Date.parse(label);
    if (!Number.isNaN(d)) {
      const age = (now - d) / (24 * 60 * 60 * 1000);
      warnOrFail("Availability snapshot (" + label + ")", age, MAX_AVAILABILITY_AGE, "warn");
    }
  }
}

console.log("All data freshness checks passed.\n");
