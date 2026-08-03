# Goal 14 — Accessibility

**Status:** 🟢 Largely implemented · **Action:** add automated scan + manual audit

**Objective:** Keyboard navigation, screen-reader support, contrast, focus management, semantic markup.

## Requirements
- [x] Keyboard navigation
- [x] Screen reader support
- [x] Sufficient color contrast
- [x] Focus management
- [x] Semantic markup

## Definition of Done
- [ ] Key user flows are fully usable without a mouse.
- [ ] Automated accessibility scans pass the chosen threshold.
- [ ] Manual testing confirms core workflows are accessible.

## Status vs. this codebase
- Strong baseline: skip links + focus management in `src/app/layout.tsx`,
  WCAG-AA contrast tokens in `globals.css` (with `prefers-contrast` and
  `forced-colors` handling), `prefers-reduced-motion` support, semantic headings,
  and an automated `heading-hierarchy.test.ts` guard.
- DoD actions: add an automated axe/lighthouse accessibility scan to CI, and run
  a manual keyboard + screen-reader pass over the calculators and command palette.
