import { describe, expect, it, vi } from "vitest";

// Force the "no partner row" path so resolvePartnerCta exercises its website
// fallback and default labels, and so the empty-catalog helpers take the
// trivially-honest branch.
const mock = vi.hoisted(() => {
  return {
    getPartnerOffer: vi.fn(() => undefined),
    getFeaturedPartners: vi.fn(() => [
      { companySlug: "stripe", sponsored: true },
      { companySlug: "definitely-missing", sponsored: true },
    ]),
    getCommercialPartners: vi.fn(() => []),
    partnerOffers: [] as unknown[],
  };
});

vi.mock("@/data/partners", () => mock);

import {
  commercialLinksRemainDisclosed,
  hasCommercialOffers,
  listFeaturedResolved,
  resolvePartnerCta,
  withPartnerUtm,
} from "./partners";

describe("withPartnerUtm optional fields", () => {
  it("omits campaign/content params when not supplied", () => {
    const url = new URL(withPartnerUtm("https://stripe.com", { medium: "home" }));
    expect(url.searchParams.has("utm_campaign")).toBe(false);
    expect(url.searchParams.has("utm_content")).toBe(false);
    expect(url.searchParams.get("utm_medium")).toBe("home");
  });
});

describe("resolvePartnerCta without a partner row", () => {
  it("falls back to the company website and default labels", () => {
    const cta = resolvePartnerCta("stripe", "home")!;
    expect(cta.href).toContain("https://stripe.com");
    expect(cta.relationship).toBe("none");
    expect(cta.label).toBe("Visit Stripe");
    expect(cta.sponsored).toBe(false);
    expect(cta.sponsoredLabel).toBe("Featured partner");
    expect(cta.isCommercial).toBe(false);
  });

  it("returns null for an unknown company", () => {
    expect(resolvePartnerCta("definitely-missing", "home")).toBeNull();
  });
});

describe("empty-catalog honesty helpers", () => {
  it("hasCommercialOffers is false and disclosure trivially holds", () => {
    expect(hasCommercialOffers()).toBe(false);
    expect(commercialLinksRemainDisclosed()).toBe(true);
  });

  it("listFeaturedResolved drops featured entries with no resolvable company", () => {
    const featured = listFeaturedResolved();
    expect(featured.map((c) => c.companySlug)).toEqual(["stripe"]);
  });
});
