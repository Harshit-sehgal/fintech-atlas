/**
 * Generates src/generated/india-directory.ts (server-side full records) and
 * src/generated/india-directory-summaries.ts (client-safe compact subset)
 * from docs/research/india-fintech-directory-enriched.md.
 *
 * Mirrors scripts/generate-company-summaries.ts: the full records carry long
 * research fields (funding, licences, description) that no client component
 * renders, so the directory page imports the small summaries module instead
 * of dragging 1,386 full records into the exported JavaScript.
 *
 * Run via `prebuild` (npm run build). The contract test in
 * src/__tests__/india-directory.test.ts fails if the generated modules drift
 * from the research markdown.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  clusterGroups,
  parseEnrichedDirectory,
} from "../src/lib/india-directory-parse";

const markdownPath = resolve(process.cwd(), "docs/research/india-fintech-directory-enriched.md");
const fullOutPath = resolve(process.cwd(), "src/generated/india-directory.ts");
const summariesOutPath = resolve(process.cwd(), "src/generated/india-directory-summaries.ts");

function jsLiteral(value: unknown): string {
  if (value === undefined) return "undefined";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    const items = value.map((v) => jsLiteral(v));
    return items.length === 0 ? "[]" : `[${items.join(", ")}]`;
  }
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>).map(
      ([k, v]) => `${JSON.stringify(k)}: ${jsLiteral(v)}`,
    );
    return entries.length === 0 ? "{}" : `{ ${entries.join(", ")} }`;
  }
  throw new Error(`Unsupported literal value: ${String(value)}`);
}

const records = parseEnrichedDirectory(readFileSync(markdownPath, "utf8"));
const clusters = clusterGroups(records);

const fullLines = [
  "// GENERATED FILE — do not edit by hand.",
  "// Derived from docs/research/india-fintech-directory-enriched.md by",
  "// scripts/generate-india-directory.ts (runs automatically in `prebuild`).",
  "// Server-side only: imported by static profile pages, never by client",
  "// components (see india-directory-summaries.ts for the client subset).",
  "",
  "import type { IndiaDirectoryRecord } from \"@/lib/india-directory-parse\";",
  "",
  "export interface IndiaDirectoryCluster {",
  "  name: string;",
  "  count: number;",
  "}",
  "",
  "export const indiaDirectoryClusters: IndiaDirectoryCluster[] = [",
  ...clusters.map((c) => `  { name: ${jsLiteral(c.name)}, count: ${c.count} },`),
  "];",
  "",
  "export const indiaDirectoryRecords: IndiaDirectoryRecord[] = [",
  ...records.map((r) => `  ${jsLiteral(r)},`),
  "];",
  "",
  "export function getIndiaDirectoryRecordBySlug(slug: string): IndiaDirectoryRecord | undefined {",
  "  return indiaDirectoryRecords.find((record) => record.slug === slug);",
  "}",
  "",
  "export function getIndiaDirectoryRecordsByCluster(clusterName: string): IndiaDirectoryRecord[] {",
  "  return indiaDirectoryRecords.filter((record) => record.cluster === clusterName);",
  "}",
  "",
  `export const indiaDirectoryCount = ${records.length};`,
  "",
];

// Client-safe subset: slug + name + category + cluster index. The full
// research payload (funding, licences, description, …) stays server-side on
// the profile pages; the index page only needs enough to search, filter, and
// link. Cluster names are pooled so 1,386 records reference a 101-string
// array instead of repeating them — keeps the directory page inside the
// compressed-JS budget gate.
const summaryLines = [
  "// GENERATED FILE — do not edit by hand.",
  "// Derived from docs/research/india-fintech-directory-enriched.md by",
  "// scripts/generate-india-directory.ts (runs automatically in `prebuild`).",
  "// Client-safe subset for the directory index page: name/category/cluster",
  "// only, with cluster names pooled into an index array so the page stays",
  "// inside the compressed-JS budget.",
  "",
  "export interface IndiaDirectorySummary {",
  "  slug: string;",
  "  name: string;",
  "  category: string;",
  "  clusterIndex: number;",
  "}",
  "",
  `export const indiaDirectoryClusterNames: string[] = [`,
  ...clusters.map((c) => `  ${jsLiteral(c.name)},`),
  `];`,
  "",
  "export const indiaDirectorySummaries: IndiaDirectorySummary[] = [",
  ...records.map((r) =>
    `  { slug: ${jsLiteral(r.slug)}, name: ${jsLiteral(r.name)}, category: ${jsLiteral(r.category)}, clusterIndex: ${clusters.findIndex((c) => c.name === r.cluster)} },`,
  ),
  "];",
  "",
];

mkdirSync(dirname(fullOutPath), { recursive: true });
writeFileSync(fullOutPath, fullLines.join("\n"));
writeFileSync(summariesOutPath, summaryLines.join("\n"));
console.log(
  `Generated india-directory modules: ${records.length} records across ${clusters.length} clusters (full + ${records.length} client summaries).`,
);
