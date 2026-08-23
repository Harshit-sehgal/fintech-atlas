# UX handoff: de-AI-fication + usability & comparison redesign

> **Status (2026-08-23):** Phases 1–3 implemented and verified — T101–T112
> are marked done in `EXECUTION_PLAN.md` §12b with file-level notes. Full
> verification loop green (lint, typecheck, 507 unit tests, 75 e2e specs,
> LHCI). Two pre-existing issues found and fixed along the way: nested
> anchors on `/articles/` cards (invalid HTML → axe `link-name`) and a
> below-minimum touch target on category links; the compressed-JS budget was
> raised 450 KB → 475 KB with history in
> `scripts/check-performance-budget.mjs`. Phase 4 (numeric comparisons)
> remains data-gated and open.

Handoff from a two-part audit (2026-08-23). Part 1: making the UI read as
human-crafted rather than AI-generated. Part 2: usability fixes and a
redesign of the `/compare` experience around user intent.

Everything below was verified against the current tree — file paths and line
numbers are accurate as of this writing. Proposed work is grouped into
phases and mapped to new backlog IDs **T101–T112** (the master plan ends at
T100), ready to be appended to `EXECUTION_PLAN.md`.

---

## 0. Ground rules for whoever picks this up

- Read `AGENTS.md` first: this Next.js version has breaking changes; consult
  `node_modules/next/dist/docs/` before writing code.
- The build is a **static export** with hard gates:
  - `prebuild`/`postbuild` script chains (`package.json:12-13`) — any new
    per-company data field must flow through `scripts/generate-company-summaries.ts`,
    or the postbuild artifact checks will drift.
  - LHCI budgets gate LCP/CLS. Never put opacity animations on the LCP
    candidate (see the `<main>` note in `src/app/globals.css:251-264`).
  - `e2e/accessibility.spec.ts` is an axe **zero-violation** gate over ~29
    light + 16 dark routes. Any color change must use the existing AA-safe
    `-text` token twins (`globals.css:19-27`).
- Reduced motion is handled globally (`MotionConfig reducedMotion="user"` in
  `app/layout.tsx` + CSS overrides) — keep it that way when adding motion.
- Verification loop: `npm run lint && npm run typecheck && npm test`, then
  `npm run test:e2e` and `npm run lhci` before calling anything done.

---

## Part 1 — Remaining "AI-generated" tells

The theme itself is already de-AI-fied (serif display face, warm paper
background, forest-green accent, zero slop copy). What remains:

### P1-1 · Emoji as icon system — highest visibility

| Location | Tell |
|---|---|
| `src/app/tools/page.tsx:73` | Tool icons rendered as `<span className="text-4xl">{tool.icon}</span>` — giant 🧮💳🌍 |
| `src/app/tools/calculators/calculators-client.tsx:245` | 📈🏦📊🔥 in calculator tabs |
| `src/lib/toast-context.tsx:122` | ✨ for success toasts |
| `src/app/bookmarks/bookmarks-client.tsx:48,77,94` | Bouncing ⭐ empty state; 🏢 inside an `<h2>` |
| `companies/[id]/client.tsx:345,534`, `compare-client.tsx:218`, `glossary/term-actions.tsx:47` | 🔗 / ⚡ prefixes on buttons |
| `home-client.tsx:158`, `india/page.tsx:145`, `command-palette.tsx:292,303`, `about/client.tsx:88-90` | Assorted flag/gear/book emoji |

**Fix:** extend the inline-SVG pattern already used by
`ui/category-icon.tsx`. For calculators prefer typographic markers (₹ glyph,
`01`/`02` index numerals) — cheaper and more editorial than more icons.

### P1-2 · One motion vocabulary on everything

`Reveal` + `.reveal-stagger` (40ms cascade up to 24 children,
`globals.css:386-414`) fires on nearly every grid; `card-glow` lift +
`group-hover:scale-110` icon pops (`home-client.tsx:231,257`) everywhere;
`CountUp` in hero stats. Uniformity is the tell.

**Fix:** allow one reveal-stagger section per page max; drop scale-pop
hovers; keep hover feedback to border/background shifts only.

### P1-3 · Homepage monotony

