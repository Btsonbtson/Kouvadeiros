import React, { useState, Component } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Login from './pages/Login'
import { getStoredUser, storeUser } from './lib/api'

// Error boundary - shows crash details instead of black screen
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) {
      return React.createElement('div', {
        style: {
          minHeight: '100vh', background: '#08090d', color: '#ff4d6d',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: 24, fontFamily: 'monospace',
          gap: 16
        }
      },
        React.createElement('div', { style: { fontSize: 32 } }, '❌'),
        React.createElement('div', { style: { fontSize: 16, fontWeight: 700 } }, 'ΚΟΥΒΑΔΕΪΡΟΣ — Crash'),
        React.createElement('div', {
          style: {
            background: 'rgba(255,77,109,.1)', border: '1px solid rgba(255,77,109,.3)',
            borderRadius: 12, padding: 16, maxWidth: 500, width: '100%',
            fontSize: 12, color: '#ff8fa3', wordBreak: 'break-all'
          }
        }, String(this.state.error?.message || this.state.error)),
        React.createElement('div', { style: { fontSize: 10, color: '#ffffff40' } },
          this.state.error?.stack?.split('\n').slice(0,3).join(' | ') || ''
        ),
        React.createElement('button', {
          onClick: () => window.location.reload(),
          style: {
            background: '#ff4d6d', color: '#fff', border: 'none',
            borderRadius: 8, padding: '10px 24px', fontSize: 14,
            fontWeight: 700, cursor: 'pointer', marginTop: 8
          }
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

console.log('KOUVADEIROS v7 2026-07-30');
ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(ErrorBoundary, null,
    React.createElement(Root)
  )
)
