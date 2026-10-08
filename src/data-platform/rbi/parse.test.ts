import { describe, expect, it } from "vitest";
import { parseRbiSnapshot } from "./parse";

describe("parseRbiSnapshot", () => {
  it("parses meta and table rows", () => {
    const md = [
      "# title",
      "- Regulator: RBI",
      "- Source: https://rbi.org.in",
      "- Fetched: 2026-08-15",
      "",
      "| Company | Licence | Status | Effective | Notes |",
      "| --- | --- | --- | --- | --- |",
      "| Acme | PA | authorised | 2025-12 | fine |",
    ].join("\n");
    const snap = parseRbiSnapshot(md, "v1");
    expect(snap.regulator).toBe("RBI");
    expect(snap.sourceUrl).toBe("https://rbi.org.in");
    expect(snap.fetchedOn).toBe("2026-08-15");
    expect(snap.entries[0]).toEqual({
      companyName: "Acme",
      code: "PA",
      status: "authorised",
      effectiveDate: "2025-12",
      notes: "fine",
    });
  });

  it("falls back to unknown/empty meta when absent", () => {
    const snap = parseRbiSnapshot("no meta here", "v2");
    expect(snap.regulator).toBe("unknown");
    expect(snap.sourceUrl).toBe("");
    expect(snap.fetchedOn).toBe("");
    expect(snap.entries).toEqual([]);
  });

  it("defaults missing/invalid status and omits empty effective/notes", () => {
    const md = [
      "| Company | Licence | Status | Effective | Notes |",
      "| --- | --- | --- | --- | --- |",
      "| Bare | PA | bogus |  |  |",
      "| Two | PA-CB |",
      "|onlyone|",
    ].join("\n");
    const snap = parseRbiSnapshot(md, "v3");
    expect(snap.entries[0]).toEqual({
      companyName: "Bare",
      code: "PA",
      status: "unknown",
      effectiveDate: undefined,
      notes: undefined,
    });
    expect(snap.entries[1].status).toBe("unknown");
    expect(snap.entries).toHaveLength(2);
  });
});
