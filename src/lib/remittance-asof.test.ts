import { describe, it, expect } from "vitest";
import { isRateSnapshotStale, ratesAsOfLabel } from "@/lib/remittance";
import { RATES_AS_OF, MAX_RATE_AGE_DAYS } from "@/data/remittance-config";

describe("rate-snapshot freshness (#5)", () => {
  const snapshot = Date.parse(RATES_AS_OF);

  it("has a parseable RATES_AS_OF timestamp", () => {
    expect(Number.isNaN(snapshot)).toBe(false);
    expect(ratesAsOfLabel().length).toBeGreaterThan(0);
  });

  it("is fresh on the snapshot date", () => {
    expect(isRateSnapshotStale(snapshot)).toBe(false);
  });

  it("is stale once older than MAX_RATE_AGE_DAYS", () => {
    const day = 24 * 60 * 60 * 1000;
    expect(isRateSnapshotStale(snapshot + MAX_RATE_AGE_DAYS * day + 1)).toBe(true);
    expect(isRateSnapshotStale(snapshot + MAX_RATE_AGE_DAYS * day)).toBe(false);
  });
});
