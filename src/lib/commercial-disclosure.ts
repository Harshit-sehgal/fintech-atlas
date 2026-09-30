/**
 * The single affiliate-disclosure sentence, in its own leaf module so
 * client components that must render it never need to import the partner
 * resolution graph (lib/partners → data/partners → company catalog).
 */

export const COMMERCIAL_DISCLOSURE =
  "Disclosure: some links on this page are affiliate links — we may earn a commission at no extra cost to you when you purchase or sign up through them. This never affects our editorial ratings, rankings, or pricing comparisons.";
