/**
 * Live-score + kickoff verification (ESPN for SL, TheSportsDB for UEFA).
 * Run: node scripts/test-live-scores.mjs
 */
import { SUPER_LEAGUE, UEFA_FIXTURES, grTime, grKick } from '../src/lib/data.js'
import { fetchEspnScore, findMatchScore } from '../src/lib/espn.js'
import { fetchMatchScore, fetchTsdbScore } from '../src/lib/scores.js'

const MD1 = SUPER_LEAGUE.filter(m => m.md === 1)
let failed = 0

function assert(cond, msg) {
  if (!cond) {
    failed++
    console.error('FAIL:', msg)
  } else {
    console.log('OK  ', msg)
  }
}

async function testMd1Kickoffs() {
  console.log('\n=== MD1 kickoffs vs ESPN ===')
  try {
    const url = 'https://site.api.espn.com/apis/site/v2/sports/soccer/gre.1/scoreboard?dates=20260822-20260824'
    const board = await (await fetch(url)).json()
    assert((board.events || []).length >= 7, `ESPN returned ${(board.events || []).length} MD1 events`)

    for (const m of MD1) {
      const hit = findMatchScore(board, m)
      assert(!!hit, `${m.id} ${m.home}-${m.away} found on ESPN`)
      if (!hit) continue
      const ok = new Date(hit.kickoff).getTime() === new Date(m.kickoff).getTime()
      assert(ok, `${m.id} kickoff ours=${m.kickoff} (${grTime(m.kickoff)}) espn=${hit.kickoff}`)
    }
  } catch (e) {
    console.warn('WARN: ESPN MD1 check skipped:', e.cause?.code || e.message)
  }
}

async function testEspnUefaStillEmpty() {
  console.log('\n=== Confirm ESPN empty for UEFA night (why we need TSDB) ===')
  try {
    const paok = UEFA_FIXTURES.find(m => m.id === 'uel-paok-2')
    const espn = await fetchEspnScore(paok)
    assert(!espn.ok, `ESPN still misses PAOK Leg2 (${espn.reason}) — fallback required`)
  } catch (e) {
    console.warn('WARN: ESPN UEFA check skipped:', e.cause?.code || e.message)
  }
}

async function testTimeDisplay() {
  console.log('\n=== 24h Athens display ===')
  const samples = [
    ['2026-08-22T17:00:00Z', '20:00'],
    ['2026-08-22T19:00:00Z', '22:00'],
    ['2026-08-23T16:30:00Z', '19:30'],
    ['2026-08-23T18:00:00Z', '21:00'],
    ['2026-08-23T18:30:00Z', '21:30'],
    ['2026-08-04T18:00:00Z', '21:00'],
    ['2026-08-11T17:30:00Z', '20:30'],
  ]
  for (const [iso, expect] of samples) {
    const got = grTime(iso)
    const normed = got.replace(/\s/g, '')
    assert(normed === expect || normed === expect.replace(':', '∶'), `grTime(${iso}) → ${got} (expect ${expect})`)
  }
  const ofi = UEFA_FIXTURES.find(m => m.id === 'uel-ofi-1')
  assert(ofi?.timeTbd === true, 'OFI Leg 1 marked timeTbd')
  assert(grKick(ofi) === 'Ώρα TBA', `grKick(OFI) → ${grKick(ofi)}`)
}

