# Goal 11 — Observability

**Status:** 🟡 No monitoring today (deliberate privacy-by-design stance)

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
- There is no error tracking or uptime monitoring wired in. The `README` states
  "no tracking, analytics, or data collection" — a deliberate privacy stance that
  this goal partially conflicts with and must be **explicitly decided**.
- Minimum viable: adopt privacy-respecting uptime + error monitoring (e.g.
  Sentry + UptimeRobot/Cloudflare analytics), log nothing personally
  identifiable, and define which "key business metrics" matter. Document the
  decision (an ADR) rather than silently enabling tracking.
