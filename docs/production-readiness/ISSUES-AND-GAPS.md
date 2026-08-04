# Issues & Status — FinTech Atlas

> Actionable gaps and current status (completed items are marked 🟢 rather than
> removed so the repository-level audit trail remains readable). Complements
> [GAP-ANALYSIS.md](./GAP-ANALYSIS.md) and the per-goal checklists.
> Last refreshed: **2026-08-04**. Repository-level static-v1 work is current through the India-focus pass (fee calculator INR mode + GST, Razorpay vs Stripe + Razorpay vs Cashfree articles/presets, homepage repositioning + Popular Comparisons, per-article sitemap lastmods, GitHub Actions uptime monitor, Payoneer fees India article, Payoneer profile copy repair, dedicated Razorpay fee calculator page, catalog-wide editorial copy sweep, T049/T050/T051/T055 link + breadcrumb structured-data wiring, India-first homepage provider directory + latest-guides strip, India payment glossary terms) and PWA browser verification.

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
| R3 | Automated tests for critical paths pass consistently on `origin/main` | 🟢 Local Vitest + 18-test Playwright suite pass; merge/CI evidence remains |
| R4 | Monitoring, alerting, logging, and backups are active | 🟡 Repo-level uptime workflow added (30-minute probes of homepage/tools/articles → GitHub issue alerts; needs `DEPLOYMENT_URL` + GitHub settings); host-level logging/backups remain operator tasks (ADR-001) |
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
| PDF export for calculators | 🟢 Implemented via browser print dialog |
| Share / save / CSV parity on remittance + matchmaker | 🟢 Implemented; verify in browser/E2E |
| Typo-tolerant search beyond current fuzzy scoring | 🟢 Implemented for current static catalog; market-data scope deferred |
| Stocks / ETFs / funds / articles search content | 🔴 Deferred with Goal 04/07 content |
| Production `SITE_URL` set on real host | Operator action |
| Indexability / CWV / structured-data verification on live URLs | Open |
| Host applies `_headers` + serves `security.txt` | Operator action |
| Penetration test | Open |
| Preview environments + CD / deploy workflow | Open |
| Rollback / backup restoration drill | Open |
| Manual keyboard + screen-reader audit | Open |
| Provider-specific ops beyond [`deployment-providers.md`](../deployment-providers.md) | Ongoing |
| Dedicated Razorpay fee calculator page (`/tools/razorpay-fee-calculator`) | 🟢 Published-rate table + 18% GST math, reverse-charge formula, INR-preseeded estimator; Razorpay profile CTA updated |
| T049/T050/T051/T055 architecture wiring | 🟢 Every fee-related article links its calculator via a "Try the calculator" box (10/13 articles; receive-side omission closed by the new exchange-rate markup calculator); calculator pages link related comparisons; every company profile links the articles that mention it (server-side, hidden when empty); Article + BreadcrumbList JSON-LD on articles and profiles |
| India-first homepage directory + glossary | 🟢 Homepage "India-First Providers" curated order (Razorpay, Cashfree, Payoneer, Wise, PhonePe, Paytm); glossary +5 India terms (UPI, MDR, FIRC/FIRA, FEMA, T+1) wired into the related-term graph and category maps |
| Matchmaker quiz India coverage | 🟢 Quiz now recommends Indian providers: new "Freelancer / Independent" answer (international + transfers + multi-currency requirements), Cashfree capability entry, Razorpay capabilities extended (SaaS/enterprise, international, multi-currency, low-fee), Payoneer gains personal tier, PhonePe/Paytm score on personal/all-in-one; legacy SCORE_WEIGHTS matrix kept in sync. Verified: freelancer track → Wise/Razorpay/Revolut; SaaS+low-fee → Razorpay/Cashfree lead |
| Exchange-rate markup calculator (`/tools/exchange-rate-markup-calculator`) | 🟢 Input-only FX markup tool (no live-rate claims): mid vs offered rate → markup % + INR/USD loss for both USD→INR and INR→USD; reference corridors table (Payoneer 1–4%, Wise near-mid, ~0.5% balance conversions); share/save/URL-restore; wired as relatedTool on payoneer-fees-india, how-to-send-money-abroad-cheap, wise-vs-payoneer-business-payouts |
| Client bundle diet (company summaries split) | 🟢 Client components now import a generated client-safe summary catalog (`src/generated/company-summaries.ts`, ~9.7 KB gz) instead of the full editorial catalog (~32 KB gz); barrel-import leaks removed (compare-presets, partners, footer, palette, directory clients). JS budget 447,413 → 412,685 / 450,000 with the new tool added; drift gated by `company-summaries.test.ts` + prebuild regeneration |
| Tool discovery + cross-linking sweep | 🟢 Command palette now indexes all 6 tools (Razorpay fee + FX markup calculators were missing); homepage teaser gains the FX Markup button; remittance and matchmaker tool pages get "Related comparisons" sections (T050 pattern) — every tool page except the pure-client calculators suite now links its related articles/tools. Palette discovery e2e added (20/20) |
| Cross-page consistency sweep (FX corridors, footer nav, compare page) | 🟢 Bank-wire FX corridor aligned across remittance tool (4.5% baseline) and markup-page corridor table (1.5–4.5%); footer tools column now lists all 6 tools (Razorpay fee + FX markup were missing); `/compare` gains a "Related comparisons" section (T050 pattern). Verified: typecheck, lint, 298 vitest, 20/20 e2e, SITE_URL build (412,791/450,000), browser smoke |
| E2E math integration coverage | 🟢 Remittance e2e now asserts the ranking contract (Wise leads the default $1,000 model with 0% markup and $4.80 fee; PayPal shows 3.5%) plus the semantic breadcrumb; calculators suite e2e locks all 9 tabs and the SIP→EMI panel switch. Suite: 22/22 |
---

