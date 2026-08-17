import { describe, expect, it } from "vitest";
import type { Company } from "./types";
import { buildSections, digestForCompany, matchesFocus, nameForCompanyId, renderDigest } from "./digest";
import type { RadarEvent } from "./events";

const companies: Company[] = [
  {
    id: "razorpay",
    legalName: "Razorpay",
    displayName: "Razorpay",
    cluster: "PAYMENTS CLUSTER",
    category: "Payment gateway",
    valuationOrStatus: "Unicorn",
    status: "Unicorn",
  },
  {
    id: "eximpe",
    legalName: "EximPe",
    displayName: "EximPe",
    cluster: "CROSS-BORDER",
    category: "Cross-border trade",
    valuationOrStatus: "Private",
    status: "Private",
  },
];

const events: RadarEvent[] = [
  {
    id: "e1",
    type: "LICENSE_ADDED",
    companyId: "razorpay",
    happenedOn: "2026-08-15",
    detectedOn: "2026-08-15",
    detail: { code: "PA", status: "authorised" },
  },
  {
    id: "e2",
    type: "LICENSE_ADDED",
    companyId: "eximpe",
    happenedOn: "2026-08-15",
    detectedOn: "2026-08-15",
    detail: { code: "PA-CB", status: "in-principle" },
  },
];

describe("weekly digest", () => {
  it("resolves company ids to display names", () => {
    expect(nameForCompanyId("razorpay", companies)).toBe("Razorpay");
    expect(nameForCompanyId("unknown", companies)).toBe("unknown");
  });

  it("focus filters events by licence code", () => {
    expect(matchesFocus(events[0], { licences: ["PA"] })).toBe(true);
    expect(matchesFocus(events[1], { licences: ["PA"] })).toBe(false);
  });

  it("buildSections groups events by type in canonical order", () => {
    const sections = buildSections(events, companies);
    expect(sections).toHaveLength(1);
    expect(sections[0].type).toBe("LICENSE_ADDED");
    expect(sections[0].entries).toHaveLength(2);
    expect(sections[0].entries[0].companyName).toBe("Razorpay");
  });

  it("renderDigest produces markdown with counts and sections", () => {
    const body = renderDigest({
      title: "Radar weekly",
      weekLabel: "test week",
      generatedAt: "2026-08-18",
      events,
      companies,
    });
    expect(body).toContain("# Radar weekly");
    expect(body).toContain("**2 changes recorded.**");
    expect(body).toContain("## New licences");
    expect(body).toContain("- Razorpay — licence PA, status authorised, on 2026-08-15");
  });

  it("digestForCompany isolates one company's events", () => {
    const body = digestForCompany({ company: companies[0], categories: [], licences: [], funding: [], evidence: [] }, events);
    expect(body).toContain("# Razorpay — Radar digest");
    expect(body).not.toContain("EximPe");
  });
});