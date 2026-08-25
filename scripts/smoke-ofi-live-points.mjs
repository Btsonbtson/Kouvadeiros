/**
 * Smoke: full offline tip ledger + locked Sunday MD1 FT → standings 15 / 9 / 9.
 * Through Sat MD1 locks: Chousiadas 13, Mavromichalis 8, Boikos 8.
 * Sunday: OFI 2–0 (+1 Chousiadas), PAOK 4–0 (+1 all), PNE 3–1 (0) → 15 / 9 / 9.
 * Run: node scripts/smoke-ofi-live-points.mjs
 */
import {
  ALL_FIXTURES,
  PLAYERS,
  PLAYER_NAMES,
  mergeSeededPredictions,
  applyTipResultLocks,
  mergeScoringResults,
  scorePlayerMatch,
  computeLeaderboard,
  predictionsLookIncomplete,
  tipCountForMatch,
  buildPointsTimeline,
  buildPlayerMatchLedger,
} from '../src/lib/data.js'

const predictions = mergeSeededPredictions({})
const { results } = applyTipResultLocks({})
const scoring = mergeScoringResults(results, {}, {})

if (predictionsLookIncomplete(predictions)) {
  throw new Error('full season seeds should look complete')
}
if (Object.keys(results).length < 20) {
  throw new Error(`expected ≥20 locked results, got ${Object.keys(results).length}`)
}

const ofi = ALL_FIXTURES.find((m) => m.id === 'sl-1-4')
if (!ofi) throw new Error('missing sl-1-4')
const actual = scoring['sl-1-4']
if (!actual || actual.h !== 2 || actual.a !== 0) {
  throw new Error(`bad OFI actual: ${JSON.stringify(actual)}`)
}
if (actual.provisional) throw new Error('OFI should be locked FT, not provisional')

console.log('=== OFI tips ===')
console.log(predictions['sl-1-4'])
console.log('tipCount', tipCountForMatch(predictions, 'sl-1-4'))

console.log('\n=== OFI locked points ===')
for (const p of PLAYERS) {
  const pred = predictions['sl-1-4']?.[p]
  const sc = scorePlayerMatch(ofi, pred, actual, predictions, ALL_FIXTURES, p)
  console.log(
    PLAYER_NAMES[p],
    pred ? `${pred.h}–${pred.a}` : '—',
    '→',
    sc == null ? 'n/a' : `${sc.dq ? 'DQ ' : ''}${sc.points}`,
  )
  if (p === 'chousiadas') {
    if (!sc || sc.points !== 1 || sc.dq) throw new Error('Chousiadas should get +1 on 2–1 vs 2–0')
  } else if (!sc || sc.points !== 0) {
    throw new Error(`${p} should score 0 on wrong OFI tip`)
  }
}

const board = computeLeaderboard(ALL_FIXTURES, predictions, scoring)
console.log('\n=== Season board ===')
const by = Object.fromEntries(board.map((r) => [r.player, r.pts]))
for (const row of board) {
  console.log(row.rank, PLAYER_NAMES[row.player], row.pts, `dq=${row.dq}`, `played=${row.played}`)
}

const expected = { chousiadas: 15, mavromichalis: 9, boikos: 9 }
for (const p of PLAYERS) {
  if (by[p] !== expected[p]) {
    throw new Error(`${p} board ${by[p]} != expected ${expected[p]}`)
  }
}

const { final, events } = buildPointsTimeline(ALL_FIXTURES, predictions, scoring)
if (events.length < 14) throw new Error(`timeline too short: ${events.length}`)
for (const p of PLAYERS) {
  if (final[p] !== expected[p]) {
    throw new Error(`${p} timeline ${final[p]} != expected ${expected[p]}`)
  }
}

const ledger = buildPlayerMatchLedger(ALL_FIXTURES, predictions, scoring, 'chousiadas')
if (ledger.length < 14) throw new Error(`ledger too short: ${ledger.length}`)
const comps = new Set(ledger.map((r) => r.competition))
if (!comps.has('SL') || !comps.has('UECL')) throw new Error('ledger missing competitions')

for (const id of ['sl-1-4', 'sl-1-6', 'sl-1-7', 'ucl-aek-1', 'uel-paok-3', 'uel-paok-4']) {
  if (!results[id]) throw new Error(`missing history lock ${id}`)
}

console.log('\nOK — Sunday MD1 + UEFA played locks → Chousiadas 15 / Mavromichalis 9 / Boikos 9')
console.log(`timeline events=${events.length} ledger=${ledger.length} locks=${Object.keys(results).length}`)
