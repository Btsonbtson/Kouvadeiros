import { mergeSeededPredictions, applyTipResultLocks } from './data.js'

const BASE = (typeof __WORKER_URL__ !== 'undefined' && __WORKER_URL__)
  ? __WORKER_URL__
  : 'https://kouvadeiros-api.jboikos.workers.dev'
const SCORES_BASE = (typeof __SCORES_URL__ !== 'undefined' && __SCORES_URL__)
  ? __SCORES_URL__
  : 'https://kouvadeiros-scores.jboikos.workers.dev'

const OFFLINE_PREDS_KEY = 'kouv_offline_preds'

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

/**
 * Worker is usable when /ping answers OK.
 * Do NOT require version ≥ 13 — live Worker still reports v11 while /login works.
 * (Deploy of v13 is blocked until CLOUDFLARE_API_TOKEN is set in Actions.)
 */
async function workerReachable() {
  const { signal, clear } = abortableTimeout(2500)
  try {
    const res = await fetch(`${BASE}/ping`, { signal })
    clear()
    if (!res.ok) return false
    const d = await res.json().catch(() => ({}))
    return d?.ok !== false
  } catch {
    clear()
    return false
  }
}

async function postLogin(email, password, ms = 6000) {
  const { signal, clear } = abortableTimeout(ms)
  try {
    const res = await fetch(`${BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal,
    })
    clear()
    if (!res.ok) {
      const err = new Error(`POST /login → ${res.status}`)
      err.status = res.status
      throw err
    }
    return await res.json()
  } catch (e) {
    clear()
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
    if (method === 'GET') return {}
    return { ok: true, offline: true }
  }

  const authToken = token()

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
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
      if (method === 'GET') return {}
      return { ok: true, offline: true }
    }

    clearAuth()
    try { window.dispatchEvent(new Event('kouv:session-lost')) } catch {}
    throw new Error('Session expired')
  }
  if (!res.ok) {
    let detail = ''
    try {
      const j = await res.json()
      detail = j?.error ? `: ${j.error}` : ''
    } catch { /* ignore */ }
    throw new Error(`${method} ${path} → ${res.status}${detail}`)
  }
  return res.json()
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
 * Classic login: prefer live Worker session so tips sync for everyone.
 * Fall back to offline roster only when Worker is down / login hangs.
 */
async function loginWithFallback(email, password) {
  const emailNorm = String(email || '').trim().toLowerCase()
  const passNorm = String(password || '').trim()
  const local = resolveLocalUser(emailNorm, passNorm)

  const emailForWorker = local?.email || emailNorm

  if (await workerReachable()) {
    try {
      const remote = await postLogin(emailForWorker, passNorm, 6000)
      if (remote?.token) return remote
    } catch (e) {
      const msg = String(e?.message || e)
      const status = e?.status || (msg.includes('→ 401') ? 401 : msg.includes('→ 403') ? 403 : 0)
      // Auth rejected and no local roster match → hard fail
      if ((status === 401 || status === 403) && !local) throw new Error(`POST /login → ${status}`)
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
 * If the browser still holds a local: token but Worker is healthy,
 * silently upgrade to a real session so saves hit KV.
 * Also pushes any locally-persisted offline tips up to the Worker.
 */
export async function tryUpgradeOfflineSession() {
  if (!isOfflineToken()) return null
  const prev = getStoredUser()
  if (!prev?.id) return null
  const row = ROSTER_CREDENTIALS.find((r) => r.id === prev.id)
  if (!row) return null
  if (!(await workerReachable())) return null
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
