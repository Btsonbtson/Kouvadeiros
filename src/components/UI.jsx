import { useState } from 'react'
import { LOGOS, TEAM_COLORS } from '../lib/logos'
import { TEAMS } from '../lib/data'

// KEY FIX: referrerPolicy="no-referrer" bypasses hotlink protection
// The CDN blocks requests WITH a Referer header from other domains.
// With no-referrer, no Referer is sent → CDN allows the request.
export function TeamLogo({ k, size = 32 }) {
  const [ok, setOk] = useState(true)
  const url = LOGOS[k]
  const t = TEAMS[k] || { abbr: k?.substring(0,3) || '?', name: k || '?' }
  const color = TEAM_COLORS[k] || '#444'

  if (url && ok) {
    return (
      <img
        src={url}
        alt={t.name}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setOk(false)}
        style={{
          width: size, height: size,
          objectFit: 'contain', flexShrink: 0,
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,.6))',
        }}
      />
    )
  }

  // Fallback: colored circle with abbreviation
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.3), fontWeight: 800, color: '#fff',
      flexShrink: 0, letterSpacing: '-.03em',
      border: '1.5px solid rgba(255,255,255,.15)',
    }}>{t.abbr?.substring(0,3)}</div>
  )
}

// backward compat
export const Crest = TeamLogo

const T_STYLES = {
  SL:   { bg:'rgba(240,192,64,.18)',  c:'#f0c040', border:'rgba(240,192,64,.4)' },
  UCL:  { bg:'rgba(91,163,245,.18)',  c:'#5ba3f5', border:'rgba(91,163,245,.4)' },
  UEL:  { bg:'rgba(245,115,58,.18)',  c:'#f5733a', border:'rgba(245,115,58,.4)' },
  UECL: { bg:'rgba(63,214,138,.18)', c:'#3fd68a', border:'rgba(63,214,138,.4)' },
}
export function TPill({ id, size = 'sm' }) {
  const s = T_STYLES[id] || T_STYLES.SL
  return (
    <span style={{
      fontSize: size === 'lg' ? 11 : 9, fontWeight: 700,
      padding: size === 'lg' ? '3px 10px' : '2px 7px', borderRadius: 6,
      background: s.bg, color: s.c, border: `1px solid ${s.border}`,
      letterSpacing: '.06em', textTransform: 'uppercase',
    }}>{id}</span>
  )
}

export function PtsBadge({ pts, compact }) {
  const map = {
    2: { bg:'rgba(0,255,136,.15)',  c:'#00ff88', border:'rgba(0,255,136,.35)',  label: compact?'+2':'🎯 2pts' },
    1: { bg:'rgba(255,221,0,.15)',  c:'#ffdd00', border:'rgba(255,221,0,.35)',  label: compact?'+1':'✓ 1pt' },
    0: { bg:'rgba(255,255,255,.06)',c:'#ffffff50',border:'rgba(255,255,255,.1)',label: compact?'0':'✗ 0pts' },
  }
  const s = map[pts] ?? map[0]
  return (
    <span style={{
      fontSize: compact ? 10 : 11, fontWeight: 700,
      padding: compact ? '1px 5px' : '2px 8px', borderRadius: 6,
      background: s.bg, color: s.c, border: `1px solid ${s.border}`,
      marginLeft: compact ? 4 : 5, fontVariantNumeric: 'tabular-nums',
    }}>{s.label}</span>
  )
}

export function ScorePill({ h, a, pending }) {
  if (pending) return (
    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
      <span style={{ fontSize:20, fontWeight:900, color:'#ffffff25', fontVariantNumeric:'tabular-nums' }}>?</span>
      <span style={{ fontSize:13, color:'#ffffff15' }}>:</span>
      <span style={{ fontSize:20, fontWeight:900, color:'#ffffff25', fontVariantNumeric:'tabular-nums' }}>?</span>
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
      <span style={{ fontSize:24, fontWeight:900, color:'#fff', fontVariantNumeric:'tabular-nums', lineHeight:1 }}>{h}</span>
      <span style={{ fontSize:15, color:'#ffffff45', margin:'0 2px' }}>:</span>
      <span style={{ fontSize:24, fontWeight:900, color:'#fff', fontVariantNumeric:'tabular-nums', lineHeight:1 }}>{a}</span>
    </div>
  )
}

export function Spinner({ size = 20 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid rgba(255,255,255,.1)`,
      borderTopColor: 'rgba(255,255,255,.6)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }}/>
  )
}

export function Card({ children, glow, style: sx }) {
  return (
    <div style={{
      background: '#111318',
      border: glow ? `1px solid ${glow}44` : '1px solid rgba(255,255,255,.08)',
      borderRadius: 12, padding: '14px 16px', marginBottom: 10,
      boxShadow: glow ? `0 0 24px ${glow}12` : 'none',
      ...sx,
    }}>{children}</div>
  )
}

export function SLbl({ children, accent }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
      textTransform: 'uppercase', color: accent || 'rgba(255,255,255,.4)',
      marginBottom: 10,
    }}>{children}</div>
  )
}
