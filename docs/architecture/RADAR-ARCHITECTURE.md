# FinTech Atlas Radar — Architecture

> Owns the technical split between the public website and the private
> intelligence data platform. Product scope lives in
> [RADAR-PRD.md](../product/RADAR-PRD.md); build order and gates live in
> [ROADMAP.md](../product/ROADMAP.md). Decision record: [ADR-002](../adr/002-radar-data-platform.md).

---

## 1. Two layers, one-way data flow

```text
PUBLIC                                    PRIVATE
FinTech Atlas website                     FinTech Atlas Data Platform
│                                         │
├── articles                              ├── canonical database (PostgreSQL)
├── calculators                           ├── 1,386+ companies
├── 42+ public profiles                   ├── enrichment pipeline
├── comparison                            ├── regulatory ingestion
├── glossary                              ├── source evidence
├── free Radar preview (/radar)           ├── historical snapshots
└── generated safe subset  <────────────  ├── change detection
                                          ├── alert engine
                                          └── paid APIs (later)
```

- The **public repo** (`fintech-atlas`) keeps the static Next.js export and a
  generated, safe subset of the data platform (the existing
  `src/generated/india-directory*` + `src/generated/radar-facets.ts`).
- The **private repo** (`fintech-atlas-platform`) owns the database, ingestion,
  evidence, history and monitoring. New proprietary work goes there.
- The moat is **database + verification + updates + history + monitoring** — not
  the raw snapshot.

## 2. Canonical schema (PostgreSQL)

Full DDL in [`database/schema.sql`](../../database/schema.sql). Core tables:

```text
companies                     company_licenses      regulators / licenses
categories                    funding_rounds        people / company_people
sources                       evidence
events
saved_searches                watchlists / watchlist_companies
users / subscriptions         export_usage
```

### `companies`
`id, slug, legal_name, display_name, website, description, founded_year,
headquarters_city, headquarters_state, status, ownership_type,
employee_range, created_at, updated_at, last_verified_at`

### `company_licenses`
`company_id, regulator_id, license_id, registration_number, status,
valid_from, valid_until, verified_at, source_id`

### `sources`
`id, url, publisher, source_type, accessed_at, effective_at, source_hash`

### `evidence` (critical)
`id, company_id, field_name, source_id, confidence, verified_at, effective_at,
notes`

> Never show an important regulatory claim without knowing where it came from.

## 3. Verification hierarchy

Every fact carries a confidence level:

```text
A — Official regulator/government source
B — Official company filing / company website
C — Reputable financial/business publication
D — Secondary database
E — Unverified / machine-enriched
```

For licences, **A is required wherever possible** (RBI/SEBI/NPCI published
lists). The product UI surfaces the trust block:

```text
Razorpay
Payment Aggregator
Status    Verified
Regulator RBI
Source    Reserve Bank of India
Verified  12 Aug 2026
```

## 4. Regulatory ingestion pipeline

One source family per agent (RBI → SEBI → NPCI → IRDAI).

```text
Regulator → Fetcher → Raw snapshot → Parser → Normalizer → Company matching
→ Diff → Human review queue → Database
```

Never silently modify important licence information.

## 5. Change / event engine

Compare snapshots → typed events:

```text
REGULATORY_STATUS_CHANGED   LICENSE_ADDED / REMOVED
FUNDING_ROUND               ACQUISITION
FOUNDER_CHANGE / EXECUTIVE_CHANGE
NEW_PRODUCT                 COMPANY_ADDED
COMPANY_STATUS_CHANGED
```

Regulatory changes ship first; don't automate every signal on day one.

## 6. Free site ↔ Radar app boundary (Phase 19)

```text
                 FINTECH ATLAS

        ┌────────────┴────────────┐
        │                         │
    FREE SITE                 RADAR APP
        │                         │
 Static Next.js             Dynamic frontend
        │                         │
 Articles / Tools               API / backend
 Comparisons                    PostgreSQL
 SEO                            Intelligence DB
```

Avoid converting the whole public website into a complex dynamic application
without a reason. The static export keeps serving as the SEO/acquisition layer.

## 7. Search

At 1,386–10,000 entities, PostgreSQL is sufficient — no Elasticsearch. Use:

- indexed category / licence / regulator filters
- funding range, founded-year range
- full-text company search + fuzzy name matching
- sorting

## 8. Freshness

Every record carries freshness:

```text
Verified 5 days ago
Verified 2 months ago
Stale — verification required
```

Policies: regulatory status → high priority; pricing → high priority;
funding → medium; founders → medium; founded year → very low.

## 9. What moves to the private repo

Run `npm run platform:export` (`scripts/export-platform-package.ts`) to stage
the proprietary pieces (database schema + seed, `src/data-platform`, regulatory
snapshots) into `data-platform/staging/` for the private repository. The public
site continues to consume only `src/generated/*`.