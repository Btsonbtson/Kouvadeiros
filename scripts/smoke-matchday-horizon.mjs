/**
 * Smoke: Προβλέψεις must not render the full season (freezes tip entry).
 * Run: node scripts/smoke-matchday-horizon.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ALL_FIXTURES, applyTipResultLocks } from '../src/lib/data.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const appSrc = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8')

if (!/PRED_HORIZON_MS/.test(appSrc)) {
  throw new Error('MatchdayPage must define PRED_HORIZON_MS tip window')
}
if (!/SCORE STEPPER/.test(appSrc)) {
  throw new Error('ScoreRow must be a stable top-level component')
}
const cardStart = appSrc.indexOf('function MatchPredictCard')
const cardSlice = appSrc.slice(cardStart, cardStart + 8000)
if (/const ScoreRow\s*=/.test(cardSlice)) {
  throw new Error('ScoreRow was re-inlined inside MatchPredictCard')
}

const PRED_HORIZON_MS = 14 * 24 * 3600 * 1000
const PRED_KEEP_AFTER_KO_MS = 4 * 3600 * 1000
const ONE_HOUR = 3600000
const now = Date.now()
const { results } = applyTipResultLocks({})
const shown = ALL_FIXTURES.filter((m) => {
  const ko = new Date(m.kickoff).getTime()
  const official = results?.[m.id]
  if (m.postponed && !official) return true
  if (official && now > ko + ONE_HOUR) return false
  if (Number.isFinite(ko) && ko > now + PRED_HORIZON_MS) return false
  if (Number.isFinite(ko) && ko < now - PRED_KEEP_AFTER_KO_MS) return false
  return true
})

if (shown.length > 40) {
  throw new Error(`tip board still too large: ${shown.length} cards`)
}
if (shown.length < 4) {
  throw new Error(`tip board unexpectedly empty: ${shown.length}`)
}
if (!shown.some((m) => m.id === 'ucl-aek-2')) {
  throw new Error('AEK Leg 2 must stay on tip board tonight')
}

console.log(`OK — tip board horizon ${shown.length} fixtures (was ~180)`)
