const BASE = 'https://kouvadeiros-api.jboikos.workers.dev'
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
export const api = {
  getSlStandings: () => call('GET', '/sl-standings'),
  getSlFixtures:  () => call('GET', '/sl-fixtures'),
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
