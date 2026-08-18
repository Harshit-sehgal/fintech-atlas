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

## Why the removals are rejected (important)

The 48 `remove_license` events all concern v1 entities recorded as
**authorised** (e.g. Razorpay, Razorpay Software). The live feed only covers
the applications-status page — the authorised CoA-holder list is a separate
PDF (`ATH190315ENTPSP.PDF`) that is bot-challenged and not part of this feed.
Authorised status is therefore unchanged; nothing is revoked. Confirming this
interpretation before applying is the operator's call — if you have fresh
authorised-holder evidence, override the corresponding decisions.

## Decision file

`data/regulatory/rbi/recommended-decisions-payment-aggregators-live-2026-08-18.json`
(101-entry flat `{ review-id: state }` map, `--decisions`-compatible).
Verified to apply clean: **36 approved / 48 rejected / 17 pending**, and the
resolved apply batch writes
`data-platform/out/rbi-payment-aggregators-live-2026-08-18-resolved.json`.