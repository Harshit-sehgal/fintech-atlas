# FinTech Atlas Radar — Product Requirements Document (PRD)

> **Status:** Draft v1 — canonical product definition. Every implementation task
> on the Radar track traces back to a decision in this document. No coding agent
> may introduce a major feature not justified here (Phase 1 of the execution
> plan). This file is the single source of truth for product scope; the
> [architecture](../architecture/RADAR-ARCHITECTURE.md) doc owns the technical
> split and the [roadmap](./ROADMAP.md) owns build order and gates.

---

## 1. Product

**FinTech Atlas Radar** — a specialized intelligence and monitoring platform for
the Indian fintech ecosystem, beginning with payments and regulated fintech
companies.

The free website remains the traffic/acquisition engine. Radar is the paid
product surface. It does **not** rebuild FinTech Atlas into another generic
startup database.

### 1.1 The wedge

Do not initially cover every type of fintech equally. V1 covers:

- Payments: payment aggregators (PA-O / PA-P / PA-CB), cross-border payment
  aggregators, PPI issuers, payment-system operators, UPI ecosystem (TPAP),
  account aggregators, payment infrastructure, cross-border/FX, MTSS / AD-II
- RegTech / KYC / compliance
- Selected NBFC categories

This aligns with the site's existing India-payments positioning instead of
creating an unrelated second product.

### 1.2 Not V1

- personal finance tools
- portfolio tracking
- a generic AI chatbot
- a global fintech database
- 500 generic AI-written articles

---

## 2. Market

| Question        | Decision                                             |
| --------------- | ---------------------------------------------------- |
| Market          | India                                                |
| Initial vertical| Payments + regulated fintech                          |
| Buyer           | B2B fintech BD / research / compliance teams         |

### 2.1 Primary customer (ICP)

Start with people who **sell to, research, partner with, or advise** Indian
fintech companies:

1. B2B fintech infrastructure companies
2. RegTech / KYC / fraud companies
3. Payment infrastructure companies
4. Consultants and fintech research teams
5. VC / PE analysts (later)

### 2.2 Primary Job To Be Done

> "Find the exact Indian fintech companies relevant to me and keep me informed
> when something important changes."

### 2.3 The questions Radar answers

- Which companies hold a particular RBI / SEBI / etc. licence?
- Which payment companies operate cross-border?
- Which fintechs match specific categories, funding stages and regulatory statuses?
- What changed this week?
- Which new companies entered a regulated category?
- Which companies should a fintech vendor target?
- What changed in companies on my watchlist?

---

## 3. Positioning against competitors

Inc42 Datalabs advertises 75,000+ Indian companies, advanced filters, lists,
signals and exports (~₹1,499/month + GST). Tracxn advertises millions of
companies plus reports, alerts and enterprise data products.

**Atlas must win on depth, verification, regulatory intelligence and
fintech-specific workflows — not number of records.**

The pitch:

> Inc42 / Tracxn cover everything. Atlas understands Indian fintech deeply.

---

## 4. Free vs Paid (Phase 9 of the execution plan)

### Free

- search
- basic category filters
- basic regulator filter
- basic company profile
- first 20–50 results
- public calculators, articles, comparison, directory

### Pro (Radar)

- all results
- advanced filtering
- verified regulatory data
- funding filters
- company history
- saved searches
- watchlists
- CSV exports
- alerts
- source / evidence details
- change feed

### Team (later)

- multiple seats
- shared lists / watchlists
- higher export limits
- API / data access
- custom monitoring

---

## 5. Retention mechanism

Alerts and watchlists. The product is sticky when a user relies on Radar to keep
their intelligence current:

> Discovery → value → payment → retention.

---

## 6. Expansion path

Lending → wealth → insurance (add regulator families: NBFC → SEBI → IRDAI),
then new sectors.

---

## 7. Metrics (core funnel)

Do not obsess over page views alone. Track:

```
Visitor → Radar search → Filter → Company profile → Save/list/watch/export → Account → Paid → Returns
```

| Metric | Why |
| --- | --- |
| Radar searches | product interest |
| Search → profile | relevance |
| Search → saved list | activation |
| Watchlists / user | retention potential |
| Weekly returning users | real usage |
| Alert → product visits | retention |
| Free → paid | monetization |
| Paid churn | product health |
| Exports | professional intent |
| B2B enquiries | high-value intent |

---

## 8. Pricing experiments (Phase 17 — paid beta only)

These are tests, not permanent prices.

| Plan | Initial test |
| --- | ---: |
| Free | ₹0 |
| Founding Pro | ₹999 / month |
| Normal Pro test | ₹1,499–₹2,499 / month |
| Team | ₹5,000–₹10,000 / month |
| Custom intelligence / data | ₹10k–₹1L+ per project |

Reference point: Inc42 Pro ~₹1,499/month. Atlas should **not** compete solely on
being cheaper.

---

## 9. Definition of Done — data work

A company record is **not** done because AI found an answer. It is done when:

```
Company identified            ✓
canonical entity matched      ✓
category assigned             ✓
regulatory status determined  ✓
source stored                 ✓
source date stored            ✓
verification date stored      ✓
confidence stored             ✓
tests pass                    ✓
```

## 10. Definition of Done — paid feature

A feature is not done because the UI exists. Example (Watchlists):

```
Create watchlist         ✓   change event matches   ✓
Add company              ✓   alert generated        ✓
Remove company           ✓   email delivered        ✓
persist                  ✓   unsubscribe works      ✓
permission checks        ✓   tests                  ✓
                           analytics               ✓
```

---

## 11. Out of scope — explicitly do NOT build yet

```
❌ mobile app
❌ portfolio tracker
❌ stock tracker
❌ crypto dashboard
❌ budgeting app
❌ personal finance accounts
❌ generic chatbot
❌ global fintech database
❌ 500 generic articles
❌ complex organization permissions
❌ Salesforce integration
❌ public API
❌ fancy billing system
❌ major redesign of existing calculators
```

---

## 12. Build order and gates

See [ROADMAP.md](./ROADMAP.md) for the gated build order (P0–P17). The
controlling rule:

> **Do not proceed to full SaaS build (auth, billing, AI, API) until the
> validation gate in `docs/sales/VALIDATION-GATE.md` shows paying design
> partners.** Everything before that is hypothesis testing; everything after it
> is scaling.