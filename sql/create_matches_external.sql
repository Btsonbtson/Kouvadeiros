-- KOUVADEIROS — External Match Data Staging Table
-- This table holds raw scraped/API match data before it's merged
-- into the main matches table by an admin import action.
--
-- Separation of concerns:
--   matches_external  = what the data providers say
--   matches           = what KOUVADEIROS has verified and accepted
--
-- Admin flow: review matches_external → approve → trigger upsert into matches

CREATE TABLE IF NOT EXISTS matches_external (
    -- Identity
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id             TEXT NOT NULL UNIQUE,      -- "fdo-123456" | "ss-789"
    provider                TEXT NOT NULL,             -- "football-data.org" | "sofascore"

    -- Competition
    competition             TEXT NOT NULL,             -- Competition enum value
    season                  TEXT NOT NULL,             -- "2026/27"
    matchday                INTEGER,

    -- Teams (never bare name strings as FK — resolve to team_id on import)
    home_team_external_id   TEXT NOT NULL,
    home_team_name          TEXT NOT NULL,
    home_team_short_name    TEXT,
    home_team_crest_url     TEXT,
    away_team_external_id   TEXT NOT NULL,
    away_team_name          TEXT NOT NULL,
    away_team_short_name    TEXT,
    away_team_crest_url     TEXT,

    -- Timing (always UTC)
    kickoff_at_utc          TIMESTAMPTZ NOT NULL,
    prediction_lock_at_utc  TIMESTAMPTZ NOT NULL,      -- kickoff − 1 minute

    -- Status & Score
    status                  TEXT NOT NULL DEFAULT 'SCHEDULED',
    score_home              INTEGER,
    score_away              INTEGER,
    score_result            TEXT,                      -- HOME | AWAY | DRAW | NULL
    score_ht_home           INTEGER,
    score_ht_away           INTEGER,
    venue                   TEXT,

    -- Audit
    fetched_at_utc          TIMESTAMPTZ NOT NULL DEFAULT now(),
    imported_at_utc         TIMESTAMPTZ,               -- set when promoted to matches table
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_matches_external_competition
    ON matches_external (competition);
CREATE INDEX IF NOT EXISTS idx_matches_external_kickoff
    ON matches_external (kickoff_at_utc);
CREATE INDEX IF NOT EXISTS idx_matches_external_status
    ON matches_external (status);
CREATE INDEX IF NOT EXISTS idx_matches_external_matchday
    ON matches_external (competition, matchday);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER matches_external_updated_at
    BEFORE UPDATE ON matches_external
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- View: today's live matches (for KOUVADEIROS dashboard)
CREATE OR REPLACE VIEW live_matches AS
SELECT *
FROM matches_external
WHERE status = 'IN_PROGRESS'
ORDER BY kickoff_at_utc;

-- View: today's fixtures
CREATE OR REPLACE VIEW todays_fixtures AS
SELECT *
FROM matches_external
WHERE kickoff_at_utc::date = CURRENT_DATE
ORDER BY kickoff_at_utc;

COMMENT ON TABLE matches_external IS
    'Staging table for match data ingested from external providers (football-data.org, SofaScore). '
    'Admin must review and approve before data is promoted to the main matches table.';
