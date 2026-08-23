import { useState, useEffect } from 'react'
import { api, storeToken, storeUser } from '../lib/api'

const BG='#08090d', SURF='#111318', LINE='rgba(255,255,255,.1)'
const GREEN='#00ff88', RED='#ff2244', MUTED='rgba(255,255,255,.4)'

export default function Login({ onLogin }) {
  const [email, setEmail]   = useState('')
  const [pass,  setPass]    = useState('')
  const [phone, setPhone]   = useState('+30')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [needsPhone, setNeedsPhone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const user = await api.login(email.trim().toLowerCase(), pass)
      // If user has no phone stored, ask for it
      if (!user.phone && !needsPhone) {
        setNeedsPhone(true); setLoading(false); return
      }
      if (needsPhone) {
        // Save phone via API
        try { await api.savePhone(phone) } catch {}
      }
      storeToken(user.token); storeUser({...user, phone: user.phone || phone}); onLogin({...user, phone: user.phone || phone})
    } catch { setError('Λάθος email ή κωδικός — ή ο server είναι κάτω') }
    finally { setLoading(false) }
  }

  const inp = {
    width:'100%', padding:'12px 14px', background:'#0d0f14',
    border:`1px solid ${LINE}`, borderRadius:10, color:'#e8e9ef',
    fontSize:15, outline:'none', fontFamily:'inherit',
  }

  return (
    <div style={{ minHeight:'100vh', background:BG, display:'flex', alignItems:'center',
      justifyContent:'center', padding:20, fontFamily:"'Space Grotesk',system-ui,sans-serif" }}>
      <div style={{ position:'fixed', inset:0,
        backgroundImage:'linear-gradient(#ffffff06 1px,transparent 1px),linear-gradient(90deg,#ffffff06 1px,transparent 1px)',
        backgroundSize:'40px 40px', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:380, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.2em', color:'rgba(255,255,255,.3)', marginBottom:8 }}>CAREDIRECT FC</div>
          <div style={{ fontSize:38, fontWeight:800, color:'#fff', letterSpacing:'-.02em', lineHeight:1, marginBottom:10 }}>ΚΟΥΒΑΔΕΪΡΟΣ</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <div style={{ height:1, width:40, background:'linear-gradient(90deg,transparent,#00ff8866)' }}/>
            <span style={{ fontSize:11, fontWeight:700, color:GREEN, letterSpacing:'.1em' }}>2026/27 SEASON</span>
            <div style={{ height:1, width:40, background:'linear-gradient(90deg,#00ff8866,transparent)' }}/>
          </div>
        </div>

        <div style={{ background:SURF, border:`1px solid ${LINE}`, borderRadius:16, padding:28 }}>
          {!needsPhone ? (
            <>
              <div style={{ fontSize:12, fontWeight:700, color:MUTED, marginBottom:18, letterSpacing:'.08em', textTransform:'uppercase' }}>Είσοδος</div>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:MUTED, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:7 }}>Email</div>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                    placeholder="name@caredirect.com" required style={inp}/>
                </div>
                <div style={{ marginBottom:22 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:MUTED, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:7 }}>Password</div>
                  <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
                    placeholder="••••" required style={inp}/>
                </div>
                {error && <div style={{ fontSize:12, color:RED, background:'rgba(255,34,68,.1)', border:`1px solid rgba(255,34,68,.25)`, borderRadius:8, padding:'9px 12px', marginBottom:14, textAlign:'center', fontWeight:600 }}>{error}</div>}
                <button type="submit" disabled={loading} style={{ width:'100%', padding:14, borderRadius:10, border:'none', background:loading?'#ffffff12':GREEN, color:loading?MUTED:'#08090d', fontSize:14, fontWeight:800, cursor:'pointer', letterSpacing:'.03em' }}>
                  {loading ? 'Σύνδεση…' : 'Είσοδος →'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div style={{ fontSize:12, fontWeight:700, color:GREEN, marginBottom:6, letterSpacing:'.06em', textTransform:'uppercase' }}>📱 Αριθμός Κινητού</div>
              <div style={{ fontSize:13, color:MUTED, marginBottom:20, lineHeight:1.5 }}>
                Εισάγετε τον αριθμό κινητού σας για να λαμβάνετε υπενθυμίσεις WhatsApp πριν κάθε αγώνα.
              </div>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom:22 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:MUTED, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:7 }}>Κινητό (με πρόθεμα)</div>
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)}
                    placeholder="+30 694 000 0000" required style={inp}/>
                  <div style={{ fontSize:11, color:MUTED, marginTop:6 }}>Μορφή: +30XXXXXXXXXX</div>
                </div>
                <button type="submit" disabled={loading} style={{ width:'100%', padding:14, borderRadius:10, border:'none', background:loading?'#ffffff12':GREEN, color:'#08090d', fontSize:14, fontWeight:800, cursor:'pointer' }}>
                  {loading ? 'Αποθήκευση…' : 'Αποθήκευση & Είσοδος →'}
                </button>
                <button type="button" onClick={()=>{storeToken('');setNeedsPhone(false)}} style={{ width:'100%', padding:10, borderRadius:10, border:`1px solid ${LINE}`, background:'transparent', color:MUTED, fontSize:13, cursor:'pointer', marginTop:10 }}>
                  Παράλειψη προς το παρόν
                </button>
              </form>
            </>
          )}
        </div>

        <div style={{ textAlign:'center', marginTop:18, fontSize:11, color:'rgba(255,255,255,.2)' }}>
          Private · Invitation only · CareDirect FC
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  )
}
