/**
 * Commercial partner configuration for FinTech Atlas.
 *
 * Editorial company data lives in `companies.ts`. This file owns outbound CTAs,
 * affiliate/partner URLs, and sponsored inventory so commercial status never
 * silently mutates ratings or narrative.
 *
 * How to go live with a real affiliate program:
 * 1. Enroll (see docs/monetization/PARTNER-PLAYBOOK.md)
 * 2. Replace `ctaUrl` with the tracked partner URL
 * 3. Set `relationship` to "affiliate" (or "sponsored" for paid placements)
 * 4. Optionally set `sponsored: true` + `priority` for featured rails
 * 5. Redeploy the static export
 */

import type { PartnerOffer } from "./types";
import { companies } from "./companies";

/** High-value B2B / consumer targets — pre-labeled for partner enrollment. */
const PRIORITY_OVERRIDES: Record<
  string,
  Partial<
    Pick<
      PartnerOffer,
      | "ctaUrl"
      | "ctaLabel"
      | "relationship"
      | "sponsored"
      | "sponsoredLabel"
      | "priority"
      | "trackingId"
      | "notes"
    >
  >
> = {
  // --- B2B payment / infrastructure (primary $50k path) ---
  stripe: {
    ctaLabel: "Visit Stripe",
    relationship: "none",
    trackingId: "stripe",
    priority: 10,
    notes:
      "Replace ctaUrl with Stripe partner/affiliate link after enrollment; set relationship to affiliate.",
  },
  adyen: {
    ctaLabel: "Visit Adyen",
    relationship: "none",
    trackingId: "adyen",
    priority: 20,
    notes: "Enterprise sales-led; often partner referral rather than public affiliate.",
  },
  paypal: {
    ctaLabel: "Visit PayPal",
    relationship: "none",
    trackingId: "paypal",
    priority: 30,
  },
  square: {
    ctaLabel: "Visit Square",
    relationship: "none",
    trackingId: "square",
    priority: 40,
  },
  plaid: {
    ctaLabel: "Visit Plaid",
    relationship: "none",
    trackingId: "plaid",
    priority: 50,
  },
  brex: {
    ctaLabel: "Visit Brex",
    relationship: "none",
    trackingId: "brex",
    priority: 60,
  },
  razorpay: {
    ctaLabel: "Visit Razorpay",
    relationship: "none",
    trackingId: "razorpay",
    priority: 70,
  },
  braintree: {
    ctaLabel: "Visit Braintree",
    relationship: "none",
    trackingId: "braintree",
    priority: 80,
  },
  // --- Cross-border / consumer FX ---
  wise: {
    ctaLabel: "Open Wise",
    relationship: "none",
    trackingId: "wise",
    priority: 15,
    notes: "Strong public affiliate programs in many regions via Impact/partner portals.",
  },
  revolut: {
    ctaLabel: "Open Revolut",
    relationship: "none",
    trackingId: "revolut",
    priority: 25,
  },
  payoneer: {
    ctaLabel: "Visit Payoneer",
    relationship: "none",
    trackingId: "payoneer",
    priority: 55,
  },
  moneygram: {
    ctaLabel: "Visit MoneyGram",
    relationship: "none",
    trackingId: "moneygram",
    priority: 90,
  },
  // --- Neobanks / consumer ---
  chime: {
    ctaLabel: "Open Chime",
    relationship: "none",
    trackingId: "chime",
    priority: 35,
  },
  monzo: {
    ctaLabel: "Open Monzo",
    relationship: "none",
    trackingId: "monzo",
    priority: 85,
  },
  n26: {
    ctaLabel: "Open N26",
    relationship: "none",
    trackingId: "n26",
    priority: 86,
  },
  // --- Investing / BNPL ---
  robinhood: {
    ctaLabel: "Open Robinhood",
    relationship: "none",
    trackingId: "robinhood",
    priority: 45,
  },
  sofi: {
    ctaLabel: "Open SoFi",
    relationship: "none",
    trackingId: "sofi",
    priority: 48,
  },
  affirm: {
    ctaLabel: "Visit Affirm",
    relationship: "none",
    trackingId: "affirm",
    priority: 65,
  },
  klarna: {
    ctaLabel: "Visit Klarna",
    relationship: "none",
    trackingId: "klarna",
    priority: 66,
  },
  // --- Example sponsored inventory (demo-ready; flip sponsored:true when paid) ---
  // Leave sponsored:false until a real paid placement is live so badges stay honest.
};

function officialSiteUrl(website: string): string {
  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website;
  }
  return `https://${website}`;
}

function defaultCtaLabel(name: string): string {
  return `Visit ${name}`;
}

/**
 * Full partner catalog — one entry per company.
 * Generated from the company directory so new companies get a safe default CTA.
 */
export const partnerOffers: PartnerOffer[] = companies.map((company) => {
  const override = PRIORITY_OVERRIDES[company.slug];
  return {
    companySlug: company.slug,
    ctaUrl: override?.ctaUrl ?? officialSiteUrl(company.website),
    ctaLabel: override?.ctaLabel ?? defaultCtaLabel(company.name),
    relationship: override?.relationship ?? "none",
    sponsored: override?.sponsored ?? false,
    sponsoredLabel: override?.sponsoredLabel,
    trackingId: override?.trackingId ?? company.slug,
    priority: override?.priority ?? 1000,
    notes: override?.notes,
  };
});

const partnerBySlug = new Map(partnerOffers.map((p) => [p.companySlug, p]));

export function getPartnerOffer(slug: string): PartnerOffer | undefined {
  return partnerBySlug.get(slug);
}

/** Featured / sponsored inventory for home and category rails. */
export function getFeaturedPartners(): PartnerOffer[] {
  return partnerOffers
    .filter((p) => p.sponsored === true)
    .sort((a, b) => (a.priority ?? 1000) - (b.priority ?? 1000));
}

/** Partners that may earn a commission (affiliate or sponsored relationship). */
export function getCommercialPartners(): PartnerOffer[] {
  return partnerOffers.filter((p) => p.relationship !== "none");
}
