import { readFileSync, writeFileSync } from 'fs'
import { spawnSync } from 'child_process'

/** CP437 glyph → byte (subset covering UTF-8 Greek mojibake). */
const CP437_REV = (() => {
  const glyphs =
    '\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f' +
    '\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f' +
    " !\"#$%&'()*+,-./0123456789:;<=>?" +
    '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_' +
    '`abcdefghijklmnopqrstuvwxyz{|}~\u007f' +
    'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒ' +
    'áíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐' +
    '└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀' +
    'αßΓπΣσμτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■\u00a0'
  const map = new Map()
  for (let i = 0; i < 256; i++) map.set(glyphs[i], i)
  // Extra aliases seen in our dump
  map.set('¤', 0xcf) // sometimes CF shows as currency
  return map
})()

function undoCp437Utf8Mojibake(s) {
  if (typeof s !== 'string' || !s) return s
  if (/[\u0370-\u03FF]/.test(s) && !s.includes('╬')) return s
  const bytes = []
  for (const ch of s) {
    if (CP437_REV.has(ch)) bytes.push(CP437_REV.get(ch))
    else {
      const c = ch.codePointAt(0)
      if (c < 256) bytes.push(c)
      else return s // can't reverse cleanly
    }
  }
  try {
    const decoded = new TextDecoder('utf-8', { fatal: false }).decode(Uint8Array.from(bytes))
    if (/[\u0370-\u03FF]/.test(decoded)) return decoded
  } catch {}
  return s
}

function extractJson(raw) {
  const i = raw.indexOf('{')
  const j = raw.lastIndexOf('}')
  return JSON.parse(raw.slice(i, j + 1))
}

const get = spawnSync(
  'npx',
  ['wrangler', 'kv', 'key', 'get', 'state', '--namespace-id', '5988821db92146b08969e4b27ec8854e', '--remote'],
  { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, shell: true },
)
if (get.status !== 0) {
  console.error(get.stderr?.slice(0, 400))
  process.exit(1)
}

const state = extractJson(get.stdout)
let fixed = 0
for (const m of state.chat || []) {
  const t2 = undoCp437Utf8Mojibake(m.t)
  const ts2 = undoCp437Utf8Mojibake(m.ts)
  if (t2 !== m.t || ts2 !== m.ts) {
    m.t = t2
    m.ts = ts2
    fixed++
  }
}
console.log('repaired chat rows:', fixed)
;(state.chat || []).slice(-6).forEach((m) => console.log(m.p, m.ts, m.t.slice(0, 80)))

// Keep mavromichalis PAOK Leg1 tip
if (!state.predictions) state.predictions = {}
if (!state.predictions['uel-paok-1']) state.predictions['uel-paok-1'] = {}
const mav = state.predictions['uel-paok-1'].mavromichalis || { h: 0, a: 0 }
mav.qual = 'PAOK'
state.predictions['uel-paok-1'].mavromichalis = mav

writeFileSync('data/state-fixed.json', JSON.stringify(state))
console.log('bytes', Buffer.byteLength(JSON.stringify(state)))
