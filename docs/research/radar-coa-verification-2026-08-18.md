# Radar — RBI CoA Verification (48 removal review items, 2026-08-18)

> Authoritative check of the 48 `remove_license` review items from the live
> fetch diff against the **Certificate-of-Authorisation holder list**, now
> fetched live from the RBI publications page
> (`https://rbi.org.in/Scripts/PublicationsView.aspx?id=12043`).
> Companion: `radar-review-recommendations-2026-08-18.md`,
> `payment-aggregators-coa-2026-08-18.md`.

## 1. The CoA snapshot (new, closes the authorised-baseline gap)

The standalone CoA PDF is bot-challenged, but the same authorised-holder list
is published on the **PublicationsView.aspx?id=12043** page, which fetches
without a challenge. New `platform:fetch-rbi-coa` extracts the "Payment
Aggregators (PA-O, PA-P & PA-CB)" section:

- **70 authorised PA holders**, 147 PA lines (PA-O / PA-P / PA-CB combos),
  each with CoA issue date; former legal names preserved as provenance
  (e.g. "Razorpay Payments Private Limited (formerly Razorpay Software
  Private Limited)", "Pluxee India Private Limited (formerly Sodexo SVC
  India Pvt. Ltd.)").
- New authorisations visible in 2026: Aurus Paytech (21.04.2026), BNY
  Finserv (09.06.2026), Pluxee PA-O (03.08.2026), Paytm Payments Services
  (26.11.2025), Dreamplug/CRED (10.03.2026), Jio Payment Solutions
  (28.10.2024), First Data/Fiserv (14.11.2025), NTT Data (29.10.2025),
  Wise Payments PA-CB (12.03.2026), GoBrisk PA-CB (26.12.2025).

## 2. Verdict on the 48 removals — ALL REJECT (no licence changed)

| Class | Count | Explanation |
| --- | ---: | --- |
| Still-authorised CoA holders absent from the applications-status page | 46 | v1 marked them `authorised`; CoA list confirms each still holds a live CoA (Razorpay, Cashfree, PayU, BillDesk, Pine Labs, Easebuzz, Airpay, Mswipe, Worldline, Adyen, Stripe, Skydo, Xflow, BriskPe/GoBrisk, EximPe/Les Amis, Unlimint, etc.). Authorised holders are *not* listed on the applications page by design → absence ≠ removal. |
| v1 name-style mismatch | 2 | v1 used display names ("PayPal India", "Payoneer India", both `in-principle`); the live page carries the legal names ("PayPal Payments Private Limited", "Payoneer India Private Limited") — also `in-principle`. Status is unchanged; the diff could not link the name variants. |

**Result: every removal is a diff artifact; the 48 `rejected` decisions in
`recommended-decisions-payment-aggregators-live-2026-08-18.json` stand.**

## 3. Finding: v1 baseline used display names, not legal names

The v1 research baseline named many entities by brand/display name, which the
canonical directory (legal names) and the live feed cannot match:

`Razorpay`, `Cashfree Payments`, `PayU Payments India`, `BillDesk
(IndiaIdeas.com)`, `BriskPe (GoBrisk)`, `EximPe`, `Skydo`, `Xflow`,
`Unlimit IN (Unlimint)`, `PB Pay`, `PayPal India`, `Payoneer India`.

This is the root cause of the spurious removal events. Recommendation
(operator): re-baseline v1 to legal names using the CoA snapshot + live page
mapping before the next diff cycle, so the change feed only reports real
movements (in-principle → authorised, new entries, etc.).

## 4. Impact on the change feed

- The applications-status feed (`payment-aggregators-live-2026-08-18.md`)
  remains the in-principle/application pipeline source.
- The CoA list (`payment-aggregators-coa-2026-08-18.md`) is the authorised
  baseline source.
- Next natural integration (Phase 17): join the two to detect real
  in-principle → CoA transitions automatically.