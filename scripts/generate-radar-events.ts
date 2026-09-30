/**
 * Generates src/generated/radar-events.ts (client-safe) from the RBI snapshot
 * ingest. The public activity feed shows only *established* baseline events —
 * licences recorded from a regulator-cited snapshot. Nothing fabricated.
 *
 * Run via `prebuild` (npm run build). The contract test in
 * src/__tests__/radar-events.test.ts guards the generated module.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { parseEnrichedDirectory } from "../src/lib/india-directory-parse";
import { RADAR_LICENCE_LABELS } from "../src/lib/radar-facets";
import { importDirectory } from "../src/data-platform/import-directory";
import { parseRbiSnapshot } from "../src/data-platform/rbi/parse";
import { ingestSnapshot } from "../src/data-platform/rbi/ingest";

const markdownPath = resolve(process.cwd(), "docs/research/india-fintech-directory-enriched.md");
const snapshotPath = resolve(process.cwd(), "data/regulatory/rbi/payment-aggregators-v1.md");
const outPath = resolve(process.cwd(), "src/generated/radar-events.ts");

const companies = importDirectory(
  parseEnrichedDirectory(readFileSync(markdownPath, "utf8")),
).records.map((r) => r.company);

const snapshot = parseRbiSnapshot(
  readFileSync(snapshotPath, "utf8"),
  "payment-aggregators-v1",
);

const result = ingestSnapshot({ snapshot, companies });
const events = result.events
  .filter((event) => event.companyId)
  .map((event) => ({
    companyId: event.companyId as string,
    type: event.type,
    code: String(event.detail.code ?? ""),
    label: RADAR_LICENCE_LABELS[event.detail.code as keyof typeof RADAR_LICENCE_LABELS] ?? String(event.detail.code ?? ""),
    status: String(event.detail.status ?? ""),
    happenedOn: event.happenedOn,
    detectedOn: event.detectedOn,
  }))
  .sort((a, b) => a.happenedOn.localeCompare(b.happenedOn));

const lines = [
  "// GENERATED FILE — do not edit by hand.",
  "// Derived from data/regulatory/rbi/payment-aggregators-v1.md by",
  "// scripts/generate-radar-events.ts (runs automatically in `prebuild`).",
  "// Baseline licence events from the RBI PA/PA-CB snapshot. These record",
  "// established facts, not speculative changes.",
  "",
  "export interface RadarFeedEvent {",
  "  companyId: string;",
  "  type: string;",
  "  code: string;",
  "  label: string;",
  "  status: string;",
  "  happenedOn: string;",
  "  detectedOn: string;",
  "}",
  "",
  `export const radarFeedEvents: RadarFeedEvent[] = ${JSON.stringify(events, null, 2)};`,
  "",
  `export const radarFeedSnapshotId = ${JSON.stringify(snapshot.id)};`,
  `export const radarFeedFetchedOn = ${JSON.stringify(snapshot.fetchedOn)};`,
  "",
];

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join("\n"));
console.log(
  `Generated radar-events module: ${events.length} baseline events from "${snapshot.id}".`,
);