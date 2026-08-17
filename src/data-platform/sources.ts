/**
 * Source registry for the Radar data platform.
 *
 * Every material claim must resolve to a Source here (ADR-002). The research
 * directory is the primary import source; regulator-labelled clusters and
 * regulator-cited licence strings let us attach official-regulator confidence
 * to licence claims while staying honest about the chain (notes field).
 */
import type { Source } from "./types";

/** Directory compile date — the enriched research markdown states it. */
export const RESEARCH_COMPILED_AT = "2026-08-15";

/** Regulator list entries reachable from the RBI portal (system health lists). */
export const RBI_SOURCE_URL =
  "https://www.rbi.org.in/Scripts/BS_ViewMasDirectory.aspx";

export const SOURCES: Source[] = [
  {
    id: "rbi-public-lists",
    url: RBI_SOURCE_URL,
    publisher: "Reserve Bank of India",
    sourceType: "regulator",
    accessedAt: RESEARCH_COMPILED_AT,
  },
  {
    id: "sebi-public-lists",
    publisher: "Securities and Exchange Board of India",
    sourceType: "regulator",
    accessedAt: RESEARCH_COMPILED_AT,
  },
  {
    id: "irdai-public-lists",
    publisher: "Insurance Regulatory and Development Authority of India",
    sourceType: "regulator",
    accessedAt: RESEARCH_COMPILED_AT,
  },
  {
    id: "npci-public-lists",
    publisher: "National Payments Corporation of India",
    sourceType: "regulator",
    accessedAt: RESEARCH_COMPILED_AT,
  },
  {
    id: "research-directory",
    publisher: "FinTech Atlas research directory",
    sourceType: "database",
    accessedAt: RESEARCH_COMPILED_AT,
    effectiveAt: RESEARCH_COMPILED_AT,
  },
  {
    id: "official-website",
    publisher: "Company official website",
    sourceType: "official-website",
    accessedAt: RESEARCH_COMPILED_AT,
  },
];

/** Resolves a source id, throwing on unknown ids (provenance discipline). */
export function getSource(id: string): Source {
  const source = SOURCES.find((s) => s.id === id);
  if (!source) throw new Error(`Unknown source id: ${id}`);
  return source;
}

/** The regulator source that corresponds to a regulator code, if any. */
export function regulatorSourceId(regulator: string): string {
  switch (regulator) {
    case "RBI":
      return "rbi-public-lists";
    case "SEBI":
      return "sebi-public-lists";
    case "IRDAI":
      return "irdai-public-lists";
    case "NPCI":
      return "npci-public-lists";
    default:
      return "research-directory";
  }
}