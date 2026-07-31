# KOUVADEIROS Live Score Pipeline — Cursor Handover Guide

## Architecture

```
Python pipeline (run locally or on a cron VM)
        │
        │  writes normalized JSON
        ▼
Cloudflare R2 Bucket  (live.json / today.json)
        │
        │  reads & serves
        ▼
kouvadeiros-api  (Cloudflare Worker — existing)
        │
        │  REST response
        ▼
KOUVADEIROS Next.js app
```

The Python pipeline CANNOT run inside the Cloudflare Worker (Workers are JS/TS only).
It runs externally — locally, or on a cron job (Railway free tier, GitHub Actions, etc.)
and writes output JSON to Cloudflare R2. The Worker reads from R2 and serves it.

---

## Existing Cloudflare Worker

- Worker name: `kouvadeiros-api`
- CF account: Jboikos@gmail.com
- API key env var: `FDORG_TOKEN` (Plaintext, already set in Worker Settings → Variables)

---

## Step 1 — Copy files into the repo

```
kouvadeiros/
├── scraper/                        ← new: Python data pipeline
│   ├── __init__.py
│   ├── domain.py
│   ├── pipeline.py
│   ├── provider_fdo.py
│   └── provider_sofascore.py
├── scripts/
│   └── upsert_to_supabase.py
├── sql/
│   └── create_matches_external.sql
├── run.py
├── .env.example
└── CURSOR_HANDOVER.md
```

---

## Step 2 — Push to GitHub

```bash
cd /your/kouvadeiros/repo

git add scraper/ scripts/ sql/create_matches_external.sql run.py .env.example CURSOR_HANDOVER.md
git commit -m "feat: live score pipeline (FDO primary / SofaScore fallback)"
git push origin main
```

---

## Step 3 — Set up local .env

Create `.env` in the repo root:

```env
# The key is already in the Cloudflare Worker as FDORG_TOKEN
FDO_API_KEY=same_value_as_FDORG_TOKEN

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudflare R2 (for pipeline output upload — see Step 5)
CF_ACCOUNT_ID=your_cloudflare_account_id
CF_R2_BUCKET=kouvadeiros-scores
CF_R2_ACCESS_KEY_ID=your_r2_access_key
CF_R2_SECRET_ACCESS_KEY=your_r2_secret_key
```

---

## Step 4 — Install Python dependencies

```bash
pip install requests playwright python-dotenv supabase boto3
playwright install chromium   # only if SofaScore fallback needed
```

---

## Step 5 — Create a Cloudflare R2 bucket

In the Cloudflare dashboard (same account, Jboikos@gmail.com):

1. Go to **R2 → Create bucket** → name it `kouvadeiros-scores`
2. Go to **R2 → Manage R2 API tokens** → create a token with **Object Read & Write**
3. Copy the Access Key ID and Secret into `.env` above

---

## Step 6 — Add R2 upload to the pipeline

Ask Cursor to add this script:

**`scripts/upload_to_r2.py`**

```python
"""Upload pipeline JSON output to Cloudflare R2."""
import boto3, os, json
from pathlib import Path

s3 = boto3.client(
    "s3",
    endpoint_url=f"https://{os.getenv('CF_ACCOUNT_ID')}.r2.cloudflarestorage.com",
    aws_access_key_id=os.getenv("CF_R2_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("CF_R2_SECRET_ACCESS_KEY"),
)

def upload(local_path: str, key: str):
    s3.upload_file(
        local_path,
        os.getenv("CF_R2_BUCKET", "kouvadeiros-scores"),
        key,
        ExtraArgs={"ContentType": "application/json"},
    )
    print(f"Uploaded {local_path} → R2:{key}")

if __name__ == "__main__":
    from scraper.pipeline import KouvadeirosLivePipeline
    import tempfile, json

    pipeline = KouvadeirosLivePipeline(output_dir="./data")
    pipeline.fetch_today()
    pipeline.fetch_live()
    upload("data/today.json", "today.json")
    upload("data/live.json",  "live.json")
```

---

## Step 7 — Update the Cloudflare Worker to serve R2 data

Ask Cursor to add these two routes to `kouvadeiros-api` Worker:

```typescript
// In the existing Worker (kouvadeiros-api)
// Add R2 binding in Cloudflare dashboard: Settings → Bindings → R2 → name it SCORES_BUCKET

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // GET /live-scores?mode=live|today
    if (url.pathname === "/live-scores") {
      const mode = url.searchParams.get("mode") ?? "today"
      const key  = mode === "live" ? "live.json" : "today.json"

      const object = await env.SCORES_BUCKET.get(key)
      if (!object) {
        return Response.json({ error: "No data yet. Run the pipeline." }, { status: 404 })
      }

      const data = await object.json()
      return Response.json(data, {
        headers: {
          "Cache-Control": "public, max-age=30, stale-while-revalidate=10",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    // ... rest of existing Worker routes
  }
}

interface Env {
  FDORG_TOKEN: string      // already exists
  SCORES_BUCKET: R2Bucket  // new R2 binding
}
```

Add the R2 binding in Cloudflare dashboard:
**Workers & Pages → kouvadeiros-api → Settings → Bindings → Add → R2 bucket**
- Variable name: `SCORES_BUCKET`
- R2 bucket: `kouvadeiros-scores`

---

## Step 8 — Wire into the KOUVADEIROS Next.js app

