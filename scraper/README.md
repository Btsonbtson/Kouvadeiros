# KOUVADEIROS Live Score Pipeline

Fetches live and scheduled match data for **Super League Greece**, **Champions League**, **Europa League**, and **Conference League** — normalized to the KOUVADEIROS domain model.

## Architecture

```
football-data.org API  ──(primary)──┐
                                    ├──► KouvadeirosLivePipeline ──► JSON / Supabase
SofaScore internal API ──(fallback)─┘
        ↑
   Playwright browser scraper (activates only if SofaScore JSON API returns 403)
```

## Setup

```bash
pip install requests playwright python-dotenv supabase --break-system-packages
playwright install chromium   # only needed if SofaScore fallback triggers

cp .env.example .env
# Edit .env: add your FDO_API_KEY
```

Get a **free API key** at: https://www.football-data.org/client/register

## CLI Usage

```bash
# Today's fixtures and scores
python run.py today

# Currently live matches only
python run.py live

# Specific matchday (for admin import into KOUVADEIROS)
python run.py matchday GSL 5 2026      # Super League, Matchday 5, Season 2026/27
python run.py matchday UCL 3 2026      # Champions League, Matchday 3

# Live polling daemon (use on matchdays)
python run.py daemon --interval 60

# Write JSON to ./data/ directory
python run.py today --output ./data
python run.py live  --output ./data

# Print full JSON
python run.py today --json
```

## Competition codes

| Code | Competition              | FDO ID |
|------|--------------------------|--------|
| GSL  | Greek Super League       | 2008   |
| UCL  | Champions League         | 2001   |
| UEL  | Europa League            | 2146   |
| ECL  | Conference League        | 2285   |

## Supabase Integration

```bash
# Run SQL migration first
psql $DATABASE_URL -f sql/create_matches_external.sql

# Fetch today + upsert
python scripts/upsert_to_supabase.py --today

# Fetch live + upsert (run every 60s on matchdays)
python scripts/upsert_to_supabase.py --live

# Upsert from existing JSON file
python scripts/upsert_to_supabase.py --file data/today.json
```

## KOUVADEIROS Integration

### Option A — Polling file (recommended for Vercel)

Run the pipeline externally (Railway, Fly.io, or a cron job):
```bash
# crontab: every 2 minutes on matchdays
*/2 * * * * cd /app && python run.py live --output /shared/data/
```

Upload `live.json` and `today.json` to Supabase Storage or R2.
Set `LIVE_SCORES_JSON_URL` and `TODAY_SCORES_JSON_URL` env vars in Vercel.
The Next.js API route at `app/api/live-scores/route.ts` reads from those URLs.

### Option B — Direct Supabase upsert

Run `upsert_to_supabase.py --live` on a cron. The KOUVADEIROS API then
queries `live_matches` or `todays_fixtures` views directly from Supabase.

## Output Format

```json
{
  "fetched_at_utc": "2026-07-31T18:00:00+00:00",
  "match_count": 3,
  "live_count": 2,
  "errors": [],
  "matches": [
    {
      "external_id": "fdo-123456",
      "provider": "football-data.org",
      "competition": "SUPER_LEAGUE_GRE",
      "season": "2026/27",
      "matchday": 1,
      "home_team": {
        "external_id": "fdo-394",
        "name": "Olympiacos FC",
        "short_name": "OLY",
        "crest_url": "https://crests.football-data.org/394.png"
      },
      "away_team": { ... },
      "kickoff_at_utc": "2026-07-31T17:00:00+00:00",
      "prediction_lock_at_utc": "2026-07-31T16:59:00+00:00",
      "status": "IN_PROGRESS",
      "score": {
        "home": 1,
        "away": 0,
        "half_time_home": 1,
        "half_time_away": 0,
        "result": "HOME"
      },
      "venue": "Georgios Karaiskakis Stadium"
    }
  ]
}
```

## Notes

- `prediction_lock_at_utc` = `kickoff_at_utc − 1 minute` (matches KOUVADEIROS lock rule)
- `score.result` uses KOUVADEIROS canonical logic: HOME / AWAY / DRAW
- `external_id` is prefixed: `fdo-` for football-data.org, `ss-` for SofaScore
- All timestamps are UTC ISO-8601 — display in local time in the UI
- Free FDO tier: 10 req/min. The pipeline enforces a 6.5s delay between requests.
- Super League Greece (GSL) coverage on FDO free tier depends on their data agreements; SofaScore fallback covers it reliably.
