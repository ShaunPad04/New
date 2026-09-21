/**
 * Schema, applied on first connection and on every start (all statements are
 * idempotent). Scalar columns exist for the fields we filter and sort on;
 * the nested structures live in JSON columns.
 */
export const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS leads (
  id                TEXT PRIMARY KEY,
  client_id         TEXT NOT NULL,
  dedupe_key        TEXT NOT NULL,
  source_type       TEXT NOT NULL,
  company_name      TEXT NOT NULL,
  company_website   TEXT,
  company_industry  TEXT,
  company_location  TEXT,
  contact_name      TEXT,
  contact_role      TEXT,
  contact_email     TEXT,
  contact_phone     TEXT,
  project_name      TEXT,
  project_location  TEXT,
  score_total       INTEGER NOT NULL,
  tier              TEXT NOT NULL,
  status            TEXT NOT NULL,
  approval          TEXT NOT NULL DEFAULT 'pending',
  next_follow_up_on TEXT,
  handoff_sent_at   TEXT,
  booking_value     REAL,
  booking_currency  TEXT,
  booking_nights    INTEGER,
  booking_guests    INTEGER,
  booked_on         TEXT,
  discovered_at     TEXT NOT NULL,
  updated_at        TEXT NOT NULL,
  doc               TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_dedupe ON leads (client_id, dedupe_key);
CREATE INDEX IF NOT EXISTS idx_leads_tier   ON leads (client_id, tier);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (client_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_score  ON leads (client_id, score_total DESC);
CREATE INDEX IF NOT EXISTS idx_leads_found  ON leads (client_id, discovered_at DESC);

CREATE TABLE IF NOT EXISTS discovery_runs (
  id             TEXT PRIMARY KEY,
  client_id      TEXT NOT NULL,
  trigger        TEXT NOT NULL,
  sources        TEXT NOT NULL,
  started_at     TEXT NOT NULL,
  finished_at    TEXT,
  status         TEXT NOT NULL,
  candidates     INTEGER NOT NULL DEFAULT 0,
  leads_created  INTEGER NOT NULL DEFAULT 0,
  duplicates     INTEGER NOT NULL DEFAULT 0,
  rejected       INTEGER NOT NULL DEFAULT 0,
  error          TEXT,
  doc            TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_runs_started ON discovery_runs (client_id, started_at DESC);

CREATE TABLE IF NOT EXISTS notifications (
  id         TEXT PRIMARY KEY,
  client_id  TEXT NOT NULL,
  lead_id    TEXT REFERENCES leads (id) ON DELETE CASCADE,
  kind       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TEXT NOT NULL,
  read_at    TEXT,
  delivered  INTEGER NOT NULL DEFAULT 0,
  delivery_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications (client_id, created_at DESC);

CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`;