```typescript
// lib/live-scores.ts
const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL  // e.g. https://kouvadeiros-api.your-subdomain.workers.dev

export async function getLiveScores() {
  const res = await fetch(`${WORKER_URL}/live-scores?mode=live`, {
    next: { revalidate: 30 }
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.matches ?? []
}

export async function getTodayFixtures() {
  const res = await fetch(`${WORKER_URL}/live-scores?mode=today`, {
    next: { revalidate: 60 }
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.matches ?? []
}
```

---

## Step 9 — Set up the polling cron

### Option A: GitHub Actions (free, zero infra)

Create `.github/workflows/live-scores.yml`:

```yaml
name: Live Score Sync
on:
  schedule:
    - cron: '*/2 * * * *'   # every 2 min (GitHub min is 5min on free tier)
  workflow_dispatch:          # allow manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install requests python-dotenv boto3
      - run: python scripts/upload_to_r2.py
        env:
          FDO_API_KEY: ${{ secrets.FDORG_TOKEN }}
          CF_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}
          CF_R2_BUCKET: kouvadeiros-scores
          CF_R2_ACCESS_KEY_ID: ${{ secrets.CF_R2_ACCESS_KEY_ID }}
          CF_R2_SECRET_ACCESS_KEY: ${{ secrets.CF_R2_SECRET_ACCESS_KEY }}
```

Add secrets in GitHub repo → Settings → Secrets and variables → Actions.

### Option B: Local daemon on matchdays

```bash
python run.py daemon --interval 60
# then in another terminal:
python scripts/upload_to_r2.py   # run manually after daemon updates data/
```

---

## Cursor Task List

Paste these into Cursor one at a time:

### Task 1 — R2 upload script
```
Create scripts/upload_to_r2.py that reads data/live.json and data/today.json
(output from the Python pipeline) and uploads them to Cloudflare R2.
Use boto3 with the R2 S3-compatible endpoint.
Env vars: CF_ACCOUNT_ID, CF_R2_BUCKET, CF_R2_ACCESS_KEY_ID, CF_R2_SECRET_ACCESS_KEY.
```

### Task 2 — Worker routes for live scores
```
Add two routes to the existing kouvadeiros-api Cloudflare Worker:
  GET /live-scores?mode=today  → reads today.json from R2 binding SCORES_BUCKET
  GET /live-scores?mode=live   → reads live.json from R2 binding SCORES_BUCKET
Return JSON with Cache-Control: max-age=30 and CORS headers.
The env already has FDORG_TOKEN; add SCORES_BUCKET as a new R2 binding.
```

### Task 3 — Live score display on Matchday page
```
The Worker endpoint GET /live-scores?mode=today returns KouvadeirosMatch objects.
Wire this into the Matchday home page:
- SCHEDULED: show kickoff time (local timezone)
- IN_PROGRESS: show live score with a pulsing green dot, auto-refresh every 60s
- FINISHED: show final score
Use the existing design system: dark navy background, pitch-green accents,
scoreboard typography. Score display should feel like a real stadium scoreboard.
```

### Task 4 — Admin result import
```
On the admin result entry page, when an admin opens a match:
Query the Supabase `matches_external` table for a row matching
(home_team_name, away_team_name, kickoff date).
If a FINISHED match is found with score_home and score_away,
pre-fill the result form with those values.
Admin must still click "Confirm" — never auto-apply.
Show the data source ("Imported from football-data.org") next to the pre-filled values.
```

### Task 5 — GitHub Actions cron
```
Create .github/workflows/live-scores.yml that runs the pipeline
(python scripts/upload_to_r2.py) on a schedule.
Use secrets: FDORG_TOKEN, CF_ACCOUNT_ID, CF_R2_BUCKET,
CF_R2_ACCESS_KEY_ID, CF_R2_SECRET_ACCESS_KEY.
```

---

## Data model reference

```typescript
interface KouvadeirosMatch {
  external_id: string          // "fdo-123456" | "ss-789"
  provider: string             // "football-data.org" | "sofascore"
  competition: string          // "SUPER_LEAGUE_GRE" | "CHAMPIONS_LEAGUE" | "EUROPA_LEAGUE" | "CONFERENCE_LEAGUE"
  season: string               // "2026/27"
  matchday: number | null
  home_team: { external_id: string; name: string; short_name: string|null; crest_url: string|null }
  away_team: { external_id: string; name: string; short_name: string|null; crest_url: string|null }
  kickoff_at_utc: string       // ISO-8601 UTC
  prediction_lock_at_utc: string  // kickoff − 1 minute (KOUVADEIROS lock rule)
  status: "SCHEDULED" | "IN_PROGRESS" | "FINISHED" | "POSTPONED" | "CANCELLED"
  score: {
    home: number | null
    away: number | null
    half_time_home: number | null
    half_time_away: number | null
    result: "HOME" | "AWAY" | "DRAW" | null  // canonical KOUVADEIROS result logic
  }
  venue: string | null
}
```

## Competition codes

| CLI | Enum                | FDO ID | SofaScore ID |
|-----|---------------------|--------|--------------|
| GSL | SUPER_LEAGUE_GRE    | 2008   | 238          |
| UCL | CHAMPIONS_LEAGUE    | 2001   | 7            |
| UEL | EUROPA_LEAGUE       | 2146   | 679          |
| ECL | CONFERENCE_LEAGUE   | 2285   | 17015        |

## Known limitations

1. GitHub Actions free tier minimum schedule is 5 minutes (not 2). For true
   60-second live polling on matchdays, run `python run.py daemon` locally.
2. R2 free tier: 10GB storage, 10M reads/month — more than enough.
3. SofaScore fallback is for resilience only (personal/non-commercial use).
4. `FDORG_TOKEN` in the Worker and `FDO_API_KEY` in your local `.env` must be
   the same value — just different names per environment.
