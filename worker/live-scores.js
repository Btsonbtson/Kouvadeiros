/**
 * Cloudflare Worker — live scores surface for kouvadeiros-api.
 *
 * Routes:
 *   GET  /live-scores?mode=live|today  → R2 SCORES_BUCKET (pipeline JSON)
 *   POST /set-live                     → manual live write (STATE KV)
 *   POST /fetch-scores                 → on-demand TSDB/ESPN fallback
 *   GET  /sl-fixtures                  → ESPN SL board (legacy)
 *   GET  /live-test                    → MD1 kickoff self-check
 *
 * Bindings (dashboard / wrangler):
 *   SCORES_BUCKET  R2  kouvadeiros-scores
 *   STATE          KV  (existing)
 *   FDORG_TOKEN    secret (existing)
 */

import { ALL_FIXTURES } from '../src/lib/data.js'
import { fetchMatchScore, scoreboardUrl, findMatchScore, ESPN_LEAGUES } from '../src/lib/scores.js'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors, ...extraHeaders },
  })
}

function fixtureById(id) {
  return ALL_FIXTURES.find(m => m.id === id)
}

async function writeLive(env, matchId, payload) {
  if (!env?.STATE) throw new Error('STATE KV missing')
  const key = `live_${matchId}`
  if (payload == null) {
    await env.STATE.delete(key)
    return { ok: true, cleared: true }
  }
  await env.STATE.put(key, JSON.stringify(payload))
  return { ok: true, live: payload }
}

/** GET /live-scores?mode=live|today — serve pipeline JSON from R2 */
export async function handlePipelineLiveScores(request, env) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('mode') || 'today'
  const key = mode === 'live' ? 'live.json' : 'today.json'

  if (!env?.SCORES_BUCKET) {
    return json({
      error: 'SCORES_BUCKET R2 binding missing. Bind kouvadeiros-scores as SCORES_BUCKET.',
      mode,
      key,
    }, 503)
  }

  const object = await env.SCORES_BUCKET.get(key)
  if (!object) {
    return json({
      error: 'No data yet. Run: python scripts/upload_to_r2.py',
      mode,
      key,
    }, 404)
  }

  const data = await object.json()
  return json(data, 200, {
    'Cache-Control': 'public, max-age=30, stale-while-revalidate=10',
  })
}

export async function handleSetLive(request, env) {
  const body = await request.json()
  const { matchId, h, a, min = 0, final = false } = body || {}
  if (!matchId) return json({ ok: false, error: 'matchId required' }, 400)
  const payload = { h: Number(h) || 0, a: Number(a) || 0, min: Number(min) || 0, ts: Date.now() }
  if (final) {
    await writeLive(env, matchId, null)
    return json({ ok: true, final: true })
  }
  await writeLive(env, matchId, payload)
  return json({ ok: true, live: payload })
}

export async function handleFetchScores(request, env) {
  const body = await request.json().catch(() => ({}))
  const matchId = body.matchId
  const match = fixtureById(matchId)
  if (!match) return json({ ok: false, error: 'unknown match' }, 404)

  const r = await fetchMatchScore(match)
  if (!r.ok) return json({ ok: false, reason: r.reason, provider: r.provider })

  if (r.final) {
    if (env?.STATE) {
      const raw = await env.STATE.get('results')
      const results = raw ? JSON.parse(raw) : {}
      results[matchId] = { h: r.h, a: r.a }
      await env.STATE.put('results', JSON.stringify(results))
      await writeLive(env, matchId, null)
    }
    return json({ ok: true, final: true, h: r.h, a: r.a, min: r.min, eventId: r.eventId, provider: r.provider })
  }

  if (r.inPlay || r.min > 0 || r.h != null) {
    const live = { h: r.h, a: r.a, min: r.min, ts: Date.now() }
    if (env?.STATE) await writeLive(env, matchId, live)
    return json({ ok: true, final: false, ...live, eventId: r.eventId, provider: r.provider })
  }

  return json({ ok: false, reason: 'scheduled', status: r.status, provider: r.provider })
}

export async function handleSlFixtures() {
  const url = scoreboardUrl('SL', '2026-08-22T12:00:00Z')
  const rangeUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/gre.1/scoreboard?dates=20260822-20260824'
  const res = await fetch(rangeUrl)
  if (!res.ok) return json({ ok: false, error: 'espn' }, 502)
  const board = await res.json()
  const events = (board.events || []).map(ev => {
    const comps = ev.competitions?.[0]
    const home = comps?.competitors?.find(c => c.homeAway === 'home')
    const away = comps?.competitors?.find(c => c.homeAway === 'away')
    return {
      id: String(ev.id),
      date: ev.date,
      home: { abbr: home?.team?.abbreviation, name: home?.team?.displayName, score: home?.score },
      away: { abbr: away?.team?.abbreviation, name: away?.team?.displayName, score: away?.score },
      status: ev.status?.type?.name,
    }
  })
  return json({ ok: true, events, source: rangeUrl, fallback: url })
}

export async function handleLiveTest() {
  const md1 = ALL_FIXTURES.filter(m => m.t === 'SL' && m.md === 1)
  const rangeUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/gre.1/scoreboard?dates=20260822-20260824'
  const res = await fetch(rangeUrl)
  const board = await res.json()
  const checks = []
  for (const m of md1) {
    const score = findMatchScore(board, m)
    const espnKo = score?.kickoff || null
    const ok = espnKo && new Date(espnKo).getTime() === new Date(m.kickoff).getTime()
    checks.push({
      id: m.id,
      match: `${m.home}-${m.away}`,
      ourKickoff: m.kickoff,
      espnKickoff: espnKo,
      timeOk: !!ok,
      found: !!score,
    })
  }
  return json({ ok: checks.every(c => c.timeOk), league: ESPN_LEAGUES.SL, checks })
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/$/, '') || '/'

    try {
      if (path === '/live-scores' && request.method === 'GET') return handlePipelineLiveScores(request, env)
      if (path === '/set-live' && request.method === 'POST') return handleSetLive(request, env)
      if (path === '/fetch-scores' && request.method === 'POST') return handleFetchScores(request, env)
      if (path === '/sl-fixtures' && request.method === 'GET') return handleSlFixtures()
      if (path === '/live-test' && request.method === 'GET') return handleLiveTest()
      return json({ ok: false, error: 'not_found', path }, 404)
    } catch (e) {
      return json({ ok: false, error: String(e.message || e) }, 500)
    }
  },
}
