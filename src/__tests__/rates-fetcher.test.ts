import { describe, it, expect } from "vitest";
import {
  applyRatesToConfig,
  extractStoredRates,
  formatRate,
  implausibleMoves,
  parseRatesResponse,
} from "../../scripts/fetch-rates";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const configSource = () =>
  readFileSync(resolve(process.cwd(), "src/data/remittance-config.ts"), "utf8");

const VALID_BODY = JSON.stringify({
  amount: 1.0,
  base: "USD",
  date: "2026-08-21",
  rates: { EUR: 0.85477, GBP: 0.73228, INR: 95.7, CAD: 1.374, AUD: 1.3951, BRL: 5.1729, JPY: 158.7 },
});

describe("parseRatesResponse", () => {
  it("accepts a well-formed USD-base payload with all seven currencies", () => {
    const { date, rates } = parseRatesResponse(VALID_BODY);
    expect(date).toBe("2026-08-21");
    expect(Object.keys(rates).sort()).toEqual(["AUD", "BRL", "CAD", "EUR", "GBP", "INR", "JPY"]);
    expect(rates.INR).toBeCloseTo(95.7);
  });

  it("rejects non-USD bases, bad dates and missing/negative rates", () => {
    expect(() =>
      parseRatesResponse(JSON.stringify({ base: "EUR", date: "2026-08-21", rates: {} })),
    ).toThrow(/USD-base/);
    expect(() =>
      parseRatesResponse(JSON.stringify({ base: "USD", date: "21-08-2026", rates: { EUR: 1 } })),
    ).toThrow(/date/);
    const missing = JSON.parse(VALID_BODY) as { rates: Record<string, number> };
    delete missing.rates.JPY;
    expect(() => parseRatesResponse(JSON.stringify(missing))).toThrow(/JPY/);
    expect(() =>
      parseRatesResponse(JSON.stringify({ base: "USD", date: "2026-08-21", rates: { EUR: -1 } })),
    ).toThrow(/EUR/);
    expect(() => parseRatesResponse("<html>blocked</html>")).toThrow(/JSON/);
  });
});

describe("applyRatesToConfig", () => {
  it("rewrites the snapshot constants and every currency rate in place", () => {
    const next = applyRatesToConfig(configSource(), "2026-08-21", {
      EUR: 0.85477, GBP: 0.73228, INR: 95.7, CAD: 1.374, AUD: 1.3951, BRL: 5.1729, JPY: 158.7,
    });
    expect(next).toContain('RATES_AS_OF = "2026-08-21T00:00:00.000Z"');
    expect(next).toContain("ECB reference rates (USD base), 2026-08-21");
    expect(next).toContain('{ code: "EUR", symbol: "€", name: "Euro", rate: 0.8548,');
    expect(next).toContain('{ code: "INR", symbol: "₹", name: "Indian Rupee", rate: 95.7,');
    // Untouched lines survive verbatim.
    expect(next).toContain("MAX_RATE_AGE_DAYS = 7");
    expect(next).toMatch(/export interface CurrencyOption/);
  });

  it("is idempotent — applying the same payload twice changes nothing further", () => {
    const once = applyRatesToConfig(configSource(), "2026-08-21", { EUR: 0.9, GBP: 0.7, INR: 90, CAD: 1.4, AUD: 1.4, BRL: 5, JPY: 150 });
    const twice = applyRatesToConfig(once, "2026-08-21", { EUR: 0.9, GBP: 0.7, INR: 90, CAD: 1.4, AUD: 1.4, BRL: 5, JPY: 150 });
    expect(twice).toBe(once);
  });

  it("throws instead of guessing when a structural anchor is missing", () => {
    const broken = configSource().replace(/RATES_AS_OF = "[^"]+"/, "RATES_AS_OF = BROKEN");
    expect(() =>
      applyRatesToConfig(broken, "2026-08-21", { EUR: 0.9, GBP: 0.7, INR: 90, CAD: 1.4, AUD: 1.4, BRL: 5, JPY: 150 }),
    ).toThrow(/anchor not found/);
    const noEur = configSource().replace(
      /(\{ code: "EUR"[^}]*?rate: )[0-9.]+/,
      "$1X",
    );
    expect(() =>
      applyRatesToConfig(noEur, "2026-08-21", { EUR: 0.9, GBP: 0.7, INR: 90, CAD: 1.4, AUD: 1.4, BRL: 5, JPY: 150 }),
    ).toThrow(/anchor not found|No stored rate/);
  });
});

describe("extractStoredRates / implausibleMoves / formatRate", () => {
  it("reads back exactly what applyRatesToConfig wrote (round-trip)", () => {
    const fresh = { EUR: 0.86, GBP: 0.73, INR: 94, CAD: 1.38, AUD: 1.41, BRL: 5.1, JPY: 155 };
    const next = applyRatesToConfig(configSource(), "2026-08-22", fresh);
    expect(extractStoredRates(next)).toEqual(fresh);
  });

  it("flags order-of-magnitude jumps as implausible, normal moves as fine", () => {
    const prev = extractStoredRates(configSource());
    expect(implausibleMoves(prev, { ...prev, INR: prev.INR * 50 })).toEqual(["INR"]);
    expect(implausibleMoves(prev, { ...prev, EUR: prev.EUR * 0.97 })).toEqual([]);
    expect(implausibleMoves({}, { EUR: 1 })).toEqual([]);
  });

  it("formats to four significant figures without float dust", () => {
    expect(formatRate(95.70000000001)).toBe("95.7");
    expect(formatRate(0.85477)).toBe("0.8548");
    expect(formatRate(158.7)).toBe("158.7");
  });
});
