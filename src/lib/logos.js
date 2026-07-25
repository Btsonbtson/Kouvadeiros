// All logos served via our Cloudflare Worker proxy (/logo/:team)
// This bypasses CDN hotlink protection — Worker fetches & caches server-side
const W = 'https://kouvadeiros-api.jboikos.workers.dev'

export const LOGOS = {
  OLY:  `${W}/logo/OLY`,
  AEK:  `${W}/logo/AEK`,
  PAOK: `${W}/logo/PAOK`,
  PAO:  `${W}/logo/PAO`,
  ARI:  `${W}/logo/ARI`,
  ATR:  `${W}/logo/ATR`,
  AST:  `${W}/logo/AST`,
  KIF:  `${W}/logo/KIF`,
  LEV:  `${W}/logo/LEV`,
  OFI:  `${W}/logo/OFI`,
  PNE:  `${W}/logo/PNE`,
  VOL:  `${W}/logo/VOL`,
  IRA:  `${W}/logo/IRA`,
  KAL:  `${W}/logo/KAL`,
  DYN:  `${W}/logo/DYN`,
  NEC:  `${W}/logo/NEC`,
  PKS:  `${W}/logo/PKS`,
}

export const TEAM_COLORS = {
  PAO:'#1a7c2a', KIF:'#1a3c6a', KAL:'#8b0000', ARI:'#b8960c',
  OLY:'#cc1e1e', ATR:'#1a3a6a', PAOK:'#303030', LEV:'#1a4a2a',
  PNE:'#5a1a6a', AST:'#b87c0c', AEK:'#c49a0c', IRA:'#1a2a7c',
  OFI:'#6a2c1a', VOL:'#1a5a2a', DYN:'#003594', NEC:'#cc0000',
  PKS:'#006400', TBD:'#444',
}
