/**
 * Seeds the concierge-sales prospect database skeleton (docs/sales/prospects.csv).
 *
 * The CSV is local-only and git-ignored because it accumulates real personal
 * data. This script just recreates the header + example rows so the tracker
 * is ready for the operator (Phase 6). Run via `npm run sales:seed-prospects`.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const headers = [
  "id",
  "name",
  "role",
  "vertical",
  "source",
  "status",
  "last_contacted",
  "gate_evidence",
  "notes",
];

const examples = [
  {
    id: "EX01",
    name: "Example: Acme Payments Co",
    role: "BD lead, payments infrastructure",
    vertical: "payments",
    source: "example — replace with real prospect",
    status: "lead",
    last_contacted: "",
    gate_evidence: "",
    notes: "Example row. Delete before real use.",
  },
  {
    id: "EX02",
    name: "Example: RegTek Advisory",
    role: "Fintech consultant",
    vertical: "regtech",
    source: "example — replace with real prospect",
    status: "lead",
    last_contacted: "",
    gate_evidence: "",
    notes: "Example row. Delete before real use.",
  },
];

const escapeCsv = (value: string) =>
  /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

const csv = [headers.join(","), ...examples.map((row) => Object.values(row).map(escapeCsv).join(","))].join("\n") + "\n";

const outPath = resolve(process.cwd(), "docs/sales/prospects.csv");
mkdirSync(resolve(process.cwd(), "docs/sales"), { recursive: true });
writeFileSync(outPath, csv);
console.log(`Seeded prospect database skeleton → ${outPath} (local-only, git-ignored).`);