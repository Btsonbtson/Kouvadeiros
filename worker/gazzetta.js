/**
 * Gazzetta.gr livescore feeds (no API key) for kouvadeiros-api Worker.
 * Schedule: GET https://www.gazzetta.gr/gztfeeds/livescore?date={D-M-YYYY}
 * Live:     GET https://api.gazzetta.gr/gztfeeds/live_matches
 */

const GZ_HEADERS = {
  Accept: 'application/json',
  'Accept-Language': 'el-GR,el;q=0.9,en;q=0.8',
  Referer: 'https://www.gazzetta.gr/livescore',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
}

const FOOTBALL = 'Ποδόσφαιρο'

/**
 * Canonical club keys. Never use ultra-short aliases that collide (e.g. "παο" ⊂ "παοκ").
 * Cyrillic-only strings are avoided — they strip to "" under Greek/Latin norm and break matching.
 */
const TEAM_ALIASES = {
  paok: ['paok', 'παοκ'],
  anderlecht: ['anderlecht', 'άντερλεχτ', 'αντερλεχτ', 'rsc anderlecht'],
  panathinaikos: ['panathinaikos', 'παναθηναϊκός', 'παναθηναικος', 'παναθηναϊκος'],
  'cska 1948': ['cska 1948', 'cska1948', 'τσσκα 1948', 'τσσκα', 'τσκα 1948'],
  olympiacos: ['olympiacos', 'olympiakos', 'ολυμπιακός', 'ολυμπιακος'],
  'nec nijmegen': ['nec nijmegen', 'nijmegen', 'νέιμεγκεν', 'νειμεγκεν', 'ναϊμέγκεν', 'ναιμεγκεν'],
  'dynamo kyiv': ['dynamo kyiv', 'dynamo kiev', 'ντινάμο κίεβου', 'ντιναμο κιεβου'],
  'aek athens': ['aek athens', 'aek', 'αεκ'],
  paksi: ['paksi', 'paks', 'πάξι', 'παξι'],
}

function athensParts(d = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Athens',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
  const parts = Object.fromEntries(fmt.formatToParts(d).map((p) => [p.type, p.value]))
  return { day: Number(parts.day), month: Number(parts.month), year: Number(parts.year) }
}

export function gazzettaDateParam(d = new Date()) {
  const { day, month, year } = athensParts(d)
  return `${day}-${month}-${year}`
}

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff ]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Resolve a display name to a TEAM_ALIASES key, or null. */
function canonicalTeamKey(name) {
  const n = norm(name)
  if (!n) return null
  for (const [key, aliases] of Object.entries(TEAM_ALIASES)) {
    const forms = [key, ...aliases].map(norm).filter((x) => x.length >= 3)
    if (forms.some((f) => n === f || n.includes(f) || f.includes(n))) return key
  }
  return null
}

/** Same club (via alias map), or strict full-name equality — never empty-token / substring wildcards. */
function teamHit(matchName, gazzettaName) {
  const a = canonicalTeamKey(matchName)
  const b = canonicalTeamKey(gazzettaName)
  if (a && b) return a === b
  const na = norm(matchName)
  const nb = norm(gazzettaName)
  if (!na || !nb || na.length < 3 || nb.length < 3) return false
  return na === nb
}

export async function fetchGazzettaSchedule(dateParam = gazzettaDateParam()) {
  const url = `https://www.gazzetta.gr/gztfeeds/livescore?date=${encodeURIComponent(dateParam)}`
  const res = await fetch(url, { headers: GZ_HEADERS })
  if (!res.ok) throw new Error(`Gazzetta schedule HTTP ${res.status}`)
  const raw = await res.json()
  const byId = {}
  for (const block of Object.values(raw || {})) {
    if (!block?.league || block.league.sport !== FOOTBALL) continue
    const leagueName = block.league.league_name || ''
    for (const m of Object.values(block.matches || {})) {
      if (!m?.match_id) continue
      byId[String(m.match_id)] = {
        match_id: m.match_id,
        home: m.home_team_name || '',
        away: m.away_team_name || '',
        league_id: block.league.league_id,
        league_name: leagueName,
        kickoff_unix: m.match_tm,
        home_score: m.home_team_score,
        away_score: m.away_team_score,
      }
    }
  }
  return byId
}

export async function fetchGazzettaLiveRaw() {
  const res = await fetch('https://api.gazzetta.gr/gztfeeds/live_matches', { headers: GZ_HEADERS })
  if (!res.ok) throw new Error(`Gazzetta live HTTP ${res.status}`)
  const data = await res.json()
  return data && typeof data === 'object' ? data : {}
}

