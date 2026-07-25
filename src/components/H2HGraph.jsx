import { useState, useEffect, useRef } from 'react'
import { ALL_FIXTURES, PLAYERS, PLAYER_NAMES, PCOL, scoreMatch } from '../lib/data'

const PC = {
  boikos:        { color: '#ffdd00', glow: '#ffdd0060' },
  mavromichalis: { color: '#4d9fff', glow: '#4d9fff60' },
  chousiadas:    { color: '#ff6b35', glow: '#ff6b3560' },
}

// Build timeline: cumulative pts per player after each played match
function buildTimeline(predictions, results) {
  const played = ALL_FIXTURES
    .filter(m => results?.[m.id] != null)
    .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))

  if (!played.length) return { events: [], maxPts: 0 }

  let cum = { boikos: 0, mavromichalis: 0, chousiadas: 0 }
  const events = played.map(m => {
    const actual = results[m.id]
    PLAYERS.forEach(p => {
      const pred = predictions?.[m.id]?.[p]
      const sc = pred ? scoreMatch(pred, actual) : null
      cum[p] += sc?.points ?? 0
    })
    return {
      id: m.id,
      label: matchLabel(m),
      pts: { ...cum },
      scores: Object.fromEntries(PLAYERS.map(p => {
        const pred = predictions?.[m.id]?.[p]
        const sc = pred ? scoreMatch(pred, actual) : null
        return [p, { pred, sc }]
      })),
      actual,
      home: m.home, away: m.away,
    }
  })

  const maxPts = Math.max(...PLAYERS.map(p => cum[p]), 2)
  return { events, maxPts, final: cum }
}

function matchLabel(m) {
  const t = { OLY:'Ολυμ', AEK:'ΑΕΚ', PAOK:'ΠΑΟΚ', PAO:'ΠΑΟ', ARI:'Άρης',
    ATR:'Ατρ', KIF:'Κηφ', LEV:'Λεβ', OFI:'ΟΦΗ', PNE:'Παν', VOL:'Βόλ',
    KAL:'Καλ', IRA:'Ηρακ', AST:'Αστ', DYN:'Dyn', NEC:'NEC', PKS:'Pks' }
  return `${t[m.home]||m.home} vs ${t[m.away]||m.away}`
}

