// Team logos — real crests from /logos copied into public/logos/ (Vite static)
export const LOGOS = {
  OLY: '/logos/OLY.svg',
  AEK: '/logos/AEK.svg',
  PAOK: '/logos/PAOK.svg',
  PAO: '/logos/PAO.svg',
  ARI: '/logos/ARI.svg',
  ATR: '/logos/ATR.svg',
  AST: '/logos/AST.svg',
  KIF: '/logos/KIF.svg',
  LEV: '/logos/LEV.svg',
  OFI: '/logos/OFI.svg',
  PNE: '/logos/PNE.svg',
  VOL: '/logos/VOL.svg',
  KAL: '/logos/KAL.svg',
  IRA: '/logos/IRA.svg',
  DYN: '/logos/DYN.svg',
  NEC: '/logos/NEC.svg',
  PKS: '/logos/PKS.svg',
  AND: '/logos/AND.svg',
  CSK: '/logos/CSK.svg',
  LVS: null,
  CSS: null,
  BRN: null,
  HRK: null,
  TBD: null,
}

export const TEAM_COLORS = {
  OLY:'#CC0000', AEK:'#1a1a1a', PAOK:'#1a1a1a', PAO:'#006B2B',
  ARI:'#DAA520', ATR:'#003087', AST:'#FF6600', KIF:'#003F8A',
  LEV:'#006633', OFI:'#8B0000', PNE:'#6600AA', VOL:'#003366',
  IRA:'#0000CC', KAL:'#1a1a1a', DYN:'#003F87', NEC:'#CC0000',
  PKS:'#006400', AND:'#6c3', CSK:'#c41e1e', LVS:'#0033a0',
  CSS:'#c41e1e', BRN:'#c4122e', HRK:'#000000', TBD:'#444',
}

/** Resolve logo URL with svg→png fallback for resilience */
export function logoUrl(k) {
  if (!k || k === 'TBD') return null
  if (LOGOS[k]) return LOGOS[k]
  return `/logos/${k}.svg`
}
