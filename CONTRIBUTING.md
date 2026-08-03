# Contributing

Thanks for your interest in FinTech Atlas. The project's core values are
**traceability** and **trust**: every score, rate, rating, recommendation, and
"verified" claim must be precisable and testable.

## Before you start

- Read the [README](../README.md) and the
  [production-readiness checklists](docs/production-readiness/README.md).
- Open an issue or discussion for non-trivial changes so we can agree scope
  before you write a lot of code.

## Development setup

```bash
npm ci
npm run dev        # http://localhost:3000
npm test           # vitest
npm run typecheck  # tsc --noEmit
npm run typecheck:scripts
npm run lint -- --max-warnings=0
npm run build      # requires SITE_URL in production
```

**SITE_URL note:** production builds intentionally fail when `SITE_URL` is
missing or is the `example.com` placeholder. Set `SITE_URL` (or
`NEXT_PUBLIC_SITE_URL`) in your environment.

## Making a change

1. Fork the repo and create a branch.
2. Make focused changes with tests that exercise the **real production code**
   (import the actual functions, don't re-type them in tests).
3. For financial logic (fee calculator, remittance, matchmaker): add exact-value
   tests, not just "greater than zero" assertions.
4. Run the full suite (above) and keep lint at `--max-warnings=0`.
5. Open a pull request using the template and link evidence (test output, build
   URL).

## Data & credibity guidelines

- Do not fabricate source URLs, dates, or figures. If a fact or source is
  unverified, say "not disclosed" / "editorially assessed" rather than inventing
  a value.
- Keep volatile facts (valuation, employee count, pricing, ratings) with a
  clear "as of" label and a source identifier where possible.
- Distinguish "verified/aggregated" from "editorial assessment"/"illustrative".

## Code of Conduct

Treat other contributors with respect. Harassment, discrimination, and
personal attacks are not acceptable.
