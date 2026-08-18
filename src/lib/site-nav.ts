/**
 * Single source of truth for site navigation.
 *
 * Every nav surface (header, footer, mobile, bottom bar) derives its links
 * from these lists so adding or renaming a section is one edit, not three
 * parallel ones. Keep entries in display order.
 */

export interface NavItem {
  href: string;
  label: string;
}

/**
 * Primary navigation — the five decision surfaces. Everything else lives in
 * "More" so the bar stays calm and scannable (proven comparison-site pattern).
 */
export const primaryNav: NavItem[] = [
  { href: "/india", label: "India" },
  { href: "/radar", label: "Radar" },
  { href: "/companies", label: "Companies" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/articles", label: "Guides" },
];

export const moreNav: NavItem[] = [
  { href: "/categories", label: "Categories" },
  { href: "/glossary", label: "Glossary" },
  { href: "/services", label: "Services" },
  { href: "/bookmarks", label: "Saved" },
  { href: "/about", label: "About" },
  { href: "/changelog", label: "Changelog" },
];

/**
 * App-like bottom navigation for touch screens (hidden on lg+ where the
 * desktop bar shows everything). Kept to the five highest-value destinations
 * so each target stays thumb-sized on a 360px viewport.
 */
export const bottomNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/companies", label: "Companies" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/bookmarks", label: "Saved" },
];

/** Footer "Explore" column — the broad site map. */
export const footerExploreLinks: NavItem[] = [
  { href: "/india", label: "India — Payments & Gateways" },
  { href: "/radar", label: "FinTech Radar (intelligence view)" },
  { href: "/radar/activity", label: "Radar Activity (licence events)" },
  { href: "/radar/watchlist", label: "Radar Watchlist" },
  { href: "/radar/review", label: "Radar Review Queue (research console)" },
  { href: "/india/directory", label: "India FinTech Directory" },
  { href: "/directory", label: "FinTech Directory (all tiers)" },
  { href: "/services", label: "Services & Consulting" },
  { href: "/companies", label: "Companies Directory" },
  { href: "/categories", label: "Industry Categories" },
  { href: "/compare", label: "Side-by-Side Comparison" },
  { href: "/glossary", label: "FinTech Glossary" },
  { href: "/articles", label: "Guides & Comparisons" },
  { href: "/changelog", label: "Site Changelog" },
  { href: "/bookmarks", label: "Saved Bookmarks" },
];

export const footerAboutLinks: NavItem[] = [
  { href: "/about", label: "Methodology & Sources" },
  { href: "/about#faq", label: "Frequently Asked Questions" },
  { href: "/about#disclaimer", label: "Educational Disclaimer" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  { href: "/privacy", label: "Privacy Notice" },
  { href: "/terms", label: "Terms of Use" },
  {
    href: "https://github.com/Harshit-sehgal/fintech-atlas/issues/new/choose",
    label: "Feedback & Issues",
  },
];