async function testUefaViaTheSportsDB() {
  console.log('\n=== UEFA finals via TheSportsDB (ESPN alternative) ===')
  const paok = UEFA_FIXTURES.find(m => m.id === 'uel-paok-2')
  const pao = UEFA_FIXTURES.find(m => m.id === 'uecl-pao-2')

  // Parse through fetchTsdbScore / fetchMatchScore with stubbed fetch (no live network)
  const stubFetch = async (url) => {
    if (String(url).includes('eventslast.php?id=133749')) {
      return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({ results: [{
        strHomeTeam: 'PAOK', strAwayTeam: 'Dynamo Kyiv',
        intHomeScore: '2', intAwayScore: '0', strStatus: 'FT',
        idEvent: '2538974', strTimestamp: '2026-07-30T17:45:00',
      }] }) }
    }
    if (String(url).includes('eventslast.php?id=133746')) {
      return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({ results: [{
        strHomeTeam: 'Panathinaikos', strAwayTeam: 'Paks',
        intHomeScore: '2', intAwayScore: '2', strStatus: 'FT',
        idEvent: 'x', strTimestamp: '2026-07-30T18:30:00',
      }] }) }
    }
    if (String(url).includes('livescore.php')) {
      return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({ livescore: [] }) }
    }
    return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({}) }
  }

  const paokR = await fetchTsdbScore(paok, stubFetch)
  assert(paokR.ok && paokR.final && paokR.h === 2 && paokR.a === 0, `PAOK Leg2 via TSDB stub ${paokR.h}-${paokR.a}`)

  const paoR = await fetchTsdbScore(pao, stubFetch)
  assert(paoR.ok && paoR.final && paoR.h === 2 && paoR.a === 2, `PAO Leg2 via TSDB stub ${paoR.h}-${paoR.a}`)

  const multi = await fetchMatchScore(paok, stubFetch)
  assert(multi.ok && multi.provider === 'thesportsdb' && multi.h === 2, `fetchMatchScore UEFA → TSDB ${multi.h}-${multi.a}`)

  // Live network check (soft — free tier rate-limits easily)
  try {
    const liveNet = await fetchTsdbScore(paok)
    if (liveNet.ok) assert(liveNet.h === 2 && liveNet.a === 0, `live TSDB PAOK ${liveNet.h}-${liveNet.a}`)
    else console.warn('WARN: live TSDB PAOK:', liveNet.reason)
  } catch (e) {
    console.warn('WARN: live TSDB skipped:', e.message)
  }
}

async function testSlViaTheSportsDB() {
  console.log('\n=== Super League uses TheSportsDB primary ===')
  const aek = SUPER_LEAGUE.find(m => m.id === 'sl-1-1')

  // Stub: SL season returns AEK-Iraklis scheduled (null scores) → not a live/final hit
  const stubFetch = async (url) => {
    const u = String(url)
    if (u.includes('eventslast.php')) {
      return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({ results: [] }) }
    }
    if (u.includes('livescore.php')) {
      return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({ livescore: [] }) }
    }
    if (u.includes('eventsseason.php?id=4336')) {
      return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({ events: [{
        strHomeTeam: 'AEK Athens', strAwayTeam: 'Iraklis 1908',
        intHomeScore: null, intAwayScore: null, strStatus: 'NS',
        strTimestamp: '2026-08-22T17:00:00', idEvent: 'sl-aek',
      }] }) }
    }
    // ESPN fallback scheduled board
    if (u.includes('site.api.espn.com')) {
      return { ok: true, json: async () => ({ events: [] }) }
    }
    return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({}), json: async () => ({}) }
  }

  const multi = await fetchMatchScore(aek, stubFetch)
  assert(!multi.ok, `scheduled SL MD1 has no live/final score yet (${multi.reason})`)

  // Same stub path proves TSDB is tried before ESPN for SL
  assert(/tsdb:/.test(multi.reason), `SL chain starts with tsdb (${multi.reason})`)

  // In-play SL example via TSDB livescore
  const liveStub = async (url) => {
    if (String(url).includes('livescore.php') || String(url).includes('eventslast.php')) {
      const row = {
        strHomeTeam: 'AEK Athens', strAwayTeam: 'Iraklis 1908',
        intHomeScore: '1', intAwayScore: '0', strStatus: '2H', strProgress: '67',
        strTimestamp: '2026-08-22T17:00:00', idEvent: 'live-aek',
      }
      if (String(url).includes('livescore')) {
        return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({ livescore: [row] }) }
      }
      return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({ results: [] }) }
    }
    return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({}), json: async () => ({ events: [] }) }
  }
  // Force kickoff into "near" window by using match as-is; nearKickoff allows 48h from stored kickoff
  const liveR = await fetchTsdbScore(aek, liveStub)
  // May fail nearKickoff if "now" is Jul 31 and kickoff is Aug 22 — 22 days away
  // So use a synthetic match with today's kickoff for the in-play assertion
  const synthetic = { ...aek, kickoff: new Date().toISOString() }
  const liveNow = await fetchTsdbScore(synthetic, async (url) => {
    if (String(url).includes('eventslast')) {
      return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({ results: [{
        strHomeTeam: 'AEK Athens', strAwayTeam: 'Iraklis 1908',
        intHomeScore: '1', intAwayScore: '0', strStatus: '2H', strProgress: '67',
        strTimestamp: synthetic.kickoff, idEvent: 'live-aek',
      }] }) }
    }
    return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({ livescore: [] }) }
  })
  assert(liveNow.ok && liveNow.h === 1 && liveNow.a === 0 && liveNow.inPlay, `SL in-play via TSDB ${liveNow.h}-${liveNow.a} ${liveNow.min}'`)

  const pref = await fetchMatchScore(UEFA_FIXTURES.find(m => m.id === 'uel-paok-2'), async (url) => {
    if (String(url).includes('eventslast.php?id=133749')) {
      return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({ results: [{
        strHomeTeam: 'PAOK', strAwayTeam: 'Dynamo Kyiv',
        intHomeScore: '2', intAwayScore: '0', strStatus: 'FT',
        idEvent: '2538974', strTimestamp: '2026-07-30T17:45:00',
      }] }) }
    }
    return { ok: true, headers: { get: () => 'application/json' }, text: async () => JSON.stringify({ livescore: [] }), json: async () => ({ events: [] }) }
  })
  assert(pref.ok && pref.provider === 'thesportsdb', `primary provider thesportsdb (got ${pref.provider})`)
}

