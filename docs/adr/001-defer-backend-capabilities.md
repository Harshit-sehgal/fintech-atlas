# ADR-001: Defer identity, AI, live market data, and persisted personal finance

- **Status:** Accepted
- **Date:** 2026-08-03
- **Context:** Production-readiness Goals 01, 03, 04 (live), 05, 06, 11, and 13
  assume accounts, APIs, and/or third-party services. FinTech Atlas is a static
  Next.js export with no server, database, or auth.

## Decision

Remain a **static, guest-only educational site** for v1.x. Explicitly defer:

| Goal | Deferred capability |
|------|---------------------|
| 01 | Identity / auth / sessions |
| 03 | AI financial assistant |
| 04 | Live market data feeds & refresh APIs |
| 05 | Portfolio tracker with server persistence |
| 06 | Personal finance ledgers with server persistence |
| 11 | Full observability stack (beyond optional cookieless analytics) |
| 13 | Account-based product analytics (retention/churn) |

## Consequences

- Release criteria that require registration are v2.0 gates.
- Client-only bookmarks, private notes, and tool localStorage remain the
  persistence model.
- Optional cookieless analytics (`NEXT_PUBLIC_ANALYTICS_DOMAIN`) may be enabled
  by operators without introducing accounts.
- Revisit this ADR before introducing a backend, identity provider, or model API.
