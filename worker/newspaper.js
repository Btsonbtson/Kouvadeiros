/**
 * KOUVADEIROS — Ο Κουβάς
 * Greek red-top tabloid. Provocative. Poisonous. Madhouse. Photorealistic web visuals.
 */

/** Known finals when KV lags (synced with Worker KNOWN + app seeds) */
export const FALLBACK_RESULTS = {
  'uel-paok-1': { h: 2, a: 3 },
  'uecl-pao-1': { h: 1, a: 2 },
  'uel-paok-2': { h: 2, a: 0, qual: 'PAOK' },
  'uecl-pao-2': { h: 2, a: 2, qual: 'PAO' },
  'ucl-oly-1': { h: 0, a: 0 },
  // Tip score = 90′ only. AET finals live in otH/otA (NEC 2–1 after ET; no πρόκριση pts yet).
  'ucl-oly-2': { h: 1, a: 1, overtime: true, otH: 2, otA: 1 },
  'uecl-pao-3': { h: 1, a: 1 },
  // Tip score = 90′ 1–1; AET finished CSK 1–2 PAO → πρόκριση PAO (+1 all).
  'uecl-pao-4': { h: 1, a: 1, overtime: true, otH: 1, otA: 2, qual: 'PAO' },
  // Play-off Leg 1 · 20/8/2026
  'uel-ofi-1': { h: 3, a: 0 },
  'uecl-pao-5': { h: 2, a: 2 },
  'uecl-paok-1': { h: 1, a: 1 },
}

const PLAYER_COLORS = {
  boikos: '#ff2244',
  mavromichalis: '#ffdd00',
  chousiadas: '#00ff88',
}

/** Curated Unsplash stills — stadium + SI / page-3 glam (adult fashion & beach) */
const VISUAL_BANK = {
  stadium: [
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1400&q=80',
  ],
  celebrate: [
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80',
  ],
  despair: [
    'https://images.unsplash.com/photo-1486286701208-1d58e9339349?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80',
  ],
  crowd: [
    'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
  ],
  /** Sports Illustrated swimsuit / Daily Mail page-3 cover energy */
  glam: [
    'https://images.unsplash.com/photo-1570258028946-b9a55411d117?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1568819317551-31051b37f69f?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1525672716948-1f0bb9c49883?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1636427697818-a1bf8794ee17?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1616147503419-500e80be8447?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1724124658760-05c3a8d2c077?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1589676562553-1fb5f8c3937e?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1699061930674-1be64fe86fc3?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1628196747637-160b1be385ac?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1630588034516-9180c7ead89e?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1643848950187-a5658454e278?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1695990190577-e367721ef82a?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1695990191278-fe203094860a?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1655663843133-3b951f435fb2?auto=format&fit=crop&w=900&h=1200&q=80',
    'https://images.unsplash.com/photo-1756277123994-f79585558b0c?auto=format&fit=crop&w=900&h=1200&q=80',
  ],
  laugh: [
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=700&q=80',
  ],
}

function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pickFrom(arr, seed) {
  if (!arr?.length) return undefined
  // Coerce via >>> so signed shifts (seed >> n) never yield arr[negative] === undefined
  return arr[(seed >>> 0) % arr.length]
}

function uniqPick(arr, seed, n) {
  const out = []
  let s = seed >>> 0
  for (let i = 0; i < n * 4 && out.length < n; i++) {
    s = (Math.imul(s ^ (s >>> 13), 0x5bd1e995) + i) >>> 0
    const u = arr[s % arr.length]
    if (!out.includes(u)) out.push(u)
  }
  while (out.length < n) out.push(arr[out.length % arr.length])
  return out
}

export function pickVisuals(ymd, round = 0) {
  const s = hashSeed(`${ymd}:v${round}:kouvas`)
  const glam = uniqPick(VISUAL_BANK.glam, s, 4)
  return {
    hero: pickFrom(VISUAL_BANK.stadium, s),
    king: pickFrom(VISUAL_BANK.celebrate, s >> 3),
    donut: pickFrom(VISUAL_BANK.despair, s >> 7),
    strip: pickFrom(VISUAL_BANK.crowd, s >> 11),
    laugh: pickFrom(VISUAL_BANK.laugh, s >> 13),
    page3: glam[0],
    glam: glam,
    roast: glam.slice(0, 3),
    round,
  }
}

function matchResult(h, a) {
  return h > a ? 'H' : h < a ? 'A' : 'D'
}

function parseTieMeta(match) {
  if (match?.leg != null) return match
  const m = String(match?.id || '').match(/^(.*)-([12])$/)
  if (!m) return { ...match, leg: null, tie: null }
  return { ...match, tie: m[1], leg: Number(m[2]) }
}

function getTieLeg1Id(match) {
  const meta = parseTieMeta(match)
  if (!meta.tie) return null
  return `${meta.tie}-1`
}

export function scoreMatch(pred, actual, opts = {}) {
  if (actual == null) return null
  const missing = !pred || typeof pred.h !== 'number' || typeof pred.a !== 'number'
  if (missing) {
    if (!opts.allowDq) return null
    return { exact: false, correct: false, qualCorrect: false, scorePts: -1, qualPts: 0, points: -1, dq: true }
  }
  const exact = pred.h === actual.h && pred.a === actual.a
  const correct = matchResult(pred.h, pred.a) === matchResult(actual.h, actual.a)
  const awardQual = opts.awardQual !== false && !!actual.qual
  const qualTip = opts.qualTip !== undefined ? opts.qualTip : pred?.qual
  const qualCorrect = !!(awardQual && qualTip && actual.qual && qualTip === actual.qual)
  const scorePts = (exact ? 1 : 0) + (correct ? 1 : 0)
  const qualPts = qualCorrect ? 1 : 0
  return { exact, correct, qualCorrect, scorePts, qualPts, points: scorePts + qualPts, dq: false }
}

function matchHadAnyTip(predictions, matchId) {
  const tips = predictions?.[matchId] || {}
  return Object.values(tips).some((t) => t && typeof t.h === 'number' && typeof t.a === 'number')
}

function scorePlayerMatchWorker(match, pred, actual, predictions, playerId) {
  if (match?.postponed) return null
  if (actual == null) return null
  const missing = !pred || typeof pred.h !== 'number' || typeof pred.a !== 'number'
  if (missing) {
    if (!matchHadAnyTip(predictions, match?.id)) return null
    return scoreMatch(null, actual, { allowDq: true })
  }
  const meta = parseTieMeta(match)
  if (meta.leg === 1) return scoreMatch(pred, actual, { awardQual: false })
  if (meta.leg === 2 && actual.qual) {
    const leg1Id = getTieLeg1Id(match)
    const qualTip = (leg1Id && predictions?.[leg1Id]?.[playerId]?.qual) || null
    return scoreMatch(pred, actual, { qualTip, awardQual: true })
  }
  return scoreMatch(pred, actual, { awardQual: false })
}

export function athensDate(iso) {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Europe/Athens' })
}

export function formatEditionDate(ymd) {
  const [y, m, d] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d, 12))
  return dt.toLocaleDateString('el-GR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function resolveResult(state, matchId) {
  return state.results?.[matchId] || FALLBACK_RESULTS[matchId] || null
}

export function matchesForDate(matches, ymd) {
  return matches.filter((m) => athensDate(m.kickoff) === ymd)
}

export function buildDayLedger(matches, state, users) {
  const players = Object.values(users).map((u) => ({ id: u.id, name: u.name }))
  const dayPts = Object.fromEntries(players.map((p) => [p.id, 0]))
  const dayExact = Object.fromEntries(players.map((p) => [p.id, 0]))
  const dayMiss = Object.fromEntries(players.map((p) => [p.id, 0]))
  const matchRows = []

  for (const match of matches) {
    const actual = resolveResult(state, match.id)
    if (!actual) continue
    const preds = state.predictions?.[match.id] || {}
    const row = {
      id: match.id,
      label: match.label,
      score: `${actual.h}–${actual.a}`,
      qual: actual.qual || null,
      players: [],
    }
    for (const p of players) {
      const pred = preds[p.id]
      const dq = !pred || typeof pred.h !== 'number' || typeof pred.a !== 'number'
      const sc = scorePlayerMatchWorker(match, pred, actual, state.predictions || {}, p.id)
      const pts = sc?.points ?? null
      if (sc) dayPts[p.id] += sc.points
      if (sc?.exact) dayExact[p.id] += 1
      if (sc && !sc.dq && pts === 0) dayMiss[p.id] += 1
      const leg1Id = getTieLeg1Id(match)
      const tipQual =
        parseTieMeta(match).leg === 2
          ? state.predictions?.[leg1Id]?.[p.id]?.qual
          : pred?.qual
      row.players.push({
        id: p.id,
        name: p.name,
        tip: dq || sc?.dq
          ? 'ΑΠΟΚΛΕΙΣΜΟΣ −1'
          : `${pred.h}–${pred.a}${tipQual ? ' →' + tipQual : ''}`,
        pts: sc?.dq ? -1 : pts,
        dq: !!(dq || sc?.dq),
        exact: !!sc?.exact,
        correct: !!sc?.correct,
      })
    }
    matchRows.push(row)
  }

  const ranking = players
    .map((p) => ({
      ...p,
      pts: dayPts[p.id],
      exact: dayExact[p.id],
      misses: dayMiss[p.id],
    }))
    .sort((a, b) => b.pts - a.pts || b.exact - a.exact || a.name.localeCompare(b.name))

  return { matchRows, ranking, dayPts }
}

/** Full season table across every finished fixture (not just today). */
export function buildSeasonTable(allMatches, state, users) {
  const players = Object.values(users).map((u) => ({ id: u.id, name: u.name }))
  const stats = Object.fromEntries(
    players.map((p) => [
      p.id,
      { id: p.id, name: p.name, pts: 0, exact: 0, correct: 0, played: 0, misses: 0, dayWins: 0 },
    ]),
  )

  const byDate = {}
  for (const match of allMatches) {
    const actual = resolveResult(state, match.id)
    if (!actual) continue
    const ymd = athensDate(match.kickoff)
    if (!byDate[ymd]) byDate[ymd] = []
    byDate[ymd].push(match)

    for (const p of players) {
      const pred = state.predictions?.[match.id]?.[p.id]
      const sc = scorePlayerMatchWorker(match, pred, actual, state.predictions || {}, p.id)
      if (!sc) continue
      stats[p.id].played += 1
      stats[p.id].pts += sc.points
      if (sc.exact) stats[p.id].exact += 1
      if (sc.correct) stats[p.id].correct += 1
      if (!sc.dq && sc.points === 0) stats[p.id].misses += 1
    }
  }

  for (const ymd of Object.keys(byDate)) {
    const day = buildDayLedger(byDate[ymd], state, users)
    if (!day.ranking.length) continue
    const top = day.ranking[0]?.pts
    if (top == null) continue
    for (const p of day.ranking) {
      if (p.pts === top && top > 0) stats[p.id].dayWins += 1
    }
  }

  const rows = players
    .map((p) => stats[p.id])
    .sort((a, b) => b.pts - a.pts || b.exact - a.exact || a.name.localeCompare(b.name))

  return rows
}

/** Cumulative points timeline for competition graph SVG. */
export function buildCompetitionTimeline(allMatches, state, users) {
  const players = Object.values(users).map((u) => ({ id: u.id, name: u.name }))
  const played = allMatches
    .filter((m) => resolveResult(state, m.id))
    .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))

  const cum = Object.fromEntries(players.map((p) => [p.id, 0]))
  const events = []
  for (const match of played) {
    const actual = resolveResult(state, match.id)
    for (const p of players) {
      const pred = state.predictions?.[match.id]?.[p.id]
      const sc = scorePlayerMatchWorker(match, pred, actual, state.predictions || {}, p.id)
      cum[p.id] += sc?.points ?? 0
    }
    const short =
      (match.homeTeam || match.label || match.id || '?').toString().slice(0, 10)
    events.push({
      id: match.id,
      label: short,
      pts: { ...cum },
    })
  }
  const maxPts = Math.max(...players.map((p) => cum[p.id]), 2)
  return { events, maxPts, final: { ...cum }, players }
}

