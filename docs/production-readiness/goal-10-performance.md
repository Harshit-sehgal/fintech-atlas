# Goal 10 — Performance

**Status:** 🟢 Static export is naturally fast · **Action:** set CWV budgets + measure

**Objective:** CDN, image optimization, lazy loading, caching, database indexing.

## Requirements
- [x] CDN (any static host serves via CDN by default)
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Caching
- [x] Database indexing (N/A — no database)

## Definition of Done
- [ ] LCP, INP, and CLS meet the target budgets on representative pages.
- [ ] Representative API endpoints meet latency targets under expected load (N/A — no API).
- [ ] Pages remain responsive under realistic traffic.

## Status vs. this codebase
- Static HTML/CSS with no server round-trips and no DB is inherently fast and
  cheap to scale; the static architecture keeps LCP/CLS straightforward to
  measure. The postbuild JavaScript budget is currently enforced at 450 KB
  compressed (see `scripts/check-performance-budget.mjs`).
- Asset strategy: catalog marks are small SVGs or inline fallbacks, so `next/image`
  is not currently a meaningful optimization. Confirm cache headers at the host,
  measure LCP/INP/CLS on representative live URLs, and audit the Framer Motion
  bundle if INP becomes a concern.
