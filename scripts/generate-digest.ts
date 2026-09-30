/**
 * Weekly digest CLI (P11) — renders the week's Radar digest from the events
 * the change engine has recorded, for a saved search / watchlist.
 *
 * Run via `npm run platform:digest` → writes data-platform/out/digest-week.md.
 * Digest is a paid-tier artifact; not wired into the public site.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnrichedDirectory } from "../src/lib/india-directory-parse";
import { importDirectory } from "../src/data-platform/import-directory";
import { renderDigest } from "../src/data-platform/digest";
import { radarFeedEvents } from "../src/generated/radar-events";

const markdownPath = resolve(process.cwd(), "docs/research/india-fintech-directory-enriched.md");
const outDir = resolve(process.cwd(), "data-platform/out");
const companies = importDirectory(
  parseEnrichedDirectory(readFileSync(markdownPath, "utf8")),
).records.map((r) => r.company);

const events = radarFeedEvents.map((event) => ({
  id: `${event.companyId}-${event.code}`,
  type: event.type as never,
  companyId: event.companyId,
  happenedOn: event.happenedOn,
  detectedOn: event.detectedOn,
  detail: { code: event.code, status: event.status },
}));

const digest = renderDigest({
  title: "FinTech Atlas Radar — Weekly digest",
  weekLabel: "licences recorded as of the RBI PA/PA-CB baseline",
  generatedAt: new Date().toISOString().slice(0, 10),
  events,
  companies,
  focus: { licences: ["PA", "PA-CB"] },
});

mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "digest-week.md"), digest + "\n");
console.log(`Wrote data-platform/out/digest-week.md (${events.length} events).`);