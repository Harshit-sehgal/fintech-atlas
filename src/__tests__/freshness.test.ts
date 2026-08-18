import { describe, expect, it } from "vitest";
import {
  DEFAULT_FRESHNESS_POLICY,
  daysBetween,
  evidenceFamily,
  FIELD_FRESHNESS_POLICIES,
  freshnessStateForAge,
  policyForFamily,
  recordFreshness,
  snapshotFreshnessStats,
} from "@/data-platform/freshness";
import type { CompanyRecord, DataPlatformSnapshot } from "@/data-platform/types";

const AS_OF = "2026-08-18";

function makeRecord(evidence: CompanyRecord["evidence"], id = "acme"): CompanyRecord {
  return {
    company: {
      id,
      legalName: "Acme Payments",
      displayName: "Acme Payments",
      cluster: "PAYMENT AGGREGATORS (PA-O / PA-P / PA-CB)",
      category: "Payment aggregator",
      valuationOrStatus: "Private",
      status: "Private",
    },
    categories: [],
    licences: [],
    funding: [],
    evidence,
  };
}

function ev(fieldName: string, verifiedAt: string): CompanyRecord["evidence"][number] {
  return {
    companyId: "acme",
    fieldName,
    value: "x",
    sourceId: "research-directory",
    confidence: "D",
    verifiedAt,
  };
}

describe("freshness policies", () => {
  it("maps licence evidence rows to the regulatory policy family", () => {
    expect(evidenceFamily("licence.PA")).toBe("licence");
    expect(evidenceFamily("licence.PA-CB")).toBe("licence");
    expect(evidenceFamily("fundingUsdM")).toBe("fundingUsdM");
  });

  it("grades every field family with a policy", () => {
    expect(policyForFamily("licence").priority).toBe("high");
    expect(policyForFamily("licence").maxAgeDays).toBe(30);
    expect(policyForFamily("fundingUsdM").priority).toBe("medium");
    expect(policyForFamily("foundedYear").priority).toBe("very-low");
    expect(policyForFamily("unknownFamily")).toBe(DEFAULT_FRESHNESS_POLICY);
  });

  it("sorts families present in FIELD_FRESHNESS_POLICIES", () => {
    expect(Object.keys(FIELD_FRESHNESS_POLICIES).sort()).toEqual([
      "category",
      "foundedYear",
      "fundingUsdM",
      "licence",
      "website",
    ]);
  });
});

describe("freshness grading math", () => {
  it("computes fractional day ages between ISO dates", () => {
    expect(daysBetween("2026-08-15", "2026-08-18")).toBeCloseTo(3, 5);
    expect(daysBetween("2026-01-01", "2026-01-01")).toBe(0);
  });

  it("buckets ages into fresh / due / stale against the policy window", () => {
    expect(freshnessStateForAge(10, 30)).toBe("fresh");
    expect(freshnessStateForAge(30, 30)).toBe("fresh");
    expect(freshnessStateForAge(45, 30)).toBe("due");
    expect(freshnessStateForAge(60, 30)).toBe("due");
    expect(freshnessStateForAge(61, 30)).toBe("stale");
  });
});

describe("recordFreshness", () => {
  it("grades each evidence family present and flags the overall state", () => {
    const record = makeRecord([
      ev("licence.PA", "2026-08-15"),
      ev("licence.PA-CB", "2026-08-15"),
      ev("fundingUsdM", "2026-05-01"),
      ev("foundedYear", "2026-01-01"),
    ]);

    const summary = recordFreshness(record, AS_OF);

    const licence = summary.fields.find((f) => f.family === "licence")!;
    expect(licence.state).toBe("fresh");
    expect(licence.priority).toBe("high");

    const funding = summary.fields.find((f) => f.family === "fundingUsdM")!;
    expect(funding.state).toBe("due"); // ~109 days > 90 window

    const founded = summary.fields.find((f) => f.family === "foundedYear")!;
    expect(founded.state).toBe("fresh"); // ~229 days < 365 window
    expect(summary.overallState).toBe("due");
    expect(summary.needsVerification.map((f) => f.family)).toEqual(["fundingUsdM"]);
  });

  it("uses the oldest verification within a family (conservative)", () => {
    const record = makeRecord([
      ev("licence.PA", "2026-08-15"),
      ev("licence.PA-CB", "2026-01-01"),
    ]);
    const summary = recordFreshness(record, AS_OF);
    const licence = summary.fields.find((f) => f.family === "licence")!;
    expect(licence.verifiedAt).toBe("2026-01-01");
    expect(licence.ageDays).toBeGreaterThan(30 * 2);
    expect(licence.state).toBe("stale");
  });

  it("reports fresh when no verification is needed", () => {
    const record = makeRecord([ev("category", "2026-08-16")]);
    const summary = recordFreshness(record, AS_OF);
    expect(summary.overallState).toBe("fresh");
    expect(summary.needsVerification).toEqual([]);
  });
});

describe("snapshotFreshnessStats", () => {
  function snapshotWith(records: CompanyRecord[]): DataPlatformSnapshot {
    return {
      generatedAt: AS_OF,
      researchCompiledAt: AS_OF,
      sources: [],
      records,
    };
  }

  it("counts fresh/due/stale companies across the snapshot", () => {
    const snapshot = snapshotWith([
      makeRecord([ev("category", "2026-08-16")], "a"),
      makeRecord([ev("fundingUsdM", "2026-05-01")], "b"),
      makeRecord([ev("licence.PA", "2026-01-01")], "c"),
    ]);

    const stats = snapshotFreshnessStats(snapshot, AS_OF);
    expect(stats.companies).toBe(3);
    expect(stats.fresh).toBe(1);
    expect(stats.due).toBe(1);
    expect(stats.stale).toBe(1);
    expect(stats.freshPct).toBe(33);
    expect(stats.stalest[0].companyId).toBe("c");
  });

  it("handles an empty snapshot without dividing by zero", () => {
    const stats = snapshotFreshnessStats(snapshotWith([]), AS_OF);
    expect(stats.companies).toBe(0);
    expect(stats.freshPct).toBe(0);
    expect(stats.stalest).toEqual([]);
  });
});