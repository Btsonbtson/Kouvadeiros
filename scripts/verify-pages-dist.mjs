import { readFileSync } from 'node:fs'

const html = readFileSync('dist/index.html', 'utf8')
if (!html.includes('/assets/index-') || html.includes('/src/main.jsx')) {
  console.error(
    'Refusing to deploy: dist/index.html must reference /assets/index-*.js and must not reference /src/main.jsx'
  )
  process.exit(1)
}
console.log('dist/index.html looks like a Vite production build')
