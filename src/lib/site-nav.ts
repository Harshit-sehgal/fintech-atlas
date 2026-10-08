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
  /**
   * One-line clarifier shown next to the label in the grouped "More" menu.
   *
   * The global research directory is the single "companies" surface: it
   * lists every tracked fintech and financial institution by region and
   * country. The remaining browse entries are genuinely different views,
   * not duplicates of it:
   *
   *   /global-directory  every tracked company, by region and country
   *   /categories        the curated companies grouped by industry instead
   *   /directory         hub linking the research and category surfaces
   */
  description?: string;
}

/**
 * A named cluster of secondary destinations.
 *
 * A flat ten-item menu is a list, not a structure: readers scan it, find nothing
 * that matches what they want, and conclude the site is disorganised. Grouping
 * turns "where do I look?" into a two-step decision.
 */
export interface NavGroup {
  heading: string;
  items: NavItem[];
}

/**
 * Primary navigation — four pillars. Everything else is reference material in
 * "More". The site answers four questions: who is out there (Companies), how do
 * they compare (Compare), what does it cost (Tools), and how does it work
 * (Guides). Radar/watching is a *view of Companies*, not a pillar.
 *
 * These stay short because they sit in a single horizontal row at every
 * breakpoint; the grouped menu below is where nuance lives.
 */
export const primaryNav: NavItem[] = [
  { href: "/global-directory", label: "Companies" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/articles", label: "Guides" },
];

/**
 * Secondary navigation, grouped. "Companies" holds the other ways to slice the
 * same index (industry, regulatory activity, saved); "Reference" holds the
 * encyclopedic material.
 */
export const moreNavGroups: NavGroup[] = [
  {
    heading: "Companies",
    items: [
      {
        href: "/categories",
        label: "By industry",
        description: "The same companies grouped by sector",
      },
      {
        href: "/radar/activity",
        label: "Regulatory changes",
        description: "Licence and status events",
      },
      {
        href: "/bookmarks",
        label: "Saved",
        description: "Bookmarks, notes and calculator sessions",
      },
    ],
  },
  {
    heading: "Reference",
    items: [
      {
        href: "/glossary",
        label: "Glossary",
        description: "Plain-language fintech terms",
      },
      {
        href: "/about",
        label: "About & method",
        description: "Sourcing, scoring and independence",
      },
      {
        href: "/changelog",
        label: "Changelog",
        description: "What changed and when",
      },
    ],
  },
  {
    heading: "Work with us",
    items: [
      {
        href: "/services",
        label: "Services",
        description: "Consulting and implementation help",
      },
    ],
  },
];

/**
 * Flat view of {@link moreNavGroups}, for surfaces that render one list (the
 * mobile drawer, active-state checks). Derived rather than hand-maintained so
 * the grouped menu stays the only place entries are declared.
 */
export const moreNav: NavItem[] = moreNavGroups.flatMap((group) => group.items);

/**
 * App-like bottom navigation for touch screens (hidden on lg+ where the
 * desktop bar shows everything). Kept to the five highest-value destinations
 * so each target stays thumb-sized on a 360px viewport.
 */
export const bottomNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/global-directory", label: "Companies" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/bookmarks", label: "Saved" },
];

/**
 * Footer "Explore" column — the broad site map.
 *
 * Derived from the same registry the header uses, so a destination is called
 * one thing across the whole site. This column used to restate every entry by
 * hand with different wording ("Companies" in the bar, "Companies Directory"
 * here; "Radar Review Queue (research console)" here and nowhere else), which
 * made the footer read as a second, competing navigation rather than a
 * backstop. `/about` is dropped because footerAboutLinks already owns it.
 */
export const footerExploreLinks: NavItem[] = [
  ...primaryNav,
  ...moreNav.filter((item) => item.href !== "/about"),
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