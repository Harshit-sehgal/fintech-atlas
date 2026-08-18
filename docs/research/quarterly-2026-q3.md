# Q3 2026 — India Payments Regulatory & FinTech Intelligence Report (draft)

> First quarterly original-research report (monetization plan: quarterly
> research reports / `ISSUES-AND-GAPS.md` §3b "content action"). **Draft for
> operator review before any paid delivery or public publication** — follow
> `docs/sales/RESEARCH-OUTPUT-TEMPLATE.md` for customer-bound versions.
>
> Evidence chain: every claim traces to the RBI Payment System Applications
> status page (`https://www.rbi.org.in/Scripts/bs_viewcontent.aspx?Id=4236`),
> fetched live **2026-08-18** ("As on 16.08.2026"), canonical snapshot
> `data/regulatory/rbi/payment-aggregators-live-2026-08-18.md` and the
> data-platform ingest (`scripts/fetch-rbi-pa.ts`, `platform:fetch-rbi`).

## 1. Landscape at a glance

- The live RBI applications-status page lists **36 payment-service entities** in
  the active pipeline: **18 Payment Aggregator (PA)**, **8 Payment Aggregator –
  Cross Border (PA-CB)**, **10 Payment Aggregator – Payment Solutions/“other”
  (PA-P)** applications.
- Status split across all 36: **16 in-principle authorisation granted**, **20
  application under process**.
- Two separate regulatory workstreams are visible: the **PA / PA-CB** regime
  (licence classes under the RBI PA directions) and the **PA-P** line — under
  the consolidated Master Direction on Regulation of Payment Aggregator
  (PA-MD, effective 15.09.2025) these are **Payment Aggregators – Physical**:
  transactions where the acceptance device and payment instrument are present
  in close physical proximity (offline/face-to-face collection).
- In-principle ≠ authorisation: RBI's own tables separate "In-Principle
  Authorisation Granted" from the authorised list; the authorised CoA list is
  now fetched live alongside the applications feed (§4.3), closing the gap
  that previously required the (bot-challenged) standalone PDF.

## 2. Live pipeline (36 entities, as on 16.08.2026)

### 2.1 PA — Payment Aggregator (18)

| Company | Status | Source table |
| --- | --- | --- |
| Mpurse Services Private Limited | in-principle | A |
| Paymate India Private Limited | in-principle | A |
| Freecharge Payment Technologies Private Limited | in-principle | A |
| Global Payments Asia-Pacific (India) Private Limited | application | A |
| LivQuik Technology (India) Private Limited | application | A |
| Aditya Birla Capital Digital Limited | in-principle | B |
| Appnit Technologies Private Limited | in-principle | B |
| Electronic Payment and Services Private Limited | in-principle | B |
| Euronet Services India Private Limited | in-principle | B |
| IRCTC Payments Limited | in-principle | B |
| Navi Payment Technologies Private Limited | in-principle | B |
| Nium India Private Limited | in-principle | B |
| SBI Payment Services Private Limited | in-principle | B |
| Sodexo SVC India Private Limited | in-principle | B |
| Integra Micro Systems Private Limited | application | B |
| Otropay India Private Limited | application | B |
| Samvriddhi Inclusive Growth Network Private Limited | application | B |
| Yudiz Solutions Limited | application | B |

### 2.2 PA-CB — Payment Aggregator, Cross-Border (8)

| Company | Status | Source table |
| --- | --- | --- |
| PayPal Payments Private Limited | in-principle | D |
| Trade Pe Tech Private Limited | in-principle | D |
| Nium India Private Limited | application | D |
| Payoneer India Private Limited | in-principle | E |
| Alt Pay Technologies Private Limited | application | E |
| ARM Commercial Services Private Limited | application | E |
| Paymate India Private Limited | application | E |
| Quick Forex Limited | application | E |

### 2.3 PA-P — Payment Aggregator – Physical (10)

| Company | Status | Source table |
| --- | --- | --- |
| One MobiKwik Systems Limited | in-principle | G |
| Alliance Network India Private Limited | application | G |
| Digitsecure India Private Limited | application | G |
| Nearby Technologies Private Limited | application | G |
| Payswiff Technologies Private Limited | application | G |
| Resilient Innovations Private Limited | application | G |
| RNFI Services Limited | application | G |
| Skilworth Technologies Private Limited | application | G |
| Spice Money Limited | application | G |
| Kamaal Universe Private Limited | application | H |

