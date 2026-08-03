import { describe, it, expect } from "vitest";
import { companies } from "@/data";
import {
  getCommercialPartners,
  getFeaturedPartners,
  getPartnerOffer,
  partnerOffers,
} from "@/data/partners";
import {
  everyCompanyHasPartnerOffer,
  isCommercialRelationship,
  listFeaturedResolved,
  partnerCatalogIsValid,
  partnerRel,
  resolvePartnerCta,
  withPartnerUtm,
  COMMERCIAL_DISCLOSURE,
  hasCommercialOffers,
  commercialLinksRemainDisclosed,
} from "@/lib/partners";

describe("partner catalog", () => {
  it("has one offer per company", () => {
    expect(partnerOffers.length).toBe(companies.length);
    expect(everyCompanyHasPartnerOffer()).toBe(true);
  });

  it("every offer maps to a real company and https URL", () => {
    expect(partnerCatalogIsValid()).toBe(true);
  });

  it("resolves known high-value partners", () => {
    for (const slug of ["stripe", "wise", "adyen", "paypal"]) {
      const offer = getPartnerOffer(slug);
      expect(offer).toBeDefined();
      expect(offer!.ctaUrl.startsWith("https://")).toBe(true);
      expect(offer!.ctaLabel.length).toBeGreaterThan(0);
    }
  });

  it("featured partners are only those with sponsored:true", () => {
    for (const p of getFeaturedPartners()) {
      expect(p.sponsored).toBe(true);
    }
  });

  it("commercial partners exclude relationship none", () => {
    for (const p of getCommercialPartners()) {
      expect(p.relationship).not.toBe("none");
    }
  });
});

describe("withPartnerUtm", () => {
  it("appends utm params to clean URLs", () => {
    const href = withPartnerUtm("https://stripe.com", {
      medium: "company-profile",
      campaign: "stripe",
      content: "stripe",
    });
    const url = new URL(href);
    expect(url.searchParams.get("utm_source")).toBe("fintech-atlas");
    expect(url.searchParams.get("utm_medium")).toBe("company-profile");
    expect(url.searchParams.get("utm_campaign")).toBe("stripe");
    expect(url.searchParams.get("utm_content")).toBe("stripe");
  });

  it("does not clobber existing utm params on affiliate URLs", () => {
    const href = withPartnerUtm(
      "https://example.com/r?utm_source=network&utm_medium=affiliate",
      { medium: "fee-calculator", campaign: "x" },
    );
    const url = new URL(href);
    expect(url.searchParams.get("utm_source")).toBe("network");
    expect(url.searchParams.get("utm_medium")).toBe("affiliate");
  });

  it("returns raw string for invalid URLs", () => {
    expect(withPartnerUtm("not-a-url", { medium: "home" })).toBe("not-a-url");
  });
});

describe("resolvePartnerCta", () => {
  it("returns null for unknown companies", () => {
    expect(resolvePartnerCta("no-such-co", "home")).toBeNull();
  });

  it("builds a commercial-safe CTA for stripe", () => {
    const cta = resolvePartnerCta("stripe", "fee-calculator");
    expect(cta).not.toBeNull();
    expect(cta!.companyName).toBe("Stripe");
    expect(cta!.href).toContain("https://");
    expect(cta!.href).toContain("utm_source=fintech-atlas");
    expect(cta!.href).toContain("utm_medium=fee-calculator");
    expect(cta!.isCommercial).toBe(
      isCommercialRelationship(cta!.relationship),
    );
  });

  it("partnerRel includes sponsored only for commercial links", () => {
    expect(partnerRel(true)).toContain("sponsored");
    expect(partnerRel(false)).not.toContain("sponsored");
    expect(partnerRel(false)).toContain("noopener");
  });

  it("listFeaturedResolved only returns sponsored inventory", () => {
    const featured = listFeaturedResolved();
    expect(featured.length).toBe(getFeaturedPartners().length);
  });
});

describe("commercial honesty gate", () => {
  it("renders a central, non-empty affiliate disclosure", () => {
    expect(COMMERCIAL_DISCLOSURE.trim().length).toBeGreaterThan(50);
    expect(COMMERCIAL_DISCLOSURE).toMatch(/affiliate/i);
  });

  it("hasCommercialOffers matches the data catalog", () => {
    expect(hasCommercialOffers()).toBe(getCommercialPartners().length > 0);
  });

  it("every commercial link carries rel=sponsored and a disclosure", () => {
    // Guard: if any commercial offer exists, it must resolve to an
    // isCommercial CTA with rel="sponsored" and the global disclosure.
    expect(commercialLinksRemainDisclosed()).toBe(true);
  });

  it("non-commercial resolves are never marked sponsored", () => {
    for (const slug of ["stripe", "wise", "adyen"]) {
      const cta = resolvePartnerCta(slug, "company-profile");
      expect(cta).not.toBeNull();
      expect(cta!.isCommercial).toBe(
        isCommercialRelationship(cta!.relationship),
      );
      if (cta!.isCommercial) {
        expect(partnerRel(cta!.isCommercial)).toContain("sponsored");
      }
    }
  });
});
