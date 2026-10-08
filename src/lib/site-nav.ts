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
   * This exists because several surfaces legitimately answer the same question
   * ("show me fintech companies"). The URL alone cannot explain the difference,
   * so the menu carries the distinction instead of leaving the reader to guess:
   *
 *   /companies          42 curated worldwide profiles
 *   /global-directory   research directory of firms worldwide
 *   /india/directory     full searchable list of Indian firms
 *   /directory          hub linking every tier together
 *   /categories         the same companies grouped by industry instead
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
 * Primary navigation — the six decision surfaces. Everything else lives in
 * "More" so the bar stays calm and scannable (proven comparison-site pattern).
 *
 * These stay short because they sit in a single horizontal row at every
 * breakpoint; the grouped menu below is where nuance lives.
 */
export const primaryNav: NavItem[] = [
  { href: "/india", label: "India" },
  { href: "/radar", label: "Radar" },
  { href: "/companies", label: "Companies" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/articles", label: "Guides" },
];

/**
 * Secondary navigation, grouped. Order is deliberate: "Browse" first because
 * looking something up is the most common intent, "Saved" late because it is
 * personal rather than exploratory.
 */
export const moreNavGroups: NavGroup[] = [
  {
    heading: "Browse",
    items: [
      {
        href: "/categories",
        label: "By industry",
        description: "Payments, banking, lending and more",
      },
      {
        href: "/global-directory",
        label: "Global directory",
        description: "Research directory of firms worldwide",
      },
      {
        href: "/india/directory",
        label: "India directory",
        description: "Full searchable list of Indian firms",
      },
      {
        href: "/directory",
        label: "All directories",
        description: "Curated profiles plus every research list",
      },
      {
        href: "/glossary",
        label: "Glossary",
        description: "Plain-language fintech terms",
      },
    ],
  },
  {
    heading: "Tools & data",
    items: [
      {
        href: "/services",
        label: "Services",
        description: "Consulting and implementation help",
      },
      {
        href: "/bookmarks",
        label: "Saved",
        description: "Bookmarks, notes and calculator sessions",
      },
    ],
  },
  {
    heading: "Radar",
    items: [
      {
        href: "/radar/watchlist",
        label: "Watchlist",
        description: "Companies you are tracking",
      },
      {
        href: "/radar/activity",
        label: "Activity",
        description: "Licence and regulatory events",
      },
      {
        href: "/radar/review",
        label: "Review queue",
        description: "Regulatory changes to review",
      },
    ],
  },
  {
    heading: "Site",
    items: [
      {
        href: "/about",
        label: "About",
        description: "Methodology and sources",
      },
      {
        href: "/changelog",
        label: "Changelog",
        description: "What changed and when",
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
  { href: "/companies", label: "Companies" },
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