#!/usr/bin/env python3
"""Unit tests for Cloudflare 30′ pre-KO → FT+30′ window."""
from __future__ import annotations

import sys
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from cloud_ops_window import (  # noqa: E402
    CLOUD_AFTER_FT_MIN,
    CLOUD_BEFORE_MIN,
    CLOUD_MAX_AFTER_KO_MIN,
    ESTIMATED_FT_AFTER_KO_MIN,
    in_cloud_ops_window,
    load_program_fixtures,
    should_run_cloud_sync,
)


def ko_at(iso: str) -> dict:
    return {"id": "t1", "kickoff": iso, "home": "OLY", "away": "NEC", "timeTbd": False}


class CloudOpsWindowTests(unittest.TestCase):
    def test_constants_match_spec(self):
        self.assertEqual(CLOUD_BEFORE_MIN, 30)
        self.assertEqual(CLOUD_AFTER_FT_MIN, 30)
        self.assertEqual(ESTIMATED_FT_AFTER_KO_MIN, 100)
        self.assertEqual(CLOUD_MAX_AFTER_KO_MIN, 180)

    def test_inactive_before_warmup(self):
        ko = datetime(2026, 8, 11, 17, 30, tzinfo=timezone.utc)
        fx = [ko_at(ko.isoformat().replace("+00:00", "Z"))]
        now = ko - timedelta(minutes=31)
        self.assertFalse(in_cloud_ops_window(now, fixtures=fx))

    def test_active_at_30_pre_ko(self):
        ko = datetime(2026, 8, 11, 17, 30, tzinfo=timezone.utc)
        fx = [ko_at(ko.isoformat().replace("+00:00", "Z"))]
        now = ko - timedelta(minutes=30)
        self.assertTrue(in_cloud_ops_window(now, fixtures=fx))

    def test_active_during_match(self):
        ko = datetime(2026, 8, 11, 17, 30, tzinfo=timezone.utc)
        fx = [ko_at(ko.isoformat().replace("+00:00", "Z"))]
        now = ko + timedelta(minutes=45)
        self.assertTrue(in_cloud_ops_window(now, fixtures=fx))

    def test_closes_30_after_known_ft(self):
        ko = datetime(2026, 8, 11, 17, 30, tzinfo=timezone.utc)
        ft = ko + timedelta(minutes=95)
        fx = [ko_at(ko.isoformat().replace("+00:00", "Z"))]
        # Still inside FT+30
        self.assertTrue(
            in_cloud_ops_window(
                ft + timedelta(minutes=29),
                fixtures=fx,
                ft_by_id={"t1": ft},
            )
        )
        # Past FT+30
        self.assertFalse(
            in_cloud_ops_window(
                ft + timedelta(minutes=31),
                fixtures=fx,
                ft_by_id={"t1": ft},
            )
        )

    def test_estimated_ft_closes_around_ko_plus_130(self):
        ko = datetime(2026, 8, 11, 17, 30, tzinfo=timezone.utc)
        fx = [ko_at(ko.isoformat().replace("+00:00", "Z"))]
        # KO+130′ = estimated FT (100) + 30
        self.assertTrue(in_cloud_ops_window(ko + timedelta(minutes=130), fixtures=fx))
        self.assertFalse(in_cloud_ops_window(ko + timedelta(minutes=131), fixtures=fx))

    def test_skips_tbd(self):
        ko = datetime(2026, 8, 11, 17, 30, tzinfo=timezone.utc)
        fx = [
            {
                "id": "tba",
                "kickoff": ko.isoformat().replace("+00:00", "Z"),
                "home": "TBD",
                "away": "NEC",
                "timeTbd": False,
            }
        ]
        self.assertFalse(in_cloud_ops_window(ko, fixtures=fx))

    def test_loads_real_program_fixtures(self):
        fixtures = load_program_fixtures()
        self.assertGreater(len(fixtures), 0)
        self.assertTrue(any(f.get("kickoff") for f in fixtures))

    def test_gate_today_outside_window(self):
        # 2026-08-08 has no match in the live window (next is later)
        now = datetime(2026, 8, 8, 15, 0, tzinfo=timezone.utc)
        ok, reason = should_run_cloud_sync(force=False, now=now)
        self.assertFalse(ok)
        self.assertIn("outside", reason)

    def test_force_overrides(self):
        ok, reason = should_run_cloud_sync(force=True)
        self.assertTrue(ok)
        self.assertEqual(reason, "forced")


if __name__ == "__main__":
    unittest.main()
