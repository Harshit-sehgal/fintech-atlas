# FinTech Atlas incident runbook

This runbook covers the current architecture: a static Next.js export with no
application server, accounts, database, or production secrets.

## Before release

1. Confirm the target `SITE_URL` is the real production origin.
2. Run the CI checks: typecheck, script typecheck, lint with zero warnings, tests,
   and the production build.
3. Confirm the build gates pass: rate-snapshot freshness, sitemap generation,
   security-header generation, compressed-JavaScript budget, structured data,
   and `npm run check:artifact`.
4. Preserve the commit SHA and generated `out/` artifact used for deployment;
   CI also downloads and rechecks the retained artifact before release. Confirm
   `feed.xml`, `sw.js`, and `offline.html` are present when offline enhancement
   is part of the release.
5. After deployment, run `DEPLOY_URL=https://your.production.domain npm run check:deployment`
   to verify representative routes, `robots.txt`, `sitemap.xml`, `security.txt`,
   and host-applied security headers.

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
for each production environment. The artifact gate is local and deterministic;
the deployment check requires the real deployed URL and must not be run against a
placeholder domain.

## Recovery verification checklist

The repository-level automated evidence below reflects the current working-tree
validation run (record the release SHA and timestamp when promoting it):

- `npm run test:e2e`: 18/18 Playwright journeys passed.
- `npm run check:provenance`: 42/42 company records validate.
- `npm audit --production --audit-level=high`: 0 shipped vulnerabilities.
- `npm run build`: static artifact, structured-data, internal-link, RSS,
  security-header, and performance gates passed.

The checklist items that follow still require a deployed URL or a human
keyboard/screen-reader walkthrough; they are intentionally not marked complete
by local unit/E2E evidence alone.

- [ ] Homepage and navigation render.
- [ ] Keyboard skip links and command palette work.
- [ ] Calculator and remittance disclaimers are visible.
- [ ] Company profile source-status section renders.
- [ ] Partner CTAs resolve and commercial links carry `rel="sponsored"`.
- [ ] Article pages render with JSON-LD and related-profile links.
- [ ] Newsletter opt-in renders in the footer (no console errors).
- [ ] No console errors on representative routes.
- [ ] Security headers (`_headers`) and canonical URLs are present.
- [ ] `sitemap.xml`, `robots.txt`, and `feed.xml` are present and correct.
- [ ] `sw.js` and `offline.html` are present when offline enhancement is enabled.
- [ ] Structured-data validation passes (`scripts/check-structured-data.mjs`).
- [ ] The incident is documented and a follow-up issue is assigned.
