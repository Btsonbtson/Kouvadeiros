import React, { useState, Component } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Login from './pages/Login'
import { getStoredUser, storeUser } from './lib/api'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  componentDidCatch(e, info) {
    const el = document.getElementById('root')
    if (el) el.setAttribute('data-error', e.message)
  }
  render() {
    if (this.state.error) {
      const msg = String(this.state.error?.message || this.state.error)
      const stack = this.state.error?.stack?.split('\n').slice(0,2).join(' | ') || ''
      return React.createElement('div', {
        style: {
          minHeight:'100vh', background:'#08090d', color:'#ff4d6d',
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', padding:24, fontFamily:'monospace', gap:12
        }
      },
        React.createElement('div', {style:{fontSize:28}}, '❌'),
        React.createElement('div', {style:{fontSize:15,fontWeight:700,color:'#fff'}}, 'ΚΟΥΒΑΔΕΪΡΟΣ — Crash'),
        React.createElement('div', {
          style:{background:'rgba(255,77,109,.1)',border:'1px solid rgba(255,77,109,.3)',
            borderRadius:10,padding:14,maxWidth:460,width:'100%',fontSize:11,
            color:'#ff8fa3',wordBreak:'break-all',lineHeight:1.5}
        }, msg + '\n\n' + stack),
        React.createElement('button', {
          onClick: () => window.location.reload(),
          style:{background:'#ff4d6d',color:'#fff',border:'none',
            borderRadius:8,padding:'10px 24px',fontSize:14,fontWeight:700,cursor:'pointer'}
        }, 'Ανανέωση')
      )
    }
    return this.props.children
  }
}

function Root() {
  const [user, setUser] = useState(() => getStoredUser())
  function handleLogin(u) { storeUser(u); setUser(u) }
  function handleLogout() { setUser(null) }
  if (!user) return React.createElement(Login, { onLogin: handleLogin })
  return React.createElement(App, { user, onLogout: handleLogout })
}

console.log('KOUVADEIROS v7 2026-07-30')

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    React.createElement(ErrorBoundary, null, React.createElement(Root))
  )
} catch(e) {
  const el = document.getElementById('root')
  if (el) el.innerHTML = '<div style="min-height:100vh;background:#08090d;color:#ff4d6d;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;font-family:monospace;gap:12px"><div style="font-size:28px">❌</div><div style="font-size:15px;font-weight:700;color:#fff">Boot Error</div><div style="font-size:11px;color:#ff8fa3;word-break:break-all;max-width:460px;background:rgba(255,77,109,.1);padding:14px;border-radius:10px">' + String(e) + '<br><br>' + (e.stack||'').split("\\n").slice(0,3).join('<br>') + '</div><button onclick="location.reload()" style="background:#ff4d6d;color:#fff;border:none;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;margin-top:8px">Ανανέωση</button></div>'
}