function buildCompetitionSvg(timeline) {
  const { events, maxPts, players } = timeline
  if (!events.length) {
    return `<div class="graph-empty">Το γράφημα περιμένει αίμα... ακόμα τίποτα επίσημο!</div>`
  }

  const W = 680
  const H = 240
  const PAD = { top: 22, right: 16, bottom: 36, left: 36 }
  const gW = W - PAD.left - PAD.right
  const gH = H - PAD.top - PAD.bottom
  const allPts = [{ pts: Object.fromEntries(players.map((p) => [p.id, 0])) }, ...events]
  const N = Math.max(allPts.length - 1, 1)
  const xFor = (i) => PAD.left + (i / N) * gW
  const yFor = (v) => PAD.top + gH - (v / maxPts) * gH

  const smoothPath = (pid) => {
    const pts = allPts.map((ev, i) => ({ x: xFor(i), y: yFor(ev.pts[pid] ?? 0) }))
    if (pts.length < 2) return `M${pts[0].x} ${pts[0].y}`
    let d = `M${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]
      const curr = pts[i]
      const cpx = (prev.x + curr.x) / 2
      d += ` C${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`
    }
    return d
  }

  const grid = [0, 0.25, 0.5, 0.75, 1]
    .map((t) => {
      const y = PAD.top + gH * (1 - t)
      const v = Math.round(maxPts * t)
      return `<line x1="${PAD.left}" y1="${y}" x2="${W - PAD.right}" y2="${y}" stroke="#000" stroke-opacity=".08"/><text x="${PAD.left - 6}" y="${y + 3}" text-anchor="end" font-size="9" font-weight="900" fill="#333">${v}</text>`
    })
    .join('')

  const drawOrder = [...players].sort((a, b) => {
    if (a.id === 'boikos') return 1
    if (b.id === 'boikos') return -1
    return a.id.localeCompare(b.id)
  })

  const lines = drawOrder
    .map((p) => {
      const color = PLAYER_COLORS[p.id] || '#111'
      const last = allPts[allPts.length - 1]
      const lx = xFor(allPts.length - 1)
      const ly = yFor(last.pts[p.id] ?? 0)
      return (
        `<path d="${smoothPath(p.id)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>` +
        `<circle cx="${lx}" cy="${ly}" r="5" fill="${color}" stroke="#000" stroke-width="1.5"/>` +
        `<text x="${lx - 4}" y="${ly - 8}" text-anchor="end" font-size="10" font-weight="900" fill="${color}">${esc(p.name)} ${last.pts[p.id] ?? 0}</text>`
      )
    })
    .join('')

  const xLabels = events
    .filter((_, i) => i === 0 || i === events.length - 1 || i % Math.ceil(events.length / 4) === 0)
    .map((ev) => {
      const idx = events.indexOf(ev) + 1
      return `<text x="${xFor(idx)}" y="${H - 10}" text-anchor="middle" font-size="8" font-weight="700" fill="#444">${esc(ev.label)}</text>`
    })
    .join('')

  return `<svg class="comp-graph" viewBox="0 0 ${W} ${H}" role="img" aria-label="Competition graph">${grid}${lines}${xLabels}</svg>`
}


function compTag(match) {
  const lg = String(match?.espnLeague || match?.t || '')
  if (lg.includes('champions') || lg === 'UCL') return 'UCL'
  if (lg.includes('europa.conf') || lg === 'UECL') return 'UECL'
  if (lg.includes('europa') || lg === 'UEL') return 'UEL'
  if (lg.includes('gre') || lg === 'SL') return 'SL'
  return 'EU'
}

function formatKickShort(iso) {
  try {
    return new Date(iso).toLocaleString('el-GR', {
      timeZone: 'Europe/Athens',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch {
    return iso
  }
}

function playerOrder(users) {
  const preferred = ['boikos', 'mavromichalis', 'chousiadas']
  const map = Object.fromEntries(Object.values(users).map((u) => [u.id, u]))
  const out = preferred.filter((id) => map[id]).map((id) => ({ id, name: map[id].name }))
  for (const u of Object.values(users)) {
    if (!out.find((p) => p.id === u.id)) out.push({ id: u.id, name: u.name })
  }
  return out
}

/** Upcoming fixtures with near-insulting challenge lines per player. */
export function buildUpcomingChallenges(allMatches, state, users, ymd, seed = 0) {
  const players = playerOrder(users)
  const now = new Date(`${ymd}T12:00:00+03:00`).getTime()
  const upcoming = allMatches
    .filter((m) => !resolveResult(state, m.id) && !m.timeTbd)
    .filter((m) => new Date(m.kickoff).getTime() >= now - 6 * 3600000)
    .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))
    .slice(0, 2)

  const season = buildSeasonTable(allMatches, state, users)
  const byId = Object.fromEntries(season.map((r) => [r.id, r]))
  const leader = season[0]
  const goat = season[season.length - 1]

  // Each entry is a distinct voice — never reuse the same template id in one edition
  const tauntBank = [
    (p, m) => `${p.name}… can you take the upcoming challenge??? ${m.label} δεν συγχωρεί κουρασμένους.`,
    (p, m) => `No prayer for the dying, ${p.name}! ${m.label} — θα χτυπήσεις ΚΑΝΕΝΑ;;;`,
    (p, m) => `More games to try for… ${p.name}, are you going to hit ANY??? Ή συνεχίζουμε με «σχεδόν»;`,
    (p, m) => `${p.name}: ${m.label} σε κοιτάει. Exact ή σιωπή!!!`,
    (p, m) => `Challenge accepted… ή όχι; ${p.name} vs ${m.label}. Το ιστορικό σου λέει «ίσως αύριο».`,
    (p, m) => `${p.name} — tips required. Courage optional. ${m.label} σε περιμένει…`,
    (p, m) => `Still breathing? Good. ${p.name}, ${compTag(m)} δεν είναι φιλικό. Ξύπνα!!!`,
    (p, m) => `${p.name}, το μπέργκερ μυρίζει… ${m.label} είναι η ευκαιρία. Μην τη χάσεις. Πάλι.`,
    (p, m) => `${p.name} στο ${m.label}: βάλε αριθμό ή πάρε εισιτήριο για την Ιερά Εξέταση!!!`,
    (p, m) => `Ώρα μηδέν για ${p.name}. ${m.label} δεν δέχεται «έτσι κι έτσι».`,
    (p, m) => `${p.name} — αν χάσεις και αυτό το ${compTag(m)}, το φύλλο γράφει ΝΤΟΝΑΤ με κεφαλαία.`,
    (p, m) => `Ψίθυρος από τον Κουβά: ${p.name}, ${m.label} είναι παγίδα. Ή παγιδεύεις εσύ.`,
    (p, m) => `${p.name} έχει ${byId[p.id]?.pts ?? 0}πτ συνολικά… ${m.label} θα προσθέσει δόξα ή ντροπή;`,
    (p, m) => `Μην κοιμάσαι, ${p.name}. ${m.label} ξεκινάει και τα tips δεν μπαίνουν μόνα τους!!!`,
    (p, m) => `${p.name} vs μοίρα: ${m.label}. Spoiler — η μοίρα διαβάζει το φύλλο.`,
  ]

  const crownBank = [
    (p, m, pts) => `${p.name} φοράει την κορώνα (${pts}πτ) — ${m.label} είναι η δοκιμασία του θρόνου!!!`,
    (p, m, pts) => `Leader alert: ${p.name} (${pts}πτ). ${m.label} θα σε κρατήσει πάνω ή θα σε ρίξει;`,
    (p, m, pts) => `${p.name} προηγείται… Prove it στο ${m.label} ή δώσε την καρέκλα!!!`,
  ]

  const digBank = [
    (p, m, pts) => `${p.name} στον πάτο (${pts}πτ). ${m.label}: last chance saloon. Hit κάτι!!!`,
    (p, m, pts) => `No prayer for the dying — εκτός αν ${p.name} ξυπνήσει στο ${m.label} (${pts}πτ).`,
    (p, m, pts) => `${p.name} (${pts}πτ) κυνηγάει το μπέργκερ. ${m.label} είναι το γκάζι ή το φρένο.`,
  ]

  const headlineBank = [
    (m) => `⏭ ΕΠΟΜΕΝΟ · ${m.label} — αντέχετε το βάρος;;;`,
    (m) => `ALARM!!! ${m.label} · tips ή χάος`,
    (m) => `THE FIXTURE FROM HELL… ${m.label}. Προφήτες στο εδώλιο!!!`,
    (m) => `${compTag(m)} CALLING… ${m.label}. Ποιος θα απαντήσει πρώτος;`,
    (m) => `ΣΤΟ ΜΑΤΙ · ${m.label}. Χωρίς έλεος, χωρίς επανάληψη.`,
    (m) => `ΚΛΕΙΔΩΣΕ TIP · ${m.label} πριν σε κλειδώσει ο Κουβάς!!!`,
  ]

  const usedTemplates = new Set() // 'taunt:3', 'crown:0', 'head:1', ...
  const usedFingerprints = new Set()
  const usedByPlayer = Object.fromEntries(players.map((p) => [p.id, new Set()]))

  function fingerprint(line, p, m) {
    return String(line || '')
      .replaceAll(p.name, '{P}')
      .replaceAll(m.label, '{M}')
      .replace(/\d+\s*πτ/gi, '{N}')
      .replace(/\d+/g, '{N}')
      .toLowerCase()
      .replace(/[^a-zα-ωάέήίόύώϊϋΐΰ0-9{}\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function takeFrom(bank, prefix, start, p, m, extraArgs = []) {
    for (let attempt = 0; attempt < bank.length; attempt++) {
      const idx = (start + attempt) % bank.length
      const tid = `${prefix}:${idx}`
      if (usedTemplates.has(tid)) continue
      const line = bank[idx](p, m, ...extraArgs)
      const fp = fingerprint(line, p, m)
      if (usedFingerprints.has(fp)) continue
      if (usedByPlayer[p.id]?.has(fp)) continue
      usedTemplates.add(tid)
      usedFingerprints.add(fp)
      usedByPlayer[p.id].add(fp)
      return line
    }
    // Absolute fallback — still unique via match id salt
    const line = `${p.name} · ${m.label} · slot ${prefix}${start}: βάλε tip ή σωπά!!!`
    const fp = fingerprint(line, p, m)
    usedFingerprints.add(fp)
    usedByPlayer[p.id].add(fp)
    return line
  }

  const cards = upcoming.map((m, i) => {
    const s = (seed + i * 97 + hashSeed(m.id)) >>> 0
    const tipsFiled = players.filter((p) => state.predictions?.[m.id]?.[p.id]).length

    // Unique headline template per card
    let headline = null
    for (let attempt = 0; attempt < headlineBank.length; attempt++) {
      const idx = (s + i * 5 + attempt) % headlineBank.length
      const tid = `head:${idx}`
      if (usedTemplates.has(tid)) continue
      usedTemplates.add(tid)
      headline = headlineBank[idx](m)
      break
    }
    if (!headline) headline = `⏭ ${m.label} — γύρος πρόκλησης ${i + 1}`

    const challenges = players.map((p, pi) => {
      const st = byId[p.id] || { pts: 0 }
      const start = s + pi * 17 + i * 11
      let line
      // Role lines: each crown/dig template used at most once in the whole edition
      if (leader && p.id === leader.id && leader.pts > 0) {
        line = takeFrom(crownBank, 'crown', start, p, m, [leader.pts])
      } else if (goat && p.id === goat.id && season.length > 1) {
        line = takeFrom(digBank, 'dig', start, p, m, [st.pts])
      } else {
        line = takeFrom(tauntBank, 'taunt', start, p, m)
      }
      return { id: p.id, name: p.name, line }
    })

    return {
      id: m.id,
      label: m.label,
      comp: compTag(m),
      when: formatKickShort(m.kickoff) + (m.timeTbd ? ' · TBA' : ''),
      tipCount: tipsFiled,
      tipNeed: players.length,
      headline,
      challenges,
    }
  })

  if (cards.length < 2) {
    const mystery = allMatches
      .filter((m) => !resolveResult(state, m.id) && m.timeTbd)
      .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))[0]
    if (mystery) {
      cards.push({
        id: mystery.id,
        label: mystery.label,
        comp: compTag(mystery),
        when: formatKickShort(mystery.kickoff) + ' · ώρα TBA',
        tipCount: players.filter((p) => state.predictions?.[mystery.id]?.[p.id]).length,
        tipNeed: players.length,
        headline: `❓ ΜΥΣΤΗΡΙΟ · ${mystery.label} — ούτε ώρα, μόνο πίεση`,
        challenges: players.map((p, pi) => ({
          id: p.id,
          name: p.name,
          line: takeFrom(tauntBank, 'taunt', seed + 200 + pi * 9, p, mystery),
        })),
      })
    }
  }

  return cards.slice(0, 2)
}

function pickCouple(arr, seed) {
  if (!arr?.length) return []
  if (arr.length <= 2) return arr.slice()
  const a = seed % arr.length
  let b = (seed >> 5) % arr.length
  if (b === a) b = (a + 1) % arr.length
  return [arr[a], arr[b]]
}

/** Διαγωνισμοί-style digest: oracle, lone wolf, H2H, campaigns, thavma. */
export function buildRivalryDigest(allMatches, state, users, seed = 0) {
  const players = playerOrder(users)
  const ids = players.map((p) => p.id)
  const nameOf = Object.fromEntries(players.map((p) => [p.id, p.name]))

  const oracle = Object.fromEntries(ids.map((id) => [id, 0]))
  const contrarian = Object.fromEntries(ids.map((id) => [id, 0]))
  const oneVsTwo = Object.fromEntries(ids.map((id) => [id, { wins: 0, losses: 0, battles: 0 }]))
  const h2h = {}
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      h2h[`${ids[i]}_${ids[j]}`] = {
        a: ids[i],
        b: ids[j],
        names: [nameOf[ids[i]], nameOf[ids[j]]],
        wins: [0, 0, 0],
        diff: 0,
      }
    }
  }

  const played = allMatches.filter((m) => resolveResult(state, m.id))
  for (const match of played) {
    const actual = resolveResult(state, match.id)
    const preds = ids.map((id) => state.predictions?.[match.id]?.[id])
    if (preds.some((p) => !p)) continue
    const scores = ids.map((id, i) =>
      scorePlayerMatchWorker(match, preds[i], actual, state.predictions || {}, id),
    )
    const pts = scores.map((s) => s?.points ?? 0)
    const res3 = preds.map((pr) => (pr.h > pr.a ? 'H' : pr.h < pr.a ? 'A' : 'D'))

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const key = `${ids[i]}_${ids[j]}`
        if (res3[i] !== res3[j]) {
          h2h[key].diff++
          if (pts[i] > pts[j]) h2h[key].wins[0]++
          else if (pts[j] > pts[i]) h2h[key].wins[1]++
          else h2h[key].wins[2]++
        }
      }
    }

    const exactPs = ids.filter((_, i) => scores[i]?.exact)
    if (exactPs.length === 1) oracle[exactPs[0]]++

    ids.forEach((id, i) => {
      const others = ids.filter((_, j) => j !== i)
      const otherRes = others.map((oid) => {
        const op = state.predictions?.[match.id]?.[oid]
        return op ? (op.h > op.a ? 'H' : op.h < op.a ? 'A' : 'D') : null
      })
      if (otherRes[0] && otherRes.every((r) => r === otherRes[0]) && res3[i] !== otherRes[0]) {
        contrarian[id]++
        const myPts = pts[i]
        const theirPts = Math.max(...others.map((oid) => pts[ids.indexOf(oid)]))
        oneVsTwo[id].battles++
        if (myPts > theirPts) oneVsTwo[id].wins++
        else if (myPts < theirPts) oneVsTwo[id].losses++
      }
    })
  }

  const campaigns = [
    { id: 'UEL', name: 'Europa League', match: (m) => compTag(m) === 'UEL' },
    { id: 'UECL', name: 'Conference', match: (m) => compTag(m) === 'UECL' },
    { id: 'UCL', name: 'Champions League', match: (m) => compTag(m) === 'UCL' },
    { id: 'SL', name: 'Super League', match: (m) => compTag(m) === 'SL' },
  ].map((c) => {
    const ms = allMatches.filter(c.match)
    const done = ms.filter((m) => resolveResult(state, m.id))
    const left = ms.length - done.length
    const pts = Object.fromEntries(ids.map((id) => [id, 0]))
    for (const m of done) {
      const actual = resolveResult(state, m.id)
      for (const id of ids) {
        const sc = scorePlayerMatchWorker(
          m,
          state.predictions?.[m.id]?.[id],
          actual,
          state.predictions || {},
          id,
        )
        pts[id] += sc?.points ?? 0
      }
    }
    const next = ms
      .filter((m) => !resolveResult(state, m.id))
      .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))[0]
    return {
      id: c.id,
      name: c.name,
      played: done.length,
      total: ms.length,
      left,
      pts,
      next: next ? next.label : null,
    }
  })

  const oLdr = ids.reduce((a, b) => (oracle[a] >= oracle[b] ? a : b))
  const cLdr = ids.reduce((a, b) => (contrarian[a] >= contrarian[b] ? a : b))

  const thavma = {}
  for (const id of ids) {
    const ts = state.thavmaStats?.[id] || { benefited: 0, pts_gained: 0, pts_lost: {} }
    const lost = Object.values(ts.pts_lost || {}).reduce((a, b) => a + b, 0)
    thavma[id] = {
      name: nameOf[id],
      benefited: ts.benefited || 0,
      gained: ts.pts_gained || 0,
      lost,
    }
  }

  const straps = []
  if (oracle[oLdr] > 0) {
    straps.push(
      `🔮 ORACLE: ${nameOf[oLdr]} μόνος exact ${oracle[oLdr]}×… οι άλλοι κοιτούσαν το ταβάνι!!!`,
    )
  }
  if (contrarian[cLdr] > 0) {
    const st = oneVsTwo[cLdr]
    const pct = st.battles ? Math.round((st.wins / st.battles) * 100) : 0
    straps.push(
      `🐺 LONE WOLF: ${nameOf[cLdr]} κόντρα στους δύο (${st.wins}W/${st.losses}L · ${pct}%). Can you take isolation???`,
    )
  }
  for (const row of Object.values(h2h)) {
    if (!row.diff) continue
    const lead =
      row.wins[0] === row.wins[1]
        ? 'ισοπαλία δηλητηρίου'
        : row.wins[0] > row.wins[1]
          ? `${row.names[0]} δαγκώνει`
          : `${row.names[1]} δαγκώνει`
    straps.push(
      `⚔️ ${row.names[0]} vs ${row.names[1]}: ${row.wins[0]}–${row.wins[1]} (${row.diff} διαφωνίες) — ${lead}!!!`,
    )
  }
  for (const c of campaigns) {
    if (!c.total) continue
    const ranked = ids.slice().sort((a, b) => c.pts[b] - c.pts[a])
    const top = ranked[0]
    straps.push(
      `${c.id}: ${nameOf[top]} ${c.pts[top]}πτ · ${c.played}/${c.total} · μένουν ${c.left}${c.next ? ` · next: ${c.next}` : ''}`,
    )
  }
  for (const id of ids) {
    const t = thavma[id]
    if (t.gained || t.lost) {
      straps.push(
        `🙏 ΘΑΥΜΑ ${t.name}: +${t.gained}p late · −${t.lost}p κλεμμένα. No prayer for the dying… εκτός αν μπει μετά το 85'!!!`,
      )
    }
  }

  // Random couple only — not the whole Διαγωνισμός dump
  const liveCampaigns = campaigns.filter((c) => c.total > 0)
  return {
    oracle,
    contrarian,
    oneVsTwo,
    h2h: Object.values(h2h),
    campaigns: pickCouple(liveCampaigns, seed >> 3),
    thavma,
    straps: pickCouple(straps, seed >> 7),
    players,
  }
}


