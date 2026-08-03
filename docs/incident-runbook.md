# FinTech Atlas incident runbook

This runbook covers the current architecture: a static Next.js export with no
application server, accounts, database, or production secrets.

## Before release

1. Confirm the target `SITE_URL` is the real production origin.
2. Run the CI checks: typecheck, script typecheck, lint with zero warnings, tests,
   and the production build.
3. Confirm the build gates pass: rate-snapshot freshness, sitemap generation,
   security-header generation, and the compressed-JavaScript budget.
4. Preserve the commit SHA and generated `out/` artifact used for deployment.

## Incident triage

### Broken page or client-side error

- Reproduce the URL in a private browser window and inspect the browser console.
- Check whether the issue is limited to one route, one browser, or one theme.
- Compare the deployed commit SHA with the last known-good release.
- If the issue is caused by a release, roll back to the last known-good artifact
  rather than editing files directly on the host.

### Incorrect or stale financial information

- Treat pricing, FX, valuation, employee, and rating content as editorial data,
  not live quotes.
- Record the affected company/provider, visible date, source label or URL, and
  the correction needed.
- Do not “fix” a missing fact by guessing. Open a data-research change with a
  source URL, access date, effective date where available, and scope of support.
- For FX snapshots, update `src/data/remittance-config.ts` and its `RATES_AS_OF`,
  then rerun the freshness gate and full validation suite.

### Security issue

- Do not publish sensitive details in a public issue.
- Use the private vulnerability-reporting path in `SECURITY.md`.
- If a static asset or dependency is affected, take the smallest safe action:
  remove the asset, pin/upgrade the dependency, or deploy a known-good artifact.
- Document impact, affected commit, mitigation, and follow-up work.

## Rollback

1. Identify the last known-good commit and its CI/build artifact.
2. Redeploy that immutable artifact to the static host.
3. Verify `/`, `/companies`, one company profile, each interactive tool, `/about`,
   `/privacy`, and `/terms` over HTTPS.
4. Check `robots.txt`, `sitemap.xml`, `manifest.json`, and `_headers`.
5. Record the rollback time, commit SHA, symptom, and next action.

For this site, the repository history and retained static build artifacts are
the backup mechanism. There is no application database to restore. The hosting
provider's artifact-retention and rollback capabilities must still be confirmed
for each production environment.

## Recovery verification checklist

- [ ] Homepage and navigation render.
- [ ] Keyboard skip links and command palette work.
- [ ] Calculator and remittance disclaimers are visible.
- [ ] Company profile source-status section renders.
- [ ] No console errors on representative routes.
- [ ] Security headers and canonical URLs are present.
- [ ] The incident is documented and a follow-up issue is assigned.
