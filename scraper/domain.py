"""
KOUVADEIROS Data Domain
Match domain model aligned with the KOUVADEIROS state machine:
  SCHEDULED → PREDICTIONS_OPEN → PREDICTIONS_LOCKED → PREDICTIONS_REVEALED
  → IN_PROGRESS → FINISHED → SCORED → MATCHDAY_COMPLETE
"""

from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from typing import Optional
import json


class MatchStatus(str, Enum):
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    FINISHED = "FINISHED"
    POSTPONED = "POSTPONED"
    CANCELLED = "CANCELLED"
    UNKNOWN = "UNKNOWN"


class Competition(str, Enum):
    SUPER_LEAGUE_GRE = "SUPER_LEAGUE_GRE"
    CHAMPIONS_LEAGUE = "CHAMPIONS_LEAGUE"
    EUROPA_LEAGUE = "EUROPA_LEAGUE"
    CONFERENCE_LEAGUE = "CONFERENCE_LEAGUE"


# football-data.org competition codes
COMPETITION_CODES = {
    Competition.SUPER_LEAGUE_GRE: "GSL",     # Greek Super League
    Competition.CHAMPIONS_LEAGUE: "CL",
    Competition.EUROPA_LEAGUE: "EL",
    Competition.CONFERENCE_LEAGUE: "ECL",
}

# football-data.org competition IDs (for API v4)
COMPETITION_IDS = {
    Competition.SUPER_LEAGUE_GRE: 2008,
    Competition.CHAMPIONS_LEAGUE: 2001,
    Competition.EUROPA_LEAGUE: 2146,
    Competition.CONFERENCE_LEAGUE: 2285,
}


@dataclass
class TeamRef:
    """Lightweight team reference — uses stable external_id, never name string as identity."""
    external_id: str          # provider's stable team ID
    name: str                 # display name
    short_name: Optional[str] = None
    crest_url: Optional[str] = None

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class Score:
    home: Optional[int] = None
    away: Optional[int] = None
    half_time_home: Optional[int] = None
    half_time_away: Optional[int] = None

    @property
    def result(self) -> Optional[str]:
        """Derive HOME / AWAY / DRAW — canonical KOUVADEIROS result logic."""
        if self.home is None or self.away is None:
            return None
        if self.home > self.away:
            return "HOME"
        if self.away > self.home:
            return "AWAY"
        return "DRAW"

    def to_dict(self) -> dict:
        return {
            "home": self.home,
            "away": self.away,
            "half_time_home": self.half_time_home,
            "half_time_away": self.half_time_away,
            "result": self.result,
        }


@dataclass
class KouvadeirosMatch:
    """
    Normalized match object ready to upsert into KOUVADEIROS database.
    All timestamps are UTC ISO-8601 strings.
    team references carry external_id for stable resolution.
    """
    # Identity
    external_id: str              # provider's match ID  (e.g. "fdo-123456")
    provider: str                 # "football-data.org" | "sofascore"
    competition: Competition
    season: str                   # e.g. "2026/27"
    matchday: Optional[int]

    # Teams — never use name strings as match identity
    home_team: TeamRef
    away_team: TeamRef

    # Timing (UTC ISO-8601)
    kickoff_at_utc: str
    prediction_lock_at_utc: str   # kickoff − 1 minute (server enforced)

    # Status & Score
    status: MatchStatus
    score: Score

    # Metadata
    venue: Optional[str] = None
    fetched_at_utc: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    raw_source: Optional[dict] = field(default=None, repr=False)

    def to_dict(self) -> dict:
        d = {
            "external_id": self.external_id,
            "provider": self.provider,
            "competition": self.competition.value,
            "season": self.season,
            "matchday": self.matchday,
            "home_team": self.home_team.to_dict(),
            "away_team": self.away_team.to_dict(),
            "kickoff_at_utc": self.kickoff_at_utc,
            "prediction_lock_at_utc": self.prediction_lock_at_utc,
            "status": self.status.value,
            "score": self.score.to_dict(),
            "venue": self.venue,
            "fetched_at_utc": self.fetched_at_utc,
        }
        return d

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), ensure_ascii=False, indent=indent)


@dataclass
class ScrapeResult:
    """Envelope returned by every provider."""
    competition: Competition
    matches: list[KouvadeirosMatch]
    provider: str
    fetched_at_utc: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    @property
    def live_matches(self) -> list[KouvadeirosMatch]:
        return [m for m in self.matches if m.status == MatchStatus.IN_PROGRESS]

    @property
    def today_matches(self) -> list[KouvadeirosMatch]:
        today = datetime.now(timezone.utc).date().isoformat()
        return [m for m in self.matches if m.kickoff_at_utc.startswith(today)]

    def to_dict(self) -> dict:
        return {
            "competition": self.competition.value,
            "provider": self.provider,
            "fetched_at_utc": self.fetched_at_utc,
            "match_count": len(self.matches),
            "live_count": len(self.live_matches),
            "errors": self.errors,
            "warnings": self.warnings,
            "matches": [m.to_dict() for m in self.matches],
        }
