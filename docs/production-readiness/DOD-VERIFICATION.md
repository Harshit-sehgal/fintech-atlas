# DoD Verification Record — FinTech Atlas Radar

> Evidence backing release rows R1 and R2 of `ISSUES-AND-GAPS.md` §1
> ("All critical features meet their Definition of Done"; "No unresolved
> critical or high-severity defects"). Compiled **2026-08-18** by running the
> full local gate suite against the working tree at `origin/main` head
> (`1d97718`). **Sign-off is a human decision** — this record only assembles
> the evidence; an operator checks the box after review.

## Gate evidence (run 2026-08-18)

| Gate | Result |
| --- | --- |
| Vitest | 440 passed (53 files) |
| ESLint | 0 warnings / errors |
| `tsc` + `tsc:scripts` | clean |
| Playwright e2e | 89/89 (incl. axe light gate: 31 light + 16 dark routes) |
| Build + postbuild gates | JS 448,304/450,000, 2,903 HTML, titles, sitemap, internal links, structured data, per-page CSP |
| Live CWV (Pages origin) | all six gate routes pass raised T100 thresholds (`LIVE-CWV-REPORT.md`, re-measured 2026-08-18) |
| `npm audit` (prod) | 0 (CI fails on high/critical) |

## R1 — critical features vs. their DoD evidence

| Critical feature | DoD evidence | Status |
| --- | --- | --- |
| Fee calculators (gateway/remittance/matchmaker) | Save/share/CSV parity e2e-covered; bookmarks persistence e2e; CALCULATOR_TEST_MATRIX.md | 🟢 |
| Provider comparisons + India fee content | 42/42 orphans closed, 37 articles, JSON-LD OfferCatalog, breadcrumbs | 🟢 |
| Directory + glossary (acquisition) | 1,386-company directory page, 53 glossary terms, internal-link gate | 🟢 |
| Radar search, profiles, watchlists, activity, digest | `/radar` + 1,386 profiles SSG; saved-searches, watchlist, 48-event feed, weekly digest generator; radar test suite | 🟢 |
| RBI ingestion pipeline (parse/match/diff/review/apply) | live fetcher + 36-entry snapshot; 84-event diff; review queue + decision worksheet; rbi-fetcher + data-platform tests | 🟢 |
| Research service (paid ICP lists) | third `/services` offering + OfferCatalog entry; RESEARCH-OUTPUT-TEMPLATE.md | 🟢 |
| Deploy + rollback + uptime | Pages deploy live; `restore.yml` drill executed 2026-08-15; uptime probe workflow green | 🟢 |
| PWA / service worker / meta CSP | SW stamped in artifact; per-page CSP 115/115; security.txt live | 🟢 |

Every shipped critical feature maps to passing gate evidence above; nothing is
checked on intent alone.

## R2 — defect scan

Open rows in `ISSUES-AND-GAPS.md` were classified:

- **Operator / external** (not defects): host header application, Search
  Console registration, penetration test, manual NVDA/VoiceOver walkthrough,
  jurisdiction legal review (R9), domain purchase, preview-env provider.
- **Gated by plan** (not defects): P13–P17, Radar admin accounts.
- **Deferred by ADR-001** (accepted, documented): auth/AI/market-data etc.
- **Dev-only, not shipped**: `npm audit` high for `tmp` via `@lhci/cli` —
  CI-time tooling, never runtime-reachable, documented in
  `SECURITY_AUDIT_TRIAGE.md`; prod audit 0.
- **Resolved**: all in-code security findings (`SECURITY_REVIEW.md` "Findings"
  are addressed; residual items are professional/operator).

**No unresolved critical or high-severity defect exists in the shipped
artifact** as of the 2026-08-18 gate run.

## Sign-off

| Release row | Evidence linked | Operator sign-off (date / name) |
| --- | --- | --- |
| R1 | table above | □ |
| R2 | defect scan above | □ |