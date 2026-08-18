/**
 * Weekly digest generator (P11) — renders a markdown digest of the week's
 * Radar events for a saved search / watchlist. Pure and testable; the CLI
 * (scripts/generate-digest.ts) writes the artifact. The digest is a paid-tier
 * deliverable — nothing here is wired into the public site.
 */
import type { Company, CompanyRecord } from "./types";
import type { RadarEvent, RadarEventType } from "./events";

export interface DigestFocus {
  regulators?: string[];
  licences?: string[];
}

export interface DigestOptions {
  title: string;
  weekLabel: string;
  generatedAt: string;
  events: RadarEvent[];
  companies: Company[];
  focus?: DigestFocus;
}

export interface DigestSection {
  type: RadarEventType;
  label: string;
  entries: DigestEntry[];
}

export interface DigestEntry {
  companyName: string;
  code?: string;
  status?: string;
  happenedOn: string;
  detail: Record<string, unknown>;
}

const SECTION_LABELS: Record<RadarEventType, string> = {
  LICENSE_ADDED: "New licences",
  LICENSE_REMOVED: "Licences removed",
  REGULATORY_STATUS_CHANGED: "Regulatory status changes",
  FUNDING_ROUND: "Funding rounds",
  ACQUISITION: "Acquisitions",
  FOUNDER_CHANGE: "Founder changes",
  EXECUTIVE_CHANGE: "Executive changes",
  NEW_PRODUCT: "New products",
  COMPANY_ADDED: "Companies added",
  COMPANY_STATUS_CHANGED: "Company status changes",
};

const SECTION_ORDER: RadarEventType[] = [
  "REGULATORY_STATUS_CHANGED",
  "LICENSE_ADDED",
  "LICENSE_REMOVED",
  "FUNDING_ROUND",
  "ACQUISITION",
  "FOUNDER_CHANGE",
  "EXECUTIVE_CHANGE",
  "NEW_PRODUCT",
  "COMPANY_ADDED",
  "COMPANY_STATUS_CHANGED",
];

export function nameForCompanyId(companyId: string, companies: Company[]): string {
  return companies.find((c) => c.id === companyId)?.displayName ?? companyId;
}

export function matchesFocus(event: RadarEvent, focus?: DigestFocus): boolean {
  if (!focus) return true;
  if (focus.licences && focus.licences.length > 0) {
    const code = String(event.detail.code ?? "");
    if (!focus.licences.includes(code)) return false;
  }
  if (focus.regulators && focus.regulators.length > 0) {
    const regulator = String(event.detail.regulator ?? event.detail.code ?? "").toUpperCase();
    if (!focus.regulators.includes(regulator)) return false;
  }
  return true;
}

export function buildSections(
  events: RadarEvent[],
  companies: Company[],
  focus?: DigestFocus,
): DigestSection[] {
  const sections = new Map<RadarEventType, DigestSection>();
  for (const event of events) {
    if (!matchesFocus(event, focus)) continue;
    const section = sections.get(event.type) ?? {
      type: event.type,
      label: SECTION_LABELS[event.type] ?? event.type.replace(/_/g, " "),
      entries: [],
    };
    section.entries.push({
      companyName: event.companyId
        ? nameForCompanyId(event.companyId, companies)
        : (event.companyName ?? "Unknown company"),
      code: event.detail.code !== undefined ? String(event.detail.code) : undefined,
      status: event.detail.status !== undefined ? String(event.detail.status) : undefined,
      happenedOn: event.happenedOn,
      detail: event.detail,
    });
    sections.set(event.type, section);
  }
  return SECTION_ORDER.filter((type) => sections.has(type)).map((type) => sections.get(type)!);
}

/** Renders the digest body as markdown (used by the CLI and by tests). */
export function renderDigest(options: DigestOptions): string {
  const sections = buildSections(options.events, options.companies, options.focus);
  const total = sections.reduce((sum, s) => sum + s.entries.length, 0);

  const lines: string[] = [];
  lines.push(`# ${options.title}`);
  lines.push("");
  lines.push(`Week: ${options.weekLabel}`);
  lines.push(`Generated: ${options.generatedAt}`);
  lines.push("");
  lines.push(`**${total} change${total === 1 ? "" : "s"} recorded.**`);
  lines.push("");
  lines.push(`_Source: FinTech Atlas Radar change engine. Every event carries a source and a confidence level._`);
  lines.push("");

  if (sections.length === 0) {
    lines.push("No changes recorded in this period.");
    lines.push("");
    return lines.join("\n");
  }

  for (const section of sections) {
    lines.push(`## ${section.label}`);
    lines.push("");
    for (const entry of section.entries) {
      const detailBits = [
        entry.code ? `licence ${entry.code}` : null,
        entry.status ? `status ${entry.status}` : null,
        entry.happenedOn ? `on ${entry.happenedOn}` : null,
      ].filter(Boolean);
      lines.push(`- ${entry.companyName}${detailBits.length ? ` — ${detailBits.join(", ")}` : ""}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/** A digest of one company's events, used for watchlist digests. */
export function digestForCompany(company: CompanyRecord, events: RadarEvent[]): string {
  const companyEvents = events.filter((e) => e.companyId === company.company.id);
  return renderDigest({
    title: `${company.company.displayName} — Radar digest`,
    weekLabel: "last 7 days",
    generatedAt: new Date().toISOString().slice(0, 10),
    events: companyEvents,
    companies: [company.company],
  });
}