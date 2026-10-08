import { describe, expect, it } from "vitest";
import {
  computeCagr,
  computeEmi,
  computeFire,
  computeNetWorth,
  computeRetirement,
  computeSip,
  computeSwp,
  emergencyFundCoverage,
  emergencyFundNeeded,
  inflate,
  requiredSip,
} from "./investment-calculators";

describe("computeSip branches", () => {
  it("compounds when the return is positive", () => {
    const r = computeSip(500, 12, 10)!;
    expect(r.futureValue).toBeGreaterThan(r.invested);
  });

  it("falls back to principal when the return is zero", () => {
    const r = computeSip(500, 0, 10)!;
    expect(r.futureValue).toBe(r.invested);
  });

  it("returns null for a non-positive contribution or period", () => {
    expect(computeSip(0, 12, 10)).toBeNull();
    expect(computeSip(500, 12, 0)).toBeNull();
  });
});

describe("computeSwp branches", () => {
  it("reports an indefinite lifetime when returns cover withdrawals", () => {
    const r = computeSwp(100000, 100, 20)!;
    expect(r.monthsUntilDepleted).toBeNull();
    expect(r.totalWithdrawn).toBeNull();
    expect(r.lifetimeLabel).toMatch(/Indefinite/);
  });

  it("computes a finite lifetime when returns are positive but insufficient", () => {
    const r = computeSwp(100000, 2000, 8)!;
    expect(r.monthsUntilDepleted).not.toBeNull();
    expect(r.lifetimeLabel).toMatch(/years/);
  });

  it("divides evenly when the return is zero", () => {
    const r = computeSwp(12000, 1000, 0)!;
    expect(r.monthsUntilDepleted).toBe(12);
  });

  it("returns null for invalid inputs", () => {
    expect(computeSwp(0, 100, 8)).toBeNull();
  });
});

describe("computeEmi branches", () => {
  it("amortises with a positive rate", () => {
    expect(computeEmi(500000, 8, 20)!.emi).toBeGreaterThan(0);
  });

  it("divides evenly at zero rate", () => {
    expect(computeEmi(120000, 0, 10)!.emi).toBeCloseTo(1000, 5);
  });

  it("returns null for invalid inputs", () => {
    expect(computeEmi(0, 8, 20)).toBeNull();
  });
});

describe("computeCagr branches", () => {
  it("returns -100% when the final value is zero", () => {
    expect(computeCagr(10000, 0, 5)).toBe(-100);
  });

  it("computes growth and rejects invalid inputs", () => {
    expect(computeCagr(10000, 20000, 5)).toBeGreaterThan(0);
    expect(computeCagr(0, 20000, 5)).toBeNull();
  });
});

describe("inflate", () => {
  it("compounds the rate over the period", () => {
    expect(inflate(1000, 10, 2)).toBeCloseTo(1210, 5);
  });
});

describe("computeRetirement branches", () => {
  it("uses the annuity formula when the real return is positive", () => {
    const r = computeRetirement(5000, 6, 25, 30, 8, 8, 0)!;
    expect(r.corpusNeeded).toBeGreaterThan(0);
  });

  it("falls back to a flat multiple when the real return is not positive", () => {
    const r = computeRetirement(5000, 6, 25, 30, 8, 2)!;
    expect(r.corpusNeeded).toBeCloseTo(r.annualExpenseAtRetirement * 30, 0);
  });

  it("collapses the real return at 100%+ inflation and applies defaults", () => {
    const r = computeRetirement(5000, 100, 25, 30, 8)!;
    expect(r.corpusNeeded).toBeGreaterThan(0);
    expect(r.requiredMonthlyContribution).toBeGreaterThanOrEqual(0);
  });

  it("returns null for invalid inputs", () => {
    expect(computeRetirement(0, 6, 25, 30, 8, 6)).toBeNull();
  });
});

describe("requiredSip branches", () => {
  it("returns 0 for non-finite inputs and non-positive targets", () => {
    expect(requiredSip(Number.NaN, 8, 10)).toBe(0);
    expect(requiredSip(0, 8, 10)).toBe(0);
  });

  it("returns the remaining lump sum when there is no time", () => {
    expect(requiredSip(100000, 8, 0, 40000)).toBe(60000);
  });

  it("returns 0 when existing savings already cover the target", () => {
    expect(requiredSip(100000, 8, 10, 500000)).toBe(0);
  });

  it("divides across months at a zero rate and uses the SIP formula otherwise", () => {
    expect(requiredSip(12000, 0, 1)).toBeCloseTo(1000, 5);
    expect(requiredSip(100000, 8, 10)).toBeGreaterThan(0);
  });
});

describe("computeFire branches", () => {
  it("flags already-reached when assets exceed the target", () => {
    const r = computeFire(60000, 4, 2000000, 0, 7)!;
    expect(r.alreadyReached).toBe(true);
    expect(r.yearsToFi).toBe(0);
  });

  it("computes years with contribution and return", () => {
    const r = computeFire(60000, 4, 100000, 1500, 7)!;
    expect(r.alreadyReached).toBe(false);
    expect(r.yearsToFi).toBeGreaterThan(0);
  });

  it("computes years on returns alone and on contributions alone", () => {
    expect(computeFire(60000, 4, 100000, 0, 7)!.yearsToFi).toBeGreaterThan(0);
    expect(computeFire(60000, 4, 100000, 1500, 0)!.yearsToFi).toBeGreaterThan(0);
  });

  it("returns null when the target is unreachable", () => {
    expect(computeFire(60000, 4, 100000, 0, 0)).toBeNull();
    expect(computeFire(0, 4, 0, 0, 7)).toBeNull();
  });
});

describe("emergency fund branches", () => {
  it("guards non-finite/negative inputs and computes otherwise", () => {
    expect(emergencyFundNeeded(-1, 6)).toBe(0);
    expect(emergencyFundNeeded(3000, -1)).toBe(0);
    expect(emergencyFundNeeded(3000, 6)).toBe(18000);
    expect(emergencyFundCoverage(9000, 0)).toBeNull();
    expect(emergencyFundCoverage(9000, 3000)).toBe(3);
  });
});

describe("computeNetWorth branches", () => {
  const base = {
    cash: 10000,
    investments: 40000,
    property: 200000,
    vehicles: 15000,
    otherAssets: 5000,
    mortgage: 150000,
    loans: 20000,
    creditCards: 5000,
    otherLiabilities: 0,
  };

  it("sums assets and liabilities and computes the debt ratio", () => {
    const r = computeNetWorth(base);
    expect(r.totalAssets).toBe(270000);
    expect(r.netWorth).toBe(95000);
    expect(r.debtToAssetsRatio).toBeGreaterThan(0);
  });

  it("returns a zero ratio when there are no assets", () => {
    const r = computeNetWorth({
      cash: 0, investments: 0, property: 0, vehicles: 0, otherAssets: 0,
      mortgage: 1000, loans: 0, creditCards: 0, otherLiabilities: 0,
    });
    expect(r.debtToAssetsRatio).toBe(0);
  });

  it("throws on non-finite inputs", () => {
    expect(() => computeNetWorth({ ...base, cash: Number.NaN })).toThrow(TypeError);
  });
});
