// KOUVADEIROS Worker v8
// Reminders: 30' + 20' before kickoff · Lock/reveal: 15' before
// ΘΑΥΜΑ/ΩΣΑΝΑ late goal detection · Ο Κουβάς end-of-day tabloid

import {
  buildEdition,
  shouldSendNewspaper,
  athensDate,
  FALLBACK_RESULTS,
  resolveMediaSlot,
} from './newspaper.js'
import {
  ALL_FIXTURES,
  TEAMS,
  anyCloudOpsActivity,
  inCloudOpsWindow,
  CLOUD_BEFORE_MIN,
  CLOUD_AFTER_FT_MIN,
  CLOUD_MAX_AFTER_KO_MIN,
  applyKickoffOverrides,
  athensLocalToUtcIso,
  athensYmd,
  athensHm,
  applyTipResultLocks,
  mergeSeededPredictions,
} from '../src/lib/data.js'
import {
  pollGazzettaForMatches,
  getGazzettaHealth,
  setGazzettaHealth,
  gazzettaIsHealthy,
  fetchGazzettaKickoff,
} from './gazzetta.js'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}

const BASE_USERS = {
  'boikos.y@caredirect.com': { password: '1453', name: 'Boikos', id: 'boikos', role: 'admin' },
  'mavromichalis.y@caredirect.com': { password: '1821', name: 'Mavromichalis', id: 'mavromichalis', role: 'player' },
  'chousiadas.th@caredirect.com': { password: '1940', name: 'Chousiadas', id: 'chousiadas', role: 'player' },
}

/** Canonical WhatsApp numbers (merged into KV state.phones) */
const DEFAULT_PHONES = {
  boikos: '+306932377969',
  chousiadas: '+306932662864',
  mavromichalis: '+306932851343',
}

// ── DRAMA MESSAGE BANKS ───────────────────────────────────────────────────────
const THAVMA_LUCKY = [
  'Μην το πεις ούτε του παπά σου 🤫',
  'Πάλι τυχερός στάθηκες ρε συ, τι να πούμε 🍀',
  'Τι έπιασες πάλι ρε Γκαστόνε 😂',
  'Η τύχη σε αγαπάει αλλά δεν το παίρνεις χαμπάρι 🙈',
  'Αυτό δεν είναι ποδόσφαιρο, είναι αστρολογία 🔮',
  'Κερσάκι... και έγινε. Δεν αξίζεις ρε 😤',
  'Ούτε ο ίδιος δεν το περίμενες αυτό, μην λες ψέματα 😏',
  'Ο Θεός σε προστατεύει και δεν ξέρεις γιατί 🙏',
  'Απίστευτο. Αδύνατο. Και όμως... 🤯',
  'Αυτό θα το λες στα εγγόνια σου 👴',
]

const THAVMA_UNLUCKY = [
  'Πάλι τα ίδια ο κωλόφαρδος, δεν βαριέσαι 🤦',
  'Αηδία έχει καταντήσει πλέον, τι να πούμε 😒',
  'Ο τυχερός των τυχερών χτύπησε ξανά. Φυσιολογικά 🙄',
  'Να χαίρεσαι τον κωλόφαρδο. Εσύ δούλευες σωστά 💪',
  'Αυτός δεν κάνει προβλέψεις, κάνει ευχές 🧿',
  'Εσένα σε χαλάει η τύχη του, όχι η γνώση σου 🎯',
  'Κανονικά έπρεπε να το έχεις εσύ αυτό τον πόντο 😤',
  'Αυτή η ομάδα σκόραρε για να σε τρελάνει ειδικά 🤬',
  'Η ζωή δεν είναι δίκαιη. Και ο κωλόφαρδος το ξέρει 😂',
  'Ασχολήσου. Ούτε που πάει ο νους σου 🤷',
]

const OSANA_LUCKY = [
  'ΩΣΑΝΝΑ ΕΝ ΤΟΙΣ ΥΨΙΣΤΟΙΣ 🙌 Τι παθαίνουμε εδώ;',
  '90+... Ο Θεός υπάρχει και σε υποστηρίζει προσωπικά 🙏',
  'ΑΔΥΝΑΤΟΝ. Και όμως ΕΓΙΝΕ. Σε αγαπάει ο κόσμος 😱',
  'Injury time θαύμα. Καλύτερα να παίζεις λαχείο ρε φίλε 🎰',
  'Αυτό είναι αγύριστο. Στείλε ευχαριστήριο στον τερματοφύλακα 🧤',
  '90+ και βρήκες τον τρόπο. ΑΠΙΣΤΕΥΤΟ 🔥',
]

const OSANA_UNLUCKY = [
  'Αυτό που έγινε τώρα δεν έχει δικαιολογία. Καμία. 😤',
  'Injury time. Ε ρε γλυκιά ζωή για μερικούς... 🤦',
  'Τέτοια ατυχία δεν είναι τυχαία, είναι κατευθυνόμενη 🎯',
  '90+ λεπτά και σου έκλεψε τον πόντο. Πρέπει να το πληρώνεις 😂',
  'Αυτό το γκολ γράφτηκε από πριν. Εσύ απλώς δεν ήξερες 📖',
  'Να ζεις και να... βλέπεις τέτοια πράγματα. Αηδία 😒',
]

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function sumPtsLost(ptsLost) {
  if (typeof ptsLost === 'number') return ptsLost
  if (ptsLost && typeof ptsLost === 'object') {
    return Object.values(ptsLost).reduce((s, n) => s + (Number(n) || 0), 0)
  }
  return 0
}

/** One WA body per player for a late-goal event (Θαύμα ≥85′ / Ωσανά ≥90′). */
function buildDramaMessages(beneficiaries, allPlayers, matchLabel, newScore, minute, isOsana, thavmaStats) {
  const msgs = {}
  const type = isOsana ? 'ΩΣΑΝΑ 🙌' : 'ΘΑΥΜΑ ⚡'
  const lucky_pool = isOsana ? OSANA_LUCKY : THAVMA_LUCKY
  const unlucky_pool = isOsana ? OSANA_UNLUCKY : THAVMA_UNLUCKY
  const luckyIds = new Set(beneficiaries.map((b) => b.id))
  const luckyNames = beneficiaries.map((b) => b.name).join(' & ')

  for (const [pid] of Object.entries(allPlayers)) {
    const isLucky = luckyIds.has(pid)
    const stats = thavmaStats[pid] || { benefited: 0, pts_gained: 0, pts_lost: {} }

    if (isLucky) {
      const personalMsg = rand(lucky_pool)
      msgs[pid] =
        `${type} *${luckyNames}!*\n\n` +
        `⚽ *${matchLabel}* · ${newScore.h}–${newScore.a} (${minute}')\n\n` +
        `${personalMsg}\n\n` +
        `📊 Θαύματά σου φέτος: *${stats.benefited}* · Πόντοι από θαύματα: *${stats.pts_gained}*`
    } else {
      const rivalMsg = rand(unlucky_pool)
      const myLost = sumPtsLost(thavmaStats[pid]?.pts_lost)
      msgs[pid] =
        `${type} *${luckyNames}!*\n\n` +
        `⚽ *${matchLabel}* · ${newScore.h}–${newScore.a} (${minute}')\n\n` +
        `${rivalMsg}\n\n` +
        `📊 Πόντοι που σου έκλεψαν τα θαύματα φέτος: *${myLost}* 😤`
    }
  }
  return msgs
}

