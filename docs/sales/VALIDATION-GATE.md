# Radar Validation Gate

> The gate that decides whether FinTech Atlas may proceed to the full SaaS build
> (P13 auth/billing, P14 team, P15 API, P16 AI). Referenced by
> [RADAR-PRD.md](../product/RADAR-PRD.md) and [ROADMAP.md](../product/ROADMAP.md).
> **Everything before the gate is hypothesis testing; everything after it is
> scaling.**

## 1. The question the gate answers

Do real buyers pay for Radar, with manual/human delivery, before we invest in
accounts, billing and a public API?

## 2. How the gate is passed

Concierge sales (P6): a small number of design partners receive a
**manually produced, high-verification research deliverable** (see
[RESEARCH-OUTPUT-TEMPLATE.md](./RESEARCH-OUTPUT-TEMPLATE.md)) and pay for it by
**invoice** — not a checkout page.

| # | Criterion | Minimum to pass |
| --- | --- | --- |
| 1 | Paying design partners | **≥ 3** distinct paying customers (invoice paid, not promised) |
| 2 | Revenue | ≥ ₹15,000 cumulative received |
| 3 | Retention signal | ≥ 1 customer re-orders a second deliverable or renews |
| 4 | Usage signal | ≥ 1 customer references a deliverable in their own workflow (evidence captured) |
| 5 | Price paid | ≥ 1 customer pays a **non-introductory** price (≥ ₹4,999) |
| 6 | Referral | ≥ 1 warm referral to another buyer (no mass cold email) |

All evidence lives in a private tracker (see PROSPECT-DATABASE.md); nothing
here is invented.

## 3. What happens if the gate passes

Proceed to P13 auth/billing with a **working paid workflow already proven**.
Re-validate the roadmap order; hire-free, operator-run.

## 4. What happens if the gate does NOT pass

Do not build auth/billing/AI/API. Instead:

1. Revisit the ICP (PRD §2.1) — maybe the buyer or the wedge is wrong.
2. Iterate the research deliverable format, not the software.
3. Lower the ambition: one vertical, one buyer, one deliverable.
4. Stop when a person pays for something they keep.

## 5. Non-negotiables

- **No paid feature leaks free.** Verified regulatory data behind the paywall
  stays behind it.
- **No fake numbers.** A gate criterion is met only by recorded, dated evidence.
- **Billing by invoice only** until P13 — no checkout, no payment processor.
- **Editorial independence** (per monetization plan): paid work never buys
  rankings or ratings.

## 6. Review cadence

Re-read this gate with fresh evidence **every 2 weeks** of concierge sales. The
gate is passed only when all six criteria above are met and recorded.