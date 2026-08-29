/**
 * Pages API bridge v18 — shared predictions without Worker secrets.
 * Auth: HMAC tokens · Durable: live-ledger.json · Live tips: browser→ntfy
 */
import {
  BASE_USERS,
  BRIDGE_VERSION,
  CORS,
  DEFAULT_PHONES,
  LOCK_TARGET,
  NTFY_HOST,
  NTFY_TOPIC,
  buildState,
  findMatch,
  getUser,
  issueToken,
  json,
  publishLedgerEvent,
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

  const path = pathOf(context)

  try {
    if (path === '/ping' && request.method === 'GET') {
      return json({
        ok: true,
        version: BRIDGE_VERSION,
        bridge: true,
        loginFixed: true,
        ledger: 'ntfy',
        topic: NTFY_TOPIC,
        ntfyHost: NTFY_HOST,
        remind: [30, 20],
        lock: LOCK_TARGET,
        newspaper: false,
        equalRoast: false,
        gazzetta: false,
        kvBound: !!env?.KOUV,
        ts: new Date().toISOString(),
      })
    }

    if (path === '/login' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}))
      const email = String(body?.email || '').trim().toLowerCase()
      const password = String(body?.password || '')
      const user = BASE_USERS[email]
      if (!user || user.password !== password) return json({ error: 'Invalid credentials' }, 401)
      const token = await issueToken(user, email)
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
      return json({ ok: true })
    }

    if (path === '/state' && request.method === 'GET') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const state = await buildState(env, request)
      return json({ ...state, bridge: true, ledger: 'ntfy' })
    }

    if (path === '/prediction' && request.method === 'PATCH') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const body = await request.json().catch(() => ({}))
      const {
        matchId, h, a, qual, predOT, otH, otA, predPen, penH, penA, playerId,
      } = body || {}
      if (!matchId || typeof h !== 'number' || typeof a !== 'number') {
        return json({ error: 'Need matchId, h, a' }, 400)
      }
      const targetId = user.role === 'admin' && playerId ? playerId : user.id
      const state = await buildState(env, request)
      const match = findMatch(matchId, state.kickoffOverrides)
      if (match) {
        const minsUntil = (new Date(match.kickoff).getTime() - Date.now()) / 60000
        const adminForce = user.role === 'admin' && !!playerId
        if (!match.timeTbd && !match.postponed && minsUntil <= LOCK_TARGET && !adminForce) {
          return json({ error: 'Predictions locked (15′ before kickoff)' }, 403)
        }
      }

      const tip = {
        type: 'tip',
        matchId,
        playerId: targetId,
        h,
        a,
        qual: qual ?? null,
        predOT: !!predOT,
        otH: otH ?? 0,
        otA: otA ?? 0,
        predPen: !!predPen,
        penH: penH ?? 0,
        penA: penA ?? 0,
        ts: new Date().toISOString(),
      }
      // Browser publishes to ntfy (Function→ntfy hits TLS 525). Ack here only.
      await publishLedgerEvent(tip)

      return json({ ok: true, playerId: targetId, bridge: true, ledger: 'ntfy-client' })
    }

    if (path === '/result' && request.method === 'PATCH') {
      const user = await getUser(request, env)
      if (!user || user.role !== 'admin') return json({ error: 'Unauthorized' }, 401)
      const body = await request.json().catch(() => ({}))
      const { matchId, h, a, overtime, otH, otA, penalties, penH, penA, qual } = body || {}
      if (!matchId || typeof h !== 'number' || typeof a !== 'number') {
        return json({ error: 'Need matchId, h, a' }, 400)
      }
      const ev = {
        type: 'result',
        matchId,
        h,
        a,
        overtime: !!overtime,
        otH,
        otA,
        penalties: !!penalties,
        penH,
        penA,
        qual: qual ?? null,
        setBy: user.id,
        ts: new Date().toISOString(),
      }
      await publishLedgerEvent(ev)
      return json({ ok: true, bridge: true, ledger: 'ntfy-client' })
    }

    if (path === '/chat' && request.method === 'PATCH') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      const body = await request.json().catch(() => ({}))
      const text = String(body?.text || '').trim()
      if (!text) return json({ error: 'Empty' }, 400)
      await publishLedgerEvent({
        type: 'chat',
        playerId: user.id,
        name: user.name,
        admin: user.role === 'admin',
        text,
        ts: new Date().toISOString(),
      })
      return json({ ok: true, bridge: true })
    }

    if (path === '/sl-standings' && request.method === 'GET') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      // Worker proxies ESPN standings as { teams: [...] } — match that shape
      // (empty here) so the client's `d?.teams?.length` check degrades
      // gracefully instead of silently expecting the wrong key forever.
      return json({ teams: [], bridge: true })
    }

    if (path === '/sl-fixtures' && request.method === 'GET') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      // Worker proxies ESPN schedule as { events: [...] } — match that shape.
      return json({ events: [], bridge: true })
    }

    if (path === '/save-phone' && request.method === 'PATCH') {
      const user = await getUser(request, env)
      if (!user) return json({ error: 'Unauthorized' }, 401)
      return json({ ok: true, bridge: true, note: 'phones use defaults until Worker sync' })
    }

    return json({ error: 'Not found', path, bridge: true }, 404)
  } catch (e) {
    console.log('bridge fatal', path, e?.message || e)
    return json({ error: 'Bridge failed', detail: String(e?.message || e), bridge: true }, 500)
  }
}
