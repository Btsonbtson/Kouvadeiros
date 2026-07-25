import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Login from './pages/Login'
import { getStoredUser, storeUser } from './lib/api'

function Root() {
  const [user, setUser] = useState(() => getStoredUser())

  function handleLogin(u) { storeUser(u); setUser(u) }
  function handleLogout() { setUser(null) }

  if (!user) return <Login onLogin={handleLogin} />
  return <App user={user} onLogout={handleLogout} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><Root /></React.StrictMode>
)
