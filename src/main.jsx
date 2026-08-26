import React, { useState, useEffect, Component } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Login from './pages/Login'
import { getStoredUser, storeUser, hasSession, clearAuth, ensureOfflineSession, isOfflineToken, tryUpgradeOfflineSession } from './lib/api'

/** React-safe fatal UI — never wipe #root with innerHTML (that causes removeChild cascades). */
function FatalScreen({ title, message }) {
  return React.createElement(
    'div',
    {
      style: {
        minHeight: '100vh',
        background: '#08090d',
        color: '#ff4d6d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
        fontFamily: 'monospace',
      },
    },
    React.createElement('div', { style: { fontSize: 32 } }, '❌'),
    React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: '#fff' } }, title || 'ΚΟΥΒΑΔΕΪΡΟΣ — Error'),
    React.createElement(
      'div',
      {
        style: {
          fontSize: 11,
          color: '#ff8fa3',
          maxWidth: 460,
          wordBreak: 'break-all',
          padding: 12,
          background: 'rgba(255,77,109,.1)',
          borderRadius: 8,
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
        },
      },
      String(message || 'Unknown error'),
    ),
    React.createElement(
      'button',
      {
        type: 'button',
        onClick: () => window.location.reload(),
        style: {
          background: '#ff4d6d',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
        },
      },
      'Ανανέωση',
    ),
  )
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(e) {
    return { error: e }
  }
  componentDidCatch(e, info) {
    console.error('KOUVADEIROS ErrorBoundary', e, info)
  }
  render() {
    if (this.state.error) {
      return React.createElement(FatalScreen, {
        title: 'ΚΟΥΒΑΔΕΪΡΟΣ — Error',
        message: 'React: ' + (this.state.error?.message || String(this.state.error)),
      })
    }
    return this.props.children
  }
}

function bootUser() {
  if (hasSession()) {
    const u = getStoredUser()
    // If somehow we have a real token while Worker login is still broken,
    // keep the user but mark offline on next 401 demotion. Don't clear here.
    return u
  }
  // Orphan user record without token → try offline demotion instead of wipe
  const orphan = getStoredUser()
  if (orphan?.id) {
    const offline = ensureOfflineSession(orphan)
    if (offline) return offline
  }
  clearAuth()
  return null
}

function Root() {
  var [u, setU] = useState(() => bootUser())

  useEffect(() => {
    function onLost() {
      // Prefer offline demotion for known users; only then show login
      const prev = getStoredUser()
      if (prev?.id && !isOfflineToken()) {
        const offline = ensureOfflineSession(prev)
        if (offline) {
          setU(offline)
          return
        }
      }
      clearAuth()
      setU(null)
    }
    window.addEventListener('kouv:session-lost', onLost)
    return () => window.removeEventListener('kouv:session-lost', onLost)
  }, [])

  // Stale local: sessions → upgrade to live Worker token when ping/login work
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!isOfflineToken()) return
      const upgraded = await tryUpgradeOfflineSession()
      if (!cancelled && upgraded?.token) setU(getStoredUser())
    })().catch(() => {})
    return () => { cancelled = true }
  }, [])

  function handleLogin(u2) {
    storeUser(u2)
    setU(u2)
  }
  function handleLogout() {
    clearAuth()
    setU(null)
  }
  if (!u) return React.createElement(Login, { onLogin: handleLogin })
  return React.createElement(App, { user: u, onLogout: handleLogout })
}

console.log('KOUVADEIROS v7 2026-08-26 projections-fix')

const rootEl = document.getElementById('root')
window.__KOUV_REACT_MOUNTED__ = false

try {
  ReactDOM.createRoot(rootEl).render(
    React.createElement(ErrorBoundary, null, React.createElement(Root)),
  )
  window.__KOUV_REACT_MOUNTED__ = true
} catch (e) {
  // React never mounted — safe to replace root contents once
  if (rootEl) {
    rootEl.textContent = ''
    const wrap = document.createElement('div')
    rootEl.appendChild(wrap)
    ReactDOM.createRoot(wrap).render(
      React.createElement(FatalScreen, {
        title: 'ΚΟΥΒΑΔΕΪΡΟΣ — Boot Error',
        message: 'Boot: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n'),
      }),
    )
  }
}
