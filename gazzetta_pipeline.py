#!/usr/bin/env python3
"""
KOUVADEIROS — Gazzetta.gr live score daemon

Fetches daily schedule + live scores from Gazzetta (no API key), writes local
JSON, and uploads to Cloudflare R2 — only while a ΠΡΟΓΡΑΜΜΑ match is in the
Cloudflare ops window: 30′ before kickoff → 30′ after Full Time.

Usage:
  python gazzetta_pipeline.py

Env (R2 — either naming scheme works):
  R2_ACCOUNT_ID / CF_ACCOUNT_ID
  R2_ACCESS_KEY_ID / CF_R2_ACCESS_KEY_ID
  R2_SECRET_ACCESS_KEY / CF_R2_SECRET_ACCESS_KEY
  R2_BUCKET_NAME / CF_R2_BUCKET   (default: kouvadeiros-scores)
"""

from __future__ import annotations

import json
import logging
import os
import sys
import tempfile
import time
import traceback
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
load_dotenv(ROOT / ".env")

from scraper.domain import Competition, MatchStatus  # noqa: E402
from scraper.gazzetta_client import (  # noqa: E402
    ATHENS,
    enrich_live,
    fetch_live_raw,
    fetch_schedule,
    parse_schedule,
)
from scraper.provider_gazzetta import GazzettaProvider  # noqa: E402

DATA_DIR = ROOT / "data"
LOG_DIR = ROOT / "logs"
SCHEDULE_PATH = DATA_DIR / "schedule.json"
LIVE_SCORES_PATH = DATA_DIR / "live_scores.json"
LAST_UPDATED_PATH = DATA_DIR / "last_updated.txt"
# Also keep KOUVADEIROS pipeline shape for existing Worker / frontend
LIVE_KOUV_PATH = DATA_DIR / "live.json"
TODAY_KOUV_PATH = DATA_DIR / "today.json"

POLL_SEC = 60
IDLE_SLEEP_SEC = 300
SCHEDULE_REFRESH_MIN = 60

# Cloudflare R2 uploads only in the same window as Worker/CI:
# 30′ pre-KO → FT+30′ (see scripts/cloud_ops_window.py / src/lib/data.js)
sys.path.insert(0, str(ROOT / "scripts"))
from cloud_ops_window import (  # noqa: E402
    CLOUD_AFTER_FT_MIN,
    CLOUD_BEFORE_MIN,
    in_cloud_ops_window,
)


def setup_logging() -> logging.Logger:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    logger = logging.getLogger("gazzetta_pipeline")
    logger.setLevel(logging.INFO)
    logger.handlers.clear()

    fmt = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
    fh = logging.FileHandler(LOG_DIR / "pipeline.log", encoding="utf-8")
    fh.setFormatter(fmt)
    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(fmt)
    logger.addHandler(fh)
    logger.addHandler(sh)
    return logger


log = setup_logging()


