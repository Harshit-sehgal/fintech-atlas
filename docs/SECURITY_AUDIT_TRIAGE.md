# Security & Dependabot Audit Triage Policy

> Addresses E11 ("audit triage policy thin") in `ISSUES-AND-GAPS.md`. Defines how
> vulnerability and dependency audit findings are triaged, prioritized, and
> closed, so the maintainer (or an AI agent) acts consistently instead of ad hoc.

## Sources of findings

- **Dependabot alerts** (`.github/dependabot.yml`) — dependency versions.
- **`npm audit`** — runs in CI with `--audit-level=high`; fails on high/critical.
- **CodeQL** (`.github/workflows/codeql.yml`) — static analysis on push/PR.
- **GitHub secret scanning** (`.github/secret_scanning.yml`) — leaked credentials.
- **Dependency review** on PRs (`.github/workflows/dependency-review.yml`).
- Manual review — security headers, CSP (generated `_headers`), provenance integrity.

## Severity definitions

| Severity | Meaning | SLA (target) |
|---|---|---|
| **Critical** | Remote code execution / credential leak / full compromise | Triage < 1 business day; fix or mitigate < 1 week |
| **High** | Data exposure or significant integrity/availability risk | Triage < 3 days; fix or mitigate < 2 weeks |
| **Medium** | Localized or transitive risk; no obvious exploit | Triage < 1 week; fix on next dependency pass |
| **Low** | No practical exploit on this static architecture | Log; re-evaluate on next dependency pass |

## Triage flow (applies to maintainer and agents)

1. **Record** the finding: source, package/path, severity, affected version, and
   whether it is reachable in this codebase (most server-side CVEs are irrelevant
   to a static export — note "not applicable, build-time only" if so).
2. **Assess reachability**: this is a static site (no server, DB, or auth).
   A vulnerability in a server-scoped transitive dependency that is never
   executed at runtime is low priority; one in the client bundle or a build
   pipeline step is higher.
3. **Decide** on one of:
   - **Fix now**: bump the version / apply the patched release, re-run CI.
   - **Pin/override**: use `package.json` `overrides` where a patched transitive
     version exists (the project already pins `postcss` and Next `sharp`).
   - **Document as not-applicable**: add a comment/link so it is not re-triaged
     each run.
   - **Escalate**: anything touching credentials, secrets, or the deploy
     pipeline goes through `SECURITY.md`'s private reporting path.
4. **Close with evidence**: link the PR/commit that fixed or the note explaining
   mitigation; keep the trail auditable.

## Known findings & status

| Finding | Severity | Reachability | Status |
|---|---|---|---|
| `tmp` path-traversal (via `@lhci/cli` → `inquirer`) | High (upstream) | **Not exploitable here** — dev-only, CI-time tooling with operator-supplied input; never shipped or reachable at runtime | Documented; production audit clean (`npm audit --omit=dev` = 0) |
| `inquirer` / `external-editor` / `uuid` transitives | Moderate/Low | Same as above — dev-only | Documented |
| Secrets scan (`grep` + GitHub secret scanning) | n/a | n/a | **Clean** — no secrets committed (see `SECURITY_REVIEW.md`) |
| CSP / security headers | n/a | n/a | Verified — generated `_headers`; `connect-src`/`form-action` auto-permit configured providers only |


- Keep the **deploy token/dashboard access** out of the repo (environment-only).
- Verify the generated `_headers` (CSP/HSTS) after any dependency or build change;
  a tightened CSP must never be widened accidentally (see
  `scripts/generate-security-headers.mjs`).
- Affiliate/partner URLs may encode identifiers — keep them out of public git
  where possible and treat them as semi-sensitive config, not application secrets.
- Prefer the smallest safe action and always re-run the full CI suite (typecheck,
  lint, tests, e2e, build) after a dependency change.
