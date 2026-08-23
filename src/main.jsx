import React, { useState, Component } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Login from './pages/Login'
import { getStoredUser, storeUser, hasSession, clearAuth } from './lib/api'

function showError(msg) {
  var el = document.getElementById('root')
  if (!el) return
  var d = document.createElement('div')
  d.style.cssText = 'min-height:100vh;background:#08090d;color:#ff4d6d;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;gap:16px;font-family:monospace'
  var icon = document.createElement('div')
  icon.textContent = '❌'
  icon.style.fontSize = '32px'
  var title = document.createElement('div')
  title.textContent = 'ΚΟΥΒΑΔΕΪΡΟΣ — Error'
  title.style.cssText = 'font-size:16px;font-weight:700;color:#fff'
  var err = document.createElement('div')
  err.textContent = String(msg)
  err.style.cssText = 'font-size:11px;color:#ff8fa3;max-width:460px;word-break:break-all;padding:12px;background:rgba(255,77,109,.1);border-radius:8px;line-height:1.5'
  var btn = document.createElement('button')
  btn.textContent = 'Ανανέωση'
  btn.style.cssText = 'background:#ff4d6d;color:#fff;border:none;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer'
  btn.onclick = function() { window.location.reload() }
  d.appendChild(icon)
  d.appendChild(title)
  d.appendChild(err)
  d.appendChild(btn)
  el.innerHTML = ''
  el.appendChild(d)
}

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  componentDidCatch(e) { showError('React: ' + e.message) }
  render() {
    if (this.state.error) {
      showError('React: ' + this.state.error.message)
      return null
    }
    return this.props.children
  }
}

function Root() {
  // Require both user + token — orphan user records caused 401 reload loops on login
  var initial = hasSession() ? getStoredUser() : null
  if (!initial && getStoredUser()) clearAuth()
  var [u, setU] = useState(initial)
  function handleLogin(u2) { storeUser(u2); setU(u2) }
  function handleLogout() { clearAuth(); setU(null) }
  if (!u) return React.createElement(Login, { onLogin: handleLogin })
  return React.createElement(App, { user: u, onLogout: handleLogout })
}

console.log('KOUVADEIROS v7 2026-08-23 login-fix')

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    React.createElement(ErrorBoundary, null, React.createElement(Root))
  )
} catch(e) {
  showError('Boot: ' + e.message + '\n' + (e.stack||'').split('\n').slice(0,3).join('\n'))
}
