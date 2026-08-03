# Goal 13 — Product Analytics

**Status:** 🟡 No tracking by design · **Action:** explicit decision required

**Objective:** Acquisition, activation, retention, engagement, conversion, churn.

## Requirements
- [ ] Acquisition
- [ ] Activation
- [ ] Retention
- [ ] Engagement
- [ ] Conversion
- [ ] Churn

## Definition of Done
- [ ] Every critical user event is tracked.
- [ ] Dashboards accurately reflect production data.
- [ ] Funnels and retention reports are available to the team.

## Status vs. this codebase
- No analytics are present; the README explicitly states "no tracking, analytics,
  or data collection — your data stays on your device." Enabling this goal is a
  **product/privacy decision**, not a coding one.
- Many metals here (retention, churn, conversion) assume user accounts (Goal 01),
  which a guest-only static site cannot measure. If adopted, prefer
  privacy-respecting, cookieless analytics and document the trade-off in an ADR.
