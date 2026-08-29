import { mergeSeededPredictions, applyTipResultLocks, LEAGUE_PHASE_TEAMS, BRACKET_OPTIONS } from './data.js'

const WORKER_BASE = (typeof __WORKER_URL__ !== 'undefined' && __WORKER_URL__)
  ? __WORKER_URL__
  : 'https://kouvadeiros-api.jboikos.workers.dev'
const SCORES_BASE = (typeof __SCORES_URL__ !== 'undefined' && __SCORES_URL__)
  ? __SCORES_URL__
  : 'https://kouvadeiros-scores.jboikos.workers.dev'
/** Same-origin Pages Functions bridge — fallback ONLY, see workerLoginSafe(). */
const BRIDGE_BASE = '/api'

/** True when a `/api` bridge could plausibly exist at this origin (Pages deploy or explicit override). */
function bridgeAvailableHost() {
  try {
    if (typeof window === 'undefined') return false
    if (window.__KOUV_API_BASE__) return true
    const h = String(window.location?.hostname || '')
    return h.endsWith('.pages.dev')
  } catch {
    return false
  }
}

// Real Worker is the primary backend; resolved dynamically by workerLoginSafe()
// on every login/upgrade attempt (worker healthy → BASE=WORKER_BASE, bridgeMode=false;
// worker down → BASE=BRIDGE_BASE, bridgeMode=true). Defaults to Worker so a stale
// module (before any probe has run) never silently assumes the bridge.
let BASE = WORKER_BASE

const OFFLINE_PREDS_KEY = 'kouv_offline_preds'
const OFFLINE_BRACKETS_KEY = 'kouv_offline_brackets'

/**
 * Original CareDirect roster — same passwords as worker BASE_USERS.
 * Pages falls back to local auth only when Worker login is unreachable.
 */
const LOCAL_USERS = {
  'boikos.y@caredirect.com': { password: '1453', name: 'Boikos', id: 'boikos', role: 'admin' },
  'mavromichalis.y@caredirect.com': { password: '1821', name: 'Mavromichalis', id: 'mavromichalis', role: 'player' },
  'chousiadas.th@caredirect.com': { password: '1940', name: 'Chousiadas', id: 'chousiadas', role: 'player' },
  // Aliases people actually type
  'chousiadas@caredirect.com': { password: '1940', name: 'Chousiadas', id: 'chousiadas', role: 'player' },
  'chousiadas.t@caredirect.com': { password: '1940', name: 'Chousiadas', id: 'chousiadas', role: 'player' },
  boikos: { password: '1453', name: 'Boikos', id: 'boikos', role: 'admin' },
  mavromichalis: { password: '1821', name: 'Mavromichalis', id: 'mavromichalis', role: 'player' },
  chousiadas: { password: '1940', name: 'Chousiadas', id: 'chousiadas', role: 'player' },
}

const LOCAL_PHONES = {
  boikos: '+306932377969',
  chousiadas: '+306932662864',
  mavromichalis: '+306932851343',
}

/** Browser tip ledger — Pages Functions cannot reliably reach ntfy (TLS 525). */
const NTFY_TOPIC = 'kouvadeiros-tips-bridge-2026'
const NTFY_HOSTS = [
  'https://ntfy.adminforge.de',
  'https://ntfy.envs.net',
]

let bridgeMode = false

export function isBridgeToken(t = token()) {
  return String(t || '').startsWith('br.')
}

