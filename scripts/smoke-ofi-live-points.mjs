/**
 * Smoke: offline sparse tips + live ΟΦΗ–Βόλος 2–0 → standings 14 / 8 / 8.
 * Baseline after Sat MD1: Chousiadas 13, Mavromichalis 8, Boikos 8.
 * Chousiadas tip 2–1 vs live 2–0 → +1 (correct result) → 14.
 * Run: node scripts/smoke-ofi-live-points.mjs
 */
import {
  ALL_FIXTURES,
  PLAYERS,
  PLAYER_NAMES,
  POINTS_BASELINE,
  mergeSeededPredictions,
  applyTipResultLocks,
  mergeScoringResults,
  scorePlayerMatch,
  computeLeaderboard,
  predictionsLookIncomplete,
  tipCountForMatch,
  buildPointsTimeline,
} from '../src/lib/data.js'

const predictions = mergeSeededPredictions({})
const { results } = applyTipResultLocks({})
const scoring = mergeScoringResults(results, { 'sl-1-4': { h: 2, a: 0 } }, {})

if (!predictionsLookIncomplete(predictions)) {
  throw new Error('expected sparse offline seeds to look incomplete')
}
if (POINTS_BASELINE.pts.chousiadas !== 13) throw new Error('baseline C != 13')
if (POINTS_BASELINE.pts.mavromichalis !== 8) throw new Error('baseline M != 8')
if (POINTS_BASELINE.pts.boikos !== 8) throw new Error('baseline B != 8')

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
    sc == null ? 'n/a (no DQ)' : `${sc.dq ? 'DQ ' : ''}${sc.points}`,
  )
  if (p === 'chousiadas') {
    if (!sc || sc.points !== 1 || sc.dq) throw new Error('Chousiadas should get +1~ on 2–1 vs 2–0')
  } else if (sc != null) {
    throw new Error(`${p} must not score/DQ on live OFI without a tip`)
  }
}

const board = computeLeaderboard(ALL_FIXTURES, predictions, scoring)
console.log('\n=== Season board ===')
const by = Object.fromEntries(board.map((r) => [r.player, r.pts]))
for (const row of board) {
  console.log(row.rank, PLAYER_NAMES[row.player], row.pts, `dq=${row.dq}`)
}

const expected = { chousiadas: 14, mavromichalis: 8, boikos: 8 }
for (const p of PLAYERS) {
  if (by[p] !== expected[p]) {
    throw new Error(`${p} board ${by[p]} != expected ${expected[p]}`)
  }
}

const { final } = buildPointsTimeline(ALL_FIXTURES, predictions, scoring)
for (const p of PLAYERS) {
  if (final[p] !== expected[p]) {
    throw new Error(`${p} timeline ${final[p]} != expected ${expected[p]}`)
  }
}

console.log('\nOK — live OFI board + graph Chousiadas 14 / Mavromichalis 8 / Boikos 8')
