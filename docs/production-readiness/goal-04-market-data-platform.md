# Goal 04 — Market Data Platform

**Status:** 🟡 Static profiles; no live market data · **Blocker:** live feeds + refresh

**Objective:** Company profiles and market/fund data with search and statements.

## Requirements
- [ ] Company profiles
- [ ] ETF data
- [ ] Mutual fund data
- [ ] Search
- [ ] Financial statements
- [ ] Ratios
- [ ] Dividend history
- [ ] Earnings summaries

## Definition of Done
- [ ] Data refresh succeeds on schedule.
- [ ] Missing or stale data is clearly indicated.
- [ ] Search is responsive and returns relevant results.
- [ ] APIs expose consistent, documented schemas.

## Status vs. this codebase
- **Company profiles exist** as curated static data (`src/data/companies.ts`, 41
  companies) with `DATA_AS_OF` (`Q3 2026`) labeling freshness.
- ETF/mutual-fund/statements/ratios/dividends/earnings do **not** exist.
- Live market data requires feeds + a refresh job. A fully static site can only
  offer curated, stale data — which the DoD ("stale clearly indicated") partly
  supports via `DATA_AS_OF`; "refresh on schedule" and "search" imply a build/data
  pipeline (`scripts/fetch-logos.ts` is a model for a fetch job).