async function publishClientTip(event) {
  let lastErr = null
  for (const host of NTFY_HOSTS) {
    try {
      const res = await fetch(`${host}/${NTFY_TOPIC}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Title: event.type || 'tip' },
        body: JSON.stringify(event),
      })
      if (res.ok) return true
      lastErr = new Error(`ntfy ${res.status}`)
    } catch (e) {
      lastErr = e
    }
  }
  if (lastErr) throw lastErr
  return false
}

// Throttle: ntfy has a per-IP rate limit. Even a well-behaved 8s live-poll
// loop from several devices can exhaust it; a stuck/looping caller must
// never be able to hammer it. Never actually poll more than once per window,
// and reuse the in-flight promise so concurrent callers share one request.
const POLL_MIN_INTERVAL_MS = 12000
let lastPollAt = 0
let lastPollEvents = []
let inFlightPoll = null

async function pollClientTipsNow() {
  const events = []
  for (const host of NTFY_HOSTS) {
    try {
      const res = await fetch(`${host}/${NTFY_TOPIC}/json?poll=1&since=48h`, {
        headers: { Accept: 'application/x-ndjson, application/json' },
      })
      if (!res.ok) continue
      const text = await res.text()
      for (const line of text.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed) continue
        try {
          const wrap = JSON.parse(trimmed)
          if (wrap.event && wrap.event !== 'message') continue
          const msg = typeof wrap.message === 'string' ? JSON.parse(wrap.message) : wrap.message
          if (msg && typeof msg === 'object') events.push(msg)
        } catch { /* skip */ }
      }
      if (events.length) break
    } catch { /* try next host */ }
  }
  return events
}

async function pollClientTips() {
  const now = Date.now()
  if (now - lastPollAt < POLL_MIN_INTERVAL_MS) return lastPollEvents
  if (inFlightPoll) return inFlightPoll
  inFlightPoll = pollClientTipsNow()
    .then((events) => {
      lastPollAt = Date.now()
      lastPollEvents = events
      return events
    })
    .finally(() => { inFlightPoll = null })
  return inFlightPoll
}

function mergeTipEventsIntoState(state, events) {
  const predictions = { ...(state?.predictions || {}) }
  const results = { ...(state?.results || {}) }
  const revealed = { ...(state?.revealed || {}) }
  const brackets = Object.fromEntries(
    Object.entries(state?.brackets || {}).map(([team, byPlayer]) => [team, { ...(byPlayer || {}) }]),
  )
  const bracketResults = { ...(state?.bracketResults || {}) }
  const chatEvents = []
  for (const ev of events || []) {
    const isTip =
      ev.type === 'tip' ||
      (!ev.type && ev.matchId && ev.playerId && typeof ev.h === 'number')
    if (isTip && ev.matchId && ev.playerId) {
      if (!predictions[ev.matchId]) predictions[ev.matchId] = {}
      predictions[ev.matchId][ev.playerId] = {
        h: ev.h,
        a: ev.a,
        qual: ev.qual ?? null,
        predOT: !!ev.predOT,
        otH: ev.otH ?? 0,
        otA: ev.otA ?? 0,
        predPen: !!ev.predPen,
        penH: ev.penH ?? 0,
        penA: ev.penA ?? 0,
        savedAt: ev.ts || new Date().toISOString(),
        via: 'ntfy-client',
      }
    } else if (ev.type === 'result' && ev.matchId) {
      results[ev.matchId] = {
        h: ev.h,
        a: ev.a,
        overtime: !!ev.overtime,
        otH: ev.otH,
        otA: ev.otA,
        penalties: !!ev.penalties,
        penH: ev.penH,
        penA: ev.penA,
        qual: ev.qual ?? null,
        setAt: ev.ts || new Date().toISOString(),
        source: 'bridge',
      }
      revealed[ev.matchId] = true
    } else if (ev.type === 'chat' && ev.text) {
      chatEvents.push({ p: ev.name || ev.playerId || '?', t: ev.text, ts: ev.ts || new Date().toISOString(), a: !!ev.admin })
    } else if (ev.type === 'bracket' && ev.team && ev.playerId && BRACKET_OPTIONS.includes(ev.pick)) {
      if (!brackets[ev.team]) brackets[ev.team] = {}
      brackets[ev.team][ev.playerId] = ev.pick
    } else if (ev.type === 'bracket-result' && ev.team && BRACKET_OPTIONS.includes(ev.actual)) {
      bracketResults[ev.team] = ev.actual
    }
  }
  // ntfy retains the full 48h window every poll — rebuild chat from scratch
  // each time (sorted) rather than appending, or messages would duplicate.
  chatEvents.sort((a, b) => new Date(a.ts) - new Date(b.ts))
  return {
    ...state,
    predictions: mergeSeededPredictions(predictions),
    results: applyTipResultLocks(results).results,
    revealed,
    brackets,
    bracketResults,
    chat: chatEvents.length ? chatEvents.slice(-200) : (state?.chat || []),
  }
}

/** Canonical emails for the classic login form (shown as hints). */
export const ROSTER_CREDENTIALS = [
  { id: 'boikos', name: 'Boikos', email: 'boikos.y@caredirect.com', password: '1453' },
  { id: 'mavromichalis', name: 'Mavromichalis', email: 'mavromichalis.y@caredirect.com', password: '1821' },
  { id: 'chousiadas', name: 'Chousiadas', email: 'chousiadas.th@caredirect.com', password: '1940' },
]

function token() { return localStorage.getItem('kouv_token') || '' }
export function isOfflineToken(t = token()) {
  return String(t || '').startsWith('local:')
}

function readOfflinePredictions() {
  try {
    const raw = localStorage.getItem(OFFLINE_PREDS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeOfflinePredictions(predictions) {
  try {
    localStorage.setItem(OFFLINE_PREDS_KEY, JSON.stringify(predictions || {}))
  } catch { /* quota / private mode */ }
}

function readOfflineBrackets() {
  try {
    const raw = localStorage.getItem(OFFLINE_BRACKETS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeOfflineBrackets(brackets) {
  try {
    localStorage.setItem(OFFLINE_BRACKETS_KEY, JSON.stringify(brackets || {}))
  } catch { /* quota / private mode */ }
}

/** Merge a bracket pick into the offline localStorage ledger (mirrors saveOfflinePrediction). */
export function saveOfflineBracket(team, playerId, pick) {
  if (!team || !playerId || !pick) return readOfflineBrackets()
  const all = readOfflineBrackets()
  all[team] = { ...(all[team] || {}), [playerId]: pick }
  writeOfflineBrackets(all)
  return all
}

/** Merge a tip into the offline localStorage ledger (survives reload + state sync). */
export function saveOfflinePrediction(matchId, playerId, tip) {
  if (!matchId || !playerId || !tip) return readOfflinePredictions()
  const all = readOfflinePredictions()
  const row = { ...(all[matchId] || {}) }
  row[playerId] = {
    h: tip.h,
    a: tip.a,
    qual: tip.qual ?? null,
    predOT: !!tip.predOT,
    otH: tip.otH ?? 0,
    otA: tip.otA ?? 0,
    predPen: !!tip.predPen,
    penH: tip.penH ?? 0,
    penA: tip.penA ?? 0,
    savedAt: new Date().toISOString(),
  }
  all[matchId] = row
  writeOfflinePredictions(all)
  return all
}

function offlineState() {
  const { results } = applyTipResultLocks({})
  // Seeds + any tips the player saved while offline (Worker unreachable).
  const predictions = mergeSeededPredictions(readOfflinePredictions())
  const revealed = Object.fromEntries(Object.keys(results).map((id) => [id, true]))
  // Sunday tips also visible while live
  for (const id of ['sl-1-4', 'sl-1-6', 'sl-1-7']) revealed[id] = true
  // UEFA Leg 1 tips were public after their own 15′ lock — keep revealed
  for (const id of Object.keys(predictions)) {
    if (/-1$/.test(id) || id.endsWith('-3') || id.endsWith('-5')) {
      // conservative: reveal finished UEFA first legs that have tips
      if (results[id] || predictions[id]) revealed[id] = true
    }
  }
  return {
    predictions,
    results,
    chat: [{ p: 'Boikos', t: 'Offline mode — tips saved on this device until Worker sync is back.', ts: '—', a: true }],
    phones: { ...LOCAL_PHONES },
    welcomed: {},
    revealed,
    thavmaStats: {},
    kickoffOverrides: {},
    brackets: readOfflineBrackets(),
    bracketResults: {},
    offline: true,
  }
}

function resolveLocalUser(email, password) {
  const key = String(email || '').trim().toLowerCase()
  const passNorm = String(password || '').trim()
  const user = LOCAL_USERS[key]
  if (!user || passNorm !== String(user.password)) return null
  const emailOut = ROSTER_CREDENTIALS.find((r) => r.id === user.id)?.email || key
  return {
    token: `local:${user.id}:${Date.now()}`,
    name: user.name,
    id: user.id,
    email: emailOut,
    role: user.role || 'player',
    phone: LOCAL_PHONES[user.id] || null,
    offline: true,
  }
}

/** Promote/store an offline session for a known roster id (no password). */
export function ensureOfflineSession(userLike) {
  const id = userLike?.id
  if (!id || !LOCAL_PHONES[id]) return null
  const row = ROSTER_CREDENTIALS.find((r) => r.id === id)
  const name = userLike.name || row?.name || id
  const role = userLike.role || (id === 'boikos' ? 'admin' : 'player')
  const email = userLike.email || row?.email || `${id}@caredirect.com`
  const session = {
    token: `local:${id}:${Date.now()}`,
    name,
    id,
    email,
    role,
    phone: userLike.phone || LOCAL_PHONES[id],
    offline: true,
  }
  storeToken(session.token)
  storeUser(session)
  return session
}

function abortableTimeout(ms) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  return { signal: ctrl.signal, clear: () => clearTimeout(t) }
}

const LOGIN_BROKEN_KEY = 'kouv_login_broken'

function markWorkerLoginBroken() {
  try { sessionStorage.setItem(LOGIN_BROKEN_KEY, '1') } catch { /* private mode */ }
}

function isWorkerLoginMarkedBroken() {
  try { return sessionStorage.getItem(LOGIN_BROKEN_KEY) === '1' } catch { return false }
}

async function probeHost(base) {
  const { signal, clear } = abortableTimeout(2500)
  try {
    const res = await fetch(`${base}/ping`, { signal })
    clear()
    if (!res.ok) return null
    const d = await res.json().catch(() => null)
    if (!d || d.ok === false) return null
    return d
  } catch {
    clear()
    return null
  }
}

/**
 * Resolve which backend is safe to log in against right now.
 *
 * The real Worker (`kouvadeiros-api`) is PRIMARY whenever it's healthy —
 * full KV, WhatsApp, admin routes, cron. The Pages Functions bridge
 * (`/api`, ntfy-backed tip ledger) is a FALLBACK, only used while the
 * Worker is unreachable or its /login is known-broken this session
 * (the v11 CF-1101 bug: successful /login used to hang without CORS
 * headers, so a proven failure this session skips straight to bridge
 * without retrying the same doomed POST).
 *
 * /ping is always re-probed fresh (cheap GET) so the app recovers
 * automatically the moment the Worker is redeployed — only the actual
 * /login POST is gated by the broken flag.
 */
async function workerLoginSafe() {
  const worker = await probeHost(WORKER_BASE)
  const workerHealthy = !!worker && worker.bridge !== true &&
    (worker.loginFixed === true || Number(worker.version) >= 13)

  if (workerHealthy && !isWorkerLoginMarkedBroken()) {
    BASE = WORKER_BASE
    bridgeMode = false
    return true
  }

  if (bridgeAvailableHost()) {
    const bridge = await probeHost(BRIDGE_BASE)
    if (bridge && (bridge.bridge === true || bridge.loginFixed === true)) {
      BASE = BRIDGE_BASE
      bridgeMode = true
      return true
    }
  }

  return false
}

/**
 * Explicit fallback: Worker /ping was healthy but /login itself failed
 * (KV write-quota exhausted, transient 5xx, network). Try the Pages bridge
 * before giving up to fully-offline — keeps tips shared instead of stuck
 * on one device. Restores BASE/bridgeMode to the Worker on failure so the
 * next call() still tries Worker-primary first.
 */
async function tryBridgeLogin(email, password) {
  if (!bridgeAvailableHost()) return null
  const bridge = await probeHost(BRIDGE_BASE)
  if (!bridge || !(bridge.bridge === true || bridge.loginFixed === true)) return null
  const prevBase = BASE
  BASE = BRIDGE_BASE
  try {
    const remote = await postLogin(email, password, 6000)
    if (remote?.token) {
      bridgeMode = true
      return remote
    }
  } catch { /* fall through */ }
  BASE = prevBase
  return null
}

async function postLogin(email, password, ms = 6000) {
  const targetBase = BASE
  const { signal, clear } = abortableTimeout(ms)
  try {
    const res = await fetch(`${targetBase}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal,
    })
    clear()
    if (!res.ok) {
      // 5xx / CF 1101 HTML → mark the WORKER broken so we stop hammering its
      // /login this session. Only meaningful for the Worker — the bridge's
      // HMAC login never hangs the way the old v11 /login did.
      if (res.status >= 500 && targetBase === WORKER_BASE) markWorkerLoginBroken()
      const err = new Error(`POST /login → ${res.status}`)
      err.status = res.status
      throw err
    }
    return await res.json()
  } catch (e) {
    clear()
    // CORS-masked 1101 surfaces as TypeError / Failed to fetch
    const msg = String(e?.message || e)
    if (!e?.status && targetBase === WORKER_BASE && /fetch|network|abort|cors/i.test(msg)) markWorkerLoginBroken()
    throw e
  }
}

