/**
 * Map football-data.org / SofaScore pipeline matches → our ALL_FIXTURES ids.
 */
import { ALL_FIXTURES, TEAMS } from './data.js'

const NAME_TO_KEY = {
  aek: 'AEK', 'aek athens': 'AEK',
  iraklis: 'IRA', 'iraklis 1908': 'IRA',
  kalamata: 'KAL',
  aris: 'ARI', 'aris thessaloniki': 'ARI',
  olympiacos: 'OLY', olympiakos: 'OLY',
  atromitos: 'ATR',
  panathinaikos: 'PAO',
  kifisia: 'KIF', kifissia: 'KIF',
  paok: 'PAOK',
  levadiakos: 'LEV',
  panetolikos: 'PNE', panaitolikos: 'PNE',
  asteras: 'AST', 'asteras tripolis': 'AST', 'asteras aktor': 'AST',
  ofi: 'OFI', 'ofi crete': 'OFI',
  volos: 'VOL', 'volos nfc': 'VOL',
  'dynamo kyiv': 'DYN', 'dynamo kiev': 'DYN', 'fc dynamo kyiv': 'DYN',
  'nec nijmegen': 'NEC', nec: 'NEC',
  paks: 'PKS', paksi: 'PKS', 'paksi se': 'PKS',
  anderlecht: 'AND', 'rsc anderlecht': 'AND',
  'cska 1948': 'CSK', 'cska sofia 1948': 'CSK', 'cska 1948 sofia': 'CSK',
}

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()
}

export function resolveTeamKey(name, shortName) {
  const candidates = [name, shortName].filter(Boolean).map(norm)
  for (const c of candidates) {
    if (NAME_TO_KEY[c]) return NAME_TO_KEY[c]
    // partial: "AEK Athens" already normalized; try contains
    for (const [alias, key] of Object.entries(NAME_TO_KEY)) {
      if (c === alias || c.includes(alias) || alias.includes(c)) return key
    }
  }
  // Match against our TEAMS display names
  for (const [key, t] of Object.entries(TEAMS)) {
    const n = norm(t.name)
    if (candidates.some(c => c === n || c.includes(n) || n.includes(c))) return key
  }
  return null
}

function sameDay(aIso, bIso) {
  if (!aIso || !bIso) return true
  return String(aIso).slice(0, 10) === String(bIso).slice(0, 10)
}

/**
 * @param {object[]} pipelineMatches  KouvadeirosMatch[] from /live-scores
 * @returns {Record<string,{h:number,a:number,min:number,status:string,provider:string,external_id:string}>}
 */
export function mapPipelineToLiveScores(pipelineMatches = []) {
  const out = {}
  for (const pm of pipelineMatches) {
    const home = resolveTeamKey(pm.home_team?.name, pm.home_team?.short_name)
    const away = resolveTeamKey(pm.away_team?.name, pm.away_team?.short_name)
    if (!home || !away) continue
    if (pm.score?.home == null || pm.score?.away == null) {
      if (pm.status !== 'IN_PROGRESS' && pm.status !== 'FINISHED') continue
    }
    const fixture = ALL_FIXTURES.find(m =>
      m.home === home && m.away === away && sameDay(m.kickoff, pm.kickoff_at_utc)
    ) || ALL_FIXTURES.find(m => m.home === home && m.away === away)
    if (!fixture) continue

    const inPlay = pm.status === 'IN_PROGRESS'
    const finished = pm.status === 'FINISHED'
    if (!inPlay && !finished) continue

    out[fixture.id] = {
      h: Number(pm.score?.home ?? 0),
      a: Number(pm.score?.away ?? 0),
      min: inPlay ? (pm.minute ?? 1) : 90,
      status: pm.status,
      provider: pm.provider || 'pipeline',
      external_id: pm.external_id,
      final: finished,
    }
  }
  return out
}
