/** Stadium photos for main nav tab backdrops — shuffled per session. */
export const TAB_BG_POOL = [
  '/bgs/00-centenary.png',
  '/bgs/01-both_sides.png',
  '/bgs/02-cl1.png',
  '/bgs/03-cl2.png',
  '/bgs/04-conferance.png',
  '/bgs/05-coreo1.png',
  '/bgs/06-coreo2.png',
  '/bgs/07-coreo3.png',
  '/bgs/08-coreo4.png',
  '/bgs/09-coreo5.png',
  '/bgs/10-coreo6.png',
  '/bgs/11-coreo7.png',
  '/bgs/12-karaiskakis.png',
  '/bgs/13-karaiskakis2.png',
  '/bgs/14-lights.png',
  '/bgs/15-neo_karaiskakis.png',
  '/bgs/16-neo_karaiskakis1.png',
  '/bgs/17-neo_karaiskakis2.png',
  '/bgs/18-neo_karaiskakis3.png',
  '/bgs/19-neo_karaiskakis4.png',
  '/bgs/20-we_rule_this_land.png',
  '/bgs/21-sportal.png',
]

export const TAB_IDS = ['matchday', 'schedule', 'league', 'history', 'banter']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Random photo → each main tab; stable for the browser session. */
export function assignTabBackgrounds(tabIds = TAB_IDS, pool = TAB_BG_POOL) {
  const shuffled = shuffle(pool)
  const map = {}
  tabIds.forEach((id, i) => {
    map[id] = shuffled[i % shuffled.length]
  })
  return map
}
