import { describe, it, expect } from "vitest";
import {
  computeSip,
  computeSwp,
  computeEmi,
  computeCagr,
  inflate,
  computeRetirement,
  requiredSip,
  computeFire,
  emergencyFundNeeded,
  emergencyFundCoverage,
  computeNetWorth,
} from "./investment-calculators";

describe("computeSip", () => {
  it("computes a standard SIP future value", () => {
    // $500/mo, 12%/yr, 10 years. Sanity: FV must exceed invested.
    const r = computeSip(500, 12, 10);
    expect(r).not.toBeNull();
    expect(r!.invested).toBe(60_000);
    expect(r!.futureValue).toBeGreaterThan(60_000);
    expect(r!.gains).toBeCloseTo(r!.futureValue - r!.invested, 0);
  });

  it("returns null for non-positive contributions", () => {
    expect(computeSip(0, 12, 10)).toBeNull();
    expect(computeSip(-100, 12, 10)).toBeNull();
  });

  it("returns null for non-positive time", () => {
    expect(computeSip(500, 12, 0)).toBeNull();
    expect(computeSip(500, 12, -1)).toBeNull();
  });

  it("treats a 0% return as principal-only growth", () => {
    const r = computeSip(100, 0, 2);
    expect(r!.futureValue).toBeCloseTo(2400, 0);
  });
});

describe("computeSwp", () => {
  it("depletes a corpus over a finite horizon", () => {
    const r = computeSwp(100_000, 2000, 8);
    expect(r).not.toBeNull();
    expect(r!.monthsUntilDepleted).toBeGreaterThan(0);
    expect(r!.lifetimeLabel).toMatch(/years/);
  });

  it("never depletes when withdrawals are covered by returns", () => {
    // $120k corpus at 12%/yr earns ~$1,200/mo — a $1,000/mo withdrawal is safe.
    const r = computeSwp(120_000, 1000, 12);
    expect(r!.monthsUntilDepleted).toBeNull();
    expect(r!.lifetimeLabel).toMatch(/Indefinite under this fixed-return assumption/);
  });

  it("returns null for invalid inputs", () => {
    expect(computeSwp(0, 100, 5)).toBeNull();
    expect(computeSwp(100, 0, 5)).toBeNull();
  });
});

describe("computeEmi", () => {
  it("computes a known EMI", () => {
    // $200,000 at 8%/yr for 20 years → EMI ≈ $1,672.88
    const r = computeEmi(200_000, 8, 20);
    expect(r).not.toBeNull();
    expect(r!.emi).toBeCloseTo(1672.88, 1);
    expect(r!.totalInterest).toBeGreaterThan(0);
    expect(r!.totalPayment).toBeCloseTo(r!.emi * 240, 0);
  });

  it("returns null for invalid inputs", () => {
    expect(computeEmi(0, 8, 20)).toBeNull();
    expect(computeEmi(100, 8, 0)).toBeNull();
  });
});

describe("computeCagr", () => {
  it("computes CAGR over multiple years", () => {
    // 10k → 20k over 5 years ≈ 14.87%
    expect(computeCagr(10_000, 20_000, 5)).toBeCloseTo(14.87, 1);
  });

  it("returns -100% when final value is zero", () => {
    expect(computeCagr(1000, 0, 3)).toBe(-100);
  });

  it("returns null for invalid inputs", () => {
    expect(computeCagr(0, 100, 3)).toBeNull();
    expect(computeCagr(100, 200, 0)).toBeNull();
  });
});

describe("inflate", () => {
  it("compounds inflation", () => {
    expect(inflate(100, 10, 2)).toBeCloseTo(121, 0);
    expect(inflate(100, 0, 5)).toBe(100);
  });
});

