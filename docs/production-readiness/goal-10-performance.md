# Goal 10 — Performance

**Status:** 🟢 Static export is naturally fast · **Action:** set CWV budgets + measure

**Objective:** CDN, image optimization, lazy loading, caching, database indexing.

## Requirements
- [x] CDN (any static host serves via CDN by default)
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Caching
- [ ] Database indexing (N/A — no database; mark as such)

## Definition of Done
- [ ] LCP, INP, and CLS meet the target budgets on representative pages.
- [ ] Representative API endpoints meet latency targets under expected load (N/A — no API).
- [ ] Pages remain responsive under realistic traffic.

## Status vs. this codebase
- Static HTML/CSS with no server round-trips and no DB is inherently fast and
  cheap to scale; the TipTap/NoDB architecture keeps LCP/CLS trivial to hit.
- Actionable: set explicit budgets, use responsive images +
  `next/image`-style optimization where large assets appear (logos are SVGs
  today), and confirm caching headers at the host. `framer-motion` + static
  content is light; audit bundle size if INP is a concern.
