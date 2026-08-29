/**
 * Smoke: App hooks must not sit after loading/showGuide early returns.
 * Regresses the login removeChild cascade from #28 (useCallback after if(loading)).
 * Run: node scripts/smoke-hooks-order.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8')

const appStart = src.indexOf('export default function App')
if (appStart < 0) throw new Error('App not found')
// Bound the search at the next top-level component boundary (marked by a
// "─── SOME PAGE ───" banner comment right after App's closing brace) rather
// than a fixed byte budget, so this doesn't silently under- or over-shoot as
// App() grows or other components change size.
const nextBanner = src.slice(appStart).search(/\}\s*\/\/\s*─{3,}/)
const appEnd = nextBanner > 0 ? appStart + nextBanner : appStart + 20000
const slice = src.slice(appStart, appEnd)

const loadingReturn = slice.search(/if\s*\(\s*loading\s*\)\s*return/)
const guideReturn = slice.search(/if\s*\(\s*showGuide\s*\)\s*return/)
if (loadingReturn < 0) throw new Error('loading early return missing')

const hookRe = /\buse(?:State|Effect|Memo|Callback|Ref|LayoutEffect)\s*\(/g
const lateHooks = []
let m
while ((m = hookRe.exec(slice))) {
  if (m.index > loadingReturn || (guideReturn >= 0 && m.index > guideReturn && guideReturn < loadingReturn)) {
    // any hook after the first early-return in App is illegal
  }
  if (guideReturn >= 0 && m.index > Math.min(guideReturn, loadingReturn)) {
    lateHooks.push({ name: m[0], at: m.index })
  } else if (guideReturn < 0 && m.index > loadingReturn) {
    lateHooks.push({ name: m[0], at: m.index })
  }
}

if (lateHooks.length) {
  console.error(lateHooks)
  throw new Error(`hooks after early return in App: ${lateHooks.map((h) => h.name).join(', ')}`)
}

const main = fs.readFileSync(path.join(root, 'src/main.jsx'), 'utf8')
if (/el\.innerHTML\s*=\s*''/.test(main) || /showError\(/.test(main)) {
  throw new Error('main.jsx must not wipe #root via showError/innerHTML')
}
if (!/FatalScreen/.test(main) || !/ErrorBoundary/.test(main)) {
  throw new Error('expected FatalScreen ErrorBoundary in main.jsx')
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
if (!/__KOUV_REACT_MOUNTED__/.test(html)) {
  throw new Error('index.html onerror must gate on __KOUV_REACT_MOUNTED__')
}

console.log('OK — App hooks before early returns; ErrorBoundary does not wipe #root')
