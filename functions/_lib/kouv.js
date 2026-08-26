/**
 * Shared helpers for the Pages API bridge.
 * Auth: HMAC-signed tokens (no KV writes — free plan quota is burned by Worker cron).
 * Ledger: ntfy topic (shared tips/results) + optional KOUV read + SEEDED_PREDICTIONS.
 */
import {
  ALL_FIXTURES,
  applyKickoffOverrides,
  applyTipResultLocks,
  mergeSeededPredictions,
} from '../../src/lib/data.js'

export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}

export const BASE_USERS = {
  'boikos.y@caredirect.com': { password: '1453', name: 'Boikos', id: 'boikos', role: 'admin' },
  'mavromichalis.y@caredirect.com': { password: '1821', name: 'Mavromichalis', id: 'mavromichalis', role: 'player' },
  'chousiadas.th@caredirect.com': { password: '1940', name: 'Chousiadas', id: 'chousiadas', role: 'player' },
}

export const DEFAULT_PHONES = {
  boikos: '+306932377969',
  chousiadas: '+306932662864',
  mavromichalis: '+306932851343',
}

export const LOCK_TARGET = 15
export const BRIDGE_VERSION = 16

/** Obscure ntfy topic — private 3-player ledger until Worker secrets land. */
export const NTFY_TOPIC = 'kouvadeiros-leg2-tips-x7k9m2'
export const NTFY_BASE = `https://ntfy.sh/${NTFY_TOPIC}`

/** Signing secret (repo already ships roster passwords in client). */
const TOKEN_SECRET = 'kouv-bridge-hmac-2026-leg2'

export function makeToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

export function json(d, s = 200) {
  return new Response(JSON.stringify(d), {
    status: s,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
  })
}

