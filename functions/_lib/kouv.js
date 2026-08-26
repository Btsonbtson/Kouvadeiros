/**
 * Shared KV helpers for the Pages API bridge.
 * Same KOUV namespace as kouvadeiros-api Worker — tips/state survive until Worker v14.
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
export const BRIDGE_VERSION = 15

export function makeToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

export function json(d, s = 200) {
  return new Response(JSON.stringify(d), {
    status: s,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
  })
}

export async function getAllUsers(env) {
  const extra = await env.KOUV.get('extra_users')
  return { ...BASE_USERS, ...(extra ? JSON.parse(extra) : {}) }
}

export async function getState(env) {
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
  if (!state.revealed) state.revealed = {}

  const beforePhones = JSON.stringify(state.phones || {})
  const beforePreds = JSON.stringify(state.predictions || {})
  const beforeRevealed = JSON.stringify(state.revealed || {})

  state.phones = { ...DEFAULT_PHONES, ...(state.phones || {}) }

  let locked = { results: state.results, changed: false }
  try {
    locked = applyTipResultLocks(state.results)
    state.results = locked.results
  } catch (e) {
    console.log('tip locks skip', e?.message || e)
  }

  try {
    state.predictions = mergeSeededPredictions(state.predictions)
  } catch (e) {
    console.log('seed tips skip', e?.message || e)
  }

  // Client already reveals at KO−15′, but keep KV revealed map in sync
  // so standings / history / graph see the same public tips.
  try {
    const fixtures = applyKickoffOverrides(ALL_FIXTURES, state.kickoffOverrides)
    const now = Date.now()
    for (const m of fixtures) {
      if (!m?.id || !m.kickoff || m.timeTbd || m.postponed) continue
      const minsUntil = (new Date(m.kickoff).getTime() - now) / 60000
      if (minsUntil <= LOCK_TARGET && !state.revealed[m.id]) {
        state.revealed[m.id] = true
      }
    }
  } catch (e) {
    console.log('reveal sync skip', e?.message || e)
  }

  const predsFilled = JSON.stringify(state.predictions || {}) !== beforePreds
  const revealedFilled = JSON.stringify(state.revealed || {}) !== beforeRevealed
  if (JSON.stringify(state.phones) !== beforePhones || locked.changed || predsFilled || revealedFilled) {
    try {
      await env.KOUV.put('state', JSON.stringify(state))
    } catch (e) {
      console.log('state persist skip', e?.message || e)
    }
  }
  return state
}

export async function setState(env, s) {
  await env.KOUV.put('state', JSON.stringify(s))
}

export async function getUser(req, env) {
  const token = (req.headers.get('Authorization') || '').replace('Bearer ', '').trim()
  if (!token) return null
  const email = await env.KOUV.get(`token:${token}`)
  if (!email) return null
  const users = await getAllUsers(env)
  return users[email] ? { ...users[email], email } : null
}

export function findMatch(matchId, overrides) {
  const fixtures = applyKickoffOverrides(ALL_FIXTURES, overrides)
  return fixtures.find((m) => m.id === matchId) || null
}
