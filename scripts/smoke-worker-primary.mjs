#!/usr/bin/env node
/**
 * Behavioral smoke: Worker must be tried BEFORE the Pages bridge, and the
 * bridge must only be used as a fallback when the Worker is down/broken.
 * Regression guard for the "bridge always wins" bug (fixed 2026-08-29).
 *
 * Loads src/lib/api.js in a minimal browser-like shim (fetch/localStorage/
 * sessionStorage/window mocked) so the real module logic runs unmodified.
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

async function loadApiModule({ workerPing, bridgePing, workerLoginFails = false }) {
  // esbuild is already a transitive dep via vite; use it to strip ESM->CJS-ish for vm.
  const esbuild = await import('esbuild')
  const srcPath = path.join(root, 'src/lib/api.js')
  const bundle = await esbuild.build({
    entryPoints: [srcPath],
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node',
    external: [],
    define: { __WORKER_URL__: '"https://worker.test"', __SCORES_URL__: '"https://scores.test"' },
  })
  const code = bundle.outputFiles[0].text

  const calls = []
  const fetchMock = async (url, opts = {}) => {
    calls.push({ url: String(url), method: opts.method || 'GET' })
    if (String(url).startsWith('https://worker.test/ping')) {
      if (workerPing === null) throw new Error('network down')
      return { ok: true, json: async () => workerPing }
    }
    if (String(url).startsWith('/api/ping')) {
      if (bridgePing === null) return { ok: false, status: 404, json: async () => ({}) }
      return { ok: true, json: async () => bridgePing }
    }
    if (String(url).startsWith('https://worker.test/login')) {
      if (workerLoginFails) return { ok: false, status: 503, json: async () => ({ error: 'Session store failed' }) }
      return { ok: true, json: async () => ({ token: 'wkr-real-token-abc', id: 'boikos', name: 'Boikos', role: 'admin', email: 'boikos.y@caredirect.com' }) }
    }
    if (String(url).startsWith('/api/login')) {
      return { ok: true, json: async () => ({ token: 'br.fake.sig', id: 'boikos', name: 'Boikos', role: 'admin', email: 'boikos.y@caredirect.com' }) }
    }
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
  return { mod: sandbox.module.exports, calls, sandbox }
}

// ── Scenario 1: Worker healthy → must log in against Worker, not bridge ────
{
  const { mod, calls } = await loadApiModule({
    workerPing: { ok: true, version: 14, loginFixed: true },
    bridgePing: { ok: true, bridge: true, loginFixed: true, version: 20 },
  })
  const user = await mod.quickLogin('boikos')
  assert.equal(user?.token, 'wkr-real-token-abc', 'expected real Worker token when Worker is healthy')
  const loginCalls = calls.filter((c) => c.url.endsWith('/login'))
  assert.ok(loginCalls.some((c) => c.url.startsWith('https://worker.test')), 'must POST /login to the Worker')
  assert.ok(!loginCalls.some((c) => c.url.startsWith('/api')), 'must NOT POST /login to the bridge when Worker is healthy')
}

// ── Scenario 2: Worker down → falls back to bridge ──────────────────────────
{
  const { mod, calls } = await loadApiModule({
    workerPing: null,
    bridgePing: { ok: true, bridge: true, loginFixed: true, version: 20 },
  })
  const user = await mod.quickLogin('boikos')
  assert.equal(user?.token, 'br.fake.sig', 'expected bridge token when Worker is unreachable')
  const loginCalls = calls.filter((c) => c.url.endsWith('/login'))
  assert.ok(loginCalls.some((c) => c.url.startsWith('/api')), 'must fall back to bridge /login when Worker is down')
}

// ── Scenario 3: Both down → offline roster, no bridge/worker login attempted ─
{
  const { mod, calls } = await loadApiModule({ workerPing: null, bridgePing: null })
  const user = await mod.quickLogin('boikos')
  assert.ok(user?.offline === true, 'expected offline fallback when both backends are down')
  const loginCalls = calls.filter((c) => c.url.endsWith('/login'))
  assert.equal(loginCalls.length, 0, 'must not attempt any remote /login when both probes fail')
}

// ── Scenario 4: Worker /ping healthy but /login itself 503s (KV quota) ─────
// → must fall back to the bridge, NOT jump straight to fully-offline.
{
  const { mod, calls } = await loadApiModule({
    workerPing: { ok: true, version: 14, loginFixed: true },
    bridgePing: { ok: true, bridge: true, loginFixed: true, version: 20 },
    workerLoginFails: true,
  })
  const user = await mod.quickLogin('boikos')
  assert.equal(user?.token, 'br.fake.sig', 'expected bridge token when Worker /login 503s despite healthy /ping')
  const loginCalls = calls.filter((c) => c.url.endsWith('/login'))
  assert.ok(loginCalls.some((c) => c.url.startsWith('https://worker.test')), 'must have attempted Worker /login first')
  assert.ok(loginCalls.some((c) => c.url.startsWith('/api')), 'must fall back to bridge /login after Worker /login fails')
}

console.log('OK — Worker is primary, Pages bridge is fallback-only, offline is last resort')
