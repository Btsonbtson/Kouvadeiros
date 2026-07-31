"""
KOUVADEIROS Live Score Pipeline
Orchestrates: football-data.org (primary) → SofaScore (fallback)
Deduplicates, validates, and outputs normalized KouvadeirosMatch JSON.
"""

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from .domain import Competition, KouvadeirosMatch, MatchStatus, ScrapeResult
from .provider_fdo import FootballDataOrgProvider
from .provider_sofascore import SofaScoreProvider

logger = logging.getLogger(__name__)

TARGET_COMPETITIONS = [
    Competition.SUPER_LEAGUE_GRE,
    Competition.CHAMPIONS_LEAGUE,
    Competition.EUROPA_LEAGUE,
    Competition.CONFERENCE_LEAGUE,
]


class KouvadeirosLivePipeline:
    """
    Main pipeline. Fetches from FDO first; falls back to SofaScore per competition
    if FDO returns errors or zero matches.

    Output modes:
      - dict/JSON  → feed KOUVADEIROS API route or Supabase upsert
      - file       → write to /data/live.json for polling
    """

    def __init__(
        self,
        fdo_api_key: Optional[str] = None,
        output_dir: Optional[str] = None,
        competitions: Optional[list[Competition]] = None,
    ):
        self.fdo = FootballDataOrgProvider(api_key=fdo_api_key)
        self.sofascore = SofaScoreProvider()
        self.competitions = competitions or TARGET_COMPETITIONS
        self.output_dir = Path(output_dir) if output_dir else None

    # ── Deduplication ─────────────────────────────────────────────────────

    def _deduplicate(self, matches: list[KouvadeirosMatch]) -> list[KouvadeirosMatch]:
        """
        Dedup by (home_team_name, away_team_name, kickoff_date).
        FDO takes priority over SofaScore when both have same fixture.
        """
        seen: dict[str, KouvadeirosMatch] = {}
        for m in matches:
            date_part = m.kickoff_at_utc[:10]
            key = f"{m.home_team.name}|{m.away_team.name}|{date_part}"
            if key not in seen:
                seen[key] = m
            elif seen[key].provider == "sofascore" and m.provider == "football-data.org":
                seen[key] = m  # FDO wins
        return list(seen.values())

    # ── Validation ────────────────────────────────────────────────────────

    def _validate(self, match: KouvadeirosMatch) -> list[str]:
        issues = []
        if not match.external_id:
            issues.append("missing external_id")
        if not match.kickoff_at_utc:
            issues.append("missing kickoff_at_utc")
        if not match.home_team.external_id:
            issues.append("home_team missing external_id")
        if not match.away_team.external_id:
            issues.append("away_team missing external_id")
        if match.status == MatchStatus.FINISHED:
            if match.score.home is None or match.score.away is None:
                issues.append("FINISHED match missing score")
        return issues

    # ── Core fetch logic ──────────────────────────────────────────────────

    def _fetch_competition(self, comp: Competition) -> tuple[list[KouvadeirosMatch], list[str]]:
        """Try FDO first; fall back to SofaScore if FDO errors or returns nothing."""
        all_matches: list[KouvadeirosMatch] = []
        all_errors: list[str] = []

        # Primary: football-data.org
        fdo_result = self.fdo.fetch_today([comp])[0]

        if fdo_result.errors:
            logger.warning(f"[Pipeline] FDO errors for {comp.value}: {fdo_result.errors}")
            all_errors.extend([f"[FDO] {e}" for e in fdo_result.errors])
        
        if fdo_result.matches:
            logger.info(f"[Pipeline] FDO ✓ {comp.value}: {len(fdo_result.matches)} matches")
            all_matches.extend(fdo_result.matches)
            return all_matches, all_errors

        # Fallback: SofaScore
        logger.info(f"[Pipeline] FDO returned 0 matches for {comp.value} — trying SofaScore…")
        ss_result = self.sofascore.fetch_today([comp])[0]

        if ss_result.errors:
            all_errors.extend([f"[SofaScore] {e}" for e in ss_result.errors])
            logger.warning(f"[Pipeline] SofaScore also failed for {comp.value}")
        else:
            logger.info(f"[Pipeline] SofaScore ✓ {comp.value}: {len(ss_result.matches)} matches")
            all_matches.extend(ss_result.matches)

        return all_matches, all_errors

    # ── Public API ────────────────────────────────────────────────────────

    def fetch_today(self) -> dict:
        """
        Fetch today's matches across all target competitions.
        Returns a KOUVADEIROS-ready dict suitable for API response or Supabase upsert.
        """
        all_matches: list[KouvadeirosMatch] = []
        all_errors: list[str] = []
        validation_issues: list[dict] = []

        for comp in self.competitions:
            matches, errors = self._fetch_competition(comp)
            all_matches.extend(matches)
            all_errors.extend(errors)

        # Deduplicate cross-provider
        all_matches = self._deduplicate(all_matches)

        # Validate
        for m in all_matches:
            issues = self._validate(m)
            if issues:
                validation_issues.append({"match": m.external_id, "issues": issues})

        # Sort by kickoff
        all_matches.sort(key=lambda m: m.kickoff_at_utc)

        result = {
            "fetched_at_utc": datetime.now(timezone.utc).isoformat(),
            "match_count": len(all_matches),
            "live_count": sum(1 for m in all_matches if m.status == MatchStatus.IN_PROGRESS),
            "errors": all_errors,
            "validation_issues": validation_issues,
            "matches": [m.to_dict() for m in all_matches],
        }

        if self.output_dir:
            self._write_output(result, "today.json")

        return result

    def fetch_live(self) -> dict:
        """Fetch only currently live matches (IN_PROGRESS)."""
        # Use SofaScore live endpoint as it's more real-time for live scores
        all_matches: list[KouvadeirosMatch] = []
        all_errors: list[str] = []

        # Try FDO live first
        fdo_results = self.fdo.fetch_live(self.competitions)
        for r in fdo_results:
            all_matches.extend(r.live_matches)
            all_errors.extend(r.errors)

        # If FDO found nothing live, try SofaScore
        if not all_matches:
            logger.info("[Pipeline] No FDO live matches — polling SofaScore for live data…")
            ss_results = self.sofascore.fetch_live(self.competitions)
            for r in ss_results:
                all_matches.extend(r.matches)
                all_errors.extend(r.errors)

        all_matches = self._deduplicate(all_matches)
        all_matches.sort(key=lambda m: m.kickoff_at_utc)

        result = {
            "fetched_at_utc": datetime.now(timezone.utc).isoformat(),
            "live_count": len(all_matches),
            "errors": all_errors,
            "matches": [m.to_dict() for m in all_matches],
        }

        if self.output_dir:
            self._write_output(result, "live.json")

        return result

    def fetch_matchday(
        self,
        competition: Competition,
        matchday: int,
        season: int,
    ) -> dict:
        """
        Fetch a complete matchday — used when KOUVADEIROS admin imports a round.
        Maps to: Match → Result → Scoring trigger in the KOUVADEIROS lifecycle.
        """
        result = ScrapeResult(competition=competition, matches=[], provider="pipeline")

        # Try FDO
        fdo_result = self.fdo.fetch_matchday(competition, matchday, season)
        if fdo_result.matches and not fdo_result.errors:
            result.matches = fdo_result.matches
        else:
            # SofaScore fallback
            ss_result = self.sofascore.fetch_round(competition, matchday)
            result.matches = ss_result.matches
            result.errors = fdo_result.errors + ss_result.errors

        result.matches.sort(key=lambda m: m.kickoff_at_utc)
        output = result.to_dict()

        if self.output_dir:
            self._write_output(output, f"matchday_{competition.value}_{matchday}.json")

        return output

    # ── Output ────────────────────────────────────────────────────────────

    def _write_output(self, data: dict, filename: str) -> None:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        path = self.output_dir / filename
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2))
        logger.info(f"[Pipeline] Written → {path}")
