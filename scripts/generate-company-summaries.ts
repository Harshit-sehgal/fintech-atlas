/**
 * Generates src/generated/company-summaries.ts — the client-safe subset of the
 * company catalog.
 *
 * The full catalog (src/data/companies.ts) carries heavy editorial payloads
 * (whatTheyOffer, whoUses, pricing detail, sources, pros/cons). No client
 * component renders those fields, yet importing `companies` into a client
 * bundle drags the entire catalog into the exported JavaScript. This script
 * derives the small, renderable subset once and writes it to a generated
 * module that client components import instead.
 *
 * Run via `prebuild` (npm run build) — the contract test in
 * src/__tests__/company-summaries.test.ts fails if this file drifts from
 * src/data/companies.ts.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { companies } from "../src/data/companies";
import { categories } from "../src/data/categories";

const outPath = resolve(process.cwd(), "src/generated/company-summaries.ts");

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

/** Optional string fields that are `undefined` when the source is empty. */
function firstOrUndefined(values: readonly string[] | undefined): string | undefined {
  return values && values.length > 0 ? values[0] : undefined;
}

const summaries = companies.map((c) => ({
  slug: c.slug,
  name: c.name,
  tagline: c.tagline,
  founded: c.founded,
  headquarters: c.headquarters,
  website: c.website,
  valuation: c.valuation,
  ...(c.valuationAmountUsd !== undefined
    ? { valuationAmountUsd: c.valuationAmountUsd }
    : {}),
  categories: c.categories,
  accent: c.accent,
  rating: c.userReviews.rating,
  pricingModel: c.pricing.model,
  employees: c.employees,
  // The compare table renders at most four notable customers.
  customers: c.whoUses.slice(0, 4),
  ...(firstOrUndefined(c.strengths) !== undefined
    ? { primaryStrength: firstOrUndefined(c.strengths) }
    : {}),
  ...(firstOrUndefined(c.weaknesses) !== undefined
    ? { primaryWeakness: firstOrUndefined(c.weaknesses) }
    : {}),
  // Compact search surface: what the directory search box matches against,
  // without shipping the full editorial payloads to the client.
  searchTerms: [
    c.name,
    c.tagline,
    c.oneLiner,
    ...c.founders,
    ...c.whatTheyOffer.map((o) => o.name),
  ]
    .join(" ")
    .toLowerCase(),
}));

const categoryNames: Record<string, string> = Object.fromEntries(
  categories.map((cat) => [cat.slug, cat.name]),
);

const lines = [
  "// GENERATED FILE — do not edit by hand.",
  "// Derived from src/data/companies.ts + src/data/categories.ts by",
  "// scripts/generate-company-summaries.ts (runs automatically in `prebuild`).",
  "// Client-safe subset: every field below is rendered by a client component;",
  "// the heavy editorial payload lives only in the server-side catalog.",
  "",
  "export interface CompanySummary {",
  "  slug: string;",
  "  name: string;",
  "  tagline: string;",
  "  founded: number;",
  "  headquarters: string;",
  "  website: string;",
  "  valuation: string;",
  "  /** Structured numeric valuation (whole USD); omitted when not comparable. */",
  "  valuationAmountUsd?: number;",
  "  categories: string[];",
  "  accent: string;",
  "  /** Editorial sentiment rating, not a community aggregate (see methodology). */",
  "  rating: number;",
  "  pricingModel: string;",
  "  employees: string;",
  "  /** Notable customers, capped at the four the compare table renders. */",
  "  customers: string[];",
  "  primaryStrength?: string;",
  "  primaryWeakness?: string;",
  "  /** Lower-cased search surface (name, tagline, one-liner, founders, offer names). */",
  "  searchTerms: string;",
  "}",
  "",
  "export const companySummaries: CompanySummary[] = [",
  ...summaries.map((s) => `  ${jsLiteral(s)},`),
  "];",
  "",
  "/** Category slug → display name, used by client cards and hero. */",
  `export const categoryNames: Record<string, string> = ${jsLiteral(categoryNames)};`,
  "",
  "export function getCompanySummaryBySlug(slug: string): CompanySummary | undefined {",
  "  return companySummaries.find((c) => c.slug === slug);",
  "}",
  "",
  "export function getCompanySummariesByCategory(categorySlug: string): CompanySummary[] {",
  "  return companySummaries.filter((c) => c.categories.includes(categorySlug));",
  "}",
  "",
  "export function companySummaryCountByCategory(categorySlug: string): number {",
  "  return getCompanySummariesByCategory(categorySlug).length;",
  "}",
  "",
];

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join("\n"));
console.log(
  `Generated ${outPath}: ${summaries.length} company summaries (${categoryNames.length} category names).`,
);
