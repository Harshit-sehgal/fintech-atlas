import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getAnalyticsDomain,
  trackCtaClick,
  trackEvent,
  trackOutboundClick,
} from "./analytics";

describe("analytics helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns undefined for an unset analytics domain", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_DOMAIN", "   ");
    expect(getAnalyticsDomain()).toBeUndefined();
  });

  it("trims a configured analytics domain", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_DOMAIN", " example.test ");
    expect(getAnalyticsDomain()).toBe("example.test");
  });

  it("sends events to the optional plausible callback", () => {
    const plausible = vi.fn();
    vi.stubGlobal("window", { plausible });

    trackEvent("compare_view");
    trackCtaClick({
      companySlug: "stripe",
      placement: "company-profile",
      relationship: "none",
      trackingId: "stripe",
    });

    expect(plausible).toHaveBeenNthCalledWith(1, "compare_view", undefined);
    expect(plausible).toHaveBeenNthCalledWith(2, "cta_click", {
      props: {
        company: "stripe",
        placement: "company-profile",
        relationship: "none",
        tracking_id: "stripe",
      },
    });
  });

  it("swallows analytics callback errors", () => {
    vi.stubGlobal("window", {
      plausible: () => {
        throw new Error("analytics unavailable");
      },
    });
    expect(() => trackEvent("tool_complete", { complete: true })).not.toThrow();
  });

  it("tracks outbound clicks with a placement fallback", () => {
    const plausible = vi.fn();
    vi.stubGlobal("window", { plausible });

    trackOutboundClick({ url: "https://razorpay.com", placement: "footer" });
    trackOutboundClick({ url: "https://wise.com" });

    expect(plausible).toHaveBeenNthCalledWith(1, "outbound_click", {
      props: { url: "https://razorpay.com", placement: "footer" },
    });
    expect(plausible).toHaveBeenNthCalledWith(2, "outbound_click", {
      props: { url: "https://wise.com", placement: "body" },
    });
  });
});
