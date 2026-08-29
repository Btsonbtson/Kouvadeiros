#!/usr/bin/env node
/**
 * Smoke: League Phase final-standing bracket predictions.
 * Rules confirmed 2026-08-29: 1pt correct bracket, -1 DQ if missing once the
 * actual is known, locks 15' before that team's own first League Phase match.
 * Run: node scripts/smoke-bracket-predictions.mjs
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ALL_FIXTURES,
  LEAGUE_PHASE_TEAMS,
  BRACKET_OPTIONS,
  BRACKET_FIRST_FIXTURE,
  bracketLockMatch,
  isBracketLocked,
  scoreBracketPick,
  applyBracketScores,
  computeLeaderboard,
  PLAYERS,
} from '../src/lib/data.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// 1) Every team has a real first-fixture mapping that resolves in ALL_FIXTURES.
assert.deepEqual(LEAGUE_PHASE_TEAMS.sort(), ['AEK', 'OFI', 'OLY', 'PAO'].sort())
assert.deepEqual(BRACKET_OPTIONS, ['1-8', '9-16', '17-24', '25-36'])
for (const team of LEAGUE_PHASE_TEAMS) {
  const id = BRACKET_FIRST_FIXTURE[team]
  const m = ALL_FIXTURES.find((f) => f.id === id)
  assert.ok(m, `${team} first fixture ${id} must exist in ALL_FIXTURES`)
  assert.equal(bracketLockMatch(team)?.id, id)
}

// 2) AEK's first match (ucl-aek-lp1, 8/9 19:45 Athens, confirmed time) locks
//    like a normal match — not TBD, so isBracketLocked reflects real KO-15'.
const aekMatch = ALL_FIXTURES.find((m) => m.id === 'ucl-aek-lp1')
assert.equal(aekMatch.timeTbd, undefined, 'AEK first fixture should have a confirmed time')
const aekKoMinus15 = new Date(aekMatch.kickoff).getTime() - 15 * 60 * 1000
const nowBeforeLock = Date.now() < aekKoMinus15
assert.equal(isBracketLocked('AEK'), !nowBeforeLock, 'AEK bracket lock must track its real KO-15\u2032')

// 3) OLY/OFI/PAO first matches are still timeTbd — bracket must never lock
//    while that's true, same rule as any TBD match tip.
for (const team of ['OLY', 'OFI', 'PAO']) {
  const m = bracketLockMatch(team)
  assert.equal(m.timeTbd, true, `${team} first fixture should still be timeTbd`)
  assert.equal(isBracketLocked(team), false, `${team} bracket must not lock while its first match is TBD`)
}

// 4) Scoring: correct pick +1, wrong pick 0, missing pick once actual is
//    known = -1 DQ. Unknown actual (League Phase still running) = not scored.
assert.equal(scoreBracketPick(null, null), null)
assert.equal(scoreBracketPick('1-8', null), null)
assert.deepEqual(scoreBracketPick('1-8', '1-8'), { points: 1, dq: false, exact: true })
assert.deepEqual(scoreBracketPick('9-16', '1-8'), { points: 0, dq: false, exact: false })
assert.deepEqual(scoreBracketPick(null, '1-8'), { points: -1, dq: true, exact: false })

// 5) applyBracketScores folds into leaderboard totals additively.
{
  const totals = {}
  PLAYERS.forEach((p) => { totals[p] = { pts: 10, bracket: 0, bracketDq: 0 } })
  const brackets = {
    AEK: { boikos: '1-8', mavromichalis: '9-16' /* chousiadas: missing */ },
  }
  const bracketResults = { AEK: '1-8' }
  applyBracketScores(totals, brackets, bracketResults)
  assert.equal(totals.boikos.pts, 11, 'correct AEK bracket pick should add +1')
  assert.equal(totals.mavromichalis.pts, 10, 'wrong AEK bracket pick should add 0')
  assert.equal(totals.chousiadas.pts, 9, 'missing AEK bracket pick (actual known) should DQ -1')
  assert.equal(totals.boikos.bracket, 1)
  assert.equal(totals.chousiadas.bracketDq, 1)
}

// 6) computeLeaderboard accepts brackets/bracketResults as optional trailing
//    args without needing every existing call site to pass them.
{
  const board = computeLeaderboard(ALL_FIXTURES, {}, {})
  assert.ok(board.every((r) => typeof r.pts === 'number'))
  const boardWithBrackets = computeLeaderboard(ALL_FIXTURES, {}, {}, { AEK: { boikos: '1-8' } }, { AEK: '1-8' })
  const boikosRow = boardWithBrackets.find((r) => r.player === 'boikos')
  assert.equal(boikosRow.bracket, 1)
}

// 7) Worker + bridge both expose /bracket and /bracket-result routes.
const workerSrc = fs.readFileSync(path.join(root, 'worker/kouvadeiros-api.js'), 'utf8')
assert.match(workerSrc, /path === '\/bracket' && request\.method === 'PATCH'/)
assert.match(workerSrc, /path === '\/bracket-result' && request\.method === 'PATCH'/)
assert.match(workerSrc, /if \(!state\.brackets\) state\.brackets = \{\}/)

const bridgeApiSrc = fs.readFileSync(path.join(root, 'functions/api/[[path]].js'), 'utf8')
assert.match(bridgeApiSrc, /path === '\/bracket' && request\.method === 'PATCH'/)
assert.match(bridgeApiSrc, /path === '\/bracket-result' && request\.method === 'PATCH'/)

const kouvLibSrc = fs.readFileSync(path.join(root, 'functions/_lib/kouv.js'), 'utf8')
assert.match(kouvLibSrc, /ev\.type === 'bracket'/)
assert.match(kouvLibSrc, /ev\.type === 'bracket-result'/)

const clientApiSrc = fs.readFileSync(path.join(root, 'src/lib/api.js'), 'utf8')
assert.match(clientApiSrc, /saveBracket:/)
assert.match(clientApiSrc, /saveBracketResult:/)
assert.match(clientApiSrc, /saveOfflineBracket/)

const mergeScriptSrc = fs.readFileSync(path.join(root, 'scripts/merge-ntfy-ledger.mjs'), 'utf8')
assert.match(mergeScriptSrc, /'bracket'/)
assert.match(mergeScriptSrc, /'bracket-result'/)

console.log('OK — bracket predictions: locks, scoring (+1/0/-1 DQ), Worker+bridge+client wiring')