describe("requiredSip", () => {
  it("reaches the target at a positive return", () => {
    const monthly = requiredSip(1_000_000, 10, 20);
    expect(monthly).toBeGreaterThan(0);
    // The computed contribution should approximately rebuild the corpus.
    const back = computeSip(monthly, 10, 20);
    expect(back!.futureValue).toBeCloseTo(1_000_000, -1);
  });

  it("divides evenly when return is zero", () => {
    expect(requiredSip(120_000, 0, 1)).toBeCloseTo(10_000, 0);
  });

  it("accounts for existing savings before calculating contributions", () => {
    expect(requiredSip(120_000, 0, 1, 20_000)).toBeCloseTo(8_333.33, 1);
    expect(requiredSip(50_000, 8, 0, 60_000)).toBe(0);
  });

  it("requires the full corpus when time is zero", () => {
    expect(requiredSip(50_000, 8, 0)).toBe(50_000);
  });
});

describe("computeRetirement", () => {
  it("builds an inflation-adjusted corpus larger than raw expenses", () => {
    const r = computeRetirement(2000, 6, 25, 30, 8, 6, 20_000);
    expect(r).not.toBeNull();
    expect(r!.annualExpenseAtRetirement).toBeGreaterThan(24_000);
    expect(r!.corpusNeeded).toBeGreaterThan(r!.annualExpenseAtRetirement);
    expect(r!.requiredMonthlyContribution).toBeGreaterThan(0);

    const withoutSavings = computeRetirement(2000, 6, 25, 30, 8, 6, 0)!;
    expect(r!.requiredMonthlyContribution).toBeLessThan(withoutSavings.requiredMonthlyContribution);
  });

  it("returns null for invalid inputs", () => {
    expect(computeRetirement(0, 6, 25, 30, 8)).toBeNull();
    expect(computeRetirement(2000, 6, 25, 0, 8)).toBeNull();
  });
});

describe("computeFire", () => {
  it("computes the 4% rule target and time to FI", () => {
    const r = computeFire(40_000, 4, 50_000, 1000, 7);
    expect(r).not.toBeNull();
    expect(r!.fireNumber).toBe(1_000_000);
    expect(r!.yearsToFi).toBeGreaterThan(0);
    expect(r!.yearsToFi).toBeLessThan(50);
    expect(r!.alreadyReached).toBe(false);
  });

  it("flags FI as reached when assets already exceed the target", () => {
    const r = computeFire(40_000, 4, 1_500_000, 0, 7);
    expect(r!.alreadyReached).toBe(true);
    expect(r!.yearsToFi).toBe(0);
  });

  it("returns null when FI is unreachable without contributions or return", () => {
    // No return, no contributions → can never grow into the target.
    const r = computeFire(40_000, 4, 10_000, 0, 0);
    expect(r).toBeNull();
  });
});

describe("emergency fund", () => {
  it("computes the target fund and coverage months", () => {
    expect(emergencyFundNeeded(3000, 6)).toBe(18_000);
    expect(emergencyFundCoverage(18_000, 3000)).toBe(6);
  });

  it("handles zero expenses gracefully", () => {
    expect(emergencyFundNeeded(3000, 0)).toBe(0);
    expect(emergencyFundCoverage(1000, 0)).toBeNull();
  });
});

describe("computeNetWorth", () => {
  it("nets assets minus liabilities", () => {
    const r = computeNetWorth({
      cash: 10_000,
      investments: 40_000,
      property: 300_000,
      vehicles: 15_000,
      otherAssets: 5_000,
      mortgage: 180_000,
      loans: 20_000,
      creditCards: 5_000,
      otherLiabilities: 0,
    });
    expect(r.totalAssets).toBe(370_000);
    expect(r.totalLiabilities).toBe(205_000);
    expect(r.netWorth).toBe(165_000);
    expect(r.debtToAssetsRatio).toBeCloseTo(0.554, 2);
  });

  it("clamps negative input values to zero", () => {
    const r = computeNetWorth({
      cash: -100,
      investments: 0,
      property: 0,
      vehicles: 0,
      otherAssets: 0,
      mortgage: 0,
      loans: 0,
      creditCards: 0,
      otherLiabilities: 0,
    });
    expect(r.totalAssets).toBe(0);
  });
});
