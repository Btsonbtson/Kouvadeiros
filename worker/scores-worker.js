/**
 * Dedicated scores Worker — safe to deploy without touching kouvadeiros-api.
 * Serves pipeline JSON from R2 (preferred) or KV fallback.
 *
 * GET /live-scores?mode=live|today
 */
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
}

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors, ...extra },
  })
}

async function readScores(env, key) {
  // 1) R2 binding SCORES_BUCKET
  if (env.SCORES_BUCKET) {
    const obj = await env.SCORES_BUCKET.get(key)
    if (obj) return obj.json()
  }
  // 2) KV binding KOUV / STATE — keys live.json | today.json
  const kv = env.KOUV || env.STATE
  if (kv) {
    const raw = await kv.get(key)
    if (raw) return JSON.parse(raw)
  }
  return null
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/$/, '') || '/'

    if (path === '/' || path === '/health') {
      return json({
        ok: true,
        service: 'kouvadeiros-scores',
        r2: !!env.SCORES_BUCKET,
        kv: !!(env.KOUV || env.STATE),
      })
    }

    if (path === '/live-scores' && request.method === 'GET') {
      const mode = url.searchParams.get('mode') || 'today'
      const key = mode === 'live' ? 'live.json' : 'today.json'
      try {
        const data = await readScores(env, key)
        if (!data) {
          return json({
            error: 'No data yet. Run: python scripts/upload_to_r2.py  (or --kv)',
            mode,
            key,
          }, 404)
        }
        return json(data, 200, {
          'Cache-Control': 'public, max-age=30, stale-while-revalidate=10',
        })
      } catch (e) {
        return json({ error: String(e.message || e) }, 500)
      }
    }

    return json({ error: 'not_found', path }, 404)
  },
}