// ── MATCH SCHEDULE (synced with src/lib/data.js — Greek local → UTC, EEST=UTC+3) ──
const MATCHES = [
  { id: 'uel-paok-1', kickoff: '2026-07-23T17:00:00Z', label: 'Dynamo Kyiv vs ΠΑΟΚ', espnLeague: 'uefa.europa', homeTeam: 'Dynamo Kyiv', awayTeam: 'PAOK' },
  { id: 'uel-paok-2', kickoff: '2026-07-30T17:45:00Z', label: 'ΠΑΟΚ vs Dynamo Kyiv', espnLeague: 'uefa.europa', homeTeam: 'PAOK', awayTeam: 'Dynamo Kyiv' },
  { id: 'uecl-pao-1', kickoff: '2026-07-23T18:00:00Z', label: 'Paksi vs ΠΑΟ', espnLeague: 'uefa.europa.conf', homeTeam: 'Paksi FC', awayTeam: 'Panathinaikos' },
  { id: 'uecl-pao-2', kickoff: '2026-07-30T18:30:00Z', label: 'ΠΑΟ vs Paksi', espnLeague: 'uefa.europa.conf', homeTeam: 'Panathinaikos', awayTeam: 'Paksi FC' },
  // Ολυμπιακός–NEC Q3: Τρί 4/8 21:00 · Τρί 11/8 20:30 Ελλ.
  { id: 'ucl-oly-1', kickoff: '2026-08-04T18:00:00Z', label: 'ΟΛΥ vs NEC', espnLeague: 'uefa.champions', homeTeam: 'Olympiacos', awayTeam: 'NEC Nijmegen' },
  { id: 'ucl-oly-2', kickoff: '2026-08-11T17:30:00Z', label: 'NEC vs ΟΛΥ', espnLeague: 'uefa.champions', homeTeam: 'NEC Nijmegen', awayTeam: 'Olympiacos' },
  // Παναθηναϊκός–ΤΣΣΚΑ 1948 Q3: Τετ 5/8 21:30 · Τρί 11/8 20:30 Ελλ.
  { id: 'uecl-pao-3', kickoff: '2026-08-05T18:30:00Z', label: 'ΠΑΟ vs CSKA 1948', espnLeague: 'uefa.europa.conf', homeTeam: 'Panathinaikos', awayTeam: 'CSKA 1948' },
  { id: 'uecl-pao-4', kickoff: '2026-08-11T17:30:00Z', label: 'CSKA 1948 vs ΠΑΟ', espnLeague: 'uefa.europa.conf', homeTeam: 'CSKA 1948', awayTeam: 'Panathinaikos' },
  // ΠΑΟΚ–Άντερλεχτ Q3: Πέμ 6/8 20:45 · Πέμ 13/8 21:30
  { id: 'uel-paok-3', kickoff: '2026-08-06T17:45:00Z', label: 'ΠΑΟΚ vs Άντερλεχτ', espnLeague: 'uefa.europa', homeTeam: 'PAOK', awayTeam: 'Anderlecht' },
  { id: 'uel-paok-4', kickoff: '2026-08-13T18:30:00Z', label: 'Άντερλεχτ vs ΠΑΟΚ', espnLeague: 'uefa.europa', homeTeam: 'Anderlecht', awayTeam: 'PAOK' },
  // ΑΕΚ–Levski Sofia UCL PO: Τρί 18/8 22:00 · Τετ 26/8 22:00
  { id: 'ucl-aek-1', kickoff: '2026-08-18T19:00:00Z', label: 'Levski vs ΑΕΚ', espnLeague: 'uefa.champions', homeTeam: 'Levski Sofia', awayTeam: 'AEK Athens' },
  { id: 'ucl-aek-2', kickoff: '2026-08-26T19:00:00Z', label: 'ΑΕΚ vs Levski', espnLeague: 'uefa.champions', homeTeam: 'AEK Athens', awayTeam: 'Levski Sofia' },
  // ΟΦΗ–CSKA Sofia UEL PO: Πέμ 20/8 & 27/8 · 20:00 Αθήνα
  { id: 'uel-ofi-1', kickoff: '2026-08-20T17:00:00Z', label: 'ΟΦΗ vs CSKA Sofia', espnLeague: 'uefa.europa', homeTeam: 'OFI', awayTeam: 'CSKA Sofia' },
  { id: 'uel-ofi-2', kickoff: '2026-08-27T17:00:00Z', label: 'CSKA Sofia vs ΟΦΗ', espnLeague: 'uefa.europa', homeTeam: 'CSKA Sofia', awayTeam: 'OFI' },
  // ΠΑΟΚ–Brann UECL PO: Πέμ 20/8 20:45 · Πέμ 27/8 20:00
  { id: 'uecl-paok-1', kickoff: '2026-08-20T17:45:00Z', label: 'ΠΑΟΚ vs Brann', espnLeague: 'uefa.europa.conf', homeTeam: 'PAOK', awayTeam: 'Brann' },
  { id: 'uecl-paok-2', kickoff: '2026-08-27T17:00:00Z', label: 'Brann vs ΠΑΟΚ', espnLeague: 'uefa.europa.conf', homeTeam: 'Brann', awayTeam: 'PAOK' },
  // ΠΑΟ–Hradec UECL PO: Πέμ 20/8 21:30 · Πέμ 27/8 20:00
  { id: 'uecl-pao-5', kickoff: '2026-08-20T18:30:00Z', label: 'ΠΑΟ vs Hradec', espnLeague: 'uefa.europa.conf', homeTeam: 'Panathinaikos', awayTeam: 'Hradec Kralove' },
  { id: 'uecl-pao-6', kickoff: '2026-08-27T17:00:00Z', label: 'Hradec vs ΠΑΟ', espnLeague: 'uefa.europa.conf', homeTeam: 'Hradec Kralove', awayTeam: 'Panathinaikos' },
  // Super League MD1 (πρόγραμμα 21/8/2026)
  { id: 'sl-1-1', kickoff: '2026-08-22T17:00:00Z', label: 'ΑΕΚ vs ΗΡΑ', espnLeague: 'gre.1', homeTeam: 'AEK Athens', awayTeam: 'Iraklis' },
  { id: 'sl-1-2', kickoff: '2026-08-22T17:00:00Z', label: 'ΚΑΛ vs ΑΡΗΣ', espnLeague: 'gre.1', homeTeam: 'Kalamata', awayTeam: 'Aris' },
  { id: 'sl-1-3', kickoff: '2026-08-22T18:30:00Z', label: 'ΟΛΥ vs ΑΤΡ', espnLeague: 'gre.1', homeTeam: 'Olympiacos', awayTeam: 'Atromitos' },
  { id: 'sl-1-4', kickoff: '2026-08-23T16:30:00Z', label: 'ΟΦΗ vs ΒΟΛ', espnLeague: 'gre.1', homeTeam: 'OFI', awayTeam: 'Volos' },
  { id: 'sl-1-5', kickoff: '2026-08-23T18:00:00Z', label: 'ΠΑΟ vs ΚΗΦ', espnLeague: 'gre.1', homeTeam: 'Panathinaikos', awayTeam: 'AE Kifisia', postponed: true, timeTbd: true },
  { id: 'sl-1-6', kickoff: '2026-08-23T18:30:00Z', label: 'ΠΝΕ vs ΑΣΤ', espnLeague: 'gre.1', homeTeam: 'Panetolikos', awayTeam: 'Asteras Tripolis' },
  { id: 'sl-1-7', kickoff: '2026-08-23T18:00:00Z', label: 'ΠΑΟΚ vs ΛΕΒ', espnLeague: 'gre.1', homeTeam: 'PAOK', awayTeam: 'Levadiakos' },
]

/** WhatsApp reminder offsets (minutes before kickoff) */
const REMIND_TARGETS = [30, 20]
/** Lock + reveal all predictions (minutes before kickoff) */
const LOCK_TARGET = 15

/** Real kickoff (not TBA / postponed) — same rules as ΠΡΟΓΡΑΜΜΑ / src/lib/data.js */
function isSchedulableMatch(m) {
  if (!m?.kickoff || m.timeTbd || m.postponed) return false
  const home = m.homeTeam || m.home
  const away = m.awayTeam || m.away
  return home !== 'TBD' && away !== 'TBD'
}

/** FT timestamp from stored result, if any */
function ftAtFromState(state, matchId) {
  const r = state?.results?.[matchId]
  if (!r || r.h == null || r.a == null) return null
  const fetched = r.fetchedAt ? Date.parse(r.fetchedAt) : NaN
  return Number.isFinite(fetched) ? fetched : null
}

/** Match still inside Cloudflare window: 30′ pre-KO → FT+30′ */
function matchInCloudOps(match, now, state) {
  if (!isSchedulableMatch(match)) return false
  return inCloudOpsWindow(match.kickoff, now, ftAtFromState(state, match.id))
}

