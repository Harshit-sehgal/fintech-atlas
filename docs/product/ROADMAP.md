# FinTech Atlas Radar — Roadmap & Execution Order

> Gated build order for the Radar track. This is the single source of truth for
> **when** things ship. Scope lives in
> [RADAR-PRD.md](./RADAR-PRD.md); the technical split lives in
> [RADAR-ARCHITECTURE.md](../architecture/RADAR-ARCHITECTURE.md);
> ADR [002](../adr/002-radar-data-platform.md).

## Controlling rule

> **Do not proceed to full SaaS build (auth, billing, AI, API) until the
> validation gate in [`docs/sales/VALIDATION-GATE.md`](../sales/VALIDATION-GATE.md)
> shows paying design partners.** Everything before that is hypothesis testing;
> everything after it is scaling.

Phases below that sit **behind the gate** (P13–P17) are deliberately **not
built** yet — they are documented here so the decision is made in advance, never
reactively.

---

## Phase 0 — Product & plan

**Goal:** one page that says what Radar is and one page that says when we build it.

| # | Artifact | Status |
| --- | --- | --- |
| P0.1 | `docs/product/RADAR-PRD.md` — product, wedge, ICP, JTBD, free/paid, pricing, DoD, out-of-scope | ✅ done |
| P0.2 | `docs/product/ROADMAP.md` — this file | ✅ done |

## Phase 1 — Architecture split (public/private)

**Goal:** decide and document the two-repo split and the one-way data flow.

| # | Artifact | Status |
| --- | --- | --- |
| P1.1 | `docs/architecture/RADAR-ARCHITECTURE.md` — two layers, schema, evidence, ingestion, events, search, freshness | ✅ done |
| P1.2 | `docs/adr/002-radar-data-platform.md` — decision record | ✅ done |
| P1.3 | `scripts/export-platform-package.ts` + `.gitignore` staging guard — stages proprietary pieces for the private repo | ✅ done |

## Phase 2 — Canonical database & import

**Goal:** the research directory becomes a canonical, schema'd dataset.

| # | Artifact | Status |
| --- | --- | --- |
| P2.1 | `database/schema.sql` — PostgreSQL DDL (companies, licences, evidence, events, snapshots, review queue, users, watchlists, …) | ✅ done |
| P2.2 | `src/data-platform/` — canonical types, sources, import | ✅ done |
| P2.3 | `scripts/build-data-platform.ts` (`npm run platform:import`) → `data-platform/out/` canonical.json + seed.sql + coverage.json | ✅ done |

**Exit:** import produces 1,386 companies; seed SQL matches the schema.

## Phase 3 — Evidence & provenance

**Goal:** every material claim carries a source, a date and a confidence (A–E).

| # | Artifact | Status |
| --- | --- | --- |
| P3.1 | `src/data-platform/evidence.ts` — confidence model, licence statuses, evidence rows | ✅ done |
| P3.2 | Contract tests (`src/__tests__/data-platform.test.ts`) — sources resolve, licences have confidence, evidence mirrors records | ✅ done |

## Phase 4 — Regulatory ingestion (RBI first)

**Goal:** a repeatable, review-gated pipeline for regulator snapshots.

| # | Artifact | Status |
| --- | --- | --- |
| P4.1 | `src/data-platform/rbi/` — parse, match, diff, review, ingest | ✅ done |
| P4.2 | `data/regulatory/rbi/payment-aggregators-v1.md` — PA/PA-CB baseline snapshot (48 rows, from research) | ✅ done |
| P4.3 | `scripts/ingest-rbi.ts` (`npm run platform:ingest-rbi`) — baseline establishes 48 events; changes land in a human review queue | ✅ done |
| P4.4 | Change engine tests (events, diff, review) | ✅ done |

**Exit:** pipeline parses the snapshot, matches every known company, emits events, never silently mutates data.

## Phase 5 — Radar prototype (public preview)

**Goal:** a free, read-only `/radar` search surface to validate demand.

| # | Artifact | Status |
| --- | --- | --- |
| P5.1 | `/radar` page — search, category/regulator/licence facets with counts, funding + founded ranges, 5 sorts, pagination | ✅ done |
| P5.2 | `src/lib/radar-facets.ts` + generator + contract tests | ✅ done |
| P5.3 | 2 e2e tests; nav wiring | ✅ done |

## Phase 6 — Concierge sales & customer discovery

**Goal:** prove willingness to pay with people, not features.

| # | Artifact | Status |
| --- | --- | --- |
| P6.1 | `docs/sales/RESEARCH-OUTPUT-TEMPLATE.md` — what a paying customer receives | ✅ done |
| P6.2 | `docs/sales/CUSTOMER-DISCOVERY.md` — interview script + open questions | ✅ done |
| P6.3 | `docs/sales/PROSPECT-DATABASE.md` + `sales:seed-prospects` build script — operator-seeded prospect list | ✅ done |
| P6.4 | `docs/sales/PRICING-EXPERIMENTS.md` — test matrix (Phase 17) | ✅ done |
| P6.5 | `docs/sales/VALIDATION-GATE.md` — gate criteria (paying design partners) | ✅ done |

