import { describe, expect, it } from "vitest";
import { companies } from "./companies";
import { validateCompanyProvenance } from "./provenance";
import type { Company } from "./types";

const baseCompany: Company = {
  ...companies[0],
  sourceReferences: [
    {
      id: "official-profile",
      publisher: "Example publisher",
      title: "Official company profile",
      url: "https://example.com/profile",
      accessedAt: "2026-08-03",
      effectiveAt: "2026-07-31",
      sourceType: "official-documentation",
      supports: ["employees"],
    },
  ],
  employeesSourced: {
    value: "1000",
    asOf: "2026-07-31",
    sourceIds: ["official-profile"],
  },
};

describe("company provenance", () => {
  it("accepts a complete structured evidence record", () => {
    expect(validateCompanyProvenance(baseCompany)).toEqual([]);
  });

  it("rejects malformed dates, URLs, and source links", () => {
    const invalid: Company = {
      ...baseCompany,
      sourceReferences: [
        {
          ...baseCompany.sourceReferences![0],
          supports: ["unknown-field"],
          url: "not-a-url",
          accessedAt: "August 3, 2026",
          effectiveAt: "2026-99-99",
        },
      ],
      employeesSourced: {
        ...baseCompany.employeesSourced!,
        sourceIds: ["missing-source"],
      },
    };

    expect(validateCompanyProvenance(invalid)).toEqual([
      "sourceReferences[0].accessedAt must be an ISO date",
      "sourceReferences[0].effectiveAt must be an ISO date when provided",
      "sourceReferences[0].url must be an absolute http(s) URL when provided",
      "sourceReferences[0].supports contains unknown field: unknown-field",
      "employeesSourced references unknown source id: missing-source",
    ]);
  });

  it("allows legacy source labels while migration is in progress", () => {
    const legacy = companies.find((company) => !company.sourceReferences?.length);
    expect(legacy).toBeDefined();
    expect(validateCompanyProvenance(legacy!)).toEqual([]);
  });
});
