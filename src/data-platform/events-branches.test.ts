import { describe, expect, it } from "vitest";
import { baselineEvents, diffLicenceSnapshots } from "./events";

describe("baselineEvents detectedOn + name-only entries", () => {
  it("prefers an explicit detectedOn and a name when there is no id", () => {
    const [event] = baselineEvents(
      [{ companyName: "Only Name", code: "PA", status: "authorised", detectedOn: "2026-03-03" }],
      "2026-01-01",
    );
    expect(event.detectedOn).toBe("2026-03-03");
    expect(event.companyName).toBe("Only Name");
    expect(event.companyId).toBeUndefined();
  });
});

describe("diffLicenceSnapshots name-only entries", () => {
  it("emits removed and status-changed events using the company name", () => {
    const before = [{ companyName: "A", code: "PA", status: "authorised" as const }];

    const removed = diffLicenceSnapshots(before, [], "2026-02-02");
    expect(removed[0].type).toBe("LICENSE_REMOVED");
    expect(removed[0].companyName).toBe("A");
    expect(removed[0].companyId).toBeUndefined();

    const changed = diffLicenceSnapshots(
      before,
      [{ companyName: "A", code: "PA", status: "in-principle" as const }],
      "2026-02-02",
    );
    expect(changed[0].type).toBe("REGULATORY_STATUS_CHANGED");
    expect(changed[0].companyName).toBe("A");
  });
});
