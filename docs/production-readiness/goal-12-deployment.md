# Goal 12 — Deployment

**Status:** 🟡 Build + tests + CI + rollback runbook exist; hosted preview and restoration verification remain

**Objective:** CI/CD, automated tests, preview environments, rollback, backups.

## Requirements
- [x] CI/CD
- [x] Automated tests
- [ ] Preview environments
- [x] Rollback procedure documented (hosted rollback drill pending)
- [x] Backups identified (repository history and retained static artifacts; restoration drill pending)

## Definition of Done
- [x] Every pushed branch and pull request triggers the verification pipeline (unpublished local commits and tag-only pushes are outside this workflow).
- [ ] Failed tests block production deployment.
- [ ] Rollback procedure is verified on the production host.
- [ ] Backup restoration is tested successfully on the production host.

## Status vs. this codebase
- `npm run build` (static export + auto-sitemap, artifact, and internal-link gates), the full Vitest suite, and the
  18-test Playwright E2E suite all pass locally; content is fully static so
  rollback = redeploy a prior build.
- CI is implemented in `.github/workflows/ci.yml`; failed typechecks, lint, tests,
  or the production build block the job.
- Rollback and recovery expectations are documented in
  [`docs/incident-runbook.md`](../incident-runbook.md). For this static site,
  repository history and retained build artifacts are the backup mechanism.
- A scheduled uptime workflow is scaffolded in
  `.github/workflows/uptime.yml`; configure the non-secret GitHub repository
  variable `DEPLOYMENT_URL` with the real HTTPS origin before relying on its
  probes or issue alerts.
- **Remaining gap:** preview environment configuration and a provider-specific
  restoration drill must be completed by the deployment operator. The local
  artifact restore gate is implemented and passing; hosted rollback evidence is
  still required.
