# Goal 02 — Financial Calculator Platform

**Status:** 🟢 Core suite shipped · **Action:** PDF export + fee/remittance/matchmaker parity

**Objective:** Deliver trustworthy calculators with consistent UX.

## Requirements
- [x] SIP
- [x] SWP
- [x] EMI
- [x] CAGR
- [x] Retirement
- [x] FIRE
- [x] Inflation
- [x] Loan comparison
- [x] Net worth
- [x] Emergency fund

Every calculator must:
- [x] Validate inputs
- [x] Handle edge cases
- [x] Support save/load
- [ ] Export PDF
- [x] Export CSV
- [x] Share via URL

## Definition of Done
- [x] Results match independently verified calculations within an acceptable tolerance.
- [x] Invalid inputs are handled gracefully.
- [x] Save/load and export functions work reliably.
- [x] Unit and integration tests cover normal and edge cases.

## Status vs. this codebase
- Personal finance suite: `/tools/calculators` backed by
  `src/lib/investment-calculators.ts` + `src/data/calculator-config.ts` with
  unit tests in `src/lib/investment-calculators.test.ts`.
- Save (localStorage), share-via-URL, and CSV export are implemented on the
  personal finance suite. PDF export remains open.
- Decision tools remain: Fee Estimator, Remittance, Matchmaker (share/save
  parity for those tools is follow-up work).
