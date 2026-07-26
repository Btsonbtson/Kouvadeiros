// ─── FIXTURES ─────────────────────────────────────────────────────────────────
export const PLAYERS = ['boikos','mavromichalis','chousiadas']
export const PLAYER_NAMES = { boikos:'Boikos', mavromichalis:'Mavromichalis', chousiadas:'Chousiadas' }
export const PCOL = { boikos:'#ffdd00', mavromichalis:'#4d9fff', chousiadas:'#ff6b35' }

export const TEAMS = {
  PAO: {name:'Panathinaikos',abbr:'PAO',color:'#1a7c2a'},
  KIF: {name:'Kifisia',abbr:'KIF',color:'#1a3c6a'},
  KAL: {name:'Kalamata',abbr:'KAL',color:'#6a1a1a'},
  ARI: {name:'Aris',abbr:'ARI',color:'#b8960c'},
  OLY: {name:'Olympiacos',abbr:'OLY',color:'#c41e1e'},
  ATR: {name:'Atromitos',abbr:'ATR',color:'#1a3a6a'},
  PAOK:{name:'PAOK',abbr:'PAO',color:'#2c2c2c'},
  LEV: {name:'Levadiakos',abbr:'LEV',color:'#1a4a2a'},
  PNE: {name:'Panetolikos',abbr:'PNE',color:'#5a1a6a'},
  AST: {name:'Asteras',abbr:'AST',color:'#b87c0c'},
  AEK: {name:'AEK Athens',abbr:'AEK',color:'#c49a0c'},
  IRA: {name:'Iraklis',abbr:'IRA',color:'#1a2a7c'},
  OFI: {name:'OFI',abbr:'OFI',color:'#6a2c1a'},
  VOL: {name:'Volos',abbr:'VOL',color:'#1a5a2a'},
  DYN: {name:'Dynamo Kyiv',abbr:'DYN',color:'#003594'},
  NEC: {name:'NEC Nijmegen',abbr:'NEC',color:'#c00000'},
  PKS: {name:'Paksi SE',abbr:'PKS',color:'#006400'},
  TBD: {name:'TBD',abbr:'TBD',color:'#444444'},
}

const SL1 = '2026-08-22T13:00:00Z'
export const SUPER_LEAGUE = [
  {id:'sl-1-1',t:'SL',md:1,home:'PAO', away:'KIF', kickoff:SL1,round:'Αγωνιστική 1'},
  {id:'sl-1-2',t:'SL',md:1,home:'KAL', away:'ARI', kickoff:SL1,round:'Αγωνιστική 1'},
  {id:'sl-1-3',t:'SL',md:1,home:'OLY', away:'ATR', kickoff:SL1,round:'Αγωνιστική 1'},
  {id:'sl-1-4',t:'SL',md:1,home:'PAOK',away:'LEV', kickoff:SL1,round:'Αγωνιστική 1'},
  {id:'sl-1-5',t:'SL',md:1,home:'PNE', away:'AST', kickoff:SL1,round:'Αγωνιστική 1'},
  {id:'sl-1-6',t:'SL',md:1,home:'AEK', away:'IRA', kickoff:SL1,round:'Αγωνιστική 1'},
  {id:'sl-1-7',t:'SL',md:1,home:'OFI', away:'VOL', kickoff:SL1,round:'Αγωνιστική 1'},
]

