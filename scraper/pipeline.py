"""
KOUVADEIROS Live Score Pipeline
Orchestrates: Gazzetta (live primary) → football-data.org → SofaScore (fallback)
Deduplicates, validates, and outputs normalized KouvadeirosMatch JSON.
"""

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from .domain import Competition, KouvadeirosMatch, MatchStatus, ScrapeResult
from .provider_fdo import FootballDataOrgProvider
from .provider_gazzetta import GazzettaProvider
from .provider_sofascore import SofaScoreProvider

logger = logging.getLogger(__name__)

TARGET_COMPETITIONS = [
    Competition.SUPER_LEAGUE_GRE,
    Competition.CHAMPIONS_LEAGUE,
    Competition.EUROPA_LEAGUE,
    Competition.CONFERENCE_LEAGUE,
]

# Higher = preferred when deduping same fixture
PROVIDER_PRIORITY = {
    "gazzetta": 3,
    "football-data.org": 2,
    "sofascore": 1,
}


class KouvadeirosLivePipeline:
    """
    Main pipeline. Live: Gazzetta first (no key, minutes). Today: FDO then Gazzetta then SofaScore.
    """

    def __init__(
        self,
        fdo_api_key: Optional[str] = None,
        output_dir: Optional[str] = None,
        competitions: Optional[list[Competition]] = None,
    ):
        self.fdo = FootballDataOrgProvider(api_key=fdo_api_key)
        self.gazzetta = GazzettaProvider()
        self.sofascore = SofaScoreProvider()
        self.competitions = competitions or TARGET_COMPETITIONS
        self.output_dir = Path(output_dir) if output_dir else None

    def _deduplicate(self, matches: list[KouvadeirosMatch]) -> list[KouvadeirosMatch]:
        """Dedup by home|away|date. Prefer Gazzetta > FDO > SofaScore."""
        seen: dict[str, KouvadeirosMatch] = {}
        for m in matches:
            date_part = m.kickoff_at_utc[:10]
            key = f"{m.home_team.name}|{m.away_team.name}|{date_part}"
            if key not in seen:
                seen[key] = m
                continue
            cur = seen[key]
            if PROVIDER_PRIORITY.get(m.provider, 0) > PROVIDER_PRIORITY.get(cur.provider, 0):
                seen[key] = m
            elif (
                m.provider == cur.provider
                and m.status == MatchStatus.IN_PROGRESS
                and (m.minute or 0) > (cur.minute or 0)
            ):
                seen[key] = m
        return list(seen.values())

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

    def _fetch_competition(self, comp: Competition) -> tuple[list[KouvadeirosMatch], list[str]]:
        """Try FDO first; merge Gazzetta; SofaScore if still empty."""
        all_matches: list[KouvadeirosMatch] = []
        all_errors: list[str] = []

        fdo_result = self.fdo.fetch_today([comp])[0]
        if fdo_result.errors:
            logger.warning(f"[Pipeline] FDO errors for {comp.value}: {fdo_result.errors}")
            all_errors.extend([f"[FDO] {e}" for e in fdo_result.errors])
        if fdo_result.matches:
            logger.info(f"[Pipeline] FDO ✓ {comp.value}: {len(fdo_result.matches)} matches")
            all_matches.extend(fdo_result.matches)

        try:
            gz_result = self.gazzetta.fetch_today([comp])[0]
            if gz_result.matches:
                logger.info(f"[Pipeline] Gazzetta ✓ {comp.value}: {len(gz_result.matches)} matches")
                all_matches.extend(gz_result.matches)
            if gz_result.errors:
                all_errors.extend([f"[Gazzetta] {e}" for e in gz_result.errors])
        except Exception as e:
            all_errors.append(f"[Gazzetta] {e}")
            logger.warning(f"[Pipeline] Gazzetta today failed for {comp.value}: {e}")

        if all_matches:
            return all_matches, all_errors

        logger.info(f"[Pipeline] FDO+Gazzetta returned 0 for {comp.value} — trying SofaScore…")
        ss_result = self.sofascore.fetch_today([comp])[0]
        if ss_result.errors:
            all_errors.extend([f"[SofaScore] {e}" for e in ss_result.errors])
            logger.warning(f"[Pipeline] SofaScore also failed for {comp.value}")
        else:
            logger.info(f"[Pipeline] SofaScore ✓ {comp.value}: {len(ss_result.matches)} matches")
            all_matches.extend(ss_result.matches)

        return all_matches, all_errors

    def fetch_today(self) -> dict:
        all_matches: list[KouvadeirosMatch] = []
        all_errors: list[str] = []
        validation_issues: list[dict] = []

        for comp in self.competitions:
            matches, errors = self._fetch_competition(comp)
            all_matches.extend(matches)
            all_errors.extend(errors)

        all_matches = self._deduplicate(all_matches)
        for m in all_matches:
            issues = self._validate(m)
            if issues:
                validation_issues.append({"match": m.external_id, "issues": issues})

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
        """Gazzetta primary (minutes, no key), then FDO, then SofaScore."""
        all_matches: list[KouvadeirosMatch] = []
        all_errors: list[str] = []

        try:
            gz_results = self.gazzetta.fetch_live(self.competitions)
            for r in gz_results:
                all_matches.extend([m for m in r.matches if m.status == MatchStatus.IN_PROGRESS])
                all_errors.extend(r.errors)
            if all_matches:
                logger.info(f"[Pipeline] Gazzetta live ✓ {len(all_matches)} matches")
        except Exception as e:
            all_errors.append(f"[Gazzetta] {e}")
            logger.warning(f"[Pipeline] Gazzetta live failed: {e}")

        try:
            fdo_results = self.fdo.fetch_live(self.competitions)
            for r in fdo_results:
                all_matches.extend(r.live_matches)
                all_errors.extend(r.errors)
        except Exception as e:
            all_errors.append(f"[FDO] {e}")

        if not all_matches:
            logger.info("[Pipeline] No Gazzetta/FDO live — polling SofaScore…")
            try:
                ss_results = self.sofascore.fetch_live(self.competitions)
                for r in ss_results:
                    all_matches.extend(r.matches)
                    all_errors.extend(r.errors)
            except Exception as e:
                all_errors.append(f"[SofaScore] {e}")

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

    def fetch_matchday(self, competition: Competition, matchday: int, season: int) -> dict:
        result = ScrapeResult(competition=competition, matches=[], provider="pipeline")
        fdo_result = self.fdo.fetch_matchday(competition, matchday, season)
        if fdo_result.matches and not fdo_result.errors:
            result.matches = fdo_result.matches
        else:
            ss_result = self.sofascore.fetch_round(competition, matchday)
            result.matches = ss_result.matches
            result.errors = fdo_result.errors + ss_result.errors
        result.matches.sort(key=lambda m: m.kickoff_at_utc)
        output = result.to_dict()
        if self.output_dir:
            self._write_output(output, f"matchday_{competition.value}_{matchday}.json")
        return output

    def _write_output(self, data: dict, filename: str) -> None:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        path = self.output_dir / filename
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        logger.info(f"[Pipeline] Written → {path}")
