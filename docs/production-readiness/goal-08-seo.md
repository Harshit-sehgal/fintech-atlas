# Goal 08 — SEO

**Status:** 🟢 Largely implemented · **Action:** measure + harden (no backend needed)

**Objective:** Metadata, structured data, canonicals, sitemap, robots, semantic HTML.

## Requirements
- [x] Metadata (title/description per page, OG/Twitter)
- [x] Structured data (JSON-LD)
- [x] Canonicals
- [x] Sitemap
- [x] Robots
- [x] Semantic HTML

## Definition of Done
- [ ] Pages are indexable where intended.
- [ ] No duplicate metadata.
- [ ] Core Web Vitals meet the target on representative pages.
- [ ] Structured data validates.

## Status vs. this codebase
- **Implemented in-repo:** per-route metadata + OG in `src/app/layout.tsx` and
  page files; JSON-LD in `src/components/SEO/`; canonical via `SITE_URL`;
  `scripts/generate-sitemap.mjs` runs on every build; emitted JSON-LD is checked
  by `scripts/check-structured-data.mjs`.
- Remaining DoD actions are external verification: validate schemas with a rich
  results validator, audit live indexability and duplicate metadata, and measure
  CWV after `SITE_URL` is set to the real production domain.
