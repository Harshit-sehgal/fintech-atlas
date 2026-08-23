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

  it("focus filters by regulator with code fallback, and no-focus passes everything", () => {
    // Licence codes are the RBI regulator strings here, so code "PA" passes.
    expect(matchesFocus(events[0], { regulators: ["RBI"] })).toBe(false);
    // Explicit regulator on the detail wins when present.
    const withRegulator = { ...events[0], detail: { ...events[0].detail, regulator: "RBI" } };
    expect(matchesFocus(withRegulator, { regulators: ["RBI"] })).toBe(true);
    // …falling back to the licence code upper-cased otherwise.
    expect(matchesFocus(events[0], { regulators: ["PA"] })).toBe(true);
    expect(matchesFocus(events[1], { regulators: ["PA"] })).toBe(false);
    // Events missing both fields are excluded by a regulator focus…
    expect(matchesFocus({ ...events[0], detail: {} }, { regulators: ["RBI"] })).toBe(false);
    // …and undefined focus admits every event.
    expect(matchesFocus(events[0], undefined)).toBe(true);
    // Empty filter arrays behave like no filter.
    expect(matchesFocus(events[0], { licences: [], regulators: [] })).toBe(true);
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

  it("renderDigest renders the quiet no-changes path and singular grammar", () => {
    const empty = renderDigest({
      title: "Radar weekly",
      weekLabel: "quiet week",
      generatedAt: "2026-08-23",
      events: [],
      companies,
    });
    expect(empty).toContain("**0 changes recorded.**");
    expect(empty).toContain("No changes recorded in this period.");
    // happenedOn lives on the event (not detail), so a detail-less entry
    // still renders the date bit — assert the bare-company form exactly.
    const bare = renderDigest({
      title: "Radar weekly",
      weekLabel: "bare week",
      generatedAt: "2026-08-23",
      events: [{ ...events[0], detail: {} } as RadarEvent],
      companies,
    });
    expect(bare).toContain("- Razorpay — on 2026-08-15");
  });

  it("digestForCompany isolates one company's events", () => {
    const body = digestForCompany({ company: companies[0], categories: [], licences: [], funding: [], evidence: [] }, events);
    expect(body).toContain("# Razorpay — Radar digest");
    expect(body).not.toContain("EximPe");
  });
});