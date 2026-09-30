import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { trackEvent, getAnalyticsDomain } from "@/lib/analytics";

describe("getAnalyticsDomain", () => {
  const original = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
    else process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN = original;
  });

  it("returns undefined when unset or blank", () => {
    // An empty string would otherwise produce a false "analytics configured"
    // signal, so blanks are normalised away.
    delete process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
    expect(getAnalyticsDomain()).toBeUndefined();

    process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN = "   ";
    expect(getAnalyticsDomain()).toBeUndefined();
  });

  it("returns the trimmed domain when configured", () => {
    process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN = "  atlas.example  ";
    expect(getAnalyticsDomain()).toBe("atlas.example");
  });
});

describe("trackEvent", () => {
  beforeEach(() => {
    delete window.plausible;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is a no-op when no analytics provider is present", () => {
    // Analytics is opt-in: with no Plausible snippet loaded this must stay
    // silent rather than throwing or queueing anything.
    expect(() => trackEvent("cta_click", { placement: "hero" })).not.toThrow();
  });

  it("forwards the event and its props to the provider", () => {
    const plausible = vi.fn();
    window.plausible = plausible;

    trackEvent("outbound_click", { provider: "stripe", placement: "compare-vs" });

    expect(plausible).toHaveBeenCalledWith("outbound_click", {
      props: { provider: "stripe", placement: "compare-vs" },
    });
  });

  it("omits the options argument when no props are supplied", () => {
    const plausible = vi.fn();
    window.plausible = plausible;

    trackEvent("tool_complete");

    expect(plausible).toHaveBeenCalledWith("tool_complete", undefined);
  });

  it("never lets a provider failure escape into the UI", () => {
    // A broken snippet must not break the CTA the user just clicked.
    window.plausible = vi.fn(() => {
      throw new Error("network down");
    });
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => trackEvent("cta_click")).not.toThrow();
  });
});