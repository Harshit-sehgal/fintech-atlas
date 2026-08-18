/**
 * Live RBI Certificate-of-Authorisation (CoA) holder fetcher.
 *
 * RBI publishes the full authorised payment-system operator list at
 * `PublicationsView.aspx?id=12043` — the PA CoA list that the applications-
 * status page (fetch-rbi-pa.ts) does NOT contain. This page is fetchable
 * without the TSPD bot-challenge that blocks the standalone CoA PDF.
 *
 * Extracts the "Payment Aggregators (PA-O, PA-P & PA-CB)" section (authorised
 * entities + issue dates) into the same canonical markdown format consumed by
 * `platform:ingest-rbi`. Status is always `authorised` (a CoA has been
 * granted); the CoA issue date is recorded as the effective date.
 *
 * Run via `npm run platform:fetch-rbi-coa`.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { decodeHtmlEntities } from "./lib/html";

const COA_URL = "https://rbi.org.in/Scripts/PublicationsView.aspx?id=12043";
const OUT_DIR = resolve(process.cwd(), "data/regulatory/rbi");

interface CoaRow {
  name: string;
  systems: string[];
  date: string;
}

function decodeHtml(value: string): string {
  return decodeHtmlEntities(value);
}

function stripHtml(value: string): string {
  return decodeHtml(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Extracts the PA CoA holders from the page's "Payment Aggregators" section. */
export function parseCoaPaymentAggregators(html: string): CoaRow[] {
  const paIndex = html.indexOf("Payment Aggregators");
  if (paIndex < 0) return [];
  const tableStart = html.lastIndexOf("<table", paIndex);
  if (tableStart < 0) return [];
  // stop at the first "D." / "E." / "F." section separator (cancelled CoA lists)
  let tableEnd = html.indexOf("</table>", paIndex) + 8;
  const cancelled = html.indexOf('class="head">D.', paIndex);
  if (cancelled >= 0 && cancelled < tableEnd) tableEnd = cancelled;
  const seg = html.slice(tableStart, tableEnd);

  const rows: CoaRow[] = [];
  let current: CoaRow | undefined;
  for (const tr of seg.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) ?? []) {
    const tds = (tr.match(/<td[^>]*>[\s\S]*?<\/td>/g) ?? []).map((c) => stripHtml(c));
    const clean = tds.filter(Boolean);
    if (clean.length === 0) continue;
    if (/\bSr\s*No\b/i.test(clean[0]) || /\bName of the Authorised Entity\b/i.test(clean[0] ?? clean[1] ?? "")) {
      continue;
    }
    if (/^\d+\.?$/.test(clean[0])) {
      const name = clean[1] ?? "";
      const system = clean[3] ?? "";
      const date = clean[4] ?? clean[2] ?? "";
      current = { name, systems: system ? [system] : [], date };
      if (current.name) rows.push(current);
    } else if (current && clean.length >= 1) {
      // continuation row (rowspan): an extra system line, address, or date
      const maybeSystem = clean[0];
      if (/PA\s*-|PA-|Payment Aggregator/i.test(maybeSystem) && !/\d{2}\.\d{2}\.\d{4}/.test(maybeSystem)) {
        current.systems.push(maybeSystem);
      } else if (/\d{2}\.\d{2}\.\d{4}/.test(maybeSystem) && !current.date) {
        current.date = maybeSystem;
      }
    }
  }
  return rows;
}

/** Keeps only entities whose CoA covers a PA line (PA-O / PA-P / PA-CB). */
export function filterPaRows(rows: CoaRow[]): CoaRow[] {
  return rows.filter((r) => r.systems.some((s) => /PA\s*-|PA-|Payment Aggregator/i.test(s)));
}

export function renderCoaMarkdown(
  snapshotId: string,
  sourceUrl: string,
  fetchedOn: string,
  rows: CoaRow[],
): string {
  const lines = ["# RBI Payment Aggregator Certificate-of-Authorisation holders — live fetch", ""];
  lines.push("- Regulator: RBI");
  lines.push(`- Source: ${sourceUrl}`);
  lines.push(`- Fetched: ${fetchedOn}`);
  lines.push(`- Snapshot: ${snapshotId}`);
  lines.push("");
  lines.push("| Company | Licence | Status | Effective | Notes |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const r of rows) {
    for (const system of r.systems) {
      const code = system.startsWith("PA-CB") ? "PA-CB" : system.startsWith("PA-P") ? "PA-P" : "PA";
      lines.push(`| ${r.name} | ${code} | authorised | ${r.date} | CoA ${system} |`);
    }
  }
  lines.push("");
  return lines.join("\n");
}

async function main(): Promise<void> {
  const snapshotId = `payment-aggregators-coa-${new Date().toISOString().slice(0, 10)}`;
  const outPath = resolve(OUT_DIR, `${snapshotId}.md`);

  console.log(`Fetching RBI CoA holder list: ${COA_URL}`);
  const res = await fetch(COA_URL, {
    headers: { "user-agent": "FinTechAtlas/1.0 (radar change monitor)" },
    signal: AbortSignal.timeout(45_000),
  });
  if (!res.ok) {
    throw new Error(`RBI CoA fetch failed: HTTP ${res.status}`);
  }
  const html = await res.text();

  const rows = filterPaRows(parseCoaPaymentAggregators(html));
  if (rows.length === 0) {
    throw new Error("No PA CoA holders extracted — RBI page structure likely changed; refusing to emit an empty snapshot");
  }
  console.log(`PA CoA holders: ${rows.length}`);
  const systems = rows.reduce((n, r) => n + r.systems.filter((s) => /PA\s*-|PA-/.test(s)).length, 0);
  console.log(`PA CoA lines: ${systems}`);

  const markdown = renderCoaMarkdown(snapshotId, COA_URL, new Date().toISOString().slice(0, 10), rows);
  writeFileSync(outPath, markdown);
  console.log(`Snapshot written: ${outPath}`);
}

const isMain =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}