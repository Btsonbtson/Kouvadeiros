/**
 * Smoke: 20/8 play-off Leg 1 points + Ο Κουβάς headline overrides.
 * Run: node scripts/smoke-tonight-points.mjs
 */
import {
  UEFA_FIXTURES,
  PLAYERS,
  PLAYER_NAMES,
  TIP_RESULT_LOCKS,
  SEEDED_PREDICTIONS,
  mergeSeededPredictions,
  applyTipResultLocks,
  scorePlayerMatch,
  computeLeaderboard,
} from '../src/lib/data.js'
import { EDITION_HEADLINE_OVERRIDES, FALLBACK_RESULTS, buildEdition } from '../worker/newspaper.js'

const TONIGHT = ['uel-ofi-1', 'uecl-pao-5', 'uecl-paok-1']
const fixtures = UEFA_FIXTURES.filter((m) => TONIGHT.includes(m.id))
const { results } = applyTipResultLocks({})
const predictions = mergeSeededPredictions({})

console.log('=== FT locks ===')
for (const id of TONIGHT) {
  const r = results[id] || FALLBACK_RESULTS[id]
  console.log(id, r)
  if (!r || TIP_RESULT_LOCKS[id].h !== r.h || TIP_RESULT_LOCKS[id].a !== r.a) {
    throw new Error(`missing/mismatch lock for ${id}`)
  }
}

console.log('\n=== Tips (seeded under live) ===')
for (const id of TONIGHT) {
  console.log(id, predictions[id] || {})
}

console.log('\n=== Tonight points ===')
const day = {}
for (const p of PLAYERS) day[p] = 0
for (const m of fixtures) {
  const actual = results[m.id]
  console.log(`\n${m.id} ${actual.h}-${actual.a}`)
  for (const p of PLAYERS) {
    const pred = predictions[m.id]?.[p]
    const sc = scorePlayerMatch(m, pred, actual, predictions, fixtures, p)
    const tip = pred ? `${pred.h}-${pred.a}` : 'DQ'
    console.log(`  ${PLAYER_NAMES[p]} tip ${tip} → ${sc ? (sc.dq ? 'DQ ' : '') + sc.points : 'null'}`)
    if (sc) day[p] += sc.points
  }
}

console.log('\n=== Day totals ===')
for (const p of PLAYERS) console.log(`${PLAYER_NAMES[p]}: ${day[p]}`)

const expected = { chousiadas: 3, boikos: -3, mavromichalis: -3 }
for (const p of PLAYERS) {
  if (day[p] !== expected[p]) {
    throw new Error(`${p} expected ${expected[p]} got ${day[p]}`)
  }
}

const forced = EDITION_HEADLINE_OVERRIDES['2026-08-20']
if (!forced) throw new Error('missing 2026-08-20 headline override')
if (forced.yell !== 'ΝΕΟ ΣΚΑΝΔΑΛΟ') throw new Error('yell mismatch')
if (!/ΒΑΥΑΡΙΚΟΣ ΔΑΚΤΥΛΟΣ/i.test(forced.splash)) throw new Error('splash mismatch')
if (!/μαγικοί πόντοι/.test(forced.kicker) || !/−3|−3|-3/.test(forced.kicker)) {
  throw new Error('kicker mismatch')
}
const need = [
  'Even the rocks are laughing',
  'Νύχτα των κρυστάλλων',
  'Άλλη παιδί δεν έκανε μόνο η Μαριώ τον Γιάννη',
  'Νύχτα ντροπής για την διοργανώτρια αρχή',
  'O tempora o mores',
]
for (const t of need) {
  if (!forced.frontTeasers.includes(t)) throw new Error(`missing teaser: ${t}`)
}

const users = {
  'a@x': { id: 'boikos', name: 'Boikos', role: 'admin' },
  'b@x': { id: 'mavromichalis', name: 'Mavromichalis', role: 'player' },
  'c@x': { id: 'chousiadas', name: 'Chousiadas', role: 'player' },
}
const edition = buildEdition(
  '2026-08-20',
  UEFA_FIXTURES,
  { predictions, results },
  users,
  { round: 1 },
)
if (edition.headlines.yell !== 'ΝΕΟ ΣΚΑΝΔΑΛΟ') throw new Error('edition yell not forced')
if (!edition.html.includes('ΝΕΟ ΣΚΑΝΔΑΛΟ')) throw new Error('html missing yell')
if (!edition.html.includes('Even the rocks are laughing')) throw new Error('html missing teaser')
if (edition.matchCount !== 3) throw new Error(`expected 3 matches, got ${edition.matchCount}`)

const board = computeLeaderboard(UEFA_FIXTURES, predictions, results)
console.log('\n=== Season board (seeded+locks) ===')
for (const row of board) console.log(row.rank, PLAYER_NAMES[row.player], row.pts, `exact=${row.exact}`, `dq=${row.dq}`)

console.log('\nOK — tonight points + scandal frontpage copy')
