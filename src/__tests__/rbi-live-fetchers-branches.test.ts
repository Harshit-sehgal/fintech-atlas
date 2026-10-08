import { describe, expect, it, vi } from "vitest";
import {
  parseCoaPaymentAggregators,
  filterPaRows,
  renderCoaMarkdown,
  runRbiCoaFetch,
} from "../../scripts/fetch-rbi-coa";
import {
  parseLiveRbiTables,
  buildSnapshot,
  extractAsOn,
  renderSnapshotMarkdown,
  runRbiPaFetch,
} from "../../scripts/fetch-rbi-pa";
import {
  EXPECTED_CURRENCIES,
  applyRatesToConfig,
  extractStoredRates,
  formatRate,
  implausibleMoves,
  parseRatesResponse,
  runRatesFetch,
} from "../../scripts/fetch-rates";

const resp = (body: string, ok = true, status = 200): Response =>
  ({ ok, status, text: async () => body }) as unknown as Response;

const PA_HTML = `
<table>
<tr><td>Table A: Existing PAs-O which can operate</td></tr>
<tr><td>Sr No.</td><td>Name of the entity</td><td>Remarks</td></tr>
<tr><td>1.</td><td>Mpurse Services Private Limited</td><td>In-Principle Authorisation Granted</td></tr>
<tr><td>2.</td><td>Acme *#</td><td>Certificate of Authorisation granted</td></tr>
</table>`;

describe("RBI PA parser + live fetch", () => {
  it("parses rows, strips markers and extracts the as-on date", () => {
    const parsed = parseLiveRbiTables(PA_HTML);
    expect(parsed.A).toHaveLength(2);
    expect(parsed.A?.[1].name).toBe("Acme");
    expect(extractAsOn("As on 16.08.2026")).toBe("16.08.2026");
    expect(buildSnapshot(parsed).entries).toHaveLength(2);
  });

  it("handles tables with no label, no cells and an empty name", () => {
    const html = [
      "<table><tr><td>no label here</td></tr></table>",
      "<table><tr><td>Table B: new</td></tr><tr></tr><tr><td>1.</td><td>**</td><td>In-Principle</td></tr></table>",
    ].join("");
    const parsed = parseLiveRbiTables(html);
    // Table B row has a marker-only name → dropped
    expect(parsed.B ?? []).toHaveLength(0);
  });

  it("runs the happy path with injected IO", async () => {
    const writeFile = vi.fn();
    const result = await runRbiPaFetch({
      fetchFn: vi.fn().mockResolvedValue(resp(PA_HTML)),
      writeFile,
      now: () => new Date("2026-10-08T00:00:00Z"),
    });
    expect(result.entries.length).toBe(2);
    expect(writeFile).toHaveBeenCalledOnce();
  });

  it("throws on HTTP failure, empty tables and zero trackable entries", async () => {
    await expect(
      runRbiPaFetch({ fetchFn: vi.fn().mockResolvedValue(resp("", false, 500)) }),
    ).rejects.toThrow(/HTTP 500/);
    await expect(
      runRbiPaFetch({ fetchFn: vi.fn().mockResolvedValue(resp("<html>nothing</html>")) }),
    ).rejects.toThrow(/No PA tables/);
    await expect(
      runRbiPaFetch({
        fetchFn: vi
          .fn()
          .mockResolvedValue(resp("<table><tr><td>Table A: x</td></tr><tr><td>1.</td><td>Acme</td><td>whatever</td></tr></table>")),
      }),
    ).rejects.toThrow(/No trackable/);
  });

  it("renders markdown with the optional as-on line", () => {
    const md = renderSnapshotMarkdown(
      "snap",
      "https://x.test",
      "2026-10-08",
      [{ companyName: "Acme", code: "PA", status: "authorised", effectiveDate: "2020-01-01", notes: "n" }],
      "16.08.2026",
    );
    expect(md).toContain("- As on: 16.08.2026");
    expect(md).toContain("| Acme | PA | authorised | 2020-01-01 | n |");
  });
});