export default function H2HGraph({ predictions, results }) {
  const { events, maxPts, final } = buildTimeline(predictions, results)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const svgRef = useRef()

  if (!events.length) return (
    <div style={{ background: '#111318', border: '1px solid #ffffff0e', borderRadius: 16,
      padding: '32px 20px', textAlign: 'center', marginBottom: 12 }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff60', marginBottom: 6 }}>
        Δεν υπάρχουν αγώνες ακόμα
      </div>
      <div style={{ fontSize: 12, color: '#ffffff35' }}>
        Το γράφημα εξέλιξης εμφανίζεται μόλις καταχωρηθεί το πρώτο αποτέλεσμα
      </div>
    </div>
  )

  const W = 340, H = 200
  const PAD = { top: 20, right: 16, bottom: 36, left: 28 }
  const gW = W - PAD.left - PAD.right
  const gH = H - PAD.top - PAD.bottom

  // Add a "start" point at 0
  const allPoints = [{ pts: { boikos: 0, mavromichalis: 0, chousiadas: 0 }, label: 'Start' }, ...events]
  const N = allPoints.length - 1
  
  const xFor = i => PAD.left + (i / Math.max(N, 1)) * gW
  const yFor = v => PAD.top + gH - (v / maxPts) * gH

  // Build SVG path for each player
  const pathFor = p => {
    return allPoints.map((ev, i) => {
      const x = xFor(i)
      const y = yFor(ev.pts[p] ?? 0)
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    }).join(' ')
  }

  // Smooth curve using cubic bezier
  const smoothPath = p => {
    const pts = allPoints.map((ev, i) => ({ x: xFor(i), y: yFor(ev.pts[p] ?? 0) }))
    if (pts.length < 2) return `M ${pts[0]?.x} ${pts[0]?.y}`
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]
      const curr = pts[i]
      const cpx = (prev.x + curr.x) / 2
      d += ` C ${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`
    }
    return d
  }

  const hovered = hoveredIdx !== null ? allPoints[hoveredIdx + 1] : null
  const leader = final ? PLAYERS.reduce((a, b) => (final[a] >= final[b] ? a : b)) : null

  // Gap analysis
  const gaps = events.length > 0 && final ? (() => {
    const sorted = [...PLAYERS].sort((a,b) => final[b] - final[a])
    const gap01 = final[sorted[0]] - final[sorted[1]]
    const gap12 = final[sorted[1]] - final[sorted[2]]
    return { sorted, gap01, gap12 }
  })() : null

  return (
    <div style={{ background: '#111318', border: '1px solid #ffffff0e', borderRadius: 16,
      padding: '16px', marginBottom: 12, overflow: 'hidden' }}>

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#e8e9ef', letterSpacing: '-.01em' }}>
            Εξέλιξη Διαγωνισμού
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#ffffff45', marginTop: 2 }}>
            {events.length} αγώνες · σωρευτικοί πόντοι
          </div>
        </div>
        {leader && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
            background: `${PC[leader].color}15`, border: `1px solid ${PC[leader].color}35`,
            borderRadius: 20 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: PC[leader].color,
              boxShadow: `0 0 6px ${PC[leader].color}` }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: PC[leader].color }}>
              {PLAYER_NAMES[leader]} leads
            </span>
          </div>
        )}
      </div>

      {/* Player legend */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {PLAYERS.map(p => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="24" height="10">
              <line x1="0" y1="5" x2="24" y2="5" stroke={PC[p].color} strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="12" cy="5" r="3" fill={PC[p].color}/>
            </svg>
            <span style={{ fontSize: 10, fontWeight: 700, color: PC[p].color, letterSpacing: '.02em' }}>
              {PLAYER_NAMES[p].toUpperCase().split('.')[0]}
            </span>
            {final && (
              <span style={{ fontSize: 11, fontWeight: 900, color: PC[p].color, fontVariantNumeric: 'tabular-nums' }}>
                {final[p]}p
              </span>
            )}
          </div>
        ))}
      </div>

      {/* SVG Chart */}
      <div style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            {PLAYERS.map(p => (
              <linearGradient key={p} id={`grad-${p}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PC[p].color} stopOpacity="0.25"/>
                <stop offset="100%" stopColor={PC[p].color} stopOpacity="0"/>
              </linearGradient>
            ))}
            {PLAYERS.map(p => (
              <filter key={`glow-${p}`} id={`glow-${p}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            ))}
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(f => {
            const y = PAD.top + gH * (1 - f)
            const val = Math.round(f * maxPts)
            return (
              <g key={f}>
                <line x1={PAD.left} y1={y} x2={PAD.left + gW} y2={y}
                  stroke="#ffffff08" strokeWidth="1" strokeDasharray="3,4"/>
                <text x={PAD.left - 5} y={y + 4} textAnchor="end"
                  fontSize="8" fill="#ffffff35" fontFamily="'Space Grotesk',sans-serif">{val}</text>
              </g>
            )
          })}

          {/* X axis labels */}
          {allPoints.map((ev, i) => i > 0 && (
            <text key={i} x={xFor(i)} y={H - 4} textAnchor="middle"
              fontSize="7.5" fill="#ffffff30" fontFamily="'Space Grotesk',sans-serif"
              style={{ cursor: 'default' }}>
              {i}
            </text>
          ))}

          {/* Area fills */}
          {PLAYERS.map(p => {
            const pts = allPoints.map((ev, i) => ({ x: xFor(i), y: yFor(ev.pts[p] ?? 0) }))
            const bottomY = PAD.top + gH
            let areaD = `M ${pts[0].x} ${bottomY} L ${pts[0].x} ${pts[0].y}`
            for (let i = 1; i < pts.length; i++) {
              const prev = pts[i-1], curr = pts[i]
              const cpx = (prev.x + curr.x) / 2
              areaD += ` C ${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`
            }
            areaD += ` L ${pts[pts.length-1].x} ${bottomY} Z`
            return <path key={p} d={areaD} fill={`url(#grad-${p})`}/>
          })}

          {/* Lines */}
          {PLAYERS.map(p => (
            <path key={p} d={smoothPath(p)} fill="none"
              stroke={PC[p].color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              filter={`url(#glow-${p})`}/>
          ))}

          {/* Hover interaction zones */}
          {events.map((_, i) => (
            <rect key={i}
              x={xFor(i) + (xFor(i+1)-xFor(i))/2 - (xFor(1)-xFor(0))/2}
              y={PAD.top} width={xFor(1)-xFor(0)} height={gH}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setHoveredIdx(i)}
            />
          ))}

          {/* Hover line + dots */}
          {hovered && hoveredIdx !== null && (() => {
            const xi = xFor(hoveredIdx + 1)
            return (
              <g>
                <line x1={xi} y1={PAD.top} x2={xi} y2={PAD.top + gH}
                  stroke="#ffffff25" strokeWidth="1" strokeDasharray="3,3"/>
                {PLAYERS.map(p => {
                  const y = yFor(hovered.pts[p] ?? 0)
                  return (
                    <g key={p}>
                      <circle cx={xi} cy={y} r="6" fill={PC[p].color} fillOpacity="0.2"/>
                      <circle cx={xi} cy={y} r="3.5" fill={PC[p].color}
                        style={{ filter: `drop-shadow(0 0 4px ${PC[p].color})` }}/>
                    </g>
                  )
                })}
              </g>
            )
          })()}

          {/* End dots (always) */}
          {final && PLAYERS.map(p => {
            const x = xFor(allPoints.length - 1)
            const y = yFor(final[p])
            return (
              <g key={p}>
                <circle cx={x} cy={y} r="5" fill={PC[p].color} fillOpacity="0.2"/>
                <circle cx={x} cy={y} r="3" fill={PC[p].color}/>
              </g>
            )
          })}
        </svg>

        {/* Hover tooltip */}
        {hovered && (
          <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
            background: '#0d0f14', border: '1px solid #ffffff18', borderRadius: 10,
            padding: '8px 12px', minWidth: 180, pointerEvents: 'none', zIndex: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,.5)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#ffffff60',
              marginBottom: 7, letterSpacing: '.06em', textTransform: 'uppercase' }}>
              {hovered.label}
              {hovered.actual && ` · ${hovered.actual.h}–${hovered.actual.a}`}
            </div>
            {PLAYERS.map(p => {
              const d = hovered.scores?.[p]
              return (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: PC[p].color,
                    boxShadow: `0 0 5px ${PC[p].color}`, flexShrink: 0 }}/>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#e8e9ef', flex: 1 }}>
                    {PLAYER_NAMES[p].split('.')[0]}
                  </span>
                  <span style={{ fontSize: 11, color: '#ffffff50', fontVariantNumeric: 'tabular-nums' }}>
                    {d?.pred ? `${d.pred.h}–${d.pred.a}` : '–'}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: PC[p].color,
                    fontVariantNumeric: 'tabular-nums' }}>
                    {hovered.pts[p]}p
                  </span>
                  {d?.sc && <span style={{ fontSize: 10, color: d.sc.points===2?'#00ff88':d.sc.points===1?'#ffdd00':'#ffffff30' }}>
                    {d.sc.points===2?'🎯':d.sc.points===1?'✓':'✗'}
                  </span>}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Match index legend */}
      <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
        {events.map((ev, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4,
            padding: '2px 7px', background: hoveredIdx===i?'#ffffff12':'#ffffff06',
            borderRadius: 5, cursor: 'pointer', border: `1px solid ${hoveredIdx===i?'#ffffff25':'transparent'}`,
            transition: 'all .15s' }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}>
            <span style={{ fontSize: 9, fontWeight: 800, color: '#ffffff40' }}>{i+1}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: '#ffffff60' }}>{ev.label}</span>
          </div>
        ))}
      </div>

      {/* Gap analysis bar */}
      {gaps && (
        <div style={{ marginTop: 14, padding: '10px 12px', background: '#0d0f14',
          borderRadius: 10, border: '1px solid #ffffff0a' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#ffffff40',
            letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 8 }}>
            Διαφορές · Τρέχουσα Κατάσταση
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {gaps.sorted.map((p, rank) => {
              const maxP = final[gaps.sorted[0]]
              const pct = maxP > 0 ? (final[p] / maxP) * 100 : 0
              return (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: ['#ffdd00','#aaaaaa','#cd7f32'][rank],
                    width: 16, textAlign: 'center' }}>{['1','2','3'][rank]}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: PC[p].color, width: 70, flexShrink: 0 }}>
                    {PLAYER_NAMES[p].split('.')[0]}
                  </span>
                  <div style={{ flex: 1, height: 6, background: '#ffffff08', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: PC[p].color,
                      borderRadius: 3, transition: 'width 1s ease',
                      boxShadow: `0 0 8px ${PC[p].glow}` }}/>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 900, color: PC[p].color,
                    width: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {final[p]}
                  </span>
                  {rank > 0 && (
                    <span style={{ fontSize: 10, color: '#ff4d6d', fontWeight: 700, width: 28, flexShrink: 0 }}>
                      -{final[gaps.sorted[0]]-final[p]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Dramatic tension message */}
          {(() => {
            const [first, second, third] = gaps.sorted
            const d01 = final[first] - final[second]
            const d12 = final[second] - final[third]
            if (d01 === 0) return <div style={{ fontSize: 11, fontWeight: 700, color: '#ffdd00', marginTop: 8, textAlign: 'center' }}>🔥 ΙΣΟΒΑΘΜΟΙ ΣΤΗΝ ΚΟΡΥΦΗ!</div>
            if (d01 === 1) return <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', marginTop: 8, textAlign: 'center' }}>⚡ Μόνο 1 πόντος διαφορά στην κορυφή!</div>
            if (d12 === 0) return <div style={{ fontSize: 11, fontWeight: 700, color: '#4d9fff', marginTop: 8, textAlign: 'center' }}>⚔️ Ο {PLAYER_NAMES[second].split('.')[0]} & {PLAYER_NAMES[third].split('.')[0]} ισόβαθμοι!</div>
            return null
          })()}
        </div>
      )}
    </div>
  )
}