function pickMyth(seed, names) {
  const myths = [
    `Κάπου στον Όλυμπο, ο Ερμής έκλεψε τα tips του Απόλλωνα... κι ο Δίας γέλασε τόσο δυνατά που έπεσε κεραυνός στο Καραϊσκάκη. Οι θνητοί — ${names} — ακόμα ψάχνουν το σκορ στα σύννεφα!`,
    `Λένε πως η Κασσάνδρα προέβλεψε 2–1... κανείς δεν την άκουσε. Απόψε, στον Κουβά, η ιστορία επαναλαμβάνεται. Μόνο που αυτή τη φορά... το μαντείο φοράει κίτρινα γυαλιά και φωνάζει «ΝΤΟΝΑΤ!!!»`,
    `Ο Σίσυφος κυλάει έναν μπέργκερ στην ανηφόρα. Κάθε φορά που φτάνει στην κορυφή... κάποιος από τους ${names} προβλέπει ισοπαλία. Ο βράχος κυλάει πίσω. Για πάντα.`,
    `Η Πανδώρα άνοιξε το κουτί. Μέσα: λάθος ακριβή σκορ, false 9, και ένα φύλλο εφημερίδας που λέει «...αύριο θα τα πιάσουμε». Οι θεοί ακόμα κλαίνε από τα γέλια.`,
    `Ο Ικάρος πέταξε κοντά στον ήλιο με φτερά από προβλέψεις. Λιώσανε. Έπεσε. Κάτω τον περίμενε ο Μινώταυρος με ταμπέλα: «ΧΩΡΙΣ ΠΡΟΒΛΕΨΗ». Τέλος; Όχι ακόμα...`,
    `Στην Τροία, ο Δούρειος Ίππος μπήκε με σκορ 0–0 στο ημίχρονο. Μέσα; Προφήτες. Έξω; Η Ιερά Εξέταση. Το υπόλοιπο είναι... μυθολογία και πόντοι.`,
    `Ο Νάρκισσος κοιτούσε τη βαθμολογία στο νερό μέχρι που πνίγηκε από αυτοθαυμασμό. Η Ηχώ ακόμα επαναλαμβάνει: «exact... exact... exact...» — αλλά ποιος ακούει;`,
  ]
  return pickFrom(myths, seed >> 9)
}

