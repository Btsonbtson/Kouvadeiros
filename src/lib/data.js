// SL fixtures v2 — official slgr.gr schedule
// ─── FIXTURES ─────────────────────────────────────────────────────────────────
export const PLAYERS = ['boikos','mavromichalis','chousiadas']
export const PLAYER_NAMES = { boikos:'Boikos', mavromichalis:'Mavromichalis', chousiadas:'Chousiadas' }
export const PCOL = { boikos:'#ff2244', mavromichalis:'#4d9fff', chousiadas:'#ff6b35' }

export const TEAMS = {
  PAO: {name:'Παναθηναϊκός',abbr:'PAOK',color:'#1a7c2a'},
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
  // ── 1η Αγωνιστική ──
  {id:'sl-1-1',t:'SL',md:1,home:'AEK', away:'IRA', kickoff:'2026-08-22T17:00:00Z',round:'Αγωνιστική 1'},
  {id:'sl-1-2',t:'SL',md:1,home:'KAL', away:'ARI', kickoff:'2026-08-22T17:00:00Z',round:'Αγωνιστική 1'},
  {id:'sl-1-3',t:'SL',md:1,home:'OLY', away:'ATR', kickoff:'2026-08-22T17:00:00Z',round:'Αγωνιστική 1'},
  {id:'sl-1-4',t:'SL',md:1,home:'OFI', away:'VOL', kickoff:'2026-08-22T17:00:00Z',round:'Αγωνιστική 1'},
  {id:'sl-1-5',t:'SL',md:1,home:'PAO', away:'KIF', kickoff:'2026-08-22T17:00:00Z',round:'Αγωνιστική 1'},
  {id:'sl-1-6',t:'SL',md:1,home:'PNE', away:'AST', kickoff:'2026-08-22T17:00:00Z',round:'Αγωνιστική 1'},
  {id:'sl-1-7',t:'SL',md:1,home:'PAOK',away:'LEV', kickoff:'2026-08-22T17:00:00Z',round:'Αγωνιστική 1'},

  // ── 2η Αγωνιστική ──
  {id:'sl-2-1',t:'SL',md:2,home:'AST', away:'OLY', kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2'},
  {id:'sl-2-2',t:'SL',md:2,home:'ARI', away:'OFI', kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2'},
  {id:'sl-2-3',t:'SL',md:2,home:'ATR', away:'PAOK',kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2'},
  {id:'sl-2-4',t:'SL',md:2,home:'VOL', away:'IRA', kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2'},
  {id:'sl-2-5',t:'SL',md:2,home:'KIF', away:'AEK', kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2'},
  {id:'sl-2-6',t:'SL',md:2,home:'LEV', away:'PAO', kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2'},
  {id:'sl-2-7',t:'SL',md:2,home:'PNE', away:'KAL', kickoff:'2026-08-29T17:00:00Z',round:'Αγωνιστική 2'},

  // ── 3η Αγωνιστική ──
  {id:'sl-3-1',t:'SL',md:3,home:'AEK', away:'ARI', kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3'},
  {id:'sl-3-2',t:'SL',md:3,home:'ATR', away:'KAL', kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3'},
  {id:'sl-3-3',t:'SL',md:3,home:'VOL', away:'OLY', kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3'},
  {id:'sl-3-4',t:'SL',md:3,home:'LEV', away:'PNE', kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3'},
  {id:'sl-3-5',t:'SL',md:3,home:'OFI', away:'KIF', kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3'},
  {id:'sl-3-6',t:'SL',md:3,home:'PAO', away:'PAOK',kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3'},
  {id:'sl-3-7',t:'SL',md:3,home:'IRA', away:'AST', kickoff:'2026-09-05T17:00:00Z',round:'Αγωνιστική 3'},

  // ── 4η Αγωνιστική ──
  {id:'sl-4-1',t:'SL',md:4,home:'AST', away:'AEK', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4'},
  {id:'sl-4-2',t:'SL',md:4,home:'KAL', away:'VOL', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4'},
  {id:'sl-4-3',t:'SL',md:4,home:'KIF', away:'LEV', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4'},
  {id:'sl-4-4',t:'SL',md:4,home:'OLY', away:'OFI', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4'},
  {id:'sl-4-5',t:'SL',md:4,home:'PAO', away:'PNE', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4'},
  {id:'sl-4-6',t:'SL',md:4,home:'PAOK',away:'ARI', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4'},
  {id:'sl-4-7',t:'SL',md:4,home:'IRA', away:'ATR', kickoff:'2026-09-12T17:00:00Z',round:'Αγωνιστική 4'},

  // ── 5η Αγωνιστική ──
  {id:'sl-5-1',t:'SL',md:5,home:'ARI', away:'IRA', kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5'},
  {id:'sl-5-2',t:'SL',md:5,home:'ATR', away:'KIF', kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5'},
  {id:'sl-5-3',t:'SL',md:5,home:'VOL', away:'AEK', kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5'},
  {id:'sl-5-4',t:'SL',md:5,home:'KAL', away:'PAO', kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5'},
  {id:'sl-5-5',t:'SL',md:5,home:'LEV', away:'OLY', kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5'},
  {id:'sl-5-6',t:'SL',md:5,home:'OFI', away:'AST', kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5'},
  {id:'sl-5-7',t:'SL',md:5,home:'PNE', away:'PAOK',kickoff:'2026-09-19T17:00:00Z',round:'Αγωνιστική 5'},

  // ── 6η Αγωνιστική ──
  {id:'sl-6-1',t:'SL',md:6,home:'AEK', away:'OFI', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6'},
  {id:'sl-6-2',t:'SL',md:6,home:'AST', away:'ATR', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6'},
  {id:'sl-6-3',t:'SL',md:6,home:'ARI', away:'VOL', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6'},
  {id:'sl-6-4',t:'SL',md:6,home:'KIF', away:'PNE', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6'},
  {id:'sl-6-5',t:'SL',md:6,home:'OLY', away:'PAO', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6'},
  {id:'sl-6-6',t:'SL',md:6,home:'PAOK',away:'KAL', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6'},
  {id:'sl-6-7',t:'SL',md:6,home:'IRA', away:'LEV', kickoff:'2026-10-10T17:00:00Z',round:'Αγωνιστική 6'},

  // ── 7η Αγωνιστική ──
  {id:'sl-7-1',t:'SL',md:7,home:'ATR', away:'AEK', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7'},
  {id:'sl-7-2',t:'SL',md:7,home:'KAL', away:'OFI', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7'},
  {id:'sl-7-3',t:'SL',md:7,home:'KIF', away:'ARI', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7'},
  {id:'sl-7-4',t:'SL',md:7,home:'LEV', away:'VOL', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7'},
  {id:'sl-7-5',t:'SL',md:7,home:'PAO', away:'AST', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7'},
  {id:'sl-7-6',t:'SL',md:7,home:'PNE', away:'OLY', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7'},
  {id:'sl-7-7',t:'SL',md:7,home:'PAOK',away:'IRA', kickoff:'2026-10-17T17:00:00Z',round:'Αγωνιστική 7'},

  // ── 8η Αγωνιστική ──
  {id:'sl-8-1',t:'SL',md:8,home:'AEK', away:'PNE', kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8'},
  {id:'sl-8-2',t:'SL',md:8,home:'AST', away:'LEV', kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8'},
  {id:'sl-8-3',t:'SL',md:8,home:'ARI', away:'ATR', kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8'},
  {id:'sl-8-4',t:'SL',md:8,home:'VOL', away:'PAO', kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8'},
  {id:'sl-8-5',t:'SL',md:8,home:'OLY', away:'KAL', kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8'},
  {id:'sl-8-6',t:'SL',md:8,home:'OFI', away:'PAOK',kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8'},
  {id:'sl-8-7',t:'SL',md:8,home:'IRA', away:'KIF', kickoff:'2026-10-24T17:00:00Z',round:'Αγωνιστική 8'},

  // ── 9η Αγωνιστική ──
  {id:'sl-9-1',t:'SL',md:9,home:'ATR', away:'VOL', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9'},
  {id:'sl-9-2',t:'SL',md:9,home:'KAL', away:'IRA', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9'},
  {id:'sl-9-3',t:'SL',md:9,home:'KIF', away:'OLY', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9'},
  {id:'sl-9-4',t:'SL',md:9,home:'LEV', away:'ARI', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9'},
  {id:'sl-9-5',t:'SL',md:9,home:'PAO', away:'AEK', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9'},
  {id:'sl-9-6',t:'SL',md:9,home:'PNE', away:'OFI', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9'},
  {id:'sl-9-7',t:'SL',md:9,home:'PAOK',away:'AST', kickoff:'2026-10-31T17:00:00Z',round:'Αγωνιστική 9'},

  // ── 10η Αγωνιστική ──
  {id:'sl-10-1',t:'SL',md:10,home:'AEK', away:'LEV', kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10'},
  {id:'sl-10-2',t:'SL',md:10,home:'AST', away:'KAL', kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10'},
  {id:'sl-10-3',t:'SL',md:10,home:'ARI', away:'PNE', kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10'},
  {id:'sl-10-4',t:'SL',md:10,home:'VOL', away:'KIF', kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10'},
  {id:'sl-10-5',t:'SL',md:10,home:'OLY', away:'PAOK',kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10'},
  {id:'sl-10-6',t:'SL',md:10,home:'OFI', away:'ATR', kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10'},
  {id:'sl-10-7',t:'SL',md:10,home:'IRA', away:'PAO', kickoff:'2026-11-07T17:00:00Z',round:'Αγωνιστική 10'},

  // ── 11η Αγωνιστική ──
  {id:'sl-11-1',t:'SL',md:11,home:'AST', away:'ARI', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11'},
  {id:'sl-11-2',t:'SL',md:11,home:'KAL', away:'AEK', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11'},
  {id:'sl-11-3',t:'SL',md:11,home:'LEV', away:'ATR', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11'},
  {id:'sl-11-4',t:'SL',md:11,home:'OLY', away:'IRA', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11'},
  {id:'sl-11-5',t:'SL',md:11,home:'PAO', away:'OFI', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11'},
  {id:'sl-11-6',t:'SL',md:11,home:'PNE', away:'VOL', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11'},
  {id:'sl-11-7',t:'SL',md:11,home:'PAOK',away:'KIF', kickoff:'2026-11-21T17:00:00Z',round:'Αγωνιστική 11'},

  // ── 12η Αγωνιστική ──
  {id:'sl-12-1',t:'SL',md:12,home:'AEK', away:'PAOK',kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12'},
  {id:'sl-12-2',t:'SL',md:12,home:'ARI', away:'OLY', kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12'},
  {id:'sl-12-3',t:'SL',md:12,home:'ATR', away:'PAO', kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12'},
  {id:'sl-12-4',t:'SL',md:12,home:'VOL', away:'AST', kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12'},
  {id:'sl-12-5',t:'SL',md:12,home:'KIF', away:'KAL', kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12'},
  {id:'sl-12-6',t:'SL',md:12,home:'OFI', away:'LEV', kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12'},
  {id:'sl-12-7',t:'SL',md:12,home:'IRA', away:'PNE', kickoff:'2026-11-28T17:00:00Z',round:'Αγωνιστική 12'},

  // ── 13η Αγωνιστική ──
  {id:'sl-13-1',t:'SL',md:13,home:'AST', away:'KIF', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13'},
  {id:'sl-13-2',t:'SL',md:13,home:'KAL', away:'LEV', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13'},
  {id:'sl-13-3',t:'SL',md:13,home:'OLY', away:'AEK', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13'},
  {id:'sl-13-4',t:'SL',md:13,home:'OFI', away:'IRA', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13'},
  {id:'sl-13-5',t:'SL',md:13,home:'PAO', away:'ARI', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13'},
  {id:'sl-13-6',t:'SL',md:13,home:'PNE', away:'ATR', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13'},
  {id:'sl-13-7',t:'SL',md:13,home:'PAOK',away:'VOL', kickoff:'2026-12-05T17:00:00Z',round:'Αγωνιστική 13'},

  // ── 14η Αγωνιστική ──
  {id:'sl-14-1',t:'SL',md:14,home:'AEK', away:'VOL', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14'},
  {id:'sl-14-2',t:'SL',md:14,home:'ATR', away:'OLY', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14'},
  {id:'sl-14-3',t:'SL',md:14,home:'KAL', away:'PNE', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14'},
  {id:'sl-14-4',t:'SL',md:14,home:'KIF', away:'OFI', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14'},
  {id:'sl-14-5',t:'SL',md:14,home:'LEV', away:'AST', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14'},
  {id:'sl-14-6',t:'SL',md:14,home:'PAOK',away:'PAO', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14'},
  {id:'sl-14-7',t:'SL',md:14,home:'IRA', away:'ARI', kickoff:'2026-12-12T17:00:00Z',round:'Αγωνιστική 14'},

  // ── 15η Αγωνιστική ──
  {id:'sl-15-1',t:'SL',md:15,home:'AST', away:'PAOK',kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15'},
  {id:'sl-15-2',t:'SL',md:15,home:'ARI', away:'AEK', kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15'},
  {id:'sl-15-3',t:'SL',md:15,home:'VOL', away:'LEV', kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15'},
  {id:'sl-15-4',t:'SL',md:15,home:'KIF', away:'ATR', kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15'},
  {id:'sl-15-5',t:'SL',md:15,home:'OLY', away:'PNE', kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15'},
  {id:'sl-15-6',t:'SL',md:15,home:'OFI', away:'KAL', kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15'},
  {id:'sl-15-7',t:'SL',md:15,home:'PAO', away:'IRA', kickoff:'2026-12-19T17:00:00Z',round:'Αγωνιστική 15'},

  // ── 16η Αγωνιστική ──
  {id:'sl-16-1',t:'SL',md:16,home:'AEK', away:'ATR', kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16'},
  {id:'sl-16-2',t:'SL',md:16,home:'AST', away:'PAO', kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16'},
  {id:'sl-16-3',t:'SL',md:16,home:'ARI', away:'PAOK',kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16'},
  {id:'sl-16-4',t:'SL',md:16,home:'KAL', away:'OLY', kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16'},
  {id:'sl-16-5',t:'SL',md:16,home:'LEV', away:'OFI', kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16'},
  {id:'sl-16-6',t:'SL',md:16,home:'PNE', away:'KIF', kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16'},
  {id:'sl-16-7',t:'SL',md:16,home:'IRA', away:'VOL', kickoff:'2027-01-09T17:00:00Z',round:'Αγωνιστική 16'},

  // ── 17η Αγωνιστική ──
  {id:'sl-17-1',t:'SL',md:17,home:'AEK', away:'KAL', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17'},
  {id:'sl-17-2',t:'SL',md:17,home:'ATR', away:'PNE', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17'},
  {id:'sl-17-3',t:'SL',md:17,home:'VOL', away:'ARI', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17'},
  {id:'sl-17-4',t:'SL',md:17,home:'KIF', away:'AST', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17'},
  {id:'sl-17-5',t:'SL',md:17,home:'LEV', away:'IRA', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17'},
  {id:'sl-17-6',t:'SL',md:17,home:'OFI', away:'PAO', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17'},
  {id:'sl-17-7',t:'SL',md:17,home:'PAOK',away:'OLY', kickoff:'2027-01-16T17:00:00Z',round:'Αγωνιστική 17'},

  // ── 18η Αγωνιστική ──
  {id:'sl-18-1',t:'SL',md:18,home:'ARI', away:'KIF', kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18'},
  {id:'sl-18-2',t:'SL',md:18,home:'VOL', away:'OFI', kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18'},
  {id:'sl-18-3',t:'SL',md:18,home:'KAL', away:'AST', kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18'},
  {id:'sl-18-4',t:'SL',md:18,home:'OLY', away:'LEV', kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18'},
  {id:'sl-18-5',t:'SL',md:18,home:'PAO', away:'ATR', kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18'},
  {id:'sl-18-6',t:'SL',md:18,home:'PNE', away:'AEK', kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18'},
  {id:'sl-18-7',t:'SL',md:18,home:'IRA', away:'PAOK',kickoff:'2027-01-23T17:00:00Z',round:'Αγωνιστική 18'},

  // ── 19η Αγωνιστική ──
  {id:'sl-19-1',t:'SL',md:19,home:'AST', away:'IRA', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19'},
  {id:'sl-19-2',t:'SL',md:19,home:'ATR', away:'ARI', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19'},
  {id:'sl-19-3',t:'SL',md:19,home:'KIF', away:'VOL', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19'},
  {id:'sl-19-4',t:'SL',md:19,home:'LEV', away:'KAL', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19'},
  {id:'sl-19-5',t:'SL',md:19,home:'OFI', away:'AEK', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19'},
  {id:'sl-19-6',t:'SL',md:19,home:'PAO', away:'OLY', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19'},
  {id:'sl-19-7',t:'SL',md:19,home:'PAOK',away:'PNE', kickoff:'2027-01-30T17:00:00Z',round:'Αγωνιστική 19'},

  // ── 20η Αγωνιστική ──
  {id:'sl-20-1',t:'SL',md:20,home:'AEK', away:'KIF', kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20'},
  {id:'sl-20-2',t:'SL',md:20,home:'ARI', away:'PAO', kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20'},
  {id:'sl-20-3',t:'SL',md:20,home:'VOL', away:'ATR', kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20'},
  {id:'sl-20-4',t:'SL',md:20,home:'KAL', away:'PAOK',kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20'},
  {id:'sl-20-5',t:'SL',md:20,home:'OLY', away:'AST', kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20'},
  {id:'sl-20-6',t:'SL',md:20,home:'PNE', away:'LEV', kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20'},
  {id:'sl-20-7',t:'SL',md:20,home:'IRA', away:'OFI', kickoff:'2027-02-06T17:00:00Z',round:'Αγωνιστική 20'},

  // ── 21η Αγωνιστική ──
  {id:'sl-21-1',t:'SL',md:21,home:'AST', away:'PNE', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21'},
  {id:'sl-21-2',t:'SL',md:21,home:'ATR', away:'IRA', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21'},
  {id:'sl-21-3',t:'SL',md:21,home:'LEV', away:'KIF', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21'},
  {id:'sl-21-4',t:'SL',md:21,home:'OLY', away:'VOL', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21'},
  {id:'sl-21-5',t:'SL',md:21,home:'OFI', away:'ARI', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21'},
  {id:'sl-21-6',t:'SL',md:21,home:'PAO', away:'KAL', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21'},
  {id:'sl-21-7',t:'SL',md:21,home:'PAOK',away:'AEK', kickoff:'2027-02-13T17:00:00Z',round:'Αγωνιστική 21'},

  // ── 22η Αγωνιστική ──
  {id:'sl-22-1',t:'SL',md:22,home:'AEK', away:'AST', kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22'},
  {id:'sl-22-2',t:'SL',md:22,home:'ARI', away:'LEV', kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22'},
  {id:'sl-22-3',t:'SL',md:22,home:'ATR', away:'OFI', kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22'},
  {id:'sl-22-4',t:'SL',md:22,home:'VOL', away:'KAL', kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22'},
  {id:'sl-22-5',t:'SL',md:22,home:'KIF', away:'PAOK',kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22'},
  {id:'sl-22-6',t:'SL',md:22,home:'PNE', away:'PAO', kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22'},
  {id:'sl-22-7',t:'SL',md:22,home:'IRA', away:'OLY', kickoff:'2027-02-20T17:00:00Z',round:'Αγωνιστική 22'},

  // ── 23η Αγωνιστική ──
  {id:'sl-23-1',t:'SL',md:23,home:'AST', away:'OFI', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23'},
  {id:'sl-23-2',t:'SL',md:23,home:'KAL', away:'KIF', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23'},
  {id:'sl-23-3',t:'SL',md:23,home:'LEV', away:'AEK', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23'},
  {id:'sl-23-4',t:'SL',md:23,home:'OLY', away:'ARI', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23'},
  {id:'sl-23-5',t:'SL',md:23,home:'PAO', away:'VOL', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23'},
  {id:'sl-23-6',t:'SL',md:23,home:'PNE', away:'IRA', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23'},
  {id:'sl-23-7',t:'SL',md:23,home:'PAOK',away:'ATR', kickoff:'2027-02-27T17:00:00Z',round:'Αγωνιστική 23'},

  // ── 24η Αγωνιστική ──
  {id:'sl-24-1',t:'SL',md:24,home:'AEK', away:'OLY', kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24'},
  {id:'sl-24-2',t:'SL',md:24,home:'ARI', away:'AST', kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24'},
  {id:'sl-24-3',t:'SL',md:24,home:'ATR', away:'LEV', kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24'},
  {id:'sl-24-4',t:'SL',md:24,home:'VOL', away:'PAOK',kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24'},
  {id:'sl-24-5',t:'SL',md:24,home:'KIF', away:'PAO', kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24'},
  {id:'sl-24-6',t:'SL',md:24,home:'OFI', away:'PNE', kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24'},
  {id:'sl-24-7',t:'SL',md:24,home:'IRA', away:'KAL', kickoff:'2027-03-06T17:00:00Z',round:'Αγωνιστική 24'},

  // ── 25η Αγωνιστική ──
  {id:'sl-25-1',t:'SL',md:25,home:'AST', away:'VOL', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25'},
  {id:'sl-25-2',t:'SL',md:25,home:'KAL', away:'ATR', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25'},
  {id:'sl-25-3',t:'SL',md:25,home:'OLY', away:'KIF', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25'},
  {id:'sl-25-4',t:'SL',md:25,home:'PAO', away:'LEV', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25'},
  {id:'sl-25-5',t:'SL',md:25,home:'PNE', away:'ARI', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25'},
  {id:'sl-25-6',t:'SL',md:25,home:'PAOK',away:'OFI', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25'},
  {id:'sl-25-7',t:'SL',md:25,home:'IRA', away:'AEK', kickoff:'2027-03-13T17:00:00Z',round:'Αγωνιστική 25'},

  // ── 26η Αγωνιστική ──
  {id:'sl-26-1',t:'SL',md:26,home:'AEK', away:'PAO', kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26'},
  {id:'sl-26-2',t:'SL',md:26,home:'ARI', away:'KAL', kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26'},
  {id:'sl-26-3',t:'SL',md:26,home:'ATR', away:'AST', kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26'},
  {id:'sl-26-4',t:'SL',md:26,home:'VOL', away:'PNE', kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26'},
  {id:'sl-26-5',t:'SL',md:26,home:'KIF', away:'IRA', kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26'},
  {id:'sl-26-6',t:'SL',md:26,home:'LEV', away:'PAOK',kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26'},
  {id:'sl-26-7',t:'SL',md:26,home:'OFI', away:'OLY', kickoff:'2027-03-20T17:00:00Z',round:'Αγωνιστική 26'},
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
export const isLocked = iso => Date.now() >= new Date(iso).getTime() - 60000
