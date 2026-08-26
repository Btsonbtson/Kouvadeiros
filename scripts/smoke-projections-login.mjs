/**
 * Smoke: live Worker login preferred; offline tips persist; Leg1 quals seeded.
 * Run: node scripts/smoke-projections-login.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SEEDED_PREDICTIONS,
  mergeSeededPredictions,
  resolveQualTip,
  ALL_FIXTURES,
} from '../src/lib/data.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apiSrc = fs.readFileSync(path.join(root, 'src/lib/api.js'), 'utf8')
const appSrc = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8')
const loginSrc = fs.readFileSync(path.join(root, 'src/pages/Login.jsx'), 'utf8')
const mainSrc = fs.readFileSync(path.join(root, 'src/main.jsx'), 'utf8')

// Must NOT gate Worker on version >= 13 (live ping still reports 11)
if (/version\)\s*>=\s*13/.test(apiSrc) || /Number\(d\?\.version\)\s*>=\s*13/.test(apiSrc)) {
  throw new Error('api.js must not reject Worker solely because version < 13')
}
if (!/workerReachable/.test(apiSrc)) {
  throw new Error('expected workerReachable()')
}
if (!/saveOfflinePrediction/.test(apiSrc) || !/kouv_offline_preds/.test(apiSrc)) {
  throw new Error('offline prediction persistence missing')
}
if (!/tryUpgradeOfflineSession/.test(apiSrc) || !/tryUpgradeOfflineSession/.test(mainSrc)) {
  throw new Error('offline→Worker session upgrade missing')
}
if (!/quickLogin/.test(apiSrc) || !/quickLogin/.test(loginSrc)) {
  throw new Error('Login must use async quickLogin (Worker first)')
}

// History must show Leg 1 πρόκριση tips
if (!/ΠΡΟΒΛΕΨΕΙΣ ΠΡΟΚΡΙΣΗΣ/.test(appSrc) && !/shownQual/.test(appSrc)) {
  throw new Error('History/App must render qualification tips')
}
if (!/Πρόκριση από Leg 1/.test(appSrc)) {
  throw new Error('Leg 2 cards must show Leg 1 πρόκριση strip')
}

// Seeds: all PO Leg 1 ties include quals for every player
const LEG1 = ['ucl-aek-1', 'uel-ofi-1', 'uecl-paok-1', 'uecl-pao-5']
for (const id of LEG1) {
  const row = SEEDED_PREDICTIONS[id]
  if (!row) throw new Error(`missing seed ${id}`)
  for (const pid of ['boikos', 'mavromichalis', 'chousiadas']) {
    if (!row[pid]?.qual) throw new Error(`${id}/${pid} missing qual seed`)
  }
}

const merged = mergeSeededPredictions({})
const aek = ALL_FIXTURES.find((m) => m.id === 'ucl-aek-2')
const q = resolveQualTip(merged, ALL_FIXTURES, aek, 'chousiadas')
if (q !== 'AEK') throw new Error(`expected Chousiadas AEK qual on Leg2 card, got ${q}`)

console.log('OK — Worker login preferred, offline tips persist, Leg1 quals visible')
