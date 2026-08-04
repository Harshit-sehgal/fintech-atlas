import { describe, expect, it } from "vitest";
import {
  computeMarkup,
  isValidAmount,
  isValidRate,
  type MarkupInputs,
} from "@/lib/markup-calculator";

const base: MarkupInputs = {
  direction: "receive-inr",
  midRate: 83.5,
  offeredRate: 82,
  amount: 1000,
};

describe("computeMarkup", () => {
  it("computes the markup percentage from the mid-market rate", () => {
    // (83.50 - 82.00) / 83.50 = 1.796...%
    const result = computeMarkup(base);
    expect(result.markupPercent).toBeCloseTo(1.8, 1);
  });

  it("marks receiving INR as worse when the offered rate is below mid", () => {
    const result = computeMarkup(base);
    expect(result.worseThanMid).toBe(true);
    // $1,000 at mid = ₹83,500; at offered = ₹82,000.
    expect(result.expectedTarget).toBeCloseTo(83_500, 0);
    expect(result.actualTarget).toBeCloseTo(82_000, 0);
    expect(result.lossInr).toBeCloseTo(1_500, 0);
  });

  it("marks receiving INR as fine when the offered rate is above mid", () => {
    const result = computeMarkup({ ...base, offeredRate: 84 });
    expect(result.worseThanMid).toBe(false);
    expect(result.lossInr).toBe(0);
    expect(result.lossUsd).toBe(0);
  });

  it("handles sending INR with the loss on the sender side", () => {
    const result = computeMarkup({
      direction: "send-inr",
      midRate: 83.5,
      offeredRate: 84.5,
      amount: 50_000,
    });
    expect(result.worseThanMid).toBe(true);
    expect(result.markupPercent).toBeCloseTo(1.198, 3);
    // ₹50,000 at mid = $598.80; at offered = $591.72.
    expect(result.expectedTarget).toBeCloseTo(598.8, 1);
    expect(result.actualTarget).toBeCloseTo(591.72, 1);
    // Loss in INR terms: 50,000 × (84.5 − 83.5) / 84.5 ≈ ₹591.72.
    expect(result.lossInr).toBeCloseTo(591.72, 1);
    expect(result.lossUsd).toBeCloseTo(7.09, 1);
  });

  it("returns a zero loss when the offered rate matches mid exactly", () => {
    const result = computeMarkup({ ...base, offeredRate: 83.5 });
    expect(result.markupPercent).toBe(0);
    expect(result.worseThanMid).toBe(false);
    expect(result.lossInr).toBe(0);
  });

  it("treats a blank amount as zero without breaking the percentage", () => {
    const result = computeMarkup({ ...base, amount: 0 });
    expect(result.markupPercent).toBeCloseTo(1.8, 1);
    expect(result.lossInr).toBe(0);
  });

  it("keeps the markup percentage independent of the amount", () => {
    const small = computeMarkup({ ...base, amount: 100 });
    const large = computeMarkup({ ...base, amount: 500_000 });
    expect(large.markupPercent).toBeCloseTo(small.markupPercent, 10);
  });
});

describe("input validation", () => {
  it("accepts positive finite rates and rejects zero/negative/NaN", () => {
    expect(isValidRate(83.5)).toBe(true);
    expect(isValidRate(0)).toBe(false);
    expect(isValidRate(-1)).toBe(false);
    expect(isValidRate(Number.NaN)).toBe(false);
    expect(isValidRate(Number.POSITIVE_INFINITY)).toBe(false);
  });

  it("accepts zero amounts and rejects negative or absurd amounts", () => {
    expect(isValidAmount(0)).toBe(true);
    expect(isValidAmount(1_000)).toBe(true);
    expect(isValidAmount(-1)).toBe(false);
    expect(isValidAmount(Number.NaN)).toBe(false);
    expect(isValidAmount(2_000_000_000)).toBe(false);
  });
});