## 4. Architecture & product surface

| ID | Gap |
|----|-----|
| A4–A5 | Partner / monetization helpers exist but are unused; all relationships `"none"` |
| A6 | Waitlist endpoint stub — no UI until `NEXT_PUBLIC_WAITLIST_ENDPOINT` + product decision |
| A10 | Affiliate playbook exists; enrollment, legal review, and live-link verification remain operator tasks |
| A11 | No i18n (`lang="en"` only) |
| A12 | No changelog feed (RSS feed now covers published articles) |

| A14 | `"private": true` vs MIT LICENSE intent |

---

## 5. Data & content quality

| ID | Gap |
|----|-----|
| D1–D3 | Structured provenance is present for all 42 companies; legacy labels still require source-by-source re-verification |
| D4 | Logo asset coverage and branded fallback treatment still need an operator/content pass for any missing real marks |
| D5–D7 | Manual FX / fee / `DATA_AS_OF` / editorial refresh; fee calculator now isolates USD/INR and applies configured India GST, but source freshness remains manual |
| D8 | Possible editorial quality issues in company copy | 🟢 Catalog-wide copy sweep done: ~30 garbled fragments repaired across 25+ profiles (Payoneer, Paytm, PhonePe, Google Pay, Coinbase, Circle, Klarna, Gusto, MoneyGram, OKX, and others); empty user-review pros/cons filled from each entry's own editorial summary; Paytm/PhonePe verified in-browser |
| D9 | Illustrative fee/FX assumptions — freshness risk |
| D10 | On-device newsletter intent and private notes remain local-only UX by design |

---

## 6. WIP / engineering

| ID | Gap |
|----|-----|
| W3–W4 | E2E + security/Lighthouse workflows run on all pushed branches locally — merge to `origin/main` + enable GitHub settings |
| W7 | Dual lockfiles resolved (npm only) — ensure `pnpm-*` stay deleted |
| E7 | Structured-data and internal-link validation | 🟢 Done — `scripts/check-structured-data.mjs` (now also gates BreadcrumbList on every tool page) and `scripts/check-internal-links.mjs` run in `postbuild` and validate the emitted artifact; 252 JSON-LD blocks (BreadcrumbList on all 42 profiles + 13 articles + 7 tool routes incl. the /tools hub), internal-link checker covers 89 HTML files; checker now also enforces per-type required properties (Article/BreadcrumbList/WebSite/Organization) and gates BreadcrumbList on every tool route |
| E11 | Audit triage policy thin |
| E15 | ESLint pinned to v9 until eslint-config-next supports 10 |
| E17 | Secret scanning push-protection still needs GitHub repo settings |
| E18 | Incident runbook recovery checklist remains an operator execution checklist; executable artifact/deployment checks are now documented |
| S5 | Glossary hash deep links are not separate sitemap URLs (by design for static anchors) |
| S9–S10 | `next/image` remains unused (catalog marks are SVG/fallback); Framer Motion bundle budget watch |
| T013-adjacent | Breadcrumb consistency pass | 🟢 Shared `Breadcrumbs` component (visible nav + BreadcrumbList JSON-LD) now used on articles, company profiles, editorial tool pages, and the /tools hub; the four client-island tools gained "Home" links, semantic `<nav aria-label="Breadcrumb">` markup, and server-side BreadcrumbList JSON-LD; `check-structured-data.mjs` hardened with per-type required-property validation (negative-tested: missing BreadcrumbList + missing headline both fail) and `breadcrumbs.test.tsx` covers the component. Verified: 252 JSON-LD blocks, 303 vitest, 20/20 e2e, SITE_URL build 413,760/450,000 |
| S13 | Mirror high-priority gaps into GitHub Issues |

---

## 7. Docs / legal / consistency

| ID | Gap |
|----|-----|
| L1 | Jurisdiction-specific legal review |
| C3 | Goals 11/13 vs privacy stance — mitigated by ADR-001; keep docs aligned |
| C8 | Enabling Plausible needs operator env + privacy already discloses optional analytics |

---

## 8. Local implementation boundary

The repository-level implementation pass is complete for the currently chosen
static architecture. The following remain intentionally open because they need
operator access, external review, or a new architecture decision: production
`SITE_URL` and host verification, GitHub settings, live CWV/indexability checks,
manual keyboard/screen-reader audit, penetration testing, affiliate/newsletter
provider enrollment, jurisdiction-specific legal review, rollback drills, and
all backend-heavy goals listed in ADR-001.

## 9. How to maintain

- Keep completed rows only when they provide useful verification context; mark
  them 🟢 and add the evidence source.
- Remove stale rows when the surrounding status section is rewritten.
- Backend ambitions require a new ADR superseding ADR-001.
