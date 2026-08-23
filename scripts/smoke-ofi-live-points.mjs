/**
 * Smoke: full offline tip ledger + live ΟΦΗ–Βόλος 2–0 → standings 14 / 8 / 8.
 * Through Sat MD1 locks: Chousiadas 13, Mavromichalis 8, Boikos 8.
 * Chousiadas tip 2–1 vs live 2–0 → +1 → 14. B/M OFI tips wrong → stay 8.
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
const scoring = mergeScoringResults(results, { 'sl-1-4': { h: 2, a: 0 } }, {})

if (predictionsLookIncomplete(predictions)) {
  throw new Error('full season seeds should look complete')
}
if (Object.keys(results).length < 14) {
  throw new Error(`expected ≥14 locked results, got ${Object.keys(results).length}`)
}

const ofi = ALL_FIXTURES.find((m) => m.id === 'sl-1-4')
if (!ofi) throw new Error('missing sl-1-4')
const actual = scoring['sl-1-4']
if (!actual?.provisional || actual.h !== 2 || actual.a !== 0) {
  throw new Error(`bad provisional OFI actual: ${JSON.stringify(actual)}`)
}

console.log('=== OFI tips ===')
console.log(predictions['sl-1-4'])
console.log('tipCount', tipCountForMatch(predictions, 'sl-1-4'))

console.log('\n=== OFI live points ===')
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
    if (!sc || sc.points !== 1 || sc.dq) throw new Error('Chousiadas should get +1~ on 2–1 vs 2–0')
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

const expected = { chousiadas: 14, mavromichalis: 8, boikos: 8 }
for (const p of PLAYERS) {
  if (by[p] !== expected[p]) {
    throw new Error(`${p} board ${by[p]} != expected ${expected[p]}`)
  }
}

const { final, events } = buildPointsTimeline(ALL_FIXTURES, predictions, scoring)
if (events.length < 10) throw new Error(`timeline too short: ${events.length}`)
for (const p of PLAYERS) {
  if (final[p] !== expected[p]) {
    throw new Error(`${p} timeline ${final[p]} != expected ${expected[p]}`)
  }
}

const ledger = buildPlayerMatchLedger(ALL_FIXTURES, predictions, scoring, 'chousiadas')
if (ledger.length < 10) throw new Error(`ledger too short: ${ledger.length}`)
const comps = new Set(ledger.map((r) => r.competition))
if (!comps.has('SL') || !comps.has('UECL')) throw new Error('ledger missing competitions')

console.log('\nOK — full ledger + live OFI board Chousiadas 14 / Mavromichalis 8 / Boikos 8')
console.log(`timeline events=${events.length} ledger=${ledger.length}`)
