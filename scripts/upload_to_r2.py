"""Upload pipeline JSON to Cloudflare R2 and/or Workers KV.

Runs only on ΠΡΟΓΡΑΜΜΑ game days while a match is in the live window
(15′ warm-up → +200′), unless --force.

Usage:
  python scripts/upload_to_r2.py              # fetch + upload (R2 if configured, else KV)
  python scripts/upload_to_r2.py --skip-fetch
  python scripts/upload_to_r2.py --kv-only    # force KV path (no R2)
  python scripts/upload_to_r2.py --gate       # print run=0|1 for Actions; exit 0
"""
from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

try:
    from dotenv import load_dotenv
except ImportError:  # gate / CI before deps install
    def load_dotenv(*_a, **_k):
        return False

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
load_dotenv(ROOT / ".env")

DATA_DIR = ROOT / "data"
KV_NAMESPACE_ID = os.getenv("CF_KV_NAMESPACE_ID", "5988821db92146b08969e4b27ec8854e")
ATHENS = ZoneInfo("Europe/Athens")


def r2_configured() -> bool:
    return all(
        os.getenv(k)
        for k in (
            "CF_ACCOUNT_ID",
            "CF_R2_ACCESS_KEY_ID",
            "CF_R2_SECRET_ACCESS_KEY",
        )
    )


