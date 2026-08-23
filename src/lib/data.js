// SL fixtures v2 — official slgr.gr schedule
// ─── FIXTURES ─────────────────────────────────────────────────────────────────
export const PLAYERS = ['boikos','mavromichalis','chousiadas']
export const PLAYER_NAMES = { boikos:'Boikos', mavromichalis:'Mavromichalis', chousiadas:'Chousiadas' }
export const PCOL = { boikos:'#ff2244', mavromichalis:'#ffdd00', chousiadas:'#00ff88' }

export const TEAMS = {
  PAO: {name:'Παναθηναϊκός',abbr:'PAO',color:'#1a7c2a'},
  KIF: {name:'Kifisia',abbr:'KIF',color:'#1a3c6a'},
  KAL: {name:'Καλαμάτα',abbr:'KAL',color:'#6a1a1a'},
  ARI: {name:'Άρης',abbr:'ARI',color:'#b8960c'},
  OLY: {name:'Ολυμπιακός',abbr:'OLY',color:'#c41e1e'},
  ATR: {name:'Ατρόμητος',abbr:'ATR',color:'#1a3a6a'},
  PAOK:{name:'ΠΑΟΚ',abbr:'PAOK',color:'#2c2c2c'},
  LEV: {name:'Λεβαδειακός',abbr:'LEV',color:'#1a4a2a'},
  PNE: {name:'Παναιτωλικός',abbr:'PNE',color:'#5a1a6a'},
  AST: {name:'Asteras',abbr:'AST',color:'#b87c0c'},
  AEK: {name:'ΑΕΚ',abbr:'AEK',color:'#c49a0c'},
  IRA: {name:'Ηρακλής',abbr:'IRA',color:'#1a2a7c'},
  OFI: {name:'ΟΦΗ',abbr:'OFI',color:'#6a2c1a'},
  VOL: {name:'Βόλος',abbr:'VOL',color:'#1a5a2a'},
  DYN: {name:'Dynamo Kyiv',abbr:'DYN',color:'#003594'},
  NEC: {name:'NEC Nijmegen',abbr:'NEC',color:'#c00000'},
  PKS: {name:'Paksi SE',abbr:'PKS',color:'#006400'},
  AND: {name:'Anderlecht',abbr:'AND',color:'#6c3'},
  CSK: {name:'CSKA 1948',abbr:'CSK',color:'#c41e1e'},
  LVS: {name:'Levski Sofia',abbr:'LVS',color:'#0033a0'},
  CSS: {name:'CSKA Sofia',abbr:'CSS',color:'#c41e1e'},
  BRN: {name:'Brann',abbr:'BRN',color:'#c4122e'},
  HRK: {name:'Hradec Králové',abbr:'HRK',color:'#000000'},
  TBD: {name:'TBD',abbr:'TBD',color:'#444444'},
}

// Super League 2026/27 — Official Schedule (from slgr.gr)
// Team keys: PAO, KAL, OLY, PAOK, PNE, AEK, OFI, ATR, LEV, ARI, VOL, AST, KIF, IRA
// AST = Αστέρας ΑΚΤΩΡ, IRA = ΠΑΕ Ηρακλής, KIF = Κηφισιά, LEV = Λεβαδειακός
// PNE = Παναιτωλικός

// Super League 2026/27 — Official Schedule (from slgr.gr)
// Team keys: PAO, KAL, OLY, PAOK, PNE, AEK, OFI, ATR, LEV, ARI, VOL, AST, KIF, IRA
// AST = Αστέρας ΑΚΤΩΡ, IRA = ΠΑΕ Ηρακλής, KIF = Κηφισιά, LEV = Λεβαδειακός
// PNE = Παναιτωλικός

// SL 2026/27 Official Schedule — from Stoiximan official document
// Teams: AEK, AST=Asteras AKTOR, ARI=Άρης, ATR=Ατρόμητος, VOL=Βόλος
//        KIF=Κηφισιά, LEV=Λεβαδειακός, OLY=Ολυμπιακός, OFI=ΟΦΗ
//        PAO=Παναθηναϊκός, PNE=Παναιτωλικός, PAOK=ΠΑΟΚ
//        IRA=ΠΑΕ Ηρακλής, KAL=Καλαμάτα

// Stoiximan Super League 2026/27 — Official Schedule
// Source: Official Stoiximan schedule images
// Teams: AEK, IRA(ΠΟΤ ΗΡΑΚΛΗΣ), KAL(ΚΑΛΑΜΑΤΑ), OLY(ΟΛΥΜΠΙΑΚΟΣ), 
//        ATR(ΑΤΡΟΜΗΤΟΣ), OFI(ΟΦΗ), VOL(ΒΟΛΟΣ), PAO(ΠΑΝΑΘΗΝΑΪΚΟΣ),
//        KIF(ΚΗΦΙΣΙΑ), PNE(ΠΑΝΑΙΤΩΛΙΚΟΣ), AST(ASTERAS AKTOR),
//        PAOK, LEV(ΛΕΒΑΔΕΙΑΚΟΣ), ARI(ΑΡΗΣ)