/** Players who ate DQ (−1) for missing tips today. */
function collectDqOffenders(matchRows = []) {
  const map = new Map()
  for (const row of matchRows || []) {
    for (const pl of row.players || []) {
      if (!pl?.dq) continue
      const prev = map.get(pl.id) || { id: pl.id, name: pl.name, count: 0, matches: [] }
      prev.count += 1
      prev.matches.push(row.label || row.id)
      map.set(pl.id, prev)
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

/**
 * Extra-poison lines when someone blanked a tip AFTER WhatsApp reminders (30′ + 20′).
 * Named offenders (esp. Boikos / Chousiadas) get the full acid bath.
 */
function dqReminderPoison(offenders, seed = 0) {
  if (!offenders?.length) return null
  const names = offenders.map((o) => o.name)
  const list = names.join(' & ')
  const boikos = offenders.find((o) => o.id === 'boikos')
  const chous = offenders.find((o) => o.id === 'chousiadas')
  const duo = boikos && chous

  const yell = pickFrom(
    [
      'ΑΠΟΥΣΙΕΣ!!!',
      'ΚΩΦΕΥΣΑΝ!!!',
      'ΔΥΟ ΥΠΕΝΘΥΜΙΣΕΙΣ!!!',
      'DQ ΔΗΛΗΤΗΡΙΟ!!!',
      'ΤΙΠΟΤΑ ΣΤΟ SLOT!!!',
    ],
    seed,
  )

  const splash = duo
    ? pickFrom(
        [
          `CHOUSIADAS + BOIKOS · ΔΙΑΒΑΣΑΝ ΤΑ WA… ΚΑΙ ΧΑΣΜΟΥΡΗΘΗΚΑΝ`,
          `ΥΠΕΝΘΥΜΙΣΕΙΣ 30′ & 20′ · ΑΥΤΟΙ: ΑΓΝΟΙΑ ΟΛΥΜΠΙΑΚΟΥ ΕΠΙΠΕΔΟΥ`,
          `ΔΥΟ ΜΗΝΥΜΑΤΑ · ΜΗΔΕΝ TIPS · ΟΙ «ΠΡΟΦΗΤΕΣ» ΚΟΙΜΟΝΤΟΥΣΑΝ`,
        ],
        seed >> 2,
      )
    : pickFrom(
        [
          `${list.toUpperCase()} · ΥΠΕΝΘΥΜΙΣΤΗΚΕ · ΑΓΝΟΗΣΕ · DQ −1`,
          `ΤΟ WHATSAPP ΟΥΡΛΙΑΖΕ · ${list.toUpperCase()}… ΣΙΩΠΗ`,
          `${list.toUpperCase()} · 30′ · 20′ · ΚΑΙ ΜΕΤΑ… ΤΙΠΟΤΑ`,
        ],
        seed >> 2,
      )

  const quotePool = [
    `«${list}: δύο υπενθυμίσεις WhatsApp (30′ και 20′). Μηδέν tip. Ο Κουβάς δεν ξεχνάει. Ούτε συγχωρεί.»`,
    `«Δύο καμπάνες. Ένα άδειο slot. ${list} — όχι θύματα συστήματος. Αυτουργοί της απουσίας.»`,
    `«Το τηλέφωνο χτύπησε. Ξαναχτύπησε. ${list}… απουσίαζαν από το δικό τους πρωτάθλημα.»`,
    `«Υπενθύμιση ≠ διακόσμηση. Είναι κατηγορητήριο. Υπόδικοι: ${list}. Ποινή: DQ −1.»`,
  ]
  if (duo) {
    quotePool.push(
      `«Chousiadas και Boikos: το WhatsApp τους ικέτευε στις 30′ και στις 20′. Αυτοί; Ούτε κουμπί. Ούτε σκορ. Μόνο ντροπή.»`,
      `«Δύο «θρύλοι». Δύο υπενθυμίσεις. Μηδέν προβλέψεις. Chousiadas + Boikos — το δίδυμο της κώφωσης.»`,
      `«Αν το reminder ήταν κεραυνός, θα είχαν κάψει ήδη. Αλλά όχι — Chousiadas και Boikos το άφησαν να περάσει σαν spam.»`,
    )
  }
  if (boikos) {
    quotePool.push(
      `«Boikos — admin του χάους, αφεντικό των υπενθυμίσεων… και ο ίδιος άδειος στο tip. Η ειρωνεία αυτοκτόνησε.»`,
      `«Ο Boikos στέλνει τα WA στους άλλους. Στον εαυτό του; Mute. DQ −1 με υπογραφή.»`,
    )
  }
  if (chous) {
    quotePool.push(
      `«Chousiadas: «δεν χτύπησε». Χτύπησε δύο φορές. Στις 30′. Στις 20′. Το tip; Ακόμα στο συρτάρι.»`,
      `«Chousiadas είδε το μπλε τικ. Δεν είδε το σκορ. Ο Κουβάς είδε και τα δύο.»`,
    )
  }

  const straps = offenders.flatMap((o, i) => {
    const lines = [
      `⛔ DQ: ${o.name} άδειος στο tip (${o.matches.join(', ')}) — μετά από ΥΠΕΝΘΥΜΙΣΕΙΣ 30′ & 20′. Όχι ατύχημα. Επιλογή.`,
      `📱 ${o.name}: το WhatsApp παρακαλούσε. Αυτός… σιωπή. Αποτέλεσμα: ΑΠΟΚΛΕΙΣΜΟΣ −1. Ο Κουβάς χειροκροτεί ειρωνικά.`,
      `🔔 Δύο καμπάνες. Μηδέν πρόβλεψη. ${o.name} μπαίνει στο πάνθεον των κωφών προφητών.`,
    ]
    if (o.id === 'boikos') {
      lines.push(
        `👑 Boikos: έστησε τις υπενθυμίσεις… και μετά τις αγνόησε ο ίδιος. Admin energy · tip energy = 0. DQ −1.`,
        `🔴 Boikos, ο φύλακας του κουδουνιού: το κουδούνι χτύπησε· ο tip-master κοιμόταν. Ντροπή με στολή admin.`,
      )
    }
    if (o.id === 'chousiadas') {
      lines.push(
        `🟢 Chousiadas: δύο WA, μηδέν κουράγιο, πλήρες DQ. «Δεν είδα το μήνυμα» — κλασική δικαιολογία νεκροταφείου.`,
        `☠️ Chousiadas άφησε το tip να πεθάνει αγνοώντας 30′ και 20′. Ο Κουβάς του στέλνει λουλούδια. Μαύρα.`,
      )
    }
    return [pickFrom(lines, seed + i * 13 + o.name.length)]
  })

  if (duo) {
    straps.unshift(
      pickFrom(
        [
          `💀 ΕΙΔΙΚΗ ΕΚΔΟΣΗ: Chousiadas + Boikos — ΥΠΕΝΘΥΜΙΣΤΗΚΑΝ, ΑΓΝΟΗΣΑΝ, DQ. Το πρωτάθλημα παίχτηκε χωρίς αυτούς. Σωστά.`,
          `🚨 BREAKING: δύο reminders · δύο απουσίες · Chousiadas & Boikos στο εδώλιο. Μάρτυρας: το WhatsApp. Δικαστής: ο Κουβάς.`,
        ],
        seed >> 3,
      ),
    )
  }

  const amok = duo
    ? pickFrom(
        [
          `ΑΜΟΚ ΥΠΕΝΘΥΜΙΣΕΩΝ!!! Chousiadas & Boikos άδειασαν τα slots τους. Το WA έκλαιγε. Αυτοί όχι.`,
          `ΤΡΕΛΟΚΟΜΕΙΟ: οι υπενθυμίσεις δούλεψαν· τα tips όχι. Chousiadas + Boikos — πρωταθλητές απουσίας.`,
        ],
        seed >> 7,
      )
    : pickFrom(
        [
          `ΑΜΟΚ!!! ${list} άδειασαν tip μετά από δύο καμπάνες. Ο Κουβάς μετράει −1 και γελάει.`,
          `ΣΥΝΑΓΕΡΜΟΣ: υπενθυμίσεις στάλθηκαν. Tips δεν μπήκαν. Υπεύθυνοι: ${list}.`,
        ],
        seed >> 7,
      )

  return { yell, splash, quote: pickFrom(quotePool, seed >> 5), straps, amok, names: list, offenders }
}

/** Whisper-column: half-said plots, implications, equal dirt on all three. */
function buildRumors(ranking, seed = 0, dqOffenders = []) {
  const byId = Object.fromEntries((ranking || []).map((p) => [p.id, p]))
  const B = byId.boikos?.name || 'Boikos'
  const M = byId.mavromichalis?.name || 'Mavromichalis'
  const C = byId.chousiadas?.name || 'Chousiadas'
  const dqIds = new Set((dqOffenders || []).map((o) => o.id))
  const dqBoikos = dqIds.has('boikos')
  const dqChous = dqIds.has('chousiadas')

  const plotBank = [
    `Heard: ${C} + ${M}… coffee. Topic? Not coffee. Topic: ${B}.`,
    `${C} → ${M}: «θα τα πούμε». Μετά… τίποτα. Ύποπτο.`,
    `Δύο βλέμματα. Ένα στόχος. Το κόκκινο. Λένε για tips. Λένε…`,
    `${M} χαμογέλασε στο όνομα ${B}. ${C} όχι. Χειρότερο.`,
    `${C} & ${M} «συγκρίνουν σημειώσεις». Γιατί άραγε;`,
  ]
  if (dqBoikos && dqChous) {
    plotBank.unshift(
      `BREAKING whisper: ${C} + ${B} «δεν είδαν» τα WA… δύο φορές ο καθένας. Σύμπτωση; Ο Κουβάς λέει ΟΧΙ.`,
      `ΦΗΜΗ: ${C} & ${B} έκαναν mute στις υπενθυμίσεις και μετά… άδειο tip. Το μπέργκερ ήδη ψήνεται.`,
    )
  }

  const whispers = [
    // against Boikos (the plot)
    {
      from: C,
      about: B,
      line: pickFrom(
        dqBoikos
          ? [
              `${B}; δύο υπενθυμίσεις… μηδέν tip. Admin χωρίς πρόβλεψη. Κλασικό.`,
              `${B} έστησε το κουδούνι. Μετά το αγνόησε. DQ με υπογραφή.`,
              `Άκουσα: ο ${B} «δεν πρόλαβε». Πρόλαβε να διαβάσει το WA. Όχι να πατήσει submit.`,
              `${B}… «τυχαία» απουσία μετά από 30′ και 20′. Ναι. Τυχαία.`,
            ]
          : [`${B}; …ας πούμε ότι «προσπαθεί».`, `${B} — μεγάλα λόγια. Μικρά exact.`, `Άκουσα για ${B}. Δεν επαναλαμβάνω. Ακόμα.`, `${B}… «τυχαία». Ναι. Τυχαία.`],
        seed,
      ),
    },
    {
      from: M,
      about: B,
      line: pickFrom(
        dqBoikos
          ? [
              `${B} «δεν είδε» το μήνυμα. Δύο μηνύματα. Βολικό μέχρις DQ.`,
              `Ο ${B} στέλνει reminders στους άλλους. Στον εαυτό του; Σιγή νεκροταφείου.`,
              `${B} κοιμόταν ήρεμος όσο το WA ούρλιαζε. Εμείς ξυπνήσαμε. Αυτός DQ.`,
              `${B} μετράει πόντους… αρνητικούς. −1 με άρωμα υπενθύμισης.`,
            ]
          : [`${B}… «τυχερός». Έτσι είπαν. Εγώ; Χμμ.`, `Αν ο ${B} «δεν είδε» το μήνυμα… βολικό.`, `${B} κοιμάται ήρεμος. Εμείς ξυπνάμε.`, `${B} μετράει πόντους. Εμείς μετράμε… αυτόν.`],
        seed + 3,
      ),
    },
    // against Mavro
    { from: B, about: M, line: pickFrom([`${M}; κίτρινος… και λίγο θολός στα tips.`, `${M} «θα χτυπήσω». Μισή πρόταση. Μισή αλήθεια.`, `Λένε για ${M}. Εγώ χαμογελάω. Μόνο.`, `${M} και «συμμαχίες». Αστείο.`], seed + 7) },
    { from: C, about: M, line: pickFrom([`${M} — σύμμαχος; Ναι. Μέχρι το επόμενο exact.`, `${M} μου είπε κάτι για ${B}. Διέγραψε το μήνυμα.`, `Με τον ${M}… συνεννόηση. Όχι φιλία.`, `${M} χαμογελάει πολύ. Πολύ.`], seed + 11) },
    // against Chous
    {
      from: B,
      about: C,
      line: pickFrom(
        dqChous
          ? [
              `${C} πράσινος. Πολύ πράσινος. Και τελείως άδειος στο tip μετά από δύο WA.`,
              `${C} «δεν χτύπησε». Χτύπησε. Δύο φορές. DQ −1 λέει την αλήθεια.`,
              `Ο ${C} μετράει δικαιολογίες. Οι υπενθυμίσεις μετράνε ενοχές.`,
              `${C} λίγα λόγια. Καθόλου tips. Πολλή… απουσία.`,
            ]
          : [`${C} πράσινος. Πολύ πράσινος. Ύποπτα ήρεμος.`, `${C} «δεν ξέρω τίποτα». Κλασικό.`, `Ο ${C} μετράει πόντους. Και… φίλους;`, `${C} λίγα λόγια. Πολλές… συναντήσεις.`],
        seed + 13,
      ),
    },
    {
      from: M,
      about: C,
      line: pickFrom(
        dqChous
          ? [
              `${C} πρότεινε «κοινή γραμμή». Μετά άδειασε το δικό του tip. Γενναίο.`,
              `${C}… είδε το μπλε τικ στις 30′ και στις 20′. Submit; Ποτέ.`,
              `Άκουσα τον ${C}. Μετά δεν άκουσα tip. Μόνο DQ. Βολικό.`,
              `${C} είπε «όχι αμέλεια». Το WhatsApp κατέθεσε αντίθετα.`,
            ]
          : [`${C} πρότεινε «κοινή γραμμή». Ενάντια σε ποιον; Μάντεψε.`, `${C}… λίγα λόγια. Πολλές προθέσεις.`, `Άκουσα τον ${C}. Μετά δεν άκουσα τίποτα. Βολικό.`, `${C} είπε «όχι συνωμοσία». Είπε πολλά.`],
        seed + 17,
      ),
    },
  ]

  // Always include one plot rumor + one whisper per direction (equal dirt)
  const plot = pickFrom(plotBank, seed >> 2)
  const picked = []
  const usedFromAbout = new Set()
  for (let i = 0; i < whispers.length; i++) {
    const w = whispers[(seed + i * 5) % whispers.length]
    const key = `${w.from}->${w.about}`
    if (usedFromAbout.has(key)) continue
    usedFromAbout.add(key)
    picked.push(w)
    if (picked.length >= 6) break
  }

  return {
    plot,
    items: picked.slice(0, 6),
    disclaimer: 'ΦΗΜΕΣ · ανωνύμως · μισές αλήθειες · ο Κουβάς δεν επιβεβαιώνει… ούτε διαψεύδει.',
  }
}

/**
 * Forced frontpage copy for specific Athens edition dates.
 * Merged over procedural pickHeadlines() in buildEdition().
 */
export const EDITION_HEADLINE_OVERRIDES = {
  '2026-08-20': {
    yell: 'ΝΕΟ ΣΚΑΝΔΑΛΟ',
    splash: 'ΒΑΥΑΡΙΚΟΣ ΔΑΚΤΥΛΟΣ',
    kicker:
      'Προκαλεί την νοημοσύνη μας — τρεις μαγικοί πόντοι εμφανίζονται αντί για −3 βαθμούς ποινής.',
    quote:
      '«Βαυαρικός δάκτυλος προκαλεί την νοημοσύνη μας και τρεις μαγικοί πόντοι εμφανίζονται αντί για −3 βαθμούς ποινής.»',
    amok: 'ΑΜΟΚ: −3 ποινή… και ξαφνικά +3. Η διοργανώτρια αρχή σκύβει το κεφάλι.',
    frontTeasers: [
      'Even the rocks are laughing',
      'Νύχτα των κρυστάλλων',
      'Άλλη παιδί δεν έκανε μόνο η Μαριώ τον Γιάννη',
      'Νύχτα ντροπής για την διοργανώτρια αρχή',
      'O tempora o mores',
    ],
    straps: [
      'Even the rocks are laughing',
      'Νύχτα των κρυστάλλων',
      'Άλλη παιδί δεν έκανε μόνο η Μαριώ τον Γιάννη',
      'Νύχτα ντροπής για την διοργανώτρια αρχή',
      'O tempora o mores',
      'Play-off Leg 1 · ΟΦΗ 3–0 · ΠΑΟ 2–2 · ΠΑΟΚ 1–1 — οι πόντοι μετρήθηκαν. Η ντροπή έμεινε.',
    ],
  },
}

function applyEditionHeadlineOverrides(ymd, headlines) {
  const forced = EDITION_HEADLINE_OVERRIDES[ymd]
  if (!forced) return headlines
  return { ...headlines, ...forced }
}

function pickHeadlines(ranking, matchRows, round = 0, seasonRows = [], upcoming = [], rivalry = null) {
  if (!ranking.length || !matchRows.length) {
    return {
      yell: 'ΣΙΩΠΗ!!!',
      splash: 'ΤΙΠΟΤΑ...',
      kicker: 'Κανένας αγώνας. Κανένα δράμα. Αηδία απόλυτη.',
      quote: '«Ο Κουβάς» σήμερα... άδειος. Όπως και κάποιοι από σας.',
      straps: ['Οι συντάκτες πήγαν για σουβλάκι. Εσείς για ύπνο...'],
      captions: {},
      playerLines: [],
      amok: 'ΑΜΟΚ: Ακυρώθηκε λόγω πλήξης!!!',
      myth: 'Ο Όλυμπος έκλεισε για συντήρηση. Ελάτε αύριο. Ίσως.',
      page3Cap: 'ΚΟΡΙΤΣΙΑ ΤΗΣ ΗΜΕΡΑΣ · χωρίς tips, μόνο χάος',
      equalBilling: 'Boikos · Mavromichalis · Chousiadas — ίσο μερίδιο, ίσο δηλητήριο',
      rumors: buildRumors([], round || 0, []),
      frontTeasers: [
        '⚖️ ΙΣΗ ΚΑΛΥΨΗ: Boikos · Mavromichalis · Chousiadas',
        'FANS FRONT PAGE · ακόμα κι αν σήμερα είναι κενό… τα επόμενα σε κυνηγάνε!!!',
        ...(upcoming?.[0] ? [`⏭ Επόμενο: ${upcoming[0].label}`] : []),
      ].slice(0, 3),
    }
  }

  const hero = ranking[0]
  const goat = ranking[ranking.length - 1]
  const seed = hashSeed(`${ranking.map((p) => p.id + p.pts).join('|')}:${round}:mad`)
  const names = ranking.map((p) => p.name).join(', ')
  const tableSplash = ranking.map((p) => `${p.name.toUpperCase()} ${p.pts}`).join(' · ')
  const dqOffenders = collectDqOffenders(matchRows)
  const dqPoison = dqReminderPoison(dqOffenders, seed)
  const dqById = Object.fromEntries(dqOffenders.map((o) => [o.id, o]))

  const yellPool = [
    'ΤΡΕΛΑ!!!',
    'ΤΡΕΛΟΚΟΜΕΙΟ!!!',
    'ΔΑΓΚΩΝΕΙ...',
    'ΣΦΑΖΕΙ!!!',
    'ΒΟΗΘΕΙΑ!!!',
    'ΧΑΟΣ!!!',
    'ΔΗΛΗΤΗΡΙΟ...',
    'ΕΚΡΗΞΗ!!!',
    'ΜΑΤΩΜΕΝΟ!!!',
    'ΟΥΑΟΥ!!!',
  ]
  // When tips were blanked after reminders, lead with the acid
  const yell = dqPoison ? dqPoison.yell : yellPool[seed % yellPool.length]

  const splashPool = [
    tableSplash,
    `ΙΣΗ ΚΑΛΥΨΗ: ${names.toUpperCase()}`,
    `ΚΑΝΕΙΣ ΑΘΩΟΣ — ${ranking.map((p) => p.name.toUpperCase()).join(' / ')}`,
    `ΤΡΕΙΣ ΠΡΟΦΗΤΕΣ · ${ranking.map((p) => `${p.pts}ΠΤ`).join(' · ')}`,
  ]
  const splash = dqPoison ? dqPoison.splash : splashPool[(seed >> 4) % splashPool.length]

  const kickerBits = ranking.map((p, i) => {
    const medal = i === 0 ? '👑' : i === ranking.length - 1 ? '🍩' : '🌶️'
    const dqTag = dqById[p.id] ? ` · ${dqById[p.id].count}×DQ μετά από WA` : ''
    return `${medal} ${p.name} ${p.pts}πτ σήμερα${dqTag}`
  })
  const kicker = dqPoison
    ? `${kickerBits.join('  ·  ')} ...υπενθυμίσεις στάλθηκαν · tips ΟΧΙ!!!`
    : `${kickerBits.join('  ·  ')} ...και αύριο; Μυστήριο!!!`

  const quote = dqPoison
    ? dqPoison.quote
    : pickFrom(
        [
          `«${names}... τρεις προφήτες, μία κωμωδία, μηδέν έλεος.»`,
          `«Ο Κουβάς ψιθυρίζει: ${hero.name} γέλασε... ${goat.name} ακόμα μετράει τα λάθη!!!»`,
          `«Ίση μεταχείριση; Ναι. Ίσο δηλητήριο!!! ${names} — εξηγήστε τα tips. Τώρα.»`,
          `«Απόψε το τρελοκομείο άνοιξε νωρίς. Οι νοσοκόμες; Οι προβλέψεις σας...»`,
          `«Μην κοιτάς μόνο το σκορ. Κοίτα... ποιος έκλεισε τα μάτια και πάτησε «αποστολή».»`,
        ],
        seed >> 5,
      )

  // Straps: one spicy line per match — DQ no-shows get reminder poison
  const matchStraps = matchRows.map((row) => {
    const best = [...row.players].sort((a, b) => b.pts - a.pts)[0]
    const worst = [...row.players].sort((a, b) => a.pts - b.pts)[0]
    const dqs = (row.players || []).filter((p) => p.dq)
    if (dqs.length) {
      const dqNames = dqs.map((p) => p.name).join(' & ')
      const namedDuo =
        dqs.some((p) => p.id === 'boikos') && dqs.some((p) => p.id === 'chousiadas')
      return pickFrom(
        [
          `${row.label} ${row.score}: ${dqNames} ΑΠΟΥΣΙΑΣΑΝ από το tip — ΜΕΤΑ από υπενθυμίσεις 30′ & 20′. DQ −1. Χωρίς έλεος.`,
          `⛔ ${row.label}: το WA ούρλιαξε δύο φορές. ${dqNames}… κώφωση ολυμπιακού επιπέδου. ΑΠΟΚΛΕΙΣΜΟΣ.`,
          namedDuo
            ? `${row.label} ${row.score} — Chousiadas + Boikos: διάβασαν τις υπενθυμίσεις· ξέχασαν να υπάρχουν. Ο Κουβάς υπέγραψε DQ.`
            : `${row.label}: ${dqNames} άδειοι. Υπενθυμίσεις στάλθηκαν. Tips όχι. Ποινή: −1 και δημόσια διαπόμπευση.`,
          `${row.label} ${row.score}${row.qual ? ' →' + row.qual : ''}... ${best?.name || '—'} έπαιξε· ${dqNames} έκαναν ghost στο ίδιο τους το πρωτάθλημα!!!`,
        ],
        seed + row.id.length,
      )
    }
    return pickFrom(
      [
        `${row.label} ${row.score}${row.qual ? ' →' + row.qual : ''}... ${best.name} χαμογελά (+${best.pts}), ${worst.name} ήδη γράφει απολογία!!!`,
        `${row.label}: ${row.score}. Στη σκηνή του εγκλήματος; ${worst.name} με tip ${worst.tip}... Ουάου.`,
        `ΜΑΤΣ ${row.label} ${row.score} — και ξαφνικά... ${best.name} μοιάζει με μέντιουμ!!!`,
      ],
      seed + row.id.length,
    )
  })

  const seasonLeader = seasonRows[0]
  const seasonLast = seasonRows[seasonRows.length - 1]
  const seasonStrap =
    seasonLeader && seasonLast && seasonLeader.id !== seasonLast.id
      ? `ΓΕΝΙΚΗ ΒΑΘΜΟΛΟΓΙΑ: ${seasonLeader.name} μπροστά με ${seasonLeader.pts}πτ... ${seasonLast.name} κυνηγάει το μπέργκερ με ${seasonLast.pts}. Ακόμα δεν τελείωσε!!!`
      : null

  // Lead with reminder shame, then every match, then season
  const straps = [...(dqPoison?.straps || []), ...matchStraps, ...(seasonStrap ? [seasonStrap] : [])]

  const playerLines = ranking.map((p, i) => {
    const role = i === 0 ? 'ΗΜΕΡΑΣ' : i === ranking.length - 1 ? 'ΝΤΟΝΑΤ' : 'ΜΕΣΑΙΟΣ'
    const dq = dqById[p.id]
    if (dq) {
      const special =
        p.id === 'boikos'
          ? [
              `Boikos (${role}): ${dq.count}×DQ μετά από τις δικές του υπενθυμίσεις. Admin χωρίς tip. Ο Κουβάς χειροκροτεί… ειρωνικά.`,
              `Boikos — ${p.pts}πτ σήμερα, ${dq.count} άδειο slot. Το WA χτύπησε στις 30′ και στις 20′. Αυτός; Mute. Ντροπή με στολή.`,
            ]
          : p.id === 'chousiadas'
            ? [
                `Chousiadas (${role}): ${dq.count}×DQ. «Δεν χτύπησε» — χτύπησε δύο φορές. Το tip πέθανε μόνο του.`,
                `Chousiadas — ${p.pts}πτ, ${dq.count} ΑΠΟΚΛΕΙΣΜΟΣ. Μπλε τικ στις υπενθυμίσεις · μαύρο κενό στο σκορ.`,
              ]
            : []
      return pickFrom(
        [
          ...special,
          `${p.name} (${role}): ${p.pts}πτ · ${dq.count}×DQ μετά από WA 30′/20′... Ο Κουβάς σε είδε. Και σε κάρφωσε.`,
          `${p.name} — υπενθυμίστηκε, αγνόησε, αποκλείστηκε. ${dq.matches.join(', ')}. Χωρίς έλεος.`,
        ],
        seed + i * 17 + p.name.length,
      )
    }
    return pickFrom(
      [
        `${p.name} (${role}): ${p.pts}πτ, ${p.exact} exact, ${p.misses} άκυρα... Ο Κουβάς σε είδε. Και γέλασε.`,
        `${p.name} — ${p.pts} σήμερα. Ούτε άγιος, ούτε μάρτυρας. Απλά... εκτεθειμένος!!!`,
        `${p.name} στα ${p.pts}. Κράτα το για την Ιερά Εξέταση. Θα χρειαστείς μάρτυρες.`,
      ],
      seed + i * 17 + p.name.length,
    )
  })

  const captions = {}
  for (let i = 0; i < ranking.length; i++) {
    const p = ranking[i]
    const others = ranking
      .filter((x) => x.id !== p.id)
      .map((x) => x.name)
      .join(' & ')
    const dq = dqById[p.id]
    if (dq) {
      const tipperNames = ranking.filter((x) => x.id !== p.id && !dqById[x.id]).map((x) => x.name)
      const tipperLine = tipperNames.length
        ? `${tipperNames.join(' & ')} τουλάχιστον ${tipperNames.length === 1 ? 'πάτησε' : 'πάτησαν'} submit...`
        : `Κανείς δεν γλιτώνει από τη διαπόμπευση — ο Κουβάς έχει ονόματα.`
      captions[p.id] = pickFrom(
        [
          `${p.name} (${p.pts}πτ) — ${dq.count}×DQ παρά τις υπενθυμίσεις!!! ${tipperLine}`,
          p.id === 'boikos'
            ? `Boikos έκλεισε με ${p.pts} και ${dq.count} ΑΠΟΚΛΕΙΣΜΟ(ΥΣ). Έστησε το κουδούνι· μετά το αγνόησε. Ιστορία.`
            : p.id === 'chousiadas'
              ? `Chousiadas στα ${p.pts}: ${dq.count}× άδειο tip μετά από 30′ & 20′ WA. Η δικαιολογία πέθανε πριν το tip.`
              : `${p.name} (${p.pts}πτ) — αγνόησε δύο καμπάνες. Ο Κουβάς χρέωσε −1 και κράτησε αποδείξεις.`,
          `${p.name}: το WhatsApp ικέτευε. Αυτός όχι. DQ · δημόσια διαπόμπευση · τέλος συζήτησης.`,
        ],
        seed + i,
      )
      continue
    }
    if (i === 0) {
      captions[p.id] = pickFrom(
        [
          `${p.name} (${p.pts}πτ) — προσωρινός βασιλιάς!!! ${others} ήδη σχεδιάζουν εκδίκηση...`,
          `${p.name} έκλεψε τη μέρα με ${p.pts}. Μην καμαρώνεις· ο Κουβάς γράφει και αύριο!!!`,
          `${p.name} στην κορυφή (${p.pts})... Οι άλλοι τρώνε σκόνη. Προς το παρόν.`,
        ],
        seed + i,
      )
    } else if (i === ranking.length - 1) {
      captions[p.id] = pickFrom(
        [
          `${p.name} (${p.pts}πτ) — πάτος σήμερα!!! ${others} χαμογελούν. Το μπέργκερ σε περιμένει...`,
          `${p.name} στο μηδενικό κλίμα (${p.pts}). Ίση κάλυψη: ίση ντροπή!!!`,
          `${p.name} έκλεισε τελευταίος (${p.pts})... Ο Κουβάς δεν κάνει εξαιρέσεις. Ποτέ.`,
        ],
        seed + i,
      )
    } else {
      captions[p.id] = pickFrom(
        [
          `${p.name} (${p.pts}πτ) — μεσαία ζώνη. Ούτε δόξα, ούτε έλεος... απλά δράμα!!!`,
          `${p.name} στα ${p.pts}: γκριζάδα υψηλής εντάσεως. Ο Κουβάς σε καρφώνει κι εσένα.`,
          `${p.name} — ${p.pts}πτ. Ίσο μερίδιο πρωτοσέλιδου, ίσο μερίδιο ειρωνείας!!!`,
        ],
        seed + i,
      )
    }
  }

  const amok = dqPoison
    ? dqPoison.amok
    : pickFrom(
        [
          `ΑΜΟΚ!!! ${ranking.map((p) => `${p.name} ${p.pts}`).join(' · ')}. Κανείς δεν γλιτώνει απόψε...`,
          `ΤΡΕΛΟΚΟΜΕΙΟ ΑΝΟΙΧΤΟ: ${names}. Οι γιατροί παραιτήθηκαν. Μείνανε μόνο τα tips!!!`,
          `ΣΥΝΑΓΕΡΜΟΣ... ${hero.name} πανηγυρίζει, ${goat.name} μετράει. Ο Κουβάς πουλάει εισιτήρια.`,
        ],
        seed >> 11,
      )

  const glamNames = ['ΝΙΚΗ', 'ΑΦΡΟΔΙΤΗ', 'ΕΛΕΝΗ', 'ΙΡΙΣ', 'ΣΕΛΗΝΗ', 'ΚΛΕΙΩ']
  const page3Cap = pickFrom(
    [
      `PAGE 3 · ${pickFrom(glamNames, seed)} σε «ακριβές προβλέψεις»... εσείς; Ακόμα στο 0–0!!!`,
      `ΚΟΡΙΤΣΙΑ ΤΗΣ ΕΚΔΟΣΗΣ · πιο καυτά από τα tips σας. Και πιο ακριβή!!!`,
      `SPORTS ILLUSTRATED vibes · Ο Κουβάς δεν πουλάει μόνο σκορ... πουλάει και μάτια!!!`,
    ],
    seed >> 15,
  )

  // Equal billing: every player named with same energy — no starring one prophet
  const equalBilling = ranking
    .map((p, i) => {
      const tag = i === 0 ? 'ΗΜΕΡΑΣ' : i === ranking.length - 1 ? 'ΝΤΟΝΑΤ' : 'ΜΕΣΑΙΟΣ'
      const dq = dqById[p.id]
      const shame = dq ? ` · ${dq.count}×DQ` : ''
      return `${p.name} ${p.pts}πτ (${tag}${shame})`
    })
    .join(' · ')

  const frontTeasers = [
    `⚖️ ΙΣΗ ΚΑΛΥΨΗ: ${equalBilling}`,
    pickFrom(
      dqPoison
        ? [
            `⛔ DQ ΣΗΜΕΡΑ: ${dqPoison.names} — υπενθυμίσεις 30′/20′ στάλθηκαν · tips ΟΧΙ · ποινή −1!!!`,
            'FANS FRONT PAGE: διάβασε τις υπενθυμίσεις… ή μπες στο πρωτοσέλιδο ως ΑΠΟΥΣΙΑ!!!',
            dqOffenders.some((o) => o.id === 'boikos') && dqOffenders.some((o) => o.id === 'chousiadas')
              ? 'Chousiadas + Boikos: δύο WA, μηδέν κουράγιο, πλήρες δηλητήριο. Welcome to the madhouse.'
              : 'Αν αγνόησες το reminder — αυτό το φύλλο είναι η καταδίκη σου!!!',
          ]
        : [
            'FANS FRONT PAGE: διάβασε, θύμωσε, βάλε tip — ή μείνε ΝΤΟΝΑΤ!!!',
            'Το φύλλο των φιλάθλων… όχι των ευγενών. Welcome to the madhouse.',
            'Αν δεν σε έθιξε αυτό το φύλλο — δεν διάβασες αρκετά!!!',
            'Μέσα: λίγα ματς μπροστά, λίγοι διαγκωνισμοί, μηδέν επανάληψη. Πάμε.',
          ],
      seed >> 17,
    ),
  ]
  if (upcoming?.length) {
    frontTeasers.push(`⏭ Επόμενο στο ραντάρ: ${upcoming[0].label} — λεπτομέρειες κάτω, όχι εδώ.`)
  }
  return {
    yell,
    splash,
    kicker,
    quote,
    straps,
    captions,
    playerLines,
    amok,
    myth: pickMyth(seed, names),
    page3Cap,
    equalBilling,
    rumors: buildRumors(ranking, seed, dqOffenders),
    frontTeasers: frontTeasers.slice(0, 3),
    dqOffenders,
  }
}

export function buildEdition(ymd, allMatches, state, users, opts = {}) {
  const round = opts.round ?? 0
  const dayMatches = matchesForDate(allMatches, ymd)
  const finished = dayMatches.filter((m) => resolveResult(state, m.id))
  const ledger = buildDayLedger(finished, state, users)
  const seasonRows = buildSeasonTable(allMatches, state, users)
  const timeline = buildCompetitionTimeline(allMatches, state, users)
  const seed = hashSeed(`${ymd}:fans:${round}`)
  const upcoming = buildUpcomingChallenges(allMatches, state, users, ymd, seed)
  const rivalry = buildRivalryDigest(allMatches, state, users, seed)
  const headlines = applyEditionHeadlineOverrides(
    ymd,
    pickHeadlines(ledger.ranking, ledger.matchRows, round, seasonRows, upcoming, rivalry),
  )
  const visuals = pickVisuals(ymd, round)
  const editionDate = formatEditionDate(ymd)
  const apiBase = opts.apiBase || 'https://kouvadeiros-api.jboikos.workers.dev'
  const pageUrl = `${apiBase}/newspaper?date=${ymd}&r=${round}`
  const html = renderHtml({
    ymd,
    editionDate,
    headlines,
    ledger,
    seasonRows,
    timeline,
    upcoming,
    rivalry,
    visuals,
    apiBase,
    unfinished: dayMatches.length - finished.length,
  })
  const waText = renderWhatsApp({
    editionDate,
    headlines,
    ledger,
    seasonRows,
    upcoming,
    rivalry,
    round,
    pageUrl,
  })
  return {
    ymd,
    editionDate,
    matchCount: finished.length,
    pending: dayMatches.length - finished.length,
    headlines,
    ranking: ledger.ranking,
    seasonRows,
    matchRows: ledger.matchRows,
    upcoming,
    rivalry,
    visuals,
    round,
    html,
    waText,
  }
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderHtml({ ymd, editionDate, headlines, ledger, seasonRows, timeline, upcoming = [], rivalry = null, visuals, unfinished, apiBase }) {
  const heroP = ledger.ranking[0]
  const goat = ledger.ranking[ledger.ranking.length - 1]
  const round = visuals?.round || 0

  const dayTable = ledger.ranking
    .map(
      (p, i) =>
        `<tr class="${i === 0 ? 'top' : i === ledger.ranking.length - 1 ? 'bot' : ''}"><td>${i + 1}</td><td>${esc(p.name)}</td><td class="pts">${p.pts}</td><td>${p.exact}</td></tr>`,
    )
    .join('')

  const fullTable = (seasonRows || [])
    .map(
      (p, i) =>
        `<tr class="${i === 0 ? 'top' : i === seasonRows.length - 1 ? 'bot' : ''}"><td>${i + 1}</td><td>${esc(p.name)}</td><td class="pts">${p.pts}</td><td>${p.exact}</td><td>${p.correct}</td><td>${p.dayWins}</td><td>${p.played}</td></tr>`,
    )
    .join('')

  const results = ledger.matchRows
    .map((m) => {
      const tips = m.players
        .map((pl) => {
          if (pl.dq) {
            return `<div class="tip dq"><b>${esc(pl.name)}</b> ΑΠΟΚΛΕΙΣΜΟΣ −1 <span>DQ</span><em>υπενθυμίσεις 30′+20′ · tip: ΚΕΝΟ</em></div>`
          }
          return `<div class="tip ${pl.pts === 0 ? 'miss' : pl.exact ? 'hit' : ''}"><b>${esc(pl.name)}</b> ${esc(pl.tip)} <span>+${pl.pts}</span></div>`
        })
        .join('')
      return `<div class="result"><div class="scoreline">${esc(m.label)} <strong>${esc(m.score)}</strong>${m.qual ? ` · ${esc(m.qual)}` : ''}</div>${tips}</div>`
    })
    .join('')

  const roasts = ledger.ranking
    .map((p) => `<p class="roast"><span class="name">${esc(p.name).toUpperCase()}</span> ${esc(headlines.captions[p.id] || '')}</p>`)
    .join('')

  const straps = (headlines.straps || []).map((s) => `<li>${esc(s)}</li>`).join('')
  const graphSvg = buildCompetitionSvg(timeline)

  const media = (slot) => `${apiBase}/newspaper-media?date=${encodeURIComponent(ymd)}&slot=${slot}&r=${round}`
  const heroImg = media('hero')
  const kingImg = media('king')
  const donutImg = media('donut')
  const page3Hero = media('page3')
  const glamImgs = [0, 1, 2].map((i) => media(`glam${i}`))
  const laughImg = media('laugh')

  const glamCaps = [
    'Cover energy · μη συγκρίνεις με τα tips σου',
    'Πιο καυτή από exact score...',
    'Αν τα tips σου ήταν έτσι!!!',
  ]

  const frontList = (headlines.frontTeasers || [])
    .map((s) => `<li>${esc(s)}</li>`)
    .join('')

  const upcomingHtml = (upcoming || [])
    .map((card) => {
      const ch = (card.challenges || [])
        .map(
          (c) =>
            `<p class="challenge"><span class="cname" style="color:${PLAYER_COLORS[c.id] || '#e30613'}">${esc(c.name).toUpperCase()}</span> ${esc(c.line)}</p>`,
        )
        .join('')
      return `<article class="fix-card">
        <div class="fix-head"><span class="comp">${esc(card.comp)}</span> ${esc(card.headline)}</div>
        <div class="fix-meta">${esc(card.when)} · tips ${card.tipCount}/${card.tipNeed}</div>
        ${ch}
      </article>`
    })
    .join('')

  const campaignHtml = (rivalry?.campaigns || [])
    .filter((c) => c.total > 0)
    .map((c) => {
      const ranked = (rivalry.players || [])
        .slice()
        .sort((a, b) => (c.pts[b.id] || 0) - (c.pts[a.id] || 0))
      const cells = ranked
        .map((p) => {
          const col = PLAYER_COLORS[p.id] || '#111'
          return `<div class="camp-cell"><b style="color:${col}">${esc(p.name)}</b><span>${c.pts[p.id] || 0}p</span></div>`
        })
        .join('')
      return `<div class="camp">
        <div class="camp-title">${esc(c.id)} · ${esc(c.name)} <small>${c.played}/${c.total} · μένουν ${c.left}</small></div>
        ${c.next ? `<div class="camp-next">⏭ ${esc(c.next)}</div>` : ''}
        <div class="camp-row">${cells}</div>
      </div>`
    })
    .join('')

  const rivalryList = (rivalry?.straps || []).map((s) => `<li>${esc(s)}</li>`).join('')

  const rumors = headlines.rumors || buildRumors(ledger.ranking || [], round)
  const rumorItems = (rumors.items || [])
    .map(
      (r) =>
        `<p class="rumor"><span class="who">${esc(r.from)} · για ${esc(r.about)}…</span>${esc(r.line)} <span class="dots">…</span></p>`,
    )
    .join('')
  const rumorsHtml = `<section class="rumors">
      <h2>🤫 Rumors / Φήμες</h2>
      <div class="rumor-plot">${esc(rumors.plot || '')}</div>
      ${rumorItems}
      <p class="credit">${esc(rumors.disclaimer || '')}</p>
    </section>`


  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Ο Κουβάς — ${esc(ymd)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Oswald:wght@500;700&family=Roboto+Condensed:ital,wght@0,700;0,900;1,700&display=swap');
  :root { --red:#e30613; --yell:#ffe600; --ink:#0a0a0a; --paper:#fff; }
  * { box-sizing: border-box; }
  body { margin:0; background:#111; color:var(--ink); font-family:'Roboto Condensed',Arial,sans-serif; }
  .page {
    max-width: 720px; margin: 0 auto; background: var(--paper);
    min-height: 100vh; overflow: hidden;
    box-shadow: 0 0 50px rgba(0,0,0,.6);
  }
  .mast {
    background: var(--red); color: #fff;
    display: grid; grid-template-columns: 56px 1fr 56px;
    align-items: center; padding: 8px 10px 6px;
    border-bottom: 3px solid #000;
  }
  .mast .meta { font-size: 9px; font-weight: 900; line-height: 1.25; text-transform: uppercase; }
  .mast .brand {
    font-family: 'Archivo Black', Impact, sans-serif;
    font-size: clamp(34px, 10vw, 52px); letter-spacing: -0.03em;
    line-height: .85; text-align: center; text-transform: uppercase;
    text-shadow: 2px 2px 0 #7a0008;
  }
  .mast .brand span { display:block; font-size: .38em; letter-spacing: .12em; opacity: .95; font-family: Oswald, sans-serif; }
  .barcode {
    width: 42px; height: 28px; margin-left: auto;
    background: repeating-linear-gradient(90deg,#000 0 2px,#fff 2px 3px,#000 3px 4px,#fff 4px 6px);
    border: 1px solid #000;
  }
  .datebar {
    display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap;
    padding: 5px 12px; background:#000; color:#fff;
    font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .04em;
  }
  .hero {
    display: grid; grid-template-columns: 1.05fr .95fr; gap: 0;
    border-bottom: 4px solid #000; min-height: 300px;
  }
  @media (max-width:560px){ .hero { grid-template-columns:1fr; } }
  .hero-copy { padding: 14px 12px 18px; position: relative; background:#f3f3f3; }
  .yell {
    display: inline-block;
    font-family: 'Oswald', Impact, sans-serif;
    font-size: clamp(28px, 8vw, 44px); font-weight: 700; font-style: italic;
    color: var(--yell); background: #000; padding: 2px 10px 4px;
    transform: rotate(-3deg); margin-bottom: 6px;
    text-shadow: 2px 2px 0 #000; border: 2px solid #000;
  }
  .splash {
    font-family: 'Anton', Impact, sans-serif;
    font-size: clamp(42px, 14vw, 78px); line-height: .85;
    color: var(--red); letter-spacing: -0.02em; text-transform: uppercase;
    -webkit-text-stroke: 2px #000;
    text-shadow: 4px 4px 0 #000; margin: 4px 0 8px;
  }
  .kicker {
    font-family: 'Oswald', sans-serif; font-weight: 700;
    font-size: clamp(14px, 3.5vw, 18px); line-height: 1.2;
    background: var(--yell); display: inline; padding: 2px 4px;
    box-decoration-break: clone; -webkit-box-decoration-break: clone;
  }
  .quote {
    margin-top: 12px; font-size: 14px; font-weight: 900; line-height: 1.25;
    border-left: 5px solid var(--red); padding-left: 10px;
  }
  .myth {
    margin: 0; padding: 14px 16px; background: #111; color: var(--yell);
    font-size: 14px; font-weight: 700; line-height: 1.45; font-style: italic;
    border-bottom: 4px solid #000;
  }
  .myth .tag {
    display:inline-block; background:var(--red); color:#fff; font-style:normal;
    font-size:10px; font-weight:900; padding:2px 8px; margin-bottom:8px;
    letter-spacing:.08em; text-transform:uppercase;
  }
  .hero-art {
    position: relative; min-height: 260px; overflow: hidden; background:#111;
  }
  .hero-art > img.bg {
    position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
    filter: saturate(1.15) contrast(1.05);
  }
  .hero-art::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(180deg, rgba(0,0,0,.15) 20%, rgba(0,0,0,.75) 100%),
      linear-gradient(90deg, rgba(227,6,19,.25), transparent 60%);
  }
  .avatars {
    position: absolute; z-index: 2; left: 12px; right: 12px; bottom: 14px;
    display:flex; gap: 12px; align-items: flex-end; justify-content: center;
  }
  .av-wrap { position: relative; text-align:center; }
  .av {
    width: 92px; height: 92px; border-radius: 50%;
    border: 4px solid #fff; box-shadow: 0 8px 0 #000;
    object-fit: cover; display:block; background:#333;
  }
  .av.win { width: 110px; height: 110px; border-color: var(--yell); }
  .av.lose { filter: grayscale(.85) brightness(.85); opacity: .95; }
  .av-wrap label {
    display:inline-block; margin-top: 6px;
    background: var(--yell); color:#000; font-size: 9px; font-weight: 900;
    padding: 2px 6px; border: 1px solid #000;
  }
  .av-wrap.lose-wrap label { background:#111; color:var(--yell); }
  .page3 {
    border-bottom: 4px solid #000;
  }
  .page3-hero {
    position:relative; min-height: 280px; overflow:hidden; background:#111;
  }
  .page3-hero img { width:100%; height:280px; object-fit:cover; object-position:center top; display:block; filter: saturate(1.2); }
  .page3-hero .ribbon {
    position:absolute; left:0; top:16px;
    background:var(--yell); color:#000; font-family:'Archivo Black',Impact,sans-serif;
    font-size:18px; padding:6px 14px; border:3px solid #000; transform:rotate(-2deg);
    box-shadow: 4px 4px 0 #000;
  }
  .page3-hero .cap {
    position:absolute; left:10px; right:10px; bottom:12px;
    background:rgba(0,0,0,.82); color:#fff; font-size:13px; font-weight:900;
    padding:10px 12px; border:2px solid var(--yell); line-height:1.3;
  }
  .tease-row {
    display:grid; grid-template-columns: 1fr 1fr 1fr; gap:0;
    border-bottom: 4px solid #000;
  }
  .tease {
    position:relative; min-height: 150px; overflow:hidden; border-right: 3px solid #000;
  }
  .tease:last-child { border-right: none; }
  .tease img { width:100%; height:100%; object-fit:cover; object-position:center top; min-height:150px; display:block; }
  .tease .tag {
    position:absolute; left:6px; right:6px; bottom:6px;
    background: var(--yell); color:#000; font-size:10px; font-weight:900;
    padding:4px 6px; border:2px solid #000; line-height:1.2; text-transform:uppercase;
  }
  .laugh-banner {
    display:grid; grid-template-columns: 1.2fr .8fr; border-bottom:4px solid #000;
  }
  @media (max-width:560px){
    .tease-row { grid-template-columns:1fr; }
    .tease { border-right:none; border-bottom:3px solid #000; }
    .laugh-banner { grid-template-columns:1fr; }
  }
  .laugh-banner img { width:100%; height:140px; object-fit:cover; display:block; }
  .laugh-copy {
    background:#000; color:var(--yell); padding:12px;
    font-family:'Archivo Black',Impact,sans-serif; font-size:15px; line-height:1.25;
    display:flex; align-items:center;
  }
  .block { padding: 14px 12px; border-bottom: 4px solid #000; }
  .block.alt { background:#f7f7f7; }
  h2 {
    font-family: 'Archivo Black', Impact, sans-serif;
    font-size: 13px; letter-spacing: .08em; margin: 0 0 10px;
    background: var(--red); color:#fff; display:inline-block; padding:3px 8px;
    text-transform: uppercase;
  }
  .straps { margin:0; padding-left: 16px; font-size: 13px; line-height: 1.4; font-weight:900; }
  .straps li { margin-bottom: 8px; }
  table { width:100%; border-collapse: collapse; font-size: 13px; font-weight:900; }
  th, td { border-bottom:2px solid #000; padding:7px 4px; text-align:left; }
  th { font-size:10px; letter-spacing:.08em; text-transform:uppercase; background:#000; color:#fff; }
  tr.top td { background: #ffe60055; }
  tr.bot td { background: #e3061322; }
  td.pts { font-family:'Anton',Impact,sans-serif; font-size:20px; color:var(--red); }
  .comp-graph { width:100%; height:auto; display:block; background:#fff; border:3px solid #000; }
  .graph-empty { padding:24px; text-align:center; font-weight:900; background:#111; color:var(--yell); border:3px solid #000; }
  .legend { display:flex; gap:12px; flex-wrap:wrap; margin-top:8px; font-size:11px; font-weight:900; }
  .legend span::before { content:''; display:inline-block; width:10px; height:10px; margin-right:5px; border-radius:50%; background:var(--c); border:1px solid #000; vertical-align:middle; }
  .split { display:grid; grid-template-columns: 1fr 1fr; gap:0; border-bottom:4px solid #000; }
  @media (max-width:560px){ .split { grid-template-columns:1fr; } }
  .col { padding: 12px; border-right: 3px solid #000; }
  .col:last-child { border-right: none; background: #fafafa; }
  @media (max-width:560px){ .col { border-right:none; border-bottom:3px solid #000; } }
  .result { margin-bottom: 10px; padding-bottom:8px; border-bottom:2px dashed #999; }
  .scoreline { font-weight:900; font-size:14px; margin-bottom:4px; }
  .tip { font-size:12px; display:flex; justify-content:space-between; gap:8px; padding:2px 0; font-weight:700; }
  .tip.miss { color:#9b0000; }
  .tip.hit { color:#0a5c2b; }
  .tip.dq { color:#666; background:#111; color:#ffe600; padding:4px 6px; border:2px solid #000; margin:3px 0; flex-wrap:wrap; }
  .tip.dq span { color:#e30613; }
  .tip.dq em { display:block; width:100%; font-size:10px; font-style:normal; color:#fff; opacity:.85; margin-top:2px; }
  .roast { font-size:13px; line-height:1.3; margin:0 0 10px; font-weight:700; }
  .roast .name { color:var(--red); font-weight:900; background: var(--yell); padding:0 3px; }
  .amok {
    margin: 12px auto; padding: 14px; border: 4px solid #000; border-radius: 50%;
    width: min(220px, 70vw); height: min(220px, 70vw);
    background: var(--red); color: var(--yell);
    display:flex; align-items:center; justify-content:center; text-align:center;
    font-family: 'Archivo Black', Impact, sans-serif; font-size: 14px; line-height: 1.25;
    box-shadow: 6px 6px 0 #000; transform: rotate(-4deg);
  }
  .footer {
    margin: 0; padding: 10px 14px; background:#000; color:#fff;
    font-size: 11px; font-weight:900; text-transform:uppercase;
    display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap;
  }
  .warn { background: var(--yell); color:#000; padding:8px 14px; font-size:12px; font-weight:900; border-bottom:3px solid #000; }
  .credit { font-size:9px; color:#666; margin-top:8px; font-weight:700; }

  .fans-rail {
    background: var(--yell); color:#000; padding:8px 12px; border-bottom:4px solid #000;
    font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:.04em;
  }
  .teaser-box { padding:12px; border-bottom:4px solid #000; background:#111; color:#fff; }
  .teaser-box h2 { background:var(--yell); color:#000; }
  .teaser-box .straps { color:#fff; }
  .teaser-box .straps li { color:#ffe600; }
  .fix-card {
    border:3px solid #000; margin:0 0 10px; padding:10px; background:#fff;
    box-shadow: 4px 4px 0 #000;
  }
  .fix-head { font-family:'Archivo Black',Impact,sans-serif; font-size:14px; line-height:1.25; margin-bottom:4px; }
  .fix-head .comp {
    display:inline-block; background:var(--red); color:#fff; padding:2px 6px; margin-right:6px;
    font-size:11px; transform:rotate(-2deg);
  }
  .fix-meta { font-size:11px; font-weight:900; color:#444; margin-bottom:8px; text-transform:uppercase; }
  .challenge { font-size:13px; font-weight:700; line-height:1.3; margin:0 0 8px; }
  .challenge .cname { background:var(--yell); padding:0 3px; }
  .camp {
    border:2px solid #000; padding:8px; margin-bottom:8px; background:#fff;
  }
  .camp-title { font-weight:900; font-size:13px; margin-bottom:4px; text-transform:uppercase; }
  .camp-title small { font-size:10px; color:#666; font-weight:700; }
  .camp-next { font-size:11px; font-weight:900; color:var(--red); margin-bottom:6px; }
  .camp-row { display:flex; gap:6px; flex-wrap:wrap; }
  .camp-cell {
    flex:1; min-width:80px; border:2px solid #000; padding:6px; text-align:center;
    font-size:11px; font-weight:900; background:#f3f3f3;
  }
  .camp-cell span { display:block; font-family:'Anton',Impact,sans-serif; font-size:20px; color:var(--red); }
  .rumors {
    padding: 14px 12px; border-bottom: 4px solid #000; background: #0a0a0a; color: #eee;
  }
  .rumors h2 { background: #111; color: var(--yell); border: 2px solid var(--yell); }
  .rumor-plot {
    font-family: 'Oswald', Impact, sans-serif; font-size: 15px; font-weight: 700;
    color: var(--yell); border-left: 4px solid var(--red); padding: 8px 10px; margin: 0 0 12px;
    background: #1a1a1a; font-style: italic;
  }
  .rumor {
    font-size: 13px; font-weight: 700; line-height: 1.35; margin: 0 0 10px;
    padding: 8px 10px; border: 1px dashed #444; background: #141414;
  }
  .rumor .who { color: var(--yell); font-size: 10px; letter-spacing: .06em; text-transform: uppercase; display:block; margin-bottom: 4px; }
  .rumor .dots { color: #888; }
  .rumors .credit { color: #666; }
</style>
</head>
<body>
  <article class="page">
    <header class="mast">
      <div class="meta">Φύλλο<br/>#${round + 1}<br/>1 🍔</div>
      <div class="brand">Ο Κουβάς<span>fans front page · τρελοκομείο · page 3</span></div>
      <div class="barcode" title="barcode"></div>
    </header>
    <div class="datebar">
      <span>${esc(editionDate)}</span>
      <span>FANS FRONT PAGE · ΓΥΡΟΣ ${round + 1} · ΜΟΝΟ ΓΙΑ ΦΙΛΑΘΛΟΥΣ</span>
    </div>
    ${unfinished ? `<div class="warn">${unfinished} αγώνες ακόμα ανοιχτοί — το δηλητήριο μπορεί να δυναμώσει!!!</div>` : ''}
    <section class="hero">
      <div class="hero-copy">
        <div class="yell">${esc(headlines.yell || 'ΤΡΕΛΑ!!!')}</div>
        <h1 class="splash">${esc(headlines.splash)}</h1>
        <div class="kicker">${esc(headlines.kicker)}</div>
        <p class="quote">${esc(headlines.quote)}</p>
      </div>
      <div class="hero-art">
        <img class="bg" src="${esc(heroImg)}" alt="stadium" loading="eager"/>
        <div class="avatars">
          <div class="av-wrap">
            <img class="av win" src="${esc(kingImg)}" alt="${esc(heroP?.name || 'king')}"/>
            <label>ΒΑΣΙΛΙΑΣ · ${esc(heroP?.name || '')}</label>
          </div>
          <div class="av-wrap lose-wrap">
            <img class="av lose" src="${esc(donutImg)}" alt="${esc(goat?.name || 'donut')}"/>
            <label>ΝΤΟΝΑΤ · ${esc(goat?.name || '')}</label>
          </div>
        </div>
      </div>
    </section>

    <aside class="myth">
      <div class="tag">Μύθος / Μεταφορά · άσχετο; Ίσως...</div>
      ${esc(headlines.myth || '')}
    </aside>

    <div class="fans-rail">⚽ FANS FRONT PAGE · tips · διαγκωνισμοί · upcoming insults · χωρίς έλεος</div>
    <div class="fans-rail" style="background:#000;color:var(--yell)">⚖️ ΙΣΗ ΚΑΛΥΨΗ · ${esc(headlines.equalBilling || (ledger.ranking || []).map((p) => p.name).join(' · '))}</div>
    ${frontList ? `<section class="teaser-box"><h2>ΣΤΟΠ · ΔΙΑΒΑΣΕ ΠΡΩΤΑ</h2><ul class="straps">${frontList}</ul></section>` : ''}

    <section class="block">
      <h2>Επόμενα · αντέχετε;;;</h2>
      ${upcomingHtml || '<p class="credit">Κανένα επερχόμενο ματς στο ραντάρ… ύποπτο!!!</p>'}
    </section>

    <section class="block alt">
      <h2>🌶️ Διαγκωνισμοί · από την εφαρμογή</h2>
      <ul class="straps">${rivalryList || '<li>Ακόμα λίγα δεδομένα… παίξτε κι άλλο!!!</li>'}</ul>
      <h2 style="margin-top:14px">Ενεργές διοργανώσεις</h2>
      ${campaignHtml || '<p class="credit">Καμπάνιες σε αναμονή.</p>'}
    </section>

    ${rumorsHtml}

    <section class="page3">
      <div class="page3-hero">
        <img src="${esc(page3Hero)}" alt="page3"/>
        <div class="ribbon">PAGE 3</div>
        <div class="cap">${esc(headlines.page3Cap || '')}</div>
      </div>
      <div class="tease-row">
        <div class="tease"><img src="${esc(glamImgs[0])}" alt="glam1"/><div class="tag">${esc(glamCaps[0])}</div></div>
        <div class="tease"><img src="${esc(glamImgs[1])}" alt="glam2"/><div class="tag">${esc(glamCaps[1])}</div></div>
        <div class="tease"><img src="${esc(glamImgs[2])}" alt="glam3"/><div class="tag">${esc(glamCaps[2])}</div></div>
      </div>
    </section>

    <div class="laugh-banner">
      <img src="${esc(laughImg)}" alt="laugh"/>
      <div class="laugh-copy">${esc(headlines.quote || 'Ο Κουβάς γελάει. Εσύ;')}</div>
    </div>

    <section class="block">
      <h2>Γράφημα ανταγωνισμού · προοδευτική βαθμολογία</h2>
      <p class="credit" style="margin:0 0 8px">Κάθε σημείο = αγώνας με επίσημο σκορ. Οι γραμμές δείχνουν την κούρσα από την αρχή της σεζόν μέχρι σήμερα.</p>
      ${graphSvg}
      <div class="legend">
        ${(timeline.players || [])
          .map((p) => `<span style="--c:${PLAYER_COLORS[p.id] || '#111'}">${esc(p.name)}</span>`)
          .join('')}
      </div>
    </section>

    <section class="block alt">
      <h2>Πλήρης βαθμολογία σεζόν</h2>
      <table>
        <thead><tr><th>#</th><th>Προφήτης</th><th>Πτ</th><th>X</th><th>✓</th><th>Ημ.</th><th>Αγ.</th></tr></thead>
        <tbody>${fullTable || '<tr><td colspan="7">Ακόμα άδειο... ύποπτο!!!</td></tr>'}</tbody>
      </table>
      <p class="credit">Πτ=πόντοι · X=exact · ✓=σωστό αποτέλεσμα · Ημ.=ημέρες στην κορυφή · Αγ.=αγώνες με tip</p>
    </section>

    <div class="split">
      <div class="col">
        <h2>ΜΕΣΑ · χωρίς επανάληψη</h2>
        <ul class="straps">${straps}</ul>
        <h2 style="margin-top:14px">Η ΕΞΟΝΤΩΣΗ</h2>
        ${roasts}
        <div class="amok">${esc(headlines.amok || '')}</div>
        <p class="credit">Φωτο: Unsplash · επεξεργασία Ο Κουβάς · 18+</p>
      </div>
      <div class="col">
        <h2>ΒΑΘΜΟΛΟΓΙΑ ΗΜΕΡΑΣ</h2>
        <table>
          <thead><tr><th>#</th><th>Προφήτης</th><th>Πτ</th><th>X</th></tr></thead>
          <tbody>${dayTable}</tbody>
        </table>
        <h2 style="margin-top:14px">ΑΠΟΤΕΛΕΣΜΑΤΑ</h2>
        ${results || '<p>Τίποτα ακόμα. Ύποπτο...</p>'}
      </div>
    </div>
    <footer class="footer">
      <span>Ακατάλληλο για ευαίσθητους · και για κακά tips</span>
      <span>kouvadeiros.pages.dev</span>
    </footer>
  </article>
</body>
</html>`
}

function renderWhatsApp({ editionDate, headlines, ledger, seasonRows, upcoming = [], rivalry = null, round = 0, pageUrl }) {
  const dayLine = ledger.ranking.map((p) => `${p.name} ${p.pts}`).join(' · ')
  const seasonLine = (seasonRows || [])
    .slice(0, 3)
    .map((p, i) => `${i + 1}.${p.name} ${p.pts}`)
    .join(' · ')

  const next = (upcoming || [])
    .slice(0, 2)
    .map((c) => {
      // Equal airtime: every player gets a dig — never only the first
      const jabs = (c.challenges || [])
        .map((ch) => `  • ${ch.name}: ${ch.line}`)
        .join('\n')
      return `⏭ *${c.label}* (${c.comp})\n${jabs || '_' + (c.headline || '') + '_'}`
    })
    .join('\n\n')

  const equalLine =
    (headlines.equalBilling || '') ||
    (ledger.ranking || []).map((p) => p.name).join(' · ')

  const dig = (rivalry?.straps || []).slice(0, 2).map((s) => `• ${s}`).join('\n')

  const rumors = headlines.rumors || {}
  const rumorBlock =
    rumors.plot || (rumors.items || []).length
      ? `*🤫 RUMORS*\n_${rumors.plot || ''}_\n` +
        (rumors.items || [])
          .slice(0, 4)
          .map((r) => `• ${r.from}→${r.about}: ${r.line}`)
          .join('\n') +
        '\n\n'
      : ''

  const dayResults = (ledger.matchRows || [])
    .map((m) => {
      const dqN = m.players.filter((p) => p.dq).length
      const tips = (m.players || [])
        .map((pl) => (pl.dq ? `${pl.name}=DQ−1 (αγνόησε WA)` : `${pl.name}+${pl.pts}`))
        .join(' · ')
      return `• ${m.label} ${m.score}${dqN ? ` · ${dqN} DQ` : ''}${tips ? `\n  ${tips}` : ''}`
    })
    .join('\n')

  const dayComments = (headlines.straps || [])
    .filter((s) => !(s || '').startsWith('ΓΕΝΙΚΗ'))
    .map((s) => `• ${s}`)
    .join('\n')

  const dqOff = headlines.dqOffenders || []
  const dqShame =
    dqOff.length
      ? `*⛔ DQ · ΑΓΝΟΗΣΑΝ ΤΙΣ ΥΠΕΝΘΥΜΙΣΕΙΣ (30′ + 20′)*\n` +
        dqOff
          .map((o) => {
            const venom =
              o.id === 'boikos'
                ? 'admin χωρίς tip — ειρωνεία αυτοκτονίας'
                : o.id === 'chousiadas'
                  ? '«δεν χτύπησε» ×2 — χτύπησε · tip ποτέ'
                  : 'δύο καμπάνες · μηδέν πρόβλεψη'
            return `• *${o.name}* ×${o.count} DQ — ${venom}\n  (${o.matches.join(', ')})`
          })
          .join('\n') +
        `\n\n`
      : ''

  return (
    `*Ο ΚΟΥΒΑΣ* · FANS FRONT PAGE · γύρος ${round + 1} !!!\n_${editionDate}_\n\n` +
    `*${headlines.yell || ''} ${headlines.splash}*\n` +
    `${headlines.kicker}\n\n` +
    `⚖️ *ΙΣΗ ΚΑΛΥΨΗ:* ${equalLine}\n\n` +
    `${headlines.quote}\n\n` +
    dqShame +
    rumorBlock +
    (dayResults ? `*ΑΠΟΤΕΛΕΣΜΑΤΑ ΗΜΕΡΑΣ*\n${dayResults}\n\n` : '') +
    (dayComments ? `*ΣΧΟΛΙΟ ΑΓΩΝΩΝ*\n${dayComments}\n\n` : '') +
    (next ? `*CAN YOU TAKE THE CHALLENGE???*\n${next}\n\n` : '') +
    (dig ? `*ΔΙΑΓΚΩΝΙΣΜΟΙ*\n${dig}\n\n` : '') +
    `*Σήμερα:* ${dayLine || '—'}\n` +
    `*Σεζόν:* ${seasonLine || '—'}\n\n` +
    `*${headlines.amok}*\n\n` +
    `📈 *Γράφημα ανταγωνισμού* (προοδευτική βαθμολογία) + PAGE 3 μέσα:\n${pageUrl}\n\n` +
    `_Άνοιξέ το. Το WhatsApp είναι μόνο η γροθιά — μέσα είναι το μαχαίρι..._`
  )
}

/** Issue Ο Κουβάς ~graceMin after the last game of the Athens day finishes. */
export function shouldSendNewspaper(allMatches, state, ymd, now = Date.now(), graceMin = 20) {
  const day = matchesForDate(allMatches, ymd)
  if (!day.length) return false
  const withResults = day.map((m) => ({ m, r: resolveResult(state, m.id) }))
  if (withResults.some((x) => !x.r)) return false

  // Prefer result.fetchedAt (≈ FT); else estimate FT ≈ kickoff + 100′
  const lastGameEnd = Math.max(
    ...withResults.map(({ m, r }) => {
      const ko = new Date(m.kickoff).getTime()
      const fetched = r?.fetchedAt ? Date.parse(r.fetchedAt) : NaN
      if (Number.isFinite(fetched) && fetched >= ko) return fetched
      return ko + 100 * 60000
    }),
  )
  return now >= lastGameEnd + graceMin * 60000
}

export function resolveMediaSlot(ymd, slot, round = 0) {
  const v = pickVisuals(ymd, round)
  if (slot === 'king') return v.king
  if (slot === 'donut') return v.donut
  if (slot === 'strip') return v.strip
  if (slot === 'laugh') return v.laugh
  if (slot === 'page3') return v.page3
  if (slot === 'glam0') return v.glam[0] || v.page3
  if (slot === 'glam1') return v.glam[1] || v.page3
  if (slot === 'glam2') return v.glam[2] || v.page3
  if (slot === 'roast0') return v.roast[0] || v.page3
  if (slot === 'roast1') return v.roast[1] || v.hero
  if (slot === 'roast2') return v.roast[2] || v.donut
  return v.hero
}
