# ADR 0001 — Premium tier & backend introduction (Phase 4)

**Status:** Proposed (deferred until traffic + audience justify it)
**Date:** 2026-08-03
**Supersedes:** none

## Context

FinTech Atlas today is a fully static Next.js 16 export (`output: "export"`) — no
server, no database, no auth. This was a deliberate choice: it keeps the site
fast, cheap, and deployable anywhere, and keeps the trust surface tiny.

Phase 4 of the monetization plan introduces a **premium tier** — gating the
advanced matchmaker/compare/export features behind a subscription — and a **B2B
lead-gen / data-licensing** product. Both require server-side capabilities that
the static architecture cannot provide: accounts/authentication, payments,
entitlement checks, and (for lead-gen) form submission + CRM sync.

This ADR frames the decision so it can be made deliberately once the
prerequisites (consistent traffic + a tracked newsletter audience) are met,
rather than reactively under launch pressure.

## Decision drivers

- **Revenue ceiling:** affiliate + sponsored income scales with traffic, not
  with willingness-to-pay; a paid tier unlocks a second revenue axis.
- **Editorial independence:** paid features must not buy ratings/rankings.
- **Operational cost:** introducing a server increases hosting, monitoring, and
  security surface (the project currently has near-zero ops burden).
- **Existing scaffolding:** partner/affiliate config and provenance are already
  separated from editorial data; a paid tier should follow the same discipline.

## Options considered

1. **Stay static; defer premium indefinitely.** Keep only affiliate +
   sponsored + newsletter. Lowest risk, but caps per-customer revenue and
   leaves the lead-gen product unbuilt.
2. **Edge/serverless functions on the same repo (Vercel/Cloudflare/Netlify).**
   Add a thin API layer (auth + payments + entitlements) while keeping the
   marketing site static. Middle ground: progressive enhancement, pay-as-you-go
   ops, but introduces a server to secure and monitor.
3. **Split into a separate backend service.** A dedicated API + database.
   Cleanest separation, but highest overhead and slowest to ship.

## Recommendation

When the prerequisites are met, adopt **Option 2** — a thin serverless API
alongside the static export — because:
- it preserves the static marketing/SEO surface (no regression to the traffic
  engine that funds everything),
- it adds only the minimum server surface (auth, payments, entitlements),
- it can reuse the existing `PartnerOffer`/provenance separation discipline for
  paid entitlements.

## Prerequisites before acting

- ≥ consistent monthly traffic (target per the plan: ≥10k sessions/mo)
- a tracked newsletter audience (Phase 3 provider wired)
- a decision on the stack: Stripe Checkout or a managed subscriptions provider
  for payments; an auth provider (Clerk/Auth0/NextAuth) for accounts
- updated legal docs for accounts, payments, and data storage (currently the
  privacy notice explicitly states "no accounts, no server-side database")
- a security review (currently marked Open in ISSUES-AND-GAPS)

## Consequences

- The privacy notice, terms, and affiliate disclosure must be updated together
  once accounts/payments/storage are introduced.
- CI/observability debt (R4 monitoring/alerting/logging) becomes mandatory,
  not optional, the moment a server exists.
- The performance budget (currently 428KB gzip) must be re-validated after
  adding auth/payment client code.
