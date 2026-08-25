/**
 * Smoke: played fixtures (by date) are locked → Ιστορικό, not Προβλέψεις.
 * Today (Athens) after MD1 Sunday: only upcoming + postponed remain open.
 * Run: node scripts/smoke-played-to-history.mjs
 */
import {
  ALL_FIXTURES,
  applyTipResultLocks,
  athensYmd,
} from '../src/lib/data.js'

const ONE_HOUR = 3600_000
const now = Date.now()
const { results } = applyTipResultLocks({})

const PLAYED_MUST_LOCK = [
  'uel-paok-3',
  'uel-paok-4',
  'ucl-aek-1',
  'uel-ofi-1',
  'uecl-pao-5',
  'uecl-paok-1',
  'sl-1-1',
  'sl-1-2',
  'sl-1-3',
  'sl-1-4',
  'sl-1-6',
  'sl-1-7',
]

for (const id of PLAYED_MUST_LOCK) {
  if (!results[id]) throw new Error(`played match missing lock: ${id}`)
}

const stillOnPredictions = ALL_FIXTURES.filter((m) => {
  const ko = new Date(m.kickoff).getTime()
  const official = results[m.id]
  if (m.postponed && !official) return true
  if (official && now > ko + ONE_HOUR) return false
  return true
})

const wronglyOpen = stillOnPredictions.filter((m) => {
  if (m.postponed) return false
  const ko = new Date(m.kickoff).getTime()
  return ko + ONE_HOUR < now && results[m.id]
})
if (wronglyOpen.length) {
  throw new Error(`finished still on Προβλέψεις: ${wronglyOpen.map((m) => m.id).join(',')}`)
}

const pastUnlocked = ALL_FIXTURES.filter((m) => {
  if (m.postponed) return false
  const ko = new Date(m.kickoff).getTime()
  return ko + 3 * ONE_HOUR < now && !results[m.id]
})
if (pastUnlocked.length) {
  throw new Error(`past fixtures without FT lock: ${pastUnlocked.map((m) => m.id).join(',')}`)
}

const upcoming = stillOnPredictions.filter((m) => !m.postponed)
const postponed = stillOnPredictions.filter((m) => m.postponed)
console.log('Athens today', athensYmd(new Date().toISOString()))
console.log('Ιστορικό locks', Object.keys(results).length)
console.log('Προβλέψεις open', stillOnPredictions.map((m) => m.id).slice(0, 12).join(', '), '...')
console.log('  upcoming', upcoming.length, '· postponed', postponed.map((m) => m.id).join(',') || '—')

if (!postponed.some((m) => m.id === 'sl-1-5')) {
  throw new Error('PAO–KIF postponed should stay on Προβλέψεις')
}
if (upcoming.some((m) => PLAYED_MUST_LOCK.includes(m.id))) {
  throw new Error('a played lock is still listed as upcoming')
}

console.log('\nOK — played → Ιστορικό; postponed + future stay on Προβλέψεις')
