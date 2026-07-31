/**
 * Multi-source live/final scores.
 * ESPN works for Super League; UEFA nights often return empty → TheSportsDB fallback.
 */
import { fetchEspnScore, findMatchScore, scoreboardUrl, ESPN_LEAGUES, teamMatches as espnTeamMatches } from './espn.js'

export { findMatchScore, scoreboardUrl, ESPN_LEAGUES }

const TSDB = 'https://www.thesportsdb.com/api/v1/json/3'

/** TheSportsDB league ids */
export const TSDB_LEAGUES = {
  SL:   '4336',
  UEL:  '4481',
  UECL: '5071',
  UCL:  '4480',
}

const SEASON = '2026-2027'

/** TheSportsDB team ids for clubs we track */
export const TSDB_TEAM_IDS = {
  PAOK: '133749',
  PAO:  '133746',
  OLY:  '133754',
  AEK:  '133753',
  OFI:  '133743',
  DYN:  '133944',
  NEC:  '133760',
  PKS:  '138185', // "Paks"
  AND:  '133610',
  CSK:  '137170',
  ARI:  '133742',
  ATR:  '133744',
  AST:  '133752',
  LEV:  '133755',
  PNE:  '133751',
  KIF:  '144147',
  KAL:  '156393',
  IRA:  '133828',
  VOL:  '136853',
}

export const TSDB_NAME_ALIASES = {
  AEK:  ['AEK', 'AEK Athens'],
  IRA:  ['Iraklis', 'Iraklis 1908', 'IRAK'],
  KAL:  ['Kalamata'],
  ARI:  ['Aris', 'Aris Thessaloniki'],
  OLY:  ['Olympiacos', 'Olympiakos'],
  ATR:  ['Atromitos'],
  PAO:  ['Panathinaikos'],
  KIF:  ['Kifisia', 'Kifissia'],
  PAOK: ['PAOK'],
  LEV:  ['Levadiakos'],
  PNE:  ['Panetolikos', 'Panaitolikos'],
  AST:  ['Asteras', 'Asteras Tripolis'],
  OFI:  ['OFI', 'OFI Crete'],
  VOL:  ['Volos'],
  DYN:  ['Dynamo Kyiv', 'Dynamo Kiev', 'FC Dynamo Kyiv'],
  NEC:  ['NEC Nijmegen', 'NEC', 'Nijmegen'],
  PKS:  ['Paks', 'Paksi', 'Paksi SE'],
  AND:  ['Anderlecht', 'RSC Anderlecht'],
  CSK:  ['CSKA 1948', 'CSKA Sofia 1948', 'CSKA 1948 Sofia'],
  TBD:  ['TBD'],
}

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]/g, '')
}

function nameMatches(ourKey, ...names) {
  const aliases = TSDB_NAME_ALIASES[ourKey] || [ourKey]
  const hay = names.map(norm).filter(Boolean)
  return aliases.some(a => {
    const n = norm(a)
    return hay.some(h => h === n || h.includes(n) || n.includes(h))
  })
}

function parseMinute(progress, status) {
  const fromProg = parseInt(String(progress || '').replace(/[^\d]/g, ''), 10)
  if (Number.isFinite(fromProg) && fromProg > 0) return fromProg
  const st = String(status || '').toUpperCase()
  if (st === 'HT' || st === 'HALF') return 45
  if (/FT|AET|PEN|FINISHED|FULL/.test(st)) return 90
  if (st === '2H') return 46
  if (st === '1H' || st === 'LIVE') return 1
  return 0
}

function parseTsdbEvent(ev) {
  if (!ev) return null
  const status = String(ev.strStatus || ev.strProgress || '').trim()
  const st = status.toUpperCase()
  const final = /^(FT|AET|PEN|FINISHED|MATCH FINISHED|FULL.?TIME|AFTER.??ET|AFTER.??PEN)/i.test(st)
    || /FT|AET|PEN/.test(st) && !/^[12]H$/.test(st)
  const inPlay = !final && (/^[12]H$|HT|LIVE|IN PLAY|ET/i.test(st) || !!ev.strProgress)
  const h = ev.intHomeScore == null || ev.intHomeScore === '' ? null : Number(ev.intHomeScore)
  const a = ev.intAwayScore == null || ev.intAwayScore === '' ? null : Number(ev.intAwayScore)
  if (h == null || a == null) {
    if (!inPlay && !final) return null
  }
  return {
    h: h ?? 0,
    a: a ?? 0,
    min: parseMinute(ev.strProgress, status),
    final,
    inPlay: inPlay && !final,
    status: status || (final ? 'FT' : 'LIVE'),
    eventId: String(ev.idEvent || ev.idLiveScore || ''),
    kickoff: ev.strTimestamp || (ev.dateEvent && ev.strTime ? `${ev.dateEvent}T${ev.strTime}Z` : null),
    source: 'thesportsdb',
  }
}

