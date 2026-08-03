# Gap Analysis — v1.0 production-readiness goals vs. current codebase

> Objective assessment of each goal against the **current architecture**:
> a fully **static Next.js 16 export** (`output: "export"`) with no server, no
> database, no auth, and no third-party data feeds. "Requires backend" is a
> factual statement about the architecture, not an excuse — it tells us what
> must be built or decided before a goal can turn green.

---

## What the site already delivers (relevant context)

| Capability | Where |
|---|---|
| Company directory (41 companies, 12 categories, 24-term glossary) | `src/data/*`, `/companies`, `/categories`, `/glossary` |
| Interactive tools (fee estimator, FX remittance, matchmaker quiz) | `src/app/tools/*` |
| Local-only bookmarks + ⌘K command palette | `src/lib/bookmarks-context.tsx`, `command-palette.tsx` |
| SEO (metadata, canonical, OG, JSON-LD, sitemap, robots) | `src/app/layout.tsx`, `src/components/SEO/*`, `scripts/generate-sitemap.mjs` |
| Accessibility (skip links, focus ring, reduced-motion, contrast tokens) | `src/app/layout.tsx`, `globals.css`, `heading-hierarchy.test.ts` |
| Automated tests (Vitest, 153 passing) | `src/__tests__/*`, `src/{lib,data}/**/*.test.ts` |
| Static build + sitemap postbuild | `package.json`, `next.config.ts` |

---

## Goal-by-goal feasibility

| # | Goal | Current state | Gap | Feasibility on static site |
|---|---|---|---|---|
| 01 | Identity & User Mgmt | None | Auth, sessions, 2FA, email | 🔴 Backend + identity provider required |
| 02 | Financial Calculators | 3 decision tools | SIP/SWP/EMI/CAGR/retirement/FIRE/inflation/loan/net-worth/emergency + save/export/share | 🟡 Buildable client-side (JS) — no backend needed; shareable URLs need a codec/route |
| 03 | AI Assistant | None | Model API, chat, grounding, rate limiting | 🔴 Model service + API + safety layer |
| 04 | Market Data | Static profiles only | Live ETF/fund/statement/ratio/dividend/earnings data, APIs | 🔴 Data feeds + refresh pipeline (or curated static pay-for-stale, which violates DoD's "stale clearly indicated") |
| 05 | Portfolio Tracker | Bookmarks only | Persisted holdings/transactions, perf, benchmarks | 🔴 Persistence + backend |
| 06 | Personal Finance | None | Persisted budgets/cash flow | 🔴 Persistence + backend |
| 07 | Search | ⌘K palette (client-side) | Full-site search, typo tolerance, dedupe, empty states | 🟡 Buildable client-side over static content |
| 08 | SEO | Largely implemented | Verify indexability, no dupes, CWV budgets, schema validation | 🟢 Mostly green; action is measurement + hardening |
| 09 | Security | Small static surface, no secrets in repo | Host-level HTTPS/headers, CSP, rate limiting (n/a client-side), audit | 🟡 Mostly a hosting + policy concern; no app-level DB/data to protect |
| 10 | Performance | Static export (no DB, no server) | Set CWV budgets, image optimization, caching headers | 🟢 Measure against budget; enable image optimization where sensible |
| 11 | Observability | None (privacy-by-design) | Analytics/error tracking/monitoring/alerts | 🟡 Add zero/low-footprint monitoring + document the privacy decision |
| 12 | Deployment | `npm run build` + tests, sitemap script | No CI config, no preview envs, no rollback/backup doc | 🟡 Static host deploys simply; add CI + runbook |
| 13 | Product Analytics | None (README: "no tracking") | Event tracking, funnels, retention | 🟡 Conscious privacy decision must be revisited if analytics are wanted |
| 14 | Accessibility | Largely implemented | Automated scan (axe) + manual keyboard pass | 🟢 Add scan + manual audit; fix findings |
| 15 | Documentation | Single README | This folder, runbook, contribution guide, legal pages | 🟡 Mostly writing work |

---

## Recommended sequencing

**Phase A — green/cheap now (no backend):**
08 SEO → 14 Accessibility → 10 Performance → 12 Deployment (CI) → 15 Documentation.

**Phase B — client-side feature work (worthwhile on this architecture):**
02 Financial Calculator Platform (build the calculators + save/export/share),
07 Search.

**Phase C — requires a product/architecture decision before any code:**
01, 03, 04, 05, 06, 11, 13. These contradict the current "static, no tracking,
guest-only" product stance and need a scoping + legal + infrastructure decision
(format: a short ADR per goal).

---

## The one validated journey (per Release Criteria)

- **Current (achievable now):** open site → run a calculator → persist result
  (localStorage/bookmark) → export/share link → return later.
- **Spec (v2.0, blocked on Goals 01–06):** register → use calculators → save data
  → return → export/share.
