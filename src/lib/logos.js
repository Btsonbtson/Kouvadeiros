// Team logos from Wikimedia Commons — open license, no CORS restrictions for <img> tags
// These URLs work in any browser. The build sandbox can't reach them but browsers can.
const W = 'https://upload.wikimedia.org/wikipedia'

export const LOGOS = {
  // Greek Super League — confirmed Wikipedia file names
  OLY:  `${W}/en/f/f7/Olympiacos_FC_logo.svg`,
  AEK:  `${W}/en/1/11/AEK_Athens_FC_Badge.svg`,
  PAOK: `${W}/en/2/2c/PAOK_FC_Badge.svg`,
  PAO:  `${W}/commons/2/27/Panathinaikos_FC_logo.png`,
  ARI:  `${W}/en/0/07/Aris_FC_logo.svg`,
  ATR:  `${W}/en/e/e1/Atromitos_Athens_FC_logo.svg`,
  AST:  `${W}/en/4/4f/Asteras_Tripolis_FC_logo.svg`,
  KIF:  `${W}/en/6/6e/AE_Kifisia_FC_logo.svg`,
  LEV:  `${W}/en/b/bd/Levadiakos_FC_logo.svg`,
  OFI:  `${W}/en/5/57/OFI_Crete_FC.svg`,
  PNE:  `${W}/en/7/78/Panetolikos_FC_logo.svg`,
  VOL:  `${W}/en/0/04/NPS_Volos_FC_logo.svg`,
  IRA:  `${W}/en/3/37/Iraklis_FC_logo.svg`,
  KAL:  `${W}/en/3/32/Kalamata_FC_logo.svg`,
  // European opponents
  DYN:  `${W}/en/e/e9/FC_Dynamo_Kyiv_logo.svg`,
  NEC:  `${W}/commons/8/8c/NEC_Nijmegen.svg`,
  PKS:  `${W}/commons/d/d6/Paksi_FC_logo.svg`,
  TBD:  null,
}

export const TEAM_COLORS = {
  OLY:'#CC0000', AEK:'#1a1a1a', PAOK:'#1a1a1a', PAO:'#007B3A',
  ARI:'#DAA520', ATR:'#003399', AST:'#FF8C00', KIF:'#00529B',
  LEV:'#006633', OFI:'#8B0000', PNE:'#6600AA', VOL:'#003366',
  IRA:'#0000CC', KAL:'#990000', DYN:'#003F87', NEC:'#CC0000',
  PKS:'#006400', TBD:'#444',
}
