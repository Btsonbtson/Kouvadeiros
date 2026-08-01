/**
 * KOUVADEIROS — Ο Κουβάς
 * Greek red-top tabloid. Provocative. Poisonous. Photorealistic web visuals.
 */

/** Known finals when KV lags (synced with Worker KNOWN + app seeds) */
export const FALLBACK_RESULTS = {
  'uel-paok-1': { h: 2, a: 3 },
  'uecl-pao-1': { h: 1, a: 2 },
  'uel-paok-2': { h: 2, a: 0, qual: 'PAOK' },
  'uecl-pao-2': { h: 2, a: 2, qual: 'PAO' },
}

/** Curated Unsplash stills — stadium drama + teasing vibes for tipsters */
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
    'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?auto=format&fit=crop&w=900&q=80',
  ],
  despair: [
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1486286701208-1d58e9339349?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=70&sat=-100',
  ],
  crowd: [
    'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80',
  ],
  /** Extra teasing cutouts — facepalm / empty / comedy energy */
  roast: [
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?auto=format&fit=crop&w=600&q=80',
  ],
  laugh: [
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=700&q=80',
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
  return arr[seed % arr.length]
}

export function pickVisuals(ymd, round = 0) {
  const s = hashSeed(`${ymd}:v${round}:kouvas`)
  const roastA = pickFrom(VISUAL_BANK.roast, s >> 2)
  const roastB = pickFrom(VISUAL_BANK.roast, s >> 5)
  const roastC = pickFrom(VISUAL_BANK.roast, s >> 9)
  return {
    hero: pickFrom(VISUAL_BANK.stadium, s),
    king: pickFrom(VISUAL_BANK.celebrate, s >> 3),
    donut: pickFrom(VISUAL_BANK.despair, s >> 7),
    strip: pickFrom(VISUAL_BANK.crowd, s >> 11),
    laugh: pickFrom(VISUAL_BANK.laugh, s >> 13),
    roast: [roastA, roastB, roastC].filter((u, i, a) => a.indexOf(u) === i),
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
  if (!pred || actual == null) return null
  const exact = pred.h === actual.h && pred.a === actual.a
  const correct = matchResult(pred.h, pred.a) === matchResult(actual.h, actual.a)
  const awardQual = opts.awardQual !== false && !!actual.qual
  const qualTip = opts.qualTip !== undefined ? opts.qualTip : pred?.qual
  const qualCorrect = !!(awardQual && qualTip && actual.qual && qualTip === actual.qual)
  const scorePts = (exact ? 1 : 0) + (correct ? 1 : 0)
  const qualPts = qualCorrect ? 1 : 0
  return { exact, correct, qualCorrect, scorePts, qualPts, points: scorePts + qualPts }
}

function scorePlayerMatchWorker(match, pred, actual, predictions, playerId) {
  if (!pred || actual == null) return null
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
      const sc = scorePlayerMatchWorker(match, pred, actual, state.predictions || {}, p.id)
      const pts = sc?.points ?? 0
      if (pred) dayPts[p.id] += pts
      if (sc?.exact) dayExact[p.id] += 1
      if (pred && pts === 0) dayMiss[p.id] += 1
      const leg1Id = getTieLeg1Id(match)
      const tipQual =
        parseTieMeta(match).leg === 2
          ? state.predictions?.[leg1Id]?.[p.id]?.qual
          : pred?.qual
      row.players.push({
        id: p.id,
        name: p.name,
        tip: pred ? `${pred.h}–${pred.a}${tipQual ? ' →' + tipQual : ''}` : 'ΧΩΡΙΣ ΠΡΟΒΛΕΨΗ',
        pts,
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

function pickHeadlines(ranking, matchRows, round = 0) {
  if (!ranking.length || !matchRows.length) {
    return {
      yell: 'ΣΙΩΠΗ!',
      splash: 'ΤΙΠΟΤΑ!',
      kicker: 'Κανένας αγώνας. Κανένα δράμα. Αηδία.',
      quote: '«Ο Κουβάς» σήμερα... άδειος. Όπως και κάποιοι από σας.',
      straps: ['Οι συντάκτες πήγαν για σουβλάκι. Εσείς για ύπνο.'],
      captions: {},
      playerLines: [],
      amok: 'ΑΜΟΚ: Ακυρώθηκε λόγω πλήξης.',
    }
  }

  const hero = ranking[0]
  const goat = ranking[ranking.length - 1]
  const seed = hashSeed(`${ranking.map((p) => p.id + p.pts).join('|')}:${round}`)

  const yellPool = ['ΔΑΓΚΩΝΕΙ!', 'ΣΦΑΖΕΙ!', 'ΚΑΕΙ!', 'ΤΡΟΜΟΣ!', 'ΒΟΗΘΕΙΑ!', 'ΕΚΡΗΞΗ!', 'ΧΑΟΣ!', 'ΔΗΛΗΤΗΡΙΟ!']
  const yell = yellPool[seed % yellPool.length]

  // Splash names the day — equal billing: table in one scream
  const tableSplash = ranking.map((p) => `${p.name.toUpperCase()} ${p.pts}`).join(' · ')
  const splashPool = [
    tableSplash,
    `${hero.name.toUpperCase()} ΜΠΡΟΣΤΑ — ΟΛΟΙ ΣΤΟ ΧΑΛΙ`,
    `ΙΣΟΙ ΣΤΗΝ ΕΙΡΩΝΕΙΑ`,
    `ΚΑΝΕΙΣ ΑΘΩΟΣ`,
  ]
  const splash = splashPool[(seed >> 4) % splashPool.length]

  // Kicker: name EVERY player with their day points (equal airtime)
  const kicker = ranking.map((p, i) => {
    const medal = i === 0 ? '👑' : i === ranking.length - 1 ? '🍩' : '😐'
    return `${medal} ${p.name} ${p.pts}πτ`
  }).join('  |  ')

  const names = ranking.map((p) => p.name)
  const quote = pickFrom(
    [
      `«${names.join(', ')}: τρεις προφήτες, μία κωμωδία.»`,
      `«Σήμερα μοιράσαμε δηλητήριο ισότιμα: ${names.join(' · ')}.»`,
      `«${hero.name} γέλασε, ${goat.name} έκλαψε, οι υπόλοιποι... υπήρχαν.»`,
      `«Ιερά Εξέταση προς ${names.join(', ')}: εξηγήστε τα tips σας. Τώρα.»`,
    ],
    seed >> 5,
  )

  // One match strap — then EQUAL per-player roast lines (same length energy)
  const straps = []
  for (const row of matchRows) {
    const tipsLine = row.players
      .map((pl) => `${pl.name} ${pl.tip}(+${pl.pts})`)
      .join(' · ')
    straps.push(`${row.label} ${row.score}${row.qual ? ' →' + row.qual : ''} ‖ ${tipsLine}`)
  }

  const playerLines = ranking.map((p, i) => {
    const role = i === 0 ? 'ΗΜΕΡΑΣ' : i === ranking.length - 1 ? 'ΝΤΟΝΑΤ' : 'ΜΕΣΑΙΟΣ'
    const bite = pickFrom(
      [
        `${p.name} (${role}): ${p.pts}πτ, ${p.exact} exact, ${p.misses} άκυρα. Ο Κουβάς σε είδε.`,
        `${p.name}: ${p.pts} πόντοι σήμερα. Ούτε άγιος ούτε μάρτυρας — απλά εκτεθειμένος.`,
        `${p.name} στα ${p.pts}. Κράτα το για την Ιερά Εξέταση.`,
        `${p.name} — ${p.pts}πτ. Ίση μεταχείριση: ίσο δηλητήριο.`,
      ],
      seed + i * 17 + p.name.length,
    )
    return bite
  })
  straps.push(...playerLines)

  const captions = {}
  for (let i = 0; i < ranking.length; i++) {
    const p = ranking[i]
    const others = ranking.filter((x) => x.id !== p.id).map((x) => x.name).join(' & ')
    if (i === 0) {
      captions[p.id] = pickFrom(
        [
          `${p.name} (${p.pts}πτ) — προσωρινός βασιλιάς. ${others} ήδη σχεδιάζουν εκδίκηση.`,
          `${p.name} κέρδισε τη μέρα με ${p.pts}. Μην το καμαρώνεις· ο Κουβάς γράφει και αύριο.`,
          `${p.name} στην κορυφή (${p.pts}). Οι άλλοι (${others}) τρώνε σκόνη — προς το παρόν.`,
        ],
        seed + i,
      )
    } else if (i === ranking.length - 1) {
      captions[p.id] = pickFrom(
        [
          `${p.name} (${p.pts}πτ) — πάτος σήμερα. ${others} χαμογελούν. Το μπέργκερ σε περιμένει.`,
          `${p.name} στο μηδενικό κλίμα (${p.pts}). Ίση κάλυψη: ίση ντροπή.`,
          `${p.name} έκλεισε τελευταίος (${p.pts}). Ο Κουβάς δεν κάνει εξαιρέσεις.`,
        ],
        seed + i,
      )
    } else {
      captions[p.id] = pickFrom(
        [
          `${p.name} (${p.pts}πτ) — μεσαία ζώνη. Ούτε δόξα ούτε έλεος. ${others} σε προσπερνούν ή σε κυνηγάνε.`,
          `${p.name} στα ${p.pts}: γκριζάδα υψηλής εντάσεως. Ο Κουβάς σε καρφώνει κι εσένα.`,
          `${p.name} — ${p.pts}πτ. Ίσο μερίδιο πρωτοσέλιδου, ίσο μερίδιο ειρωνείας.`,
        ],
        seed + i,
      )
    }
  }

  const amok = `ΑΜΟΚ ισότιμο: ${ranking.map((p) => `${p.name} ${p.pts}`).join(' · ')}. Κανείς δεν γλιτώνει.`

  return {
    yell,
    splash,
    kicker,
    quote,
    straps: straps.slice(0, 2 + ranking.length),
    captions,
    playerLines,
    amok,
  }
}

export function buildEdition(ymd, allMatches, state, users, opts = {}) {
  const round = opts.round ?? 0
  const dayMatches = matchesForDate(allMatches, ymd)
  const finished = dayMatches.filter((m) => resolveResult(state, m.id))
  const ledger = buildDayLedger(finished, state, users)
  const headlines = pickHeadlines(ledger.ranking, ledger.matchRows, round)
  const visuals = pickVisuals(ymd, round)
  const editionDate = formatEditionDate(ymd)
  const apiBase = opts.apiBase || 'https://kouvadeiros-api.jboikos.workers.dev'
  const html = renderHtml({
    ymd,
    editionDate,
    headlines,
    ledger,
    visuals,
    apiBase,
    unfinished: dayMatches.length - finished.length,
  })
  const waText = renderWhatsApp({ editionDate, headlines, ledger, round })
  return {
    ymd,
    editionDate,
    matchCount: finished.length,
    pending: dayMatches.length - finished.length,
    headlines,
    ranking: ledger.ranking,
    matchRows: ledger.matchRows,
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

function renderHtml({ ymd, editionDate, headlines, ledger, visuals, unfinished, apiBase }) {
  const heroP = ledger.ranking[0]
  const goat = ledger.ranking[ledger.ranking.length - 1]
  const round = visuals?.round || 0

  const standings = ledger.ranking
    .map(
      (p, i) =>
        `<tr class="${i === 0 ? 'top' : i === ledger.ranking.length - 1 ? 'bot' : ''}"><td>${i + 1}</td><td>${esc(p.name)}</td><td class="pts">${p.pts}</td><td>${p.exact}</td></tr>`,
    )
    .join('')

  const results = ledger.matchRows
    .map((m) => {
      const tips = m.players
        .map(
          (pl) =>
            `<div class="tip ${pl.pts === 0 ? 'miss' : pl.exact ? 'hit' : ''}"><b>${esc(pl.name)}</b> ${esc(pl.tip)} <span>+${pl.pts}</span></div>`,
        )
        .join('')
      return `<div class="result"><div class="scoreline">${esc(m.label)} <strong>${esc(m.score)}</strong>${m.qual ? ` · ${esc(m.qual)}` : ''}</div>${tips}</div>`
    })
    .join('')

  const roasts = ledger.ranking
    .map((p) => `<p class="roast"><span class="name">${esc(p.name).toUpperCase()}</span> ${esc(headlines.captions[p.id] || '')}</p>`)
    .join('')

  const straps = (headlines.straps || []).map((s) => `<li>${esc(s)}</li>`).join('')

  const heroImg = `${apiBase}/newspaper-media?date=${encodeURIComponent(ymd)}&slot=hero&r=${round}`
  const kingImg = `${apiBase}/newspaper-media?date=${encodeURIComponent(ymd)}&slot=king&r=${round}`
  const donutImg = `${apiBase}/newspaper-media?date=${encodeURIComponent(ymd)}&slot=donut&r=${round}`
  const stripImg = `${apiBase}/newspaper-media?date=${encodeURIComponent(ymd)}&slot=strip&r=${round}`
  const laughImg = `${apiBase}/newspaper-media?date=${encodeURIComponent(ymd)}&slot=laugh&r=${round}`
  const roastImgs = [0, 1, 2].map(
    (i) => `${apiBase}/newspaper-media?date=${encodeURIComponent(ymd)}&slot=roast${i}&r=${round}`,
  )
  const roastCaps = ledger.ranking.slice(0, 3).map((p, i) => {
    const tag = i === 0 ? 'ΗΜΕΡΑΣ' : i === ledger.ranking.length - 1 || i === 2 ? 'ΝΤΟΝΑΤ/ΟΥΡΑ' : 'ΜΕΣΑΙΟΣ'
    return `${p.name.toUpperCase()} · ${p.pts}πτ · ${tag}`
  })
  while (roastCaps.length < 3) roastCaps.push('ΙΣΟΤΙΜΟ ΔΗΛΗΤΗΡΙΟ')

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
    font-size: clamp(56px, 18vw, 96px); line-height: .82;
    color: var(--red); letter-spacing: -0.02em; text-transform: uppercase;
    -webkit-text-stroke: 3px #000;
    text-shadow: 4px 4px 0 #000; margin: 4px 0 8px;
  }
  .kicker {
    font-family: 'Oswald', sans-serif; font-weight: 700;
    font-size: clamp(15px, 3.8vw, 20px); line-height: 1.15;
    background: var(--yell); display: inline; padding: 2px 4px;
    box-decoration-break: clone; -webkit-box-decoration-break: clone;
  }
  .quote {
    margin-top: 12px; font-size: 14px; font-weight: 900; line-height: 1.25;
    border-left: 5px solid var(--red); padding-left: 10px;
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
  .strip {
    height: 72px; overflow:hidden; border-bottom: 4px solid #000; position:relative;
  }
  .strip img { width:100%; height:100%; object-fit:cover; filter: contrast(1.1); }
  .strip .cap {
    position:absolute; left:10px; bottom:8px; background:var(--red); color:#fff;
    font-size:11px; font-weight:900; padding:3px 8px; text-transform:uppercase;
  }
  .tease-row {
    display:grid; grid-template-columns: 1fr 1fr 1fr; gap:0;
    border-bottom: 4px solid #000;
  }
  .tease {
    position:relative; min-height: 120px; overflow:hidden; border-right: 3px solid #000;
  }
  .tease:last-child { border-right: none; }
  .tease img { width:100%; height:100%; object-fit:cover; min-height:120px; display:block; }
  .tease .tag {
    position:absolute; left:6px; right:6px; bottom:6px;
    background: var(--yell); color:#000; font-size:10px; font-weight:900;
    padding:4px 6px; border:2px solid #000; line-height:1.2; text-transform:uppercase;
  }
  .tease.shame img { filter: grayscale(1) contrast(1.15); }
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
  .grid { display:grid; grid-template-columns: 1.15fr .85fr; }
  @media (max-width:560px){ .grid { grid-template-columns:1fr; } }
  .col { padding: 12px; border-right: 3px solid #000; }
  .col:last-child { border-right: none; background: #fafafa; }
  @media (max-width:560px){ .col { border-right:none; border-bottom:3px solid #000; } }
  h2 {
    font-family: 'Archivo Black', Impact, sans-serif;
    font-size: 13px; letter-spacing: .08em; margin: 0 0 8px;
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
  td.pts { font-family:'Anton',Impact,sans-serif; font-size:22px; color:var(--red); }
  .result { margin-bottom: 10px; padding-bottom:8px; border-bottom:2px dashed #999; }
  .scoreline { font-weight:900; font-size:14px; margin-bottom:4px; }
  .tip { font-size:12px; display:flex; justify-content:space-between; gap:8px; padding:2px 0; font-weight:700; }
  .tip.miss { color:#9b0000; }
  .tip.hit { color:#0a5c2b; }
  .roast { font-size:13px; line-height:1.3; margin:0 0 10px; font-weight:700; }
  .roast .name { color:var(--red); font-weight:900; background: var(--yell); padding:0 3px; }
  .amok {
    margin: 12px auto; padding: 14px; border: 4px solid #000; border-radius: 50%;
    width: min(220px, 70vw); height: min(220px, 70vw);
    background: var(--red); color: var(--yell);
    display:flex; align-items:center; justify-content:center; text-align:center;
    font-family: 'Archivo Black', Impact, sans-serif; font-size: 15px; line-height: 1.25;
    box-shadow: 6px 6px 0 #000; transform: rotate(-4deg);
  }
  .footer {
    margin: 0; padding: 10px 14px; background:#000; color:#fff;
    font-size: 11px; font-weight:900; text-transform:uppercase;
    display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap;
  }
  .warn { background: var(--yell); color:#000; padding:8px 14px; font-size:12px; font-weight:900; border-bottom:3px solid #000; }
  .credit { font-size:9px; color:#666; margin-top:8px; font-weight:700; }
</style>
</head>
<body>
  <article class="page">
    <header class="mast">
      <div class="meta">Φύλλο<br/>#${round + 1}<br/>1 🍔</div>
      <div class="brand">Ο Κουβάς<span>το πιο δηλητηριώδες φύλλο του Κουβαδέιρου</span></div>
      <div class="barcode" title="barcode"></div>
    </header>
    <div class="datebar">
      <span>${esc(editionDate)}</span>
      <span>ΕΚΤΑΚΤΗ · ΓΥΡΟΣ ${round + 1} · ΜΟΝΟ ΓΙΑ ΦΙΛΟΥΣ</span>
    </div>
    ${unfinished ? `<div class="warn">${unfinished} αγώνες ακόμα ανοιχτοί — το δηλητήριο μπορεί να δυναμώσει</div>` : ''}
    <section class="hero">
      <div class="hero-copy">
        <div class="yell">${esc(headlines.yell || 'ΔΑΓΚΩΝΕΙ!')}</div>
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
    <div class="strip">
      <img src="${esc(stripImg)}" alt="crowd"/>
      <div class="cap">Ατμόσφαιρα Κουβά · χωρίς φίλτρο</div>
    </div>
    <div class="tease-row">
      <div class="tease">
        <img src="${esc(roastImgs[0])}" alt="roast1"/>
        <div class="tag">${esc(roastCaps[0])}</div>
      </div>
      <div class="tease shame">
        <img src="${esc(roastImgs[1])}" alt="roast2"/>
        <div class="tag">${esc(roastCaps[1])}</div>
      </div>
      <div class="tease">
        <img src="${esc(roastImgs[2])}" alt="roast3"/>
        <div class="tag">${esc(roastCaps[2])}</div>
      </div>
    </div>
    <div class="laugh-banner">
      <img src="${esc(laughImg)}" alt="laugh"/>
      <div class="laugh-copy">${esc(headlines.amok || 'ΑΜΟΚ — κανείς δεν γλιτώνει απόψε.')}</div>
    </div>
    <div class="grid">
      <div class="col">
        <h2>ΜΕΣΑ</h2>
        <ul class="straps">${straps}</ul>
        <h2 style="margin-top:14px">Η ΕΞΟΝΤΩΣΗ</h2>
        ${roasts}
        <div class="amok">${esc(headlines.amok || '')}</div>
        <p class="credit">Φωτο: Unsplash · επεξεργασία Ο Κουβάς</p>
      </div>
      <div class="col">
        <h2>ΒΑΘΜΟΛΟΓΙΑ ΗΜΕΡΑΣ</h2>
        <table>
          <thead><tr><th>#</th><th>Προφήτης</th><th>Πτ</th><th>X</th></tr></thead>
          <tbody>${standings}</tbody>
        </table>
        <h2 style="margin-top:14px">ΑΠΟΤΕΛΕΣΜΑΤΑ</h2>
        ${results || '<p>Τίποτα ακόμα. Ύποπτο.</p>'}
      </div>
    </div>
    <footer class="footer">
      <span>Ακατάλληλο για ευαίσθητους</span>
      <span>kouvadeiros.pages.dev</span>
    </footer>
  </article>
</body>
</html>`
}

function renderWhatsApp({ editionDate, headlines, ledger, round = 0 }) {
  const table = ledger.ranking
    .map((p, i) => `${i + 1}. *${p.name}* — *${p.pts}*πτ`)
    .join('\n')

  const results = ledger.matchRows
    .map((m) => {
      const tips = m.players.map((pl) => `  ${pl.name}: ${pl.tip} (+${pl.pts})`).join('\n')
      return `*${m.label}*  ${m.score}${m.qual ? ' · ' + m.qual : ''}\n${tips}`
    })
    .join('\n\n')

  const straps = (headlines.straps || []).map((s) => `• ${s}`).join('\n')

  return (
    `*Ο ΚΟΥΒΑΣ* · γύρος ${round + 1}\n_${editionDate}_\n\n` +
    `*${headlines.yell || ''} ${headlines.splash}*\n` +
    `${headlines.kicker}\n\n` +
    `${headlines.quote}\n\n` +
    `${straps}\n\n` +
    `*${headlines.amok}*\n\n` +
    `*ΒΑΘΜΟΛΟΓΙΑ ΗΜΕΡΑΣ*\n${table}\n\n` +
    `*ΑΠΟΤΕΛΕΣΜΑΤΑ*\n${results}\n\n` +
    `_Στείλ' το. Κανείς δεν γλιτώνει._\n` +
    `kouvadeiros.pages.dev`
  )
}

export function shouldSendNewspaper(allMatches, state, ymd, now = Date.now(), graceMin = 150) {
  const day = matchesForDate(allMatches, ymd)
  if (!day.length) return false
  const finished = day.filter((m) => resolveResult(state, m.id))
  if (finished.length < day.length) return false
  const lastKo = Math.max(...day.map((m) => new Date(m.kickoff).getTime()))
  return now >= lastKo + graceMin * 60000
}

export function resolveMediaSlot(ymd, slot, round = 0) {
  const v = pickVisuals(ymd, round)
  if (slot === 'king') return v.king
  if (slot === 'donut') return v.donut
  if (slot === 'strip') return v.strip
  if (slot === 'laugh') return v.laugh
  if (slot === 'roast0') return v.roast[0] || v.strip
  if (slot === 'roast1') return v.roast[1] || v.hero
  if (slot === 'roast2') return v.roast[2] || v.donut
  return v.hero
}