def atomic_write_json(path: Path, data) -> None:
    """Write valid JSON atomically (temp + replace) — Windows-safe."""
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=path.stem + ".", suffix=".tmp", dir=str(path.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        os.replace(tmp, path)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def atomic_write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=path.stem + ".", suffix=".tmp", dir=str(path.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(text)
        os.replace(tmp, path)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def env_first(*names: str, default: str | None = None) -> str | None:
    for n in names:
        v = os.getenv(n)
        if v:
            return v
    return default


def r2_configured() -> bool:
    return all(
        [
            env_first("R2_ACCOUNT_ID", "CF_ACCOUNT_ID"),
            env_first("R2_ACCESS_KEY_ID", "CF_R2_ACCESS_KEY_ID"),
            env_first("R2_SECRET_ACCESS_KEY", "CF_R2_SECRET_ACCESS_KEY"),
        ]
    )


def upload_r2(local_path: Path, key: str) -> None:
    import boto3

    account = env_first("R2_ACCOUNT_ID", "CF_ACCOUNT_ID")
    client = boto3.client(
        "s3",
        endpoint_url=f"https://{account}.r2.cloudflarestorage.com",
        aws_access_key_id=env_first("R2_ACCESS_KEY_ID", "CF_R2_ACCESS_KEY_ID"),
        aws_secret_access_key=env_first("R2_SECRET_ACCESS_KEY", "CF_R2_SECRET_ACCESS_KEY"),
        region_name="auto",
    )
    bucket = env_first("R2_BUCKET_NAME", "CF_R2_BUCKET", default="kouvadeiros-scores")
    content_type = "application/json" if local_path.suffix == ".json" else "text/plain"
    client.upload_file(
        str(local_path),
        bucket,
        key,
        ExtraArgs={"ContentType": content_type, "CacheControl": "public, max-age=30"},
    )
    log.info("R2 upload ok → %s/%s", bucket, key)


def safe_upload(local_path: Path, key: str) -> None:
    if not r2_configured():
        log.debug("R2 not configured — skip upload %s", key)
        return
    try:
        upload_r2(local_path, key)
    except Exception:
        log.error("R2 upload failed for %s:\n%s", key, traceback.format_exc())


def in_poll_window(now: datetime | None = None) -> bool:
    """True only while a ΠΡΟΓΡΑΜΜΑ match is in the Cloudflare ops window."""
    # Accept Athens or UTC; cloud helper normalizes to aware UTC.
    if now is not None and now.tzinfo is None:
        now = now.replace(tzinfo=ATHENS)
    if now is not None:
        now = now.astimezone(timezone.utc)
    return in_cloud_ops_window(now)


def write_kouv_from_provider(provider: GazzettaProvider) -> None:
    """Mirror Gazzetta into today.json / live.json for existing KOUVADEIROS consumers."""
    comps = [
        Competition.SUPER_LEAGUE_GRE,
        Competition.CHAMPIONS_LEAGUE,
        Competition.EUROPA_LEAGUE,
        Competition.CONFERENCE_LEAGUE,
    ]
    today_results = provider.fetch_today(comps)
    today_matches = []
    for r in today_results:
        today_matches.extend(r.matches)
    today_matches.sort(key=lambda m: m.kickoff_at_utc)

    def match_dict(m):
        d = m.to_dict()
        minute = getattr(m, "minute", None)
        if minute is not None:
            d["minute"] = minute
        return d

    today_payload = {
        "fetched_at_utc": datetime.now(timezone_utc()).isoformat(),
        "match_count": len(today_matches),
        "live_count": sum(1 for m in today_matches if m.status == MatchStatus.IN_PROGRESS),
        "errors": [],
        "validation_issues": [],
        "matches": [match_dict(m) for m in today_matches],
        "source": "gazzetta",
    }
    atomic_write_json(TODAY_KOUV_PATH, today_payload)
    safe_upload(TODAY_KOUV_PATH, "today.json")

    live_results = provider.fetch_live(comps)
    live_matches = []
    for r in live_results:
        live_matches.extend([m for m in r.matches if m.status == MatchStatus.IN_PROGRESS])
    live_payload = {
        "fetched_at_utc": datetime.now(timezone_utc()).isoformat(),
        "live_count": len(live_matches),
        "errors": [],
        "matches": [match_dict(m) for m in live_matches],
        "source": "gazzetta",
    }
    atomic_write_json(LIVE_KOUV_PATH, live_payload)
    safe_upload(LIVE_KOUV_PATH, "live.json")


def timezone_utc():
    from datetime import timezone

    return timezone.utc


def refresh_schedule(provider: GazzettaProvider) -> dict:
    raw = fetch_schedule()
    schedule = parse_schedule(raw)
    provider._schedule_cache = schedule
    provider._schedule_fetched_at = datetime.now(timezone_utc())
    atomic_write_json(SCHEDULE_PATH, schedule)
    safe_upload(SCHEDULE_PATH, "schedule.json")
    log.info(
        "Schedule refresh: endpoint=A status=ok football_matches=%s → %s",
        len(schedule),
        SCHEDULE_PATH,
    )
    return schedule


def poll_live(schedule: dict, provider: GazzettaProvider) -> int:
    try:
        live_raw = fetch_live_raw()
    except Exception:
        log.error("Live fetch failed:\n%s", traceback.format_exc())
        return -1

    if not isinstance(live_raw, dict):
        log.error("Live payload not a dict — skip cycle")
        return -1

    try:
        enriched = enrich_live(live_raw, schedule)
    except Exception:
        log.error("Live enrich/JSON failed:\n%s", traceback.format_exc())
        return -1

    payload = {
        "fetched_at": datetime.now(timezone_utc()).isoformat(),
        "count": len(enriched),
        "matches": enriched,
    }
    atomic_write_json(LIVE_SCORES_PATH, payload)
    atomic_write_text(LAST_UPDATED_PATH, datetime.now(timezone_utc()).isoformat() + "\n")
    safe_upload(LIVE_SCORES_PATH, "live_scores.json")
    safe_upload(LAST_UPDATED_PATH, "last_updated.txt")

    log.info(
        "Live fetch: endpoint=B status=ok live_count=%s → %s",
        len(enriched),
        LIVE_SCORES_PATH,
    )

    # Keep KOUVADEIROS live.json in sync (filter to target comps)
    try:
        write_kouv_live_only(provider, schedule, live_raw)
    except Exception:
        log.error("KOUV live.json write failed:\n%s", traceback.format_exc())

    return len(enriched)


def write_kouv_live_only(provider: GazzettaProvider, schedule: dict, live_raw: dict) -> None:
    provider._schedule_cache = schedule
    comps = [
        Competition.SUPER_LEAGUE_GRE,
        Competition.CHAMPIONS_LEAGUE,
        Competition.EUROPA_LEAGUE,
        Competition.CONFERENCE_LEAGUE,
    ]
    enriched = enrich_live(live_raw, schedule)
    from scraper.provider_gazzetta import _parse_minute, _status_from_live

    matches = []
    for row in enriched:
        mid = str(row.get("match_id"))
        sched = schedule.get(mid)
        if not sched:
            continue
        try:
            score_h = int(row["home_score"]) if str(row.get("home_score", "")).isdigit() else None
            score_a = int(row["away_score"]) if str(row.get("away_score", "")).isdigit() else None
        except (TypeError, ValueError):
            score_h = score_a = None
        m = provider._to_match(
            sched,
            score_h=score_h,
            score_a=score_a,
            status=_status_from_live(row),
            minute=_parse_minute(row.get("minute")),
        )
        if m and m.competition in comps and m.status == MatchStatus.IN_PROGRESS:
            matches.append(m.to_dict())

    payload = {
        "fetched_at_utc": datetime.now(timezone_utc()).isoformat(),
        "live_count": len(matches),
        "errors": [],
        "matches": matches,
        "source": "gazzetta",
    }
    atomic_write_json(LIVE_KOUV_PATH, payload)
    safe_upload(LIVE_KOUV_PATH, "live.json")


def main() -> None:
    log.info("Gazzetta pipeline starting (Ctrl+C to stop)")
    provider = GazzettaProvider()
    schedule: dict = {}
    last_schedule_at = datetime.min.replace(tzinfo=timezone_utc())

    try:
        schedule = refresh_schedule(provider)
        last_schedule_at = datetime.now(timezone_utc())
        if in_poll_window():
            try:
                write_kouv_from_provider(provider)
            except Exception:
                log.error("Initial KOUV today/live write failed:\n%s", traceback.format_exc())
        else:
            log.info(
                "Startup outside Cloudflare window (%s′ pre-KO → FT+%s′) — no R2 upload yet",
                CLOUD_BEFORE_MIN,
                CLOUD_AFTER_FT_MIN,
            )
    except Exception:
        log.error("Initial schedule failed:\n%s", traceback.format_exc())

    while True:
        try:
            now_utc = datetime.now(timezone_utc())

            if not in_poll_window(now_utc):
                log.info(
                    "Outside Cloudflare window (%s′ pre-KO → FT+%s′) — sleep %ss",
                    CLOUD_BEFORE_MIN,
                    CLOUD_AFTER_FT_MIN,
                    IDLE_SLEEP_SEC,
                )
                time.sleep(IDLE_SLEEP_SEC)
                continue

            if now_utc - last_schedule_at >= timedelta(minutes=SCHEDULE_REFRESH_MIN):
                try:
                    schedule = refresh_schedule(provider)
                    last_schedule_at = now_utc
                    write_kouv_from_provider(provider)
                except Exception:
                    log.error("Schedule refresh failed:\n%s", traceback.format_exc())

            if not schedule:
                try:
                    schedule = refresh_schedule(provider)
                    last_schedule_at = datetime.now(timezone_utc())
                except Exception:
                    log.error("Schedule empty and refresh failed — sleep 60s")
                    time.sleep(POLL_SEC)
                    continue

            n = poll_live(schedule, provider)
            if n == 0:
                # Empty live feed → write empty file already done; sleep longer
                log.info("No live matches — idle sleep %ss", IDLE_SLEEP_SEC)
                time.sleep(IDLE_SLEEP_SEC)
            elif n < 0:
                time.sleep(30)
            else:
                time.sleep(POLL_SEC)

        except KeyboardInterrupt:
            log.info("Stopped by user")
            break
        except Exception:
            log.error("Unexpected loop error:\n%s", traceback.format_exc())
            time.sleep(30)


if __name__ == "__main__":
    main()
