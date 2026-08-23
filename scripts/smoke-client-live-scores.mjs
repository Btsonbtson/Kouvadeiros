/**
 * Smoke: client ESPN live scores for today's SL MD1 fixtures.
 * Run: node scripts/smoke-client-live-scores.mjs
 */
import { ALL_FIXTURES } from '../src/lib/data.js'
import { fetchClientLiveScores } from '../src/lib/clientLiveScores.js'

const due = ALL_FIXTURES.filter((m) => ['sl-1-4', 'sl-1-6', 'sl-1-7'].includes(m.id))
console.log('fixtures', due.map((m) => `${m.id} ${m.home}-${m.away} ${m.kickoff}`))

const { live, hints } = await fetchClientLiveScores(ALL_FIXTURES)
console.log('live', live)
console.log('hints', hints)

if (!live['sl-1-4'] && !hints['sl-1-4']) {
  // OFI–VOL should be in-play or finished on 23/8 evening — warn but don't fail if pre-kick in CI
  const now = Date.now()
  const ko = new Date(due.find((m) => m.id === 'sl-1-4').kickoff).getTime()
  if (now >= ko - 15 * 60000) {
    throw new Error('expected ESPN live/final for sl-1-4 OFI–VOL during match window')
  }
  console.log('OK — pre-kick; no live row yet')
  process.exit(0)
}

const row = live['sl-1-4'] || hints['sl-1-4']
console.log(`OFI–VOL → ${row.h}–${row.a} min=${row.min} final=${!!row.final} via ${row.provider}`)
if (typeof row.h !== 'number' || typeof row.a !== 'number') throw new Error('bad score')
console.log('OK — client ESPN live scores')
