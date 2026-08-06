"""
Provider: Gazzetta.gr livescore feeds (no API key).
Maps Greek UEFA / Super League schedule + live scores → KouvadeirosMatch.
"""

from __future__ import annotations

import logging
import re
from datetime import datetime, timedelta, timezone
from typing import Optional
from zoneinfo import ZoneInfo

from .domain import (
    Competition,
    KouvadeirosMatch,
    MatchStatus,
    Score,
    ScrapeResult,
    TeamRef,
)
from .gazzetta_client import (
    ATHENS,
    enrich_live,
    fetch_live_raw,
    fetch_schedule,
    parse_schedule,
)

logger = logging.getLogger(__name__)

# Gazzetta league_id → KOUVADEIROS competition (best-effort)
LEAGUE_ID_MAP = {
    1815: Competition.EUROPA_LEAGUE,  # Προκριματικά Europa League
    14288: Competition.CONFERENCE_LEAGUE,
    1748: Competition.EUROPA_LEAGUE,  # EFL CUP — ignore via name filter usually
    # Super League ids vary by season; name match below covers GSL
}

LEAGUE_NAME_HINTS = (
    (Competition.SUPER_LEAGUE_GRE, ("super league", "σουπερ λιγκ", "σούπερ λιγκ", "ελλάδα")),
    (Competition.CHAMPIONS_LEAGUE, ("champions", "τσαμπιονς", "champions league")),
    (Competition.EUROPA_LEAGUE, ("europa league", "γιουρόπα", "europa")),
    (Competition.CONFERENCE_LEAGUE, ("conference", "κονφερενς")),
)


def _map_competition(league_id, league_name: str) -> Optional[Competition]:
    try:
        lid = int(league_id) if league_id is not None else None
    except (TypeError, ValueError):
        lid = None
    if lid in LEAGUE_ID_MAP:
        # Skip non-UEFA cups wrongly mapped
        name_l = (league_name or "").lower()
        if "efl" in name_l or "friendly" in name_l or "club friendly" in name_l:
            return None
        if lid == 1748:
            return None
        return LEAGUE_ID_MAP[lid]

    name_l = (league_name or "").lower()
    for comp, hints in LEAGUE_NAME_HINTS:
        if any(h in name_l for h in hints):
            return comp
    return None


def _parse_minute(raw) -> Optional[int]:
    if raw is None or raw == "":
        return None
    m = re.search(r"(\d+)", str(raw))
    return int(m.group(1)) if m else None


def _absolute_crest(path: Optional[str]) -> Optional[str]:
    if not path:
        return None
    if path.startswith("http"):
        return path
    return f"https://www.gazzetta.gr{path}"


def _status_from_live(row: dict) -> MatchStatus:
    name = (row.get("status_name") or "").lower()
    if name in ("finished", "ft", "ended", "τελος", "τέλος"):
        return MatchStatus.FINISHED
    if row.get("is_live") or name == "live":
        return MatchStatus.IN_PROGRESS
    return MatchStatus.SCHEDULED


