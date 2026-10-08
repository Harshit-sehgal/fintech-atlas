import { describe, expect, it } from "vitest";
import {
  buildSections,
  digestForCompany,
  matchesFocus,
  nameForCompanyId,
  renderDigest,
} from "./digest";
import type { Company, CompanyRecord } from "./types";
import type { RadarEvent } from "./events";

const companies = [{ id: "c1", displayName: "Acme" }] as unknown as Company[];
const ev = (over: Partial<RadarEvent> = {}): RadarEvent => ({
  id: "e1",
  type: "LICENSE_ADDED",
  companyId: "c1",
  happenedOn: "2026-01-01",
  detectedOn: "2026-01-01",
  detail: { code: "RBI", status: "active" },
  ...over,
});

describe("nameForCompanyId", () => {
  it("resolves a known id and falls back to the raw id", () => {
    expect(nameForCompanyId("c1", companies)).toBe("Acme");
    expect(nameForCompanyId("missing", companies)).toBe("missing");
  });
});

describe("matchesFocus", () => {
  it("matches everything when no focus is given", () => {
    expect(matchesFocus(ev())).toBe(true);
  });

  it("filters by licence code", () => {
    expect(matchesFocus(ev(), { licences: ["RBI"] })).toBe(true);
    expect(matchesFocus(ev(), { licences: ["SEBI"] })).toBe(false);
  });

  it("filters by regulator using the regulator field or the code fallback", () => {
    expect(matchesFocus(ev({ detail: { code: "RBI", regulator: "rbi" } }), { regulators: ["RBI"] })).toBe(true);
    expect(matchesFocus(ev({ detail: {} }), { regulators: ["RBI"] })).toBe(false);
    expect(matchesFocus(ev({ detail: {} }), { regulators: [""] })).toBe(true);
  });
});

describe("buildSections", () => {
  it("orders known sections and skips unknown event types", () => {
    const sections = buildSections(
      [ev({ id: "a", type: "LICENSE_REMOVED" }), ev({ id: "b", type: "LICENSE_ADDED" })],
      companies,
    );
    expect(sections[0].type).toBe("LICENSE_ADDED");
    expect(sections[1].type).toBe("LICENSE_REMOVED");
  });

  it("falls back to an Unknown company name and omits code/status", () => {
    const weird = ev({ companyId: undefined, companyName: undefined, detail: {} });
    const [section] = buildSections([weird], companies);
    expect(section.label).toBe("New licences");
    expect(section.entries[0].companyName).toBe("Unknown company");
    expect(section.entries[0].code).toBeUndefined();
    expect(section.entries[0].status).toBeUndefined();
  });
});

describe("renderDigest", () => {
  const base = { title: "Digest", weekLabel: "wk", generatedAt: "2026-01-02", companies };

  it("renders the empty-period notice", () => {
    expect(renderDigest({ ...base, events: [] })).toContain("No changes recorded in this period.");
  });

  it("singularises a single change and renders entry detail bits", () => {
    const md = renderDigest({ ...base, events: [ev()] });
    expect(md).toContain("**1 change recorded.**");
    expect(md).toContain("licence RBI");
    expect(md).toContain("status active");
  });

  it("pluralises multiple changes and omits detail bits when absent", () => {
    const bare = ev({ id: "e2", happenedOn: "", detail: {} });
    const md = renderDigest({ ...base, events: [ev(), bare] });
    expect(md).toContain("**2 changes recorded.**");
    expect(md).toContain("- Acme");
  });
});

describe("digestForCompany", () => {
  it("includes only that company's events", () => {
    const record = { company: { id: "c1", displayName: "Acme" } } as unknown as CompanyRecord;
    const md = digestForCompany(record, [ev(), ev({ id: "e2", companyId: "other" })]);
    expect(md).toContain("Acme — Radar digest");
    expect(md).toContain("**1 change recorded.**");
  });
});
