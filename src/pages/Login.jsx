import { useState } from 'react'
import { api, storeToken, storeUser } from '../lib/api'

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const user = await api.login(email.trim().toLowerCase(), password)
      storeToken(user.token); storeUser(user); onLogin(user)
    } catch { setError('Λάθος email ή κωδικός') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#08090d', display:'flex', alignItems:'center', justifyContent:'center', padding:20, fontFamily:"'Space Grotesk',system-ui,sans-serif" }}>
      {/* Background grid */}
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px)', backgroundSize:'40px 40px', pointerEvents:'none' }}/>
      
      <div style={{ width:'100%', maxWidth:380, position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.2em', textTransform:'uppercase', color:'#ffffff40', marginBottom:8 }}>
            caredirect fc
          </div>
          <div style={{ fontSize:36, fontWeight:700, letterSpacing:'-.02em', color:'#fff', marginBottom:4, lineHeight:1 }}>
            ΚΟΥΒΑΔΕΙΡΟΣ
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <div style={{ height:1, width:40, background:'linear-gradient(90deg,transparent,#00ff8866)' }}/>
            <span style={{ fontSize:11, fontWeight:600, color:'#00ff88', letterSpacing:'.1em' }}>2026/27 SEASON</span>
            <div style={{ height:1, width:40, background:'linear-gradient(90deg,#00ff8866,transparent)' }}/>
          </div>
        </div>

        {/* Card */}
        <div style={{ background:'#111318', border:'1px solid #ffffff14', borderRadius:16, padding:28 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#ffffff60', marginBottom:20, letterSpacing:'.05em', textTransform:'uppercase' }}>
            Είσοδος
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10, fontWeight:700, color:'#ffffff40', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Email</div>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@caredirect.com" required
                style={{ width:'100%', padding:'11px 14px', background:'#0d0f14', border:'1px solid #ffffff14', borderRadius:9, color:'#e8e9ef', fontSize:14, outline:'none', transition:'border-color .15s' }}
                onFocus={e=>e.target.style.borderColor='#ffffff35'}
                onBlur={e=>e.target.style.borderColor='#ffffff14'}
              />
            </div>
            <div style={{ marginBottom:22 }}>
              <div style={{ fontSize:10, fontWeight:700, color:'#ffffff40', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Password</div>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••" required
                style={{ width:'100%', padding:'11px 14px', background:'#0d0f14', border:'1px solid #ffffff14', borderRadius:9, color:'#e8e9ef', fontSize:14, outline:'none', transition:'border-color .15s' }}
                onFocus={e=>e.target.style.borderColor='#ffffff35'}
                onBlur={e=>e.target.style.borderColor='#ffffff14'}
              />
            </div>
            {error && (
              <div style={{ fontSize:12, color:'#ff4d4d', background:'#ff4d4d15', border:'1px solid #ff4d4d30', borderRadius:8, padding:'8px 12px', marginBottom:14, textAlign:'center', fontWeight:500 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'13px', borderRadius:10, border:'none', background: loading?'#ffffff15':'#00ff88', color: loading?'#ffffff50':'#08090d', fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, letterSpacing:'.03em', transition:'all .2s' }}>
              {loading ? <><div style={{ width:16, height:16, border:'2px solid #ffffff30', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite' }}/> Σύνδεση…</> : 'Είσοδος →'}
            </button>
          </form>
        </div>

        <div style={{ textAlign:'center', marginTop:20, fontSize:11, color:'#ffffff20', fontWeight:500 }}>
          Private · Invitation only · CareDirect FC
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  )
}
