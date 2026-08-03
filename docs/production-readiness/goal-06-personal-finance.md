# Goal 06 — Personal Finance

**Status:** 🔴 Backend required · **Blocker:** needs persisted per-user state

**Objective:** Income, expenses, budgets, goals, cash flow, savings, and debt tracking.

## Requirements
- [ ] Income
- [ ] Expenses
- [ ] Budgets
- [ ] Goals
- [ ] Cash flow
- [ ] Savings
- [ ] Debt tracking

## Definition of Done
- [ ] Budget calculations are accurate.
- [ ] Reports match stored transactions.
- [ ] AI insights reflect the underlying data rather than fabricated assumptions.

## Status vs. this codebase
- None today; no ledger or transaction model exists.
- Like Goal 05, requires durable persistence. The "AI insights" line depends on
  Goal 03 (AI assistant) and can only be grounded in data the app actually stores.
