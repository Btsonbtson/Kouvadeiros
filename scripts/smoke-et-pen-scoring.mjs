/**
 * Smoke tests for ET / pen / DQ scoring rules.
 * Run: node scripts/smoke-et-pen-scoring.mjs
 */
import { scoreMatch, scorePlayerMatch } from '../src/lib/data.js'

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

// DQ only when 90′ tip missing (and someone else tipped)
{
  const actual = { h: 1, a: 1, overtime: true, otH: 2, otA: 1 }
  const sc = scoreMatch(null, actual, { allowDq: true })
  assert(sc?.dq === true && sc.points === -1, 'missing 90′ tip → DQ −1')
}

// Missing ET tip when ET played → 0 on ET layer, not DQ
{
  const pred = { h: 1, a: 1 }
  const actual = { h: 1, a: 1, overtime: true, otH: 2, otA: 1 }
  const sc = scoreMatch(pred, actual)
  assert(sc.dq === false, 'no DQ with 90′ tip')
  assert(sc.scorePts === 2, 'exact 90′ = 2')
  assert(sc.etPts === 0, 'missing ET tip = 0 ET pts')
  assert(sc.points === 2, 'total = 90′ only')
}

// ET exact + outcome
{
  const pred = { h: 1, a: 1, predOT: true, otH: 2, otA: 1 }
  const actual = { h: 1, a: 1, overtime: true, otH: 2, otA: 1 }
  const sc = scoreMatch(pred, actual)
  assert(sc.scorePts === 2 && sc.etPts === 2 && sc.points === 4, '90′+ET exact = 4')
}

// Pens exact + winner (+ ET wrong outcome still can score pens)
{
  const pred = {
    h: 1, a: 1, predOT: true, otH: 1, otA: 1,
    predPen: true, penH: 5, penA: 4,
  }
  const actual = {
    h: 1, a: 1, overtime: true, otH: 1, otA: 1,
    penalties: true, penH: 5, penA: 4, qual: 'PAO',
  }
  const sc = scoreMatch(pred, actual, { qualTip: 'PAO', awardQual: true })
  assert(sc.scorePts === 2, '90′')
  assert(sc.etPts === 2, 'ET')
  assert(sc.penPts === 2, 'pens')
  assert(sc.qualPts === 1, 'qual')
  assert(sc.points === 7, 'max Leg 2 = 7')
}

// Missing pen tip → 0 pen pts
{
  const pred = { h: 1, a: 1, predOT: true, otH: 1, otA: 1 }
  const actual = {
    h: 1, a: 1, overtime: true, otH: 1, otA: 1,
    penalties: true, penH: 4, penA: 3,
  }
  const sc = scoreMatch(pred, actual)
  assert(sc.etPts === 2 && sc.penPts === 0 && sc.points === 4, 'no pen tip = 0 pen')
}

// Chousiadas tonight-style: 90′ exact, ET tip wrong
{
  const fixtures = [
    { id: 'ucl-oly-1', leg: 1, tie: 'ucl-oly', home: 'OLY', away: 'NEC', t: 'UCL' },
    { id: 'ucl-oly-2', leg: 2, tie: 'ucl-oly', home: 'NEC', away: 'OLY', t: 'UCL' },
  ]
  const predictions = {
    'ucl-oly-1': { chousiadas: { h: 1, a: 0, qual: 'OLY' } },
    'ucl-oly-2': { chousiadas: { h: 1, a: 1, predOT: true, otH: 2, otA: 3 } },
  }
  const actual = { h: 1, a: 1, overtime: true, otH: 2, otA: 1 }
  const sc = scorePlayerMatch(
    fixtures[1],
    predictions['ucl-oly-2'].chousiadas,
    actual,
    predictions,
    fixtures,
    'chousiadas',
  )
  assert(sc.scorePts === 2, 'Chousiadas 90′ exact')
  assert(sc.etPts === 0, 'wrong ET tip (2–3 vs 2–1) → 0 ET')
  assert(sc.points === 2, 'no qual on OLY lock')
}

// DQ only via scorePlayerMatch when others tipped
{
  const fixtures = [{ id: 'm1', home: 'A', away: 'B', t: 'SL' }]
  const predictions = {
    m1: { boikos: { h: 1, a: 0 }, mavromichalis: null },
  }
  const actual = { h: 2, a: 0 }
  const scMiss = scorePlayerMatch(fixtures[0], null, actual, predictions, fixtures, 'mavromichalis')
  assert(scMiss?.dq === true && scMiss.points === -1, 'missing 90′ while others tipped → DQ')

  const scNobody = scorePlayerMatch(fixtures[0], null, actual, {}, fixtures, 'mavromichalis')
  assert(scNobody === null, 'nobody tipped → no DQ yet')
}

console.log('smoke-et-pen-scoring: OK')
