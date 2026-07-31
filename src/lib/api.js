const BASE = (typeof __WORKER_URL__ !== 'undefined' && __WORKER_URL__)
  ? __WORKER_URL__
  : 'https://kouvadeiros-api.jboikos.workers.dev'
/** Dedicated scores Worker (pipeline JSON). Falls back to API host if unset. */
const SCORES_BASE = (typeof __SCORES_URL__ !== 'undefined' && __SCORES_URL__)
  ? __SCORES_URL__
  : 'https://kouvadeiros-scores.jboikos.workers.dev'
function token() { return localStorage.getItem('kouv_token')||'' }
async function call(method, path, body) {
  const res = await fetch(`${BASE}${path}`,{
    method,
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${token()}`},
    body: body ? JSON.stringify(body) : undefined,
  })
  if(res.status===401){localStorage.removeItem('kouv_token');localStorage.removeItem('kouv_user');window.location.reload();throw new Error('Session expired')}
  if(!res.ok) throw new Error(`${method} ${path} → ${res.status}`)
  return res.json()
}
/** Public GET against scores Worker (pipeline R2/KV) */
async function publicScoresGet(path) {
  const res = await fetch(`${SCORES_BASE}${path}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    // Fallback: same path on main API Worker if scores Worker not deployed yet
    const res2 = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json' } })
    if (!res2.ok) throw new Error(`GET ${path} → ${res.status}/${res2.status}`)
    return res2.json()
  }
  return res.json()
}
export const api = {
  getSlStandings: () => call('GET', '/sl-standings'),
  setLive: (matchId,h,a,min,final) => call('POST','/set-live',{matchId,h,a,min,final}),
  getSlFixtures:  () => call('GET', '/sl-fixtures'),
  /** Pipeline scores from R2/KV via scores Worker */
  getLiveScores:  (mode='live') => publicScoresGet(`/live-scores?mode=${mode}`),
  getTodayScores: () => publicScoresGet('/live-scores?mode=today'),
  login:      (email,password) => call('POST','/login',{email,password}),
  logout:     ()               => call('POST','/logout'),
  getState:   ()               => call('GET', '/state'),
  savePred:   (matchId,h,a,qual,predOT,otH,otA,predPen,penH,penA) =>
    call('PATCH','/prediction',{matchId,h,a,qual,predOT,otH,otA,predPen,penH,penA}),
  saveResult: (matchId,h,a,ot,otH,otA,pen,penH,penA) =>
    call('PATCH','/result',{matchId,h,a,overtime:ot,otH,otA,penalties:pen,penH,penA}),
  fetchScores:(matchId) => call('POST','/fetch-scores',{matchId}),
  sendChat:   (text)    => call('PATCH','/chat',{text}),
  savePhone:  (phone)   => call('PATCH','/save-phone',{phone}),
  addPlayer:  (data)    => call('POST','/add-player',data),
}
export function getStoredUser(){try{return JSON.parse(localStorage.getItem('kouv_user')||'null')}catch{return null}}
export function storeUser(u){localStorage.setItem('kouv_user',JSON.stringify(u))}
export function storeToken(t){localStorage.setItem('kouv_token',t)}
export function clearAuth(){localStorage.removeItem('kouv_token');localStorage.removeItem('kouv_user')}
