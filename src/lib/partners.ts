/**
 * Partner CTA helpers: resolve outbound URLs, attach UTMs, classify commercial links.
 */

import {
  getFeaturedPartners,
  getPartnerOffer,
  getCommercialPartners,
  partnerOffers,
} from "@/data/partners";
import type { PartnerOffer, PartnerRelationship } from "@/data/types";
import {
  companySummaries,
  getCompanySummaryBySlug,
} from "@/generated/company-summaries";

export type PartnerCtaPlacement =
  | "company-profile"
  | "fee-calculator"
  | "remittance"
  | "matchmaker"
  | "compare"
  | "compare-vs"
  | "featured-rail"
  | "category"
  | "home"
  | "pro";

export interface ResolvedPartnerCta {
  companySlug: string;
  companyName: string;
  href: string;
  label: string;
  relationship: PartnerRelationship;
  sponsored: boolean;
  sponsoredLabel?: string;
  trackingId: string;
  /** True when rel should include sponsored (affiliate or paid placement). */
  isCommercial: boolean;
}

const UTM_SOURCE = "fintech-atlas";

/**
 * Append standard campaign UTMs without clobbering existing query params
 * already present on affiliate network URLs.
 */
export function withPartnerUtm(
  rawUrl: string,
  opts: {
    medium: PartnerCtaPlacement;
    campaign?: string;
    content?: string;
  },
): string {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    // Defensive: never throw from a CTA builder in the client.
    return rawUrl;
  }

  if (!url.searchParams.has("utm_source")) {
    url.searchParams.set("utm_source", UTM_SOURCE);
  }
  if (!url.searchParams.has("utm_medium")) {
    url.searchParams.set("utm_medium", opts.medium);
  }
  if (opts.campaign && !url.searchParams.has("utm_campaign")) {
    url.searchParams.set("utm_campaign", opts.campaign);
  }
  if (opts.content && !url.searchParams.has("utm_content")) {
    url.searchParams.set("utm_content", opts.content);
  }
  return url.toString();
}

export function isCommercialRelationship(
  relationship: PartnerRelationship,
): boolean {
  return relationship === "affiliate" || relationship === "sponsored";
}

/**
 * Resolve the full CTA for a company at a given placement.
 * Falls back to the official website when no partner row exists.
 */
export function resolvePartnerCta(
  companySlug: string,
  placement: PartnerCtaPlacement,
  campaign?: string,
): ResolvedPartnerCta | null {
  const company = getCompanySummaryBySlug(companySlug);
  if (!company) return null;

  const offer: PartnerOffer | undefined = getPartnerOffer(companySlug);
  const baseUrl =
    offer?.ctaUrl ??
    (company.website.startsWith("http")
      ? company.website
      : `https://${company.website}`);
  const relationship = offer?.relationship ?? "none";
  const trackingId = offer?.trackingId ?? companySlug;

  const href = withPartnerUtm(baseUrl, {
    medium: placement,
    campaign: campaign ?? trackingId,
    content: companySlug,
  });

  return {
    companySlug,
    companyName: company.name,
    href,
    label: offer?.ctaLabel ?? `Visit ${company.name}`,
    relationship,
    sponsored: offer?.sponsored === true,
    sponsoredLabel: offer?.sponsoredLabel ?? "Featured partner",
    trackingId,
    isCommercial: isCommercialRelationship(relationship),
  };
}

/** rel attribute for outbound partner anchors. */
export function partnerRel(isCommercial: boolean): string {
  return isCommercial
    ? "sponsored noopener noreferrer"
    : "noopener noreferrer";
}

/**
 * Central earnings disclosure shown next to any commercial partner CTA.
 * Keep in sync with the About FAQ and Privacy Notice.
 */
export const COMMERCIAL_DISCLOSURE =
  "Disclosure: some links on this page are affiliate links — we may earn a commission at no extra cost to you when you purchase or sign up through them. This never affects our editorial ratings, rankings, or pricing comparisons.";

/** True when at least one partner currently has a commercial relationship. */
export function hasCommercialOffers(): boolean {
  return getCommercialPartners().length > 0;
}

/**
 * Honesty gate: every commercial partner must resolve to a link that carries
 * `rel="sponsored"` and reference the global disclosure text. Used by the test
 * suite (running in CI) to guarantee monetization stays disclosed as offers grow.
 */
export function commercialLinksRemainDisclosed(): boolean {
  const offers = getCommercialPartners();
  if (offers.length === 0) return true; // nothing commercial → trivially honest
  for (const offer of offers) {
    const resolved = resolvePartnerCta(offer.companySlug, "company-profile");
    if (!resolved) return false;
    if (!partnerRel(resolved.isCommercial).includes("sponsored")) return false;
    if (!resolved.isCommercial) return false;
  }
  return COMMERCIAL_DISCLOSURE.trim().length > 0;
}

export function listFeaturedResolved(
  placement: PartnerCtaPlacement = "featured-rail",
): ResolvedPartnerCta[] {
  return getFeaturedPartners()
    .map((p) => resolvePartnerCta(p.companySlug, placement, "featured"))
    .filter((c): c is ResolvedPartnerCta => c !== null);
}

/** Integrity: every partner row points at a known company. */
export function partnerCatalogIsValid(): boolean {
  const known = new Set(companySummaries.map((c) => c.slug));
  return partnerOffers.every(
    (p) =>
      known.has(p.companySlug) &&
      typeof p.ctaUrl === "string" &&
      p.ctaUrl.startsWith("https://"),
  );
}

export function everyCompanyHasPartnerOffer(): boolean {
  const offerSlugs = new Set(partnerOffers.map((p) => p.companySlug));
  return companySummaries.every((c) => offerSlugs.has(c.slug));
}