async function call(method, path, body) {
  if (isOfflineToken()) {
    if (path === '/state' && method === 'GET') return offlineState()
    if (path === '/logout' && method === 'POST') return { ok: true }
    if (path === '/prediction' && method === 'PATCH' && body) {
      const user = getStoredUser()
      if (!user?.id) return { ok: false, offline: true }
      saveOfflinePrediction(body.matchId, user.id, body)
      return { ok: true, offline: true, persisted: true }
    }
    if (path === '/bracket' && method === 'PATCH' && body?.team && body?.pick) {
      const user = getStoredUser()
      if (!user?.id) return { ok: false, offline: true }
      saveOfflineBracket(body.team, user.id, body.pick)
      return { ok: true, offline: true, persisted: true }
    }
    if (method === 'GET') return {}
    return { ok: true, offline: true }
  }

  const authToken = token()
  // A stored `br.` token proves this session last authenticated against the
  // bridge; self-heal BASE/bridgeMode from it on a fresh page load (before
  // any login/upgrade probe has run) so requests don't get misrouted to the
  // Worker with a token it doesn't understand. tryUpgradeOfflineSession()
  // is what actually migrates a session back to the Worker once it's healthy.
  if (isBridgeToken(authToken) && BASE !== BRIDGE_BASE && bridgeAvailableHost()) {
    BASE = BRIDGE_BASE
    bridgeMode = true
  }
  const onBridge = bridgeMode

  // Bridge tip save: browser → ntfy (shared), plus local mirror
  if (onBridge && path === '/prediction' && method === 'PATCH' && body) {
    const user = getStoredUser()
    const pid = user?.id
    if (!pid) return { ok: false, offline: true }
    const tipEvent = {
      type: 'tip',
      matchId: body.matchId,
      playerId: pid,
      h: body.h,
      a: body.a,
      qual: body.qual ?? null,
      predOT: !!body.predOT,
      otH: body.otH ?? 0,
      otA: body.otA ?? 0,
      predPen: !!body.predPen,
      penH: body.penH ?? 0,
      penA: body.penA ?? 0,
      ts: new Date().toISOString(),
    }
    try {
      await publishClientTip(tipEvent)
    } catch (e) {
      // Still keep local + try API ack
      console.warn('ntfy tip publish failed', e?.message || e)
    }
    saveOfflinePrediction(body.matchId, pid, body)
    try {
      await fetch(`${BASE}/prediction`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(body),
      })
    } catch { /* ack optional */ }
    return { ok: true, bridge: true, ledger: 'ntfy-client' }
  }

  // Bridge bracket pick save: browser → ntfy (shared), plus local mirror
  if (onBridge && path === '/bracket' && method === 'PATCH' && body?.team && body?.pick) {
    const user = getStoredUser()
    const pid = (user?.role === 'admin' && body.playerId) ? body.playerId : user?.id
    if (!pid) return { ok: false, offline: true }
    try {
      await publishClientTip({
        type: 'bracket',
        team: body.team,
        playerId: pid,
        pick: body.pick,
        ts: new Date().toISOString(),
      })
    } catch (e) {
      console.warn('ntfy bracket publish failed', e?.message || e)
    }
    saveOfflineBracket(body.team, pid, body.pick)
    return { ok: true, playerId: pid, bridge: true, ledger: 'ntfy-client' }
  }

  if (onBridge && path === '/bracket-result' && method === 'PATCH' && body?.team && body?.actual) {
    try {
      await publishClientTip({
        type: 'bracket-result',
        team: body.team,
        actual: body.actual,
        ts: new Date().toISOString(),
      })
      return { ok: true, bridge: true, ledger: 'ntfy-client' }
    } catch (e) {
      console.warn('ntfy bracket-result publish failed', e?.message || e)
      return { ok: false, bridge: true }
    }
  }

  if (onBridge && path === '/chat' && method === 'PATCH' && body?.text) {
    const user = getStoredUser()
    try {
      await publishClientTip({
        type: 'chat',
        playerId: user?.id,
        name: user?.name,
        admin: user?.role === 'admin',
        text: String(body.text),
        ts: new Date().toISOString(),
      })
      return { ok: true, bridge: true }
    } catch (e) {
      console.warn('ntfy chat publish failed', e?.message || e)
      return { ok: false, bridge: true }
    }
  }

  if (onBridge && path === '/result' && method === 'PATCH' && body) {
    const user = getStoredUser()
    try {
      await publishClientTip({
        type: 'result',
        matchId: body.matchId,
        h: body.h,
        a: body.a,
        overtime: !!body.overtime,
        otH: body.otH,
        otA: body.otA,
        penalties: !!body.penalties,
        penH: body.penH,
        penA: body.penA,
        qual: body.qual ?? null,
        setBy: user?.id || 'admin',
        ts: new Date().toISOString(),
      })
    } catch (e) {
      console.warn('ntfy result publish failed', e?.message || e)
    }
  }

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // CORS-masked Worker 1101 / offline network — demote and persist tips locally
    if (path === '/prediction' && method === 'PATCH' && body) {
      const prev = getStoredUser()
      if (prev?.id) {
        ensureOfflineSession(prev)
        saveOfflinePrediction(body.matchId, prev.id, body)
        return { ok: true, offline: true, persisted: true }
      }
    }
    if (path === '/bracket' && method === 'PATCH' && body?.team && body?.pick) {
      const prev = getStoredUser()
      if (prev?.id) {
        ensureOfflineSession(prev)
        saveOfflineBracket(body.team, prev.id, body.pick)
        return { ok: true, offline: true, persisted: true }
      }
    }
    throw new Error(`${method} ${path} → network`)
  }

  if (res.status === 401) {
    if (token() !== authToken) throw new Error('Session expired')

    const prev = getStoredUser()
    if (prev?.id && LOCAL_PHONES[prev.id]) {
      ensureOfflineSession(prev)
      if (path === '/state' && method === 'GET') return offlineState()
      if (path === '/prediction' && method === 'PATCH' && body) {
        saveOfflinePrediction(body.matchId, prev.id, body)
        return { ok: true, offline: true, persisted: true }
      }
      if (path === '/bracket' && method === 'PATCH' && body?.team && body?.pick) {
        saveOfflineBracket(body.team, prev.id, body.pick)
        return { ok: true, offline: true, persisted: true }
      }
      if (method === 'GET') return {}
      return { ok: true, offline: true }
    }

    clearAuth()
    try { window.dispatchEvent(new Event('kouv:session-lost')) } catch {}
    throw new Error('Session expired')
  }
  if (!res.ok) {
    // Worker 5xx on tip save → offline persist so players are never locked out
    if (path === '/prediction' && method === 'PATCH' && body && res.status >= 500) {
      const prev = getStoredUser()
      if (prev?.id) {
        ensureOfflineSession(prev)
        saveOfflinePrediction(body.matchId, prev.id, body)
        return { ok: true, offline: true, persisted: true }
      }
    }
    if (path === '/bracket' && method === 'PATCH' && body?.team && body?.pick && res.status >= 500) {
      const prev = getStoredUser()
      if (prev?.id) {
        ensureOfflineSession(prev)
        saveOfflineBracket(body.team, prev.id, body.pick)
        return { ok: true, offline: true, persisted: true }
      }
    }
    let detail = ''
    try {
      const j = await res.json()
      detail = j?.error ? `: ${j.error}` : ''
    } catch { /* ignore */ }
    throw new Error(`${method} ${path} → ${res.status}${detail}`)
  }
  const data = await res.json()

  // Bridge state: merge live ntfy tips so all players see each other before Actions sync
  if (onBridge && path === '/state' && method === 'GET') {
    try {
      const events = await pollClientTips()
      return mergeTipEventsIntoState(data, events)
    } catch {
      return data
    }
  }
  return data
}

