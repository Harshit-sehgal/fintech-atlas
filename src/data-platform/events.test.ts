import { describe, expect, it } from "vitest";
import {
  baselineEvents,
  diffLicenceSnapshots,
  makeEventId,
  type LicenceKey,
} from "./events";

describe("makeEventId", () => {
  it("is deterministic and 12 hex characters", () => {
    const a = makeEventId(["LICENSE_ADDED", "acme", "RBI"]);
    const b = makeEventId(["LICENSE_ADDED", "acme", "RBI"]);
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{12}$/);
  });

  it("handles undefined parts and distinguishes different inputs", () => {
    expect(makeEventId([undefined, "x"])).toMatch(/^[0-9a-f]{12}$/);
    expect(makeEventId(["a"])).not.toBe(makeEventId(["b"]));
  });
});

describe("baselineEvents", () => {
  it("uses the company id when present, else the name", () => {
    const [withId] = baselineEvents(
      [{ companyId: "c1", companyName: "Acme", code: "RBI", status: "authorised", detectedOn: "2026-01-01" }],
      "2026-01-01",
    );
    expect(withId.companyId).toBe("c1");
    expect(withId.companyName).toBeUndefined();

    const [withName] = baselineEvents(
      [{ companyName: "Acme", code: "RBI", status: "authorised", detectedOn: "2026-01-01" }],
      "2026-01-01",
    );
    expect(withName.companyId).toBeUndefined();
    expect(withName.companyName).toBe("Acme");
  });

  it("prefers an explicit effective date and falls back to detectedOn", () => {
    const [dated] = baselineEvents(
      [{ companyName: "Acme", code: "RBI", status: "authorised", effectiveDate: "2020-05-05", detectedOn: "2026-01-01" }],
      "2026-01-01",
    );
    expect(dated.happenedOn).toBe("2020-05-05");
  });
});

describe("diffLicenceSnapshots", () => {
  const before: LicenceKey[] = [
    { companyId: "c1", code: "RBI", status: "authorised" },
    { companyId: "c2", code: "SEBI", status: "authorised" },
  ];

  it("emits LICENSE_REMOVED for a licence that disappeared", () => {
    const events = diffLicenceSnapshots(before, [{ companyId: "c1", code: "RBI", status: "authorised" }], "2026-02-02");
    expect(events.map((e) => e.type)).toContain("LICENSE_REMOVED");
  });

  it("emits REGULATORY_STATUS_CHANGED when a status moves", () => {
    const after: LicenceKey[] = [
      { companyId: "c1", code: "RBI", status: "in-principle" },
      { companyId: "c2", code: "SEBI", status: "authorised" },
    ];
    const events = diffLicenceSnapshots(before, after, "2026-02-02");
    expect(events.some((e) => e.type === "REGULATORY_STATUS_CHANGED")).toBe(true);
  });

  it("emits LICENSE_ADDED with an effective-date fallback", () => {
    const after: LicenceKey[] = [
      { companyId: "c1", code: "RBI", status: "authorised" },
      { companyId: "c2", code: "SEBI", status: "authorised" },
      { companyName: "Zed", code: "IRDAI", status: "authorised", effectiveDate: "2026-01-15" },
    ];
    const events = diffLicenceSnapshots(before, after, "2026-02-02");
    const added = events.find((e) => e.type === "LICENSE_ADDED")!;
    expect(added.happenedOn).toBe("2026-01-15");
    expect(added.companyName).toBe("Zed");
  });
});
