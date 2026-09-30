/**
 * Evidence model — every material claim must resolve to a source with a
 * confidence level (A–E) and a verification date (ADR-002 / Phase 4 of the
 * execution plan). Never show an important regulatory claim without knowing
 * where it came from.
 */
import { deriveLicences, deriveRegulator, RADAR_LICENCE_LABELS } from "@/lib/radar-facets";
import { getSource, RESEARCH_COMPILED_AT, regulatorSourceId } from "./sources";
import type { Confidence, Evidence, LicenceRecord, LicenceStatus } from "./types";

const REGULATOR_IN_FIELD_RE = /\b(RBI|SEBI|IRDAI|NPCI)\b/i;
const CLUSTER_LICENCE_LABELLED_RE =
  /\b(PA-O|PA-P|PA-CB|PPI|P2P|TPAP|AA|MTSS|SFB|AD-II|BBPOU)\b/i;

/** Regulator cited in the licence text, if any (falls back to cluster). */
export function regulatorForLicence(cluster: string, licencesField: string): string {
  const cited = licencesField.match(REGULATOR_IN_FIELD_RE);
  if (cited) return cited[1].toUpperCase();
  return deriveRegulator(cluster);
}

export function licenceStatusFromText(value: string): LicenceStatus {
  if (/authoris|CoA|approved|granted|full licence/i.test(value)) return "authorised";
  if (/in[- ]principle/i.test(value)) return "in-principle";
  if (/application|under process|pending/i.test(value)) return "application";
  return "unknown";
}

/**
 * A licence claim that cites a regulator (in the field) or sits in a
 * regulator-labelled cluster gets official-regulator confidence (A);
 * anything only visible in the secondary compilation is D. The chain is kept
 * honest in `notes`.
 */
export function confidenceForLicence(cluster: string, licencesField: string): Confidence {
  const citedRegulator = licencesField.match(REGULATOR_IN_FIELD_RE);
  if (citedRegulator) return "A";
  if (CLUSTER_LICENCE_LABELLED_RE.test(cluster)) return "A";
  return "D";
}

export function sourceForLicence(cluster: string, licencesField: string): string {
  return regulatorSourceId(regulatorForLicence(cluster, licencesField));
}

/** Builds the licence records for one research row. */
export function buildLicenceRecords(
  companyId: string,
  cluster: string,
  licencesField: string,
): LicenceRecord[] {
  const codes = deriveLicences(cluster, licencesField);
  const regulator = regulatorForLicence(cluster, licencesField);
  const sourceId = sourceForLicence(cluster, licencesField);
  const confidence = confidenceForLicence(cluster, licencesField);
  const status = licenceStatusFromText(licencesField);

  return codes.map((code) => ({
    companyId,
    regulator,
    code,
    label: RADAR_LICENCE_LABELS[code],
    status,
    verifiedAt: RESEARCH_COMPILED_AT,
    sourceId,
    confidence,
    notes: confidence === "A"
      ? `Regulator-cited licence; compiled ${RESEARCH_COMPILED_AT}`
      : `Secondary compilation; re-verify against the regulator list`,
  }));
}

/** Builds one evidence row for a material field. */
export function evidenceFor(
  companyId: string,
  fieldName: string,
  value: string,
  confidence: Confidence,
  sourceId: string,
  notes?: string,
): Evidence {
  const source = getSource(sourceId);
  return {
    companyId,
    fieldName,
    value,
    confidence,
    sourceId,
    verifiedAt: RESEARCH_COMPILED_AT,
    effectiveAt: source.effectiveAt ?? RESEARCH_COMPILED_AT,
    notes,
  };
}