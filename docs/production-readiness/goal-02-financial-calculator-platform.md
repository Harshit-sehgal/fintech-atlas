# Goal 02 — Financial Calculator Platform

**Status:** 🟢 Core suite shipped · **Action:** maintain export/share parity and verify print-to-PDF behavior

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
- [x] Export PDF (browser print dialog → Save as PDF)
- [x] Export CSV
- [x] Share via URL

## Definition of Done
- [ ] Results are independently reviewed against professional/reference calculations within an acceptable tolerance. (Automated unit tests pass; external review remains.)
- [x] Invalid inputs are handled gracefully.
- [x] Save/load and export functions work reliably.
- [x] Unit and integration tests cover normal and edge cases.

## Status vs. this codebase
- Personal finance suite: `/tools/calculators` backed by
  `src/lib/investment-calculators.ts` + `src/data/calculator-config.ts` with
  unit tests in `src/lib/investment-calculators.test.ts`.
- Save (localStorage), share-via-URL, CSV export, and browser print-to-PDF are
  implemented on the personal finance suite and fee estimator. The fee estimator
  supports separate USD and INR provider schedules; the India view adds the
  configured 18% GST on top of the platform fee and never mixes currencies.
- The remittance and matchmaker tools now provide the same local save, share-link,
  CSV, and print-to-PDF actions. Browser print is intentionally used instead of
  a PDF dependency so the static export remains self-contained.