export const UEFA_FIXTURES = [
  {id:'uel-paok-1', t:'UEL', greek:'PAOK', home:'DYN', away:'PAOK', kickoff:'2026-07-23T17:00:00Z', round:'Q2 · Leg 1', leg:1, tie:'uel-paok', venue:'Motor Lublin Arena, Πολωνία'},
  {id:'uel-paok-2', t:'UEL', greek:'PAOK', home:'PAOK',away:'DYN',  kickoff:'2026-07-30T18:30:00Z', round:'Q2 · Leg 2', leg:2, tie:'uel-paok', venue:'Toumba, Θεσσαλονίκη'},
  {id:'uecl-pao-1', t:'UECL',greek:'PAO', home:'PKS', away:'PAO',  kickoff:'2026-07-23T18:00:00Z', round:'Q2 · Leg 1', leg:1, tie:'uecl-pao',venue:'Fehérvári úti, Paks'},
  {id:'uecl-pao-2', t:'UECL',greek:'PAO', home:'PAO', away:'PKS',  kickoff:'2026-07-30T18:30:00Z', round:'Q2 · Leg 2', leg:2, tie:'uecl-pao',venue:'ΟΑΚΑ, Αθήνα'},
  {id:'ucl-oly-1',  t:'UCL', greek:'OLY', home:'OLY', away:'NEC',  kickoff:'2026-08-04T18:30:00Z', round:'Q3 · Leg 1', leg:1, tie:'ucl-oly', venue:'Karaiskakis, Πειραιάς'},
  {id:'ucl-oly-2',  t:'UCL', greek:'OLY', home:'NEC', away:'OLY',  kickoff:'2026-08-11T18:00:00Z', round:'Q3 · Leg 2', leg:2, tie:'ucl-oly', venue:'Goffert, Nijmegen'},
  {id:'ucl-aek-1',  t:'UCL', greek:'AEK', home:'AEK', away:'TBD',  kickoff:'2026-08-19T18:30:00Z', round:'PO · Leg 1', leg:1, tie:'ucl-aek', venue:'OPAP Arena, Αθήνα'},
  {id:'ucl-aek-2',  t:'UCL', greek:'AEK', home:'TBD', away:'AEK',  kickoff:'2026-08-26T18:30:00Z', round:'PO · Leg 2', leg:2, tie:'ucl-aek'},
]

export const ALL_FIXTURES = [...SUPER_LEAGUE, ...UEFA_FIXTURES]

// ─── SCORING ──────────────────────────────────────────────────────────────────
export function matchResult(h, a) { return h > a ? 'H' : h < a ? 'A' : 'D' }

export function scoreMatch(pred, actual) {
  if (!pred || actual == null) return null
  const exact   = pred.h === actual.h && pred.a === actual.a
  const correct = matchResult(pred.h, pred.a) === matchResult(actual.h, actual.a)
  return { exact, correct, points: (exact ? 1 : 0) + (correct ? 1 : 0) }
}

export function computeLeaderboard(fixtures, predictions, results) {
  const t = {}
  PLAYERS.forEach(p => { t[p] = { pts:0, exact:0, correct:0, played:0 } })
  fixtures.forEach(m => {
    const actual = results?.[m.id]
    if (actual == null) return
    PLAYERS.forEach(p => {
      const sc = scoreMatch(predictions?.[m.id]?.[p], actual)
      if (!sc) return
      t[p].pts    += sc.points
      t[p].played += 1
      if (sc.exact)   t[p].exact++
      if (sc.correct) t[p].correct++
    })
  })
  return PLAYERS.slice().sort((a, b) => t[b].pts - t[a].pts)
    .map((p, i) => ({ player: p, rank: i+1, ...t[p] }))
}

// ─── TIME ─────────────────────────────────────────────────────────────────────
const TZ = 'Europe/Athens'
export const grTime  = iso => new Date(iso).toLocaleTimeString('el-GR',  { timeZone:TZ, hour:'2-digit', minute:'2-digit' })
export const grShort = iso => new Date(iso).toLocaleDateString('el-GR',  { timeZone:TZ, day:'numeric', month:'short' })
export const grDate  = iso => new Date(iso).toLocaleDateString('el-GR',  { timeZone:TZ, weekday:'short', day:'numeric', month:'short' })
export const nowGR   = ()  => new Date().toLocaleTimeString('el-GR', { timeZone:TZ, hour:'2-digit', minute:'2-digit' })
export const isToday = iso => {
  const f = d => d.toLocaleDateString('el-GR', { timeZone:TZ })
  return f(new Date()) === f(new Date(iso))
}
export const isLocked = iso => Date.now() >= new Date(iso).getTime() - 60_000
