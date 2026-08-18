/**
 * Generates src/generated/radar-facets.ts (client-safe, index-aligned with
 * src/generated/india-directory-summaries.ts) from the enriched India fintech
 * research directory.
 *
 * The radar module holds ONLY derived filter dimensions, positionally aligned
 * with `indiaDirectorySummaries` (same parse order, same source markdown), so
 * the /radar page never duplicates the slug/name/category/cluster payload.
 * Compact parallel arrays keep the exported chunk well inside the
 * compressed-JS budget gate.
 *
 * Run via `prebuild` (npm run build). The contract test in
 * src/__tests__/radar.test.ts fails if the generated module drifts from the
 * research markdown or from the directory summaries.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { parseEnrichedDirectory } from "../src/lib/india-directory-parse";
import {
  deriveRadarFacets,
  RADAR_LICENCES,
  RADAR_LICENCE_LABELS,
  RADAR_REGULATORS,
  RADAR_REGULATOR_LABELS,
  RADAR_SECTORS,
  RADAR_SECTOR_LABELS,
} from "../src/lib/radar-facets";

const markdownPath = resolve(process.cwd(), "docs/research/india-fintech-directory-enriched.md");
const outPath = resolve(process.cwd(), "src/generated/radar-facets.ts");

const records = parseEnrichedDirectory(readFileSync(markdownPath, "utf8"));
const facets = records.map((record) => deriveRadarFacets(record));

const sectorNames = RADAR_SECTORS.map((s) => RADAR_SECTOR_LABELS[s]);
const regulatorNames = RADAR_REGULATORS.map((r) => RADAR_REGULATOR_LABELS[r]);
const licenceNames = RADAR_LICENCES.map((l) => RADAR_LICENCE_LABELS[l]);

const sectorIndexes = facets.map((f) => RADAR_SECTORS.indexOf(f.sector));
const regulatorIndexes = facets.map((f) => RADAR_REGULATORS.indexOf(f.regulator));
const licenceMasks = facets.map((f) =>
  f.licences.reduce((mask, licence) => mask | (1 << RADAR_LICENCES.indexOf(licence)), 0),
);
const foundedYears = facets.map((f) => f.foundedYear ?? -1);
const fundingUsdM = facets.map((f) => f.fundingUsdM ?? -1);

const list = (values: number[]) =>
  values.length === 0
    ? "[]"
    : `[\n${values.map((v) => `  ${String(v)},`).join("\n")}\n]`;

const lines = [
  "// GENERATED FILE — do not edit by hand.",
  "// Derived from docs/research/india-fintech-directory-enriched.md by",
  "// scripts/generate-radar-facets.ts (runs automatically in `prebuild`).",
  "// Client-safe Radar facet arrays, positionally aligned with",
  "// indiaDirectorySummaries in india-directory-summaries.ts (same parse order).",
  "// -1 marks an unknown founded year or funding amount; licenceMask uses the",
  "// bit position of each licence in radarLicenceNames.",
  "",
  "export const radarSectorNames: string[] = [",
  ...sectorNames.map((n) => `  ${JSON.stringify(n)},`),
  "];",
  "",
  "export const radarRegulatorNames: string[] = [",
  ...regulatorNames.map((n) => `  ${JSON.stringify(n)},`),
  "];",
  "",
  "export const radarLicenceNames: string[] = [",
  ...licenceNames.map((n) => `  ${JSON.stringify(n)},`),
  "];",
  "",
  "export const radarSectorIndexes: number[] = ",
  ...(sectorIndexes.length === 0
    ? ["[];", ""]
    : [`${list(sectorIndexes)};`, ""]),
  "export const radarRegulatorIndexes: number[] = ",
  ...(regulatorIndexes.length === 0
    ? ["[];", ""]
    : [`${list(regulatorIndexes)};`, ""]),
  "export const radarLicenceMasks: number[] = ",
  ...(licenceMasks.length === 0 ? ["[];", ""] : [`${list(licenceMasks)};`, ""]),
  "export const radarFoundedYears: number[] = ",
  ...(foundedYears.length === 0 ? ["[];", ""] : [`${list(foundedYears)};`, ""]),
  "export const radarFundingUsdM: number[] = ",
  ...(fundingUsdM.length === 0 ? ["[];", ""] : [`${list(fundingUsdM)};`, ""]),
  "",
  `export const radarFacetCount = ${records.length};`,
  "",
];

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join("\n"));
console.log(
  `Generated radar-facets module: ${records.length} records (${sectorNames.length} sectors, ${regulatorNames.length} regulators, ${licenceNames.length} licences).`,
);