#!/usr/bin/env node
/**
 * One-time migration: import public/live-ledger.json (tips/results saved
 * while the Pages bridge was primary) into the real Worker's KV.
 *
 * Run this ONCE, right after Cloudflare secrets are added and Deploy Worker
 * succeeds (kouvadeiros-api ping shows loginFixed / version>=13), so no
 * predictions made during the bridge period are lost.
 *
 * Usage:
 *   node scripts/import-ledger-to-worker.mjs [--dry-run]
 *
 * Safe to re-run: every PATCH is idempotent (last-write-wins per match/player),
 * and admin PATCH /prediction bypasses the 15' lock so historical tips still
 * land even though those matches finished long ago.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const WORKER_BASE = process.env.KOUV_WORKER_URL || 'https://kouvadeiros-api.jboikos.workers.dev'
const ADMIN_EMAIL = process.env.KOUV_ADMIN_EMAIL || 'boikos.y@caredirect.com'
const ADMIN_PASSWORD = process.env.KOUV_ADMIN_PASSWORD || '1453'
const DRY_RUN = process.argv.includes('--dry-run')

const ledgerPath = path.join(root, 'public/live-ledger.json')
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'))

// Diagnostic/test residue that must never be pushed into production KV.
const SKIP_MATCH_IDS = new Set(['test'])

async function main() {
  console.log(`Ledger: ${ledgerPath}`)
  console.log(`Worker: ${WORKER_BASE}${DRY_RUN ? '  (dry run — no writes)' : ''}`)

  const ping = await fetch(`${WORKER_BASE}/ping`).then((r) => r.json()).catch(() => null)
  if (!ping?.ok) throw new Error('Worker /ping failed — is it deployed and healthy?')
  if (ping.bridge === true) throw new Error('This URL is answering as the bridge, not the Worker — check KOUV_WORKER_URL')
  if (!(ping.loginFixed === true || Number(ping.version) >= 13)) {
    throw new Error(`Worker version ${ping.version} still has broken /login (CF 1101) — deploy first`)
  }
  console.log(`Worker healthy: version=${ping.version} loginFixed=${ping.loginFixed}`)

  const loginRes = await fetch(`${WORKER_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!loginRes.ok) throw new Error(`Admin login failed: HTTP ${loginRes.status}`)
  const { token, role } = await loginRes.json()
  if (!token) throw new Error('Admin login did not return a token')
  if (role !== 'admin') throw new Error(`Logged in as role="${role}", need admin to force-write other players' tips`)
  console.log('Logged in as admin.')

  const auth = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  let tipsSent = 0, tipsFailed = 0, resultsSent = 0, resultsFailed = 0

  for (const [matchId, byPlayer] of Object.entries(ledger.predictions || {})) {
    if (SKIP_MATCH_IDS.has(matchId)) {
      console.log(`  skip match "${matchId}" (test residue)`)
      continue
    }
    for (const [playerId, tip] of Object.entries(byPlayer || {})) {
      if (!tip || typeof tip.h !== 'number' || typeof tip.a !== 'number') continue
      const body = {
        matchId,
        playerId,
        h: tip.h,
        a: tip.a,
        qual: tip.qual ?? null,
        predOT: !!tip.predOT,
        otH: tip.otH ?? 0,
        otA: tip.otA ?? 0,
        predPen: !!tip.predPen,
        penH: tip.penH ?? 0,
        penA: tip.penA ?? 0,
      }
      if (DRY_RUN) {
        console.log(`  [dry-run] tip ${matchId}/${playerId} ${tip.h}-${tip.a}`)
        tipsSent++
        continue
      }
      try {
        const res = await fetch(`${WORKER_BASE}/prediction`, { method: 'PATCH', headers: auth, body: JSON.stringify(body) })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        tipsSent++
      } catch (e) {
        tipsFailed++
        console.warn(`  ! tip ${matchId}/${playerId} failed: ${e.message}`)
      }
    }
  }

  for (const [matchId, result] of Object.entries(ledger.results || {})) {
    if (SKIP_MATCH_IDS.has(matchId)) continue
    if (!result || typeof result.h !== 'number' || typeof result.a !== 'number') continue
    const body = {
      matchId,
      h: result.h,
      a: result.a,
      overtime: !!result.overtime,
      otH: result.otH,
      otA: result.otA,
      penalties: !!result.penalties,
      penH: result.penH,
      penA: result.penA,
      qual: result.qual ?? undefined,
    }
    if (DRY_RUN) {
      console.log(`  [dry-run] result ${matchId} ${result.h}-${result.a} qual=${result.qual || '-'}`)
      resultsSent++
      continue
    }
    try {
      const res = await fetch(`${WORKER_BASE}/result`, { method: 'PATCH', headers: auth, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      resultsSent++
    } catch (e) {
      resultsFailed++
      console.warn(`  ! result ${matchId} failed: ${e.message}`)
    }
  }

  console.log('')
  console.log(`Tips:    ${tipsSent} sent, ${tipsFailed} failed`)
  console.log(`Results: ${resultsSent} sent, ${resultsFailed} failed`)
  if (tipsFailed || resultsFailed) process.exitCode = 1
}

main().catch((e) => {
  console.error('Migration failed:', e.message)
  process.exit(1)
})