function parseMinute(raw) {
  if (raw == null || raw === '') return 0
  const m = String(raw).match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

/**
 * Gazzetta often omits minute + match_status at half-time (is_live=1, both null).
 * Prefer feed clock; otherwise estimate from kickoff (45′ + ~15′ HT + 45′).
 */
function estimateFromKickoff(match, now = Date.now(), hintPhase = null) {
  if (!match?.kickoff) return { minute: null, label: 'LIVE', phase: 'LIVE' }
  const elapsed = Math.floor((now - new Date(match.kickoff).getTime()) / 60000)
  if (elapsed < 0) return { minute: null, label: 'LIVE', phase: 'LIVE' }

  if (hintPhase === '1H' || (hintPhase == null && elapsed < 45)) {
    const m = Math.max(1, Math.min(45, elapsed || 1))
    return { minute: m, label: `${m}'`, phase: '1H' }
  }
  if (hintPhase === 'HT' || (hintPhase == null && elapsed >= 45 && elapsed < 60)) {
    return { minute: 45, label: 'ΗΜ', phase: 'HT' }
  }
  // 2nd half (or past HT window)
  const m = Math.min(105, 45 + Math.max(0, elapsed - 60))
  if (m > 90) return { minute: m, label: `90+${m - 90}'`, phase: '2H' }
  return { minute: Math.max(46, m), label: `${Math.max(46, m)}'`, phase: '2H' }
}

function resolveLiveClock(live, match, now = Date.now()) {
  const status = String(live?.match_status || '').trim()
  const rawMin = live?.minute
  const fromFeed = parseMinute(rawMin)

  if (/ημιχρ|half\s*time|(^|\b)ht(\b|$)/i.test(status)) {
    return { minute: 45, label: 'ΗΜ', phase: 'HT' }
  }
  if (fromFeed > 0) {
    const phase = /2[oο]/i.test(status) || fromFeed > 45 ? '2H' : '1H'
    const raw = String(rawMin)
    if (/\d+\s*\+\s*\d+/.test(raw)) {
      return { minute: fromFeed, label: raw.replace(/′/g, "'").trim(), phase }
    }
    return { minute: fromFeed, label: `${fromFeed}'`, phase }
  }
  if (/1[oο]/i.test(status) && /ημιχ/i.test(status)) {
    return estimateFromKickoff(match, now, '1H')
  }
  if (/2[oο]/i.test(status) && /ημιχ/i.test(status)) {
    return estimateFromKickoff(match, now, '2H')
  }
  // Live but blank clock (common at HT on Gazzetta)
  return estimateFromKickoff(match, now, null)
}

function findScheduleRow(match, scheduleById) {
  if (!match?.homeTeam || !match?.awayTeam) return null
  const hits = []
  for (const row of Object.values(scheduleById || {})) {
    if (teamHit(match.homeTeam, row.home) && teamHit(match.awayTeam, row.away)) hits.push(row)
  }
  if (!hits.length) return null
  // Prefer men's senior ties — skip obvious women's boards when a better hit exists
  const senior = hits.filter((r) => !/\(w\)|γυναικ/i.test(`${r.home} ${r.away} ${r.league_name}`))
  return (senior.length ? senior : hits)[0]
}

/**
 * Resolve a KOUVADEIROS MATCHES entry against Gazzetta schedule + live feed.
 * Returns ESPN-compatible score object or null.
 */
export function resolveGazzettaScore(match, scheduleById, liveRaw) {
  const sched = findScheduleRow(match, scheduleById)
  if (!sched) return null

  const mid = String(sched.match_id)
  const live = liveRaw?.[mid] || liveRaw?.[sched.match_id]
  if (live && (live.is_live || live.status_name === 'live')) {
    const h = parseInt(live.home_score, 10)
    const a = parseInt(live.away_score, 10)
    if (Number.isNaN(h) || Number.isNaN(a)) return null
    const clock = resolveLiveClock(live, match)
    return {
      status: 'STATUS_IN_PROGRESS',
      isFinal: false,
      isHT: clock.phase === 'HT',
      isInProgress: true,
      isAET: false,
      isPen: false,
      h,
      a,
      minute: clock.minute ?? 0,
      label: clock.label,
      phase: clock.phase,
      detail: live.match_status || clock.label || 'live',
      source: 'gazzetta',
      gazzettaId: sched.match_id,
    }
  }

  // Finished / posted on schedule board
  const sh = sched.home_score
  const sa = sched.away_score
  if (sh != null && sa != null && String(sh) !== '' && String(sa) !== '') {
    const h = parseInt(sh, 10)
    const a = parseInt(sa, 10)
    if (!Number.isNaN(h) && !Number.isNaN(a)) {
      const statusBlob = `${sched.status_name || ''} ${sched.match_status || ''} ${sched.score_status || ''} ${live?.match_status || ''}`
      const isAET = /aet|after.?extra|παρ[αά]ταση|παρατ/i.test(statusBlob)
      const isPen = /pen|π[εέ]ναλ/i.test(statusBlob)
      return {
        status: 'STATUS_FINAL',
        isFinal: true,
        isHT: false,
        isInProgress: false,
        isAET,
        isPen,
        h,
        a,
        minute: 90,
        label: isAET ? 'AET' : isPen ? 'PEN' : 'ΤΕΛ',
        phase: 'FT',
        detail: isAET ? 'AET' : isPen ? 'PEN' : 'FT',
        source: 'gazzetta',
        gazzettaId: sched.match_id,
      }
    }
  }

  return null
}

/** Merge schedule boards for today + each match kickoff (Athens dates). */
async function fetchSchedulesForMatches(matches, { includeTbd = false } = {}) {
  const dates = new Set([gazzettaDateParam()])
  for (const m of matches || []) {
    if (!m?.kickoff) continue
    if (m.timeTbd && !includeTbd) continue
    dates.add(gazzettaDateParam(new Date(m.kickoff)))
  }
  const merged = {}
  await Promise.all(
    [...dates].map(async (d) => {
      try {
        const part = await fetchGazzettaSchedule(d)
        Object.assign(merged, part)
      } catch {
        /* ignore one bad date */
      }
    }),
  )
  return merged
}

/**
 * Look up kickoff ISO for a MATCHES/fixture entry from Gazzetta schedule.
 * Works for TBA placeholders (searches the placeholder Athens date).
 */
export async function fetchGazzettaKickoff(match) {
  if (!match?.kickoff) return null
  const home = match.homeTeam || match.home
  const away = match.awayTeam || match.away
  if (!home || !away || home === 'TBD' || away === 'TBD') return null
  const scheduleById = await fetchSchedulesForMatches([match], { includeTbd: true })
  const sched = findScheduleRow(match, scheduleById)
  if (!sched?.kickoff_unix) return null
  const raw = Number(sched.kickoff_unix)
  if (!Number.isFinite(raw) || raw <= 0) return null
  const ms = raw > 1e12 ? raw : raw * 1000
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z')
}

export async function pollGazzettaForMatches(matches) {
  const list = matches || []
  const scheduleById = await fetchSchedulesForMatches(list)
  const liveRaw = await fetchGazzettaLiveRaw()
  const scores = {}
  let liveCount = 0
  for (const match of list) {
    const s = resolveGazzettaScore(match, scheduleById, liveRaw)
    if (s) {
      scores[match.id] = s
      if (s.isInProgress) liveCount++
    }
  }
  return {
    scheduleCount: Object.keys(scheduleById).length,
    liveFeedCount: Object.keys(liveRaw).length,
    matchedLive: liveCount,
    matchedTotal: Object.keys(scores).length,
    scores,
    scheduleById,
    liveRaw,
  }
}

export function defaultGazzettaHealth() {
  return {
    enabled: true, // default ON — cloud cron, no local Python
    lastOk: null,
    lastError: null,
    lastPoll: null,
    scheduleCount: 0,
    liveFeedCount: 0,
    matchedLive: 0,
    matchedTotal: 0,
  }
}

export async function getGazzettaHealth(env) {
  const raw = await env.KOUV.get('gazzetta:health')
  if (!raw) return defaultGazzettaHealth()
  try {
    return { ...defaultGazzettaHealth(), ...JSON.parse(raw) }
  } catch {
    return defaultGazzettaHealth()
  }
}

export async function setGazzettaHealth(env, health) {
  await env.KOUV.put('gazzetta:health', JSON.stringify(health))
}

/** Healthy = enabled and successful poll within staleMs (default 15 min). */
export function gazzettaIsHealthy(health, staleMs = 15 * 60 * 1000) {
  if (!health?.enabled) return false
  if (health.lastError && (!health.lastOk || health.lastError > health.lastOk)) return false
  if (!health.lastOk) return false
  const t = Date.parse(health.lastOk)
  if (Number.isNaN(t)) return false
  return Date.now() - t <= staleMs
}
