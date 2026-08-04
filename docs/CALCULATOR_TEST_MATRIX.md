# Calculation test matrix

Single source of truth for which calculation paths and edge cases the unit-test
suite covers, and which remain uncovered. Used by T007 of the execution plan.

The matrix is **executable**: every covered cell maps to one or more concrete
`it()` blocks under `src/lib/*.test.ts` or `src/app/tools/**/...test.tsx`.

Legend: ✅ covered · 🟡 partial · ❌ missing · 🚫 N/A

## Pure calculation libraries

| Library | Path | Files |
|---|---|---|
| Payment fees | `src/lib/fee-calculator.ts` | `src/lib/fee-calculator.test.ts` |
| Markup | `src/lib/markup-calculator.ts` | `src/lib/markup-calculator.test.ts` |
| Remittance | `src/lib/remittance.ts` | `src/lib/remittance.test.ts` |
| Investment | `src/lib/investment-calculators.ts` | `src/lib/investment-calculators.test.ts` |
| Matchmaker scoring | `src/lib/matchmaker.ts` | `src/lib/matchmaker.test.ts` |

## Edge-case rows

### Numeric bounds

| Case | fee-calc | markup | remittance | investment | matchmaker |
|---|:-:|:-:|:-:|:-:|:-:|
| Zero volume | ✅ | ✅ | ✅ | ✅ | 🚫 |
| Zero return rate | 🚫 | ✅ | 🚫 | ✅ | 🚫 |
| Zero contribution | 🚫 | 🚫 | 🚫 | ✅ | 🚫 |
| Zero time horizon | 🚫 | 🚫 | 🚫 | ✅ | 🚫 |
| Negative inputs | 🟡 clamped | ✅ rejected | 🟡 clamped | ✅ clamped | 🚫 |
| Non-finite (NaN/Infinity) | ✅ rejected | ✅ rejected | ✅ rejected | ✅ rejected | 🚫 |
| Rounding behaviour | ✅ | ✅ | ✅ | ✅ | 🚫 |
| Extreme volumes | 🟡 low-AOV | 🟡 1B | 🟡 | 🟡 | 🚫 |

### Per-model paths

#### Payment fees (`fee-calculator`)

| Model | Covered |
|---|:-:|
| Blended (Adyen-style) | ✅ |
| Domestic online | ✅ |
| International online (domestic + surcharge + intlFixed) | ✅ |
| In-person POS | ✅ |
| India GST on top of base | ✅ |
| `computeProviderCosts` filters by currency | ✅ |
| `computeProviderCosts` sort ascending | ✅ |

#### Investment calculators (`investment-calculators`)

| Function | Edge cases |
|---|---|
| `computeSip` | accumulation vs retirement return ✅ · zero return ✅ · invalid inputs → null ✅ |
| `computeFire` | months-to-years ✅ (T001) · exact FIRE number ✅ (T002) · unreachable case → null ✅ |
| `computeRetirement` | separate returns ✅ (T003) · existing savings deduction ✅ (T004) · zero expenses ✅ |
| `computeSwp` | "Indefinite under fixed-return" wording ✅ (T005) · zero corpus ✅ · negative inputs clamped ✅ |

#### Markup calculator

| Path | Covered |
|---|:-:|
| Receive INR, send USD | ✅ |
| Send INR, receive USD | ✅ |
| Zero loss when offered = mid | ✅ |
| Blank amount treated as zero | ✅ |
| Out-of-bounds amount rejection | ✅ |

#### Remittance

| Path | Covered |
|---|:-:|
| Fee model: flat | ✅ |
| Fee model: percentage | ✅ |
| Fee model: combination | ✅ |
| Invalid fee model falls back to default | ✅ |
| Rate snapshot staleness gate | ✅ (via `remittance-asof.test.ts`) |

#### Matchmaker

| Path | Covered |
|---|:-:|
| Score ordering | ✅ |
| Score breakdown by question | ✅ |
| Empty quiz state | ✅ |
| All-answers-set state | ✅ |

## Calculator interaction components

| Component | File | Tests |
|---|---|---|
| `FeeCalculatorPageClient` | `src/app/tools/calculator/calculator-client.test.tsx` | rendering, recompute on slider change, custom-contract caveat |
| `MatchmakerQuizPageClient` | `src/app/tools/matchmaker/matchmaker-client.test.tsx` | quiz restoration, results panel |
| `RemittanceCalculatorPageClient` | `src/app/tools/remittance/remittance-client.test.tsx` | inputs validated, snapshot-stale warning |
| `CalculatorsClient` | none | ❌ missing |

## Storage, URL and helper paths

| Module | File | Covered |
|---|---|---|
| `encodeToolParams` / `decodeToolParams` | `share.test.ts` | ✅ |
| `readNumericParams` | `share.test.ts` | ✅ missing · empty · non-finite · malformed JSON |
| `shareOrCopy` | `share.test.ts` | ✅ native · clipboard · AbortError |
| `printToPdf` | `share.test.ts` | ✅ |
| `loadToolState` / `saveToolState` | `share.test.ts` | ✅ |
| `localStorage` parse | `storage.test.ts` | ✅ empty · malformed · non-array root · mixed types |
| `parseCompareSlugs` | `compare.test.ts` | ✅ caps · dedupes · unknown rejects · legacy `?a&b` path |
| `fuzzy` match | `fuzzy.test.ts` | ✅ dedup while preserving order |
| `canonicalUrl` | `canonical-url.test.ts` | ✅ |
| `formatValuation` | `format-company.test.ts` | ✅ |

## Data integrity

| Module | File | Covered |
|---|---|---|
| Articles | `articles.test.ts` | ✅ slug resolution |
| Compare presets | `compare-presets.test.ts` | ✅ |
| Financial values | `financial-values.test.ts` | ✅ |
| Glossary cross-refs | `glossary.test.ts` | ✅ duplicate slugs · orphans · dangling refs · self-refs |
| Provenance | `provenance.test.ts` | ✅ invalid record rejected |
| Company summaries | `company-summaries.test.ts` | ✅ |
| Global configs | `configs.test.ts` | ✅ |

## Status of `CalculatorsClient` interaction tests

❌ **Missing** — `src/app/tools/calculators/calculators-client.tsx` has no
companion `*.test.tsx`. Behaviour covered by unit tests of the underlying
`calculator-config.ts` data; per-component coverage is absent. Add when the
multi-calculator interaction grows beyond the existing UI defaults.

## Cross-cutting assertions

| Property | Where |
|---|---|
| Calculator never silently returns Infinity / NaN | `transactionCount` returns 0 for AOV ≤ 0 ✅ |
| Calculator handles user-supplied strings / null | `Number.isFinite` gates + `isValid*State` ✅ |
| `formatMoney`, `formatPercent`, `formatYears` | unit-tested via `calculator-config.ts` ✅ |
| Intl surcharge is additive, not double-counted | exact-value assertion 5.70 = $5.40 + $0.30 ✅ |

## Maintenance rules

- Whenever a new edge case is uncovered by an incident or bug report, add the
  test first, then mark the row ✅ in this matrix.
- When a new calculator ships, copy the table structure and fill rows for it
  *before* merging the calculator code.
- When a row is 🟡, the partial test must reference a follow-up issue or PR.