`home-client.tsx`: 12 stacked sections, ~7 are the identical eyebrow +
3-col bordered-card grid. Fix by re-platforming sections onto distinct
layouts (see T104).

### P1-4 · Radius drift from stated intent

Theme comment (`globals.css:29-34`) says radii stay "modest so surfaces read
as flat, printed cards", but cards ship `rounded-2xl`/`rounded-3xl`
throughout (e.g. `home-client.tsx:139`, newsletter `:447`, compare CTA `:467`).

**Fix:** enforce `rounded-lg` (8–12px) on card surfaces.

### P1-5 · Leftover gradient/glow artifacts

- `ui/scroll-progress.tsx:21` — accent→`emerald-400` gradient bar (Linear/Vercel clone look)
- `tools/page.tsx:66-69` — ambient `blur-2xl` glow blob scaling ×1.5 on hover
- `companies/client.tsx:345` — inline rating-meter gradient
- Dead `.gradient-text` class at `globals.css:422-425`

### P1-6 · Glass chrome

Sticky glass header (`site-header.tsx:92`) and blurred mobile bottom nav
(`site-header.tsx:299`). Acceptable, but candidates for flattening if going
full editorial.

### Copy status

Clean overall — "empower/unlock/elevate/etc." = zero hits. Only residuals sit
inside third-party data (vendor taglines/user reviews), e.g.
`generated/company-summaries.ts:52` renders Braintree's "Seamless…" line on
cards. Treat as quotation, leave.

---

## Part 2 — Usability & comparison findings

### Diagnosis: why `/compare` feels flat

1. **Flat attribute dump** (`compare-client.tsx:92-105`): 9 undifferentiated
   rows mixing identity facts (Founded/HQ/Employees/Valuation) with decision
   factors (Pricing Model, Advantage, Tradeoff).
2. **No numbers where it matters**: Pricing row shows strings like
   `"Per-transaction"`, while `data/fee-calculator-config.ts:99-225` already
   has structured fees (incl. GST math) for 7 providers — unused here.
   Note `fee-calculator.ts:51-54` deliberately blocks cross-currency math;
   preserve that rule.
3. **No difference emphasis**: no divergent-cell highlighting, no per-row
   winner, no verdict.
4. **No funnel entry**: zero links into `/compare` from any of the 42
   company profiles (grep confirms). Compare is reachable via header, home
   presets, bookmarks, matchmaker — never from a profile.
5. **Selector friction**: flat 42-tile grid (`compare-client.tsx:155-197`),
   no search/filter within it.

### Site-wide usability gaps

| # | Gap | Evidence |
|---|---|---|
| U1 | Directory filters don't survive reload/share (bare `useState`) — inconsistent with tools/compare which URL-persist properly | `companies/client.tsx:22-25`; same for india directory & radar |
| U2 | Directory search exact-substring only; `lib/fuzzy.ts` exists but wired only to ⌘K palette | `fuzzy.ts` consumers: `command-palette.tsx:11,144-192`, `rbi/match.ts:6` |
| U3 | Empty-state asymmetry: radar has "Clear all filters"; companies/india have advice text only | `companies/client.tsx:260-263` vs `radar-client.tsx:589-603` |
| U4 | Buried features: watchlist readable only via footer link; saved searches visible only inside radar; tool sessions restore silently with no listing; private notes (`reviews_<slug>`) not enumerable anywhere | `site-nav.ts` footer Explore; `[id]/client.tsx:697-712` |
| U5 | Qualitative scorecard renders "Not independently assessed" ×5 on all 42 profiles — dead scroll weight | `[id]/client.tsx:302-310,494-510` |
| U6 | CSV export parity: `downloadCsv` used by all four tools, nothing else | `lib/share.ts` |
| U7 | Mobile nits: sort label hidden on phones; compare table horizontal-scroll-only | `client.tsx:146`, `compare-client.tsx:222` |

A11y baseline is strong (axe gates, keyboard focus spec, skip links,
`layout.tsx:112-123`). Known uncovered traps worth adding specs for:
palette focus trap, review-modal trap + roving radiogroup, remittance
radiogroup.

---

## Phased plan → backlog IDs