describe("RBI CoA parser + live fetch", () => {
  const COA_HTML =
    '<table><tr><td>Payment Aggregators (PA-O, PA-P &amp; PA-CB)</td></tr>' +
    '<tr><td>1.</td><td>Acme PA</td><td>x</td><td>PA-CB</td><td>01.01.2020</td></tr>' +
    '<tr><td>PA-P</td><td>extra</td></tr></table>';

  it("parses PA holders, continues rowspan systems and keeps only PA lines", () => {
    const rows = filterPaRows(parseCoaPaymentAggregators(COA_HTML));
    expect(rows).toHaveLength(1);
    expect(rows[0].systems).toContain("PA-CB");
    expect(renderCoaMarkdown("s", "u", "2026-10-08", rows)).toContain("| Acme PA | PA-CB |");
  });

  it("returns [] when the section or table is absent", () => {
    expect(parseCoaPaymentAggregators("<html>no section</html>")).toEqual([]);
    expect(parseCoaPaymentAggregators("<table><tr><td>x</td></tr></table>Payment Aggregators")).toEqual([]);
  });

  it("runs the happy path and rejects HTTP failures / empty extractions", async () => {
    const writeFile = vi.fn();
    const result = await runRbiCoaFetch({
      fetchFn: vi.fn().mockResolvedValue(resp(COA_HTML)),
      writeFile,
    });
    expect(result.rows).toHaveLength(1);
    expect(writeFile).toHaveBeenCalledOnce();

    await expect(
      runRbiCoaFetch({ fetchFn: vi.fn().mockResolvedValue(resp("", false, 502)) }),
    ).rejects.toThrow(/HTTP 502/);
    await expect(
      runRbiCoaFetch({ fetchFn: vi.fn().mockResolvedValue(resp("<html>nope</html>")) }),
    ).rejects.toThrow(/No PA CoA holders/);
  });
});

describe("rates fetch", () => {
  const fresh = { EUR: 0.9, GBP: 0.8, INR: 83, CAD: 1.3, AUD: 1.5, BRL: 5, JPY: 150 };
  const payload = JSON.stringify({ base: "USD", date: "2026-10-01", rates: fresh });
  const source = [
    'export const RATES_AS_OF = "2026-01-01T00:00:00.000Z";',
    'export const RATES_SOURCE = "ECB reference rates";',
    ...EXPECTED_CURRENCIES.map((c) => `  { code: "${c}", rate: ${fresh[c]}, name: "x" },`),
  ].join("\n");

  it("parses a valid payload and rejects malformed ones", () => {
    expect(parseRatesResponse(payload).rates.INR).toBe(83);
    expect(() => parseRatesResponse("{bad")).toThrow(/not valid JSON/);
    expect(() => parseRatesResponse(JSON.stringify({ base: "EUR", date: "2026-01-01", rates: {} }))).toThrow(/Expected USD/);
    expect(() => parseRatesResponse(JSON.stringify({ base: "USD", date: "nope", rates: fresh }))).toThrow(/unusable date/);
    expect(() => parseRatesResponse(JSON.stringify({ base: "USD", date: "2026-10-01", rates: { ...fresh, EUR: 0 } }))).toThrow(/invalid rate for EUR/);
  });

  it("formats, extracts and detects implausible moves", () => {
    expect(formatRate(0.90001)).toBe("0.9");
    const stored = extractStoredRates(source);
    expect(stored.EUR).toBe(0.9);
    expect(() => extractStoredRates("no rows")).toThrow(/No stored rate/);
    expect(implausibleMoves(stored, fresh)).toEqual([]);
    expect(implausibleMoves({ EUR: 0.9 }, { EUR: 100 })).toContain("EUR");
    expect(implausibleMoves({}, { EUR: 1 })).toEqual([]);
  });

  it("rewrites the config and rejects drift", () => {
    const next = applyRatesToConfig(source, "2026-10-01", fresh);
    expect(next).toContain('RATES_AS_OF = "2026-10-01T00:00:00.000Z"');
    expect(() => applyRatesToConfig("no anchors", "2026-10-01", fresh)).toThrow(/drifted/);
  });

  it("runs the happy path and aborts on HTTP failure and implausible moves", async () => {
    const writeConfig = vi.fn();
    await runRatesFetch({
      fetchFn: vi.fn().mockResolvedValue(resp(payload)),
      readConfig: () => source,
      writeConfig,
    });
    expect(writeConfig).toHaveBeenCalledOnce();

    await expect(
      runRatesFetch({ fetchFn: vi.fn().mockResolvedValue(resp("", false, 503)), readConfig: () => source, writeConfig: vi.fn() }),
    ).rejects.toThrow(/HTTP 503/);

    const wild = source.replace(/rate: 0\.9,/, "rate: 0.001,");
    await expect(
      runRatesFetch({ fetchFn: vi.fn().mockResolvedValue(resp(payload)), readConfig: () => wild, writeConfig: vi.fn() }),
    ).rejects.toThrow(/Implausible/);
  });
});
