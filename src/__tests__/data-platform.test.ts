import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnrichedDirectory } from "@/lib/india-directory-parse";
import { coverageStats, importDirectory, importDirectoryRecord, categoryId, collectCategoryIds, mapCompanyStatus } from "@/data-platform/import-directory";
import { getSource, RESEARCH_COMPILED_AT, SOURCES } from "@/data-platform/sources";
import {
  buildLicenceRecords,
  confidenceForLicence,
  licenceStatusFromText,
  regulatorForLicence,
} from "@/data-platform/evidence";
import { baselineEvents, diffLicenceSnapshots, makeEventId } from "@/data-platform/events";

const markdownPath = resolve(
  process.cwd(),
  "docs/research/india-fintech-directory-enriched.md",
);

describe("data platform — research import contract", () => {
  const snapshot = importDirectory(parseEnrichedDirectory(readFileSync(markdownPath, "utf8")));
  const stats = coverageStats(snapshot);

  it("imports every company from the research file", () => {
    expect(stats.companies).toBe(1386);
    expect(snapshot.records.length).toBe(1386);
  });

  it("category labels dedupe to one row per id (seed stays loadable)", () => {
    const labels = snapshot.records.flatMap((r) => [
      r.company.category,
      ...r.categories.map((c) => c.category),
    ]);
    const distinctLabels = [...new Set(labels)];
    const uniqueIds = new Set(distinctLabels.map(categoryId));
    const collapsed = collectCategoryIds(labels);

    // Case/punctuation variants legitimately collapse (e.g. "POS/Payment" vs
    // "POS / payment"); the map must still emit exactly one row per id…
    expect(collapsed.size).toBe(uniqueIds.size);
    // …and every id referenced by company_categories must exist in it, so the
    // categories INSERT satisfies the foreign key no matter the label variant.
    for (const label of labels) {
      expect(collapsed.has(categoryId(label))).toBe(true);
    }
  });

  it("no duplicate (companyId, categoryId) pairs across company_categories", () => {
    const keys = snapshot.records.flatMap((r) =>
      r.categories.map((c) => `${c.companyId}|${categoryId(c.category)}`),
    );
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("every licence regulator resolves to a seeded regulator code", () => {
    const regulatorCodes = ["RBI", "SEBI", "IRDAI", "NPCI", "FIU", "mixed"];
    for (const record of snapshot.records) {
      for (const licence of record.licences) {
        expect(regulatorCodes).toContain(licence.regulator);
      }
    }
  });

  it("company status maps into the schema enum (company_status)", () => {
    const enumValues = ["operating", "acquired", "merged", "shut-down", "unknown"];
    for (const record of snapshot.records) {
      expect(enumValues).toContain(mapCompanyStatus(record.company.status));
    }
    expect(mapCompanyStatus("Unicorn ~$7.5B (2021); acquired POP (2025)")).toBe("acquired");
    expect(mapCompanyStatus("~$109M (2023)")).toBe("operating");
    expect(mapCompanyStatus("merged with RenewBuy (2025)")).toBe("merged");
    expect(mapCompanyStatus("defunct since 2022")).toBe("shut-down");
  });

  it("every record carries category evidence with a source + confidence", () => {
    for (const record of snapshot.records) {
      const categoryEvidence = record.evidence.find((e) => e.fieldName === "category");
      expect(categoryEvidence).toBeDefined();
      expect(categoryEvidence?.sourceId).toBeTruthy();
      expect(["A", "B", "C", "D", "E"]).toContain(categoryEvidence?.confidence);
      expect(getSource(categoryEvidence!.sourceId).publisher).toBeTruthy();
    }
  });

  it("every licence record has regulator, label, confidence and a resolvable source", () => {
    for (const record of snapshot.records) {
      for (const licence of record.licences) {
        expect(licence.regulator).toMatch(/^(RBI|SEBI|IRDAI|NPCI|FIU|mixed)$/);
        expect(licence.label.length).toBeGreaterThan(0);
        expect(["A", "B", "C", "D", "E"]).toContain(licence.confidence);
        expect(licence.sourceId.length).toBeGreaterThan(0);
        expect(getSource(licence.sourceId)).toBeDefined();
        expect(licence.verifiedAt).toBe(RESEARCH_COMPILED_AT);
      }
    }
  });

  it("licence evidence rows mirror the licence records", () => {
    for (const record of snapshot.records) {
      const licenceEvidence = record.evidence.filter((e) => e.fieldName.startsWith("licence."));
      expect(licenceEvidence.length).toBe(record.licences.length);
    }
  });

  it("founded years parse to integers when present", () => {
    for (const record of snapshot.records) {
      const year = record.company.foundedYear;
      if (year !== undefined) {
        expect(Number.isInteger(year)).toBe(true);
        expect(year).toBeGreaterThan(1900);
        expect(year).toBeLessThan(2027);
      }
    }
  });

  it("funding is recorded with a source and confidence when parseable", () => {
    for (const record of snapshot.records) {
      for (const funding of record.funding) {
        expect(typeof funding.totalUsdM).toBe("number");
        expect(funding.confidence).toBe("D");
        expect(getSource(funding.sourceId)).toBeDefined();
      }
    }
  });

  it("research sources are registered exactly once", () => {
    const ids = SOURCES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SOURCES) {
      expect(getSource(s.id)).toBe(s);
    }
  });
});

describe("data platform — evidence model", () => {
  it("derives confidence A for regulator-cited licences", () => {
    expect(confidenceForLicence("PAYMENTS CLUSTER", "RBI PA-O CoA Feb 2025")).toBe("A");
    expect(confidenceForLicence("EXCHANGES & TRADING PLATFORMS", "SEBI licence")).toBe("A");
  });

  it("keeps secondary-only licences at D", () => {
    expect(confidenceForLicence("LENDING CLUSTER", "registered NBFC")).toBe("D");
  });

  it("reads licence status from text", () => {
    expect(licenceStatusFromText("RBI PA-O CoA Feb 2025 (No. 252/2025)")).toBe("authorised");
    expect(licenceStatusFromText("RBI PA-CB in-principle (Jul 2025)")).toBe("in-principle");
    expect(licenceStatusFromText("RBI application under process")).toBe("application");
    expect(licenceStatusFromText("n/a")).toBe("unknown");
  });

  it("regulator falls back to the cluster when not cited in the field", () => {
    expect(regulatorForLicence("PAYMENTS CLUSTER", "PA-O CoA")).toBe("RBI");
    expect(regulatorForLicence("WEALTHTECH / BROKERAGE", "SEBI RIA")).toBe("SEBI");
  });

  it("builds licence records with PA-CB checked before PA", () => {
    const records = buildLicenceRecords("razorpay", "PAYMENTS CLUSTER", "RBI PA-O + PA-CB-E&I (Dec 2025)");
    expect(records.map((r) => r.code)).toContain("PA");
    expect(records.map((r) => r.code)).toContain("PA-CB");
    for (const record of records) expect(record.confidence).toBe("A");
  });
});

describe("data platform — change engine", () => {
  it("event ids are deterministic", () => {
    expect(makeEventId(["a", "b"])).toBe(makeEventId(["a", "b"]));
    expect(makeEventId(["a", "b"])).not.toBe(makeEventId(["a", "c"]));
  });

  it("baseline establishes every licence as an event", () => {
    const events = baselineEvents(
      [{ companyId: "razorpay", companyName: "", code: "PA", status: "authorised", detectedOn: "2026-08-15" }],
      "2026-08-15",
    );
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("LICENSE_ADDED");
    expect(events[0].companyId).toBe("razorpay");
  });

  it("diff detects added, removed and status-changed licences", () => {
    const events = diffLicenceSnapshots(
      [
        { companyId: "cashfree", code: "PA", status: "authorised" },
        { companyId: "cashfree", code: "PA-CB", status: "authorised" },
      ],
      [
        { companyId: "cashfree", code: "PA", status: "authorised" },
        { companyId: "cashfree", code: "PA-CB", status: "in-principle" },
        { companyId: "eximpe", code: "PA-CB", status: "in-principle" },
      ],
      "2026-08-15",
    );
    const types = events.map((e) => e.type).sort();
    expect(types).toEqual(["LICENSE_ADDED", "REGULATORY_STATUS_CHANGED"]);
    const statusChange = events.find((e) => e.type === "REGULATORY_STATUS_CHANGED");
    expect(statusChange?.detail).toMatchObject({ code: "PA-CB", before: "authorised", after: "in-principle" });
  });

  it("removal is detected when a licence disappears", () => {
    const events = diffLicenceSnapshots(
      [{ companyId: "razorpay", code: "PA-P", status: "authorised" }],
      [],
      "2026-08-15",
    );
    expect(events[0].type).toBe("LICENSE_REMOVED");
  });
});

describe("data platform — directory import fidelity", () => {
  it("importDirectoryRecord maps research fields to canonical fields", () => {
    const record = importDirectoryRecord({
      slug: "razorpay",
      name: "Razorpay",
      category: "Payment gateway/aggregator",
      founded: "2014",
      hq: "Bengaluru",
      founders: "Harshil Mathur, Shashank Kumar",
      funding: "$741M",
      valuationOrStatus: "Unicorn",
      licences: "RBI PA-O + PA-CB-E&I (Dec 2025) + PA-P",
      website: "https://razorpay.com",
      description: "Full-stack payments platform",
      cluster: "PAYMENTS CLUSTER",
    });
    expect(record.company.foundedYear).toBe(2014);
    expect(record.company.website).toBe("razorpay.com");
    expect(record.categories[0].confidence).toBe("D");
    expect(record.licences.map((l) => l.code)).toContain("PA");
    expect(record.licences.map((l) => l.code)).toContain("PA-CB");
    expect(record.funding[0].totalUsdM).toBe(741);
  });
});