### Phase 1 — high-leverage, low-risk (days)

- **T101 · Profile → Compare bridge.** "Add to comparison" button on every
  profile hero row deep-linking `/compare?companies=<slug>`; "Compare all N"
  on category pages. *Accept: any profile can start/join a comparison in one
  click; link validated against `parseCompareSlugs`.*
- **T102 · Compare row regrouping.** Reorder rows into Decide (pricing model,
  advantage, tradeoff, customers) → Verify (sources/date) → Context
  (collapsed Founded/HQ/Employees/Valuation). *Accept: decision rows render
  above context rows; context band collapsed by default, expandable.*
- **T103 · Emoji purge.** Replace emoji icons with SVG/typographic system
  (P1-1 list). *Accept: zero emoji in rendered chrome; axe + keyboard specs
  still green.*
- **T104 · Quick de-AI pass.** Solid-color scroll progress; remove glow blob
  and dead `.gradient-text`; radius enforcement; drop scale-pop hovers;
  reveal-stagger limited to one section per page. *Accept: grep shows no
  `scale-110` hover patterns; visual QA both themes.*

### Phase 2 — comparison redesign (week)

- **T105 · Scenario router.** Promote presets to primary UI ("What are you
  deciding?": freelancer invoicing USD / online store / enterprise rails);
  each maps to preset + relevant row emphasis. Extend
  `data/compare-presets.ts` (keep `presetsAreValid()` test contract).
- **T106 · Difference-first rendering.** Collapse rows where selections
  agree; bold/divergence-chip cells; auto-generate 2–3 bullet "Key
  differences" summary above the table. *Accept: identical rows hidden;
  summary present for every valid selection.*
- **T107 · Honest verdict block.** Template-derived from
  `primaryStrength`/`primaryWeakness` with hedged copy matching the existing
  voice (`compare-client.tsx:122` is the reference tone). No invented scores.
- **T108 · Selector search + grouping.** Wire `lib/fuzzy.ts` into the
  selector; group tiles by category; `aria-live` selection announcements;
  ≥40px touch targets for remove buttons.
- **T109 · Mobile table rework.** Sticky first column or stacked
  per-company cards under `sm`. *Accept: no horizontal scroll required to
  read any cell on a 390px viewport.*

### Phase 3 — consistency & recovery surfaces (week)

- **T110 · URL persistence everywhere.** Companies, india directory, radar
  filters → `?query` state using the established parse/validate pattern from
  the tool clients. Doubles as shareable filtered views (SEO upside).
- **T111 · Fuzzy search + shared empty states.** `fuzzyRank` in directory
  search; extract shared empty-state component with mandatory
  "Clear filters" action.
- **T112 · Saved hub consolidation.** Expand `/bookmarks` into Saved:
  Bookmarks · Notes (enumerate `reviews_*`) · Calculator sessions
  (`fintech_atlas_tool_*`) · Radar saved searches/watchlist; add these
  surfaces to More menu + command palette index; footer-only pages
  (`/radar/activity`, `/radar/review`) get a path into More menu. Add CSV
  export for radar/directory results.

### Phase 4 — numeric comparisons (ongoing, data-gated)

- Effective-fee row for the 7 configured providers (computed at a
  user-adjustable monthly volume, "adjust assumptions" prefills
  `/tools/calculator`); string fallback elsewhere. Requires extending
  `PROVIDER_FEE_CONFIGS` and/or structuring `Company.pricing` fields through
  the generator pipeline. Respect the cross-currency block.

---

## Out of scope / explicitly not recommended

- Don't replace the serif/paper theme — it's working.
- Don't fake numeric fees where data doesn't exist; the site's credibility
  rests on sourced-or-labelled figures.
- Don't add server features (newsletter provider, auth) as part of these
  phases; static export constraints apply until that decision changes
  (see EXECUTION_PLAN.md §Newsletter).

## Definition of done (per phase)

`npm run lint && npm run typecheck && npm test && npm run test:e2e &&
npm run lhci` all green; axe zero-violations intact on touched routes; both
themes visually verified; reduced-motion pass verified; new sections covered
by unit tests where logic exists (row grouping, verdict templates, URL parse
round-trips).
