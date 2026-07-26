// Inline SVG badges — zero external dependencies, always load
// Real club colors, shield shape, team abbreviation

function shield(abbr, bg, text='#fff', stroke='rgba(255,255,255,.3)', accent=null) {
  const a = accent || bg
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 72">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${a}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <path d="M32 2 L60 14 L60 38 Q60 58 32 70 Q4 58 4 38 L4 14 Z" fill="url(#g)" stroke="${stroke}" stroke-width="1.5"/>
  <text x="32" y="44" text-anchor="middle" font-family="'Arial Black',Arial,sans-serif" font-size="${abbr.length>3?13:abbr.length===3?15:18}" font-weight="900" fill="${text}" letter-spacing="-0.5">${abbr}</text>
</svg>`)}`
}

// Each team: real primary/secondary colors
export const LOGOS = {
  // Greek Super League
  OLY:  shield('OLY',  '#CC0000', '#ffffff', '#ff4444', '#ff2222'),  // Olympiacos — red
  AEK:  shield('AEK',  '#1a1a1a', '#FFD700', '#FFD70066', '#333'),   // AEK — black/gold
  PAOK: shield('PAOK', '#1a1a1a', '#ffffff', '#ffffff44', '#2a2a2a'),// PAOK — black/white
  PAO:  shield('PAO',  '#007B3A', '#ffffff', '#00aa5566', '#009944'),// PAO — green
  ARI:  shield('ARI',  '#FFD700', '#1a1a1a', '#FFD70066', '#e6c200'),// Aris — yellow/black
  ATR:  shield('ATR',  '#003399', '#ffffff', '#4466cc66', '#0044aa'),// Atromitos — blue
  AST:  shield('AST',  '#FF8C00', '#ffffff', '#FF8C0066', '#e67e00'),// Asteras — orange
  KIF:  shield('KIF',  '#00529B', '#ffffff', '#336ecc66', '#003d73'),// Kifisia — blue
  LEV:  shield('LEV',  '#006633', '#ffffff', '#009944', '#004d26'),   // Levadiakos — green
  OFI:  shield('OFI',  '#8B0000', '#ffffff', '#cc000066', '#660000'),// OFI — dark red
  PNE:  shield('PNE',  '#660099', '#ffffff', '#9900cc66', '#4d0073'),// Panetolikos — purple
  VOL:  shield('VOL',  '#003366', '#ffffff', '#0055aa66', '#002244'),// Volos — navy
  IRA:  shield('IRA',  '#0000CC', '#ffffff', '#3333ff66', '#0000aa'),// Iraklis — blue
  KAL:  shield('KAL',  '#990000', '#ffffff', '#cc222266', '#660000'),// Kalamata — red
  // European opponents
  DYN:  shield('DYN',  '#003F87', '#ffffff', '#3366cc66', '#002d63'),// Dynamo Kyiv — blue
  NEC:  shield('NEC',  '#CC0000', '#000000', '#ff222266', '#990000'),// NEC Nijmegen — red/black
  PKS:  shield('PKS',  '#006400', '#ffffff', '#009900', '#004d00'),   // Paksi — green
  TBD:  shield('TBD',  '#333333', '#888888', '#44444466', '#222'),
}

export const TEAM_COLORS = {
  OLY:'#CC0000', AEK:'#FFD700', PAOK:'#ffffff', PAO:'#007B3A',
  ARI:'#FFD700', ATR:'#003399', AST:'#FF8C00', KIF:'#00529B',
  LEV:'#006633', OFI:'#8B0000', PNE:'#660099', VOL:'#003366',
  IRA:'#0000CC', KAL:'#990000', DYN:'#003F87', NEC:'#CC0000',
  PKS:'#006400', TBD:'#444',
}
