# Radar Review Queue — Recommended Decisions (live fetch 2026-08-18)

> Operator aid for closing out the 101 review items produced by diffing the
> live RBI applications-status fetch against the v1 research baseline. These
> are **machine recommendations with rationale** — the operator reviews and
> applies them (or overrides) in one command. Evidence chain: RBI
> `Id=4236` ("As on 16.08.2026"), snapshot
> `data/regulatory/rbi/payment-aggregators-live-2026-08-18.md`.

## Queue composition

| Action | Count | Recommendation | Rationale |
| --- | ---: | --- | --- |
| `add_license` | 36 | **approved** | Licence/status is a confidence-A fact from the regulator's own live page; track it |
| `remove_license` | 48 | **rejected** | Scope artifact — v1 authorised CoA-holders legitimately never appear on the applications-status page; absence is not a removal (authorisation persists until RBI says otherwise) |
| `unmatched_entry` | 17 | **pending** | New entities — need directory research/creation, not an approvable licence event |

## Apply (after review)

```bash
npm run platform:ingest-rbi -- \
  data/regulatory/rbi/payment-aggregators-live-2026-08-18.md \
  --previous data/regulatory/rbi/payment-aggregators-v1.md \
  --decisions data/regulatory/rbi/recommended-decisions-payment-aggregators-live-2026-08-18.json
```

This writes the resolved apply batch to
`data-platform/out/rbi-payment-aggregators-live-2026-08-18-resolved.json`.
Unmatched entries remain pending for the entity-creation pass (17 candidates
listed in `docs/research/quarterly-2026-q3.md` §3.1).

## Why the removals are rejected (now CoA-verified)

The 48 `remove_license` events are all diff artifacts — verified 2026-08-18
against the live **Certificate-of-Authorisation list** (see
`radar-coa-verification-2026-08-18.md`):

- **46** concern v1 `authorised` holders (e.g. Razorpay, Cashfree, PayU,
  BillDesk, Stripe, Skydo, BriskPe/GoBrisk) — each confirmed **still holding
  a live CoA** on the RBI publications page. Authorised holders are not
  listed on the applications-status page by design, so absence ≠ removal.
- **2** (PayPal India, Payoneer India) are name-style mismatches: v1 used
  display names; the live page carries the legal names, both still
  `in-principle`. Status unchanged.

Nothing is revoked; all 48 `rejected` decisions stand. The v1 baseline's
display-name style is documented as the root cause and flagged for
re-baselining to legal names before the next diff cycle.

## Decision file

`data/regulatory/rbi/recommended-decisions-payment-aggregators-live-2026-08-18.json`
(101-entry flat `{ review-id: state }` map, `--decisions`-compatible).
Verified to apply clean: **36 approved / 48 rejected / 17 pending**, and the
resolved apply batch writes
`data-platform/out/rbi-payment-aggregators-live-2026-08-18-resolved.json`.