export const SUPER_LEAGUE = [
  // ── 1η Αγωνιστική ── (ώρες: πρόγραμμα 21/8/2026)
  {id:'sl-1-1',t:'SL',md:1,home:'AEK', away:'IRA', kickoff:'2026-08-22T17:00:00Z',round:'Αγωνιστική 1'}, // Σάβ 22/8 20:00
  {id:'sl-1-2',t:'SL',md:1,home:'KAL', away:'ARI', kickoff:'2026-08-22T17:00:00Z',round:'Αγωνιστική 1'}, // Σάβ 22/8 20:00
  {id:'sl-1-3',t:'SL',md:1,home:'OLY', away:'ATR', kickoff:'2026-08-22T18:30:00Z',round:'Αγωνιστική 1'}, // Σάβ 22/8 21:30
  {id:'sl-1-4',t:'SL',md:1,home:'OFI', away:'VOL', kickoff:'2026-08-23T16:30:00Z',round:'Αγωνιστική 1'}, // Κυρ 23/8 19:30
  // Παναθηναϊκός–Κηφισιά: αναβολή · χωρίς tip / χωρίς DQ
  {id:'sl-1-5',t:'SL',md:1,home:'PAO', away:'KIF', kickoff:'2026-08-23T18:00:00Z',round:'Αγωνιστική 1', postponed:true, timeTbd:true},
  {id:'sl-1-6',t:'SL',md:1,home:'PNE', away:'AST', kickoff:'2026-08-23T18:30:00Z',round:'Αγωνιστική 1'}, // Κυρ 23/8 21:30
  {id:'sl-1-7',t:'SL',md:1,home:'PAOK',away:'LEV', kickoff:'2026-08-23T18:00:00Z',round:'Αγωνιστική 1'}, // Κυρ 23/8 21:00

  // ── 2η Αγωνιστική ──
  {id:'sl-2-1',t:'SL',md:2,home:'AST', away:'OLY', kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2', timeTbd:true},
  {id:'sl-2-2',t:'SL',md:2,home:'ARI', away:'OFI', kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2', timeTbd:true},
  {id:'sl-2-3',t:'SL',md:2,home:'ATR', away:'PAOK',kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2', timeTbd:true},
  {id:'sl-2-4',t:'SL',md:2,home:'VOL', away:'IRA', kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2', timeTbd:true},
  {id:'sl-2-5',t:'SL',md:2,home:'KIF', away:'AEK', kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2', timeTbd:true},
  {id:'sl-2-6',t:'SL',md:2,home:'LEV', away:'PAO', kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2', timeTbd:true},
  {id:'sl-2-7',t:'SL',md:2,home:'PNE', away:'KAL', kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2', timeTbd:true},

  // ── 3η Αγωνιστική ──
  {id:'sl-3-1',t:'SL',md:3,home:'AEK', away:'ARI', kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3', timeTbd:true},
  {id:'sl-3-2',t:'SL',md:3,home:'ATR', away:'KAL', kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3', timeTbd:true},
  {id:'sl-3-3',t:'SL',md:3,home:'VOL', away:'OLY', kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3', timeTbd:true},
  {id:'sl-3-4',t:'SL',md:3,home:'LEV', away:'PNE', kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3', timeTbd:true},
  {id:'sl-3-5',t:'SL',md:3,home:'OFI', away:'KIF', kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3', timeTbd:true},
  {id:'sl-3-6',t:'SL',md:3,home:'PAO', away:'PAOK',kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3', timeTbd:true},
  {id:'sl-3-7',t:'SL',md:3,home:'IRA', away:'AST', kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3', timeTbd:true},

  // ── 4η Αγωνιστική ──
  {id:'sl-4-1',t:'SL',md:4,home:'AST', away:'AEK', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4', timeTbd:true},
  {id:'sl-4-2',t:'SL',md:4,home:'KAL', away:'VOL', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4', timeTbd:true},
  {id:'sl-4-3',t:'SL',md:4,home:'KIF', away:'LEV', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4', timeTbd:true},
  {id:'sl-4-4',t:'SL',md:4,home:'OLY', away:'OFI', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4', timeTbd:true},
  {id:'sl-4-5',t:'SL',md:4,home:'PAO', away:'PNE', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4', timeTbd:true},
  {id:'sl-4-6',t:'SL',md:4,home:'PAOK',away:'ARI', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4', timeTbd:true},
  {id:'sl-4-7',t:'SL',md:4,home:'IRA', away:'ATR', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4', timeTbd:true},

  // ── 5η Αγωνιστική ──
  {id:'sl-5-1',t:'SL',md:5,home:'ARI', away:'IRA', kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5', timeTbd:true},
  {id:'sl-5-2',t:'SL',md:5,home:'ATR', away:'KIF', kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5', timeTbd:true},
  {id:'sl-5-3',t:'SL',md:5,home:'VOL', away:'AEK', kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5', timeTbd:true},
  {id:'sl-5-4',t:'SL',md:5,home:'KAL', away:'PAO', kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5', timeTbd:true},
  {id:'sl-5-5',t:'SL',md:5,home:'LEV', away:'OLY', kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5', timeTbd:true},
  {id:'sl-5-6',t:'SL',md:5,home:'OFI', away:'AST', kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5', timeTbd:true},
  {id:'sl-5-7',t:'SL',md:5,home:'PNE', away:'PAOK',kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5', timeTbd:true},

  // ── 6η Αγωνιστική ──
  {id:'sl-6-1',t:'SL',md:6,home:'AEK', away:'OFI', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6', timeTbd:true},
  {id:'sl-6-2',t:'SL',md:6,home:'AST', away:'ATR', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6', timeTbd:true},
  {id:'sl-6-3',t:'SL',md:6,home:'ARI', away:'VOL', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6', timeTbd:true},
  {id:'sl-6-4',t:'SL',md:6,home:'KIF', away:'PNE', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6', timeTbd:true},
  {id:'sl-6-5',t:'SL',md:6,home:'OLY', away:'PAO', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6', timeTbd:true},
  {id:'sl-6-6',t:'SL',md:6,home:'PAOK',away:'KAL', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6', timeTbd:true},
  {id:'sl-6-7',t:'SL',md:6,home:'IRA', away:'LEV', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6', timeTbd:true},

  // ── 7η Αγωνιστική ──
  {id:'sl-7-1',t:'SL',md:7,home:'ATR', away:'AEK', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7', timeTbd:true},
  {id:'sl-7-2',t:'SL',md:7,home:'KAL', away:'OFI', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7', timeTbd:true},
  {id:'sl-7-3',t:'SL',md:7,home:'KIF', away:'ARI', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7', timeTbd:true},
  {id:'sl-7-4',t:'SL',md:7,home:'LEV', away:'VOL', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7', timeTbd:true},
  {id:'sl-7-5',t:'SL',md:7,home:'PAO', away:'AST', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7', timeTbd:true},
  {id:'sl-7-6',t:'SL',md:7,home:'PNE', away:'OLY', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7', timeTbd:true},
  {id:'sl-7-7',t:'SL',md:7,home:'PAOK',away:'IRA', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7', timeTbd:true},

  // ── 8η Αγωνιστική ──
  {id:'sl-8-1',t:'SL',md:8,home:'AEK', away:'PNE', kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8', timeTbd:true},
  {id:'sl-8-2',t:'SL',md:8,home:'AST', away:'LEV', kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8', timeTbd:true},
  {id:'sl-8-3',t:'SL',md:8,home:'ARI', away:'ATR', kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8', timeTbd:true},
  {id:'sl-8-4',t:'SL',md:8,home:'VOL', away:'PAO', kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8', timeTbd:true},
  {id:'sl-8-5',t:'SL',md:8,home:'OLY', away:'KAL', kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8', timeTbd:true},
  {id:'sl-8-6',t:'SL',md:8,home:'OFI', away:'PAOK',kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8', timeTbd:true},
  {id:'sl-8-7',t:'SL',md:8,home:'IRA', away:'KIF', kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8', timeTbd:true},

  // ── 9η Αγωνιστική ──
  {id:'sl-9-1',t:'SL',md:9,home:'ATR', away:'VOL', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9', timeTbd:true},
  {id:'sl-9-2',t:'SL',md:9,home:'KAL', away:'IRA', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9', timeTbd:true},
  {id:'sl-9-3',t:'SL',md:9,home:'KIF', away:'OLY', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9', timeTbd:true},
  {id:'sl-9-4',t:'SL',md:9,home:'LEV', away:'ARI', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9', timeTbd:true},
  {id:'sl-9-5',t:'SL',md:9,home:'PAO', away:'AEK', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9', timeTbd:true},
  {id:'sl-9-6',t:'SL',md:9,home:'PNE', away:'OFI', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9', timeTbd:true},
  {id:'sl-9-7',t:'SL',md:9,home:'PAOK',away:'AST', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9', timeTbd:true},

  // ── 10η Αγωνιστική ──
  {id:'sl-10-1',t:'SL',md:10,home:'AEK', away:'LEV', kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10', timeTbd:true},
  {id:'sl-10-2',t:'SL',md:10,home:'AST', away:'KAL', kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10', timeTbd:true},
  {id:'sl-10-3',t:'SL',md:10,home:'ARI', away:'PNE', kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10', timeTbd:true},
  {id:'sl-10-4',t:'SL',md:10,home:'VOL', away:'KIF', kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10', timeTbd:true},
  {id:'sl-10-5',t:'SL',md:10,home:'OLY', away:'PAOK',kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10', timeTbd:true},
  {id:'sl-10-6',t:'SL',md:10,home:'OFI', away:'ATR', kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10', timeTbd:true},
  {id:'sl-10-7',t:'SL',md:10,home:'IRA', away:'PAO', kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10', timeTbd:true},

  // ── 11η Αγωνιστική ──
  {id:'sl-11-1',t:'SL',md:11,home:'AST', away:'ARI', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11', timeTbd:true},
  {id:'sl-11-2',t:'SL',md:11,home:'KAL', away:'AEK', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11', timeTbd:true},
  {id:'sl-11-3',t:'SL',md:11,home:'LEV', away:'ATR', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11', timeTbd:true},
  {id:'sl-11-4',t:'SL',md:11,home:'OLY', away:'IRA', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11', timeTbd:true},
  {id:'sl-11-5',t:'SL',md:11,home:'PAO', away:'OFI', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11', timeTbd:true},
  {id:'sl-11-6',t:'SL',md:11,home:'PNE', away:'VOL', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11', timeTbd:true},
  {id:'sl-11-7',t:'SL',md:11,home:'PAOK',away:'KIF', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11', timeTbd:true},

  // ── 12η Αγωνιστική ──
  {id:'sl-12-1',t:'SL',md:12,home:'AEK', away:'PAOK',kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12', timeTbd:true},
  {id:'sl-12-2',t:'SL',md:12,home:'ARI', away:'OLY', kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12', timeTbd:true},
  {id:'sl-12-3',t:'SL',md:12,home:'ATR', away:'PAO', kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12', timeTbd:true},
  {id:'sl-12-4',t:'SL',md:12,home:'VOL', away:'AST', kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12', timeTbd:true},
  {id:'sl-12-5',t:'SL',md:12,home:'KIF', away:'KAL', kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12', timeTbd:true},
  {id:'sl-12-6',t:'SL',md:12,home:'OFI', away:'LEV', kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12', timeTbd:true},
  {id:'sl-12-7',t:'SL',md:12,home:'IRA', away:'PNE', kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12', timeTbd:true},

  // ── 13η Αγωνιστική ──
  {id:'sl-13-1',t:'SL',md:13,home:'AST', away:'KIF', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13', timeTbd:true},
  {id:'sl-13-2',t:'SL',md:13,home:'KAL', away:'LEV', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13', timeTbd:true},
  {id:'sl-13-3',t:'SL',md:13,home:'OLY', away:'AEK', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13', timeTbd:true},
  {id:'sl-13-4',t:'SL',md:13,home:'OFI', away:'IRA', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13', timeTbd:true},
  {id:'sl-13-5',t:'SL',md:13,home:'PAO', away:'ARI', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13', timeTbd:true},
  {id:'sl-13-6',t:'SL',md:13,home:'PNE', away:'ATR', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13', timeTbd:true},
  {id:'sl-13-7',t:'SL',md:13,home:'PAOK',away:'VOL', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13', timeTbd:true},

  // ── 14η Αγωνιστική ──
  {id:'sl-14-1',t:'SL',md:14,home:'AEK', away:'VOL', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14', timeTbd:true},
  {id:'sl-14-2',t:'SL',md:14,home:'ATR', away:'OLY', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14', timeTbd:true},
  {id:'sl-14-3',t:'SL',md:14,home:'KAL', away:'PNE', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14', timeTbd:true},
  {id:'sl-14-4',t:'SL',md:14,home:'KIF', away:'OFI', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14', timeTbd:true},
  {id:'sl-14-5',t:'SL',md:14,home:'LEV', away:'AST', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14', timeTbd:true},
  {id:'sl-14-6',t:'SL',md:14,home:'PAOK',away:'PAO', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14', timeTbd:true},
  {id:'sl-14-7',t:'SL',md:14,home:'IRA', away:'ARI', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14', timeTbd:true},

  // ── 15η Αγωνιστική ──
  {id:'sl-15-1',t:'SL',md:15,home:'AST', away:'PAOK',kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15', timeTbd:true},
  {id:'sl-15-2',t:'SL',md:15,home:'ARI', away:'AEK', kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15', timeTbd:true},
  {id:'sl-15-3',t:'SL',md:15,home:'VOL', away:'LEV', kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15', timeTbd:true},
  {id:'sl-15-4',t:'SL',md:15,home:'KIF', away:'ATR', kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15', timeTbd:true},
  {id:'sl-15-5',t:'SL',md:15,home:'OLY', away:'PNE', kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15', timeTbd:true},
  {id:'sl-15-6',t:'SL',md:15,home:'OFI', away:'KAL', kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15', timeTbd:true},
  {id:'sl-15-7',t:'SL',md:15,home:'PAO', away:'IRA', kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15', timeTbd:true},

  // ── 16η Αγωνιστική ──
  {id:'sl-16-1',t:'SL',md:16,home:'AEK', away:'ATR', kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16', timeTbd:true},
  {id:'sl-16-2',t:'SL',md:16,home:'AST', away:'PAO', kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16', timeTbd:true},
  {id:'sl-16-3',t:'SL',md:16,home:'ARI', away:'PAOK',kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16', timeTbd:true},
  {id:'sl-16-4',t:'SL',md:16,home:'KAL', away:'OLY', kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16', timeTbd:true},
  {id:'sl-16-5',t:'SL',md:16,home:'LEV', away:'OFI', kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16', timeTbd:true},
  {id:'sl-16-6',t:'SL',md:16,home:'PNE', away:'KIF', kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16', timeTbd:true},
  {id:'sl-16-7',t:'SL',md:16,home:'IRA', away:'VOL', kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16', timeTbd:true},

  // ── 17η Αγωνιστική ──
  {id:'sl-17-1',t:'SL',md:17,home:'AEK', away:'KAL', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17', timeTbd:true},
  {id:'sl-17-2',t:'SL',md:17,home:'ATR', away:'PNE', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17', timeTbd:true},
  {id:'sl-17-3',t:'SL',md:17,home:'VOL', away:'ARI', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17', timeTbd:true},
  {id:'sl-17-4',t:'SL',md:17,home:'KIF', away:'AST', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17', timeTbd:true},
  {id:'sl-17-5',t:'SL',md:17,home:'LEV', away:'IRA', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17', timeTbd:true},
  {id:'sl-17-6',t:'SL',md:17,home:'OFI', away:'PAO', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17', timeTbd:true},
  {id:'sl-17-7',t:'SL',md:17,home:'PAOK',away:'OLY', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17', timeTbd:true},

  // ── 18η Αγωνιστική ──
  {id:'sl-18-1',t:'SL',md:18,home:'ARI', away:'KIF', kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18', timeTbd:true},
  {id:'sl-18-2',t:'SL',md:18,home:'VOL', away:'OFI', kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18', timeTbd:true},
  {id:'sl-18-3',t:'SL',md:18,home:'KAL', away:'AST', kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18', timeTbd:true},
  {id:'sl-18-4',t:'SL',md:18,home:'OLY', away:'LEV', kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18', timeTbd:true},
  {id:'sl-18-5',t:'SL',md:18,home:'PAO', away:'ATR', kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18', timeTbd:true},
  {id:'sl-18-6',t:'SL',md:18,home:'PNE', away:'AEK', kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18', timeTbd:true},
  {id:'sl-18-7',t:'SL',md:18,home:'IRA', away:'PAOK',kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18', timeTbd:true},

  // ── 19η Αγωνιστική ──
  {id:'sl-19-1',t:'SL',md:19,home:'AST', away:'IRA', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19', timeTbd:true},
  {id:'sl-19-2',t:'SL',md:19,home:'ATR', away:'ARI', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19', timeTbd:true},
  {id:'sl-19-3',t:'SL',md:19,home:'KIF', away:'VOL', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19', timeTbd:true},
  {id:'sl-19-4',t:'SL',md:19,home:'LEV', away:'KAL', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19', timeTbd:true},
  {id:'sl-19-5',t:'SL',md:19,home:'OFI', away:'AEK', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19', timeTbd:true},
  {id:'sl-19-6',t:'SL',md:19,home:'PAO', away:'OLY', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19', timeTbd:true},
  {id:'sl-19-7',t:'SL',md:19,home:'PAOK',away:'PNE', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19', timeTbd:true},

  // ── 20η Αγωνιστική ──
  {id:'sl-20-1',t:'SL',md:20,home:'AEK', away:'KIF', kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20', timeTbd:true},
  {id:'sl-20-2',t:'SL',md:20,home:'ARI', away:'PAO', kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20', timeTbd:true},
  {id:'sl-20-3',t:'SL',md:20,home:'VOL', away:'ATR', kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20', timeTbd:true},
  {id:'sl-20-4',t:'SL',md:20,home:'KAL', away:'PAOK',kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20', timeTbd:true},
  {id:'sl-20-5',t:'SL',md:20,home:'OLY', away:'AST', kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20', timeTbd:true},
  {id:'sl-20-6',t:'SL',md:20,home:'PNE', away:'LEV', kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20', timeTbd:true},
  {id:'sl-20-7',t:'SL',md:20,home:'IRA', away:'OFI', kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20', timeTbd:true},

  // ── 21η Αγωνιστική ──
  {id:'sl-21-1',t:'SL',md:21,home:'AST', away:'PNE', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21', timeTbd:true},
  {id:'sl-21-2',t:'SL',md:21,home:'ATR', away:'IRA', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21', timeTbd:true},
  {id:'sl-21-3',t:'SL',md:21,home:'LEV', away:'KIF', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21', timeTbd:true},
  {id:'sl-21-4',t:'SL',md:21,home:'OLY', away:'VOL', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21', timeTbd:true},
  {id:'sl-21-5',t:'SL',md:21,home:'OFI', away:'ARI', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21', timeTbd:true},
  {id:'sl-21-6',t:'SL',md:21,home:'PAO', away:'KAL', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21', timeTbd:true},
  {id:'sl-21-7',t:'SL',md:21,home:'PAOK',away:'AEK', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21', timeTbd:true},

  // ── 22η Αγωνιστική ──
  {id:'sl-22-1',t:'SL',md:22,home:'AEK', away:'AST', kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22', timeTbd:true},
  {id:'sl-22-2',t:'SL',md:22,home:'ARI', away:'LEV', kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22', timeTbd:true},
  {id:'sl-22-3',t:'SL',md:22,home:'ATR', away:'OFI', kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22', timeTbd:true},
  {id:'sl-22-4',t:'SL',md:22,home:'VOL', away:'KAL', kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22', timeTbd:true},
  {id:'sl-22-5',t:'SL',md:22,home:'KIF', away:'PAOK',kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22', timeTbd:true},
  {id:'sl-22-6',t:'SL',md:22,home:'PNE', away:'PAO', kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22', timeTbd:true},
  {id:'sl-22-7',t:'SL',md:22,home:'IRA', away:'OLY', kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22', timeTbd:true},

  // ── 23η Αγωνιστική ──
  {id:'sl-23-1',t:'SL',md:23,home:'AST', away:'OFI', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23', timeTbd:true},
  {id:'sl-23-2',t:'SL',md:23,home:'KAL', away:'KIF', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23', timeTbd:true},
  {id:'sl-23-3',t:'SL',md:23,home:'LEV', away:'AEK', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23', timeTbd:true},
  {id:'sl-23-4',t:'SL',md:23,home:'OLY', away:'ARI', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23', timeTbd:true},
  {id:'sl-23-5',t:'SL',md:23,home:'PAO', away:'VOL', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23', timeTbd:true},
  {id:'sl-23-6',t:'SL',md:23,home:'PNE', away:'IRA', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23', timeTbd:true},
  {id:'sl-23-7',t:'SL',md:23,home:'PAOK',away:'ATR', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23', timeTbd:true},

  // ── 24η Αγωνιστική ──
  {id:'sl-24-1',t:'SL',md:24,home:'AEK', away:'OLY', kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24', timeTbd:true},
  {id:'sl-24-2',t:'SL',md:24,home:'ARI', away:'AST', kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24', timeTbd:true},
  {id:'sl-24-3',t:'SL',md:24,home:'ATR', away:'LEV', kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24', timeTbd:true},
  {id:'sl-24-4',t:'SL',md:24,home:'VOL', away:'PAOK',kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24', timeTbd:true},
  {id:'sl-24-5',t:'SL',md:24,home:'KIF', away:'PAO', kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24', timeTbd:true},
  {id:'sl-24-6',t:'SL',md:24,home:'OFI', away:'PNE', kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24', timeTbd:true},
  {id:'sl-24-7',t:'SL',md:24,home:'IRA', away:'KAL', kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24', timeTbd:true},

  // ── 25η Αγωνιστική ──
  {id:'sl-25-1',t:'SL',md:25,home:'AST', away:'VOL', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25', timeTbd:true},
  {id:'sl-25-2',t:'SL',md:25,home:'KAL', away:'ATR', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25', timeTbd:true},
  {id:'sl-25-3',t:'SL',md:25,home:'OLY', away:'KIF', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25', timeTbd:true},
  {id:'sl-25-4',t:'SL',md:25,home:'PAO', away:'LEV', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25', timeTbd:true},
  {id:'sl-25-5',t:'SL',md:25,home:'PNE', away:'ARI', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25', timeTbd:true},
  {id:'sl-25-6',t:'SL',md:25,home:'PAOK',away:'OFI', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25', timeTbd:true},
  {id:'sl-25-7',t:'SL',md:25,home:'IRA', away:'AEK', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25', timeTbd:true},

  // ── 26η Αγωνιστική ──
  {id:'sl-26-1',t:'SL',md:26,home:'AEK', away:'PAO', kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26', timeTbd:true},
  {id:'sl-26-2',t:'SL',md:26,home:'ARI', away:'KAL', kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26', timeTbd:true},
  {id:'sl-26-3',t:'SL',md:26,home:'ATR', away:'AST', kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26', timeTbd:true},
  {id:'sl-26-4',t:'SL',md:26,home:'VOL', away:'PNE', kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26', timeTbd:true},
  {id:'sl-26-5',t:'SL',md:26,home:'KIF', away:'IRA', kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26', timeTbd:true},
  {id:'sl-26-6',t:'SL',md:26,home:'LEV', away:'PAOK',kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26', timeTbd:true},
  {id:'sl-26-7',t:'SL',md:26,home:'OFI', away:'OLY', kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26', timeTbd:true},
]

export const UEFA_FIXTURES = [
  // Q2 — completed (times: Greek local → UTC, EEST = UTC+3)
  {id:'uel-paok-1', t:'UEL', greek:'PAOK', home:'DYN', away:'PAOK', kickoff:'2026-07-23T17:00:00Z', round:'Q2 · Leg 1', leg:1, tie:'uel-paok', venue:'Motor Lublin Arena, Πολωνία'},
  {id:'uel-paok-2', t:'UEL', greek:'PAOK', home:'PAOK',away:'DYN',  kickoff:'2026-07-30T17:45:00Z', round:'Q2 · Leg 2', leg:2, tie:'uel-paok', venue:'Toumba, Θεσσαλονίκη'}, // Πέμ 30/7 20:45
  {id:'uecl-pao-1', t:'UECL',greek:'PAO', home:'PKS', away:'PAO',  kickoff:'2026-07-23T18:00:00Z', round:'Q2 · Leg 1', leg:1, tie:'uecl-pao',venue:'Fehérvári úti, Paks'},
  {id:'uecl-pao-2', t:'UECL',greek:'PAO', home:'PAO', away:'PKS',  kickoff:'2026-07-30T18:30:00Z', round:'Q2 · Leg 2', leg:2, tie:'uecl-pao',venue:'ΟΑΚΑ, Αθήνα'}, // Πέμ 30/7 21:30
  // Ολυμπιακός–NEC Q3 (olympiacos.org / UEFA): Τρί 4/8 21:00 · Τρί 11/8 20:30 Ελλ.
  {id:'ucl-oly-1',  t:'UCL', greek:'OLY', home:'OLY', away:'NEC',  kickoff:'2026-08-04T18:00:00Z', round:'Q3 · Leg 1', leg:1, tie:'ucl-oly', venue:'Karaiskakis, Πειραιάς'},
  {id:'ucl-oly-2',  t:'UCL', greek:'OLY', home:'NEC', away:'OLY',  kickoff:'2026-08-11T17:30:00Z', round:'Q3 · Leg 2', leg:2, tie:'ucl-oly', venue:'Goffert, Nijmegen'},
  // Παναθηναϊκός–ΤΣΣΚΑ 1948 Q3 (pao.gr / UEFA): Τετ 5/8 21:30 ΟΑΚΑ · Τρί 11/8 20:30 Ελλ. Σόφια
  {id:'uecl-pao-3', t:'UECL',greek:'PAO', home:'PAO', away:'CSK', kickoff:'2026-08-05T18:30:00Z', round:'Q3 · Leg 1', leg:1, tie:'uecl-pao-q3', venue:'ΟΑΚΑ, Αθήνα'},
  {id:'uecl-pao-4', t:'UECL',greek:'PAO', home:'CSK', away:'PAO', kickoff:'2026-08-11T17:30:00Z', round:'Q3 · Leg 2', leg:2, tie:'uecl-pao-q3', venue:'Vasil Levski, Σόφια'},
  // ΠΑΟΚ–Άντερλεχτ Q3 (UEFA 31/7): Πέμ 6/8 20:45 Τούμπα · Πέμ 13/8 21:30 Βρυξέλλες
  {id:'uel-paok-3', t:'UEL', greek:'PAOK', home:'PAOK',away:'AND', kickoff:'2026-08-06T17:45:00Z', round:'Q3 · Leg 1', leg:1, tie:'uel-paok-q3', venue:'Toumba, Θεσσαλονίκη'},
  {id:'uel-paok-4', t:'UEL', greek:'PAOK', home:'AND', away:'PAOK',kickoff:'2026-08-13T18:30:00Z', round:'Q3 · Leg 2', leg:2, tie:'uel-paok-q3', venue:'Lotto Park, Βρυξέλλες'},
  // ΑΕΚ–Levski Sofia UCL PO (UEFA): Τρί 18/8 22:00 εκτός · Τετ 26/8 22:00 OPAP Arena
  {id:'ucl-aek-1',  t:'UCL', greek:'AEK', home:'LVS', away:'AEK', kickoff:'2026-08-18T19:00:00Z', round:'PO · Leg 1', leg:1, tie:'ucl-aek', venue:'Georgi Asparuhov, Σόφια'},
  {id:'ucl-aek-2',  t:'UCL', greek:'AEK', home:'AEK', away:'LVS', kickoff:'2026-08-26T19:00:00Z', round:'PO · Leg 2', leg:2, tie:'ucl-aek', venue:'OPAP Arena, Αθήνα'},
  // ΟΦΗ–CSKA Sofia UEL PO: Πέμ 20/8 & 27/8 · 20:00 Αθήνα
  {id:'uel-ofi-1',  t:'UEL', greek:'OFI', home:'OFI', away:'CSS', kickoff:'2026-08-20T17:00:00Z', round:'PO · Leg 1', leg:1, tie:'uel-ofi', venue:'Πανκρήτιο, Ηράκλειο'},
  {id:'uel-ofi-2',  t:'UEL', greek:'OFI', home:'CSS', away:'OFI', kickoff:'2026-08-27T17:00:00Z', round:'PO · Leg 2', leg:2, tie:'uel-ofi', venue:'Balgarska Armiya, Σόφια'},
  // ΠΑΟΚ–Brann UECL PO (μετά αποκλεισμό από Anderlecht): Πέμ 20/8 20:45 Τούμπα · Πέμ 27/8 20:00 Bergen
  {id:'uecl-paok-1', t:'UECL', greek:'PAOK', home:'PAOK', away:'BRN', kickoff:'2026-08-20T17:45:00Z', round:'PO · Leg 1', leg:1, tie:'uecl-paok-po', venue:'Toumba, Θεσσαλονίκη'},
  {id:'uecl-paok-2', t:'UECL', greek:'PAOK', home:'BRN', away:'PAOK', kickoff:'2026-08-27T17:00:00Z', round:'PO · Leg 2', leg:2, tie:'uecl-paok-po', venue:'Brann Stadion, Bergen'},
  // ΠΑΟ–Hradec Králové UECL PO: Πέμ 20/8 21:30 ΟΑΚΑ · Πέμ 27/8 20:00 Hradec
  {id:'uecl-pao-5', t:'UECL', greek:'PAO', home:'PAO', away:'HRK', kickoff:'2026-08-20T18:30:00Z', round:'PO · Leg 1', leg:1, tie:'uecl-pao-po', venue:'ΟΑΚΑ, Αθήνα'},
  {id:'uecl-pao-6', t:'UECL', greek:'PAO', home:'HRK', away:'PAO', kickoff:'2026-08-27T17:00:00Z', round:'PO · Leg 2', leg:2, tie:'uecl-pao-po', venue:'Hradec Králové'},
]

export const ALL_FIXTURES = [...SUPER_LEAGUE, ...UEFA_FIXTURES]

/**
 * Manual 1/X/2 odds per fixture id. Missing id → UI shows «Δεν υπάρχουν ακόμα».
 * Updated Aug 2026 from public book consensus (OddsMath / Wincomparator).
 */
export const MATCH_ODDS = {
  // UEFA — played
  'uel-paok-1':  { h: 3.10, d: 3.30, a: 2.10 },
  'uel-paok-2':  { h: 2.00, d: 3.40, a: 3.50 },
  'uecl-pao-1':  { h: 4.20, d: 3.50, a: 1.70 },
  'uecl-pao-2':  { h: 1.60, d: 3.60, a: 5.00 },
  // UEFA — this week
  'ucl-oly-1':   { h: 1.55, d: 4.20, a: 5.70 },   // OLY–NEC · 4/8
  'ucl-oly-2':   { h: 4.80, d: 3.90, a: 1.70 },   // NEC–OLY · 11/8 20:30
  'uecl-pao-3':  { h: 1.40, d: 4.60, a: 9.00 },   // PAO–CSK · 5/8
  'uecl-pao-4':  { h: 5.50, d: 3.80, a: 1.60 },   // CSK–PAO · 11/8 20:30
  'uel-paok-3':  { h: 1.70, d: 3.55, a: 4.40 },   // PAOK–AND · 6/8
  'uel-paok-4':  { h: 3.02, d: 3.52, a: 2.42 },   // AND–PAOK · 13/8 21:30
  // UEFA — play-offs (book consensus Aug 2026; Leg 2 lines TBA)
  'ucl-aek-1':   { h: 2.95, d: 3.20, a: 2.50 },   // LVS–AEK · 18/8 22:00
  'uel-ofi-1':   { h: 1.72, d: 3.40, a: 2.05 },   // OFI–CSS · 20/8 20:00
  'uecl-paok-1': { h: 1.60, d: 4.00, a: 5.30 },   // PAOK–BRN · 20/8 20:45
  'uecl-pao-5':  { h: 1.45, d: 4.50, a: 7.50 },   // PAO–HRK · 20/8 21:30
  // Super League · Αγωνιστική 1 (OddsMath 3/8/2026)
  'sl-1-1':      { h: 1.19, d: 6.15, a: 17.50 },  // AEK–IRA
  'sl-1-2':      { h: 3.92, d: 3.06, a: 2.06 },   // KAL–ARI
  'sl-1-3':      { h: 1.23, d: 5.50, a: 14.00 },  // OLY–ATR
  'sl-1-4':      { h: 2.02, d: 3.26, a: 3.76 },   // OFI–VOL
  'sl-1-5':      { h: 1.25, d: 5.05, a: 14.75 },  // PAO–KIF
  'sl-1-6':      { h: 2.63, d: 3.05, a: 2.75 },   // PNE–AST
  'sl-1-7':      { h: 1.29, d: 4.90, a: 11.50 },  // PAOK–LEV
}

export function getMatchOdds(matchId) {
  const odds = MATCH_ODDS[matchId]
  if (!odds) return null
  const vals = [odds.h, odds.d, odds.a]
  if (!vals.every((v) => typeof v === 'number' && Number.isFinite(v) && v > 1)) return null
  return odds
}

// ─── SCORING ──────────────────────────────────────────────────────────────────
export function matchResult(h, a) { return h > a ? 'H' : h < a ? 'A' : 'D' }

/** Find Leg 1 fixture of the same UEFA tie. */
export function getTieLeg1(fixtures, match) {
  if (!match?.tie) return null
  return (fixtures || []).find((f) => f.tie === match.tie && f.leg === 1) || null
}

/**
 * Qualifier tip lives on Leg 1 only.
 * Assessed against Leg 2 official result.qual.
 */
export function resolveQualTip(predictions, fixtures, match, playerId) {
  const leg1 = match?.leg === 1 ? match : getTieLeg1(fixtures, match)
  if (!leg1) return null
  return predictions?.[leg1.id]?.[playerId]?.qual || null
}

/** Missing / incomplete tip = DQ (never treat as 0–0). */
export function isMissingTip(pred) {
  return !pred || typeof pred.h !== 'number' || typeof pred.a !== 'number'
}

/** True if at least one player filed a scoreline tip for this match. */
export function matchHadAnyTip(predictions, matchId) {
  const tips = predictions?.[matchId] || {}
  return Object.values(tips).some((t) => !isMissingTip(t))
}

function dqScore(actual) {
  return {
    exact: false,
    correct: false,
    qualCorrect: false,
    scorePts: -1,
    qualPts: 0,
    points: -1,
    dq: true,
    provisional: !!actual?.provisional,
  }
}

/**
 * Core scorer.
 * opts.qualTip — tip to compare for πρόκριση (usually from Leg 1)
 * opts.awardQual — false on Leg 1 (never award until Leg 2 settles)
 * opts.allowDq — missing tip → −1 when true
 */
export function scoreMatch(pred, actual, opts = {}) {
  if (actual == null) return null
  if (isMissingTip(pred)) return opts.allowDq ? dqScore(actual) : null
  const exact   = pred.h === actual.h && pred.a === actual.a
  const correct = matchResult(pred.h, pred.a) === matchResult(actual.h, actual.a)
  const awardQual = opts.awardQual !== false && !!actual.qual
  const qualTip = opts.qualTip !== undefined ? opts.qualTip : pred?.qual
  const qualCorrect = !!(awardQual && qualTip && actual.qual && qualTip === actual.qual)
  const scorePts = (exact ? 1 : 0) + (correct ? 1 : 0)
  const qualPts  = qualCorrect ? 1 : 0
  return {
    exact,
    correct,
    qualCorrect,
    scorePts,
    qualPts,
    points: scorePts + qualPts,
    dq: false,
    provisional: !!actual.provisional,
  }
}

/**
 * Full UEFA-aware score for one player on one fixture.
 * Leg 1: scoreline only (πρόκριση tip stored, not scored yet).
 * Leg 2: scoreline from Leg 2 tip + πρόκριση from Leg 1 tip vs result.qual.
 * Missing tip → −1 DQ only if someone else tipped (match counted in the league).
 */
export function scorePlayerMatch(match, pred, actual, predictions, fixtures, playerId) {
  // Postponed fixtures never score and never DQ
  if (match?.postponed) return null
  if (actual == null) return null
  if (isMissingTip(pred)) {
    if (!matchHadAnyTip(predictions, match?.id)) return null
    return dqScore(actual)
  }
  if (match?.leg === 1) {
    return scoreMatch(pred, actual, { awardQual: false })
  }
  if (match?.leg === 2 && actual.qual) {
    const qualTip = resolveQualTip(predictions, fixtures, match, playerId)
    return scoreMatch(pred, actual, { qualTip, awardQual: true })
  }
  return scoreMatch(pred, actual, { awardQual: false })
}

/** Per-match ledger for one player (finished fixtures only). */
export function buildPlayerMatchLedger(fixtures, predictions, results, playerId) {
  const rows = []
  for (const m of fixtures || []) {
    const actual = results?.[m.id]
    if (actual == null) continue
    const pred = predictions?.[m.id]?.[playerId]
    const sc = scorePlayerMatch(m, pred, actual, predictions, fixtures, playerId)
    if (!sc) continue
    const tipQual = resolveQualTip(predictions, fixtures, m, playerId)
    rows.push({
      matchId: m.id,
      label: `${TEAMS[m.home]?.abbr || m.home}–${TEAMS[m.away]?.abbr || m.away}`,
      competition: m.t,
      round: m.round || m.md || '',
      leg: m.leg || null,
      tip: !isMissingTip(pred) ? `${pred.h}–${pred.a}` : 'DQ',
      tipQual: m.leg === 2 ? tipQual : (pred?.qual || tipQual || null),
      actual: `${actual.h}–${actual.a}`,
      actualQual: actual.qual || null,
      exact: sc.exact,
      correct: sc.correct,
      qualCorrect: sc.qualCorrect,
      scorePts: sc.scorePts,
      qualPts: sc.qualPts,
      points: sc.points,
      dq: !!sc.dq,
    })
  }
  return rows
}

/** Turn a live / hint scoreline into an actual for scoreMatch (provisional until official result). */
export function scorelineToActual(scoreline) {
  if (!scoreline || scoreline.h == null || scoreline.a == null) return null
  // Tip scoring is always regulation time. During ET/pens live boards include extra goals —
  // prefer an explicit 90′ snapshot when the feed carries one.
  const useReg = scoreline.regH != null && scoreline.regA != null
  const actual = {
    h: Number(useReg ? scoreline.regH : scoreline.h),
    a: Number(useReg ? scoreline.regA : scoreline.a),
    provisional: true,
  }
  // Never award πρόκριση from live/provisional feeds
  return actual
}

/**
 * Hard locks for finished AET ties: tip scoreline is always 90′, πρόκριση only when set.
 * Prevents ESPN/Gazzetta AET board totals from wiping corrected tip points.
 */
export const TIP_RESULT_LOCKS = {
  // NEC–OLY Leg 2: 90′ 1–1, AET 2–1 NEC. No πρόκριση pts (field went to NEC; tips were OLY).
  'ucl-oly-2': { h: 1, a: 1, overtime: true, otH: 2, otA: 1, qual: null },
  // CSK–PAO Leg 2: 90′ 1–1, AET 1–2 PAO → πρόκριση PAO (+1 all three).
  'uecl-pao-4': { h: 1, a: 1, overtime: true, otH: 1, otA: 2, qual: 'PAO' },
  // Play-off Leg 1 · 20/8/2026 (FT only — πρόκριση scores on Leg 2)
  'uel-ofi-1': { h: 3, a: 0 },
  'uecl-pao-5': { h: 2, a: 2 },
  'uecl-paok-1': { h: 1, a: 1 },
  // Super League MD1 · 22/8/2026
  'sl-1-1': { h: 4, a: 0 }, // AEK–IRA
  'sl-1-2': { h: 2, a: 3 }, // KAL–ARI
  'sl-1-3': { h: 1, a: 0 }, // OLY–ATR
}

/**
 * Seeded tips (fill missing players only — KV / later saves still win per player).
 * Used so late admin tips (e.g. no DQ) show on game cards + scoring.
 */
export const SEEDED_PREDICTIONS = {
  'uel-paok-1': {
    boikos: { h: 2, a: 1, qual: 'DYN' },
    mavromichalis: { h: 0, a: 0, qual: 'PAOK' },
    chousiadas: { h: 2, a: 1, qual: 'DYN' },
  },
  'uecl-pao-1': {
    boikos: { h: 0, a: 3, qual: 'PAO' },
    mavromichalis: { h: 0, a: 1, qual: 'PAO' },
    chousiadas: { h: 1, a: 2, qual: 'PAO' },
  },
  // 20/8 play-off Leg 1 — Chousiadas (admin late tip · no DQ)
  'uel-ofi-1': { chousiadas: { h: 1, a: 1, qual: 'CSS' } },
  'uecl-pao-5': { chousiadas: { h: 1, a: 1, qual: 'PAO' } },
  'uecl-paok-1': { chousiadas: { h: 1, a: 1, qual: 'BRN' } },
  // 23/8 SL MD1 — Chousiadas (admin late tip · no DQ)
  'sl-1-4': { chousiadas: { h: 2, a: 1 } }, // OFI–VOL
  'sl-1-7': { chousiadas: { h: 2, a: 1 } }, // PAOK–LEV
  'sl-1-6': { chousiadas: { h: 1, a: 1 } }, // PNE–AST
}

/**
 * Merge seeds under live tips.
 * Live tips win when they are complete scorelines; incomplete / missing player
 * slots are filled from SEEDED_PREDICTIONS (admin late tips · no false DQ).
 */
export function mergeSeededPredictions(predictions = {}) {
  const out = { ...(predictions || {}) }
  for (const [mid, seeds] of Object.entries(SEEDED_PREDICTIONS)) {
    const live = { ...(out[mid] || {}) }
    for (const [pid, tip] of Object.entries(seeds || {})) {
      if (isMissingTip(live[pid]) && !isMissingTip(tip)) {
        live[pid] = tip
      }
    }
    out[mid] = live
  }
  return out
}

export function applyTipResultLocks(results = {}) {
  const out = { ...(results || {}) }
  let changed = false
  for (const [id, lock] of Object.entries(TIP_RESULT_LOCKS)) {
    const cur = out[id] || {}
    const next = {
      ...cur,
      h: lock.h,
      a: lock.a,
      overtime: !!lock.overtime,
      otH: lock.otH,
      otA: lock.otA,
      qual: lock.qual,
    }
    if (
      cur.h !== next.h ||
      cur.a !== next.a ||
      !!cur.overtime !== next.overtime ||
      (cur.otH ?? null) !== (next.otH ?? null) ||
      (cur.otA ?? null) !== (next.otA ?? null) ||
      (cur.qual || null) !== (next.qual || null)
    ) {
      changed = true
      next.source = cur.source && cur.source !== 'auto' ? cur.source : 'lock'
      next.lockedAt = new Date().toISOString()
      out[id] = next
    } else if (!out[id]) {
      changed = true
      out[id] = { ...next, source: 'lock', lockedAt: new Date().toISOString() }
    } else {
      out[id] = { ...cur, ...next }
    }
  }
  return { results: out, changed }
}

/**
 * Official finals win; otherwise use in-play liveScores, then finished pipeline hints.
 * Used so leaderboard / H2H / cards move with the scoreline before ΤΕΛΙΚΟ is saved.
 */
export function mergeScoringResults(results = {}, liveScores = {}, finishedHints = {}) {
  const out = { ...(results || {}) }
  const fill = (src) => {
    for (const [id, scoreline] of Object.entries(src || {})) {
      if (out[id] != null) continue
      const actual = scorelineToActual(scoreline)
      if (actual) out[id] = actual
    }
  }
  fill(liveScores)
  fill(finishedHints)
  return out
}

export function computeLeaderboard(fixtures, predictions, results) {
  const t = {}
  PLAYERS.forEach(p => { t[p] = { pts:0, exact:0, correct:0, qual:0, dq:0, played:0 } })
  fixtures.forEach(m => {
    const actual = results?.[m.id]
    if (actual == null) return
    PLAYERS.forEach(p => {
      const sc = scorePlayerMatch(m, predictions?.[m.id]?.[p], actual, predictions, fixtures, p)
      if (!sc) return
      t[p].pts    += sc.points
      t[p].played += 1
      if (sc.dq)         t[p].dq++
      if (sc.exact)      t[p].exact++
      if (sc.correct)    t[p].correct++
      if (sc.qualCorrect) t[p].qual++
    })
  })
  return PLAYERS.slice().sort((a, b) => t[b].pts - t[a].pts)
    .map((p, i) => ({ player: p, rank: i+1, ...t[p] }))
}

/** Display clock under live score — never show a fake 0'. */
export function formatLiveClock(live, match, now = Date.now()) {
  if (!live) return ''
  const label = live.label || live.clock
  if (label && label !== "0'" && label !== '0′' && label !== '0') return String(label)
  if (live.phase === 'HT') return 'ΗΜ'
  const m = Number(live.min)
  if (Number.isFinite(m) && m > 0) return `${m}'`
  if (match?.kickoff && !match.timeTbd) {
    const elapsed = Math.floor((now - new Date(match.kickoff).getTime()) / 60000)
    if (elapsed < 0) return 'LIVE'
    if (elapsed < 45) return `${Math.max(1, elapsed)}'`
    if (elapsed < 60) return 'ΗΜ'
    const m2 = Math.min(105, 45 + (elapsed - 60))
    if (m2 > 90) return `90+${m2 - 90}'`
    return `${Math.max(46, m2)}'`
  }
  return 'LIVE'
}

// ─── TIME ─────────────────────────────────────────────────────────────────────
const TZ = 'Europe/Athens'
const timeOpts = { timeZone:TZ, hour:'2-digit', minute:'2-digit', hour12:false }
export const grTime  = iso => new Date(iso).toLocaleTimeString('el-GR', timeOpts)
export const grKick  = m => m?.postponed ? 'ΑΝΑΒΛΗΘΗΚΕ' : m?.timeTbd ? 'Ώρα TBA' : grTime(m.kickoff)
export const grShort = iso => new Date(iso).toLocaleDateString('el-GR',  { timeZone:TZ, day:'numeric', month:'short' })
export const grDate  = iso => new Date(iso).toLocaleDateString('el-GR',  { timeZone:TZ, weekday:'short', day:'numeric', month:'short' })
export const nowGR   = ()  => new Date().toLocaleTimeString('el-GR', timeOpts)
/** Athens calendar date YYYY-MM-DD from ISO (or now) */
export function athensYmd(isoOrDate = new Date()) {
  const d = typeof isoOrDate === 'string' || typeof isoOrDate === 'number'
    ? new Date(isoOrDate)
    : isoOrDate
  return d.toLocaleDateString('en-CA', { timeZone: TZ })
}
/** Athens wall-clock HH:MM from ISO */
export function athensHm(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Convert Athens local date+time → UTC ISO (`…Z`).
 * @param {string} dateYmd YYYY-MM-DD (Athens calendar)
 * @param {string} timeHm HH:MM (Athens)
 */
export function athensLocalToUtcIso(dateYmd, timeHm) {
  const ymd = String(dateYmd || '').trim()
  const hm = String(timeHm || '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) throw new Error('Bad date (use YYYY-MM-DD)')
  if (!/^\d{1,2}:\d{2}$/.test(hm)) throw new Error('Bad time (use HH:MM)')
  const [Y, M, D] = ymd.split('-').map(Number)
  const [hRaw, mRaw] = hm.split(':').map(Number)
  if (hRaw > 23 || mRaw > 59) throw new Error('Bad time')
  const h = hRaw
  const mi = mRaw
  // Initial guess EEST (UTC+3), then correct via Intl Athens wall clock
  let t = Date.UTC(Y, M - 1, D, h, mi) - 3 * 3600 * 1000
  for (let i = 0; i < 6; i++) {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
        .formatToParts(new Date(t))
        .map((p) => [p.type, p.value]),
    )
    const asY = Number(parts.year)
    const asM = Number(parts.month)
    const asD = Number(parts.day)
    const asH = Number(parts.hour)
    const asMin = Number(parts.minute)
    const want = Date.UTC(Y, M - 1, D, h, mi)
    const got = Date.UTC(asY, asM - 1, asD, asH, asMin)
    const diff = want - got
    if (diff === 0) break
    t += diff
  }
  return new Date(t).toISOString().replace(/\.\d{3}Z$/, 'Z')
}

/**
 * Merge KV kickoffOverrides onto fixtures (clears timeTbd when override says so).
 * @param {Array} fixtures
 * @param {Record<string,{kickoff:string,timeTbd?:boolean}>|null} overrides
 */
export function applyKickoffOverrides(fixtures = [], overrides = null) {
  if (!overrides || typeof overrides !== 'object') return fixtures
  return fixtures.map((m) => {
    const o = overrides[m.id]
    if (!o?.kickoff) return m
    return {
      ...m,
      kickoff: o.kickoff,
      timeTbd: o.timeTbd === true,
      // Setting a real kickoff clears postponement
      postponed: o.timeTbd === true ? !!m.postponed : false,
    }
  })
}

export const isToday = iso => {
  const f = d => d.toLocaleDateString('el-GR', { timeZone:TZ })
  return f(new Date()) === f(new Date(iso))
}
/** Predictions lock & all-player reveal: 15 minutes before kickoff */
export const LOCK_BEFORE_MS = 15 * 60 * 1000
export const isLocked = iso => Date.now() >= new Date(iso).getTime() - LOCK_BEFORE_MS
/** True once lock window opens (reveal predictions; no more edits) */
export const isRevealOpen = iso => isLocked(iso)

/** Live score window: kickoff → +200′ (wait for final even if late) */
export const LIVE_AFTER_MIN = 200
/** Warm-up before KO so pipeline/ESPN are ready at séntra */
export const LIVE_WARMUP_MIN = 15

/**
 * Cloudflare KV Worker / live sync window (ΠΡΟΓΡΑΜΜΑ):
 * 30′ before kickoff → 30′ after Full Time.
 */
export const CLOUD_BEFORE_MIN = 30
export const CLOUD_AFTER_FT_MIN = 30
/** Estimated FT when result not known yet (90′ + HT ≈ newspaper convention) */
export const ESTIMATED_FT_AFTER_KO_MIN = 100
/** Hard stop if FT never arrives (AET/pens / stuck feed) */
export const CLOUD_MAX_AFTER_KO_MIN = 180

/** Match is in the live kickoff window (0–200 min after KO) */
export const inLiveWindow = iso => {
  const mins = (Date.now() - new Date(iso).getTime()) / 60000
  return mins >= 0 && mins <= LIVE_AFTER_MIN
}

/** True if fixture should drive live score fetches (15′ warm-up → +200′) */
export function inLiveScoreBand(iso, now = Date.now()) {
  const minsAfter = (now - new Date(iso).getTime()) / 60000
  return minsAfter >= -LIVE_WARMUP_MIN && minsAfter <= LIVE_AFTER_MIN
}

/** Fixture has a real kickoff (not TBA / TBD / postponed) — used by ΠΡΟΓΡΑΜΜΑ gates */
export function isSchedulableFixture(m) {
  if (!m?.kickoff || m.timeTbd || m.postponed) return false
  const home = m.home ?? m.homeTeam
  const away = m.away ?? m.awayTeam
  return home !== 'TBD' && away !== 'TBD'
}

/**
 * Cloudflare ops window for one kickoff:
 * 30′ before KO → 30′ after Full Time.
 * Pass ftAtMs (result.fetchedAt) when FT is known; otherwise keep open until
 * CLOUD_MAX_AFTER_KO_MIN so late/AET finals are still collected.
 */
export function inCloudOpsWindow(iso, now = Date.now(), ftAtMs = null) {
  const ko = new Date(iso).getTime()
  if (!Number.isFinite(ko)) return false
  if (now < ko - CLOUD_BEFORE_MIN * 60000) return false

  if (ftAtMs != null && Number.isFinite(ftAtMs) && ftAtMs >= ko) {
    return now <= ftAtMs + CLOUD_AFTER_FT_MIN * 60000
  }

  return now <= ko + CLOUD_MAX_AFTER_KO_MIN * 60000
}

/** Any ΠΡΟΓΡΑΜΜΑ fixture in the Cloudflare 30′→FT+30′ window */
export function anyCloudOpsActivity(fixtures = ALL_FIXTURES, now = Date.now(), ftById = null) {
  return fixtures.some((m) => {
    if (!isSchedulableFixture(m)) return false
    const ftAt = ftById?.[m.id] ?? null
    return inCloudOpsWindow(m.kickoff, now, ftAt)
  })
}

/**
 * True when Athens day has at least one real ΠΡΟΓΡΑΜΜΑ fixture.
 * @deprecated Prefer anyCloudOpsActivity for Cloudflare gating.
 */
export function isProgramGameDay(fixtures = ALL_FIXTURES, now = Date.now()) {
  const ymd = athensYmd(now)
  return fixtures.some(m => isSchedulableFixture(m) && athensYmd(m.kickoff) === ymd)
}

/** Any fixture currently needing live scores / results polling */
export function anyLiveScoreActivity(fixtures = ALL_FIXTURES, now = Date.now()) {
  return fixtures.some(m => isSchedulableFixture(m) && inLiveScoreBand(m.kickoff, now))
}

/**
 * Ms until the next live-score band opens (warm-up).
 * null if nothing upcoming; 0 if already active.
 */
export function msUntilNextLiveScoreBand(fixtures = ALL_FIXTURES, now = Date.now()) {
  if (anyLiveScoreActivity(fixtures, now)) return 0
  let best = null
  for (const m of fixtures) {
    if (!isSchedulableFixture(m)) continue
    const start = new Date(m.kickoff).getTime() - LIVE_WARMUP_MIN * 60000
    const delta = start - now
    if (delta > 0 && (best == null || delta < best)) best = delta
  }
  return best
}
