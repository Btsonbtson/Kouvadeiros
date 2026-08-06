"""
Gazzetta.gr livescore feeds — no API key.

Endpoint A: daily schedule  GET https://www.gazzetta.gr/gztfeeds/livescore?date={D-M-YYYY}
Endpoint B: live matches    GET https://api.gazzetta.gr/gztfeeds/live_matches
"""

from __future__ import annotations

import logging
import time
from datetime import date, datetime
from typing import Any, Optional
from zoneinfo import ZoneInfo

import requests

logger = logging.getLogger(__name__)

ATHENS = ZoneInfo("Europe/Athens")

SCHEDULE_URL = "https://www.gazzetta.gr/gztfeeds/livescore"
LIVE_URL = "https://api.gazzetta.gr/gztfeeds/live_matches"

HEADERS = {
    "Accept": "application/json",
    "Accept-Language": "el-GR,el;q=0.9,en;q=0.8",
    "Referer": "https://www.gazzetta.gr/livescore",
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36"
    ),
}

FOOTBALL_SPORT = "Ποδόσφαιρο"


def athens_date_dmy(d: Optional[date] = None) -> str:
    """Windows-safe D-M-YYYY (no %-d)."""
    d = d or datetime.now(ATHENS).date()
    return f"{d.day}-{d.month}-{d.year}"


def get_json(url: str, params: Optional[dict] = None, retries: int = 3) -> Any:
    """GET JSON with retries; raises on final failure."""
    last_err: Optional[Exception] = None
    for attempt in range(1, retries + 1):
        try:
            resp = requests.get(url, headers=HEADERS, params=params, timeout=20)
            logger.info(
                "GET %s status=%s attempt=%s bytes=%s",
                url,
                resp.status_code,
                attempt,
                len(resp.content),
            )
            if resp.status_code >= 400:
                raise RuntimeError(f"HTTP {resp.status_code}: {resp.text[:200]}")
            return resp.json()
        except Exception as e:
            last_err = e
            logger.warning("Gazzetta fetch failed (%s/%s): %s", attempt, retries, e)
            if attempt < retries:
                time.sleep(30)
    raise RuntimeError(f"Gazzetta fetch failed after {retries} retries: {last_err}")


def fetch_schedule(day: Optional[date] = None) -> dict:
    """Raw Endpoint A payload."""
    return get_json(SCHEDULE_URL, params={"date": athens_date_dmy(day)})


def fetch_live_raw() -> dict:
    """Raw Endpoint B payload (match_id → live row). Empty {} when idle."""
    data = get_json(LIVE_URL)
    return data if isinstance(data, dict) else {}


def parse_schedule(raw: dict) -> dict[str, dict]:
    """
    Flatten Endpoint A → { match_id_str: structured match }.
    Football only (sport == Ποδόσφαιρο).
    """
    out: dict[str, dict] = {}
    if not isinstance(raw, dict):
        return out

    for _league_key, block in raw.items():
        if not isinstance(block, dict):
            continue
        league = block.get("league") or {}
        if league.get("sport") != FOOTBALL_SPORT:
            continue
        matches = block.get("matches") or {}
        if not isinstance(matches, dict):
            continue
        for _inner_id, m in matches.items():
            if not isinstance(m, dict):
                continue
            mid = m.get("match_id")
            if mid is None:
                continue
            mid_s = str(mid)
            kickoff_unix = m.get("match_tm")
            kickoff_iso = None
            if kickoff_unix not in (None, ""):
                try:
                    kickoff_iso = datetime.fromtimestamp(
                        int(kickoff_unix), tz=ZoneInfo("UTC")
                    ).isoformat()
                except (TypeError, ValueError, OSError):
                    kickoff_iso = None

            out[mid_s] = {
                "match_id": int(mid) if str(mid).isdigit() else mid,
                "home": m.get("home_team_name") or "",
                "away": m.get("away_team_name") or "",
                "home_team_id": m.get("home_team_id"),
                "away_team_id": m.get("away_team_id"),
                "home_team_logo": m.get("home_team_logo"),
                "away_team_logo": m.get("away_team_logo"),
                "league_id": league.get("league_id") or m.get("league_id"),
                "league_name": league.get("league_name") or "",
                "kickoff": kickoff_iso,
                "match_date": m.get("match_date"),
                "match_time": m.get("match_time"),
                "round_name": m.get("round_name"),
                "match_url": m.get("match_url"),
                "home_score": m.get("home_team_score"),
                "away_score": m.get("away_team_score"),
            }
    return out


def enrich_live(live_raw: dict, schedule: dict[str, dict]) -> list[dict]:
    """Join Endpoint B rows with schedule team/league names."""
    enriched: list[dict] = []
    for mid, row in (live_raw or {}).items():
        if not isinstance(row, dict):
            continue
        mid_s = str(row.get("match_id") or mid)
        sched = schedule.get(mid_s) or {}
        minute = row.get("minute")
        if minute is None:
            minute = ""
        enriched.append(
            {
                "match_id": row.get("match_id") or mid_s,
                "home_team": sched.get("home") or "",
                "away_team": sched.get("away") or "",
                "home_score": str(row.get("home_score") if row.get("home_score") is not None else ""),
                "away_score": str(row.get("away_score") if row.get("away_score") is not None else ""),
                "minute": minute,
                "match_status": row.get("match_status"),
                "status_name": row.get("status_name"),
                "league_id": row.get("league_id") or sched.get("league_id"),
                "league_name": sched.get("league_name") or "",
                "kickoff": sched.get("kickoff"),
                "is_live": bool(row.get("is_live")),
            }
        )
    return enriched
