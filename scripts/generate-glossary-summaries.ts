/**
 * Generates src/generated/glossary-summaries.ts — the client-safe subset of
 * the glossary (slug + term + short).
 *
 * The full glossary carries long-form definitions that only the static
 * glossary page renders; importing the full module into client components
 * (homepage teaser) drags every definition into the exported JavaScript.
 * This script derives the small renderable subset once, mirroring
 * scripts/generate-company-summaries.ts.
 *
 * Run via `prebuild`. The contract test in src/data/glossary.test.ts fails
 * if this file drifts from src/data/glossary.ts.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { glossary } from "../src/data/glossary";

const outPath = resolve(process.cwd(), "src/generated/glossary-summaries.ts");

const summaries = glossary.map((g) => ({
  slug: g.slug,
  term: g.term,
  short: g.short,
}));

const lines = [
  "// GENERATED FILE — do not edit by hand.",
  "// Derived from src/data/glossary.ts by",
  "// scripts/generate-glossary-summaries.ts (runs automatically in `prebuild`).",
  "// Client-safe subset: only term + one-line definition. The long-form",
  "// definitions live server-side on the static glossary page.",
  "",
  "export interface GlossarySummary {",
  "  slug: string;",
  "  term: string;",
  "  short: string;",
  "}",
  "",
  "export const glossarySummaries: GlossarySummary[] = [",
  ...summaries.map((s) =>
    `  { slug: ${JSON.stringify(s.slug)}, term: ${JSON.stringify(s.term)}, short: ${JSON.stringify(s.short)} },`,
  ),
  "];",
  "",
];

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join("\n"));
console.log(`Generated ${outPath}: ${summaries.length} glossary summaries.`);
