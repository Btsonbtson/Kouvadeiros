"""
Provider: SofaScore (fallback)
Uses SofaScore's internal API (reverse-engineered, no official key required).
Falls back to Playwright browser scraping if the JSON API is blocked.

⚠️  SofaScore ToS: personal/non-commercial use. Respect robots.txt and rate limits.
    This fallback activates only when football-data.org fails or lacks data.
"""

import logging
import time
from datetime import datetime, timezone, timedelta
from typing import Optional

import requests

from .domain import (
    Competition, KouvadeirosMatch, MatchStatus, Score, ScrapeResult, TeamRef,
)

logger = logging.getLogger(__name__)

# SofaScore internal API — works without auth for public match data
SOFASCORE_API = "https://api.sofascore.com/api/v1"

# SofaScore tournament IDs for KOUVADEIROS competitions
SOFASCORE_TOURNAMENT_IDS = {
    Competition.SUPER_LEAGUE_GRE: 238,   # Greek Super League
    Competition.CHAMPIONS_LEAGUE: 7,
    Competition.EUROPA_LEAGUE: 679,
    Competition.CONFERENCE_LEAGUE: 17015,
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json",
    "Referer": "https://www.sofascore.com/",
    "Origin": "https://www.sofascore.com",
}

STATUS_MAP = {
    "notstarted": MatchStatus.SCHEDULED,
    "inprogress": MatchStatus.IN_PROGRESS,
    "finished": MatchStatus.FINISHED,
    "postponed": MatchStatus.POSTPONED,
    "cancelled": MatchStatus.CANCELLED,
}


