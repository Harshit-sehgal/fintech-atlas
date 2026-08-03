# Issues & Gaps — FinTech Atlas

> Open gaps only (fixed items removed). Complements
> [GAP-ANALYSIS.md](./GAP-ANALYSIS.md) and the per-goal checklists.
> Last refreshed: **2026-08-03**.

**Architecture context:** fully static Next.js 16 export (`output: "export"`) —
no server, database, auth, or live third-party data feeds.
Backend-heavy goals are deferred per [ADR-001](../adr/001-defer-backend-capabilities.md).

---

## Status legend

| Mark | Meaning |
|------|---------|
| 🔴 | Blocked / deferred on backend (see ADR-001) |
| 🟡 | Buildable on current static architecture; incomplete |
| 🟢 | Mostly implemented; verification / hardening remains |
| ⚠️ | Contradiction or consistency issue |

---

## 1. Release criteria (production gate)

| # | Gap | Status |
|---|-----|--------|
| R1 | All critical features meet their Definition of Done | Open |
| R2 | No unresolved critical or high-severity defects | Open |
| R3 | Automated tests for critical paths pass consistently on `origin/main` | Open (local suite strong; merge/CI evidence remains) |
| R4 | Monitoring, alerting, logging, and backups are active | 🔴 Deferred (ADR-001) / host-level |
| R5 | Security review is complete | Open |
| R6 | Performance targets are met (live-host evidence) | Open |
| R7 | Documentation is current | Open (provider docs added; legal review remains) |
| R8 | Deployment process is repeatable and supports verified rollback | Open (docs exist; drill not done) |
| R9 | Jurisdiction-specific legal review before launch | Open |
| R10 | E2E journey with registration | 🔴 Deferred (ADR-001) |
| R11 | v1 journey: calculator → persist → export/share → return | 🟢 Fee/remittance/matchmaker tools support save/share/CSV; e2e covers matchmaker flow + bookmarks persistence |

---

## 2. Deferred backend goals (🔴 — ADR-001)

Do not implement without revisiting [ADR-001](../adr/001-defer-backend-capabilities.md):

- Goal 01 Identity & auth
- Goal 03 AI assistant
- Goal 04 live market data / ETF / statements / APIs
- Goal 05 Portfolio tracker (server persistence)
- Goal 06 Personal finance ledgers (server persistence)
- Goal 11 Full observability stack
- Goal 13 Account-based product analytics (retention/churn)

---

## 3. Remaining product / tool gaps

| Gap | Status |
|-----|--------|
| PDF export for calculators | Open |
| Share / save / CSV parity on remittance + matchmaker | Open |
| Typo-tolerant search beyond current fuzzy scoring | Ongoing polish |
| Stocks / ETFs / funds / articles search content | 🔴 Deferred with Goal 04/07 content |
| Production `SITE_URL` set on real host | Operator action |
| Indexability / CWV / structured-data verification on live URLs | Open |
| Host applies `_headers` + serves `security.txt` | Operator action |
| Penetration test | Open |
| Preview environments + CD / deploy workflow | Open |
| Rollback / backup restoration drill | Open |
| Manual keyboard + screen-reader audit | Open |
| Provider-specific ops beyond [`deployment-providers.md`](../deployment-providers.md) | Ongoing |

---

## 4. Architecture & product surface

| ID | Gap |
|----|-----|
| A4–A5 | Partner / monetization helpers exist but are unused; all relationships `"none"` |
| A6 | Waitlist endpoint stub — no UI until `NEXT_PUBLIC_WAITLIST_ENDPOINT` + product decision |
| A10 | `docs/monetization/PARTNER-PLAYBOOK.md` missing |
| A11 | No i18n (`lang="en"` only) |
| A12 | No RSS / changelog feed |
| A13 | PWA: manifest only — no service worker / offline |
| A14 | `"private": true` vs MIT LICENSE intent |

---

## 5. Data & content quality

| ID | Gap |
|----|-----|
| D1–D3 | Provenance migration incomplete (legacy `sources` strings; no structured `sourceReferences` on catalog) |
| D4 | Logos missing: `affirm`, `chime`, `plaid`, `sofi` |
| D5–D7 | Manual FX / fee / `DATA_AS_OF` / editorial refresh |
| D8 | Possible editorial quality issues in company copy |
| D9 | Illustrative fee/FX assumptions — freshness risk |
| D10 | On-device notes still review-shaped UX |

---

## 6. WIP / engineering

| ID | Gap |
|----|-----|
| W3–W4 | E2E + security/Lighthouse workflows present locally — merge to `origin/main` + enable GitHub settings |
| W7 | Dual lockfiles resolved (npm only) — ensure `pnpm-*` stay deleted |
| E1–E4 | No CD, previews, verified rollback/restore | 🟡 CD added (`.github/workflows/deploy.yml` → GitHub Pages); previews + verified rollback drill remain |
| E7 | No structured-data validation in CI | 🟢 Done — `scripts/check-structured-data.mjs` runs in `postbuild`; 158 JSON-LD blocks validated |
| E11 | Audit triage policy thin |
| E15 | ESLint pinned to v9 until eslint-config-next supports 10 |
| E17 | Secret scanning needs GitHub repo settings |
| E18 | Incident runbook recovery checklist unchecked |
| S5 | Glossary hash deep links are not separate sitemap URLs (by design for static anchors) |
| S9–S10 | `next/image` unused; Framer Motion bundle budget watch |
| S13 | Mirror high-priority gaps into GitHub Issues |

---

## 7. Docs / legal / consistency

| ID | Gap |
|----|-----|
| L1 | Jurisdiction-specific legal review |
| C3 | Goals 11/13 vs privacy stance — mitigated by ADR-001; keep docs aligned |
| C8 | Enabling Plausible needs operator env + privacy already discloses optional analytics |

---

## 8. How to maintain

- Delete rows when closed; do not keep a closed backlog here.
- Backend ambitions require a new ADR superseding ADR-001.