class GazzettaProvider:
    """Fetch today's football schedule + live scores from Gazzetta."""

    PROVIDER = "gazzetta"

    def __init__(self):
        self._schedule_cache: dict[str, dict] = {}
        self._schedule_fetched_at: Optional[datetime] = None

    def refresh_schedule(self, day=None) -> dict[str, dict]:
        raw = fetch_schedule(day)
        self._schedule_cache = parse_schedule(raw)
        self._schedule_fetched_at = datetime.now(timezone.utc)
        logger.info(
            "[Gazzetta] schedule: %s football matches",
            len(self._schedule_cache),
        )
        return self._schedule_cache

    def ensure_schedule(self, max_age_min: int = 60) -> dict[str, dict]:
        now = datetime.now(timezone.utc)
        if (
            not self._schedule_cache
            or not self._schedule_fetched_at
            or (now - self._schedule_fetched_at) > timedelta(minutes=max_age_min)
        ):
            return self.refresh_schedule()
        return self._schedule_cache

    def _to_match(
        self,
        sched: dict,
        *,
        score_h: Optional[int] = None,
        score_a: Optional[int] = None,
        status: MatchStatus = MatchStatus.SCHEDULED,
        minute: Optional[int] = None,
    ) -> Optional[KouvadeirosMatch]:
        comp = _map_competition(sched.get("league_id"), sched.get("league_name") or "")
        if not comp:
            return None

        kickoff = sched.get("kickoff")
        if not kickoff:
            # Fallback: parse match_date + match_time as Athens local
            try:
                d, mo, y = (sched.get("match_date") or "").split("-")
                hh, mm = (sched.get("match_time") or "00:00").split(":")
                local = datetime(
                    int(y), int(mo), int(d), int(hh), int(mm), tzinfo=ATHENS
                )
                kickoff = local.astimezone(timezone.utc).isoformat()
            except Exception:
                kickoff = datetime.now(timezone.utc).isoformat()

        lock = (
            datetime.fromisoformat(kickoff.replace("Z", "+00:00")) - timedelta(minutes=1)
        ).isoformat()

        mid = sched.get("match_id")
        home_id = sched.get("home_team_id")
        away_id = sched.get("away_team_id")

        m = KouvadeirosMatch(
            external_id=f"gz-{mid}",
            provider=self.PROVIDER,
            competition=comp,
            season="2026/27",
            matchday=None,
            home_team=TeamRef(
                external_id=f"gz-t-{home_id}",
                name=sched.get("home") or "",
                short_name=None,
                crest_url=_absolute_crest(sched.get("home_team_logo")),
            ),
            away_team=TeamRef(
                external_id=f"gz-t-{away_id}",
                name=sched.get("away") or "",
                short_name=None,
                crest_url=_absolute_crest(sched.get("away_team_logo")),
            ),
            kickoff_at_utc=kickoff,
            prediction_lock_at_utc=lock,
            status=status,
            score=Score(home=score_h, away=score_a),
            venue=None,
            minute=minute,
            raw_source=sched,
        )
        return m

    def fetch_today(self, competitions: list[Competition]) -> list[ScrapeResult]:
        schedule = self.ensure_schedule()
        wanted = set(competitions)
        by_comp: dict[Competition, list[KouvadeirosMatch]] = {c: [] for c in competitions}

        for sched in schedule.values():
            # Prefer schedule scores if present
            sh = sched.get("home_score")
            sa = sched.get("away_score")
            try:
                score_h = int(sh) if sh is not None and str(sh).isdigit() else None
                score_a = int(sa) if sa is not None and str(sa).isdigit() else None
            except (TypeError, ValueError):
                score_h = score_a = None
            status = MatchStatus.SCHEDULED
            if score_h is not None and score_a is not None:
                # Unknown if finished — leave SCHEDULED unless we enrich from live later
                status = MatchStatus.SCHEDULED
            m = self._to_match(sched, score_h=score_h, score_a=score_a, status=status)
            if m and m.competition in wanted:
                by_comp[m.competition].append(m)

        results = []
        for comp in competitions:
            results.append(
                ScrapeResult(
                    competition=comp,
                    matches=by_comp.get(comp, []),
                    provider=self.PROVIDER,
                )
            )
            logger.info(
                "[Gazzetta] today %s: %s matches",
                comp.value,
                len(by_comp.get(comp, [])),
            )
        return results

    def fetch_live(self, competitions: list[Competition]) -> list[ScrapeResult]:
        schedule = self.ensure_schedule()
        live_raw = fetch_live_raw()
        enriched = enrich_live(live_raw, schedule)
        wanted = set(competitions)
        by_comp: dict[Competition, list[KouvadeirosMatch]] = {c: [] for c in competitions}

        for row in enriched:
            mid = str(row.get("match_id"))
            sched = schedule.get(mid)
            if not sched:
                # Unknown match — skip (can't name teams reliably for KOUVADEIROS mapping)
                continue
            try:
                score_h = int(row["home_score"]) if str(row.get("home_score", "")).isdigit() else None
                score_a = int(row["away_score"]) if str(row.get("away_score", "")).isdigit() else None
            except (TypeError, ValueError):
                score_h = score_a = None
            minute = _parse_minute(row.get("minute"))
            m = self._to_match(
                sched,
                score_h=score_h,
                score_a=score_a,
                status=_status_from_live(row),
                minute=minute,
            )
            if m and m.competition in wanted:
                by_comp[m.competition].append(m)

        results = []
        for comp in competitions:
            results.append(
                ScrapeResult(
                    competition=comp,
                    matches=by_comp.get(comp, []),
                    provider=self.PROVIDER,
                )
            )
        return results
