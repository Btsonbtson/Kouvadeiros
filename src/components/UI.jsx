import { useState } from 'react'
import { LOGOS, TEAM_COLORS, logoUrl } from '../lib/logos'
import { TEAMS } from '../lib/data'

function ShieldFallback({ k, size }) {
  const t = TEAMS[k] || { abbr: k }
  const color = TEAM_COLORS[k] || '#444'
  const abbr = (t.abbr || k || '?').slice(0, 3)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
      <path d="M32 4 L58 16 L58 36 Q58 54 32 62 Q6 54 6 36 L6 16 Z"
        fill={color} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
      <text x="32" y="39" textAnchor="middle"
        fontFamily="'Arial Black',Arial,sans-serif"
        fontSize={abbr.length > 2 ? 14 : 17} fontWeight="900"
        fill="#fff" letterSpacing="-0.5">{abbr}</text>
    </svg>
  )
}

export function TeamLogo({ k, size = 32 }) {
  const [tryIdx, setTryIdx] = useState(0)
  const primary = logoUrl(k) || LOGOS[k]
  const candidates = primary
    ? [primary, primary.endsWith('.svg') ? primary.replace(/\.svg$/i, '.png') : primary.replace(/\.png$/i, '.svg'), `/logos/${k}.svg`, `/logos/${k}.png`]
    : [`/logos/${k}.svg`, `/logos/${k}.png`]
  const uniq = [...new Set(candidates.filter(Boolean))]
  const url = uniq[tryIdx]

  if (!k || k === 'TBD' || tryIdx >= uniq.length) return <ShieldFallback k={k} size={size} />

  // Soft plate so white-only crests (e.g. PAOK) stay visible on dark UI
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: Math.max(4, Math.round(size * 0.18)),
        background: 'rgba(255,255,255,0.92)',
        padding: Math.max(1, Math.round(size * 0.06)),
        boxSizing: 'border-box',
      }}
    >
      <img
        key={url}
        src={url}
        alt={TEAMS[k]?.name || k}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={() => setTryIdx(i => i + 1)}
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </span>
  )
}

export const Crest = ({ k, size }) => <TeamLogo k={k} size={size} />

const T_STYLES = {
  SL:   { bg:'#f0c04018', c:'#f0c040', border:'#f0c04040' },
  UCL:  { bg:'#5ba3f518', c:'#5ba3f5', border:'#5ba3f540' },
  UEL:  { bg:'#f5733a18', c:'#f5733a', border:'#f5733a40' },
  UECL: { bg:'#3fd68a18', c:'#3fd68a', border:'#3fd68a40' },
}
export function TPill({ id, size = 'sm' }) {
  const s = T_STYLES[id] || T_STYLES.SL
  return (
    <span style={{ fontSize: size==='lg'?11:9, fontWeight:700,
      padding: size==='lg'?'3px 9px':'2px 7px', borderRadius:6,
      background:s.bg, color:s.c, border:`1px solid ${s.border}`,
      letterSpacing:'.06em', textTransform:'uppercase' }}>{id}</span>
  )
}

export function PtsBadge({ pts, compact }) {
  const map = {
    2:{ bg:'#00ff8818', c:'#00ff88', border:'#00ff8840', label:compact?'+2':'🎯 2pts' },
    1:{ bg:'#ffdd0018', c:'#ffdd00', border:'#ffdd0040', label:compact?'+1':'✓ 1pt' },
    0:{ bg:'#ffffff08', c:'#ffffff44', border:'#ffffff12', label:compact?'0':'✗ 0pts' },
  }
  const s = map[pts] || map[0]
  return (
    <span style={{ fontSize:compact?10:11, fontWeight:700,
      padding:compact?'1px 5px':'2px 8px', borderRadius:6,
      background:s.bg, color:s.c, border:`1px solid ${s.border}`,
      marginLeft:compact?4:5 }}>{s.label}</span>
  )
}

export function ScorePill({ h, a, pending }) {
  if (pending) return (
    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
      <span style={{ fontSize:18, fontWeight:800, color:'#ffffff25' }}>?</span>
      <span style={{ fontSize:13, color:'#ffffff15' }}>:</span>
      <span style={{ fontSize:18, fontWeight:800, color:'#ffffff25' }}>?</span>
    </div>
  )
  if (h == null) return (
    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
      <span style={{ fontSize:14, color:'#ffffff20' }}>–</span>
      <span style={{ fontSize:11, color:'#ffffff12' }}>:</span>
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

export function Spinner({ size = 20 }) {
  return <div style={{ width:size, height:size, border:`2px solid #ffffff12`,
    borderTopColor:'#ffffff60', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
}

export function Card({ children, glow, style: sx }) {
  return (
    <div style={{ background:'rgba(17,19,24,.55)', border:glow?`1px solid ${glow}44`:'1px solid #ffffff12',
      borderRadius:12, padding:'14px 16px', marginBottom:10, backdropFilter:'blur(6px)',
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
