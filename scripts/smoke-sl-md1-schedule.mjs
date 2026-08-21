/**
 * Smoke: Super League MD1 kickoffs + PAO–KIF postponed (no DQ).
 * Run: node scripts/smoke-sl-md1-schedule.mjs
 */
import {
  SUPER_LEAGUE,
  PLAYERS,
  scorePlayerMatch,
  grKick,
  isSchedulableFixture,
  athensHm,
} from '../src/lib/data.js'

const md1 = SUPER_LEAGUE.filter((m) => m.md === 1)
const byId = Object.fromEntries(md1.map((m) => [m.id, m]))

const expect = {
  'sl-1-1': { hm: '20:00', postponed: false },
  'sl-1-2': { hm: '20:00', postponed: false },
  'sl-1-3': { hm: '21:30', postponed: false },
  'sl-1-4': { hm: '19:30', postponed: false },
  'sl-1-5': { postponed: true },
  'sl-1-6': { hm: '21:30', postponed: false },
  'sl-1-7': { hm: '21:00', postponed: false },
}

for (const [id, want] of Object.entries(expect)) {
  const m = byId[id]
  if (!m) throw new Error(`missing ${id}`)
  if (!!m.postponed !== want.postponed) throw new Error(`${id} postponed flag`)
  if (want.postponed) {
    if (grKick(m) !== 'ΑΝΑΒΛΗΘΗΚΕ') throw new Error(`${id} grKick`)
    if (isSchedulableFixture(m)) throw new Error(`${id} should not be schedulable`)
    // Fake a result + missing tips for other players → must NOT DQ
    const preds = {
      [id]: { chousiadas: { h: 1, a: 0 } },
    }
    for (const p of PLAYERS) {
      const sc = scorePlayerMatch(m, preds[id]?.[p], { h: 2, a: 1 }, preds, md1, p)
      if (sc != null) throw new Error(`${id} ${p}: postponed must score null, got ${JSON.stringify(sc)}`)
    }
  } else if (athensHm(m.kickoff) !== want.hm) {
    throw new Error(`${id} expected ${want.hm} got ${athensHm(m.kickoff)}`)
  }
}

console.log('MD1 schedule OK:')
for (const m of md1.sort((a, b) => a.kickoff.localeCompare(b.kickoff))) {
  console.log(`  ${m.id} ${m.home}–${m.away}  ${grKick(m)}`)
}
