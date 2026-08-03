# Goal 02 — Financial Calculator Platform

**Status:** 🟡 Partially in place · **Action:** extend the existing tools system

**Objective:** Deliver trustworthy calculators with consistent UX.

## Requirements
- [ ] SIP
- [ ] SWP
- [ ] EMI
- [ ] CAGR
- [ ] Retirement
- [ ] FIRE
- [ ] Inflation
- [ ] Loan comparison
- [ ] Net worth
- [ ] Emergency fund

Every calculator must:
- [ ] Validate inputs
- [ ] Handle edge cases
- [ ] Support save/load
- [ ] Export PDF
- [ ] Export CSV
- [ ] Share via URL

## Definition of Done
- [ ] Results match independently verified calculations within an acceptable tolerance.
- [ ] Invalid inputs are handled gracefully.
- [ ] Save/load and export functions work reliably.
- [ ] Unit and integration tests cover normal and edge cases.

## Status vs. this codebase
- Existing tools (`src/app/tools/*`): **Fee Estimator**, **Cross-Border FX**
  (remittance), **Matchmaker Quiz**. These are decision tools, not the financial
  calculators listed above — none of SIP/SWP/EMI/CAGR/etc. exist yet.
- The pure-math calculators are **buildable fully client-side** (no backend),
  so this goal is green-capable. Pattern to follow:
  `src/lib/fee-calculator.ts` + `fee-calculator-config.ts` + `fee-calculator.test.ts`.
- Save/share: bookmarks are localStorage-only today; URL-share needs a route
  that hydrates from query params (the compare tool already does `?companies=`).
