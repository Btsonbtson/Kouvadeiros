"""Upload pipeline JSON to Cloudflare R2 and/or Workers KV.

Usage:
  python scripts/upload_to_r2.py              # fetch + upload (R2 if configured, else KV via wrangler)
  python scripts/upload_to_r2.py --skip-fetch
  python scripts/upload_to_r2.py --kv-only    # force KV path (no R2)
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
load_dotenv(ROOT / ".env")

DATA_DIR = ROOT / "data"
KV_NAMESPACE_ID = os.getenv("CF_KV_NAMESPACE_ID", "5988821db92146b08969e4b27ec8854e")


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
    """Upload via wrangler to remote KV (same namespace as kouvadeiros-api)."""
    if not local_path.exists():
        raise FileNotFoundError(local_path)
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
    print("Running:", " ".join(cmd))
    subprocess.check_call(cmd, cwd=str(ROOT))
    print(f"Uploaded {local_path.name} → KV:{key}")


def run_pipeline() -> None:
    from scraper.pipeline import KouvadeirosLivePipeline

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    pipeline = KouvadeirosLivePipeline(
        fdo_api_key=os.getenv("FDO_API_KEY"),
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
    args = parser.parse_args()

    if not args.skip_fetch:
        run_pipeline()

    today = DATA_DIR / "today.json"
    live = DATA_DIR / "live.json"
    for p in (today, live):
        if not p.exists():
            raise SystemExit(f"Missing {p} — run without --skip-fetch first")

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