function b64url(bytes) {
  let bin = ''
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function b64urlJson(obj) {
  return b64url(new TextEncoder().encode(JSON.stringify(obj)))
}

async function hmacSign(message) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(TOKEN_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return b64url(sig)
}

export async function issueToken(user, email) {
  const payload = {
    email,
    id: user.id,
    name: user.name,
    role: user.role || 'player',
    exp: Math.floor(Date.now() / 1000) + 86400 * 30,
  }
  const body = b64urlJson(payload)
  const sig = await hmacSign(body)
  return `br.${body}.${sig}`
}

export async function verifyToken(token) {
  if (!token || !token.startsWith('br.')) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [, body, sig] = parts
  const expect = await hmacSign(body)
  if (sig !== expect) return null
  try {
    const jsonStr = atob(body.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(jsonStr)
    if (!payload?.email || !payload?.id) return null
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    const user = BASE_USERS[payload.email]
    if (!user || user.id !== payload.id) return null
    return { ...user, email: payload.email }
  } catch {
    return null
  }
}

export async function getAllUsers(env) {
  try {
    if (env?.KOUV) {
      const extra = await env.KOUV.get('extra_users')
      return { ...BASE_USERS, ...(extra ? JSON.parse(extra) : {}) }
    }
  } catch { /* KV read fail / limit */ }
  return { ...BASE_USERS }
}

/** Read-only KV state (never put — cron already exhausts free write quota). */
export async function readKvState(env) {
  try {
    if (!env?.KOUV) return null
    const raw = await env.KOUV.get('state')
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    console.log('kv read skip', e?.message || e)
    return null
  }
}

/** Best-effort KV write — returns false when quota / binding fails. */
export async function tryKvPutState(env, state) {
  try {
    if (!env?.KOUV) return false
    await env.KOUV.put('state', JSON.stringify(state))
    return true
  } catch (e) {
    console.log('kv put skip', e?.message || e)
    return false
  }
}

export async function publishLedgerEvent(event) {
  const res = await fetch(NTFY_BASE, {
    method: 'POST',
    headers: {
      Title: event.type || 'tip',
      'Content-Type': 'application/json',
      Tags: 'soccer',
    },
    body: JSON.stringify(event),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`ntfy ${res.status}: ${t.slice(0, 120)}`)
  }
  return true
}

export async function loadLedgerEvents() {
  const res = await fetch(`${NTFY_BASE}/json?poll=1&since=all`, {
    headers: { Accept: 'application/x-ndjson, application/json' },
  })
  if (!res.ok) return []
  const text = await res.text()
  const events = []
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    try {
      const wrap = JSON.parse(trimmed)
      if (wrap.event && wrap.event !== 'message') continue
      const msg = typeof wrap.message === 'string' ? JSON.parse(wrap.message) : wrap.message
      if (msg && typeof msg === 'object') events.push(msg)
    } catch { /* skip bad line */ }
  }
  return events
}

export function applyLedgerEvents(baseState, events) {
  const state = {
    predictions: { ...(baseState?.predictions || {}) },
    results: { ...(baseState?.results || {}) },
    chat: [...(baseState?.chat || [])],
    phones: { ...DEFAULT_PHONES, ...(baseState?.phones || {}) },
    welcomed: { ...(baseState?.welcomed || {}) },
    revealed: { ...(baseState?.revealed || {}) },
    thavmaStats: { ...(baseState?.thavmaStats || {}) },
    kickoffOverrides: { ...(baseState?.kickoffOverrides || {}) },
  }

  // Chronological apply — last write wins per player/match
  for (const ev of events) {
    const isTip =
      ev.type === 'tip' ||
      (!ev.type && ev.matchId && ev.playerId && typeof ev.h === 'number' && typeof ev.a === 'number')
    if (isTip && ev.matchId && ev.playerId) {
      if (!state.predictions[ev.matchId]) state.predictions[ev.matchId] = {}
      state.predictions[ev.matchId][ev.playerId] = {
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
        via: 'ntfy-bridge',
      }
    } else if (ev.type === 'result' && ev.matchId) {
      state.results[ev.matchId] = {
        h: ev.h,
        a: ev.a,
        overtime: !!ev.overtime,
        otH: ev.otH,
        otA: ev.otA,
        penalties: !!ev.penalties,
        penH: ev.penH,
        penA: ev.penA,
        qual: ev.qual ?? null,
        setBy: ev.setBy || 'bridge',
        setAt: ev.ts || new Date().toISOString(),
        source: 'manual',
      }
      state.revealed[ev.matchId] = true
    } else if (ev.type === 'chat' && ev.text) {
      state.chat.push({
        p: ev.name || ev.playerId || '?',
        t: ev.text,
        ts: ev.ts || new Date().toISOString(),
        a: !!ev.admin,
      })
    }
  }

  try {
    state.results = applyTipResultLocks(state.results).results
  } catch { /* ignore */ }
  try {
    state.predictions = mergeSeededPredictions(state.predictions)
  } catch { /* ignore */ }

  // Reveal map at KO−15′
  try {
    const fixtures = applyKickoffOverrides(ALL_FIXTURES, state.kickoffOverrides)
    const now = Date.now()
    for (const m of fixtures) {
      if (!m?.id || !m.kickoff || m.timeTbd || m.postponed) continue
      const minsUntil = (new Date(m.kickoff).getTime() - now) / 60000
      if (minsUntil <= LOCK_TARGET) state.revealed[m.id] = true
    }
  } catch { /* ignore */ }

  if (state.chat.length > 200) state.chat = state.chat.slice(-200)
  return state
}

export async function buildState(env) {
  const kv = await readKvState(env)
  const events = await loadLedgerEvents()
  return applyLedgerEvents(kv || {
    predictions: {},
    results: {},
    chat: [{ p: 'Boikos', t: 'Bridge mode — shared tips via ledger (WA off until Saturday).', ts: '—', a: true }],
    phones: {},
    welcomed: {},
    revealed: {},
    thavmaStats: {},
    kickoffOverrides: {},
  }, events)
}

export async function getUser(req, env) {
  const token = (req.headers.get('Authorization') || '').replace('Bearer ', '').trim()
  if (!token) return null
  // Prefer signed bridge tokens (no KV)
  const signed = await verifyToken(token)
  if (signed) return signed
  // Legacy Worker KV tokens — read-only lookup
  try {
    if (!env?.KOUV) return null
    const email = await env.KOUV.get(`token:${token}`)
    if (!email) return null
    const users = await getAllUsers(env)
    return users[email] ? { ...users[email], email } : null
  } catch {
    return null
  }
}

export function findMatch(matchId, overrides) {
  const fixtures = applyKickoffOverrides(ALL_FIXTURES, overrides)
  return fixtures.find((m) => m.id === matchId) || null
}