async function publicScoresGet(path) {
  const res = await fetch(`${SCORES_BASE}${path}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    const res2 = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json' } })
    if (!res2.ok) throw new Error(`GET ${path} → ${res.status}/${res2.status}`)
    return res2.json()
  }
  return res.json()
}

/**
 * Classic login: use live Worker only when /login is known-safe (v13+).
 * Otherwise offline roster immediately — never hit CF 1101 on every entry.
 */
async function loginWithFallback(email, password) {
  const emailNorm = String(email || '').trim().toLowerCase()
  const passNorm = String(password || '').trim()
  const local = resolveLocalUser(emailNorm, passNorm)

  const emailForWorker = local?.email || emailNorm

  if (await workerLoginSafe()) {
    try {
      const remote = await postLogin(emailForWorker, passNorm, 6000)
      if (remote?.token) return remote
    } catch (e) {
      const msg = String(e?.message || e)
      const status = e?.status || (msg.includes('→ 401') ? 401 : msg.includes('→ 403') ? 403 : 0)
      // Auth rejected and no local roster match → hard fail
      if ((status === 401 || status === 403) && !local) throw new Error(`POST /login → ${status}`)
      // Worker /ping was healthy but /login itself failed (5xx — e.g. KV
      // write-quota exhausted, or network) → try the shared bridge before
      // falling all the way to fully-offline (which loses cross-device sync).
      if (status === 0 || status >= 500) {
        const bridgeUser = await tryBridgeLogin(emailForWorker, passNorm)
        if (bridgeUser?.token) return bridgeUser
      }
      // Hang / network / Worker user gap → offline for known roster
      if (local) return local
      if (status === 401 || status === 403) throw new Error(`POST /login → ${status}`)
    }
  }

  if (local) return local
  throw new Error('POST /login → 401')
}

/**
 * One-tap / double-click login: try Worker first (same as form),
 * then offline so players are never locked out.
 */
export async function quickLogin(playerId) {
  const row = ROSTER_CREDENTIALS.find((q) => q.id === playerId)
  if (!row) return null
  return loginWithFallback(row.email, row.password)
}

/** Sync helper kept for older call sites — prefer quickLogin. */
export function quickLocalLogin(playerId) {
  const row = ROSTER_CREDENTIALS.find((q) => q.id === playerId)
  if (!row) return null
  return resolveLocalUser(row.email, row.password)
}

/**
 * If the browser still holds a local: (offline) or br. (Pages bridge) token
 * but the real Worker is now healthy, silently upgrade to a real Worker
 * session so saves hit KV again — this is how the app migrates BACK to
 * Worker-primary once secrets are added, without asking players to
 * re-login manually. Also pushes locally-persisted tips (saveOfflinePrediction
 * mirrors every offline AND bridge save into localStorage) up to the Worker.
 */
export async function tryUpgradeOfflineSession() {
  const usingFallback = isOfflineToken() || isBridgeToken()
  if (!usingFallback) return null
  const prev = getStoredUser()
  if (!prev?.id) return null
  const row = ROSTER_CREDENTIALS.find((r) => r.id === prev.id)
  if (!row) return null
  if (!(await workerLoginSafe()) || BASE !== WORKER_BASE) return null
  try {
    const remote = await postLogin(row.email, row.password, 6000)
    if (!remote?.token) return null
    storeToken(remote.token)
    storeUser({ ...remote, phone: remote.phone || prev.phone || LOCAL_PHONES[prev.id] })

    // Push device-local tips so they don't vanish after upgrade
    const localTips = readOfflinePredictions()
    for (const [matchId, byPlayer] of Object.entries(localTips || {})) {
      const tip = byPlayer?.[prev.id]
      if (!tip || typeof tip.h !== 'number' || typeof tip.a !== 'number') continue
      try {
        await call('PATCH', '/prediction', {
          matchId,
          h: tip.h,
          a: tip.a,
          qual: tip.qual ?? null,
          predOT: !!tip.predOT,
          otH: tip.otH ?? 0,
          otA: tip.otA ?? 0,
          predPen: !!tip.predPen,
          penH: tip.penH ?? 0,
          penA: tip.penA ?? 0,
        })
      } catch { /* locked / network — keep local copy */ }
    }

    // Push device-local bracket picks too
    const localBrackets = readOfflineBrackets()
    for (const [team, byPlayer] of Object.entries(localBrackets || {})) {
      const pick = byPlayer?.[prev.id]
      if (!pick || !LEAGUE_PHASE_TEAMS.includes(team) || !BRACKET_OPTIONS.includes(pick)) continue
      try {
        await call('PATCH', '/bracket', { team, pick })
      } catch { /* locked / network — keep local copy */ }
    }

    return remote
  } catch {
    return null
  }
}

export const api = {
  getSlStandings: () => call('GET', '/sl-standings'),
  setLive: (matchId, h, a, min, final) => call('POST', '/set-live', { matchId, h, a, min, final }),
  getSlFixtures: () => call('GET', '/sl-fixtures'),
  getLiveScores: (mode = 'live') => publicScoresGet(`/live-scores?mode=${mode}`),
  getTodayScores: () => publicScoresGet('/live-scores?mode=today'),
  login: (email, password) => loginWithFallback(email, password),
  logout: () => call('POST', '/logout'),
  getState: () => call('GET', '/state'),
  savePred: (matchId, h, a, qual, predOT, otH, otA, predPen, penH, penA) =>
    call('PATCH', '/prediction', { matchId, h, a, qual, predOT, otH, otA, predPen, penH, penA }),
  saveResult: (matchId, h, a, ot, otH, otA, pen, penH, penA, qual) =>
    call('PATCH', '/result', { matchId, h, a, overtime: ot, otH, otA, penalties: pen, penH, penA, qual }),
  saveBracket: (team, pick, playerId) => call('PATCH', '/bracket', { team, pick, playerId }),
  saveBracketResult: (team, actual) => call('PATCH', '/bracket-result', { team, actual }),
  fetchScores: (matchId) => call('POST', '/fetch-scores', { matchId }),
  setKickoff: (matchId, athensTime, date) =>
    call('POST', '/set-kickoff', { matchId, athensTime, date }),
  fetchKickoffs: (opts = {}) => call('POST', '/fetch-kickoffs', opts),
  sendChat: (text) => call('PATCH', '/chat', { text }),
  savePhone: (phone) => call('PATCH', '/save-phone', { phone }),
  addPlayer: (data) => call('POST', '/add-player', data),
  newspaperTest: (opts = {}) => call('POST', '/newspaper-test', opts),
  gazzettaStatus: () => call('GET', '/gazzetta'),
  gazzettaControl: (body = {}) => call('POST', '/gazzetta', body),
}
export function getStoredUser() { try { return JSON.parse(localStorage.getItem('kouv_user') || 'null') } catch { return null } }
export function storeUser(u) { localStorage.setItem('kouv_user', JSON.stringify(u)) }
export function storeToken(t) { localStorage.setItem('kouv_token', t) }
export function clearAuth() { localStorage.removeItem('kouv_token'); localStorage.removeItem('kouv_user') }
export function hasSession() {
  return !!(token() && getStoredUser())
}