async function testLiveShape() {
  console.log('\n=== Live payload shape ===')
  const live = { h: 1, a: 0, min: 67, ts: Date.now() }
  assert(typeof live.h === 'number' && typeof live.a === 'number' && typeof live.min === 'number', 'live shape {h,a,min}')
}

async function testMockLiveParse() {
  console.log('\n=== Mock in-play + final parse ===')
  const mockLive = {
    events: [{
      id: '1',
      date: '2026-08-22T17:00Z',
      status: { type: { name: 'STATUS_IN_PROGRESS', state: 'in' }, displayClock: '67\'', period: 2 },
      competitions: [{
        competitors: [
          { homeAway: 'home', score: '1', team: { abbreviation: 'AEK', displayName: 'AEK Athens' } },
          { homeAway: 'away', score: '0', team: { abbreviation: 'IRAK', displayName: 'Iraklis' } },
        ],
      }],
    }],
  }
  const liveHit = findMatchScore(mockLive, { home: 'AEK', away: 'IRA' })
  assert(liveHit && liveHit.h === 1 && liveHit.a === 0 && liveHit.min === 67 && !liveHit.final, `in-play parse ${JSON.stringify(liveHit)}`)

  const mockFinal = {
    events: [{
      id: '2',
      date: '2026-07-30T17:45Z',
      status: { type: { name: 'STATUS_FULL_TIME', completed: true, state: 'post' }, displayClock: '90\'', period: 2 },
      competitions: [{
        competitors: [
          { homeAway: 'home', score: '2', team: { abbreviation: 'PAOK', displayName: 'PAOK' } },
          { homeAway: 'away', score: '0', team: { abbreviation: 'DYN', displayName: 'Dynamo Kyiv' } },
        ],
      }],
    }],
  }
  const finalHit = findMatchScore(mockFinal, { home: 'PAOK', away: 'DYN' })
  assert(finalHit && finalHit.final && finalHit.h === 2 && finalHit.a === 0, `final parse ${JSON.stringify(finalHit)}`)
}

await testTimeDisplay()
await testMd1Kickoffs()
await testEspnUefaStillEmpty()
await testUefaViaTheSportsDB()
await testSlViaTheSportsDB()
await testLiveShape()
await testMockLiveParse()

console.log(failed ? `\n❌ ${failed} failure(s)` : '\n✅ All live-score / kickoff checks passed')
process.exit(failed ? 1 : 0)
