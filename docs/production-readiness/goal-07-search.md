# Goal 07 — Search

**Status:** 🟢 Client-side catalog search implemented; market-data search remains deferred

**Objective:** Search across stocks, ETFs, mutual funds, articles, and calculators.

## Requirements
- [ ] Stocks
- [ ] ETFs
- [ ] Mutual funds
- [x] Articles
- [x] Calculators

## Definition of Done
- [x] Relevant results appear within the performance target.
- [x] Typo tolerance works for common misspellings.
- [x] No duplicate results.
- [x] Empty-state handling is clear.

## Status vs. this codebase
- The ⌘K command palette (`src/components/ui/command-palette.tsx`) already
  searches companies, categories, glossary, and tools client-side — a strong
  foundation for the content searched today.
- The palette now searches companies, categories, glossary terms, tools, and
  articles; fuzzy ranking tolerates common omissions/typos, removes duplicate
  references, and exposes a clear empty state.
- Stocks, ETFs, and mutual funds remain deferred because the underlying market
  data does not exist yet (see Goal 04).
