# KOUVADEIROS — Architecture & Ops Handover

A prediction league app for 3 friends (Boikos, Mavromichalis, Chousiadas):
tip scorelines for UEFA playoffs + Greek Super League matches, get points
for correct results/qualifications, see a live leaderboard.

- **Frontend**: Vite + React (`src/`), deployed to **Cloudflare Pages**
  (`kouvadeiros.pages.dev`, Git-integrated — every push to `main` deploys).
- **Primary backend**: Cloudflare Worker `kouvadeiros-api` (`worker/`) — KV
  storage, WhatsApp reminders via Twilio, admin routes, ESPN/Gazzetta live
  score polling. Deployed by `.github/workflows/deploy-worker.yml`.
- **Fallback backend**: Cloudflare Pages Functions "bridge" (`functions/`) —
  used automatically **only** when the Worker is unreachable or broken. See
  [Backend priority](#backend-priority-worker-primary-bridge-fallback) below.

## Directory map

```
src/                     React app
  lib/api.js             Backend client: Worker-primary / bridge-fallback / offline
  lib/data.js            Fixtures, scoring rules, seeded historical tips
  App.jsx                Main UI (predictions board, leaderboard, admin panel)
  pages/Login.jsx         Login screen
worker/kouvadeiros-api.js Real backend: KV, WhatsApp, cron, admin, ESPN proxy
functions/               Pages Functions bridge (fallback only)
  api/[[path]].js        Routes: /ping /login /state /prediction /result /chat
  _lib/kouv.js           HMAC tokens, ntfy ledger read/merge helpers
public/live-ledger.json Durable snapshot of bridge-era tips/results (git-committed)
scripts/
  merge-ntfy-ledger.mjs        Polls ntfy → updates live-ledger.json (run by Actions)
  import-ledger-to-worker.mjs  ONE-TIME: migrate bridge tips into Worker KV
  smoke-*.mjs                  Regression tests, see package.json `test:*` scripts
.github/workflows/
  deploy-pages.yml       Verifies prod build; manual wrangler deploy path
  deploy-worker.yml      Deploys kouvadeiros-api Worker (needs CF secrets)
  sync-tip-ledger.yml    Cron: ntfy → live-ledger.json (keeps bridge durable)
  live-scores.yml        Cron: Gazzetta/FDO live scores → R2 (see below)
scraper/, run.py         Python live-score pipeline (FDO + SofaScore fallback)
```

## Backend priority: Worker-primary, bridge-fallback

`src/lib/api.js`'s `workerLoginSafe()` decides which backend to use, **every
login/upgrade attempt**:

1. **Probe the real Worker** (`GET /ping`). If it answers `loginFixed:true`
   or `version>=13` (and isn't itself answering as the bridge), it's used —
   this is the primary path with full KV, WhatsApp, admin routes.
2. Otherwise, **probe the Pages bridge** (`GET /api/ping`, same origin). If
   healthy, tips/login route there instead — ntfy-backed shared ledger, no
   KV writes, no WhatsApp, no admin routes (kickoff overrides, Gazzetta,
   fetch-scores, etc. all 404 on the bridge — that's expected).
3. If neither answers, fall back to a **fully offline** roster login —
   tips only persist in that browser's `localStorage` until either backend
   is reachable again.

`/ping` is always re-probed fresh (cheap GET), so the app **recovers
automatically** the moment the Worker is redeployed — players don't need to
do anything. `tryUpgradeOfflineSession()` (called from `main.jsx` on every
load) silently re-logs a `local:`/`br.` session into the Worker once it's
healthy and pushes that device's locally-cached tips up to KV.

**One-time step after Worker secrets are added:** other devices' bridge-era
tips (the shared ntfy ledger / `public/live-ledger.json`) are **not**
automatically migrated — run this once:

```bash
node scripts/import-ledger-to-worker.mjs          # imports into KV
node scripts/import-ledger-to-worker.mjs --dry-run # preview first
```

## Required secrets

None of these are needed for the app to work today (bridge fallback covers
login + shared predictions). They unlock the **primary** Worker backend
(KV persistence, WhatsApp reminders, admin tools, live-score automation).

Add all of these as **GitHub repo secrets**: Settings → Secrets and
variables → Actions → New repository secret.

| Secret | Required for | How to get it |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Deploy Worker, manual Pages deploy, Live Score Sync | Cloudflare dashboard → My Profile → API Tokens → Create Token → template "Edit Cloudflare Workers" (grants Workers Scripts:Edit + Pages:Edit for this account). Copy the token immediately (shown once). |
| `CF_ACCOUNT_ID` | Same as above | Cloudflare dashboard → Workers & Pages → right sidebar "Account ID", or the 32-char hex segment in any `dash.cloudflare.com/<account-id>/...` URL. |
| `FDORG_TOKEN` *(optional)* | Better live-score coverage (football-data.org) | Free account at [football-data.org/client/register](https://www.football-data.org/client/register) → API key from your account page. Gazzetta scraping still works without it. |
| `CF_R2_ACCESS_KEY_ID` / `CF_R2_SECRET_ACCESS_KEY` *(optional)* | R2-backed live score image caching | Cloudflare dashboard → R2 → Manage R2 API Tokens → Create API Token (Object Read & Write), scoped to bucket `kouvadeiros-scores`. |

Additionally, once the Worker is deployed, set these directly **on the
Worker itself** (not GitHub — these are runtime secrets the Worker reads,
not CI credentials) to enable WhatsApp reminders:

| Worker secret | Purpose |
|---|---|
| `TWILIO_SID` | WhatsApp via Twilio |
| `TWILIO_TOKEN` | WhatsApp via Twilio |
| `TWILIO_FROM` *(optional)* | Sender number — defaults to Twilio's sandbox `whatsapp:+14155238886` if unset |
| `ADMIN_PHONE` *(optional)* | Fallback contact number, any E.164 format e.g. `+3069...` |

### Get `TWILIO_SID` / `TWILIO_TOKEN`

1. Sign in (or sign up free) at [twilio.com/console](https://www.twilio.com/console).
2. The main Console dashboard shows **Account SID** directly — copy it as
   `TWILIO_SID`.
3. Next to it, **Auth Token** is masked — click "Show" (or the eye icon) to
   reveal it, then copy it as `TWILIO_TOKEN`. Treat it like a password;
   regenerate from the same page if it's ever exposed.

### Enable WhatsApp (free sandbox — no business verification needed)

Twilio's WhatsApp Sandbox is free and enough for a 3-player group:

1. Console → **Messaging → Try it out → Send a WhatsApp message**.
2. It shows a join code and the sandbox number `+1 415 523 8886`
   (`whatsapp:+14155238886` — this is exactly the default `TWILIO_FROM`, so
   you don't need to set that secret unless you later move to a real
   WhatsApp Business number).
3. **Each recipient** (Boikos, Mavromichalis, Chousiadas) must send
   `join <the-code-shown>` once, from their own WhatsApp, to that sandbox
   number. Until they do, Twilio will reject messages to their number.
4. Sandbox sessions expire after ~72 hours of inactivity — if reminders
   stop working after a quiet week, have everyone re-send the join message.

### Add the secrets to the Worker

Pick whichever is easier — both are equivalent and persist across future
`wrangler deploy` runs from CI (they won't get wiped by GitHub Actions
redeploys):

**Dashboard** (no local setup needed):
1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
   → select `kouvadeiros-api` → **Settings**
2. Under **"Variables and Secrets"** → **Add**
3. Type: **Secret**, Name: `TWILIO_SID`, Value: (paste). Click **Add
   variable** to add another row for `TWILIO_TOKEN` the same way.
4. Click **Deploy** to apply.

**CLI** (needs `wrangler` + Cloudflare login locally):
```bash
npx wrangler@4 secret put TWILIO_SID -c worker/wrangler-api.toml
npx wrangler@4 secret put TWILIO_TOKEN -c worker/wrangler-api.toml
# optional:
npx wrangler@4 secret put TWILIO_FROM -c worker/wrangler-api.toml
npx wrangler@4 secret put ADMIN_PHONE -c worker/wrangler-api.toml
```
Each prompts for the value interactively (not shown/echoed).

After adding `CLOUDFLARE_API_TOKEN` + `CF_ACCOUNT_ID`: re-run **Actions →
Deploy Worker** (or push any change under `worker/`). The updated
`deploy-worker.yml` verifies the deploy actually fixed login (`version>=13`,
`loginFixed:true`) before declaring success.

## Live score pipeline (optional, secondary to Gazzetta)

A Python pipeline (`scraper/`, `run.py`) can supplement the Worker's
built-in Gazzetta/ESPN live-score polling with football-data.org data,
uploaded to a Cloudflare R2 bucket the Worker reads from:

```
Python pipeline → R2 bucket (live.json / today.json) → Worker /live-scores → app
```

Run locally with `python run.py daemon --interval 60`, or let
`.github/workflows/live-scores.yml` run it on a schedule (every 5 min on
GitHub's free tier; gated to only fetch during actual match windows). See
`.env.example` for the required environment variables.

## Known limitations / trust model

- **Bridge auth is HMAC tokens signed with an in-repo secret**
  (`functions/_lib/kouv.js`), and the shared tip ledger is a public-but-
  obscure ntfy.sh-style topic. This is *not* a regression from the app's
  existing security posture — all 3 players' passwords already ship in the
  client bundle (`src/lib/api.js` `LOCAL_USERS`) since there's no real
  identity system. Fine for a 3-friend app; not something to expose more
  broadly.
- **Bridge admin routes are stubs** (kickoff overrides, Gazzetta control,
  add-player, etc. all 404). These only matter while the Worker is down —
  restore automatically once it's healthy again.
- `sync-tip-ledger.yml` will keep committing ledger snapshots to `main`
  even after the Worker is primary again — harmless (it's just an archive/
  fallback source at that point) but can be disabled once confident the
  Worker has been stable for a while.

## Testing

```bash
npm run build                    # production build
npm run test:worker-primary      # Worker-first / bridge-fallback regression test
npm run test:pages-bridge        # bridge module sanity
npm run test:projections-login   # login fallback chain assertions
npm run test:hooks               # React hooks-order regression guard
```

See `package.json` for the full list of `test:*` smoke scripts (some are
date/network-sensitive and only meaningful around specific fixtures).
