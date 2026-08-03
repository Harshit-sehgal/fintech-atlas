# Goal 07 — Search

**Status:** 🟡 ⌘K palette exists; no typo-tolerant full-site search

**Objective:** Search across stocks, ETFs, mutual funds, articles, and calculators.

## Requirements
- [ ] Stocks
- [ ] ETFs
- [ ] Mutual funds
- [ ] Articles
- [ ] Calculators

## Definition of Done
- [ ] Relevant results appear within the performance target.
- [ ] Typo tolerance works for common misspellings.
- [ ] No duplicate results.
- [ ] Empty-state handling is clear.

## Status vs. this codebase
- The ⌘K command palette (`src/components/ui/command-palette.tsx`) already
  searches companies, categories, glossary, and tools client-side — a strong
  foundation for the content searched today.
- Gaps: no typo tolerance (fuzzy/damerau), no dedupe guard, no dedicated empty
  state, and no coverage of stocks/ETFs/funds (those aren't data we have — see
  Goal 04). Search is **buildable fully client-side** over static content.
