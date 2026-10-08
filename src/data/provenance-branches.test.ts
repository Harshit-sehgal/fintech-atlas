import { describe, expect, it } from "vitest";
import { companies } from "./companies";
import { validateCompanyProvenance } from "./provenance";
import type { Company, SourceReference } from "./types";

const source: SourceReference = {
  id: "src-1",
  publisher: "Publisher",
  title: "Title",
  url: "https://example.com",
  accessedAt: "2026-08-03",
  sourceType: "official-documentation",
  supports: ["employees"],
};

const base: Company = {
  ...companies[0],
  sourceReferences: [source],
  employeesSourced: { value: "10", asOf: "2026-07-31", sourceIds: ["src-1"] },
  availability: { ...companies[0].availability!, sourceIds: ["src-1"] },
};

describe("validateCompanyProvenance edge cases", () => {
  it("flags empty id, publisher and title", () => {
    const issues = validateCompanyProvenance({
      ...base,
      sourceReferences: [{ ...source, id: "  ", publisher: "", title: "" }],
    });
    expect(issues).toContain("sourceReferences[0].id is required");
    expect(issues).toContain("sourceReferences[0].publisher is required");
    expect(issues).toContain("sourceReferences[0].title is required");
  });

  it("flags empty and unknown supports entries", () => {
    const issues = validateCompanyProvenance({
      ...base,
      sourceReferences: [{ ...source, supports: ["", "not-a-field"] }],
    });
    expect(issues.some((i) => i.includes("at least one non-empty field"))).toBe(true);
    expect(issues.some((i) => i.includes("unknown field"))).toBe(true);
  });

  it("flags a duplicate source id", () => {
    const issues = validateCompanyProvenance({
      ...base,
      sourceReferences: [source, { ...source }],
    });
    expect(issues).toContain("duplicate source id: src-1");
  });

  it("flags a missing availability block", () => {
    const issues = validateCompanyProvenance({ ...base, availability: undefined });
    expect(issues).toContain("availability is required for published companies");
  });

  it("flags malformed availability fields", () => {
    const issues = validateCompanyProvenance({
      ...base,
      availability: {
        ...base.availability!,
        supportedRegions: [],
        unavailableRegions: [" "],
        asOf: "sometime",
        sourceIds: ["ghost"],
      },
    });
    expect(issues).toContain("availability.supportedRegions must not be empty");
    expect(issues).toContain("availability.unavailableRegions must not contain empty regions");
    expect(issues).toContain("availability.asOf must be an ISO date or quarter");
    expect(issues).toContain("availability references unknown source id: ghost");
  });

  it("flags an empty availability sourceIds list", () => {
    const issues = validateCompanyProvenance({
      ...base,
      availability: { ...base.availability!, sourceIds: [] },
    });
    expect(issues).toContain("availability.sourceIds must not be empty");
  });

  it("validates employeesSourced and financialValue sourced values", () => {
    const issues = validateCompanyProvenance({
      ...base,
      employeesSourced: { value: "10", asOf: "nope", sourceIds: [] },
      financialValue: { ...base.financialValue, asOf: "nope", sourceIds: ["ghost"] } as never,
    });
    expect(issues.some((i) => i.startsWith("employeesSourced.asOf"))).toBe(true);
    expect(issues.some((i) => i.startsWith("employeesSourced.sourceIds"))).toBe(true);
    expect(issues.some((i) => i.startsWith("financialValue"))).toBe(true);
  });
});
