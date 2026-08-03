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
- **Mostly implemented:** per-route metadata + OG in `src/app/layout.tsx` and
  page files; JSON-LD in `src/components/SEO/`; canonical via `SITE_URL`;
  `scripts/generate-sitemap.mjs` (64 URLs + robots) runs on every build.
- DoD actions required: validate schemas (e.g. Rich Results Test), audit for
  duplicate/short metadata, and measure CWV on live URLs once `SITE_URL` is set
  to the real production domain (currently a placeholder).
