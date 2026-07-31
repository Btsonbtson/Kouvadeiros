/**
 * ESPN scoreboard helpers — shared by Worker (/fetch-scores) and local tests.
 * League slugs: gre.1 (Super League), uefa.champions, uefa.europa, uefa.europa.conf
 */

export const ESPN_LEAGUES = {
  SL:   'gre.1',
  UCL:  'uefa.champions',
  UEL:  'uefa.europa',
  UECL: 'uefa.europa.conf',
}

/** Our team key → ESPN abbreviations / name fragments for matching */
export const ESPN_TEAM_ALIASES = {
  AEK:  ['AEK', 'AEK Athens'],
  IRA:  ['IRAK', 'Iraklis', 'Ηρακλής'],
  KAL:  ['KAL', 'Kalamata'],
  ARI:  ['ARI', 'Aris', 'Aris Thessaloniki'],
  OLY:  ['OLY', 'Olympiacos', 'Olympiakos'],
  ATR:  ['ATRO', 'ATR', 'Atromitos'],
  PAO:  ['PAO', 'Panathinaikos'],
  KIF:  ['KIF', 'Kifisia', 'Kifissia'],
  PAOK: ['PAOK'],
  LEV:  ['LEV', 'Levadiakos'],
  PNE:  ['PAN', 'PNE', 'Panetolikos', 'Panaitolikos'],
  AST:  ['AST', 'Asteras', 'Asteras Tripolis'],
  OFI:  ['OFI'],
  VOL:  ['VOL', 'Volos'],
  DYN:  ['DYN', 'Dynamo Kyiv', 'Dynamo Kiev', 'FC Dynamo Kyiv'],
  NEC:  ['NEC', 'NEC Nijmegen', 'Nijmegen'],
  PKS:  ['PKS', 'Paksi', 'Paks', 'Paksi SE'],
  TBD:  ['TBD'],
}

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]/g, '')
}

export function teamMatches(ourKey, espnAbbr, espnName) {
  const aliases = ESPN_TEAM_ALIASES[ourKey] || [ourKey]
  const hay = [espnAbbr, espnName].map(norm)
  return aliases.some(a => {
    const n = norm(a)
    return hay.some(h => h === n || h.includes(n) || n.includes(h))
  })
}

/** YYYYMMDD from ISO kickoff (UTC date used by ESPN scoreboard API) */
export function espnDateParam(iso) {
  const d = new Date(iso)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

export function scoreboardUrl(leagueKey, iso) {
  const slug = ESPN_LEAGUES[leagueKey] || ESPN_LEAGUES.SL
  const date = espnDateParam(iso)
  return `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard?dates=${date}`
}

/**
 * Parse ESPN scoreboard JSON → { h, a, min, final, status, eventId } for our fixture.
 * @param {object} board ESPN scoreboard response
 * @param {{ home:string, away:string }} match our fixture keys
 */
export function findMatchScore(board, match) {
  const events = board?.events || []
  for (const ev of events) {
    const comps = ev.competitions?.[0]
    if (!comps) continue
    const home = comps.competitors?.find(c => c.homeAway === 'home')
    const away = comps.competitors?.find(c => c.homeAway === 'away')
    if (!home || !away) continue
    const homeOk = teamMatches(match.home, home.team?.abbreviation, home.team?.displayName || home.team?.name)
    const awayOk = teamMatches(match.away, away.team?.abbreviation, away.team?.displayName || away.team?.name)
    if (!homeOk || !awayOk) continue

    const status = ev.status?.type || {}
    const state = status.name || status.state || ''
    const final = /final|full.?time|status_full_time|STATUS_FINAL/i.test(state) || status.completed === true
    const inPlay = /in_play|inprogress|halftime|status_in_progress|STATUS_HALFTIME|STATUS_FIRST_HALF|STATUS_SECOND_HALF/i.test(state)
      || status.state === 'in'
    const clock = ev.status?.displayClock || comps.status?.displayClock || ''
    const minRaw = parseInt(String(clock).replace(/[^\d]/g, ''), 10)
    const period = ev.status?.period || comps.status?.period
    let min = Number.isFinite(minRaw) ? minRaw : 0
    if (!min && period === 2) min = 45
    if (!min && inPlay) min = 1
    if (final) min = 90

    return {
      h: Number(home.score ?? 0),
      a: Number(away.score ?? 0),
      min,
      final,
      inPlay: inPlay && !final,
      status: state,
      eventId: String(ev.id || ''),
      kickoff: ev.date || null,
    }
  }
  return null
}

/** Fetch + resolve a single fixture from ESPN (Node / Worker) */
export async function fetchEspnScore(match, fetchFn = fetch) {
  if (match.home === 'TBD' || match.away === 'TBD') {
    return { ok: false, reason: 'opponent_tbd' }
  }
  const url = scoreboardUrl(match.t, match.kickoff)
  const res = await fetchFn(url)
  if (!res.ok) return { ok: false, reason: `espn_http_${res.status}` }
  const board = await res.json()
  const score = findMatchScore(board, match)
  if (!score) return { ok: false, reason: 'not_found', url }
  // Scheduled / pre-match rows are not usable scores
  if (!score.final && !score.inPlay) {
    return { ok: false, reason: 'scheduled', status: score.status, kickoff: score.kickoff, url, source: 'espn' }
  }
  return { ok: true, ...score, url, source: 'espn' }
}
