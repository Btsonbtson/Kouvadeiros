const BASE = (typeof __WORKER_URL__ !== 'undefined' && __WORKER_URL__)
  ? __WORKER_URL__
  : 'https://kouvadeiros-api.jboikos.workers.dev'
const SCORES_BASE = (typeof __SCORES_URL__ !== 'undefined' && __SCORES_URL__)
  ? __SCORES_URL__
  : 'https://kouvadeiros-scores.jboikos.workers.dev'

/**
 * Original CareDirect roster — same passwords as worker BASE_USERS.
 * Pages authenticates locally while Worker v11 hangs on successful /login (CF 1101).
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

function offlineState() {
  return {
    predictions: {},
    results: {},
    chat: [{ p: 'Boikos', t: 'Offline mode — tips from Pages seeds (Worker login down).', ts: '—', a: true }],
    phones: { ...LOCAL_PHONES },
    welcomed: {},
    revealed: {},
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

/** Worker v11 hangs on successful /login (CF 1101). v13+ is safe. */
async function workerLoginBroken() {
  const { signal, clear } = abortableTimeout(2500)
  try {
    const res = await fetch(`${BASE}/ping`, { signal })
    clear()
    if (!res.ok) return true
    const d = await res.json()
    return !(Number(d?.version) >= 13)
  } catch {
    clear()
    return true
  }
}

async function call(method, path, body) {
  if (isOfflineToken()) {
    if (path === '/state' && method === 'GET') return offlineState()
    if (path === '/logout' && method === 'POST') return { ok: true }
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
      if (method === 'GET') return {}
      return { ok: true, offline: true }
    }

    clearAuth()
    try { window.dispatchEvent(new Event('kouv:session-lost')) } catch {}
    throw new Error('Session expired')
  }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`)
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
 * Classic login: original emails + passwords.
 * Always accept local roster first (instant, never hangs).
 * Only try Worker when ping reports version ≥ 13.
 */
async function loginWithFallback(email, password) {
  const emailNorm = String(email || '').trim().toLowerCase()
  const passNorm = String(password || '').trim()

  // Original credentials always work offline — never wait on broken Worker /login
  const local = resolveLocalUser(emailNorm, passNorm)
  if (local) {
    if (await workerLoginBroken()) return local
    // Worker healthy: try real session, fall back to local
    const { signal, clear } = abortableTimeout(6000)
    try {
      const res = await fetch(`${BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: local.email, password: passNorm }),
        signal,
      })
      clear()
      if (res.ok) return res.json()
    } catch {
      clear()
    }
    return local
  }

  // Unknown email — try Worker once if healthy, else 401
  if (!(await workerLoginBroken())) {
    const { signal, clear } = abortableTimeout(6000)
    try {
      const res = await fetch(`${BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailNorm, password: passNorm }),
        signal,
      })
      clear()
      if (res.ok) return res.json()
      if (res.status === 401 || res.status === 403) throw new Error(`POST /login → ${res.status}`)
    } catch (e) {
      clear()
      const msg = String(e?.message || e)
      if (msg.includes('→ 401') || msg.includes('→ 403')) throw e
    }
  }

  throw new Error('POST /login → 401')
}

/** One-tap login using original roster passwords. */
export function quickLocalLogin(playerId) {
  const row = ROSTER_CREDENTIALS.find((q) => q.id === playerId)
  if (!row) return null
  return resolveLocalUser(row.email, row.password)
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
