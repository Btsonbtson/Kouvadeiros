#!/usr/bin/env node
/**
 * Merge ntfy tip/result events into public/live-ledger.json (durable Pages snapshot).
 * Used by .github/workflows/sync-tip-ledger.yml — no Cloudflare secrets required.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ledgerPath = path.join(root, 'public/live-ledger.json')
const NTFY = process.env.NTFY_BASE || 'https://ntfy.adminforge.de/kouvadeiros-tips-bridge-2026'

const res = await fetch(`${NTFY}/json?poll=1&since=48h`, {
  headers: { Accept: 'application/x-ndjson, application/json' },
})
if (!res.ok) {
  console.error('ntfy poll failed', res.status)
  process.exit(0) // don't fail the schedule
}
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
  } catch { /* skip */ }
}

// Diagnostic/test residue that must never be baked into the production ledger.
const SKIP_MATCH_IDS = new Set(['test', 'diag-test'])

const predictions = {}
const results = {}
const brackets = {}
const bracketResults = {}
for (const ev of events) {
  if (SKIP_MATCH_IDS.has(ev.matchId)) continue
  const isTip =
    ev.type === 'tip' ||
    (!ev.type && ev.matchId && ev.playerId && typeof ev.h === 'number')
  if (isTip && ev.matchId && ev.playerId) {
    if (!predictions[ev.matchId]) predictions[ev.matchId] = {}
    predictions[ev.matchId][ev.playerId] = {
      h: ev.h,
      a: ev.a,
      qual: ev.qual ?? null,
      predOT: !!ev.predOT,
      otH: ev.otH ?? 0,
      otA: ev.otA ?? 0,
      predPen: !!ev.predPen,
      penH: ev.penH ?? 0,
      penA: ev.penA ?? 0,
      savedAt: ev.ts || null,
    }
  } else if (ev.type === 'result' && ev.matchId) {
    results[ev.matchId] = {
      h: ev.h,
      a: ev.a,
      overtime: !!ev.overtime,
      otH: ev.otH,
      otA: ev.otA,
      penalties: !!ev.penalties,
      penH: ev.penH,
      penA: ev.penA,
      qual: ev.qual ?? null,
      setAt: ev.ts || null,
      source: 'bridge',
    }
  } else if (ev.type === 'bracket' && ev.team && ev.playerId && ev.pick) {
    if (!brackets[ev.team]) brackets[ev.team] = {}
    brackets[ev.team][ev.playerId] = ev.pick
  } else if (ev.type === 'bracket-result' && ev.team && ev.actual) {
    bracketResults[ev.team] = ev.actual
  }
}

let prev = { predictions: {}, results: {}, brackets: {}, bracketResults: {}, events: [] }
try {
  prev = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'))
} catch { /* fresh */ }

// Merge: keep prior tips/picks not present in this poll (ntfy retention window)
const mergedPreds = { ...(prev.predictions || {}) }
for (const [mid, row] of Object.entries(predictions)) {
  mergedPreds[mid] = { ...(mergedPreds[mid] || {}), ...row }
}
const mergedResults = { ...(prev.results || {}), ...results }
const mergedBrackets = { ...(prev.brackets || {}) }
for (const [team, row] of Object.entries(brackets)) {
  mergedBrackets[team] = { ...(mergedBrackets[team] || {}), ...row }
}
const mergedBracketResults = { ...(prev.bracketResults || {}), ...bracketResults }

const next = {
  version: 1,
  updatedAt: new Date().toISOString(),
  predictions: mergedPreds,
  results: mergedResults,
  brackets: mergedBrackets,
  bracketResults: mergedBracketResults,
  events: events.slice(-200),
}

const prevStr = JSON.stringify({
  predictions: prev.predictions || {},
  results: prev.results || {},
  brackets: prev.brackets || {},
  bracketResults: prev.bracketResults || {},
})
const nextStr = JSON.stringify({
  predictions: next.predictions,
  results: next.results,
  brackets: next.brackets,
  bracketResults: next.bracketResults,
})
if (prevStr === nextStr) {
  console.log('no tip ledger changes')
  process.exit(0)
}

fs.writeFileSync(ledgerPath, JSON.stringify(next, null, 2) + '\n')
console.log(
  'updated live-ledger.json',
  'matches=', Object.keys(next.predictions).length,
  'results=', Object.keys(next.results).length,
  'brackets=', Object.keys(next.brackets).length,
)
