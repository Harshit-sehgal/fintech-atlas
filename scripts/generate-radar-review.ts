/**
 * Generates src/generated/radar-review.ts (client-safe) from the RBI snapshot
 * ingest. The research console (`/radar/review`) renders the review queue the
 * change engine would hand an operator before any licence change reaches the
 * database — nothing is applied silently (ADR-002).
 *
 * Run via `prebuild` (npm run build). The contract test in
 * src/__tests__/radar-review.test.ts guards the generated module.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { parseEnrichedDirectory } from "../src/lib/india-directory-parse";
import { importDirectory } from "../src/data-platform/import-directory";
import { parseRbiSnapshot } from "../src/data-platform/rbi/parse";
import { ingestSnapshot } from "../src/data-platform/rbi/ingest";
import { reviewSummary } from "../src/data-platform/rbi/review";

const markdownPath = resolve(process.cwd(), "docs/research/india-fintech-directory-enriched.md");
const snapshotPath = resolve(process.cwd(), "data/regulatory/rbi/payment-aggregators-v1.md");
const outPath = resolve(process.cwd(), "src/generated/radar-review.ts");

const companies = importDirectory(
  parseEnrichedDirectory(readFileSync(markdownPath, "utf8")),
).records.map((r) => r.company);

const snapshot = parseRbiSnapshot(readFileSync(snapshotPath, "utf8"), "payment-aggregators-v1");

const result = ingestSnapshot({ snapshot, companies });

const items = result.review.map((item) => ({
  id: item.id,
  snapshotId: item.snapshotId,
  companyId: item.companyId,
  companyName: item.companyName,
  action: item.action,
  before: item.before ?? null,
  after: item.after ?? null,
  rationale: item.rationale,
  state: item.state,
}));

const summary = reviewSummary(result.review);

const lines = [
  "// GENERATED FILE — do not edit by hand.",
  "// Derived from data/regulatory/rbi/payment-aggregators-v1.md by",
  "// scripts/generate-radar-review.ts (runs automatically in `prebuild`).",
  "// The review queue the change engine produces before any licence change is",
  "// applied. Every item carries a pending state and a rationale; decisions",
  "// are taken by an operator, never by the pipeline.",
  "",
  "export interface RadarReviewItem {",
  "  id: string;",
  "  snapshotId: string;",
  "  companyId?: string;",
  "  companyName?: string;",
  "  action: string;",
  "  before: Record<string, unknown> | null;",
  "  after: Record<string, unknown> | null;",
  "  rationale: string;",
  "  state: string;",
  "}",
  "",
  "export interface RadarReviewSummary {",
  "  total: number;",
  "  pending: number;",
  "  approved: number;",
  "  rejected: number;",
  "  byAction: Record<string, number>;",
  "}",
  "",
  `export const radarReviewItems: RadarReviewItem[] = ${JSON.stringify(items, null, 2)};`,
  "",
  `export const radarReviewSummary: RadarReviewSummary = ${JSON.stringify(summary, null, 2)};`,
  "",
  `export const radarReviewSnapshotId = ${JSON.stringify(snapshot.id)};`,
  `export const radarReviewFetchedOn = ${JSON.stringify(snapshot.fetchedOn)};`,
  `export const radarReviewIsBaseline = ${JSON.stringify(result.baseline)};`,
  "",
];

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join("\n"));
console.log(
  `Generated radar-review module: ${items.length} review items from "${snapshot.id}".`,
);