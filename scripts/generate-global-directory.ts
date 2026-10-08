/**
 * Generates src/generated/global-directory.ts (server-side full
 * records) and src/generated/global-directory-summaries.ts
 * (client-safe compact subset) from
 * docs/research/global-fintech-directory.md.
 *
 * Mirrors scripts/generate-india-directory.ts: the full records
 * carry long research fields (funding, licences, description) that
 * no client component renders, so the directory page imports the
 * small summaries module instead of dragging every full record into
 * the exported JavaScript.
 *
 * Run via `prebuild` (npm run build). The contract test in
 * src/__tests__/global-directory.test.ts fails if the generated
 * modules drift from the research markdown.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  clusterGroups,
  distinctCategories,
  parseGlobalDirectory,
} from "../src/lib/global-directory-parse";

const markdownPath = resolve(
  process.cwd(),
  "docs/research/global-fintech-directory.md",
);
const fullOutPath = resolve(
  process.cwd(),
  "src/generated/global-directory.ts",
);
const summariesOutPath = resolve(
  process.cwd(),
  "src/generated/global-directory-summaries.ts",
);

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

const records = parseGlobalDirectory(readFileSync(markdownPath, "utf8"));
const clusters = clusterGroups(records);
const categories = distinctCategories(records);

const fullLines = [
  "// GENERATED FILE — do not edit by hand.",
  "// Derived from docs/research/global-fintech-directory.md by",
  "// scripts/generate-global-directory.ts (runs automatically in `prebuild`).",
  "// Server-side only: imported by static profile pages, never by client",
  "// components (see global-directory-summaries.ts for the client subset).",
  "",
  'import type { GlobalDirectoryRecord } from "@/lib/global-directory-parse";',
  "",
  "export interface GlobalDirectoryCluster {",
  "  name: string;",
  "  count: number;",
  "}",
  "",
  "export const globalDirectoryClusters: GlobalDirectoryCluster[] = [",
  ...clusters.map((c) => `  { name: ${jsLiteral(c.name)}, count: ${c.count} },`),
  "];",
  "",
  "export const globalDirectoryRecords: GlobalDirectoryRecord[] = [",
  ...records.map((r) => `  ${jsLiteral(r)},`),
  "];",
  "",
  "export function getGlobalDirectoryRecordBySlug(slug: string): GlobalDirectoryRecord | undefined {",
  "  return globalDirectoryRecords.find((record) => record.slug === slug);",
  "}",
  "",
  "export function getGlobalDirectoryRecordsByCluster(clusterName: string): GlobalDirectoryRecord[] {",
  "  return globalDirectoryRecords.filter((record) => record.cluster === clusterName);",
  "}",
  "",
  `export const globalDirectoryCount = ${records.length};`,
  "",
];

// Client-safe subset: slug + name + category + cluster index. The full
// research payload (funding, licences, description, …) stays server-side on
// the profile pages; the index page only needs enough to search, filter, and
// link. Cluster names are pooled so records reference a single string array
// instead of repeating them — keeps the directory page inside the
// compressed-JS budget gate.
const summaryLines = [
  "// GENERATED FILE — do not edit by hand.",
  "// Derived from docs/research/global-fintech-directory.md by",
  "// scripts/generate-global-directory.ts (runs automatically in `prebuild`).",
  "// Client-safe subset for the directory index page: name/category/cluster",
  "// only, with cluster names pooled into an index array so the page stays",
  "// inside the compressed-JS budget.",
  "",
  "/** Compact tuple: [slug, name, categoryIndex, clusterIndex]. Kept as an",
  " *  array rather than an object because repeating the four keys across",
  " *  thousands of records is measurably larger in the compressed bundle. */",
  "export type GlobalDirectorySummary = readonly [string, string, number, number];",
  "",
  `export const globalDirectoryClusterNames: string[] = [`,
  ...clusters.map((c) => `  ${jsLiteral(c.name)},`),
  `];`,
  "",
  `export const globalDirectoryCategoryNames: string[] = [`,
  ...categories.map((c) => `  ${jsLiteral(c)},`),
  `];`,
  "",
  "export const globalDirectorySummaries: GlobalDirectorySummary[] = [",
  ...records.map((r) =>
    `  [${jsLiteral(r.slug)}, ${jsLiteral(r.name)}, ${categories.indexOf(r.category)}, ${clusters.findIndex((c) => c.name === r.cluster)}],`,
  ),
  "];",
  "",
];

mkdirSync(dirname(fullOutPath), { recursive: true });
writeFileSync(fullOutPath, fullLines.join("\n"));
writeFileSync(summariesOutPath, summaryLines.join("\n"));
console.log(
  `Generated global-directory modules: ${records.length} records across ${clusters.length} clusters (full + ${records.length} client summaries).`,
);
