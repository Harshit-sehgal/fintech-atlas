# Goal 05 — Portfolio Tracker

**Status:** 🔴 Backend required · **Blocker:** needs persisted per-user state

**Objective:** Manual portfolio creation and tracking with performance and risk.

## Requirements
- [ ] Manual portfolio creation
- [ ] Holdings
- [ ] Transactions
- [ ] Performance
- [ ] Diversification
- [ ] Risk metrics
- [ ] Benchmark comparison

## Definition of Done
- [ ] Portfolio values reconcile with the recorded transactions.
- [ ] Performance metrics are internally consistent.
- [ ] Historical performance renders correctly.
- [ ] Export and import complete without data corruption.

## Status vs. this codebase
- None today. The closest primitive is the localStorage bookmark set, which is
  not a portfolio model (no quantities, transactions, or ledger).
- Requires durable per-user persistence (localStorage-only can satisfy "manual
  portfolio" but fails "reconcile/consistent performance" and multi-device use).
  Decide between client-side-only vs. backend in an ADR.
