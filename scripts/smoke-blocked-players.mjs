#!/usr/bin/env node
/**
 * Smoke: Mavromichalis and Chousiadas access-blocked, 2026-08-30.
 * Confirms the block is enforced at every auth chokepoint — Worker /login +
 * getUser(), bridge /login + verifyToken()/getUser(), client resolveLocalUser/
 * ensureOfflineSession/offline call() re-check, WhatsApp inbound webhook —
 * and that login-screen quick-tiles hide blocked players. Historical tips/
 * results in the ledger are intentionally left untouched (access-block only,
 * not a data purge).
 * Run: node scripts/smoke-blocked-players.mjs
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BLOCKED_PLAYER_IDS, isPlayerBlocked, PLAYERS } from '../src/lib/data.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// 1) Data model
assert.deepEqual(BLOCKED_PLAYER_IDS.slice().sort(), ['chousiadas', 'mavromichalis'])
assert.equal(isPlayerBlocked('mavromichalis'), true)
assert.equal(isPlayerBlocked('chousiadas'), true)
assert.equal(isPlayerBlocked('boikos'), false)
// Blocking is access-only — players stay in the roster/scoring model so
// historical tips/results/leaderboard rows are preserved.
assert.ok(PLAYERS.includes('mavromichalis'))
assert.ok(PLAYERS.includes('chousiadas'))

// 2) Worker: login rejects blocked users, getUser() rejects at every request
//    (so an already-issued token stops working immediately, not just future
//    logins), and the WhatsApp text-command inbound path is also blocked.
const workerSrc = fs.readFileSync(path.join(root, 'worker/kouvadeiros-api.js'), 'utf8')
assert.match(workerSrc, /import\s*\{[^}]*isPlayerBlocked[^}]*\}\s*from\s*'\.\.\/src\/lib\/data\.js'/s)
assert.match(workerSrc, /if \(isPlayerBlocked\(user\.id\)\) return json\(\{ error: 'Access blocked' \}, 403\)/)
assert.match(workerSrc, /if \(isPlayerBlocked\(user\.id\)\) return null/)
assert.match(workerSrc, /if \(playerId && isPlayerBlocked\(playerId\)\)/)

// 3) Bridge: same guarantees via verifyToken()/getUser() (signed tokens are
//    self-contained — this is the only place that can invalidate one) and
//    the /login route.
const kouvLibSrc = fs.readFileSync(path.join(root, 'functions/_lib/kouv.js'), 'utf8')
assert.match(kouvLibSrc, /import\s*\{[^}]*isPlayerBlocked[^}]*\}\s*from\s*'\.\.\/\.\.\/src\/lib\/data\.js'/s)
assert.match(kouvLibSrc, /if \(isPlayerBlocked\(user\.id\)\) return null/)
assert.match(kouvLibSrc, /if \(!user \|\| isPlayerBlocked\(user\.id\)\) return null/)

const bridgeApiSrc = fs.readFileSync(path.join(root, 'functions/api/[[path]].js'), 'utf8')
assert.match(bridgeApiSrc, /if \(isPlayerBlocked\(user\.id\)\) return json\(\{ error: 'Access blocked' \}, 403\)/)

// 4) Client: offline fallback re-checks on every call (no server round-trip
//    otherwise happens in offline mode), local credential resolution refuses
//    blocked ids, and boot/upgrade paths refuse to resurrect a blocked
//    session from a cached localStorage user.
const clientApiSrc = fs.readFileSync(path.join(root, 'src/lib/api.js'), 'utf8')
assert.match(clientApiSrc, /if \(isPlayerBlocked\(user\.id\)\) return null/)
assert.match(clientApiSrc, /if \(isPlayerBlocked\(id\)\) return null/)
assert.match(clientApiSrc, /if \(offlineUser\?\.id && isPlayerBlocked\(offlineUser\.id\)\)/)
assert.match(clientApiSrc, /if \(isPlayerBlocked\(prev\.id\)\) return null/)

const mainSrc = fs.readFileSync(path.join(root, 'src/main.jsx'), 'utf8')
assert.match(mainSrc, /if \(u\?\.id && isPlayerBlocked\(u\.id\)\)/)

// 5) Login screen hides blocked players' one-tap quick-login tiles.
const loginSrc = fs.readFileSync(path.join(root, 'src/pages/Login.jsx'), 'utf8')
assert.match(loginSrc, /VISIBLE_ROSTER = ROSTER_CREDENTIALS\.filter\(\(r\) => !isPlayerBlocked\(r\.id\)\)/)
assert.match(loginSrc, /VISIBLE_ROSTER\.map/)

console.log('OK — Mavromichalis + Chousiadas access-blocked at every auth chokepoint (Worker, bridge, offline, WhatsApp); login tiles hidden; history preserved')