class SofaScoreProvider:
    """
    Fallback scraper using SofaScore's internal JSON API.
    Activates when football-data.org is unavailable or rate-limited.
    """

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self._last_request_at: float = 0.0

    def _get(self, path: str, params: Optional[dict] = None) -> dict:
        elapsed = time.time() - self._last_request_at
        if elapsed < 2.0:
            time.sleep(2.0 - elapsed)

        url = f"{SOFASCORE_API}{path}"
        logger.debug(f"[SofaScore] GET {url}")

        for attempt in range(3):
            resp = self.session.get(url, params=params, timeout=15)
            self._last_request_at = time.time()

            if resp.status_code == 200:
                return resp.json()
            elif resp.status_code == 429:
                logger.warning("[SofaScore] Rate limited. Waiting 30s…")
                time.sleep(30)
            elif resp.status_code == 403:
                # Try Playwright browser fallback
                logger.warning("[SofaScore] JSON API blocked (403). Trying Playwright…")
                return self._playwright_fallback(url)
            else:
                raise RuntimeError(f"SofaScore error {resp.status_code}: {url}")

        raise RuntimeError(f"[SofaScore] Failed after 3 attempts: {url}")

    def _playwright_fallback(self, url: str) -> dict:
        """
        Use a headless browser to fetch the JSON API URL, bypassing bot detection.
        Requires: playwright install chromium
        """
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            raise RuntimeError(
                "Playwright not installed. Run: pip install playwright && playwright install chromium"
            )

        logger.info("[SofaScore/Playwright] Launching headless browser…")
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent=HEADERS["User-Agent"],
                extra_http_headers={
                    "Referer": "https://www.sofascore.com/",
                    "Accept": "application/json",
                },
            )
            page = context.new_page()

            # Capture JSON response via network interception
            json_data: dict = {}

            def handle_response(response):
                nonlocal json_data
                if url in response.url and response.status == 200:
                    try:
                        json_data = response.json()
                    except Exception:
                        pass

            page.on("response", handle_response)
            page.goto(url, wait_until="networkidle", timeout=30000)

            browser.close()

        if not json_data:
            raise RuntimeError(f"[SofaScore/Playwright] No JSON captured for {url}")

        return json_data

    # ── Parsing ──────────────────────────────────────────────────────────────

    def _parse_team(self, raw: dict) -> TeamRef:
        return TeamRef(
            external_id=f"ss-{raw['id']}",
            name=raw.get("name", "Unknown"),
            short_name=raw.get("nameCode"),
            crest_url=f"https://api.sofascore.com/api/v1/team/{raw['id']}/image",
        )

    def _parse_score(self, raw_event: dict) -> Score:
        home_score = raw_event.get("homeScore", {})
        away_score = raw_event.get("awayScore", {})
        return Score(
            home=home_score.get("current"),
            away=away_score.get("current"),
            half_time_home=home_score.get("period1"),
            half_time_away=away_score.get("period1"),
        )

    def _parse_event(self, raw: dict, competition: Competition) -> KouvadeirosMatch:
        ts = raw.get("startTimestamp", 0)
        kickoff_dt = datetime.fromtimestamp(ts, tz=timezone.utc)
        lock_dt = kickoff_dt - timedelta(minutes=1)

        status_raw = raw.get("status", {}).get("type", "notstarted")
        status = STATUS_MAP.get(status_raw, MatchStatus.UNKNOWN)

        season_raw = raw.get("season", {})
        season_year = season_raw.get("year", "")
        season_str = f"{season_year}/{str(int(season_year)+1)[2:]}" if str(season_year).isdigit() else str(season_year)

        return KouvadeirosMatch(
            external_id=f"ss-{raw['id']}",
            provider="sofascore",
            competition=competition,
            season=season_str,
            matchday=raw.get("roundInfo", {}).get("round"),
            home_team=self._parse_team(raw["homeTeam"]),
            away_team=self._parse_team(raw["awayTeam"]),
            kickoff_at_utc=kickoff_dt.isoformat(),
            prediction_lock_at_utc=lock_dt.isoformat(),
            status=status,
            score=self._parse_score(raw),
            venue=raw.get("venue", {}).get("name") if raw.get("venue") else None,
            raw_source=raw,
        )

    # ── Public API ────────────────────────────────────────────────────────

    def fetch_live(self, competitions: Optional[list[Competition]] = None) -> list[ScrapeResult]:
        """Fetch live events for target competitions."""
        target = competitions or list(SOFASCORE_TOURNAMENT_IDS.keys())
        results = []

        for comp in target:
            result = ScrapeResult(competition=comp, matches=[], provider="sofascore")
            try:
                tid = SOFASCORE_TOURNAMENT_IDS[comp]
                data = self._get(f"/sport/football/tournament/{tid}/season/current/events/live")

                for raw_event in data.get("events", []):
                    try:
                        match = self._parse_event(raw_event, comp)
                        result.matches.append(match)
                    except Exception as e:
                        result.warnings.append(f"Skipped event {raw_event.get('id')}: {e}")

                logger.info(
                    f"[SofaScore] {comp.value}: {len(result.matches)} live matches"
                )

            except Exception as e:
                result.errors.append(f"SofaScore failed for {comp.value}: {e}")
                logger.error(result.errors[-1])

            results.append(result)

        return results

    def fetch_round(
        self,
        competition: Competition,
        round_number: int,
        season_id: Optional[int] = None,
    ) -> ScrapeResult:
        """
        Fetch all events for a specific round.
        If season_id is None, uses the current season.
        """
        result = ScrapeResult(competition=competition, matches=[], provider="sofascore")
        try:
            tid = SOFASCORE_TOURNAMENT_IDS[competition]
            season_path = f"season/{season_id}" if season_id else "season/current"
            data = self._get(f"/sport/football/tournament/{tid}/{season_path}/events/round/{round_number}")

            for raw_event in data.get("events", []):
                try:
                    match = self._parse_event(raw_event, competition)
                    result.matches.append(match)
                except Exception as e:
                    result.warnings.append(f"Skipped event {raw_event.get('id')}: {e}")

        except Exception as e:
            result.errors.append(f"SofaScore round fetch failed: {e}")
            logger.error(result.errors[-1])

        return result

    def fetch_today(self, competitions: Optional[list[Competition]] = None) -> list[ScrapeResult]:
        """Fetch today's events per competition."""
        today = datetime.now(timezone.utc)
        date_str = today.strftime("%Y-%m-%d")
        target = competitions or list(SOFASCORE_TOURNAMENT_IDS.keys())
        results = []

        for comp in target:
            result = ScrapeResult(competition=comp, matches=[], provider="sofascore")
            try:
                tid = SOFASCORE_TOURNAMENT_IDS[comp]
                data = self._get(f"/sport/football/tournament/{tid}/season/current/events/last/0")
                all_events = data.get("events", [])

                # Filter to today
                for raw_event in all_events:
                    ts = raw_event.get("startTimestamp", 0)
                    event_date = datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
                    if event_date == date_str:
                        try:
                            match = self._parse_event(raw_event, comp)
                            result.matches.append(match)
                        except Exception as e:
                            result.warnings.append(f"Skipped: {e}")

            except Exception as e:
                result.errors.append(f"SofaScore today fetch failed for {comp.value}: {e}")
                logger.error(result.errors[-1])

            results.append(result)

        return results
