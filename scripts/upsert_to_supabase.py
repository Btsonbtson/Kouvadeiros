"""
KOUVADEIROS — Supabase Upsert Script
Reads pipeline output and upserts into Supabase matches table.

Usage:
  python scripts/upsert_to_supabase.py --file data/today.json
  python scripts/upsert_to_supabase.py --live   # fetch & upsert in one step

Requires:
  pip install supabase --break-system-packages
  Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
"""

import argparse
import json
import logging
import os
import sys
from pathlib import Path

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

sys.path.insert(0, str(Path(__file__).parent.parent))


def load_supabase():
    try:
        from supabase import create_client
    except ImportError:
        logger.error("supabase not installed. Run: pip install supabase --break-system-packages")
        sys.exit(1)

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        logger.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.")
        sys.exit(1)

    return create_client(url, key)


def transform_match_for_db(match: dict) -> dict:
    """
    Transform pipeline output into KOUVADEIROS DB schema.
    Assumes matches table has:
      external_id, provider, competition, season, matchday,
      home_team_external_id, home_team_name,
      away_team_external_id, away_team_name,
      kickoff_at_utc, prediction_lock_at_utc,
      status, score_home, score_away, score_result,
      ht_home, ht_away, venue, fetched_at_utc
    """
    score = match.get("score", {})
    return {
        "external_id": match["external_id"],
        "provider": match["provider"],
        "competition": match["competition"],
        "season": match["season"],
        "matchday": match.get("matchday"),
        "home_team_external_id": match["home_team"]["external_id"],
        "home_team_name": match["home_team"]["name"],
        "home_team_short_name": match["home_team"].get("short_name"),
        "home_team_crest_url": match["home_team"].get("crest_url"),
        "away_team_external_id": match["away_team"]["external_id"],
        "away_team_name": match["away_team"]["name"],
        "away_team_short_name": match["away_team"].get("short_name"),
        "away_team_crest_url": match["away_team"].get("crest_url"),
        "kickoff_at_utc": match["kickoff_at_utc"],
        "prediction_lock_at_utc": match["prediction_lock_at_utc"],
        "status": match["status"],
        "score_home": score.get("home"),
        "score_away": score.get("away"),
        "score_result": score.get("result"),
        "score_ht_home": score.get("half_time_home"),
        "score_ht_away": score.get("half_time_away"),
        "venue": match.get("venue"),
        "fetched_at_utc": match.get("fetched_at_utc"),
    }


def upsert_matches(matches: list[dict]) -> dict:
    if not matches:
        logger.info("No matches to upsert.")
        return {"upserted": 0, "errors": []}

    sb = load_supabase()
    rows = [transform_match_for_db(m) for m in matches]

    errors = []
    upserted = 0

    # Batch in chunks of 50
    for i in range(0, len(rows), 50):
        batch = rows[i:i+50]
        try:
            resp = (
                sb.table("matches_external")
                .upsert(batch, on_conflict="external_id")
                .execute()
            )
            upserted += len(batch)
            logger.info(f"Upserted batch {i//50 + 1}: {len(batch)} rows")
        except Exception as e:
            err = f"Batch {i//50 + 1} failed: {e}"
            errors.append(err)
            logger.error(err)

    return {"upserted": upserted, "errors": errors}


def main():
    parser = argparse.ArgumentParser(description="Upsert pipeline output into Supabase")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--file", help="Path to pipeline JSON output file")
    group.add_argument("--live", action="store_true", help="Fetch live then upsert immediately")
    group.add_argument("--today", action="store_true", help="Fetch today then upsert immediately")
    args = parser.parse_args()

    if args.file:
        data = json.loads(Path(args.file).read_text())
        matches = data.get("matches", [])
    else:
        from scraper.pipeline import KouvadeirosLivePipeline
        pipeline = KouvadeirosLivePipeline()
        if args.live:
            data = pipeline.fetch_live()
        else:
            data = pipeline.fetch_today()
        matches = data.get("matches", [])

    logger.info(f"Upserting {len(matches)} matches…")
    result = upsert_matches(matches)
    logger.info(f"Done: {result['upserted']} upserted, {len(result['errors'])} errors")

    if result["errors"]:
        for e in result["errors"]:
            logger.error(e)
        sys.exit(1)


if __name__ == "__main__":
    main()
