# ADR-002: FinTech Atlas Radar — private intelligence data platform

- **Status:** Accepted (Radar track; supersedes nothing)
- **Date:** 2026-08-18
- **Context:** The public site (static Next.js export, ADR-001) is the
  acquisition surface. The Radar product (see
  [RADAR-PRD.md](../product/RADAR-PRD.md)) monetizes depth: verified regulatory
  data, provenance, change history and monitoring. ADR-001 defers auth/AI/live
  market data for the free site; Radar must not silently pull the free site onto
  a dynamic stack. The research directory (1,386 companies, licence data for
  854) currently lives as markdown inside the public repository.

## Decision

Split the product into two layers with a **one-way data flow**:

```
PUBLIC                              PRIVATE
FinTech Atlas website               FinTech Atlas Data Platform
  articles                            canonical database (PostgreSQL)
  calculators                         enrichment pipeline
  42+ public profiles                 regulatory ingestion
  comparison                          source evidence
  glossary                            historical snapshots
  free Radar preview                  change detection
  generated safe subset  <----------  alert engine / paid APIs
```

- The public repo keeps only **generated, safe subsets** of the data platform
  (e.g. the existing `src/generated/india-directory*` and `radar-facets.ts`).
- New proprietary work (database, ingestion, evidence, change engine) lives in
  a **private repository** (`fintech-atlas-platform`).
- The moat is not the database snapshot but
  **database + verification + updates + history + monitoring**.
- Auth, billing, AI and public APIs remain gated behind the validation evidence
  in `docs/sales/VALIDATION-GATE.md` (consistent with ADR-001).

## Consequences

- Never accidentally delete the public site's data dependencies (the public
  site consumes generated modules, not the private database).
- Every material regulatory claim must carry source, date, verification date
  and confidence (A–E hierarchy) — see `src/data-platform/evidence`.
- Regulatory changes go through a human review queue before mutating the
  database.
- Revisit this ADR before any Radar feature requires the free site to become a
  dynamic application.