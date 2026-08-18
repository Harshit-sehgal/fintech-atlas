# Radar Research Deliverable — Output Template

> What a concierge customer (design partner) receives before the software is a
> product. This template is the **product** for Phase 6 sales. The plan to build
> software to automate it comes later.
>
> Fill one of these per customer engagement. Attach to the customer's row in
> the prospect database. Deliverables must be manually verified and cite the
> source chain — never AI-plausible-but-unverified.

## 1. Cover

- Customer / company
- Engaged by
- Date
- Engagement type: `one-off` / `monthly` / `trial`
- Price agreed (₹, and whether introductory)

## 2. Research brief

- The customer's stated question (their words)
- The fintech vertical(s) covered
- Regulator(s) in scope (RBI / SEBI / IRDAI / NPCI / FIU)
- Geography filter (default: India)

## 3. Deliverable sections

### 3.1 Company list

| Company | Category | Licence(s) | Regulator | Status | Founded | HQ | Funding (USD M) |
| --- | --- | --- | --- | --- | --- | --- | --- |

- every row has a canonical company match
- licence claims carry status (`authorised` / `in-principle` / `application` / `unknown`)
- source chain recorded per licence

### 3.2 Regulatory verification block (per company)

```text
Razorpay
Payment Aggregator
Status    Verified
Regulator RBI
Source    Reserve Bank of India (PA-O list)
Verified  2026-08-15
Confidence A
```

### 3.3 What changed this period

- typed events: licence added/removed/status change, funding round, acquisition, people
- each event dated and sourced

### 3.4 Watchlist-ready

- the recommended watchlist (companies + the changes to monitor next)
- alert triggers the customer cares about

## 4. Trust & limits

- Confidence hierarchy A–E explained (see RADAR-ARCHITECTURE.md §3)
- Explicitly list: what is NOT verified yet (stale fields, unverified statuses)
- Stale-date policy: fields older than N days are flagged `stale`

## 5. Follow-up

- Open questions that would sharpen the next deliverable
- What the customer said they'd pay for next
- Gate-evidence hooks: did they reference the deliverable? reorder? refer?