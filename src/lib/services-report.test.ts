import { describe, it, expect } from "vitest";
import {
  buildContactIssueUrl,
  gatewayEstimates,
  SAMPLE_MERCHANT,
} from "@/lib/services-report";

describe("gatewayEstimates (sample report)", () => {
  it("derives fees from the published India schedules with 18% GST on the platform fee", () => {
    const rows = gatewayEstimates();
    // Razorpay: 2% domestic + 1% intl surcharge × 15% share = 2.15% blended.
    const razorpay = rows.find((r) => r.slug === "razorpay");
    expect(razorpay).toBeDefined();
    expect(razorpay!.blendedPercent).toBeCloseTo(2.15, 5);
    expect(razorpay!.platformFee).toBe(Math.round(SAMPLE_MERCHANT.monthlyVolume * 0.0215));
    expect(razorpay!.gst).toBe(Math.round(razorpay!.platformFee * 0.18));
    expect(razorpay!.total).toBe(razorpay!.platformFee + razorpay!.gst);
  });

  it("only compares INR providers (never mixes currencies)", () => {
    const rows = gatewayEstimates();
    for (const row of rows) {
      expect(["razorpay", "stripe", "cashfree"]).toContain(row.slug);
    }
    // Stripe appears once — the INR India schedule, not the USD one.
    expect(rows.filter((r) => r.slug === "stripe")).toHaveLength(1);
  });

  it("scales with international share: more intl cards raises the blended rate", () => {
    const [allDomestic] = gatewayEstimates(SAMPLE_MERCHANT.monthlyVolume, 0);
    const [allIntl] = gatewayEstimates(SAMPLE_MERCHANT.monthlyVolume, 1);
    expect(allIntl.total).toBeGreaterThan(allDomestic.total);
    expect(allDomestic.blendedPercent).toBeCloseTo(2, 5);
  });

  it("keeps effective percent consistent with total and volume", () => {
    const rows = gatewayEstimates();
    for (const row of rows) {
      expect(row.effectivePercent).toBeCloseTo((row.total / SAMPLE_MERCHANT.monthlyVolume) * 100, 3);
    }
  });

  it("orders providers the same as the calculator would (sorted by total)", () => {
    const rows = gatewayEstimates();
    const sorted = [...rows].sort((a, b) => a.total - b.total);
    expect(sorted[0].total).toBeLessThanOrEqual(sorted[1].total);
  });
});

describe("buildContactIssueUrl", () => {
  const url = buildContactIssueUrl({
    service: "Payment gateway selection audit (basic)",
    email: "founder@example.in",
    message: "D2C store, ~₹8L/month, currently on Cashfree.",
  });

  it("targets the site repository issue tracker", () => {
    expect(url).toMatch(/^https:\/\/github\.com\/Harshit-sehgal\/fintech-atlas\/issues\/new\?/);
  });

  it("prefills a title naming the service", () => {
    expect(decodeURIComponent(url)).toContain("title=Services inquiry: Payment gateway selection audit (basic)");
  });

  it("includes email and message in the body", () => {
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("**Contact email:** founder@example.in");
    expect(decoded).toContain("**Message:**");
    expect(decoded).toContain("D2C store, ~₹8L/month, currently on Cashfree.");
  });

  it("marks business size as not specified when omitted", () => {
    const minimal = buildContactIssueUrl({
      service: "x",
      email: "a@b.in",
      message: "short but at least twenty chars",
    });
    expect(decodeURIComponent(minimal)).toContain("**Business size:** Not specified");
  });
});
