# Goal 12 — Deployment

**Status:** 🟡 Build + tests + CI + rollback runbook exist; hosted preview and restoration verification remain

**Objective:** CI/CD, automated tests, preview environments, rollback, backups.

## Requirements
- [x] CI/CD
- [x] Automated tests
- [ ] Preview environments
- [x] Rollback
- [x] Backups (repository history and retained static artifacts)

## Definition of Done
- [ ] Every commit triggers the pipeline.
- [ ] Failed tests block production deployment.
- [ ] Rollback procedure is documented and verified.
- [ ] Backup restoration is tested successfully.

## Status vs. this codebase
- `npm run build` (static export + auto-sitemap) and `npm test` (186 tests) both
  exist and pass; content is fully static so rollback = redeploy a prior build.
- CI is implemented in `.github/workflows/ci.yml`; failed typechecks, lint, tests,
  or the production build block the job.
- Rollback and recovery expectations are documented in
  [`docs/incident-runbook.md`](../incident-runbook.md). For this static site,
  repository history and retained build artifacts are the backup mechanism.
- **Remaining gap:** preview environment configuration and a provider-specific
  restoration drill must be completed by the deployment operator.
