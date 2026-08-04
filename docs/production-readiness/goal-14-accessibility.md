# Goal 14 — Accessibility

**Status:** 🟢 Automated Lighthouse gate implemented · **Action:** complete manual audit

**Objective:** Keyboard navigation, screen-reader support, contrast, focus management, semantic markup.

## Requirements
- [x] Keyboard navigation
- [x] Screen-reader semantics and accessible names implemented (manual audit pending)
- [x] Sufficient color contrast
- [x] Focus management
- [x] Semantic markup

## Definition of Done
- [ ] Key user flows are fully usable without a mouse.
- [x] Automated accessibility scans pass the chosen threshold.
- [ ] Manual testing confirms core workflows are accessible.

## Status vs. this codebase
- Strong baseline: skip links + focus management in `src/app/layout.tsx`,
  WCAG-AA contrast tokens in `globals.css` (with `prefers-contrast` and
  `forced-colors` handling), `prefers-reduced-motion` support, semantic headings,
  and an automated `heading-hierarchy.test.ts` guard.
- Automated Lighthouse CI runs the accessibility category with a 0.90 minimum
  score in `.github/workflows/lighthouse.yml` and `lighthouserc.json`; the local
  Playwright suite also covers keyboard palette control, calculator controls,
  theme switching, and representative route navigation.
- Remaining DoD action: run and document a manual keyboard + screen-reader pass
  over the calculators and command palette.
