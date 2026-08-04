# FinTech Atlas — Production Readiness (v1.0)

> Version-controlled goal checklists. Every goal is a verifiable engineering
> requirement with explicit **Requirements** and a **Definition of Done (DoD)**.
> Nothing is "done" until its DoD is checked, evidence-linked, and reviewed.
>
> **Start here:** read the [Gap Analysis](GAP-ANALYSIS.md) first — it maps every
> goal to the current static architecture and recommends a sequencing order.
> For the full actionable inventory (product, data, CI, WIP, contradictions),
> see [Issues & Gaps](ISSUES-AND-GAPS.md). Backend deferrals:
> [ADR-001](../adr/001-defer-backend-capabilities.md).
> Hosting notes: [deployment-providers.md](../deployment-providers.md).
>
> Track progress with the checkboxes below. Keep this folder under version
> control so status changes are reviewable like any other code change. Mirror
> the checkboxes into your tracker of choice (GitHub Projects / Linear / Jira).

## Status legend

| Mark | Meaning |
|---|---|
| 🟢 | Implementable on the **current static architecture** (no backend required) — actionable today |
| 🟡 | Partially in place / needs further design or a decision |
| 🔴 | Requires a **backend / third-party service / infrastructure** — blocked on this site's static export |

## Goals

| # | Goal | Status summary | Checklist |
|---|---|---|---|
| 01 | [Identity & User Management](goal-01-identity-user-management.md) | 🔴 Static site has no accounts | Per-user state only (bookmarks) |
| 02 | [Financial Calculator Platform](goal-02-financial-calculator-platform.md) | 🟢 Core calculators + save/share/CSV/print-to-PDF parity | Maintain and verify |
| 03 | [AI Financial Assistant](goal-03-ai-financial-assistant.md) | 🔴 Requires model service + API | Grounding/refusal to design |
| 04 | [Market Data Platform](goal-04-market-data-platform.md) | 🟡 Static company profiles; no live market data | Data build + refresh |
| 05 | [Portfolio Tracker](goal-05-portfolio-tracker.md) | 🔴 Requires account persistence | — |
| 06 | [Personal Finance](goal-06-personal-finance.md) | 🔴 Requires account persistence | — |
| 07 | [Search](goal-07-search.md) | 🟢 Client-side catalog search with fuzzy ranking | Market-data search deferred |
| 08 | [SEO](goal-08-seo.md) | 🟢 Metadata, structured data, sitemap, robots, and artifact validation | Verify live host |
| 09 | [Security](goal-09-security.md) | 🟢/🟡 Static baseline, production audit, disclosure, and generated headers | Verify host + external pentest |
| 10 | [Performance](goal-10-performance.md) | 🟢 Static export is naturally fast; budget CWV | Measure & budget |
| 11 | [Observability](goal-11-observability.md) | 🟡 Uptime workflow scaffold; no error tracking | Configure `DEPLOYMENT_URL` + decide |
| 12 | [Deployment](goal-12-deployment.md) | 🟡 Build + tests + CI + runbook; preview/provider drill remain | Finish host setup |
| 13 | [Product Analytics](goal-13-product-analytics.md) | 🟡 No tracking by design (`README`) | Decide & add |
| 14 | [Accessibility](goal-14-accessibility.md) | 🟢 Lighthouse/E2E/code-level coverage | Manual audit remains |
| 15 | [Documentation](goal-15-documentation.md) | 🟡 README + contribution, legal, security, and incident docs | Finish provider/legal review |

## Release Criteria (Production Ready)

The application is **production ready** only when **all** of the following hold.
This is the single gate — treat each line as a hard requirement, not a wish.

- [ ] All critical features meet their Definition of Done.
- [ ] No unresolved critical or high-severity defects.
- [x] Automated tests for critical paths pass locally (282 Vitest tests + 18 Playwright E2E journeys); CI/origin-main evidence remains required.
- [ ] Monitoring, alerting, logging, and backups are active.
- [ ] Security review is complete.
- [ ] Performance targets are met.
- [ ] Documentation is current.
- [ ] The deployment process is repeatable and supports rollback.
- [x] Privacy notice, terms of use, and educational disclaimer are published for the current static demo; jurisdiction-specific legal review remains required before launch.
- [ ] One end-to-end user journey validated:
      **registration → use calculators → save data → return → export/share**.

> **Note on the end-to-end journey:** the current site is a **static export** with
> no accounts, so "registration" and "save data → return" require backend work
> (Goals 01–06). Until then, the closest validatable journey is:
> **load site → use a calculator → bookmark data (localStorage) → export/share a
> bookmark link → return**. Treat the spec's full journey as the v2.0 gate.

## How to run these checklists

1. Pick one goal per sprint (or per PR) — never "improve UI" with no DoD.
2. Check only what is true; link evidence (test names, build URL, screenshot)
   in the file or PR.
3. A goal is only "complete" when its DoD boxes are all checked.
