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
  pollGazzettaForMatches,
  getGazzettaHealth,
  setGazzettaHealth,
  gazzettaIsHealthy,
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

function buildDramaMessages(beneficiary, allPlayers, matchLabel, newScore, minute, isOsana, thavmaStats) {
  const msgs = {}
  const type = isOsana ? 'ΩΣΑΝΑ 🙌' : 'ΘΑΥΜΑ ⚡'
  const lucky_pool = isOsana ? OSANA_LUCKY : THAVMA_LUCKY
  const unlucky_pool = isOsana ? OSANA_UNLUCKY : THAVMA_UNLUCKY

  for (const [pid] of Object.entries(allPlayers)) {
    const isLucky = pid === beneficiary.id
    const stats = thavmaStats[pid] || { benefited: 0, pts_gained: 0, pts_lost: {} }

    if (isLucky) {
      const personalMsg = rand(lucky_pool)
      msgs[pid] =
        `${type} *${beneficiary.name}!*\n\n` +
        `⚽ *${matchLabel}* · ${newScore.h}–${newScore.a} (${minute}')\n\n` +
        `${personalMsg}\n\n` +
        `📊 Θαύματά σου φέτος: *${stats.benefited + 1}* · Πόντοι από θαύματα: *${stats.pts_gained + 1}*`
    } else {
      const rivalMsg = rand(unlucky_pool)
      const myLost = sumPtsLost(thavmaStats[pid]?.pts_lost) + 1
      msgs[pid] =
        `${type} *${beneficiary.name}!*\n\n` +
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
  // Παναθηναϊκός–ΤΣΣΚΑ 1948 Q3: Τετ 5/8 21:30 · Τρί 11/8 ώρα TBA
  { id: 'uecl-pao-3', kickoff: '2026-08-05T18:30:00Z', label: 'ΠΑΟ vs CSKA 1948', espnLeague: 'uefa.europa.conf', homeTeam: 'Panathinaikos', awayTeam: 'CSKA 1948' },
  { id: 'uecl-pao-4', kickoff: '2026-08-11T18:00:00Z', label: 'CSKA 1948 vs ΠΑΟ', espnLeague: 'uefa.europa.conf', homeTeam: 'CSKA 1948', awayTeam: 'Panathinaikos', timeTbd: true },
  // ΠΑΟΚ–Άντερλεχτ Q3: Πέμ 6/8 20:45 · Πέμ 13/8 21:30
  { id: 'uel-paok-3', kickoff: '2026-08-06T17:45:00Z', label: 'ΠΑΟΚ vs Άντερλεχτ', espnLeague: 'uefa.europa', homeTeam: 'PAOK', awayTeam: 'Anderlecht' },
  { id: 'uel-paok-4', kickoff: '2026-08-13T18:30:00Z', label: 'Άντερλεχτ vs ΠΑΟΚ', espnLeague: 'uefa.europa', homeTeam: 'Anderlecht', awayTeam: 'PAOK' },
  // ΑΕΚ UCL playoffs — αντίπαλος TBA
  { id: 'ucl-aek-1', kickoff: '2026-08-19T18:00:00Z', label: 'ΑΕΚ vs TBD', espnLeague: 'uefa.champions', homeTeam: 'AEK Athens', awayTeam: 'TBD', timeTbd: true },
  { id: 'ucl-aek-2', kickoff: '2026-08-26T18:00:00Z', label: 'TBD vs ΑΕΚ', espnLeague: 'uefa.champions', homeTeam: 'TBD', awayTeam: 'AEK Athens', timeTbd: true },
  // ΟΦΗ UEL playoffs — Πέμ 20/8 & 27/8 (όχι σήμερα)
  { id: 'uel-ofi-1', kickoff: '2026-08-20T18:00:00Z', label: 'ΟΦΗ · UEL PO Leg 1', espnLeague: 'uefa.europa', homeTeam: 'OFI', awayTeam: 'TBD', timeTbd: true },
  { id: 'uel-ofi-2', kickoff: '2026-08-27T18:00:00Z', label: 'ΟΦΗ · UEL PO Leg 2', espnLeague: 'uefa.europa', homeTeam: 'TBD', awayTeam: 'OFI', timeTbd: true },
  // Super League MD1 (Dnews / Super League, 28/7/2026)
  { id: 'sl-1-1', kickoff: '2026-08-22T17:00:00Z', label: 'ΑΕΚ vs ΗΡΑ', espnLeague: 'gre.1', homeTeam: 'AEK Athens', awayTeam: 'Iraklis' },
  { id: 'sl-1-2', kickoff: '2026-08-22T17:00:00Z', label: 'ΚΑΛ vs ΑΡΗΣ', espnLeague: 'gre.1', homeTeam: 'Kalamata', awayTeam: 'Aris' },
  { id: 'sl-1-3', kickoff: '2026-08-22T19:00:00Z', label: 'ΟΛΥ vs ΑΤΡ', espnLeague: 'gre.1', homeTeam: 'Olympiacos', awayTeam: 'Atromitos' },
  { id: 'sl-1-4', kickoff: '2026-08-23T16:30:00Z', label: 'ΟΦΗ vs ΒΟΛ', espnLeague: 'gre.1', homeTeam: 'OFI', awayTeam: 'Volos' },
  { id: 'sl-1-5', kickoff: '2026-08-23T18:00:00Z', label: 'ΠΑΟ vs ΚΗΦ', espnLeague: 'gre.1', homeTeam: 'Panathinaikos', awayTeam: 'AE Kifisia' },
  { id: 'sl-1-6', kickoff: '2026-08-23T18:30:00Z', label: 'ΠΝΕ vs ΑΣΤ', espnLeague: 'gre.1', homeTeam: 'Panetolikos', awayTeam: 'Asteras Tripolis' },
  { id: 'sl-1-7', kickoff: '2026-08-23T18:00:00Z', label: 'ΠΑΟΚ vs ΛΕΒ', espnLeague: 'gre.1', homeTeam: 'PAOK', awayTeam: 'Levadiakos' },
]

/** WhatsApp reminder offsets (minutes before kickoff) */
const REMIND_TARGETS = [30, 20]
/** Lock + reveal all predictions (minutes before kickoff) */
const LOCK_TARGET = 15

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
        version: 8,
      }
  const before = JSON.stringify(state.phones || {})
  state.phones = { ...DEFAULT_PHONES, ...(state.phones || {}) }
  // Persist merged phones once so KV is the source of truth
  if (JSON.stringify(state.phones) !== before) {
    await env.KOUV.put('state', JSON.stringify(state))
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
function scoreMatch(pred, actual, opts = {}) {
  // No tip on file = disqualified for this match (never treat missing as 0–0)
  if (!pred || actual == null) return null
  if (typeof pred.h !== 'number' || typeof pred.a !== 'number') return null
  const exact = pred.h === actual.h && pred.a === actual.a
  const correct = matchResult(pred.h, pred.a) === matchResult(actual.h, actual.a)
  const awardQual = opts.awardQual !== false && !!actual.qual
  const qualTip = opts.qualTip !== undefined ? opts.qualTip : pred?.qual
  const qualCorrect = !!(awardQual && qualTip && actual.qual && qualTip === actual.qual)
  const scorePts = (exact ? 1 : 0) + (correct ? 1 : 0)
  const qualPts = qualCorrect ? 1 : 0
  return { exact, correct, qualCorrect, scorePts, qualPts, points: scorePts + qualPts }
}

function mergeResults(state) {
  return { ...FALLBACK_RESULTS, ...(state.results || {}) }
}

/** Keep qual / OT / pen fields when ESPN auto-writes FT (they are not in live feed). */
function buildAutoResult(matchId, score, prev) {
  const prior = prev || FALLBACK_RESULTS[matchId] || {}
  return {
    h: score.h,
    a: score.a,
    overtime: score.isAET || prior.overtime || false,
    otH: prior.otH ?? null,
    otA: prior.otA ?? null,
    penalties: score.isPen || prior.penalties || false,
    penH: prior.penH ?? null,
    penA: prior.penA ?? null,
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
    const isFinal = status === 'STATUS_FINAL'
    const isHT = status === 'STATUS_HALFTIME'
    const isInProg = status === 'STATUS_IN_PROGRESS'
    const isAET = isFinal && (detail.toLowerCase().includes('aet') || detail.toLowerCase().includes('extra'))
    const isPen = isFinal && (detail.toLowerCase().includes('pen') || detail.toLowerCase().includes('penalty'))
    return { status, isFinal, isHT, isInProgress: isInProg, isAET, isPen, h, a, minute, detail }
  } catch {
    return null
  }
}

// ── CRON: every 1′ (* * * * *) — Gazzetta + reminders / live scores ──────────
export default {
  async scheduled(event, env, ctx) {
    const now = Date.now()
    const state = await getState(env)
    const phones = state.phones || {}
    const users = await getAllUsers(env)
    // Keep 5′ buckets for WhatsApp dedup so 1′ cron doesn't re-fire the same reminder
    const windowKey = `cron:${Math.floor(now / 300000)}`
    const sent = JSON.parse((await env.KOUV.get(windowKey)) || '{}')
    let stateChanged = false

    if (!state.thavmaStats) state.thavmaStats = {}

    const playerNames = {}
    for (const u of Object.values(users)) playerNames[u.id] = u.name

    // Ops band: reminders/lock from 40′ before KO; live scores through +200′ after KO.
    // Skip the whole match loop when nothing is in that band (idle days).
    const anyOps = MATCHES.some((m) => {
      if (m.timeTbd) return false
      const minsUntil = (new Date(m.kickoff).getTime() - now) / 60000
      // Reminders from ~40′ before (covers 30′/20′); live scores through +200′ after KO
      return minsUntil <= 40 && minsUntil >= -200
    })

    if (anyOps) {
    // Gazzetta first (default ON) — one schedule+live poll for all matches in band
    let gzScores = {}
    const gzHealth = await getGazzettaHealth(env)
    if (gzHealth.enabled !== false) {
      try {
        const bandMatches = MATCHES.filter((m) => {
          if (m.timeTbd) return false
          const minsUntil = (new Date(m.kickoff).getTime() - now) / 60000
          return minsUntil <= 15 && minsUntil >= -200
        })
        const poll = await pollGazzettaForMatches(bandMatches.length ? bandMatches : MATCHES)
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

    for (const match of MATCHES) {
      if (match.timeTbd) continue
      const kickoff = new Date(match.kickoff).getTime()
      const minsUntil = (kickoff - now) / 60000
      if (minsUntil > 40 || minsUntil < -200) continue

      // ── AUTO SCORE + ΘΑΥΜΑ/ΩΣΑΝΑ — 15′ warm-up → +200′ (until final) ──
      const minsAfter = -minsUntil
      if (minsAfter >= -15 && minsAfter <= 200) {
        const already = state.results?.[match.id]
        if (!already || already.source === 'auto') {
          const score = gzScores[match.id] || (await fetchESPNScore(match))
          if (score) {
            const prev = state.results?.[match.id]
            const prevH = prev?.h ?? null
            const prevA = prev?.a ?? null
            const scoreChanged = prevH !== score.h || prevA !== score.a
            const isLate = score.minute >= 85
            const isInjury = score.minute >= 90

            if (scoreChanged && isLate && !score.isFinal) {
              const newScore = { h: score.h, a: score.a }
              const dramaKey = `drama:${match.id}:${score.h}-${score.a}`

              if (!sent[dramaKey]) {
                const preds = state.predictions?.[match.id] || {}

                for (const [pid, pred] of Object.entries(preds)) {
                  const prevSc = prev ? scoreMatch(pred, { h: prevH, a: prevA }) : { points: 0 }
                  const newSc = scoreMatch(pred, newScore)
                  const gained = (newSc?.points || 0) > (prevSc?.points || 0)

                  if (gained) {
                    const beneficiary = { id: pid, name: playerNames[pid] || pid }
                    const type = isInjury ? 'ΩΣΑΝΑ' : 'ΘΑΥΜΑ'
                    const ptsGained = (newSc?.points || 0) - (prevSc?.points || 0)

                    if (!state.thavmaStats[pid]) state.thavmaStats[pid] = { benefited: 0, pts_gained: 0, pts_lost: {} }
                    state.thavmaStats[pid].benefited = (state.thavmaStats[pid].benefited || 0) + 1
                    state.thavmaStats[pid].pts_gained = (state.thavmaStats[pid].pts_gained || 0) + ptsGained

                    for (const otherId of Object.values(BASE_USERS).map((u) => u.id)) {
                      if (otherId !== pid) {
                        if (!state.thavmaStats[otherId]) state.thavmaStats[otherId] = { benefited: 0, pts_gained: 0, pts_lost: {} }
                        if (!state.thavmaStats[otherId].pts_lost) state.thavmaStats[otherId].pts_lost = {}
                        state.thavmaStats[otherId].pts_lost[pid] = (state.thavmaStats[otherId].pts_lost[pid] || 0) + ptsGained
                      }
                    }
                    stateChanged = true

                    const dramaMessages = buildDramaMessages(
                      beneficiary,
                      playerNames,
                      match.label,
                      newScore,
                      score.minute,
                      isInjury,
                      state.thavmaStats,
                    )

                    for (const [mpid, msg] of Object.entries(dramaMessages)) {
                      const phone = phones[mpid]
                      if (phone) await sendWA(env, phone, `${isInjury ? '🙌' : '⚡'} *${type}!*\n\n${msg}`)
                    }

                    sent[dramaKey] = true
                    console.log(`${type} sent for ${match.id}: ${pid} benefited`)
                  }
                }
              }
            }

            if (score.isFinal) {
              const result = buildAutoResult(match.id, score, prev)
              result.fetchedAt = new Date(now).toISOString()
              const changed = !prev || prev.h !== score.h || prev.a !== score.a || (!prev.qual && result.qual)
              if (changed) {
                if (!state.results) state.results = {}
                state.results[match.id] = result
                delete state[`live_${match.id}`]
                stateChanged = true
                if (!sent[`ft:${match.id}`]) {
                  const ot = score.isAET ? ' (AET)' : ''
                  const pen = score.isPen ? ' · Pen' : ''
                  const q = result.qual ? ` · →${result.qual}` : ''
                  const msg = `🏁 *Αποτέλεσμα!*\n\n⚽ *${match.label}*\n*${score.h}–${score.a}*${ot}${pen}${q}\n\nΔες τους πόντους: kouvadeiros.pages.dev`
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
              state[`live_${match.id}`] = { h: score.h, a: score.a, min: score.minute }
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
            return `${uname}: *${p.h}\u2013${p.a}*${p.qual ? ' (\u2192' + p.qual + ')' : ''}`
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
      console.log('cron idle — no match in ops band (40′ before → 200′ after KO)')
      // Keep Gazzetta health green even on idle days (cheap poll)
      const gzHealth = await getGazzettaHealth(env)
      if (gzHealth.enabled !== false) {
        try {
          const poll = await pollGazzettaForMatches([])
          await setGazzettaHealth(env, {
            ...gzHealth,
            enabled: true,
            lastOk: new Date(now).toISOString(),
            lastError: null,
            lastPoll: new Date(now).toISOString(),
            scheduleCount: poll.scheduleCount,
            liveFeedCount: poll.liveFeedCount,
            matchedLive: 0,
            matchedTotal: 0,
          })
        } catch (e) {
          await setGazzettaHealth(env, {
            ...gzHealth,
            lastError: String(e?.message || e),
            lastPoll: new Date(now).toISOString(),
          })
        }
      }
    }

    // ── Ο ΚΟΥΒΑΣ — end-of-day tabloid (once per Athens calendar day) ──
    try {
      const todayAthens = athensDate(new Date(now).toISOString())
      if (shouldSendNewspaper(MATCHES, { ...state, results: mergeResults(state) }, todayAthens, now)) {
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
  async fetch(request, env) {
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
      const state = await getState(env)
      const phone = state.phones?.[user.id]
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
        welcomed[user.id] = new Date().toISOString()
        state.welcomed = welcomed
        await setState(env, state)
      }
      return json({ token, name: user.name, id: user.id, email, role: user.role || 'player', phone: phone || null })
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
      const { matchId, h, a, qual, predOT, otH, otA, predPen, penH, penA } = await request.json()
      const match = MATCHES.find((m) => m.id === matchId)
      if (match) {
        const minsUntil = (new Date(match.kickoff).getTime() - Date.now()) / 60000
        if (minsUntil <= LOCK_TARGET) return json({ error: 'Predictions locked (15′ before kickoff)' }, 403)
      }
      const state = await getState(env)
      if (!state.predictions) state.predictions = {}
      if (!state.predictions[matchId]) state.predictions[matchId] = {}
      state.predictions[matchId][user.id] = { h, a, qual, predOT, otH, otA, predPen, penH, penA, savedAt: new Date().toISOString() }
      await setState(env, state)
      return json({ ok: true })
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

    if (path === '/fetch-scores' && request.method === 'POST') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const { matchId } = await request.json()
      const match = MATCHES.find((m) => m.id === matchId)
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
      if (score?.isFinal) {
        state.results[matchId] = buildAutoResult(matchId, score, state.results[matchId])
        delete state[`live_${matchId}`]
        await setState(env, state)
        return json({ ok: true, result: state.results[matchId], final: true, source: score.source || 'espn' })
      }
      if (score && score.h !== undefined) {
        state[`live_${matchId}`] = { h: score.h, a: score.a, min: score.minute || 0 }
        await setState(env, state)
        return json({
          ok: true,
          live: { h: score.h, a: score.a, min: score.minute },
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
        note: 'Runs on Cloudflare cron every 1′ (default ON). Toggle does not start local Python.',
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
            if (score.isFinal) {
              if (!state.results) state.results = {}
              state.results[match.id] = buildAutoResult(match.id, score, state.results[match.id])
              delete state[`live_${match.id}`]
              changed = true
            } else {
              state[`live_${match.id}`] = { h: score.h, a: score.a, min: score.minute || 0 }
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
        version: 11,
        remind: REMIND_TARGETS,
        lock: LOCK_TARGET,
        newspaper: true,
        equalRoast: true,
        gazzetta: true,
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
