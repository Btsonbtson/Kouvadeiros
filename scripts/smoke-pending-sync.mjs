#!/usr/bin/env node
/**
 * Behavioral smoke: a tip/bracket/result publish that fails on all ntfy
 * hosts (blocked host, transient outage — the 2026-08-29 incident where one
 * player's saves silently never reached the shared ledger) must be queued
 * and automatically retried on the next bridge call, not lost silently.
 *
 * Loads the real src/lib/api.js in a mocked browser shim (same approach as
 * smoke-worker-primary.mjs) so the actual module logic runs unmodified.
 */
import assert from 'node:assert/strict'
import vm from 'node:vm'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function makeStorage() {
  const store = new Map()
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  }
}

async function loadApiModule() {
  const esbuild = await import('esbuild')
  const srcPath = path.join(root, 'src/lib/api.js')
  const bundle = await esbuild.build({
    entryPoints: [srcPath],
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node',
    define: { __WORKER_URL__: '"https://worker.test"', __SCORES_URL__: '"https://scores.test"' },
  })
  const code = bundle.outputFiles[0].text

  let ntfyShouldFail = true
  const ntfyCalls = []
  const fetchMock = async (url, opts = {}) => {
    const u = String(url)
    if (u.startsWith('https://worker.test/ping')) return { ok: false, status: 0 }
    if (u.startsWith('/api/ping')) return { ok: true, json: async () => ({ ok: true, bridge: true, loginFixed: true, version: 21 }) }
    if (u.startsWith('/api/login')) return { ok: true, json: async () => ({ token: 'br.fake.sig', id: 'mavromichalis', name: 'Mavromichalis', role: 'player', email: 'mavromichalis.y@caredirect.com' }) }
    if (u.includes('ntfy.') && opts.method === 'POST') {
      ntfyCalls.push({ url: u, body: opts.body })
      if (ntfyShouldFail) return { ok: false, status: 525 }
      return { ok: true, json: async () => ({ id: 'x' }) }
    }
    if (u.startsWith('/api/prediction') && opts.method === 'PATCH') return { ok: true, json: async () => ({ ok: true }) }
    if (u.startsWith('/api/state')) return { ok: true, json: async () => ({ predictions: {}, results: {}, revealed: {}, brackets: {}, bracketResults: {}, chat: [] }) }
    return { ok: false, status: 404, json: async () => ({}) }
  }

  const sandbox = {
    module: { exports: {} },
    exports: {},
    require: () => ({}),
    console,
    fetch: fetchMock,
    localStorage: makeStorage(),
    sessionStorage: makeStorage(),
    window: { location: { hostname: 'kouvadeiros.pages.dev' } },
    AbortController,
    setTimeout,
    clearTimeout,
    URL,
    Date,
  }
  sandbox.globalThis = sandbox
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox, { filename: 'api.bundle.cjs' })
  return {
    mod: sandbox.module.exports,
    sandbox,
    ntfyCalls,
    setNtfyFails: (v) => { ntfyShouldFail = v },
  }
}

const { mod, sandbox, ntfyCalls, setNtfyFails } = await loadApiModule()

// Log in (bridge, since Worker is mocked unreachable)
const user = await mod.quickLogin('mavromichalis')
assert.equal(user?.token, 'br.fake.sig', 'expected bridge login to succeed')
sandbox.localStorage.setItem('kouv_token', user.token)
sandbox.localStorage.setItem('kouv_user', JSON.stringify(user))

// All 3 ntfy hosts are "down" for this browser — the save must not be lost.
setNtfyFails(true)
const saveRes = await mod.api.savePred('sl-2-4', 1, 2, null, false, 0, 0, false, 0, 0)
assert.equal(saveRes.ok, true, 'save must still report ok (local mirror always succeeds)')
assert.ok(ntfyCalls.length >= 3, 'must have attempted all 3 ntfy hosts before giving up')

const pendingAfterFail = JSON.parse(sandbox.localStorage.getItem('kouv_pending_sync') || '[]')
assert.equal(pendingAfterFail.length, 1, 'failed publish must be queued for retry, not dropped')
assert.equal(pendingAfterFail[0].event.matchId, 'sl-2-4')
assert.equal(pendingAfterFail[0].event.h, 1)
assert.equal(pendingAfterFail[0].event.a, 2)

// ntfy recovers. The next bridge call (any call — /state here) must
// opportunistically flush the queue without the player doing anything.
setNtfyFails(false)
const ntfyCallsBefore = ntfyCalls.length
await mod.api.getState()
// Allow the fire-and-forget flushPendingSync() to complete.
await new Promise((r) => setTimeout(r, 20))
assert.ok(ntfyCalls.length > ntfyCallsBefore, 'the next bridge call must retry the queued publish')

const pendingAfterRecovery = JSON.parse(sandbox.localStorage.getItem('kouv_pending_sync') || '[]')
assert.equal(pendingAfterRecovery.length, 0, 'queue must be empty once the retry succeeds')

console.log('OK — failed bridge publishes are queued and auto-retried, never silently lost')
