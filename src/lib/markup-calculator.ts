/**
 * Exchange-rate markup math for the markup calculator tool.
 *
 * All rates use the INR-per-USD convention (how many rupees you get or pay
 * per US dollar). The markup is the absolute deviation from the mid-market
 * rate, expressed as a percentage of mid — direction only decides which side
 * of the transfer eats the cost:
 *
 * - Receiving INR (USD -> INR): the provider credits you fewer rupees per
 *   dollar than mid, so `offered < mid` and the loss lands on the recipient.
 * - Sending INR (INR -> USD): the provider charges you more rupees per dollar
 *   than mid, so `offered > mid` and the loss lands on the sender.
 *
 * Pure functions only — no DOM, storage, or formatting, so the math is unit
 * testable and shared by the client island.
 */

export type MarkupDirection = "receive-inr" | "send-inr";

export interface MarkupInputs {
  direction: MarkupDirection;
  /** Mid-market rate, INR per USD. Must be > 0. */
  midRate: number;
  /** Provider's offered rate, INR per USD. Must be > 0. */
  offeredRate: number;
  /** Amount being converted, in the natural currency (USD for receive, INR for send). */
  amount: number;
}

export interface MarkupResult {
  /** Absolute deviation from mid as a percentage of mid (e.g. 1.80). */
  markupPercent: number;
  /** True when the offered rate is worse than mid for the chosen direction. */
  worseThanMid: boolean;
  /** Expected conversion at the mid-market rate, in the target currency. */
  expectedTarget: number;
  /** Actual conversion at the offered rate, in the target currency. */
  actualTarget: number;
  /** Loss in the target currency (0 when the offered rate is better). */
  lossTarget: number;
  /** Loss expressed in INR (0 when the offered rate is better). */
  lossInr: number;
  /** Loss expressed in USD (0 when the offered rate is better). */
  lossUsd: number;
}

/** True when a rate input is a finite number above zero. */
export function isValidRate(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

/** True when the amount is finite, non-negative, and within a sane bound. */
export function isValidAmount(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1_000_000_000;
}

/**
 * Compute the markup for a transfer. `amount` of 0 (user left the field
 * blank) still yields the percentage markup; the currency-converted fields
 * are then all 0.
 */
export function computeMarkup(inputs: MarkupInputs): MarkupResult {
  const { direction, midRate, offeredRate, amount } = inputs;

  // Absolute deviation from mid, as a percentage of mid.
  const markupPercent = (Math.abs(midRate - offeredRate) / midRate) * 100;

  let worseThanMid: boolean;
  let expectedTarget: number;
  let actualTarget: number;

  if (direction === "receive-inr") {
    // Convert USD -> INR. Worse means the provider gives fewer rupees.
    worseThanMid = offeredRate < midRate;
    expectedTarget = amount * midRate;
    actualTarget = amount * offeredRate;
  } else {
    // Convert INR -> USD. Worse means the provider charges more rupees.
    worseThanMid = offeredRate > midRate;
    expectedTarget = amount / midRate;
    actualTarget = amount / offeredRate;
  }

  const lossTarget = worseThanMid ? Math.max(0, expectedTarget - actualTarget) : 0;
  const lossInr =
    direction === "receive-inr"
      ? lossTarget // loss is already in INR
      : worseThanMid
        ? (amount * (offeredRate - midRate)) / offeredRate
        : 0;
  const lossUsd =
    direction === "send-inr"
      ? lossTarget // loss is already in USD
      : worseThanMid
        ? (amount * (midRate - offeredRate)) / midRate
        : 0;

  return {
    markupPercent,
    worseThanMid,
    expectedTarget,
    actualTarget,
    lossTarget,
    lossInr,
    lossUsd,
  };
}
