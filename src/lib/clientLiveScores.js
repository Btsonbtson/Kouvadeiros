/**
 * Browser-side live scores via ESPN scoreboards (CORS *).
 * Used when the scores Worker KV/R2 pipeline is stale/empty or users are offline
 * (Worker /fetch-scores unreachable without a real session).
 */
import { findMatchScore, scoreboardUrl, espnDateParam } from './espn.js'
import { inLiveScoreBand, isSchedulableFixture } from './data.js'

/**
 * Fetch ESPN boards (batched by league+date) for fixtures currently in the live band.
 * @param {object[]} fixtures
 * @returns {Promise<{ live: Record<string, object>, hints: Record<string, object> }>}
 */
export async function fetchClientLiveScores(fixtures = []) {
  const due = (fixtures || []).filter(
    (m) =>
      isSchedulableFixture(m) &&
      !m.postponed &&
      m.home !== 'TBD' &&
      m.away !== 'TBD' &&
      inLiveScoreBand(m.kickoff),
  )
  if (!due.length) return { live: {}, hints: {} }

  const boards = new Map()
  await Promise.all(
    [...new Set(due.map((m) => `${m.t}|${espnDateParam(m.kickoff)}`))].map(async (key) => {
      const [league, ] = key.split('|')
      const sample = due.find((m) => m.t === league && `${m.t}|${espnDateParam(m.kickoff)}` === key)
      if (!sample) return
      try {
        const res = await fetch(scoreboardUrl(sample.t, sample.kickoff))
        if (!res.ok) {
          boards.set(key, null)
          return
        }
        boards.set(key, await res.json())
      } catch {
        boards.set(key, null)
      }
    }),
  )

  const live = {}
  const hints = {}
  for (const m of due) {
    const key = `${m.t}|${espnDateParam(m.kickoff)}`
    const board = boards.get(key)
    if (!board) continue
    const score = findMatchScore(board, m)
    if (!score) continue
    if (!score.final && !score.inPlay) continue
    const row = {
      h: Number(score.h),
      a: Number(score.a),
      min: score.final ? 90 : (score.min || 1),
      status: score.status || (score.final ? 'FT' : 'LIVE'),
      provider: 'espn-client',
      final: !!score.final,
      eventId: score.eventId,
    }
    if (row.final) hints[m.id] = row
    else live[m.id] = row
  }
  return { live, hints }
}
