#!/usr/bin/env python3
"""
KOUVADEIROS Live Score Pipeline — CLI
Usage:
  python run.py live              # fetch currently live matches
  python run.py today             # fetch today's matches
  python run.py matchday GSL 5 2026   # fetch Matchday 5, Super League, season 2026
  python run.py daemon            # poll live scores every 60s (match day mode)
"""

import argparse
import json
import logging
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)

from scraper.domain import Competition
from scraper.pipeline import KouvadeirosLivePipeline

COMP_ALIASES = {
    "GSL": Competition.SUPER_LEAGUE_GRE,
    "UCL": Competition.CHAMPIONS_LEAGUE,
    "UEL": Competition.EUROPA_LEAGUE,
    "ECL": Competition.CONFERENCE_LEAGUE,
}


def build_pipeline(output: str) -> KouvadeirosLivePipeline:
    return KouvadeirosLivePipeline(
        fdo_api_key=os.getenv("FDO_API_KEY"),
        output_dir=output,
    )


def print_summary(data: dict) -> None:
    print(f"\n{'─'*60}")
    print(f"  Fetched at : {data['fetched_at_utc']}")
    match_count = data.get("match_count") or data.get("live_count", 0)
    print(f"  Matches    : {match_count}")
    if data.get("errors"):
        print(f"  ⚠  Errors  : {len(data['errors'])}")
        for e in data["errors"]:
            print(f"      → {e}")
    print(f"{'─'*60}")

    for m in data.get("matches", []):
        score = m["score"]
        h = score["home"] if score["home"] is not None else "-"
        a = score["away"] if score["away"] is not None else "-"
        kick = m["kickoff_at_utc"][11:16] + " UTC"
        status = m["status"]
        md = f"MD{m['matchday']}" if m.get("matchday") else ""
        comp = m["competition"]
        print(
            f"  [{comp:22}] {md:5}  "
            f"{m['home_team']['name']:25} {h} - {a}  "
            f"{m['away_team']['name']:25}  "
            f"[{status:12}] {kick}"
        )
    print()


def cmd_live(args) -> None:
    pipeline = build_pipeline(args.output)
    data = pipeline.fetch_live()
    print_summary(data)
    if args.json:
        print(json.dumps(data, ensure_ascii=False, indent=2))


def cmd_today(args) -> None:
    pipeline = build_pipeline(args.output)
    data = pipeline.fetch_today()
    print_summary(data)
    if args.json:
        print(json.dumps(data, ensure_ascii=False, indent=2))


def cmd_matchday(args) -> None:
    comp_key = args.competition.upper()
    if comp_key not in COMP_ALIASES:
        print(f"Unknown competition '{args.competition}'. Use: {list(COMP_ALIASES.keys())}")
        sys.exit(1)

    pipeline = build_pipeline(args.output)
    data = pipeline.fetch_matchday(
        competition=COMP_ALIASES[comp_key],
        matchday=int(args.matchday),
        season=int(args.season),
    )
    print_summary(data)
    if args.json:
        print(json.dumps(data, ensure_ascii=False, indent=2))


def cmd_daemon(args) -> None:
    """Polling daemon — polls live scores every N seconds on matchdays."""
    interval = int(args.interval)
    print(f"\n🟢 KOUVADEIROS Live Score Daemon — polling every {interval}s (Ctrl+C to stop)\n")
    pipeline = build_pipeline(args.output)

    try:
        while True:
            data = pipeline.fetch_live()
            live_count = data.get("live_count", 0)
            ts = data["fetched_at_utc"][11:19]
            print(f"[{ts}] Live matches: {live_count}")
            for m in data.get("matches", []):
                score = m["score"]
                h = score["home"] if score["home"] is not None else "-"
                a = score["away"] if score["away"] is not None else "-"
                print(
                    f"  {m['home_team']['name']} {h} - {a} {m['away_team']['name']}"
                    f"  [{m['status']}]  {m['competition']}"
                )
            print()
            time.sleep(interval)
    except KeyboardInterrupt:
        print("\n🔴 Daemon stopped.")


def main():
    parser = argparse.ArgumentParser(
        description="KOUVADEIROS Live Score Pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--output", "-o", default="./data", help="Output directory for JSON files")
    parser.add_argument("--json", action="store_true", help="Also print full JSON to stdout")

    subparsers = parser.add_subparsers(dest="command", required=True)

    # live
    p_live = subparsers.add_parser("live", help="Fetch currently live matches")
    p_live.set_defaults(func=cmd_live)

    # today
    p_today = subparsers.add_parser("today", help="Fetch today's fixtures and scores")
    p_today.set_defaults(func=cmd_today)

    # matchday
    p_md = subparsers.add_parser("matchday", help="Fetch a specific matchday")
    p_md.add_argument("competition", help="GSL | UCL | UEL | ECL")
    p_md.add_argument("matchday", help="Round/matchday number")
    p_md.add_argument("season", help="Season start year (e.g. 2026)")
    p_md.set_defaults(func=cmd_matchday)

    # daemon
    p_daemon = subparsers.add_parser("daemon", help="Poll live scores continuously")
    p_daemon.add_argument("--interval", default=60, help="Poll interval in seconds (default: 60)")
    p_daemon.set_defaults(func=cmd_daemon)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
