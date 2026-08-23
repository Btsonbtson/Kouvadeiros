const BASE = (typeof __WORKER_URL__ !== 'undefined' && __WORKER_URL__)
  ? __WORKER_URL__
  : 'https://kouvadeiros-api.jboikos.workers.dev'
/** Dedicated scores Worker (pipeline JSON). Falls back to API host if unset. */
const SCORES_BASE = (typeof __SCORES_URL__ !== 'undefined' && __SCORES_URL__)
  ? __SCORES_URL__
  : 'https://kouvadeiros-scores.jboikos.workers.dev'

/**
 * Same roster as worker/kouvadeiros-api.js BASE_USERS.
 * Used only when Worker /login is down (CF 1101) so the season can keep running
 * from Pages seeds until Worker secrets are available again.
 */
const LOCAL_USERS = {
  'boikos.y@caredirect.com': { password: '1453', name: 'Boikos', id: 'boikos', role: 'admin' },
  'mavromichalis.y@caredirect.com': { password: '1821', name: 'Mavromichalis', id: 'mavromichalis', role: 'player' },
  'chousiadas.th@caredirect.com': { password: '1940', name: 'Chousiadas', id: 'chousiadas', role: 'player' },
}
const LOCAL_PHONES = {
  boikos: '+306932377969',
  chousiadas: '+306932662864',
  mavromichalis: '+306932851343',
}

function token() { return localStorage.getItem('kouv_token') || '' }
export function isOfflineToken(t = token()) {
  return String(t || '').startsWith('local:')
}

function offlineState() {
  return {
    predictions: {},
    results: {},
    chat: [{ p: 'Boikos', t: 'Offline mode — Worker login down; tips from Pages seeds.', ts: '—', a: true }],
    phones: { ...LOCAL_PHONES },
    welcomed: {},
    revealed: {},
    thavmaStats: {},
    kickoffOverrides: {},
    offline: true,
  }
}

function localLogin(email, password) {
  const key = String(email || '').trim().toLowerCase()
  const user = LOCAL_USERS[key]
  if (!user || String(password) !== user.password) return null
  return {
    token: `local:${user.id}:${Date.now()}`,
    name: user.name,
    id: user.id,
    email: key,
    role: user.role || 'player',
    phone: LOCAL_PHONES[user.id] || null,
    offline: true,
  }
}

async function call(method, path, body) {
  // Offline session: never hit Worker (would 401 → wipe session → login 1101 loop)
  if (isOfflineToken()) {
    if (path === '/state' && method === 'GET') return offlineState()
    if (path === '/logout' && method === 'POST') return { ok: true }
    if (method === 'GET') return {}
    return { ok: true, offline: true }
  }

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (e) {
    throw new Error(`${method} ${path} → network`)
  }

  if (res.status === 401) {
    localStorage.removeItem('kouv_token')
    localStorage.removeItem('kouv_user')
    window.location.reload()
    throw new Error('Session expired')
  }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`)
  return res.json()
}

/** Public GET against scores Worker (pipeline R2/KV) */
async function publicScoresGet(path) {
  const res = await fetch(`${SCORES_BASE}${path}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    // Fallback: same path on main API Worker if scores Worker not deployed yet
    const res2 = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json' } })
    if (!res2.ok) throw new Error(`GET ${path} → ${res.status}/${res2.status}`)
    return res2.json()
  }
  return res.json()
}

async function loginWithFallback(email, password) {
  try {
    const res = await fetch(`${BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) return res.json()
    // Worker up but bad credentials — don't mask with local fallback
    if (res.status === 401 || res.status === 403) {
      throw new Error(`POST /login → ${res.status}`)
    }
    // 5xx / 1101 HTML — fall through to local
  } catch (e) {
    const msg = String(e?.message || e)
    if (msg.includes('→ 401') || msg.includes('→ 403')) throw e
  }
  const local = localLogin(email, password)
  if (local) return local
  throw new Error('POST /login → failed')
}

export const api = {
  getSlStandings: () => call('GET', '/sl-standings'),
  setLive: (matchId, h, a, min, final) => call('POST', '/set-live', { matchId, h, a, min, final }),
  getSlFixtures: () => call('GET', '/sl-fixtures'),
  /** Pipeline scores from R2/KV via scores Worker */
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
  /** Admin: set kickoff (Athens HH:MM + optional YYYY-MM-DD) */
  setKickoff: (matchId, athensTime, date) =>
    call('POST', '/set-kickoff', { matchId, athensTime, date }),
  /** Admin: pull TBA kickoffs from ESPN/Gazzetta (optional matchId) */
  fetchKickoffs: (opts = {}) => call('POST', '/fetch-kickoffs', opts),
  sendChat: (text) => call('PATCH', '/chat', { text }),
  savePhone: (phone) => call('PATCH', '/save-phone', { phone }),
  addPlayer: (data) => call('POST', '/add-player', data),
  /** Admin: send Ο Κουβάς sample (default adminOnly) */
  newspaperTest: (opts = {}) => call('POST', '/newspaper-test', opts),
  /** Admin: Gazzetta cloud feed status / toggle / poll */
  gazzettaStatus: () => call('GET', '/gazzetta'),
  gazzettaControl: (body = {}) => call('POST', '/gazzetta', body),
}
export function getStoredUser() { try { return JSON.parse(localStorage.getItem('kouv_user') || 'null') } catch { return null } }
export function storeUser(u) { localStorage.setItem('kouv_user', JSON.stringify(u)) }
export function storeToken(t) { localStorage.setItem('kouv_token', t) }
export function clearAuth() { localStorage.removeItem('kouv_token'); localStorage.removeItem('kouv_user') }
