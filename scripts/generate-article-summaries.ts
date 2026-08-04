/**
 * Generates src/generated/article-summaries.ts — the client-safe subset of the
 * article catalog.
 *
 * The full catalog (src/data/articles.ts) carries heavy editorial payloads
 * (body blocks, CTAs, tool links). No client component renders those fields,
 * yet importing `articles` into a client bundle (the command palette) drags
 * every article body into the exported JavaScript. This script derives the
 * small, renderable subset once and writes it to a generated module that
 * client components import instead.
 *
 * Run via `prebuild` (npm run build) — the contract test in
 * src/__tests__/article-summaries.test.ts fails if this file drifts from
 * src/data/articles.ts.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { articles } from "../src/data/articles";

const outPath = resolve(process.cwd(), "src/generated/article-summaries.ts");

const summaries = articles.map((a) => ({
  slug: a.slug,
  title: a.title,
  description: a.description,
  category: a.category,
  relatedCompanySlugs: a.relatedCompanySlugs,
}));

const lines = [
  "// GENERATED FILE — do not edit by hand.",
  "// Derived from src/data/articles.ts by",
  "// scripts/generate-article-summaries.ts (runs automatically in `prebuild`).",
  "// Client-safe subset: every field below is rendered by a client component;",
  "// the heavy editorial payload (body, CTAs, tool links) lives only in the",
  "// server-side catalog.",
  "",
  "export interface ArticleSummary {",
  "  slug: string;",
  "  title: string;",
  "  description: string;",
  "  category: string;",
  "  /** Company profile slugs the article links (search surface). */",
  "  relatedCompanySlugs: string[];",
  "}",
  "",
  "export const articleSummaries: ArticleSummary[] = [",
  ...summaries.map((s) => `  ${JSON.stringify(s)},`),
  "];",
  "",
  "export function getArticleSummaryBySlug(slug: string): ArticleSummary | undefined {",
  "  return articleSummaries.find((a) => a.slug === slug);",
  "}",
  "",
];

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join("\n"));
console.log(`Generated ${outPath}: ${summaries.length} article summaries.`);