def upload_r2(local_path: Path, key: str) -> None:
    import boto3

    account = os.getenv("CF_ACCOUNT_ID")
    client = boto3.client(
        "s3",
        endpoint_url=f"https://{account}.r2.cloudflarestorage.com",
        aws_access_key_id=os.getenv("CF_R2_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("CF_R2_SECRET_ACCESS_KEY"),
        region_name="auto",
    )
    bucket = os.getenv("CF_R2_BUCKET", "kouvadeiros-scores")
    client.upload_file(
        str(local_path),
        bucket,
        key,
        ExtraArgs={"ContentType": "application/json", "CacheControl": "public, max-age=30"},
    )
    print(f"Uploaded {local_path.name} → R2:{bucket}/{key}")


def upload_kv(local_path: Path, key: str) -> None:
    """Upload to remote KV (same namespace as kouvadeiros-api)."""
    if not local_path.exists():
        raise FileNotFoundError(local_path)

    token = os.getenv("CLOUDFLARE_API_TOKEN")
    account = os.getenv("CF_ACCOUNT_ID") or os.getenv("CLOUDFLARE_ACCOUNT_ID")

    if token and account:
        import requests

        url = (
            f"https://api.cloudflare.com/client/v4/accounts/{account}"
            f"/storage/kv/namespaces/{KV_NAMESPACE_ID}/values/{key}"
        )
        print(f"Uploading {local_path.name} → KV:{key} (API)")
        resp = requests.put(
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            data=local_path.read_bytes(),
            timeout=60,
        )
        if not resp.ok:
            detail = resp.text[:500]
            raise RuntimeError(f"KV API upload failed ({resp.status_code}): {detail}")
        print(f"Uploaded {local_path.name} → KV:{key}")
        return

    cmd = [
        "npx",
        "wrangler",
        "kv",
        "key",
        "put",
        key,
        "--path",
        str(local_path),
        "--namespace-id",
        KV_NAMESPACE_ID,
        "--remote",
    ]
    # Avoid printing absolute paths (Greek chars break Windows cp1252 consoles).
    print(f"Uploading {local_path.name} → KV:{key} (wrangler)")
    # Windows needs shell=True so npx.cmd resolves from PATH.
    subprocess.check_call(cmd, cwd=str(ROOT), shell=(os.name == "nt"))
    print(f"Uploaded {local_path.name} → KV:{key}")


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


def load_program_fixtures() -> list[dict]:
    """ΠΡΟΓΡΑΜΜΑ fixtures from src/lib/data.js (preferred) + worker MATCHES."""
    by_id: dict[str, dict] = {}
    data_js = ROOT / "src" / "lib" / "data.js"
    if data_js.exists():
        for fx in _parse_fixture_blocks(data_js.read_text(encoding="utf-8")):
            by_id[fx["id"]] = fx
    worker = ROOT / "worker" / "kouvadeiros-api.js"
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


def is_program_game_day(now: datetime | None = None) -> bool:
    """True when Athens today has a real ΠΡΟΓΡΑΜΜΑ kickoff."""
    now = now or datetime.now(timezone.utc)
    ymd = athens_ymd(now)
    for fx in load_program_fixtures():
        if not is_schedulable(fx):
            continue
        if athens_ymd(parse_kickoff(fx["kickoff"])) == ymd:
            return True
    return False


def in_live_score_band(now: datetime | None = None, warmup_min: int = 15, after_min: int = 200) -> bool:
    """True only while a scheduled match is 15′ warm-up → +200′ — not idle days."""
    now = now or datetime.now(timezone.utc)
    for fx in load_program_fixtures():
        if not is_schedulable(fx):
            continue
        mins_after = (now - parse_kickoff(fx["kickoff"])).total_seconds() / 60.0
        if -warmup_min <= mins_after <= after_min:
            return True
    return False


def should_run_cloud_sync(force: bool = False, now: datetime | None = None) -> tuple[bool, str]:
    """KV/R2 sync only on ΠΡΟΓΡΑΜΜΑ game days inside the live window (or --force)."""
    if force:
        return True, "forced"
    now = now or datetime.now(timezone.utc)
    if not is_program_game_day(now):
        return False, f"not a ΠΡΟΓΡΑΜΜΑ game day (Athens {athens_ymd(now)})"
    if not in_live_score_band(now):
        return False, "game day but outside warm-up/+200′ window"
    return True, "ΠΡΟΓΡΑΜΜΑ game day + live window"


def run_pipeline() -> None:
    from scraper.pipeline import KouvadeirosLivePipeline

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    pipeline = KouvadeirosLivePipeline(
        fdo_api_key=os.getenv("FDO_API_KEY") or os.getenv("FDORG_TOKEN"),
        output_dir=str(DATA_DIR),
    )
    print("Fetching today…")
    pipeline.fetch_today()
    print("Fetching live…")
    pipeline.fetch_live()


def main() -> None:
    parser = argparse.ArgumentParser(description="KOUVADEIROS score sync → R2/KV")
    parser.add_argument("--skip-fetch", action="store_true")
    parser.add_argument("--kv-only", action="store_true", help="Skip R2; write to Workers KV")
    parser.add_argument(
        "--fetch-only",
        action="store_true",
        help="Fetch and write data/*.json but do not upload to R2/KV",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Run even outside ΠΡΟΓΡΑΜΜΑ game-day / live windows",
    )
    parser.add_argument(
        "--gate",
        action="store_true",
        help="Print GitHub Actions outputs (run=0|1) and exit without syncing",
    )
    args = parser.parse_args()

    ok, reason = should_run_cloud_sync(force=args.force)
    if args.gate:
        # Always allow manual force via workflow; --gate itself respects --force
        print(f"run={'1' if ok else '0'}")
        print(f"reason={reason}")
        return

    if not args.force and not args.skip_fetch and not ok:
        print(f"Skip live sync — {reason} (use --force to override)")
        return

    if not args.skip_fetch:
        run_pipeline()

    today = DATA_DIR / "today.json"
    live = DATA_DIR / "live.json"
    for p in (today, live):
        if not p.exists():
            raise SystemExit(f"Missing {p} — run without --skip-fetch first")

    if args.fetch_only:
        print(f"Fetch-only OK → {today} · {live} (no upload)")
        print("Done.")
        return

    use_kv = args.kv_only or not r2_configured()
    if use_kv:
        print("Using KV upload (--kv-only or R2 env not set)")
        upload_kv(today, "today.json")
        upload_kv(live, "live.json")
    else:
        try:
            upload_r2(today, "today.json")
            upload_r2(live, "live.json")
        except Exception as e:
            print(f"R2 upload failed ({e}); falling back to KV")
            upload_kv(today, "today.json")
            upload_kv(live, "live.json")

    print("Done.")


if __name__ == "__main__":
    main()
