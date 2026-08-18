/**
 * RBI ingestion CLI — parses a snapshot, matches to canonical companies,
 * diffs against a previous snapshot (or establishes the baseline) and emits
 * events + review queue artifacts into data-platform/out.
 *
 * Run via `npm run platform:ingest-rbi -- <snapshot-file>`.
 * Optional: `--previous <prev.md>` diffs against a prior snapshot;
 * `--decisions <file>` applies an operator review-decisions JSON (array of
 * { id, state } or { id: state } map) and writes the resolved apply batch.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnrichedDirectory } from "../src/lib/india-directory-parse";
import { importDirectory } from "../src/data-platform/import-directory";
import { parseRbiSnapshot } from "../src/data-platform/rbi/parse";
import { ingestSnapshot } from "../src/data-platform/rbi/ingest";
import { applyReviewDecisions, buildApplyBatch, reviewSummary } from "../src/data-platform/rbi/review";
import type { ReviewDecision } from "../src/data-platform/rbi/review";

const markdownPath = resolve(process.cwd(), "docs/research/india-fintech-directory-enriched.md");
const outDir = resolve(process.cwd(), "data-platform/out");

const snapshotArg = process.argv[2];
if (!snapshotArg) {
  console.error("usage: npm run platform:ingest-rbi -- data/regulatory/rbi/<snapshot>.md [--previous <prev.md>]");
  process.exit(1);
}

const previousIndex = process.argv.indexOf("--previous");
const previousArg = previousIndex >= 0 ? process.argv[previousIndex + 1] : undefined;

const decisionsIndex = process.argv.indexOf("--decisions");
const decisionsArg = decisionsIndex >= 0 ? process.argv[decisionsIndex + 1] : undefined;

const companies = importDirectory(
  parseEnrichedDirectory(readFileSync(markdownPath, "utf8")),
).records.map((r) => r.company);

const snapshotId = snapshotArg.split("/").pop()?.replace(/\.md$/, "") ?? "snapshot";
const snapshot = parseRbiSnapshot(readFileSync(resolve(process.cwd(), snapshotArg), "utf8"), snapshotId);

const previous = previousArg
  ? parseRbiSnapshot(readFileSync(resolve(process.cwd(), previousArg), "utf8"), "previous").entries
  : undefined;

const result = ingestSnapshot({ snapshot, companies, previous });

let review = result.review;
if (decisionsArg) {
  const raw = JSON.parse(readFileSync(resolve(process.cwd(), decisionsArg), "utf8"));
  const decisions: Record<string, ReviewDecision> = {};
  if (Array.isArray(raw)) {
    for (const entry of raw) {
      if (entry && typeof entry.id === "string" && ["pending", "approved", "rejected"].includes(entry.state)) {
        decisions[entry.id] = entry.state;
      }
    }
  } else if (raw && typeof raw === "object") {
    for (const [id, state] of Object.entries(raw)) {
      if (["pending", "approved", "rejected"].includes(String(state))) {
        decisions[id] = String(state) as ReviewDecision;
      }
    }
  }
  review = applyReviewDecisions(review, decisions);
  console.log(`  decisions:  applied ${Object.keys(decisions).length} to ${review.length} review item(s)`);
}

const safeId = snapshotId.replace(/[^a-z0-9-]/g, "");
const base = resolve(outDir, `rbi-${safeId}`);
writeFileSync(`${base}.json`, JSON.stringify(result, null, 2));

const batch = buildApplyBatch(review);
const summary = reviewSummary(review);
writeFileSync(`${base}-resolved.json`, JSON.stringify({ snapshotId, batch, summary }, null, 2));

console.log(`RBI ingest "${snapshotId}" (${result.regulator})`);
console.log(`  entries:    ${result.entries}`);
console.log(`  matched:    ${result.matched}${result.baseline ? " (baseline)" : ""}`);
console.log(`  unmatched:  ${result.unmatched.length}`);
if (result.unmatched.length > 0) {
  console.log(`    ${result.unmatched.map((u) => u.companyName).join(", ")}`);
}
console.log(`  ambiguous:  ${result.ambiguous.length}`);
console.log(`  events:     ${result.events.length}${result.baseline ? " (baseline establishment)" : ""}`);
console.log(`  review:     ${summary.pending} pending / ${summary.approved} approved / ${summary.rejected} rejected`);
console.log(`  artifact:   ${base}.json`);
console.log(`  resolved:   ${base}-resolved.json`);