-- ============================================================================
-- FinTech Atlas Radar — canonical PostgreSQL schema (ADR-002)
--
-- Owned by the private repository `fintech-atlas-platform`. The public site
-- never talks to this database; it consumes generated safe subsets only.
--
-- Conventions:
--   * text ids are slugs, kept stable and unique
--   * every material claim links to `sources` and carries a confidence (A–E)
--   * timestamps are timestamptz; date-only facts are `date`
--   * soft-delete via `deleted_at` so history can never be destroyed
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Master data
-- ---------------------------------------------------------------------------

CREATE TYPE confidence_level AS ENUM ('A', 'B', 'C', 'D', 'E');

CREATE TYPE source_type AS ENUM (
  'regulator', 'official-website', 'filing', 'publication', 'database', 'machine'
);

CREATE TABLE sources (
  id            text PRIMARY KEY,
  url           text,
  publisher     text NOT NULL,
  source_type   source_type NOT NULL,
  accessed_at   date NOT NULL,
  effective_at  date,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE regulators (
  code          text PRIMARY KEY,          -- RBI | SEBI | IRDAI | NPCI | FIU
  name          text NOT NULL,
  jurisdiction  text NOT NULL DEFAULT 'IN'
);

CREATE TABLE licenses (
  code          text PRIMARY KEY,          -- PA | PA-CB | PPI | AA | P2P | TPAP | ...
  label         text NOT NULL,
  regulator     text NOT NULL REFERENCES regulators (code)
);

CREATE TABLE categories (
  id            text PRIMARY KEY,          -- slug
  label         text NOT NULL
);

-- ---------------------------------------------------------------------------
-- Companies
-- ---------------------------------------------------------------------------

CREATE TYPE company_status AS ENUM (
  'operating', 'acquired', 'merged', 'shut-down', 'unknown'
);

CREATE TABLE companies (
  id                    text PRIMARY KEY,          -- stable slug
  legal_name            text NOT NULL,
  display_name          text NOT NULL,
  website               text,
  description           text,
  founded_year          smallint CHECK (founded_year BETWEEN 1900 AND 2100),
  headquarters_city     text,
  headquarters_state    text,
  status                company_status NOT NULL DEFAULT 'unknown',
  ownership_type        text,
  employee_range        text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  last_verified_at      date,
  deleted_at            timestamptz
);

CREATE TABLE company_categories (
  company_id    text NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  category_id   text NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  source_id     text NOT NULL REFERENCES sources (id),
  confidence    confidence_level NOT NULL,
  verified_at   date NOT NULL,
  PRIMARY KEY (company_id, category_id)
);

CREATE INDEX company_categories_category_idx ON company_categories (category_id);

CREATE TABLE company_licenses (
  company_id            text NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  license_id            text NOT NULL REFERENCES licenses (code) ON DELETE CASCADE,
  regulator_id          text NOT NULL REFERENCES regulators (code),
  status                text NOT NULL DEFAULT 'unknown',  -- authorised | in-principle | application | unknown
  registration_number   text,
  valid_from            date,
  valid_until           date,
  source_id             text NOT NULL REFERENCES sources (id),
  confidence            confidence_level NOT NULL,
  verified_at           date NOT NULL,
  effective_at          date,
  notes                 text,
  PRIMARY KEY (company_id, license_id)
);

CREATE INDEX company_licenses_license_idx ON company_licenses (license_id);

-- ---------------------------------------------------------------------------
-- People, funding, evidence
-- ---------------------------------------------------------------------------

CREATE TABLE people (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     text NOT NULL,
  role          text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE company_people (
  company_id    text NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  person_id     uuid NOT NULL REFERENCES people (id) ON DELETE CASCADE,
  role          text NOT NULL,
  source_id     text NOT NULL REFERENCES sources (id),
  confidence    confidence_level NOT NULL,
  verified_at   date NOT NULL,
  PRIMARY KEY (company_id, person_id, role)
);

CREATE TABLE funding_rounds (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    text NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  amount_usd_m  numeric(14, 2),
  currency      text NOT NULL DEFAULT 'USD',
  announced_on  date,
  stage         text,
  investors     text[],
  source_id     text NOT NULL REFERENCES sources (id),
  confidence    confidence_level NOT NULL,
  verified_at   date NOT NULL
);

CREATE INDEX funding_rounds_company_idx ON funding_rounds (company_id);

CREATE TABLE evidence (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    text NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  field_name    text NOT NULL,           -- category | foundedYear | fundingUsdM | website | licence.<code>
  value         text NOT NULL,
  source_id     text NOT NULL REFERENCES sources (id),
  confidence    confidence_level NOT NULL,
  verified_at   date NOT NULL,
  effective_at  date,
  notes         text,
  UNIQUE (company_id, field_name, source_id)
);

CREATE INDEX evidence_company_idx ON evidence (company_id);

-- ---------------------------------------------------------------------------
-- Change / event engine
-- ---------------------------------------------------------------------------

CREATE TYPE event_type AS ENUM (
  'REGULATORY_STATUS_CHANGED', 'LICENSE_ADDED', 'LICENSE_REMOVED',
  'FUNDING_ROUND', 'ACQUISITION', 'FOUNDER_CHANGE', 'EXECUTIVE_CHANGE',
  'NEW_PRODUCT', 'COMPANY_ADDED', 'COMPANY_STATUS_CHANGED'
);

CREATE TABLE events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    event_type NOT NULL,
  company_id    text NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  happened_on   date NOT NULL,
  detected_on   date NOT NULL,
  detail        jsonb NOT NULL DEFAULT '{}',
  source_id     text NOT NULL REFERENCES sources (id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX events_company_idx ON events (company_id);
CREATE INDEX events_type_date_idx ON events (event_type, happened_on);

-- ---------------------------------------------------------------------------
-- Regulatory ingestion
-- ---------------------------------------------------------------------------

CREATE TABLE regulatory_snapshots (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regulator     text NOT NULL REFERENCES regulators (code),
  fetched_on    date NOT NULL,
  source_url    text NOT NULL,
  checksum      text NOT NULL,           -- sha256 of the raw snapshot
  status        text NOT NULL DEFAULT 'fetched',  -- fetched | parsed | reviewed | applied | rejected
  entries_count integer NOT NULL DEFAULT 0
);

CREATE TABLE review_queue (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id   uuid NOT NULL REFERENCES regulatory_snapshots (id) ON DELETE CASCADE,
  company_id    text REFERENCES companies (id) ON DELETE SET NULL,
  action        text NOT NULL,           -- e.g. 'add_license' | 'remove_license' | 'update_status'
  before        jsonb,
  after         jsonb,
  rationale     text,
  state         text NOT NULL DEFAULT 'pending',  -- pending | approved | rejected
  reviewed_by   text,
  reviewed_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX review_queue_snapshot_idx ON review_queue (snapshot_id);
CREATE INDEX review_queue_state_idx ON review_queue (state);

-- ---------------------------------------------------------------------------
-- User-facing persistence (paid tier — created up front, gated on launch)
-- ---------------------------------------------------------------------------

CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL UNIQUE,
  display_name  text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  provider      text NOT NULL,           -- stripe | razorpay | ...
  provider_id   text,
  plan          text NOT NULL,
  status        text NOT NULL DEFAULT 'incomplete',  -- incomplete | active | past_due | canceled
  current_period_end timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX subscriptions_user_idx ON subscriptions (user_id);

CREATE TABLE saved_searches (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name          text NOT NULL,
  query         jsonb NOT NULL,          -- serialized facet/search state
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX saved_searches_user_idx ON saved_searches (user_id);

CREATE TABLE watchlists (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name          text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX watchlists_user_idx ON watchlists (user_id);

CREATE TABLE watchlist_companies (
  watchlist_id  uuid NOT NULL REFERENCES watchlists (id) ON DELETE CASCADE,
  company_id    text NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  added_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (watchlist_id, company_id)
);

CREATE TABLE export_usage (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  export_type   text NOT NULL,           -- csv | json | api
  rows_count    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Freshness
-- ---------------------------------------------------------------------------

CREATE VIEW stale_companies AS
SELECT c.id, c.display_name, c.last_verified_at,
       CASE
         WHEN c.last_verified_at IS NULL THEN 'never-verified'
         WHEN c.last_verified_at < now()::date - 60 THEN 'stale'
         ELSE 'fresh'
       END AS freshness
FROM companies c
WHERE c.deleted_at IS NULL;