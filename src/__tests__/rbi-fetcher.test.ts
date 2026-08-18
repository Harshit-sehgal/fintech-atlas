import { describe, expect, it } from "vitest";
import {
  buildSnapshot,
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
});