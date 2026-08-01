import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const candidates = [
  path.join(os.homedir(), '.wrangler/config/default.toml'),
  path.join(os.homedir(), '.config/.wrangler/config/default.toml'),
]

let toml = ''
for (const p of candidates) {
  if (fs.existsSync(p)) {
    toml = fs.readFileSync(p, 'utf8')
    console.log('found_config', p)
    break
  }
}

const m =
  toml.match(/oauth_token\s*=\s*"([^"]+)"/) ||
  toml.match(/api_token\s*=\s*"([^"]+)"/)
const token = process.env.CLOUDFLARE_API_TOKEN || (m && m[1])

let account = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CF_ACCOUNT_ID
if (!account && token) {
  // Resolve account from token (avoids relying on shell env)
  const accRes = await fetch('https://api.cloudflare.com/client/v4/accounts?per_page=50', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const accJson = await accRes.json()
  const accounts = accJson.result || []
  const named = accounts.find((a) => /kouv|boikos|jboikos/i.test(a.name || ''))
  account = (named || accounts[0])?.id
  if (account) console.log('resolved_account', account.slice(0, 6) + '…')
}

console.log(
  'has_token',
  !!token,
  'token_len',
  token ? token.length : 0,
  'has_account',
  !!account
)

if (!token || !account) {
  console.error('Missing Cloudflare token or account id')
  process.exit(2)
}

const url = `https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/kouvadeiros`

const get = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
const gj = await get.json()
console.log('get_ok', gj.success, 'build_config', JSON.stringify(gj.result?.build_config))

const patch = await fetch(url, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    build_config: {
      build_command: 'npm run build',
      destination_dir: 'dist',
      root_dir: '',
    },
  }),
})
const pj = await patch.json()
console.log('patch_ok', pj.success, 'build_config', JSON.stringify(pj.result?.build_config))
if (!pj.success) {
  console.error(JSON.stringify(pj.errors, null, 2))
  process.exit(1)
}
