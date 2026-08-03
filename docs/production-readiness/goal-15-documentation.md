# Goal 15 — Documentation

**Status:** 🟡 README + contribution, security, legal, and incident docs · **Action:** finish provider-specific operations docs

**Objective:** API docs, architecture, schema, deployment, contribution, incident runbook.

## Requirements
- [ ] API documentation (currently none — no public API; document as N/A once decided)
- [x] Architecture overview (README "Architecture" section)
- [ ] Database schema (no database — document as N/A)
- [x] Deployment guide (README "Deploy" section)
- [x] Contribution guide
- [x] Incident runbook

## Definition of Done
- [ ] A new developer can set up the project using the documentation alone.
- [ ] Public APIs are documented and versioned (N/A until an API exists).
- [ ] Operational procedures are available for deployments and incidents.

## Status vs. this codebase
- The README is solid (setup, build, deploy, env vars, disclaimers). This
  `docs/production-readiness/` folder adds goal checklists + gap analysis.
- `CONTRIBUTING.md`, `SECURITY.md`, the static `/privacy` and `/terms` pages,
  and [`docs/incident-runbook.md`](../incident-runbook.md) now document the
  current architecture and operational boundaries.
- Remaining work is provider-specific deployment documentation, legal review for
  the eventual production jurisdiction, and documenting any future public API if
  one is introduced.
