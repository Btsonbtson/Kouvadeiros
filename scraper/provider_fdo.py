"""
Provider: football-data.org (primary)
Free tier: 10 requests/min, covers GSL / UCL / UEL / UECL

API key: free at https://www.football-data.org/client/register
Set env var: FDO_API_KEY=your_key
"""

import os
import time
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional

import requests

from .domain import (
    Competition, COMPETITION_IDS,
    KouvadeirosMatch, MatchStatus, Score, ScrapeResult, TeamRef,
)

logger = logging.getLogger(__name__)

BASE_URL = "https://api.football-data.org/v4"
RATE_LIMIT_DELAY = 6.5  # seconds between requests on free tier (10 req/min)

STATUS_MAP = {
    "SCHEDULED": MatchStatus.SCHEDULED,
    "TIMED": MatchStatus.SCHEDULED,
    "IN_PLAY": MatchStatus.IN_PROGRESS,
    "PAUSED": MatchStatus.IN_PROGRESS,
    "FINISHED": MatchStatus.FINISHED,
    "POSTPONED": MatchStatus.POSTPONED,
    "CANCELLED": MatchStatus.CANCELLED,
    "SUSPENDED": MatchStatus.POSTPONED,
}


class FootballDataOrgProvider:
    """
    Fetches fixtures and live scores from football-data.org.
    Covers all four KOUVADEIROS competitions with a single free-tier key.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("FDO_API_KEY", "")
        if not self.api_key:
            logger.warning(
                "FDO_API_KEY not set. Unauthenticated requests are rate-limited to 1/min. "
                "Register free at https://www.football-data.org/client/register"
            )
        self.session = requests.Session()
        self.session.headers.update({
            "X-Auth-Token": self.api_key,
            "Accept": "application/json",
        })
        self._last_request_at: float = 0.0

    def _get(self, path: str, params: Optional[dict] = None) -> dict:
        """Rate-limited GET with retry on 429."""
        elapsed = time.time() - self._last_request_at
        if elapsed < RATE_LIMIT_DELAY:
            time.sleep(RATE_LIMIT_DELAY - elapsed)

        url = f"{BASE_URL}{path}"
        logger.debug(f"GET {url} params={params}")

        for attempt in range(3):
            resp = self.session.get(url, params=params, timeout=15)
            self._last_request_at = time.time()

            if resp.status_code == 200:
                return resp.json()
            elif resp.status_code == 429:
                wait = int(resp.headers.get("X-RequestCounter-Reset", 60))
                logger.warning(f"Rate limited. Waiting {wait}s…")
                time.sleep(wait)
            elif resp.status_code == 403:
                raise PermissionError(
                    f"FDO API key missing or insufficient permissions for {url}. "
                    "Some competitions require a paid plan."
                )
            else:
                raise RuntimeError(f"FDO API error {resp.status_code}: {resp.text[:200]}")

        raise RuntimeError(f"FDO API failed after 3 attempts: {url}")

    # ── Team parsing ────────────────────────────────────────────────────────

    def _parse_team(self, raw: dict) -> TeamRef:
        return TeamRef(
            external_id=f"fdo-{raw['id']}",
            name=raw.get("name", "Unknown"),
            short_name=raw.get("shortName") or raw.get("tla"),
            crest_url=raw.get("crest"),
        )

    # ── Score parsing ────────────────────────────────────────────────────────

    def _parse_score(self, raw: dict) -> Score:
        ft = raw.get("fullTime", {})
        ht = raw.get("halfTime", {})
        return Score(
            home=ft.get("home"),
            away=ft.get("away"),
            half_time_home=ht.get("home"),
            half_time_away=ht.get("away"),
        )

    # ── Match parsing ────────────────────────────────────────────────────────

    def _parse_match(self, raw: dict, competition: Competition, season: str) -> KouvadeirosMatch:
        kickoff_str: str = raw.get("utcDate", "")
        kickoff_dt = datetime.fromisoformat(kickoff_str.replace("Z", "+00:00"))
        lock_dt = kickoff_dt - timedelta(minutes=1)

        status_raw = raw.get("status", "UNKNOWN")
        status = STATUS_MAP.get(status_raw, MatchStatus.UNKNOWN)

        return KouvadeirosMatch(
            external_id=f"fdo-{raw['id']}",
            provider="football-data.org",
            competition=competition,
            season=season,
            matchday=raw.get("matchday"),
            home_team=self._parse_team(raw["homeTeam"]),
            away_team=self._parse_team(raw["awayTeam"]),
            kickoff_at_utc=kickoff_dt.isoformat(),
            prediction_lock_at_utc=lock_dt.isoformat(),
            status=status,
            score=self._parse_score(raw.get("score", {})),
            venue=raw.get("venue"),
            raw_source=raw,
        )

    # ── Public API ────────────────────────────────────────────────────────

    def fetch_matches(
        self,
        competition: Competition,
        season: Optional[int] = None,
        matchday: Optional[int] = None,
        date_from: Optional[str] = None,   # YYYY-MM-DD
        date_to: Optional[str] = None,
        status: Optional[str] = None,      # "LIVE" | "SCHEDULED" | "FINISHED"
    ) -> ScrapeResult:
        """
        Fetch matches for a competition.

        Args:
            competition: KOUVADEIROS Competition enum
            season: 4-digit year of season start (e.g. 2026 for 2026/27)
            matchday: filter to specific matchday
            date_from / date_to: narrow by date range (YYYY-MM-DD)
            status: filter by match status
        """
        comp_id = COMPETITION_IDS[competition]
        params: dict = {}
        if season:
            params["season"] = season
        if matchday:
            params["matchday"] = matchday
        if date_from:
            params["dateFrom"] = date_from
        if date_to:
            params["dateTo"] = date_to
        if status:
            params["status"] = status

        result = ScrapeResult(competition=competition, matches=[], provider="football-data.org")

        try:
            data = self._get(f"/competitions/{comp_id}/matches", params=params)
            season_label = data.get("filters", {}).get("season", str(season or "unknown"))
            season_str = f"{season_label}/{str(int(season_label)+1)[2:]}" if season_label.isdigit() else season_label

            for raw_match in data.get("matches", []):
                try:
                    match = self._parse_match(raw_match, competition, season_str)
                    result.matches.append(match)
                except Exception as e:
                    result.warnings.append(f"Skipped match {raw_match.get('id')}: {e}")

            logger.info(
                f"[FDO] {competition.value}: {len(result.matches)} matches fetched "
                f"({len(result.live_matches)} live)"
            )

        except PermissionError as e:
            result.errors.append(str(e))
            logger.error(str(e))
        except Exception as e:
            result.errors.append(f"FDO fetch failed for {competition.value}: {e}")
            logger.error(result.errors[-1])

        return result

    def fetch_live(self, competitions: Optional[list[Competition]] = None) -> list[ScrapeResult]:
        """Fetch all currently IN_PLAY matches across target competitions."""
        target = competitions or list(COMPETITION_IDS.keys())
        results = []
        for comp in target:
            r = self.fetch_matches(comp, status="LIVE")
            results.append(r)
        return results

    def fetch_today(self, competitions: Optional[list[Competition]] = None) -> list[ScrapeResult]:
        """Fetch today's matches across target competitions."""
        today = datetime.now(timezone.utc).date().isoformat()
        target = competitions or list(COMPETITION_IDS.keys())
        results = []
        for comp in target:
            r = self.fetch_matches(comp, date_from=today, date_to=today)
            results.append(r)
        return results

    def fetch_matchday(self, competition: Competition, matchday: int, season: int) -> ScrapeResult:
        """Fetch a specific matchday — used when KOUVADEIROS admin triggers import."""
        return self.fetch_matches(competition, season=season, matchday=matchday)
