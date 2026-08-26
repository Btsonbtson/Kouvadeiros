#!/usr/bin/env node
/**
 * Smoke: Pages API bridge module loads + lock/reveal helpers behave.
 * Live /api/ping is checked when KOUV_BRIDGE_URL is set (post-deploy).
 */
import assert from 'node:assert/strict'
import {
  ALL_FIXTURES,
  applyKickoffOverrides,
  isLocked,
  isRevealOpen,
  mergeSeededPredictions,
} from '../src/lib/data.js'

const tonight = ALL_FIXTURES.find((m) => m.id === 'ucl-aek-2')
assert.ok(tonight, 'AEK Leg 2 fixture present')
assert.equal(typeof isRevealOpen, 'function')
assert.equal(typeof isLocked, 'function')
assert.equal(isRevealOpen(tonight.kickoff), isLocked(tonight.kickoff))

const merged = mergeSeededPredictions({
  'ucl-aek-2': { boikos: { h: 2, a: 1, qual: 'AEK' } },
})
assert.equal(merged['ucl-aek-2'].boikos.h, 2)
assert.ok(merged['ucl-aek-1']?.chousiadas, 'Leg 1 seeds still merge')

const overridden = applyKickoffOverrides(ALL_FIXTURES, {
  'ucl-aek-2': { kickoff: tonight.kickoff, timeTbd: false },
})
assert.ok(overridden.find((m) => m.id === 'ucl-aek-2'))

const live = process.env.KOUV_BRIDGE_URL || ''
if (live) {
  const ping = await fetch(`${live.replace(/\/$/, '')}/ping`)
  assert.equal(ping.ok, true, `bridge ping HTTP ${ping.status}`)
  const d = await ping.json()
  assert.equal(d.bridge, true)
  assert.equal(d.loginFixed, true)
  assert.ok(Number(d.version) >= 15, `bridge version ${d.version}`)
  console.log('OK — live bridge', d.version, d.ts)
} else {
  console.log('OK — bridge fixtures/seeds (set KOUV_BRIDGE_URL to probe live /api)')
}
