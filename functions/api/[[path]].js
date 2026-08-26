/**
 * Pages API bridge — shared predictions loop without Worker deploy secrets.
 * Routes: /api/ping|/login|/logout|/state|/prediction|/result|/chat|/sl-standings|/sl-fixtures
 *
 * Uses the same KOUV KV as kouvadeiros-api. Deploys with Cloudflare Pages Git
 * (no GitHub Actions CLOUDFLARE_API_TOKEN required).
 */
import {
  BRIDGE_VERSION,
  CORS,
  DEFAULT_PHONES,
  LOCK_TARGET,
  findMatch,
  getAllUsers,
  getState,
  getUser,
  json,
  makeToken,
  setState,
} from '../_lib/kouv.js'

function pathOf(context) {
  const parts = context.params?.path
  if (!parts) return '/'
  const joined = Array.isArray(parts) ? parts.join('/') : String(parts)
  return '/' + joined.replace(/^\/+/, '')
}

export async function onRequest(context) {
  const { request, env } = context
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  if (!env?.KOUV) {
    return json(
      {
        ok: false,
        error: 'KOUV binding missing — bind KV namespace on Pages project (same id as Worker)',
        bridge: true,
        version: BRIDGE_VERSION,
      },
      503,
    )
  }

  const path = pathOf(context)

  try {
    if (path === '/ping' && request.method === 'GET') {
      return json({
        ok: true,
        version: BRIDGE_VERSION,
        bridge: true,
        loginFixed: true,
        remind: [30, 20],
        lock: LOCK_TARGET,
        newspaper: false,
        equalRoast: false,
        gazzetta: false,
        ts: new Date().toISOString(),
      })
    }

    if (path === '/login' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}))
      const email = String(body?.email || '').trim().toLowerCase()
      const password = String(body?.password || '')
      const users = await getAllUsers(env)
      const user = users[email]
      if (!user || user.password !== password) return json({ error: 'Invalid credentials' }, 401)
      const token = makeToken()
      try {
        await env.KOUV.put(`token:${token}`, email, { expirationTtl: 86400 * 30 })
      } catch (e) {
        return json({ error: 'Session store failed', detail: String(e?.message || e) }, 503)
      }
      return json({
        token,
        name: user.name,
        id: user.id,
        email,
        role: user.role || 'player',
        phone: DEFAULT_PHONES[user.id] || null,
        bridge: true,
      })
    }

    if (path === '/logout' && request.method === 'POST') {
      const token = (request.headers.get('Authorization') || '').replace('Bearer ', '').trim()
      if (token) await env.KOUV.delete(`token:${token}`)
      return json({ ok: true })
    }

    if (path === '/state' && request.method === 'GET') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const state = await getState(env)
      return json({ ...state, bridge: true })
    }

    if (path === '/prediction' && request.method === 'PATCH') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const body = await request.json().catch(() => ({}))
      const {
        matchId,
        h,
        a,
        qual,
        predOT,
        otH,
        otA,
        predPen,
        penH,
        penA,
        playerId,
      } = body || {}
      if (!matchId || typeof h !== 'number' || typeof a !== 'number') {
        return json({ error: 'Need matchId, h, a' }, 400)
      }
      const targetId = user.role === 'admin' && playerId ? playerId : user.id
      const state = await getState(env)
      const match = findMatch(matchId, state.kickoffOverrides)
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
        qual: qual ?? null,
        predOT: !!predOT,
        otH: otH ?? 0,
        otA: otA ?? 0,
        predPen: !!predPen,
        penH: penH ?? 0,
        penA: penA ?? 0,
        savedAt: new Date().toISOString(),
        via: 'pages-bridge',
        ...(user.role === 'admin' && playerId ? { setBy: user.id, via: 'admin' } : {}),
      }
      await setState(env, state)
      return json({ ok: true, playerId: targetId, bridge: true })
    }

    if (path === '/result' && request.method === 'PATCH') {
      const user = await getUser(request, env)
      if (!user || user.role !== 'admin') return json({ error: 'Unauthorized' }, 401)
      const body = await request.json().catch(() => ({}))
      const { matchId, h, a, overtime, otH, otA, penalties, penH, penA, qual } = body || {}
      if (!matchId || typeof h !== 'number' || typeof a !== 'number') {
        return json({ error: 'Need matchId, h, a' }, 400)
      }
      const state = await getState(env)
      if (!state.results) state.results = {}
      const prior = state.results[matchId] || {}
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
      if (!state.revealed) state.revealed = {}
      state.revealed[matchId] = true
      await setState(env, state)
      return json({ ok: true, bridge: true })
    }

    if (path === '/chat' && request.method === 'PATCH') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const body = await request.json().catch(() => ({}))
      const text = String(body?.text || '').trim()
      if (!text) return json({ error: 'Empty' }, 400)
      const state = await getState(env)
      if (!state.chat) state.chat = []
      state.chat.push({
        p: user.name,
        t: text,
        ts: new Date().toISOString(),
        a: user.role === 'admin',
      })
      if (state.chat.length > 200) state.chat = state.chat.slice(-200)
      await setState(env, state)
      return json({ ok: true, bridge: true })
    }

    if (path === '/sl-standings' && request.method === 'GET') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const raw = await env.KOUV.get('sl_standings')
      return json(raw ? JSON.parse(raw) : { rows: [], bridge: true })
    }

    if (path === '/sl-fixtures' && request.method === 'GET') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      return json({ fixtures: [], bridge: true })
    }

    if (path === '/save-phone' && request.method === 'PATCH') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const body = await request.json().catch(() => ({}))
      const phone = String(body?.phone || '').trim()
      const state = await getState(env)
      state.phones = { ...(state.phones || {}), [user.id]: phone }
      await setState(env, state)
      return json({ ok: true, bridge: true })
    }

    return json({ error: 'Not found', path, bridge: true }, 404)
  } catch (e) {
    console.log('bridge fatal', path, e?.message || e)
    return json({ error: 'Bridge failed', detail: String(e?.message || e), bridge: true }, 500)
  }
}