function eventTeamsMatch(ev, match) {
  return nameMatches(match.home, ev.strHomeTeam) && nameMatches(match.away, ev.strAwayTeam)
}

function nearKickoff(evTs, kickoffIso, hours = 18) {
  if (!evTs || !kickoffIso) return true
  const a = new Date(evTs).getTime()
  const b = new Date(kickoffIso).getTime()
  if (!Number.isFinite(a) || !Number.isFinite(b)) return true
  return Math.abs(a - b) <= hours * 3600 * 1000
}

async function tsdbJson(path, fetchFn) {
  const res = await fetchFn(`${TSDB}${path}`)
  if (!res.ok) throw new Error(`tsdb_http_${res.status}`)
  const ct = res.headers.get('content-type') || ''
  const text = await res.text()
  if (!ct.includes('json') && text.trimStart().startsWith('<')) {
    throw new Error('tsdb_html_rate_limit')
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('tsdb_bad_json')
  }
}

/** Pull candidate events — minimize free-tier calls (1–2 reqs typical) */
async function collectTsdbEvents(match, fetchFn) {
  const out = []
  const pushMatch = (ev) => {
    if (ev && eventTeamsMatch(ev, match) && nearKickoff(ev.strTimestamp, match.kickoff, 48)) out.push(ev)
  }

  // 1. Greek club (or home) recent results — enough for finished UEFA/SL nights
  const primaryId = TSDB_TEAM_IDS[match.greek] || TSDB_TEAM_IDS[match.home] || TSDB_TEAM_IDS[match.away]
  if (primaryId) {
    try {
      const last = await tsdbJson(`/eventslast.php?id=${primaryId}`, fetchFn)
      for (const ev of last?.results || []) pushMatch(ev)
    } catch { /* ignore */ }
  }

  // 2. Live board when we don't already have a final/in-play row
  const hasScored = out.some(ev => {
    const p = parseTsdbEvent(ev)
    return p && (p.final || p.inPlay)
  })
  if (!hasScored) {
    try {
      const live = await tsdbJson('/livescore.php?s=Soccer', fetchFn)
      for (const row of live?.livescore || []) pushMatch(row)
    } catch { /* ignore */ }
  }

  // 3. Season table only if still empty (SL fixtures not yet in last/next)
  if (!out.length) {
    const leagueId = TSDB_LEAGUES[match.t]
    if (leagueId) {
      try {
        const season = await tsdbJson(`/eventsseason.php?id=${leagueId}&s=${SEASON}`, fetchFn)
        for (const ev of season?.events || []) pushMatch(ev)
      } catch { /* ignore */ }
    }
  }
  return out
}

export async function fetchTsdbScore(match, fetchFn = fetch) {
  if (match.home === 'TBD' || match.away === 'TBD') {
    return { ok: false, reason: 'opponent_tbd', source: 'thesportsdb' }
  }
  try {
    const events = await collectTsdbEvents(match, fetchFn)
    // Prefer live/in-play, then most recent with a score
    const ranked = events
      .map(parseTsdbEvent)
      .filter(Boolean)
      .sort((a, b) => {
        if (a.inPlay !== b.inPlay) return a.inPlay ? -1 : 1
        if (a.final !== b.final) return a.final ? -1 : 1
        return 0
      })
    const hit = ranked[0]
    if (!hit) return { ok: false, reason: 'not_found', source: 'thesportsdb' }
    return { ok: true, ...hit }
  } catch (e) {
    return { ok: false, reason: String(e.message || e), source: 'thesportsdb' }
  }
}

/**
 * Resolve score for a fixture.
 * TheSportsDB is primary for all competitions (UEFA + Super League).
 * ESPN remains a fallback when TSDB has no row yet.
 */
export async function fetchMatchScore(match, fetchFn = fetch) {
  const chain = [fetchTsdbScore, fetchEspnScore]

  const errors = []
  for (const fn of chain) {
    const r = await fn(match, fetchFn)
    if (r.ok) return { ...r, provider: r.source || (fn === fetchEspnScore ? 'espn' : 'thesportsdb') }
    errors.push(`${fn === fetchEspnScore ? 'espn' : 'tsdb'}:${r.reason}`)
  }
  return { ok: false, reason: errors.join(' | ') }
}

// Re-export ESPN helper used by SL fixture tests / worker
export { fetchEspnScore, espnTeamMatches }