## 3. What changed this period

The live fetch was diffed against the research baseline v1
(`data/regulatory/rbi/payment-aggregators-v1.md`). The ingest pipeline produced
**84 change events and 101 review items**:

- **48 `LICENSE_REMOVED`** — v1-recorded entities not present in the live
  applications-status tables. **Scope caveat:** v1 was sourced from the wider
  RBI publication set (incl. the authorised CoA-holder list); the live feed
  covers the applications-status page only. These removals therefore mean
  "absent from the active applications page", not "authorisation revoked".
  Examples: Razorpay, Razorpay Software (authorised PA holders that never
  appear on the applications-status page).
- **36 `LICENSE_ADDED`** — entities on the live applications-status page. 19
  matched canonical directory companies; the rest are new to the directory.
- **17 unmatched entries** — live entities with no canonical match; candidates
  for new directory profiles (verified next: which already hold other licences,
  parent group, registration details).

### 3.1 New entities for the directory (17 unmatched)

IRCTC Payments, Euronet Services India, Aditya Birla Capital Digital, Appnit
Technologies, Integra Micro Systems, Otropay India, Samvriddhi Inclusive
Growth Network, Yudiz Solutions, Trade Pe Tech, Alt Pay Technologies, ARM
Commercial Services, Quick Forex, Alliance Network India, Digitsecure India,
Nearby Technologies, Kamaal Universe, Payswiff Technologies.

### 3.2 Ambiguous match (operator decision required)

| Live company | Canonical candidate | Signal |
| --- | --- | --- |
| Navi Payment Technologies Private Limited | Navi UPI (`navi-upi`) | score 120, flagged ambiguous — different legal name vs. brand |

## 4. Trust & limits

- **In-principle is not authorisation.** RBI explicitly separates the two;
  treat "in-principle" as pipeline status only.
- **Authorised baseline is now live.** The CoA-holder list is published at
  `PublicationsView.aspx?id=12043` (fetchable without the bot-challenge that
  blocks the standalone PDF) — `platform:fetch-rbi-coa` pulls it: **70
  authorised PA holders** with issue dates (`payment-aggregators-coa-2026-08-18.md`).
  The previously-open "authorised baseline" gap is closed; the standalone PDF
  is no longer required.
- **The v1 baseline used display names**, not legal names (Razorpay, Cashfree,
  PayPal India, BriskPe/GoBrisk, EximPe, Skydo, Xflow, Unlimit IN, PB Pay).
  This caused spurious diff events; re-baseline to legal names before the next
  cycle (see `radar-coa-verification-2026-08-18.md`).
- **Confidence:** every status in §2 is confidence **A** (official regulator
  page, fetched 2026-08-18). The 17 unmatched entities are not yet enriched;
  their `effective` dates are blank on RBI's page.
- **The 48 "removals" are diff artifacts, not licence changes.** Cross-checked
  2026-08-18 against the CoA list (`radar-coa-verification-2026-08-18.md`):
  every entity still holds its licence (46 still-authorised + 2 display-name
  mismatches). Nothing is revoked; the review decisions (`rejected`) stand.

## 5. Watchlist-ready

- Recommended monitoring set for the next quarter: **PayPal Payments** and
  **Payoneer India** (PA-CB in-principle → authorisation watch), **Nium India**
  (holds both PA and PA-CB lines), **Freecharge / MobiKwik / Spice Money /
  Sodexo** (consumer-scale players progressing through the PA/PA-P pipeline),
  **IRCTC Payments / SBI Payment Services / Aditya Birla Capital Digital**
  (institutional entrants).
- Alert triggers to wire in the Radar platform: in-principle → authorised
  transitions, application → rejected/returned, and any new table appearance.

## 6. Follow-up for the operator

- Decide the 17 unmatched entities (add to directory or mark out-of-scope).
- Resolve the Navi ambiguous match.
- Confirm or re-scope the 48 removals against a fresh authorised-holder PDF.
- Approve/publish this draft (or fold it into a customer-bound deliverable via
  `RESEARCH-OUTPUT-TEMPLATE.md`).