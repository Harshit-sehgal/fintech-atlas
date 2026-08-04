# Goal 11 — Observability

**Status:** 🟡 Uptime workflow scaffolded; host configuration and error tracking remain open

**Objective:** Logging, error tracking, monitoring, alerts, audit logs.

## Requirements
- [ ] Logging
- [ ] Error tracking
- [ ] Monitoring
- [ ] Alerts
- [ ] Audit logs

## Definition of Done
- [ ] Errors are visible in monitoring.
- [ ] Critical alerts reach the on-call channel.
- [ ] Key business metrics are observable.
- [ ] Logs support troubleshooting without exposing sensitive data.

## Status vs. this codebase
- A scheduled GitHub Actions uptime workflow is present at
  `.github/workflows/uptime.yml`. It probes the homepage and key tools and opens
  an idempotent issue on failure, but it intentionally skips until the operator
  configures the non-secret repository variable `DEPLOYMENT_URL` with the real
  HTTPS origin. The repository does not claim live-host monitoring until that
  variable and the workflow settings are enabled.
- Error tracking, application logs, audit logs, and product analytics remain
  absent by design. Any future provider must be selected through an explicit
  privacy/architecture decision, with no personally identifiable data collected
  without updating the privacy notice.
