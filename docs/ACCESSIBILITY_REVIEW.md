# Accessibility Review — FinTech Atlas

> Engineering accessibility audit of the static export (contributes to E5). A
> manual keyboard/screen-reader pass and Lighthouse CI (a11y ≥ 0.9, asserted as
> an error) still run on the live host; this documents the code-level findings.

## Audit method
Code review of interactive components for accessible names, semantics,
keyboard operation, focus management, and reduced-motion support; plus the
existing automated heading-hierarchy test and Lighthouse CI assertion.

## Findings — PASS with minor notes

### Accessible names & labels — PASS
- Search inputs use explicit `aria-label` / `aria-labelledby` (company search:
  `aria-label="Search companies"`; command palette: `role="combobox"` with
  `aria-controls`, `aria-expanded`, `aria-autocomplete=list`,
  `aria-activedescendant`).
- Icon-only controls carry `aria-label` (search trigger, theme toggle, mobile
  menu toggle).
- Form fields pair a visible `<label htmlFor>` with their `id`, plus
  `aria-invalid` and `aria-describedby` for validation errors (review/note
  forms).
- The newsletter input uses an `sr-only` `<label>` linked by `htmlFor`.

### Semantics & structure — PASS
- Landmark `aria-label="Primary"` navigation; `main id="main-content"`, skip
  links to main and footer.
- Heading hierarchy enforced by `heading-hierarchy.test.ts`.
- Tables use proper `<th scope>` (compare tool, article tables); comparison
  columns use `scope="col"`.

### Keyboard & focus — PASS
- Focus management and a tested focus trap for the command palette; Ctrl/Cmd+K
  open and Escape close (verified in e2e).
- Skip links present; focus-visible rings used throughout (`focus-visible:ring`).
- Theme toggle and palette are keyboard-operable; the matchmaker quiz is a
  series of standard buttons (verified end-to-end in e2e).

### Motion & color — PASS
- `MotionConfig reducedMotion="user"` honors `prefers-reduced-motion` globally.
- Color uses theme tokens; Lighthouse CI asserts accessibility ≥ 0.9 as an
  error on every build.

## Minor notes (non-blocking)
- Company search field uses `type="text"`; `type="search"` would surface a
  native clear affordance on some browsers. Cosmetic.
- A few buttons use icon glyphs (☆, 🔗, ✕) with adjacent text; the `✕` remove
  button in the compare header has an explicit `aria-label` — confirm remaining
  icon-only uses carry accessible names during the manual pass.

## Recommendation
Complete the manual keyboard + screen-reader walkthrough on the deployed site
and keep the Lighthouse a11y assertion as an error in CI (already wiring).
