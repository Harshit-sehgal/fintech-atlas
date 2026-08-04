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
| Manual screen-reader audit | 🟡 Keyboard + focus-visibility + skip-link automated (WCAG 2.1.1/2.4.1/2.4.7 gate, 10 tests); CountUp now announces only the final value (sr-only twin, animated digits aria-hidden); logo marquee duplicate copy rendered as aria-hidden spans (was 2× keyboard stops + double announcements); error-boundary fallback announces via role="alert". Manual NVDA/VoiceOver walkthrough still open |
| WCAG accessibility pass (automated) | 🟢 axe-core e2e gate (`e2e/accessibility.spec.ts`): 22 light routes (404, bright-brand company, all 3 services pages, privacy/terms/affiliate-disclosure — legal templates were previously ungated, and privacy shipped a link-in-text-block violation: an inline "GitHub Issues" link distinguishable only by color, now underlined) + 14 dark routes. Theme-aware accent system: `--acc-0..8`, `--tool-acc-*`, `--accent-ink` tokens with light/dark twins in globals.css; tools hub + calculators suite + matchmaker + category pages consume vars (color-mix for alpha tints), so every accent is ≥4.5:1 as text and as chip/tab background in both themes; `.eyebrow` and always-visible card CTAs use `--accent-ink` (immune to inline brand-colour overrides); dark `--muted` brightened (#9a9488 → #a29c90, fixes 4.35:1 10px chip). Verified: axe CLEAN on 36 routes; 75/75 e2e, 317 vitest, budget 417,667/450,000 |
| Keyboard focus gate (2.4.1/2.4.7) | 🟢 `e2e/keyboard.spec.ts`: Tab-walks 7 templates asserting every stop shows a visible indicator, plus skip-link (Enter → focus lands in `#main-content`, now `tabIndex={-1}`) and keyboard-reachability of the primary nav. Root cause found: `ring-[var(--ring)]` is a no-op in Tailwind v4 (a bare var() is ambiguous length/colour) — 32 occurrences rendered no focus ring. Fixed with one unlayered `:focus-visible { outline: 2px solid var(--accent-strong); outline-offset: 2px }` rule (unlayered beats utility `outline-none`; `.btn-*` keep their shadow ring via specificity) |
| RSS autodiscovery link | 🟢 `<link rel="alternate" type="application/rss+xml" href="/feed.xml">` now in `<head>` (this Next fork does not emit metadata `alternates.types` in static exports — rendered literally). Verified in out/index.html |
| Service-worker cache auto-versioning | 🟢 `scripts/version-service-worker.mjs` (postbuild) stamps `out/sw.js` CACHE_NAME with a content hash of the `_next` assets — any asset change rotates the cache name so `activate` purges stale caches on deploy. Deterministic (rebuilds with unchanged assets keep the same name); manual "bump the release identifier" discipline removed. Negative-tested (missing `_next` → exit 1) |
| Dark-theme contrast audit | 🟢 Initial dark scan found 9 real violations (tools hub accents 2.2–2.7:1, calculators active tab 2.92:1, markup chip 4.35:1) — all fixed by the theme-aware accent tokens above. Dark pass of the a11y gate now guards every template |
| Provider-specific ops beyond [`deployment-providers.md`](../deployment-providers.md) | Ongoing |
| Dedicated Razorpay fee calculator page (`/tools/razorpay-fee-calculator`) | 🟢 Published-rate table + 18% GST math, reverse-charge formula, INR-preseeded estimator; Razorpay profile CTA updated |
| T049/T050/T051/T055 architecture wiring | 🟢 Every fee-related article links its calculator via a "Try the calculator" box (10/14 articles; receive-side omission closed by the new exchange-rate markup calculator); calculator pages link related comparisons; every company profile links the articles that mention it (server-side, hidden when empty); Article + BreadcrumbList JSON-LD on articles and profiles |
| India-first homepage directory + glossary | 🟢 Homepage "India-First Providers" curated order (Razorpay, Cashfree, Payoneer, Wise, PhonePe, Paytm); glossary +5 India terms (UPI, MDR, FIRC/FIRA, FEMA, T+1) wired into the related-term graph and category maps |
| Matchmaker quiz India coverage | 🟢 Quiz now recommends Indian providers: new "Freelancer / Independent" answer (international + transfers + multi-currency requirements), Cashfree capability entry, Razorpay capabilities extended (SaaS/enterprise, international, multi-currency, low-fee), Payoneer gains personal tier, PhonePe/Paytm score on personal/all-in-one; legacy SCORE_WEIGHTS matrix kept in sync. Verified: freelancer track → Wise/Razorpay/Revolut; SaaS+low-fee → Razorpay/Cashfree lead |
| Exchange-rate markup calculator (`/tools/exchange-rate-markup-calculator`) | 🟢 Input-only FX markup tool (no live-rate claims): mid vs offered rate → markup % + INR/USD loss for both USD→INR and INR→USD; reference corridors table (Payoneer 1–4%, Wise near-mid, ~0.5% balance conversions); share/save/URL-restore; wired as relatedTool on payoneer-fees-india, how-to-send-money-abroad-cheap, wise-vs-payoneer-business-payouts |
| Client bundle diet (company summaries split) | 🟢 Client components now import a generated client-safe summary catalog (`src/generated/company-summaries.ts`, ~9.7 KB gz) instead of the full editorial catalog (~32 KB gz); barrel-import leaks removed (compare-presets, partners, footer, palette, directory clients). JS budget 447,413 → 412,685 / 450,000 with the new tool added; drift gated by `company-summaries.test.ts` + prebuild regeneration |
| Tool discovery + cross-linking sweep | 🟢 Command palette now indexes all 6 tools (Razorpay fee + FX markup calculators were missing); homepage teaser gains the FX Markup button; remittance and matchmaker tool pages get "Related comparisons" sections (T050 pattern) — every tool page except the pure-client calculators suite now links its related articles/tools. Palette discovery e2e added (20/20) |
| Month-3 article 17 (Receiving $500 from a US client in India) | 🟢 Shipped 2026-08-04: worked ₹-landed table across Wise / Payoneer / bank wire / PayPal at an illustrative ₹83/USD snapshot (≈ ₹41,080 vs ≈ ₹38,250 — ~7% spread between channels), FIRC + FEMA + Section 44ADA notes (editorial, not tax advice), scenario picks, remittance + FX-markup calculator links. Distinct calculations per the plan's "no near-identical amount pages" rule. RSS 14 items, sitemap 88 URLs, 266 JSON-LD blocks |
| Cross-page consistency sweep (FX corridors, footer nav, compare page) | 🟢 Bank-wire FX corridor aligned across remittance tool (4.5% baseline) and markup-page corridor table (1.5–4.5%); footer tools column now lists all 6 tools (Razorpay fee + FX markup were missing); `/compare` gains a "Related comparisons" section (T050 pattern). Verified: typecheck, lint, 308 vitest, 22/22 e2e, SITE_URL build (413,997/450,000), browser smoke |
| E2E math integration coverage | 🟢 Remittance e2e now asserts the ranking contract (Wise leads the default $1,000 model with 0% markup and $4.80 fee; PayPal shows 3.5%) plus the semantic breadcrumb; calculators suite e2e locks all 9 tabs and the SIP→EMI panel switch. Suite: 22/22 |
| Non-finite input guards (NaN/Infinity) | 🟢 CALCULATOR_TEST_MATRIX.md audit found overclaims: fee-calculator, remittance, investment-calculators silently propagated NaN (guards checked only `<= 0`, which NaN passes). Fixed at the source: all investment computes return `null` via `isPositive`/`isNonNegative` helpers, `requiredSip`/`emergencyFundNeeded` return 0, fee-calculator + remittance throw TypeError on non-finite inputs (matching the cross-currency RangeError precedent), `computeNetWorth` throws TypeError. 5 new tests (308 total). Matrix cells now honest with no doc edits; clients validate inputs, so no UI behavior change. Verified: tsc, lint, 308 vitest, 22/22 e2e, SITE_URL build 413,997/450,000 |
| T057 (author + methodology links) | 🟢 Article pages now show a visible byline ("By FinTech Atlas" → `/about`) and a Methodology link → `/about#methodology`; the /about "Data Sources & Synthesizing Methodology" section gained the `methodology` anchor. Matches the JSON-LD Organization author. Verified: tsc, lint, 308 vitest, 22/22 e2e, SITE_URL build (414,006/450,000), browser smoke (byline + anchor render) |
---

## 4. Architecture & product surface

| ID | Gap |
|----|-----|
| A4–A5 | Partner / monetization helpers exist but are unused; all relationships `"none"` |
| A6 | Waitlist endpoint stub — no UI until `NEXT_PUBLIC_WAITLIST_ENDPOINT` + product decision |
| A10 | Affiliate playbook exists; enrollment, legal review, and live-link verification remain operator tasks |
| A11 | No i18n (`lang="en"` only) |
| A12 | No changelog feed (RSS feed now covers published articles) |

| T058–T062 | Services track | 🟢 `/services` shipped: gateway selection audit (₹999–₹1,999 basic / ₹2,500–₹5,000 detailed) + integration (₹3,000–₹15,000+) with deliverables/exclusions (T059), booking form (T060 — prefilled GitHub-issue channel, the site's only public inbox; mailto swap documented when an operator email exists), public sample audit report (T061 — fee table computed at build time from the SAME `PROVIDER_FEE_CONFIGS` the calculator uses, so rates can't drift; fictional merchant, real India schedules 2% + 18% GST), interactive implementation checklist (T062 — 5 phases, localStorage persistence, progress bar). Cross-linked from footer Explore, tools hub CTA, compare page, and each other. Service + OfferCatalog JSON-LD, breadcrumbs. Gated: 3 light + 2 dark axe routes, 1 keyboard route. Verified: 75/75 e2e, 317 vitest, budget 417,667/450,000, 262 JSON-LD/92 files; booking form falls back to a direct draft link when the popup is blocked (window.open result verified); PWA manifest shortcuts (fee estimator, services) |
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
| E7 | Structured-data and internal-link validation | 🟢 Done — `scripts/check-structured-data.mjs` (now also gates BreadcrumbList on every tool page) and `scripts/check-internal-links.mjs` run in `postbuild` and validate the emitted artifact; 266 JSON-LD blocks (BreadcrumbList on all 42 profiles + 14 articles + 7 tool routes incl. the /tools hub), internal-link checker covers 93 HTML files; checker also enforces per-type required properties (Article/BreadcrumbList/WebSite/Organization), gates BreadcrumbList on every tool route, and now validates anchor fragments too — every `href="#…"` and `/path#frag` must resolve to a real `id` in the target page (covers the ~180 glossary-term anchors, skip-links, and the article `/about#methodology` links; negative-tested on a mutated copy) |
| E11 | Audit triage policy thin |
| E15 | ESLint pinned to v9 until eslint-config-next supports 10 |
| E17 | Secret scanning push-protection still needs GitHub repo settings |
| E18 | Incident runbook recovery checklist remains an operator execution checklist; executable artifact/deployment checks are now documented |
| S5 | Glossary hash deep links are not separate sitemap URLs (by design for static anchors) |
| T013-adjacent | Breadcrumb consistency pass | 🟢 Shared `Breadcrumbs` component (visible nav + BreadcrumbList JSON-LD) now used on articles, company profiles, editorial tool pages, and the /tools hub; the four client-island tools gained "Home" links, semantic `<nav aria-label="Breadcrumb">` markup, and server-side BreadcrumbList JSON-LD; `check-structured-data.mjs` hardened with per-type required-property validation (negative-tested: missing BreadcrumbList + missing headline both fail) and `breadcrumbs.test.tsx` covers the component. Verified: 252 JSON-LD blocks, 308 vitest, 22/22 e2e, SITE_URL build 413,997/450,000 |
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
