/**
 * Smoke: SL MD1 FT locks AEK–IRA 4–0 · KAL–ARI 2–3 · OLY–ATR 1–0 + tip points.
 * Optional: KOUV_TOKEN or live login to score against KV tips.
 * Run: node scripts/smoke-sl-md1-results.mjs
 */
import {
  ALL_FIXTURES,
  PLAYERS,
  PLAYER_NAMES,
  TIP_RESULT_LOCKS,
  mergeSeededPredictions,
  applyTipResultLocks,
  scorePlayerMatch,
  computeLeaderboard,
} from '../src/lib/data.js'
import { FALLBACK_RESULTS } from '../worker/newspaper.js'

const MATCHES = ['sl-1-1', 'sl-1-2', 'sl-1-3']
const EXPECTED = {
  'sl-1-1': { h: 4, a: 0 },
  'sl-1-2': { h: 2, a: 3 },
  'sl-1-3': { h: 1, a: 0 },
}
const API = process.env.KOUV_API || 'https://kouvadeiros-api.jboikos.workers.dev'

const { results } = applyTipResultLocks({})

console.log('=== FT locks ===')
for (const id of MATCHES) {
  const r = results[id] || FALLBACK_RESULTS[id]
  const exp = EXPECTED[id]
  console.log(id, r)
  if (!r || r.h !== exp.h || r.a !== exp.a) throw new Error(`lock mismatch ${id}`)
  if (!TIP_RESULT_LOCKS[id] || TIP_RESULT_LOCKS[id].h !== exp.h) {
    throw new Error(`TIP_RESULT_LOCKS missing ${id}`)
  }
  if (!FALLBACK_RESULTS[id] || FALLBACK_RESULTS[id].h !== exp.h) {
    throw new Error(`FALLBACK_RESULTS missing ${id}`)
  }
}

async function fetchLivePredictions() {
  let token = process.env.KOUV_TOKEN || ''
  if (!token) {
    const email = process.env.KOUV_EMAIL || 'boikos.y@caredirect.com'
    const password = process.env.KOUV_PASSWORD || '1453'
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const text = await res.text()
    if (!res.ok) {
      console.log(`\n(live tips skipped — login ${res.status}: ${text.slice(0, 80)})`)
      return null
    }
    try {
      token = JSON.parse(text).token
    } catch {
      console.log('\n(live tips skipped — bad login JSON)')
      return null
    }
  }
  const st = await fetch(`${API}/state`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!st.ok) {
    console.log(`\n(live tips skipped — state ${st.status})`)
    return null
  }
  const body = await st.json()
  return body.predictions || {}
}

const livePreds = await fetchLivePredictions()
const predictions = mergeSeededPredictions(livePreds || {})
const fixtures = ALL_FIXTURES.filter((m) => MATCHES.includes(m.id))

console.log('\n=== Tips ===')
for (const id of MATCHES) {
  console.log(id, predictions[id] || {})
}

console.log('\n=== Match points ===')
const day = Object.fromEntries(PLAYERS.map((p) => [p, 0]))
let anyTip = false
for (const m of fixtures) {
  const actual = results[m.id]
  console.log(`\n${m.id} ${m.home}–${m.away} ${actual.h}–${actual.a}`)
  for (const p of PLAYERS) {
    const pred = predictions[m.id]?.[p]
    const sc = scorePlayerMatch(m, pred, actual, predictions, ALL_FIXTURES, p)
    const tip = pred ? `${pred.h}–${pred.a}` : '—'
    if (pred) anyTip = true
    console.log(
      `  ${PLAYER_NAMES[p]} tip ${tip} → ${sc == null ? 'n/a' : (sc.dq ? 'DQ ' : '') + sc.points}`,
    )
    if (sc) day[p] += sc.points
  }
}

console.log('\n=== Day totals (these two matches) ===')
for (const p of PLAYERS) console.log(`${PLAYER_NAMES[p]}: ${day[p]}`)

if (livePreds && anyTip) {
  const board = computeLeaderboard(ALL_FIXTURES, predictions, results)
  console.log('\n=== Season board (locks + live/seeded tips) ===')
  for (const row of board) {
    console.log(row.rank, PLAYER_NAMES[row.player], row.pts, `exact=${row.exact}`, `dq=${row.dq}`)
  }
} else if (!livePreds) {
  console.log('\nOK — FT locks only (redeploy Worker + set KOUV_TOKEN to score live tips)')
} else {
  console.log('\nOK — FT locks; no tips filed yet for these matches (no DQ until someone tips)')
}
