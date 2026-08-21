"""Shared Cloudflare ops window — keep in sync with src/lib/data.js.

Active while any ΠΡΟΓΡΑΜΜΑ fixture is:
  30′ before kickoff → 30′ after Full Time

CI / local daemons have no live FT clock, so FT is estimated as KO+100′
(90′ + HT). Hard cap matches Worker CLOUD_MAX_AFTER_KO_MIN (180′).
"""
from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
ATHENS = ZoneInfo("Europe/Athens")

# Keep in sync with src/lib/data.js
CLOUD_BEFORE_MIN = 30
CLOUD_AFTER_FT_MIN = 30
ESTIMATED_FT_AFTER_KO_MIN = 100
CLOUD_MAX_AFTER_KO_MIN = 180


def _parse_fixture_blocks(text: str) -> list[dict]:
    """Pull { id, kickoff, timeTbd, home/away } objects from JS fixture sources."""
    out: list[dict] = []
    for raw in re.finditer(r"\{([^{}]+)\}", text):
        block = raw.group(1)
        if "kickoff:" not in block:
            continue
        kid = re.search(r"\bid:\s*'([^']+)'", block)
        ko = re.search(r"kickoff:\s*'([^']+)'", block)
        if not kid or not ko:
            continue
        home = re.search(r"\bhome(?:Team)?:\s*'([^']+)'", block)
        away = re.search(r"\baway(?:Team)?:\s*'([^']+)'", block)
        out.append(
            {
                "id": kid.group(1),
                "kickoff": ko.group(1),
                "timeTbd": "timeTbd" in block,
                "home": home.group(1) if home else None,
                "away": away.group(1) if away else None,
            }
        )
    return out


def load_program_fixtures(root: Path | None = None) -> list[dict]:
    """ΠΡΟΓΡΑΜΜΑ fixtures from src/lib/data.js (preferred) + worker MATCHES."""
    root = root or ROOT
    by_id: dict[str, dict] = {}
    data_js = root / "src" / "lib" / "data.js"
    if data_js.exists():
        for fx in _parse_fixture_blocks(data_js.read_text(encoding="utf-8")):
            by_id[fx["id"]] = fx
    worker = root / "worker" / "kouvadeiros-api.js"
    if worker.exists():
        text = worker.read_text(encoding="utf-8")
        start = text.find("const MATCHES = [")
        end = text.find("\n]", start) if start >= 0 else -1
        chunk = text[start:end] if start >= 0 and end > start else ""
        for fx in _parse_fixture_blocks(chunk):
            by_id.setdefault(fx["id"], fx)
    return list(by_id.values())


def is_schedulable(fx: dict) -> bool:
    if not fx.get("kickoff") or fx.get("timeTbd"):
        return False
    if fx.get("home") == "TBD" or fx.get("away") == "TBD":
        return False
    return True


def parse_kickoff(raw: str) -> datetime:
    return datetime.fromisoformat(raw.replace("Z", "+00:00"))


def athens_ymd(dt: datetime | None = None) -> str:
    dt = dt or datetime.now(timezone.utc)
    return dt.astimezone(ATHENS).date().isoformat()


def in_cloud_ops_window(
    now: datetime | None = None,
    *,
    fixtures: list[dict] | None = None,
    ft_by_id: dict[str, datetime] | None = None,
) -> bool:
    """True while any fixture is 30′ pre-KO → FT+30′ (estimated FT if unknown)."""
    now = now or datetime.now(timezone.utc)
    if now.tzinfo is None:
        now = now.replace(tzinfo=timezone.utc)
    fixtures = fixtures if fixtures is not None else load_program_fixtures()
    after_est = min(ESTIMATED_FT_AFTER_KO_MIN + CLOUD_AFTER_FT_MIN, CLOUD_MAX_AFTER_KO_MIN)

    for fx in fixtures:
        if not is_schedulable(fx):
            continue
        ko = parse_kickoff(fx["kickoff"])
        mins_after = (now - ko).total_seconds() / 60.0
        if mins_after < -CLOUD_BEFORE_MIN:
            continue

        ft = (ft_by_id or {}).get(fx["id"])
        if ft is not None:
            if ft.tzinfo is None:
                ft = ft.replace(tzinfo=timezone.utc)
            if ft >= ko and now <= ft + timedelta(minutes=CLOUD_AFTER_FT_MIN):
                return True
            continue

        if mins_after <= after_est:
            return True
    return False


def should_run_cloud_sync(
    force: bool = False,
    now: datetime | None = None,
    *,
    fixtures: list[dict] | None = None,
) -> tuple[bool, str]:
    """KV/R2 sync only inside 30′ pre-KO → FT+30′ window (or --force)."""
    if force:
        return True, "forced"
    now = now or datetime.now(timezone.utc)
    if not in_cloud_ops_window(now, fixtures=fixtures):
        return (
            False,
            f"outside {CLOUD_BEFORE_MIN}′ pre-KO → FT+{CLOUD_AFTER_FT_MIN}′ window "
            f"(Athens {athens_ymd(now)})",
        )
    return True, f"ΠΡΟΓΡΑΜΜΑ cloud window ({CLOUD_BEFORE_MIN}′ pre-KO → FT+{CLOUD_AFTER_FT_MIN}′)"
