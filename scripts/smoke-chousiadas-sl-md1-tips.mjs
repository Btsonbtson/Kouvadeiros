/**
 * Smoke: Chousiadas must have seeded SL MD1 tips (no false DQ) for Sunday matches.
 * Run: node scripts/smoke-chousiadas-sl-md1-tips.mjs
 */
import {
  ALL_FIXTURES,
  PLAYERS,
  PLAYER_NAMES,
  SEEDED_PREDICTIONS,
  mergeSeededPredictions,
  scorePlayerMatch,
  isMissingTip,
} from '../src/lib/data.js'

const MATCHES = {
  'sl-1-4': { h: 2, a: 1 }, // OFI–VOL
  'sl-1-7': { h: 2, a: 1 }, // PAOK–LEV
  'sl-1-6': { h: 1, a: 1 }, // PNE–AST
}

console.log('=== SEEDED_PREDICTIONS (Chousiadas Sunday) ===')
for (const [id, tip] of Object.entries(MATCHES)) {
  const seeded = SEEDED_PREDICTIONS[id]?.chousiadas
  console.log(id, seeded)
  if (isMissingTip(seeded) || seeded.h !== tip.h || seeded.a !== tip.a) {
    throw new Error(`seed mismatch ${id}`)
  }
}

// Simulate KV where Boikos + Mavro tipped but Chousiadas blank (the recurring bug)
const kvPartial = {
  'sl-1-4': {
    boikos: { h: 1, a: 0 },
    mavromichalis: { h: 2, a: 1 },
  },
  'sl-1-6': {
    boikos: { h: 0, a: 0 },
    mavromichalis: { h: 1, a: 1 },
  },
  'sl-1-7': {
    boikos: { h: 2, a: 0 },
    mavromichalis: { h: 1, a: 0 },
  },
}

const predictions = mergeSeededPredictions(kvPartial)
console.log('\n=== After mergeSeededPredictions ===')
for (const id of Object.keys(MATCHES)) {
  const c = predictions[id]?.chousiadas
  console.log(id, 'chousiadas', c)
  if (isMissingTip(c)) throw new Error(`Chousiadas still missing after seed merge: ${id}`)
}

// Live tip must win over seed
const withLive = mergeSeededPredictions({
  'sl-1-4': { chousiadas: { h: 9, a: 9 } },
})
if (withLive['sl-1-4'].chousiadas.h !== 9 || withLive['sl-1-4'].chousiadas.a !== 9) {
  throw new Error('live tip should beat seed')
}

// Incomplete live slot must be replaced by seed
const withBroken = mergeSeededPredictions({
  'sl-1-4': { chousiadas: { h: null, a: null } },
})
if (withBroken['sl-1-4'].chousiadas.h !== 2 || withBroken['sl-1-4'].chousiadas.a !== 1) {
  throw new Error('incomplete tip should be replaced by seed')
}

// With FT result + others tipped → Chousiadas must NOT DQ
const fakeFt = { h: 1, a: 0 }
console.log('\n=== Scoring (fake FT 1–0, others tipped) ===')
for (const id of Object.keys(MATCHES)) {
  const m = ALL_FIXTURES.find((f) => f.id === id)
  for (const p of PLAYERS) {
    const pred = predictions[id]?.[p]
    const sc = scorePlayerMatch(m, pred, fakeFt, predictions, ALL_FIXTURES, p)
    const tip = pred ? `${pred.h}–${pred.a}` : '—'
    console.log(`  ${id} ${PLAYER_NAMES[p]} tip ${tip} → ${sc?.dq ? 'DQ' : sc?.points}`)
    if (p === 'chousiadas' && sc?.dq) {
      throw new Error(`Chousiadas DQ on ${id} — seed merge failed`)
    }
  }
}

console.log('\nOK — Chousiadas Sunday SL MD1 tips seeded; no false DQ')
