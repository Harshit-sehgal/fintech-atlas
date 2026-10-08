import { describe, expect, it } from "vitest";
import CALCULATORS, {
  formatMoney,
  formatMoneyCents,
  formatPercent,
  formatYears,
  type CalculatorDefinition,
} from "./calculator-config";

const byId = (id: string): CalculatorDefinition => {
  const def = CALCULATORS.find((c) => c.id === id);
  if (!def) throw new Error(`missing calculator ${id}`);
  return def;
};

const defaults = (def: CalculatorDefinition): Record<string, number> =>
  Object.fromEntries(def.inputs.map((i) => [i.key, i.default]));

describe("calculator catalog", () => {
  it("every calculator computes with its defaults and returns at least one row", () => {
    for (const def of CALCULATORS) {
      const rows = def.compute(defaults(def));
      expect(rows.length, def.id).toBeGreaterThan(0);
      for (const row of rows) {
        expect(typeof row.label).toBe("string");
        expect(row.value === null || typeof row.value === "string").toBe(true);
      }
    }
  });

  it("has unique ids", () => {
    const ids = CALCULATORS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("calculator warning branches", () => {
  it("SIP warns on a non-positive contribution", () => {
    const rows = byId("sip").compute({ monthlyContribution: 0, annualReturn: 12, years: 10 });
    expect(rows[0].kind).toBe("warning");
  });

  it("SWP handles both a finite and an indefinite corpus", () => {
    const finite = byId("swp").compute({ corpus: 100000, monthlyWithdrawal: 2000, annualReturn: 8 });
    expect(finite.some((r) => r.kind === "currency")).toBe(true);

    const indefinite = byId("swp").compute({ corpus: 100000, monthlyWithdrawal: 100, annualReturn: 20 });
    expect(indefinite.some((r) => r.kind === "warning")).toBe(true);
    expect(indefinite.some((r) => r.kind === "plain")).toBe(true);

    const invalid = byId("swp").compute({ corpus: 0, monthlyWithdrawal: 100, annualReturn: 8 });
    expect(invalid[0].kind).toBe("warning");
  });

  it("EMI warns on an invalid loan", () => {
    expect(byId("emi").compute({ principal: 0, annualRate: 8, years: 20 })[0].kind).toBe("warning");
  });

  it("CAGR warns on an invalid initial value", () => {
    expect(byId("cagr").compute({ initialValue: 0, finalValue: 20000, years: 5 })[0].kind).toBe("warning");
  });

  it("Retirement warns on invalid expenses", () => {
    const rows = byId("retirement").compute({
      currentMonthlyExpense: 0, annualInflation: 6, yearsToRetirement: 25,
      retirementYears: 30, currentSavings: 0, accumulationReturn: 8, retirementReturn: 6,
    });
    expect(rows[0].kind).toBe("warning");
  });

  it("FIRE reports both the reachable and already-reached cases", () => {
    const reachable = byId("fire").compute({
      annualExpenses: 60000, safeWithdrawalRate: 4, currentAssets: 100000,
      monthlyContribution: 1500, annualReturn: 7,
    });
    expect(reachable.some((r) => r.label === "Years to FI")).toBe(true);

    const reached = byId("fire").compute({
      annualExpenses: 60000, safeWithdrawalRate: 4, currentAssets: 2000000,
      monthlyContribution: 1500, annualReturn: 7,
    });
    expect(reached.some((r) => r.kind === "warning")).toBe(true);

    const unreachable = byId("fire").compute({
      annualExpenses: 60000, safeWithdrawalRate: 4, currentAssets: 100000,
      monthlyContribution: 0, annualReturn: 0,
    });
    expect(unreachable[0].kind).toBe("warning");
  });

  it("Emergency fund covers surplus, gap and a null coverage value", () => {
    const gap = byId("emergency").compute({ monthlyExpenses: 3000, months: 6, currentSavings: 0 });
    expect(gap.some((r) => r.label === "Still to Save")).toBe(true);

    const surplus = byId("emergency").compute({ monthlyExpenses: 3000, months: 6, currentSavings: 999999 });
    expect(surplus.some((r) => r.label === "Surplus")).toBe(true);

    const noCoverage = byId("emergency").compute({ monthlyExpenses: 0, months: 6, currentSavings: 1000 });
    expect(noCoverage.some((r) => r.value === "—")).toBe(true);
  });
});

describe("formatters", () => {
  it("formatMoney handles null, non-finite, small and large values", () => {
    expect(formatMoney(null)).toBe("—");
    expect(formatMoney(undefined)).toBe("—");
    expect(formatMoney(Number.POSITIVE_INFINITY)).toBe("—");
    expect(formatMoney(50)).toBe("$50");
    expect(formatMoney(1234)).toBe("$1,234");
  });

  it("formatMoneyCents handles null and rounds to cents", () => {
    expect(formatMoneyCents(null)).toBe("—");
    expect(formatMoneyCents(1234.5)).toBe("$1,234.50");
  });

  it("formatPercent trims trailing zeros and handles invalid input", () => {
    expect(formatPercent(null)).toBe("—");
    expect(formatPercent(12)).toBe("12%");
    expect(formatPercent(12.5)).toBe("12.50%");
  });

  it("formatYears handles null and renders one decimal", () => {
    expect(formatYears(null)).toBe("—");
    expect(formatYears(3.25)).toBe("3.3 years");
  });
});
