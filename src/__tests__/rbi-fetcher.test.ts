import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildSnapshot,
  extractAsOn,
  parseLiveRbiTables,
  renderSnapshotMarkdown,
} from "../../scripts/fetch-rbi-pa";

const sample = `
<table>
<tr><td>Table A: Existing PAs-O which can operate as Payment Aggregator- Online</td></tr>
<tr><td>Sr No.</td><td>Name of the entity</td><td>Remarks</td></tr>
<tr><td>1.</td><td>Mpurse Services Private Limited</td><td>In-Principle Authorisation Granted</td></tr>
<tr><td>2.</td><td>Global Payments Asia-Pacific (India) Private Limited *</td><td>Application Under Process</td></tr>
</table>
<table>
<tr><td>Table D: Existing PAs-CB which can operate as Payment Aggregator- Cross Border</td></tr>
<tr><td>Sr No.</td><td>Name of the entity</td><td>Remarks</td></tr>
<tr><td>1.</td><td>PayPal Payments Private Limited</td><td>Certificate of Authorisation granted</td></tr>
</table>
<table>
<tr><td>Table C: PA-Online – Applications returned / withdrawn – Cannot operate</td></tr>
<tr><td>Sr No.</td><td>Name of the entity</td><td>Remarks</td></tr>
<tr><td>1.</td><td>Some Returned Entity Private Limited</td><td>Application returned on 14.05.2026</td></tr>
</table>
`;

describe("RBI live PA fetcher", () => {
  it("parses tracked tables A–H and skips returned/withdrawn tables", () => {
    const parsed = parseLiveRbiTables(sample);
    expect(parsed.A).toHaveLength(2);
    expect(parsed.D).toHaveLength(1);
    expect(parsed.C).toEqual([]);
    expect(parsed.A?.[0].name).toBe("Mpurse Services Private Limited");
  });

  it("maps in-principle to in-principle, not authorised", () => {
    const parsed = parseLiveRbiTables(sample);
    const { entries } = buildSnapshot(parsed);
    const mpurse = entries.find((e) => e.companyName.includes("Mpurse"));
    expect(mpurse?.status).toBe("in-principle");
    expect(mpurse?.code).toBe("PA");
  });

  it("maps certificate of authorisation to authorised and PA-CB table to PA-CB", () => {
    const parsed = parseLiveRbiTables(sample);
    const { entries } = buildSnapshot(parsed);
    const paypal = entries.find((e) => e.companyName.includes("PayPal"));
    expect(paypal?.status).toBe("authorised");
    expect(paypal?.code).toBe("PA-CB");
  });

  it("drops footnote markers from names", () => {
    const parsed = parseLiveRbiTables(sample);
    expect(parsed.A?.[1].name).toBe("Global Payments Asia-Pacific (India) Private Limited");
  });

  it("renders markdown round-trippable through parseRbiSnapshot format", () => {
    const parsed = parseLiveRbiTables(sample);
    const { entries } = buildSnapshot(parsed);
    const md = renderSnapshotMarkdown(
      "payment-aggregators-live-2026-08-18",
      "https://example.in",
      "2026-08-18",
      entries,
    );
    expect(md).toContain("- Regulator: RBI");
    expect(md).toContain("| Mpurse Services Private Limited | PA | in-principle |");
    expect(md).toContain("| PayPal Payments Private Limited | PA-CB | authorised |");
  });

  it("regression: parses the real RBI page structure (th colspan=3 captions, &nbsp; spacers, footnote markers) into the full 36-entry feed", () => {
    const html = readFileSync(resolve(__dirname, "fixtures/rbi-pss-page.html"), "utf8");
    const parsed = parseLiveRbiTables(html);
    expect(parsed.A).toHaveLength(5);
    expect(parsed.B).toHaveLength(13);
    expect(parsed.D).toHaveLength(3);
    expect(parsed.E).toHaveLength(5);
    expect(parsed.G).toHaveLength(9);
    expect(parsed.H).toHaveLength(1);
    expect(parsed.C).toEqual([]);
    expect(parsed.F).toEqual([]);
    expect(parsed.I).toEqual([]);

    const { entries } = buildSnapshot(parsed);
    expect(entries).toHaveLength(36);
    expect(entries.filter((e) => e.code === "PA")).toHaveLength(18);
    expect(entries.filter((e) => e.code === "PA-CB")).toHaveLength(8);
    expect(entries.filter((e) => e.code === "PA-P")).toHaveLength(10);
    expect(entries.filter((e) => e.status === "in-principle")).toHaveLength(16);
    expect(entries.filter((e) => e.status === "application")).toHaveLength(20);

    const freecharge = entries.find((e) => e.companyName.includes("Freecharge"));
    expect(freecharge?.status).toBe("in-principle");
    const navi = entries.find((e) => e.companyName.includes("Navi"));
    expect(navi?.status).toBe("in-principle");
    const otropay = entries.find((e) => e.companyName.includes("Otropay"));
    expect(otropay?.status).toBe("application");
    const mk = entries.find((e) => e.companyName.includes("MobiKwik"));
    expect(mk?.code).toBe("PA-P");
    expect(mk?.status).toBe("in-principle");
    expect(entries.find((e) => e.companyName.includes("Global Payments"))?.notes).toContain("Table A");
  });

  it("extracts the RBI statement date for provenance", () => {
    const html = readFileSync(resolve(__dirname, "fixtures/rbi-pss-page.html"), "utf8");
    expect(extractAsOn(html)).toBe("16.08.2026");
    expect(extractAsOn("<html>no date</html>")).toBeUndefined();
  });
});