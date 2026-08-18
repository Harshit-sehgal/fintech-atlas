/**
 * Live RBI payment-aggregator fetcher (O3).
 *
 * Fetches RBI's live "Status of Applications received from Payment Aggregators"
 * page and emits a snapshot in the canonical markdown format consumed by
 * `platform:ingest-rbi` (src/data-platform/rbi/parse.ts).
 *
 * Tables parsed (as of the RBI PSS page, bs_viewcontent.aspx?Id=4236):
 *   A existing PAs-O (online, can operate)   → PA
 *   B new PAs-Online (in-principle / process) → PA
 *   C returned/withdrawn/refused PA-Online     → skipped (not active)
 *   D existing PAs-CB (can operate)            → PA-CB
 *   E new PAs-CB                                → PA-CB
 *   F returned/withdrawn/refused PA-CB          → skipped
 *   G existing PAs-P (physical, can operate)    → PA-P
 *   H new PAs-P                                 → PA-P
 *   I returned/withdrawn/refused PA-P           → skipped
 *
 * Run via `npm run platform:fetch-rbi`; pass `--ingest` to immediately diff
 * the live snapshot against the baseline and emit events + a review queue.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const LIVE_URL = "https://www.rbi.org.in/Scripts/bs_viewcontent.aspx?Id=4236";
const OUT_DIR = resolve(process.cwd(), "data/regulatory/rbi");

type TableCode = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";

interface ParsedRow {
  name: string;
  remark: string;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "-")
    .replace(/&#8486;/g, "Ω")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function stripHtml(value: string): string {
  return decodeHtml(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function tableLabel(cells: string[]): string | undefined {
  const joined = cells.join(" | ");
  const match = joined.match(/Table\s+([A-I])\s*:/);
  return match ? match[1] : undefined;
}

function codeForTable(table: TableCode): "PA" | "PA-CB" | "PA-P" | undefined {
  switch (table) {
    case "A":
    case "B":
      return "PA";
    case "D":
    case "E":
      return "PA-CB";
    case "G":
    case "H":
      return "PA-P";
    default:
      return undefined;
  }
}

function statusForRemark(remark: string): "authorised" | "in-principle" | "application" | "unknown" {
  const t = remark.toLowerCase();
  // RBI explicitly warns "in-principle" is NOT authorisation under §7 PSS Act —
  // check it before any generic "authorisation granted" match.
  if (/in-principle/.test(t)) return "in-principle";
  if (/certificate of authoris|coa\b/.test(t)) return "authorised";
  if (/authorisation granted|authorized\b|authorised\b/.test(t)) return "authorised";
  if (/under process|under consideration|application pending/.test(t)) return "application";
  return "unknown";
}

/** Returns { table → rows } for the PA tables we track, keyed by table code. */
export function parseLiveRbiTables(html: string): Record<TableCode, ParsedRow[]> {
  const out = {} as Record<TableCode, ParsedRow[]>;
  const tables = html.match(/<table[\s\S]*?<\/table>/g) ?? [];

  for (const raw of tables) {
    const rows = raw.match(/<tr[\s\S]*?<\/tr>/g) ?? [];
    let table: TableCode | undefined;
    const parsed: ParsedRow[] = [];

    for (const row of rows) {
      const cells = (row.match(/<t[dh][\s\S]*?<\/t[dh]>/g) ?? []).map((c) =>
        stripHtml(c.replace(/<br\s*\/?>/gi, " ")),
      );
      if (cells.length === 0) continue;

      const label = tableLabel(cells);
      if (label) {
        table = label as TableCode;
        continue;
      }

      if (!table) continue;
      const code = codeForTable(table);
      if (!code) continue;

      const name = cells[1] ?? "";
      const remark = cells[2] ?? "";
      if (!name || /Sr No|Name of the entity/i.test(name)) continue;

      const clean = name
        .replace(/[*#Ω]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (!clean) continue;

      parsed.push({ name: clean, remark });
    }

    if (table) out[table] = parsed;
  }

  return out;
}

export function buildSnapshot(parsed: Record<TableCode, ParsedRow[]>): {
  entries: Array<{ companyName: string; code: string; status: string; effectiveDate?: string; notes?: string }>;
} {
  const entries = [];
  for (const table of ["A", "B", "D", "E", "G", "H"] as TableCode[]) {
    const code = codeForTable(table)!;
    for (const row of parsed[table] ?? []) {
      const status = statusForRemark(row.remark);
      if (status === "unknown") continue;
      entries.push({
        companyName: row.name,
        code,
        status,
        notes: `Table ${table} · ${row.remark}`,
      });
    }
  }
  return { entries };
}

export function renderSnapshotMarkdown(
  snapshotId: string,
  sourceUrl: string,
  fetchedOn: string,
  entries: Array<{ companyName: string; code: string; status: string; effectiveDate?: string; notes?: string }>,
): string {
  const lines = ["# RBI Payment Aggregator status — live fetch", ""];
  lines.push("- Regulator: RBI");
  lines.push(`- Source: ${sourceUrl}`);
  lines.push(`- Fetched: ${fetchedOn}`);
  lines.push(`- Snapshot: ${snapshotId}`);
  lines.push("");
  lines.push("| Company | Licence | Status | Effective | Notes |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const e of entries) {
    lines.push(
      `| ${e.companyName} | ${e.code} | ${e.status} | ${e.effectiveDate ?? ""} | ${e.notes ?? ""} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

async function main(): Promise<void> {
  const snapshotId = `payment-aggregators-live-${new Date().toISOString().slice(0, 10)}`;
  const outPath = resolve(OUT_DIR, `${snapshotId}.md`);

  console.log(`Fetching RBI PA status page: ${LIVE_URL}`);
  const res = await fetch(LIVE_URL, {
    headers: { "user-agent": "FinTechAtlas/1.0 (radar change monitor)" },
    signal: AbortSignal.timeout(45_000),
  });
  if (!res.ok) {
    throw new Error(`RBI fetch failed: HTTP ${res.status}`);
  }
  const html = await res.text();

  const parsed = parseLiveRbiTables(html);
  const total = Object.values(parsed).reduce((n, rows) => n + rows.length, 0);
  if (total === 0) {
    throw new Error("No PA tables found — RBI page structure likely changed; refusing to emit an empty snapshot");
  }
  console.log(`Parsed tables: A ${parsed.A?.length ?? 0}, B ${parsed.B?.length ?? 0}, D ${parsed.D?.length ?? 0}, E ${parsed.E?.length ?? 0}, G ${parsed.G?.length ?? 0}, H ${parsed.H?.length ?? 0}`);

  const { entries } = buildSnapshot(parsed);
  if (entries.length === 0) {
    throw new Error("No trackable PA/PA-CB/PA-P entries extracted; refusing to write an empty snapshot");
  }
  console.log(`Tracked entries: ${entries.length} (PA ${entries.filter((e) => e.code === "PA").length}, PA-CB ${entries.filter((e) => e.code === "PA-CB").length}, PA-P ${entries.filter((e) => e.code === "PA-P").length})`);

  const markdown = renderSnapshotMarkdown(snapshotId, LIVE_URL, new Date().toISOString().slice(0, 10), entries);
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
