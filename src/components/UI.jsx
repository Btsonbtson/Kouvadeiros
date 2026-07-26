import { LOGOS, TEAM_COLORS } from '../lib/logos'
import { TEAMS } from '../lib/data'

// ── TEAM LOGO (inline SVG shield — zero network, always loads) ────────────────
export function TeamLogo({ k, size = 32 }) {
  const url = LOGOS[k]
  const t = TEAMS[k] || { name: k, abbr: k }
  if (!url) {
    const color = TEAM_COLORS[k] || '#444'
    return (
      <div style={{ width:size, height:size*1.125, borderRadius:4, background:color,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:size*.28, fontWeight:900, color:'#fff', flexShrink:0 }}>
        {(t.abbr||k).slice(0,3)}
      </div>
    )
  }
  return (
    <img src={url} alt={t.name} width={size} height={Math.round(size*1.125)}
      style={{ width:size, height:Math.round(size*1.125), objectFit:'contain',
        flexShrink:0, imageRendering:'auto' }}/>
  )
}

// backward compat
export const Crest = ({ k, size }) => <TeamLogo k={k} size={size} />

// ── TOURNAMENT PILL ──────────────────────────────────────────────────────────
const T_STYLES = {
  SL:   { bg:'#f0c04018', c:'#f0c040', border:'#f0c04040' },
  UCL:  { bg:'#5ba3f518', c:'#5ba3f5', border:'#5ba3f540' },
  UEL:  { bg:'#f5733a18', c:'#f5733a', border:'#f5733a40' },
  UECL: { bg:'#3fd68a18', c:'#3fd68a', border:'#3fd68a40' },
}
export function TPill({ id, size='sm' }) {
  const s = T_STYLES[id] || T_STYLES.SL
  return (
    <span style={{ fontSize:size==='lg'?11:9, fontWeight:700,
      padding:size==='lg'?'3px 9px':'2px 7px', borderRadius:6,
      background:s.bg, color:s.c, border:`1px solid ${s.border}`,
      letterSpacing:'.06em', textTransform:'uppercase' }}>{id}</span>
  )
}

// ── POINTS BADGE ─────────────────────────────────────────────────────────────
export function PtsBadge({ pts, compact }) {
  const map = {
    2:{ bg:'#00ff8818', c:'#00ff88', border:'#00ff8840', label:compact?'+2':'🎯 2pts' },
    1:{ bg:'#ffdd0018', c:'#ffdd00', border:'#ffdd0040', label:compact?'+1':'✓ 1pt' },
    0:{ bg:'#ffffff08', c:'#ffffff44', border:'#ffffff12', label:compact?'0':'✗ 0pts' },
  }
  const s = map[pts]||map[0]
  return (
    <span style={{ fontSize:compact?10:11, fontWeight:700,
      padding:compact?'1px 5px':'2px 8px', borderRadius:6,
      background:s.bg, color:s.c, border:`1px solid ${s.border}`,
      marginLeft:compact?4:5, fontVariantNumeric:'tabular-nums' }}>{s.label}</span>
  )
}

// ── SCORE PILL ───────────────────────────────────────────────────────────────
export function ScorePill({ h, a, pending }) {
  if (pending) return (
    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
      <span style={{ fontSize:18, fontWeight:800, color:'#ffffff25' }}>?</span>
      <span style={{ fontSize:13, color:'#ffffff18' }}>:</span>
      <span style={{ fontSize:18, fontWeight:800, color:'#ffffff25' }}>?</span>
    </div>
  )
  if (h == null) return (
    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
      <span style={{ fontSize:14, color:'#ffffff20' }}>–</span>
      <span style={{ fontSize:12, color:'#ffffff12' }}>:</span>
      <span style={{ fontSize:14, color:'#ffffff20' }}>–</span>
    </div>
  )
  return (
    <div style={{ display:'flex', alignItems:'center', gap:2 }}>
      <span style={{ fontSize:22, fontWeight:900, color:'#e8e9ef', fontVariantNumeric:'tabular-nums', lineHeight:1 }}>{h}</span>
      <span style={{ fontSize:14, color:'#ffffff40', margin:'0 1px' }}>:</span>
      <span style={{ fontSize:22, fontWeight:900, color:'#e8e9ef', fontVariantNumeric:'tabular-nums', lineHeight:1 }}>{a}</span>
    </div>
  )
}

export function Spinner({ size=20 }) {
  return <div style={{ width:size, height:size, border:`2px solid #ffffff12`,
    borderTopColor:'#ffffff60', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
}

export function Card({ children, glow, style:sx }) {
  return (
    <div style={{ background:'#111318', border:glow?`1px solid ${glow}44`:'1px solid #ffffff0e',
      borderRadius:12, padding:'14px 16px', marginBottom:10,
      boxShadow:glow?`0 0 20px ${glow}12`:'none', ...sx }}>
      {children}
    </div>
  )
}

export function SLbl({ children, accent }) {
  return (
    <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase',
      color:accent||'#ffffff40', marginBottom:10 }}>{children}</div>
  )
}