/** Cheap KV key for cron early-skip (mirrors state.kickoffOverrides) */
async function getKickoffOverrides(env) {
  try {
    const raw = await env.KOUV.get('kickoffOverrides')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

async function saveKickoffOverride(env, state, matchId, entry) {
  if (!state.kickoffOverrides) state.kickoffOverrides = {}
  state.kickoffOverrides[matchId] = entry
  await setState(env, state)
  await env.KOUV.put('kickoffOverrides', JSON.stringify(state.kickoffOverrides))
  return entry
}

function findProgramMatch(matchId) {
  return (
    MATCHES.find((m) => m.id === matchId) ||
    ALL_FIXTURES.find((m) => m.id === matchId) ||
    null
  )
}

function withOverrides(list, overrides) {
  return applyKickoffOverrides(list, overrides)
}

/** ESPN kickoff (works for STATUS_SCHEDULED) */
async function fetchESPNKickoff(match) {
  if (!match?.espnLeague || !match?.kickoff) return null
  const home = match.homeTeam || match.home
  const away = match.awayTeam || match.away
  if (!home || !away || home === 'TBD' || away === 'TBD') return null
  const date = match.kickoff.substring(0, 10).replace(/-/g, '')
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${match.espnLeague}/scoreboard?dates=${date}`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } })
    if (!res.ok) return null
    const data = await res.json()
    const significant = (s) =>
      s
        .toLowerCase()
        .split(/[\s.\-/]+/)
        .filter((w) => w.length > 2 && !['fc', 'cf', 'sc', 'the', 'and'].includes(w))
    const nameHit = (needleWords, haystackNames) =>
      needleWords.some((w) => haystackNames.some((n) => n.includes(w) || w.includes(n.split(/[\s.\-/]+/)[0] || '')))
    const evt =
      (data.events || []).find((e) => {
        const comps = e.competitions?.[0]?.competitors || []
        const allNames = comps.flatMap((c) =>
          [c.team?.displayName || '', c.team?.name || '', c.team?.abbreviation || '', c.team?.shortDisplayName || ''].map((n) =>
            n.toLowerCase(),
          ),
        )
        return nameHit(significant(home), allNames) && nameHit(significant(away), allNames)
      }) || null
    if (!evt?.date) return null
    return new Date(evt.date).toISOString().replace(/\.\d{3}Z$/, 'Z')
  } catch {
    return null
  }
}

function enrichMatchForFetch(match) {
  const ESPN_BY_T = {
    SL: 'gre.1',
    UCL: 'uefa.champions',
    UEL: 'uefa.europa',
    UECL: 'uefa.europa.conf',
  }
  const keyName = (key) => {
    if (!key || key === 'TBD') return key
    // Prefer Worker MATCHES English names when present
    if (match.homeTeam && key === match.home) return match.homeTeam
    if (match.awayTeam && key === match.away) return match.awayTeam
    return TEAMS[key]?.name || key
  }
  const homeKey = match.home || null
  const awayKey = match.away || null
  return {
    ...match,
    espnLeague: match.espnLeague || ESPN_BY_T[match.t] || null,
    homeTeam: match.homeTeam || keyName(homeKey),
    awayTeam: match.awayTeam || keyName(awayKey),
    home: homeKey || match.homeTeam,
    away: awayKey || match.awayTeam,
  }
}

async function resolveKickoffFromInternet(match) {
  const enriched = enrichMatchForFetch(match)
  const espn = await fetchESPNKickoff(enriched)
  if (espn) return { kickoff: espn, source: 'espn' }
  try {
    const gz = await fetchGazzettaKickoff(enriched)
    if (gz) return { kickoff: gz, source: 'gazzetta' }
  } catch {
    /* ignore */
  }
  return null
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function makeToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}
function json(d, s = 200) {
  return new Response(JSON.stringify(d), {
    status: s,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
  })
}

async function getAllUsers(env) {
  const extra = await env.KOUV.get('extra_users')
  return { ...BASE_USERS, ...(extra ? JSON.parse(extra) : {}) }
}
async function getState(env) {
  const raw = await env.KOUV.get('state')
  const state = raw
    ? JSON.parse(raw)
    : {
        predictions: {},
        results: {},
        chat: [{ p: 'Boikos', t: 'Καλωσορίσατε στο Κουβαδέιρος 2026/27! 🏆', ts: '19:00', a: true }],
        phones: {},
        welcomed: {},
        revealed: {},
        thavmaStats: {},
        kickoffOverrides: {},
        version: 8,
      }
  if (!state.kickoffOverrides) state.kickoffOverrides = {}
  if (!state.results) state.results = {}
  if (!state.predictions) state.predictions = {}
  const beforePhones = JSON.stringify(state.phones || {})
  const beforePreds = JSON.stringify(state.predictions || {})
  state.phones = { ...DEFAULT_PHONES, ...(state.phones || {}) }
  let locked = { results: state.results, changed: false }
  try {
    locked = applyTipResultLocks(state.results)
    state.results = locked.results
  } catch (e) {
    console.log('tip locks skip', e?.message || e)
  }
  try {
    // Fill missing players from SEEDED_PREDICTIONS (admin late tips · no DQ).
    // Must persist into KV or the next cron/newspaper pass still sees blanks → fake DQ.
    state.predictions = mergeSeededPredictions(state.predictions)
  } catch (e) {
    console.log('seed tips skip', e?.message || e)
  }
  const predsFilled = JSON.stringify(state.predictions || {}) !== beforePreds
  // Persist phone merge + tip-result locks + newly filled seed tips
  if (JSON.stringify(state.phones) !== beforePhones || locked.changed || predsFilled) {
    try {
      await env.KOUV.put('state', JSON.stringify(state))
    } catch (e) {
      console.log('state persist skip', e?.message || e)
    }
  }
  return state
}
async function setState(env, s) {
  await env.KOUV.put('state', JSON.stringify(s))
}
async function getUser(req, env) {
  const token = (req.headers.get('Authorization') || '').replace('Bearer ', '').trim()
  if (!token) return null
  const email = await env.KOUV.get(`token:${token}`)
  if (!email) return null
  const users = await getAllUsers(env)
  return users[email] ? { ...users[email], email } : null
}

async function sendWA(env, to, body, mediaUrl) {
  if (!to) return { ok: false, error: 'no_to' }
  const sid = env.TWILIO_SID
  const token = env.TWILIO_TOKEN
  let from = env.TWILIO_FROM || 'whatsapp:+14155238886'
  if (!sid || !token) {
    console.log('Twilio secrets missing — skip WA')
    return { ok: false, error: 'missing_secrets' }
  }
  // Normalize E.164 → whatsapp:+...
  let dest = String(to).trim()
  if (dest.startsWith('whatsapp:')) dest = dest.slice('whatsapp:'.length)
  if (!dest.startsWith('+')) dest = `+${dest.replace(/\D/g, '')}`
  dest = `whatsapp:${dest}`
  if (!from.startsWith('whatsapp:')) from = `whatsapp:${from.replace(/^whatsapp:/, '')}`

  // WhatsApp freeform body soft limit — keep under ~1500 for reliability
  const text = String(body || '').slice(0, 1500)

  async function post(params) {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${sid}:${token}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params),
    })
    const raw = await res.text()
    let data = null
    try {
      data = JSON.parse(raw)
    } catch {
      data = { raw }
    }
    return { http: res.status, ok: res.ok, data }
  }

  try {
    // 1) Text first (media often fails sandbox / unreachable MediaUrl and drops the whole msg)
    const textRes = await post({ From: from, To: dest, Body: text })
    if (!textRes.ok) {
      console.log('WA fail', dest, textRes.http, dataSnippet(textRes.data))
      return {
        ok: false,
        error: textRes.data?.message || textRes.data?.raw || `http_${textRes.http}`,
        code: textRes.data?.code,
        status: textRes.data?.status,
        sid: textRes.data?.sid,
      }
    }
    console.log('WA sent', dest, textRes.data?.sid, textRes.data?.status)

    // 2) Optional image as follow-up (never block the text)
    let media = null
    if (mediaUrl) {
      media = await post({ From: from, To: dest, Body: '🗞 Ο Κουβάς — πρωτοσέλιδο', MediaUrl: mediaUrl })
      if (!media.ok) console.log('WA media fail', dest, media.http, dataSnippet(media.data))
    }

    return {
      ok: true,
      sid: textRes.data?.sid,
      status: textRes.data?.status,
      mediaOk: media ? media.ok : null,
      mediaSid: media?.data?.sid,
      mediaError: media && !media.ok ? media.data?.message : null,
    }
  } catch (e) {
    console.log('WA exception', e?.message || e)
    return { ok: false, error: String(e?.message || e) }
  }
}

function dataSnippet(d) {
  try {
    return JSON.stringify(d).slice(0, 240)
  } catch {
    return String(d)
  }
}

function grTime(iso) {
  return new Date(iso).toLocaleTimeString('el-GR', { timeZone: 'Europe/Athens', hour: '2-digit', minute: '2-digit' })
}
function matchResult(h, a) {
  return h > a ? 'H' : h < a ? 'A' : 'D'
}
function isMissingTip(pred) {
  return !pred || typeof pred.h !== 'number' || typeof pred.a !== 'number'
}
function matchHadAnyTip(predictions, matchId) {
  const tips = predictions?.[matchId] || {}
  return Object.values(tips).some((t) => !isMissingTip(t))
}
function scoreMatch(pred, actual, opts = {}) {
  if (actual == null) return null
  if (isMissingTip(pred)) {
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

function buildLivePayload(score) {
  const min = score?.minute > 0 ? score.minute : null
  const label = score?.label || (min ? `${min}'` : 'LIVE')
  const out = { h: score.h, a: score.a, min: min ?? 0, label }
  if (score?.phase) out.phase = score.phase
  // Tip scoring is always 90′ — keep regulation snapshot for provisional pts during ET/pens.
  if (score?.regH != null && score?.regA != null) {
    out.regH = score.regH
    out.regA = score.regA
  }
  if (score?.isInET || score?.phase === 'ET') out.phase = out.phase || 'ET'
  return out
}

function mergeResults(state) {
  return { ...FALLBACK_RESULTS, ...(state.results || {}) }
}

/**
 * Sum ESPN period linescores for regulation (periods 1–2).
 * Returns null when linescores are missing / incomplete.
 */
function regulationFromLinescores(homeC, awayC) {
  const sumRegs = (comp) => {
    const lines = comp?.linescores
    if (!Array.isArray(lines) || lines.length < 2) return null
    let total = 0
    for (const line of lines.slice(0, 2)) {
      const v = parseInt(line?.value ?? line?.displayValue ?? '', 10)
      if (!Number.isFinite(v)) return null
      total += v
    }
    return total
  }
  const h = sumRegs(homeC)
  const a = sumRegs(awayC)
  if (h == null || a == null) return null
  return { h, a }
}

/**
 * Auto FT writer.
 * Tips always score against 90′ (h/a). After AET/pens the board total goes in otH/otA
 * (or penH/penA) — never overwrite the tip scoreline with ET goals.
 * Does not invent πρόκριση (qual stays prior/manual only).
 */
function buildAutoResult(matchId, score, prev, regSnap) {
  const prior = prev || FALLBACK_RESULTS[matchId] || {}
  const fallback = FALLBACK_RESULTS[matchId] || {}
  // Some feeds post the AET board total as FT without an AET flag — if our known
  // fallback has overtime and the posted total matches otH/otA, treat as AET.
  const feedLooksLikeOtTotal =
    !!(fallback.overtime &&
      fallback.otH != null &&
      fallback.otA != null &&
      score.h === fallback.otH &&
      score.a === fallback.otA &&
      (fallback.h !== score.h || fallback.a !== score.a))
  const afterExtra = !!(score.isAET || score.isPen || prior.overtime || prior.penalties || feedLooksLikeOtTotal)
  let h = score.h
  let a = score.a
  let otH = prior.otH ?? null
  let otA = prior.otA ?? null
  let penH = prior.penH ?? null
  let penA = prior.penA ?? null

  if (afterExtra) {
    // Final board after ET/pens
    if (score.isPen) {
      penH = score.penH ?? score.h
      penA = score.penA ?? score.a
      if (score.otH != null && score.otA != null) {
        otH = score.otH
        otA = score.otA
      } else if (otH == null || otA == null) {
        otH = score.h
        otA = score.a
      }
    } else {
      otH = score.h
      otA = score.a
    }
    const reg =
      (score.regH != null && score.regA != null ? { h: score.regH, a: score.regA } : null) ||
      (regSnap?.h != null && regSnap?.a != null ? { h: regSnap.h, a: regSnap.a } : null) ||
      (prior.regH != null && prior.regA != null ? { h: prior.regH, a: prior.regA } : null) ||
      (fallback.h != null && fallback.a != null && fallback.overtime ? { h: fallback.h, a: fallback.a } : null) ||
      (prior.h != null && prior.a != null && !prior.overtime && prior.source !== 'auto'
        ? { h: prior.h, a: prior.a }
        : null)
    if (reg) {
      h = reg.h
      a = reg.a
    }
  }

  return {
    h,
    a,
    overtime: !!(score.isAET || prior.overtime || afterExtra || feedLooksLikeOtTotal),
    otH,
    otA,
    penalties: score.isPen || prior.penalties || false,
    penH,
    penA,
    qual: prior.qual || null,
    source: 'auto',
    fetchedAt: new Date().toISOString(),
  }
}

function qualHintForMatch(match) {
  if (!match || match.id.startsWith('sl-')) return ''
  const id = match.id
  if (id.includes('paok')) return ' PAOK'
  if (id.includes('pao')) return ' PAO'
  if (id.includes('oly')) return ' OLY'
  if (id.includes('aek')) return ' AEK'
  if (id.includes('ofi')) return ' OFI'
  return ''
}

function athensYesterday(now = Date.now()) {
  const [y, m, d] = athensDate(new Date(now).toISOString()).split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() - 1)
  return dt.toISOString().slice(0, 10)
}

async function sendNewspaperEdition(env, { ymd, adminOnly = false, force = false, round = 0 }) {
  const state = await getState(env)
  const users = await getAllUsers(env)
  const phones = { ...(state.phones || {}) }
  if (env.ADMIN_PHONE && !phones.boikos) phones.boikos = env.ADMIN_PHONE

  const edition = buildEdition(ymd, MATCHES, { ...state, results: mergeResults(state) }, users, { round })
  if (!edition.matchCount) {
    return { ok: false, error: 'No finished matches for that date', edition: { ymd, ranking: [], matchCount: 0 } }
  }
  const sentKey = `newspaper:${ymd}`
  if (!force && !adminOnly && (await env.KOUV.get(sentKey))) {
    return { ok: false, error: 'Already sent', edition: { splash: edition.headlines.splash, ranking: edition.ranking } }
  }

  const targets = adminOnly
    ? Object.values(users).filter((u) => u.role === 'admin')
    : Object.values(users)

  const pageUrl = `https://kouvadeiros-api.jboikos.workers.dev/newspaper?date=${ymd}&r=${round}`
  const mediaUrl = `https://kouvadeiros-api.jboikos.workers.dev/newspaper-media?date=${ymd}&slot=hero&r=${round}`
  const body =
    (adminOnly ? '🧪 *ADMIN PREVIEW — μόνο εσύ, όχι οι άλλοι*\n\n' : '') +
    edition.waText +
    `\n\n🗞 Πρωτοσέλιδο (με φωτο):\n${pageUrl}`

  const results = []
  for (const u of targets) {
    const phone = phones[u.id]
    if (!phone) {
      results.push({ name: u.name, id: u.id, ok: false, error: 'no phone on file' })
      continue
    }
    const wa = await sendWA(env, phone, body, mediaUrl)
    results.push({ name: u.name, id: u.id, phoneEnds: String(phone).slice(-4), ...wa })
  }

  if (!adminOnly && results.some((r) => r.ok)) {
    await env.KOUV.put(sentKey, new Date().toISOString(), { expirationTtl: 60 * 60 * 24 * 40 })
  }

  return {
    ok: results.some((r) => r.ok),
    ymd,
    adminOnly,
    pageUrl,
    mediaUrl,
    round,
    sent: results,
    preview: edition.waText,
    edition: {
      splash: edition.headlines.splash,
      yell: edition.headlines.yell,
      kicker: edition.headlines.kicker,
      straps: edition.headlines.straps,
      ranking: edition.ranking,
      matchCount: edition.matchCount,
    },
  }
}

// ── ESPN SCORE FETCHER ────────────────────────────────────────────────────────
async function fetchESPNScore(match) {
  const date = match.kickoff.substring(0, 10).replace(/-/g, '')
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${match.espnLeague}/scoreboard?dates=${date}`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } })
    if (!res.ok) return null
    const data = await res.json()
    const home = match.homeTeam.toLowerCase()
    const away = match.awayTeam.toLowerCase()
    const significant = (s) =>
      s
        .toLowerCase()
        .split(/[\s.\-/]+/)
        .filter((w) => w.length > 2 && !['fc', 'cf', 'sc', 'the', 'and'].includes(w))
    const nameHit = (needleWords, haystackNames) =>
      needleWords.some((w) => haystackNames.some((n) => n.includes(w) || w.includes(n.split(/[\s.\-/]+/)[0] || '')))
    const evt =
      (data.events || []).find((e) => {
        const comps = e.competitions?.[0]?.competitors || []
        const allNames = comps.flatMap((c) =>
          [c.team?.displayName || '', c.team?.name || '', c.team?.abbreviation || '', c.team?.shortDisplayName || ''].map((n) =>
            n.toLowerCase(),
          ),
        )
        return nameHit(significant(home), allNames) && nameHit(significant(away), allNames)
      }) || null
    if (!evt) return null
    const comp = evt.competitions?.[0]
    const status = comp?.status?.type?.name
    const detail = comp?.status?.type?.shortDetail || ''
    if (!status || status === 'STATUS_SCHEDULED') return null
    const comps = comp.competitors || []
    const homeC = comps.find((c) => c.homeAway === 'home')
    const awayC = comps.find((c) => c.homeAway === 'away')
    if (!homeC || !awayC) return null
    const h = parseInt(homeC.score || 0)
    const a = parseInt(awayC.score || 0)
    const clockStr = comp?.status?.displayClock || '0:00'
    const minute = parseInt(clockStr.split(':')[0] || 0)
    const period = Number(comp?.status?.period || evt?.status?.period || 0) || 0
    const isFinal = status === 'STATUS_FINAL'
    const isHT = status === 'STATUS_HALFTIME'
    const isInProg = status === 'STATUS_IN_PROGRESS'
    const detailL = detail.toLowerCase()
    const isInET = isInProg && (period >= 3 || detailL.includes('aet') || detailL.includes('extra') || detailL.includes('et'))
    const isAET = (isFinal && (detailL.includes('aet') || detailL.includes('extra'))) || (isFinal && period >= 3)
    const isPen = isFinal && (detailL.includes('pen') || detailL.includes('penalty'))
    const reg = regulationFromLinescores(homeC, awayC)
    const out = {
      status,
      isFinal,
      isHT,
      isInProgress: isInProg,
      isInET,
      isAET,
      isPen,
      h,
      a,
      minute,
      period,
      detail,
      phase: isInET ? 'ET' : isHT ? 'HT' : undefined,
    }
    if (reg) {
      out.regH = reg.h
      out.regA = reg.a
    } else if (isInET || isAET || isPen) {
      // No linescores — callers may fill from live 90′ snapshot
    }
    return out
  } catch {
    return null
  }
}

// ── CRON: every 1′ — KV/Gazzetta only in 30′ pre-KO → FT+30′ window ─────────
export default {
  async scheduled(event, env, ctx) {
    const now = Date.now()
    const todayAthens = athensDate(new Date(now).toISOString())

    // Cheap skip: static fixtures + KV kickoff overrides (no full state yet)
    const overrides = await getKickoffOverrides(env)
    const programFixtures = withOverrides(ALL_FIXTURES, overrides)
    if (!anyCloudOpsActivity(programFixtures, now)) {
      console.log(`cron skip — outside 30′ pre-KO → FT+30′ window (${todayAthens})`)
      return
    }

    const state = await getState(env)
    state.kickoffOverrides = { ...overrides, ...(state.kickoffOverrides || {}) }
    const opsMatches = withOverrides(MATCHES, state.kickoffOverrides)
    const phones = state.phones || {}
    const users = await getAllUsers(env)
    // Keep 5′ buckets for WhatsApp dedup so 1′ cron doesn't re-fire the same reminder
    const windowKey = `cron:${Math.floor(now / 300000)}`
    const sent = JSON.parse((await env.KOUV.get(windowKey)) || '{}')
    let stateChanged = false

    if (!state.thavmaStats) state.thavmaStats = {}

    const playerNames = {}
    for (const u of Object.values(users)) playerNames[u.id] = u.name

    // Ops: 30′ before KO through 30′ after Full Time (uses result.fetchedAt when known)
    const anyOps = opsMatches.some((m) => matchInCloudOps(m, now, state))
    const mergedForPaper = { ...state, results: mergeResults(state) }
    const paperDue = shouldSendNewspaper(opsMatches, mergedForPaper, todayAthens, now)

    // Past FT+30′ for every match and no tabloid due → no Gazzetta / no KV churn
    if (!anyOps && !paperDue) {
      console.log(`cron skip — past FT+${CLOUD_AFTER_FT_MIN}′ and no newspaper (${todayAthens})`)
      return
    }

    if (anyOps) {
    // Gazzetta first (default ON) — one schedule+live poll for matches in cloud window
    let gzScores = {}
    const gzHealth = await getGazzettaHealth(env)
    if (gzHealth.enabled !== false) {
      try {
        const bandMatches = opsMatches.filter((m) => matchInCloudOps(m, now, state))
        const poll = await pollGazzettaForMatches(bandMatches.length ? bandMatches : opsMatches.filter(isSchedulableMatch))
        gzScores = poll.scores || {}
        await setGazzettaHealth(env, {
          ...gzHealth,
          enabled: true,
          lastOk: new Date(now).toISOString(),
          lastError: null,
          lastPoll: new Date(now).toISOString(),
          scheduleCount: poll.scheduleCount,
          liveFeedCount: poll.liveFeedCount,
          matchedLive: poll.matchedLive,
          matchedTotal: poll.matchedTotal,
        })
      } catch (e) {
        console.log('gazzetta poll error', e?.message || e)
        await setGazzettaHealth(env, {
          ...gzHealth,
          enabled: gzHealth.enabled !== false,
          lastError: String(e?.message || e),
          lastPoll: new Date(now).toISOString(),
        })
      }
    }

    for (const match of opsMatches) {
      if (!matchInCloudOps(match, now, state)) continue
      const kickoff = new Date(match.kickoff).getTime()
      const minsUntil = (kickoff - now) / 60000
      // Safety: ignore absurd clock skew outside reminder→post-FT band
      if (minsUntil > CLOUD_BEFORE_MIN || minsUntil < -CLOUD_MAX_AFTER_KO_MIN) continue

      // ── AUTO SCORE + ΘΑΥΜΑ/ΩΣΑΝΑ — while in cloud ops window ──
      const minsAfter = -minsUntil
      if (minsAfter >= -CLOUD_BEFORE_MIN && matchInCloudOps(match, now, state)) {
        const already = state.results?.[match.id]
        if (!already || already.source === 'auto') {
          const score = gzScores[match.id] || (await fetchESPNScore(match))
          if (score) {
            const prev = state.results?.[match.id]
            const regKey = `reg_${match.id}`
            // Snapshot 90′ tip scoreline before ET goals pollute the board total
            if (!score.isFinal && !score.isInET && score.minute >= 90 && score.period <= 2) {
              state[regKey] = { h: score.h, a: score.a, snappedAt: new Date(now).toISOString() }
              stateChanged = true
            }
            if (!score.isFinal && score.regH != null && score.regA != null && !state[regKey]) {
              state[regKey] = { h: score.regH, a: score.regA, snappedAt: new Date(now).toISOString() }
              stateChanged = true
            }
            if ((score.isInET || score.isAET || score.isPen) && state[regKey] && score.regH == null) {
              score.regH = state[regKey].h
              score.regA = state[regKey].a
            }

            const tipH = score.regH ?? score.h
            const tipA = score.regA ?? score.a
            // Tip-board snapshot across cron ticks (not the 5′ WA window) — needed so late
            // goals are detected as real changes, not re-fired every 5 minutes.
            if (!state.tipBoards) state.tipBoards = {}
            if (!state.dramaAlerts) state.dramaAlerts = {}
            const tipPrev = state.tipBoards[match.id] || null
            const scoreChanged = !tipPrev || tipPrev.h !== tipH || tipPrev.a !== tipA
            // Θαύμα: goal from 85′ onward (regulation). Ωσανά: from 90′ (injury time). Never ET.
            const isLate = score.minute >= 85 && !score.isInET
            const isInjury = score.minute >= 90 && !score.isInET

            // Always refresh tip board during regulation so the *next* late change is real
            if (!score.isInET && typeof tipH === 'number' && typeof tipA === 'number') {
              state.tipBoards[match.id] = { h: tipH, a: tipA, min: score.minute, at: new Date(now).toISOString() }
              stateChanged = true
            }

            // ΘΑΥΜΑ/ΩΣΑΝΑ only when the tip scoreline actually changed while already late,
            // and only once per scoreline (persisted in state — not the 5′ cron window).
            if (
              scoreChanged &&
              tipPrev &&
              isLate &&
              !score.isFinal &&
              !score.isInET
            ) {
              const newScore = { h: tipH, a: tipA }
              const dramaKey = `drama:${match.id}:${tipH}-${tipA}`

              if (!state.dramaAlerts[dramaKey] && !sent[dramaKey]) {
                const preds = state.predictions?.[match.id] || {}
                const beneficiaries = []
                const gains = {}

                for (const [pid, pred] of Object.entries(preds)) {
                  const prevSc = scoreMatch(pred, { h: tipPrev.h, a: tipPrev.a })
                  const newSc = scoreMatch(pred, newScore)
                  const ptsGained = (newSc?.points || 0) - (prevSc?.points || 0)
                  if (ptsGained > 0) {
                    beneficiaries.push({ id: pid, name: playerNames[pid] || pid })
                    gains[pid] = ptsGained
                  }
                }

                if (beneficiaries.length) {
                  for (const b of beneficiaries) {
                    const ptsGained = gains[b.id]
                    if (!state.thavmaStats[b.id]) state.thavmaStats[b.id] = { benefited: 0, pts_gained: 0, pts_lost: {} }
                    state.thavmaStats[b.id].benefited = (state.thavmaStats[b.id].benefited || 0) + 1
                    state.thavmaStats[b.id].pts_gained = (state.thavmaStats[b.id].pts_gained || 0) + ptsGained

                    for (const otherId of Object.values(BASE_USERS).map((u) => u.id)) {
                      if (otherId !== b.id) {
                        if (!state.thavmaStats[otherId]) state.thavmaStats[otherId] = { benefited: 0, pts_gained: 0, pts_lost: {} }
                        if (!state.thavmaStats[otherId].pts_lost) state.thavmaStats[otherId].pts_lost = {}
                        state.thavmaStats[otherId].pts_lost[b.id] =
                          (state.thavmaStats[otherId].pts_lost[b.id] || 0) + ptsGained
                      }
                    }
                  }
                  stateChanged = true

                  const type = isInjury ? 'ΩΣΑΝΑ' : 'ΘΑΥΜΑ'
                  const dramaMessages = buildDramaMessages(
                    beneficiaries,
                    playerNames,
                    match.label,
                    newScore,
                    score.minute,
                    isInjury,
                    state.thavmaStats,
                  )

                  // Exactly one WA per player for this late goal — never re-blast on later cron ticks
                  for (const [mpid, msg] of Object.entries(dramaMessages)) {
                    const phone = phones[mpid]
                    if (phone) await sendWA(env, phone, `${isInjury ? '🙌' : '⚡'} *${type}!*\n\n${msg}`)
                  }

                  state.dramaAlerts[dramaKey] = {
                    at: new Date(now).toISOString(),
                    type,
                    minute: score.minute,
                    beneficiaries: beneficiaries.map((b) => b.id),
                  }
                  sent[dramaKey] = true
                  console.log(`${type} sent once for ${match.id} @${score.minute}': ${beneficiaries.map((b) => b.id).join(',')}`)
                }
              }
            }

            if (score.isFinal) {
              const result = buildAutoResult(match.id, score, prev, state[regKey])
              result.fetchedAt = new Date(now).toISOString()
              const changed =
                !prev ||
                prev.h !== result.h ||
                prev.a !== result.a ||
                (prev.otH ?? null) !== (result.otH ?? null) ||
                (prev.otA ?? null) !== (result.otA ?? null) ||
                (!!prev.overtime) !== (!!result.overtime) ||
                (!prev.qual && result.qual)
              if (changed) {
                if (!state.results) state.results = {}
                state.results[match.id] = result
                delete state[`live_${match.id}`]
                delete state[regKey]
                if (state.tipBoards) delete state.tipBoards[match.id]
                stateChanged = true
                if (!sent[`ft:${match.id}`]) {
                  const tipLine = `${result.h}–${result.a}`
                  const ot =
                    result.overtime && result.otH != null
                      ? ` · Παρ ${result.otH}–${result.otA}`
                      : score.isAET
                        ? ' (AET)'
                        : ''
                  const pen = result.penalties ? ' · Pen' : ''
                  const q = result.qual ? ` · →${result.qual}` : ''
                  const msg = `🏁 *Αποτέλεσμα!*\n\n⚽ *${match.label}*\n*${tipLine}*${ot}${pen}${q}\n\nΔες τους πόντους: kouvadeiros.pages.dev`
                  for (const [, user] of Object.entries(users)) {
                    const phone = phones[user.id]
                    if (phone) await sendWA(env, phone, msg)
                  }
                  sent[`ft:${match.id}`] = true
                }
              }
            } else if (score.isHT && !sent[`ht:${match.id}`]) {
              const msg = `⏸ *Ημίχρονο!* ${match.label}\n*${score.h}–${score.a}* (45')`
              for (const [, user] of Object.entries(users)) {
                const phone = phones[user.id]
                if (phone) await sendWA(env, phone, msg)
              }
              sent[`ht:${match.id}`] = true
            }

            if (!score.isFinal) {
              state[`live_${match.id}`] = buildLivePayload(score)
              stateChanged = true
            }
          }
        }
      }

      // ── REMINDER WINDOWS (30' and 20' before — then lock/reveal at 15') ──
      // Catch after crossing the mark (not ±2.5′) so a cron tick cannot skip the window.
      for (const target of REMIND_TARGETS) {
        if (!(minsUntil <= target && minsUntil > target - 8)) continue
        const urgency = target === 30 ? '🟡' : '🔴'
        for (const user of Object.values(users)) {
          const phone = phones[user.id]
          if (!phone) continue
          if (state.predictions?.[match.id]?.[user.id]) continue
          const urKey = `wa:remind:${match.id}:${target}:${user.id}`
          if (await env.KOUV.get(urKey)) continue
          const msg =
            `${urgency} *KOUVADEIROS — Υπενθύμιση!*\n\n` +
            `⚽ *${match.label}*\nΕκκίνηση: *${grTime(match.kickoff)}* (σε ~${Math.round(minsUntil)} λεπτά)\n\n` +
            `📱 Απάντα:\n\`PRED ${match.id} 2-1${qualHintForMatch(match)}\`\n\n` +
            `⏰ Κλείδωμα προβλέψεων 15′ πριν τη σέντρα!`
          const wa = await sendWA(env, phone, msg)
          if (wa.ok) {
            await env.KOUV.put(urKey, new Date(now).toISOString(), { expirationTtl: 60 * 60 * 36 })
            console.log('remind ok', target, match.id, user.id)
          } else {
            console.log('remind fail', target, match.id, user.id, wa.error || wa)
          }
        }
      }

      // ── LOCK + REVEAL (15' before kickoff) ───────────────────────────────
      if (minsUntil <= LOCK_TARGET && minsUntil > LOCK_TARGET - 8) {
        const lKey = `wa:lock:${match.id}`
        const alreadyLock = await env.KOUV.get(lKey)
        if (!alreadyLock && !state.revealed?.[match.id]) {
          if (!state.revealed) state.revealed = {}
          state.revealed[match.id] = true
          stateChanged = true
          const preds = state.predictions?.[match.id] || {}
          const allU = await getAllUsers(env)
          const lines = Object.entries(preds).map(([pid, p]) => {
            const uname = Object.values(allU).find((u) => u.id === pid)?.name || pid
            const et =
              p.predOT && typeof p.otH === 'number' && typeof p.otA === 'number'
                ? ` · ET ${p.otH}\u2013${p.otA}`
                : ''
            const pen =
              p.predPen && typeof p.penH === 'number' && typeof p.penA === 'number'
                ? ` · \u03a0\u0395\u039d ${p.penH}\u2013${p.penA}`
                : ''
            return `${uname}: *${p.h}\u2013${p.a}*${et}${pen}${p.qual ? ' (\u2192' + p.qual + ')' : ''}`
          })
          const predText = lines.length ? lines.join('\n') : '⚠️ Κανείς δεν έκανε πρόβλεψη!'
          const msg =
            `🔒 *ΚΛΕΙΔΩΜΑ!*\n\n⚽ *${match.label}*\nΠροβλέψεις κλειδωμένες · 15′ πριν τη σέντρα\n\n📊 *Προβλέψεις:*\n${predText}\n\nΠοιος θα έχει δίκιο; 🍔`
          let lockOk = false
          for (const user of Object.values(users)) {
            const phone = phones[user.id]
            if (!phone) continue
            const wa = await sendWA(env, phone, msg)
            if (wa.ok) lockOk = true
          }
          if (lockOk) {
            await env.KOUV.put(lKey, new Date(now).toISOString(), { expirationTtl: 60 * 60 * 36 })
            console.log('lock ok', match.id)
          }
        }
      }
    }
    } else {
      console.log(`cron idle — past FT+${CLOUD_AFTER_FT_MIN}′ / outside 30′ pre-KO (${todayAthens})`)
    }

    // ── Ο ΚΟΥΒΑΣ — end-of-day tabloid (once per Athens calendar day) ──
    try {
      if (paperDue) {
        const paperKey = `newspaper:${todayAthens}`
        if (!(await env.KOUV.get(paperKey))) {
          const blast = await sendNewspaperEdition(env, { ymd: todayAthens, adminOnly: false, force: false })
          console.log('newspaper', todayAthens, blast.ok, blast.sent?.map((s) => `${s.name}:${s.ok}`).join(','))
        }
      }
    } catch (e) {
      console.log('newspaper error', e?.message || e)
    }

    await env.KOUV.put(windowKey, JSON.stringify(sent), { expirationTtl: 10800 })
    if (stateChanged) await setState(env, state)
  },

  // ── HTTP ──────────────────────────────────────────────────────────────────
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
    const url = new URL(request.url),
      path = url.pathname

    if (path === '/login' && request.method === 'POST') {
      const { email, password } = await request.json()
      const users = await getAllUsers(env)
      const user = users[email?.toLowerCase()]
      if (!user || user.password !== password) return json({ error: 'Invalid credentials' }, 401)
      const token = makeToken()
      await env.KOUV.put(`token:${token}`, email.toLowerCase(), { expirationTtl: 86400 * 30 })
      // Phone from defaults — never block login on KV/Twilio (that was CF 1101).
      const phone = DEFAULT_PHONES[user.id] || null
      const welcomeTask = (async () => {
        try {
          const state = await getState(env)
          const welcomed = state.welcomed || {}
          if (phone && !welcomed[user.id]) {
            const msg =
              `🎉 *Καλωσόρισες στο KOUVADEIROS 2026/27!*\n\nΓεια σου ${user.name}! 🌶️\n\n` +
              `📱 Κάνε προβλέψεις:\n• Μέσα από την εφαρμογή\n• Μέσω WhatsApp: \`PRED [match-id] [σκορ]\`\n\n` +
              `🔔 Υπενθυμίσεις: *30′* και *20′* πριν κάθε αγώνα (κλείδωμα στις 15′)\n` +
              `🔒 Κλείδωμα + αποκάλυψη: *15 λεπτά* πριν τη σέντρα\n` +
              `⚡ Αν βγει ΘΑΥΜΑ ή ΩΣΑΝΑ... θα το μάθεις αμέσως!\n\n` +
              `Καλή επιτυχία! Και το burger παίζει 🍔\n\n_kouvadeiros.pages.dev_`
            await sendWA(env, phone, msg)
            const fresh = await getState(env)
            fresh.welcomed = { ...(fresh.welcomed || {}), [user.id]: new Date().toISOString() }
            await setState(env, fresh)
          }
        } catch (e) {
          console.log('login welcome skip', e?.message || e)
        }
      })()
      if (ctx?.waitUntil) ctx.waitUntil(welcomeTask)
      return json({ token, name: user.name, id: user.id, email, role: user.role || 'player', phone })
    }

    if (path === '/logout' && request.method === 'POST') {
      const token = (request.headers.get('Authorization') || '').replace('Bearer ', '').trim()
      if (token) await env.KOUV.delete(`token:${token}`)
      return json({ ok: true })
    }

    if (path === '/state' && request.method === 'GET') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      return json(await getState(env))
    }

    if (path === '/prediction' && request.method === 'PATCH') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const { matchId, h, a, qual, predOT, otH, otA, predPen, penH, penA, playerId } = await request.json()
      const targetId = user.role === 'admin' && playerId ? playerId : user.id
      const state = await getState(env)
      const match = withOverrides(
        MATCHES.some((m) => m.id === matchId) ? MATCHES : ALL_FIXTURES,
        state.kickoffOverrides,
      ).find((m) => m.id === matchId)
      if (match) {
        const minsUntil = (new Date(match.kickoff).getTime() - Date.now()) / 60000
        const adminForce = user.role === 'admin' && !!playerId
        if (!match.timeTbd && !match.postponed && minsUntil <= LOCK_TARGET && !adminForce) {
          return json({ error: 'Predictions locked (15′ before kickoff)' }, 403)
        }
      }
      if (!state.predictions) state.predictions = {}
      if (!state.predictions[matchId]) state.predictions[matchId] = {}
      state.predictions[matchId][targetId] = {
        h,
        a,
        qual,
        predOT,
        otH,
        otA,
        predPen,
        penH,
        penA,
        savedAt: new Date().toISOString(),
        ...(user.role === 'admin' && playerId ? { setBy: user.id, via: 'admin' } : {}),
      }
      await setState(env, state)
      return json({ ok: true, playerId: targetId })
    }

    if (path === '/result' && request.method === 'PATCH') {
      const user = await getUser(request, env)
      if (!user || user.role !== 'admin') return json({ error: 'Unauthorized' }, 401)
      const { matchId, h, a, overtime, otH, otA, penalties, penH, penA, qual } = await request.json()
      const state = await getState(env)
      if (!state.results) state.results = {}
      const prior = state.results[matchId] || FALLBACK_RESULTS[matchId] || {}
      state.results[matchId] = {
        h,
        a,
        overtime: overtime || false,
        otH,
        otA,
        penalties: penalties || false,
        penH,
        penA,
        qual: qual !== undefined ? qual : prior.qual || null,
        setBy: user.id,
        setAt: new Date().toISOString(),
        source: 'manual',
      }
      await setState(env, state)
      return json({ ok: true })
    }

    if (path === '/set-kickoff' && request.method === 'POST') {
      const user = await getUser(request, env)
      if (!user || user.role !== 'admin') return json({ error: 'Admin only' }, 403)
      const body = await request.json().catch(() => ({}))
      const matchId = body.matchId
      const base = findProgramMatch(matchId)
      if (!base) return json({ error: 'Unknown match' }, 400)

      let kickoffIso = null
      try {
        if (body.kickoff && typeof body.kickoff === 'string' && body.kickoff.includes('T')) {
          kickoffIso = new Date(body.kickoff).toISOString().replace(/\.\d{3}Z$/, 'Z')
        } else {
          const dateYmd = body.date || athensYmd(base.kickoff)
          const timeHm = body.athensTime || body.time
          if (!timeHm) return json({ error: 'Need athensTime (HH:MM) or kickoff ISO' }, 400)
          kickoffIso = athensLocalToUtcIso(dateYmd, timeHm)
        }
      } catch (e) {
        return json({ error: String(e?.message || e) }, 400)
      }
      if (!Number.isFinite(Date.parse(kickoffIso))) return json({ error: 'Invalid kickoff' }, 400)

      const state = await getState(env)
      const entry = {
        kickoff: kickoffIso,
        timeTbd: false,
        source: 'manual',
        setBy: user.id,
        setAt: new Date().toISOString(),
        athensLocal: `${athensYmd(kickoffIso)} ${athensHm(kickoffIso)}`,
      }
      await saveKickoffOverride(env, state, matchId, entry)
      return json({
        ok: true,
        matchId,
        kickoff: kickoffIso,
        athens: entry.athensLocal,
        override: entry,
      })
    }

    if (path === '/fetch-kickoffs' && request.method === 'POST') {
      const user = await getUser(request, env)
      if (!user || user.role !== 'admin') return json({ error: 'Admin only' }, 403)
      const body = await request.json().catch(() => ({}))
      const state = await getState(env)
      const overrides = state.kickoffOverrides || {}

      let targets = []
      if (body.matchId) {
        const m = findProgramMatch(body.matchId)
        if (!m) return json({ error: 'Unknown match' }, 400)
        targets = [withOverrides([m], overrides)[0]]
      } else {
        // TBA fixtures with known teams (ALL_FIXTURES + MATCHES)
        const byId = new Map()
        for (const m of [...ALL_FIXTURES, ...MATCHES]) byId.set(m.id, m)
        targets = withOverrides([...byId.values()], overrides).filter((m) => {
          if (m.home === 'TBD' || m.away === 'TBD' || m.homeTeam === 'TBD' || m.awayTeam === 'TBD') return false
          return m.timeTbd || body.force === true
        })
      }

      const updated = []
      const skipped = []
      for (const match of targets) {
        try {
          const found = await resolveKickoffFromInternet(match)
          if (!found?.kickoff) {
            skipped.push({ id: match.id, reason: 'not_found' })
            continue
          }
          const entry = {
            kickoff: found.kickoff,
            timeTbd: false,
            source: found.source,
            setBy: user.id,
            setAt: new Date().toISOString(),
            athensLocal: `${athensYmd(found.kickoff)} ${athensHm(found.kickoff)}`,
          }
          await saveKickoffOverride(env, state, match.id, entry)
          updated.push({ id: match.id, ...entry })
        } catch (e) {
          skipped.push({ id: match.id, reason: String(e?.message || e) })
        }
      }

      return json({
        ok: true,
        updated,
        skipped,
        kickoffOverrides: state.kickoffOverrides,
      })
    }

    if (path === '/fetch-scores' && request.method === 'POST') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const { matchId } = await request.json()
      const state0 = await getState(env)
      const match = withOverrides(MATCHES, state0.kickoffOverrides).find((m) => m.id === matchId)
      if (!match) return json({ error: 'Unknown match' }, 400)
      let score = null
      const gzHealth = await getGazzettaHealth(env)
      if (gzHealth.enabled !== false) {
        try {
          const poll = await pollGazzettaForMatches([match])
          score = poll.scores?.[matchId] || null
          await setGazzettaHealth(env, {
            ...gzHealth,
            enabled: true,
            lastOk: new Date().toISOString(),
            lastError: null,
            lastPoll: new Date().toISOString(),
            scheduleCount: poll.scheduleCount,
            liveFeedCount: poll.liveFeedCount,
            matchedLive: poll.matchedLive,
            matchedTotal: poll.matchedTotal,
          })
        } catch (e) {
          await setGazzettaHealth(env, {
            ...gzHealth,
            lastError: String(e?.message || e),
            lastPoll: new Date().toISOString(),
          })
        }
      }
      if (!score) score = await fetchESPNScore(match)
      const state = await getState(env)
      if (!state.results) state.results = {}
      const priorResult = state.results[matchId]
      // Never clobber an admin/manual final (AET tip-score corrections, etc.)
      if (score?.isFinal && priorResult && priorResult.source && priorResult.source !== 'auto') {
        delete state[`live_${matchId}`]
        await setState(env, state)
        return json({
          ok: true,
          result: priorResult,
          final: true,
          source: priorResult.source,
          locked: true,
        })
      }
      if (score?.isFinal) {
        const regSnap = state[`reg_${matchId}`]
        if ((score.isAET || score.isPen) && regSnap && score.regH == null) {
          score.regH = regSnap.h
          score.regA = regSnap.a
        }
        state.results[matchId] = buildAutoResult(matchId, score, state.results[matchId], regSnap)
        delete state[`live_${matchId}`]
        delete state[`reg_${matchId}`]
        await setState(env, state)
        return json({ ok: true, result: state.results[matchId], final: true, source: score.source || 'espn' })
      }
      if (score && score.h !== undefined) {
        if (!score.isInET && score.minute >= 90 && (score.period == null || score.period <= 2)) {
          state[`reg_${matchId}`] = { h: score.h, a: score.a, snappedAt: new Date().toISOString() }
        }
        if (score.regH != null && score.regA != null) {
          state[`reg_${matchId}`] = { h: score.regH, a: score.regA, snappedAt: new Date().toISOString() }
        }
        if ((score.isInET || score.isAET) && state[`reg_${matchId}`] && score.regH == null) {
          score.regH = state[`reg_${matchId}`].h
          score.regA = state[`reg_${matchId}`].a
        }
        state[`live_${matchId}`] = buildLivePayload(score)
        await setState(env, state)
        return json({
          ok: true,
          live: buildLivePayload(score),
          final: false,
          source: score.source || 'espn',
        })
      }
      if (FALLBACK_RESULTS[matchId]) {
        state.results[matchId] = {
          ...FALLBACK_RESULTS[matchId],
          ...(state.results[matchId] || {}),
          source: 'auto',
          fetchedAt: new Date().toISOString(),
        }
        await setState(env, state)
        return json({ ok: true, result: state.results[matchId] })
      }
      return json({ ok: false, status: 'pending' })
    }

    // Admin: Gazzetta live feed status / toggle / force poll (cloud — no local Python)
    if (path === '/gazzetta' && request.method === 'GET') {
      const user = await getUser(request, env)
      if (!user || user.role !== 'admin') return json({ error: 'Admin only' }, 403)
      let health = await getGazzettaHealth(env)
      // First visit / never polled → warm up so the Admin light can go green
      if (health.enabled !== false && !health.lastOk && !health.lastError) {
        try {
          const poll = await pollGazzettaForMatches(MATCHES)
          health = {
            ...health,
            enabled: true,
            lastOk: new Date().toISOString(),
            lastError: null,
            lastPoll: new Date().toISOString(),
            scheduleCount: poll.scheduleCount,
            liveFeedCount: poll.liveFeedCount,
            matchedLive: poll.matchedLive,
            matchedTotal: poll.matchedTotal,
          }
          await setGazzettaHealth(env, health)
        } catch (e) {
          health = {
            ...health,
            lastError: String(e?.message || e),
            lastPoll: new Date().toISOString(),
          }
          await setGazzettaHealth(env, health)
        }
      }
      return json({
        ok: true,
        healthy: gazzettaIsHealthy(health),
        ...health,
        note: `Cloudflare cron every 1′; KV/Gazzetta only ${CLOUD_BEFORE_MIN}′ pre-KO → ${CLOUD_AFTER_FT_MIN}′ after FT. Toggle does not start local Python.`,
      })
    }

    if (path === '/gazzetta' && request.method === 'POST') {
      const user = await getUser(request, env)
      if (!user || user.role !== 'admin') return json({ error: 'Admin only' }, 403)
      const body = await request.json().catch(() => ({}))
      let health = await getGazzettaHealth(env)

      if (typeof body.enabled === 'boolean') {
        health = { ...health, enabled: body.enabled }
      }

      if (body.poll !== false) {
        // Always poll on POST unless explicitly poll:false (toggle-only)
        if (health.enabled === false && body.poll !== true) {
          await setGazzettaHealth(env, health)
          return json({ ok: true, healthy: false, ...health, skippedPoll: true })
        }
        try {
          const poll = await pollGazzettaForMatches(MATCHES)
          health = {
            ...health,
            enabled: health.enabled !== false,
            lastOk: new Date().toISOString(),
            lastError: null,
            lastPoll: new Date().toISOString(),
            scheduleCount: poll.scheduleCount,
            liveFeedCount: poll.liveFeedCount,
            matchedLive: poll.matchedLive,
            matchedTotal: poll.matchedTotal,
          }
          // Apply live scores for in-window matches
          const state = await getState(env)
          let changed = false
          const now = Date.now()
          for (const match of MATCHES) {
            const score = poll.scores?.[match.id]
            if (!score || score.h === undefined) continue
            const minsUntil = (new Date(match.kickoff).getTime() - now) / 60000
            if (minsUntil > 15 || minsUntil < -200) continue
            const prior = state.results?.[match.id]
            if (score.isFinal) {
              // Respect admin/manual tip-scoreline locks
              if (prior && prior.source && prior.source !== 'auto') continue
              if (!state.results) state.results = {}
              const regSnap = state[`reg_${match.id}`]
              if ((score.isAET || score.isPen) && regSnap && score.regH == null) {
                score.regH = regSnap.h
                score.regA = regSnap.a
              }
              state.results[match.id] = buildAutoResult(match.id, score, state.results[match.id], regSnap)
              delete state[`live_${match.id}`]
              delete state[`reg_${match.id}`]
              changed = true
            } else {
              if (!score.isInET && score.minute >= 90 && (score.period == null || score.period <= 2)) {
                state[`reg_${match.id}`] = { h: score.h, a: score.a, snappedAt: new Date().toISOString() }
              }
              if ((score.isInET || score.isAET) && state[`reg_${match.id}`] && score.regH == null) {
                score.regH = state[`reg_${match.id}`].h
                score.regA = state[`reg_${match.id}`].a
              }
              state[`live_${match.id}`] = buildLivePayload(score)
              changed = true
            }
          }
          if (changed) await setState(env, state)
        } catch (e) {
          health = {
            ...health,
            lastError: String(e?.message || e),
            lastPoll: new Date().toISOString(),
          }
        }
      }

      await setGazzettaHealth(env, health)
      return json({ ok: true, healthy: gazzettaIsHealthy(health), ...health })
    }

    if (path === '/chat' && request.method === 'PATCH') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const { text } = await request.json()
      const state = await getState(env)
      if (!state.chat) state.chat = []
      const ts = new Date().toLocaleTimeString('el-GR', { timeZone: 'Europe/Athens', hour: '2-digit', minute: '2-digit' })
      const clean = String(text || '').trim().slice(0, 500)
      if (!clean) return json({ error: 'Empty' }, 400)
      state.chat.push({ p: user.name, t: clean, ts, a: user.role === 'admin' })
      if (state.chat.length > 200) state.chat = state.chat.slice(-200)
      await setState(env, state)

      // Offline ping: WhatsApp everyone else (app may be closed)
      const waNotify = []
      try {
        const users = await getAllUsers(env)
        const phones = { ...DEFAULT_PHONES, ...(state.phones || {}) }
        if (env.ADMIN_PHONE && !phones.boikos) phones.boikos = env.ADMIN_PHONE
        const snippet = clean.length > 120 ? clean.slice(0, 117) + '…' : clean
        const waBody =
          `🔥 *Ιερά Εξέταση*\n` +
          `*${user.name}* · ${ts}\n\n` +
          `${snippet}\n\n` +
          `kouvadeiros.pages.dev`
        for (const u of Object.values(users)) {
          if (!u?.id || u.id === user.id) continue
          const phone = phones[u.id]
          if (!phone) {
            waNotify.push({ id: u.id, ok: false, error: 'no phone' })
            continue
          }
          const wa = await sendWA(env, phone, waBody)
          waNotify.push({ id: u.id, name: u.name, ok: !!wa.ok, error: wa.error || wa.data?.message || null })
          console.log('chat WA', u.id, wa.ok, wa.error || wa.http)
        }
      } catch (e) {
        console.log('chat WA notify error', e?.message || e)
        waNotify.push({ ok: false, error: String(e?.message || e) })
      }

      return json({ ok: true, waNotify })
    }

    if (path === '/save-phone' && request.method === 'PATCH') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const { phone } = await request.json()
      const state = await getState(env)
      if (!state.phones) state.phones = {}
      state.phones[user.id] = phone
      await setState(env, state)
      return json({ ok: true })
    }

    if (path === '/add-player' && request.method === 'POST') {
      const user = await getUser(request, env)
      if (!user || user.role !== 'admin') return json({ error: 'Admin only' }, 403)
      const { email, name, password, phone } = await request.json()
      if (!email || !name || !password) return json({ error: 'Missing fields' }, 400)
      const id = name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
      const extra = JSON.parse((await env.KOUV.get('extra_users')) || '{}')
      extra[email.toLowerCase()] = { password, name, id, role: 'player' }
      await env.KOUV.put('extra_users', JSON.stringify(extra))
      if (phone) {
        const state = await getState(env)
        if (!state.phones) state.phones = {}
        state.phones[id] = phone
        await setState(env, state)
      }
      return json({ ok: true, id })
    }

    if (path === '/whatsapp-webhook' && request.method === 'POST') {
      const body = await request.text()
      const params = new URLSearchParams(body)
      const from = (params.get('From') || '').replace('whatsapp:', '')
      const text = (params.get('Body') || '').trim().toUpperCase()
      const m = text.match(/^PRED\s+([A-Z0-9-]+)\s+(\d+)-(\d+)(?:\s+([A-Z]+))?/)
      if (m) {
        const [, rawId, hs, as, qual] = m
        const matchId = rawId.toLowerCase()
        const state = await getState(env)
        const phones = { ...(state.phones || {}), ...DEFAULT_PHONES }
        const playerId = Object.entries(phones).find(([, p]) => p === from || p === `+${from}`)?.[0]
        const match = MATCHES.find((x) => x.id === matchId)
        const minsUntil = match ? (new Date(match.kickoff).getTime() - Date.now()) / 60000 : -999
        if (playerId && match && !state.results?.[matchId] && minsUntil > LOCK_TARGET) {
          if (!state.predictions) state.predictions = {}
          if (!state.predictions[matchId]) state.predictions[matchId] = {}
          state.predictions[matchId][playerId] = {
            h: parseInt(hs),
            a: parseInt(as),
            qual: qual || null,
            savedAt: new Date().toISOString(),
            via: 'whatsapp',
          }
          await setState(env, state)
          const matchLabel = match.label || matchId
          await sendWA(env, from, `✅ *Πρόβλεψη αποθηκεύτηκε!*\n${matchLabel}: *${hs}–${as}*${qual ? ` · ${qual}` : ''}\n\nΚαλή επιτυχία! ⚽🍔`)
        } else if (!playerId) {
          await sendWA(env, from, '❌ Αριθμός δεν βρέθηκε. Μπες στην εφαρμογή.')
        } else if (!match) {
          await sendWA(env, from, `❌ Άγνωστο ματς \`${matchId}\`. Έλεγξε το ID.`)
        } else {
          await sendWA(env, from, '⏰ Προβλέψεις κλειδωμένες (15′ πριν / αγώνας ξεκίνησε).')
        }
      }
      return new Response('<?xml version="1.0"?><Response/>', { headers: { 'Content-Type': 'text/xml' } })
    }

    if (path === '/ping')
      return json({
        ok: true,
        version: 13,
        remind: REMIND_TARGETS,
        lock: LOCK_TARGET,
        newspaper: true,
        equalRoast: true,
        gazzetta: true,
        loginFixed: true,
        ts: new Date().toISOString(),
      })


    // Photorealistic stills — redirect to Unsplash (Twilio + <img> follow 302)
    if (path === '/newspaper-media' && request.method === 'GET') {
      const ymd = url.searchParams.get('date') || athensDate(new Date().toISOString())
      const slot = url.searchParams.get('slot') || 'hero'
      const round = parseInt(url.searchParams.get('r') || '0', 10) || 0
      const src = resolveMediaSlot(ymd, slot, round)
      return Response.redirect(src, 302)
    }

    // Public HTML front page (shareable teasing rag)
    if (path === '/newspaper' && request.method === 'GET') {
      const ymd = url.searchParams.get('date') || athensDate(new Date().toISOString())
      const round = parseInt(url.searchParams.get('r') || '0', 10) || 0
      const state = await getState(env)
      const users = await getAllUsers(env)
      const edition = buildEdition(ymd, MATCHES, { ...state, results: mergeResults(state) }, users, { round })
      return new Response(edition.html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60', ...CORS },
      })
    }

    // Admin: send yesterday/sample edition — default adminOnly=true for safety
    if (path === '/newspaper-test' && request.method === 'POST') {
      const user = await getUser(request, env)
      if (!user || user.role !== 'admin') return json({ error: 'Admin only' }, 403)
      const body = await request.json().catch(() => ({}))
      const ymd = body.date || athensYesterday()
      const adminOnly = body.adminOnly !== false
      const force = body.force !== false

      if (body.phone && typeof body.phone === 'string') {
        const state = await getState(env)
        if (!state.phones) state.phones = {}
        state.phones[user.id] = body.phone.trim()
        await setState(env, state)
      }

      {
        const state = await getState(env)
        if (!state.results) state.results = {}
        let changed = false
        // Optional explicit results from admin body (e.g. { "ucl-oly-1": { h:0, a:0 } })
        if (body.results && typeof body.results === 'object') {
          for (const [mid, score] of Object.entries(body.results)) {
            if (score && typeof score.h === 'number' && typeof score.a === 'number') {
              state.results[mid] = {
                ...(state.results[mid] || {}),
                h: score.h,
                a: score.a,
                qual: score.qual || state.results[mid]?.qual || null,
                source: 'newspaper-issue',
                fetchedAt: new Date().toISOString(),
              }
              changed = true
            }
          }
        }
        for (const m of MATCHES.filter((x) => athensDate(x.kickoff) === ymd)) {
          if (!state.results[m.id] && FALLBACK_RESULTS[m.id]) {
            state.results[m.id] = { ...FALLBACK_RESULTS[m.id], source: 'newspaper', fetchedAt: new Date().toISOString() }
            changed = true
          }
        }
        if (changed) await setState(env, state)
      }

      // Auto-bump round so each admin test feels like a fresh edition
      const roundKey = `newspaper-round:${ymd}`
      let round = body.round
      if (round == null) {
        round = parseInt((await env.KOUV.get(roundKey)) || '0', 10) || 0
        round += 1
        await env.KOUV.put(roundKey, String(round), { expirationTtl: 60 * 60 * 24 * 40 })
      }

      const out = await sendNewspaperEdition(env, { ymd, adminOnly, force, round })
      return json(out, out.ok || out.edition?.matchCount ? 200 : 400)
    }

    if (path === '/debug-espn' && request.method === 'GET') {
      const date = new URL(request.url).searchParams.get('date') || new Date().toISOString().substring(0, 10).replace(/-/g, '')
      const leagues = ['uefa.europa', 'uefa.europa.conf', 'uefa.champions', 'gre.1']
      const results = {}
      for (const lg of leagues) {
        try {
          const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${lg}/scoreboard?dates=${date}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(3000),
          })
          const data = await res.json()
          const events = data.events || []
          results[lg] = events.length
            ? events.map((e) => ({
                name: e.name,
                status: e.competitions?.[0]?.status?.type?.name,
                home: e.competitions?.[0]?.competitors?.find((c) => c.homeAway === 'home')?.team?.displayName,
                away: e.competitions?.[0]?.competitors?.find((c) => c.homeAway === 'away')?.team?.displayName,
              }))
            : 'empty'
        } catch (e) {
          results[lg] = 'error:' + e.message
        }
      }
      return json({ ok: true, date, results })
    }

    if (path === '/sl-fixtures' && request.method === 'GET') {
      try {
        const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/gre.1/scoreboard?limit=200', {
          headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
        })
        if (!res.ok) return json({ error: 'ESPN unavailable' }, 502)
        const data = await res.json()
        const events = (data.events || []).map((e) => {
          const comp = e.competitions?.[0]
          const home = comp?.competitors?.find((c) => c.homeAway === 'home')
          const away = comp?.competitors?.find((c) => c.homeAway === 'away')
          return {
            id: e.id,
            date: e.date,
            home: { abbr: home?.team?.abbreviation, name: home?.team?.displayName, score: home?.score },
            away: { abbr: away?.team?.abbreviation, name: away?.team?.displayName, score: away?.score },
            status: comp?.status?.type?.name,
            round: e.week?.number,
          }
        })
        return json({ ok: true, events })
      } catch (e) {
        return json({ error: e.message }, 500)
      }
    }

    if (path === '/sl-standings' && request.method === 'GET') {
      try {
        const res = await fetch('https://site.api.espn.com/apis/v2/sports/soccer/gre.1/standings', {
          headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
        })
        if (!res.ok) return json({ error: 'ESPN unavailable' }, 502)
        const data = await res.json()
        const teams = (data.standings?.[0]?.entries || []).map((e, idx) => ({
          rank: idx + 1,
          team: e.team?.abbreviation || e.team?.shortDisplayName || '',
          name: e.team?.displayName || '',
          played: e.stats?.find((s) => s.name === 'gamesPlayed')?.value || 0,
          won: e.stats?.find((s) => s.name === 'wins')?.value || 0,
          drawn: e.stats?.find((s) => s.name === 'ties')?.value || 0,
          lost: e.stats?.find((s) => s.name === 'losses')?.value || 0,
          gf: e.stats?.find((s) => s.name === 'pointsFor')?.value || 0,
          ga: e.stats?.find((s) => s.name === 'pointsAgainst')?.value || 0,
          pts: e.stats?.find((s) => s.name === 'points')?.value || 0,
          form: (e.stats?.find((s) => s.name === 'form')?.value || '').split('').slice(-5),
        }))
        return json({ ok: true, teams })
      } catch (e) {
        return json({ error: e.message }, 500)
      }
    }

    if (path === '/team-fixtures' && request.method === 'GET') {
      const teamId = new URL(request.url).searchParams.get('teamId')
      const league = new URL(request.url).searchParams.get('league') || 'gre.1'
      if (!teamId) return json({ error: 'Missing teamId' }, 400)
      try {
        const futRes = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/teams/${teamId}/schedule`, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        })
        const data = futRes.ok ? await futRes.json() : {}
        const events = (data.events || []).map((e) => ({
          id: e.id,
          date: e.date,
          home: e.competitions?.[0]?.competitors?.find((c) => c.homeAway === 'home')?.team?.abbreviation || '',
          away: e.competitions?.[0]?.competitors?.find((c) => c.homeAway === 'away')?.team?.abbreviation || '',
          homeScore: e.competitions?.[0]?.competitors?.find((c) => c.homeAway === 'home')?.score,
          awayScore: e.competitions?.[0]?.competitors?.find((c) => c.homeAway === 'away')?.score,
          status: e.competitions?.[0]?.status?.type?.name || '',
        }))
        return json({ ok: true, events })
      } catch (e) {
        return json({ error: e.message }, 500)
      }
    }

    if (path === '/set-live' && request.method === 'POST') {
      const user = await getUser(request, env)
      if (!user || user.role !== 'admin') return json({ error: 'Admin only' }, 403)
      const { matchId, h, a, min, final, clear } = await request.json()
      const state = await getState(env)
      if (clear) {
        delete state[`live_${matchId}`]
        await setState(env, state)
        return json({ ok: true, cleared: true })
      }
      if (final) {
        if (!state.results) state.results = {}
        state.results[matchId] = { h, a, source: 'manual', fetchedAt: new Date().toISOString() }
        delete state[`live_${matchId}`]
        await setState(env, state)
        return json({ ok: true, result: { h, a }, final: true })
      }
      if (h == null || a == null) return json({ error: 'h and a required (or clear:true)' }, 400)
      state[`live_${matchId}`] = { h, a, min: min || 0 }
      await setState(env, state)
      return json({ ok: true, live: { h, a, min }, final: false })
    }

    if (path === '/announce' && request.method === 'POST') {
      const user = await getUser(request, env)
      if (!user || user.role !== 'admin') return json({ error: 'Admin only' }, 403)
      const state = await getState(env)
      const phones = state.phones || {}
      const allUsers = await getAllUsers(env)
      const msg =
        `🏆 *KOUVADEIROS 2026/27*\n\n` +
        `⏳ *48 ΩΡΕΣ...*\n\n` +
        `Το μέλλον είναι ήδη εδώ 🔮\n\n` +
        `👉 https://kouvadeiros.pages.dev/\n\n` +
        `Αλήτες... 😈🍔`
      const results = []
      for (const [, u] of Object.entries(allUsers)) {
        const phone = phones[u.id]
        if (phone) {
          const wa = await sendWA(env, phone, msg)
          results.push({ name: u.name, ok: wa.ok, error: wa.error, sid: wa.sid })
        }
      }
      return json({ ok: true, sent: results })
    }

    // Admin: short WhatsApp ping with full Twilio diagnostics
    if (path === '/wa-test' && request.method === 'POST') {
      const user = await getUser(request, env)
      if (!user || user.role !== 'admin') return json({ error: 'Admin only' }, 403)
      const body = await request.json().catch(() => ({}))
      const state = await getState(env)
      const phone = body.phone || state.phones?.[user.id] || DEFAULT_PHONES[user.id]
      if (!phone) return json({ ok: false, error: 'no phone' }, 400)
      const msg =
        body.text ||
        `✅ *KOUVADEIROS WA TEST*\n\nΓεια σου ${user.name}. Αν το βλέπεις, το WhatsApp δουλεύει.\n_${new Date().toISOString()}_`
      const wa = await sendWA(env, phone, msg, body.media ? body.media : undefined)

      // Poll Twilio for final delivery status (queued → sent/delivered/undelivered)
      let delivery = null
      if (wa.sid && env.TWILIO_SID && env.TWILIO_TOKEN) {
        await new Promise((r) => setTimeout(r, 3500))
        try {
          const stRes = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_SID}/Messages/${wa.sid}.json`,
            { headers: { Authorization: 'Basic ' + btoa(`${env.TWILIO_SID}:${env.TWILIO_TOKEN}`) } },
          )
          delivery = await stRes.json()
        } catch (e) {
          delivery = { error: String(e?.message || e) }
        }
      }

      const finalStatus = delivery?.status || wa.status
      const errCode = delivery?.error_code
      const sandboxHint =
        errCode === 63015 ||
        errCode === 63016 ||
        errCode === 21211 ||
        String(delivery?.error_message || '')
          .toLowerCase()
          .includes('sandbox')

      return json({
        ok: wa.ok && (finalStatus === 'delivered' || finalStatus === 'sent' || finalStatus === 'queued' || finalStatus === 'read'),
        toEnds: String(phone).slice(-4),
        twilioFrom: (env.TWILIO_FROM || 'whatsapp:+14155238886').replace(/\d(?=\d{4})/g, '•'),
        sid: wa.sid,
        queuedStatus: wa.status,
        finalStatus,
        errorCode: errCode || null,
        errorMessage: delivery?.error_message || wa.error || null,
        sandboxLikely: sandboxHint || finalStatus === 'undelivered',
        fix:
          sandboxHint || finalStatus === 'undelivered'
            ? 'Άνοιξε WhatsApp → στείλε μήνυμα στο Twilio From number με κείμενο: join <ο κωδικός από Twilio Console → Messaging → Try it out → WhatsApp>. Μετά ξανατρέξε /wa-test.'
            : 'Αν δεν ήρθε ακόμα, περίμενε λίγο ή έλεγξε spam/blocked στο WhatsApp.',
      })
    }
    return new Response('Not found', { status: 404, headers: CORS })
  },
}