**Exit:** gate criteria written and a first prospect list seeded. Outreach itself is a human/operator action.

## Phase 7 — Radar intelligence profiles

**Goal:** `/radar/company/[slug]` shows verified regulatory data, funding, evidence and history — not just a card.

| # | Artifact | Status |
| --- | --- | --- |
| P7.1 | `/radar/company/[slug]` — trust block (licence status + confidence + source), stats, evidence & sources, watch button, directory bridge | ✅ done |

## Phase 8 — Events engine + feed

**Goal:** typed change events (licence added/removed/status, funding, acquisition, people) and a "what changed this week" feed.

| # | Artifact | Status |
| --- | --- | --- |
| P8.1 | `src/data-platform/events.ts` — change engine (diff → typed events) + tests | ✅ done |
| P8.2 | `/radar/activity` — baseline licence-event feed from the RBI snapshot + contract tests | ✅ done |

## Phase 9 — Saved searches

**Goal:** users persist a search and its filters (static prototype; server persistence behind the gate).

| # | Artifact | Status |
| --- | --- | --- |
| P9.1 | `src/lib/saved-searches.ts` + `SavedSearchBar` on `/radar` (save/apply/delete in localStorage) | ✅ done |

## Phase 10 — Watchlists

**Goal:** users track companies and receive change alerts (DoD in PRD §10).

| # | Artifact | Status |
| --- | --- | --- |
| P10.1 | `src/lib/watchlists.ts` + `WatchButton` on profiles + `/radar/watchlist` page (client prototype; alerts gated) | ✅ done |

## Phase 11 — Weekly digest

**Goal:** a generated digest of the week's changes for a saved search / watchlist.

| # | Artifact | Status |
| --- | --- | --- |
| P11.1 | `src/data-platform/digest.ts` (pure, tested) + `platform:digest` CLI → `data-platform/out/digest-week.md` | ✅ done |

## Phase 12 — Paid beta playbook

**Goal:** manual onboarding for a handful of design partners (billing by invoice, not a billing system).

| # | Artifact | Status |
| --- | --- | --- |
| P12.1 | `docs/sales/PAID-BETA-PLAYBOOK.md` — cycle, rules, exits, gate handover | ✅ done |

## Phase 13 — Auth & billing  ⛔ GATED

**Goal:** accounts + subscriptions (Stripe/Razorpay). **Not built until the gate passes.**

## Phase 14 — Team features  ⛔ GATED

**Goal:** seats, shared lists/watchlists, export limits.

## Phase 15 — Public API  ⛔ GATED

**Goal:** data access API. **Not built until the gate passes** (also out of PRD §11 scope for now).

## Phase 16 — AI  ⛔ GATED

**Goal:** summarization/assistance on top of verified data. **Not built until the gate passes** (ADR-001 defers AI for the free site; Radar AI is a paid-tier question only).

## Phase 17 — Expansion & full validation

**Goal:** validate retention (alerts → product visits), measure the free→paid funnel (§7 metrics), expand regulator families (NBFC → SEBI → IRDAI) and sectors (lending → wealth → insurance).

---

## Gate summary

| Gate | What passes it | Blocks |
| --- | --- | --- |
| Validation gate (`docs/sales/VALIDATION-GATE.md`) | ≥3 paying design partners via concierge sales | P13 auth/billing, P14 team, P15 API, P16 AI |
| Build gate (static export) | JS gzip budget, title ≤65, internal links, sitemap, e2e | any change that breaks the free site's static export |
| Free/paid boundary | verified regulatory data never leaks free | paid feature rollout |

---

## Operator actions (human-run — not buildable here)

These are documented so nothing is silently lost; each requires a human with the
right account/access. **Do not build around them** — they are external by design.

| # | Action | Owner | Blocks |
| --- | --- | --- | --- |
| O1 | Create the private repository `fintech-atlas-platform` and push the staged package from `npm run platform:export` (`data-platform/staging/`) | operator | private data platform go-live |
| O2 | Provision PostgreSQL and load `database/schema.sql` + `data-platform/out/seed.sql` | operator | canonical DB go-live |
| O3 | Switch RBI ingestion from local snapshot files to live fetching, then run the review queue | operator | real change feed |
| O4 | Concierge outreach: discovery calls, deliverable delivery, invoice billing (P6 / PAID-BETA-PLAYBOOK) | operator | validation gate |
| O5 | Affiliate enrollment and sponsored listings (external accounts, per monetization plan Phase 23) | operator | affiliate revenue |
| O6 | Wire an email provider for alerts / weekly digest once the gate passes | operator | P13 alerts |
| O7 | Contract a qualified reviewer for regulatory content before paid delivery (ADR-001 workflow) | operator | paid accuracy |