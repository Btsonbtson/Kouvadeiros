import { useState, useRef } from 'react'
import { ALL_FIXTURES, PLAYERS, PLAYER_NAMES, scoreMatch } from '../lib/data'

const PC = {
  boikos:        { color:'#ff2244', glow:'#ff224460', area:'#ff224420' },
  mavromichalis: { color:'#4d9fff', glow:'#4d9fff60', area:'#4d9fff20' },
  chousiadas:    { color:'#ff6b35', glow:'#ff6b3560', area:'#ff6b3520' },
}

function buildTimeline(predictions, results) {
  const played = ALL_FIXTURES
    .filter(m => results?.[m.id] != null)
    .sort((a,b) => new Date(a.kickoff) - new Date(b.kickoff))
  if (!played.length) return { events:[], maxPts:0 }
  let cum = { boikos:0, mavromichalis:0, chousiadas:0 }
  const events = played.map(m => {
    const actual = results[m.id]
    const matchT = m.home.substring(0,3)+' vs '+m.away.substring(0,3)
    PLAYERS.forEach(p => {
      const sc = scoreMatch(predictions?.[m.id]?.[p], actual)
      cum[p] += sc?.points ?? 0
    })
    return { id:m.id, label:matchT, pts:{...cum},
      scores: Object.fromEntries(PLAYERS.map(p=>[p,{
        pred:predictions?.[m.id]?.[p],
        sc:scoreMatch(predictions?.[m.id]?.[p],actual)
      }])), actual }
  })
  const maxPts = Math.max(...PLAYERS.map(p=>cum[p]), 2)
  return { events, maxPts, final:cum }
}

// SVG burger — scales with league progress
function BurgerBg({ progress, W, H }) {
  const cx = W*0.72, cy = H*0.5
  const base = Math.max(40, Math.min(130, 40 + progress * 110))
  const bw = base*1.4, bh = base
  const op = 0.06 + progress * 0.1

  return (
    <g opacity={op} style={{pointerEvents:'none'}}>
      {/* Top bun */}
      <ellipse cx={cx} cy={cy - bh*0.35} rx={bw*0.52} ry={bh*0.28} fill="#c8860a"/>
      <ellipse cx={cx} cy={cy - bh*0.42} rx={bw*0.44} ry={bh*0.18} fill="#e8a020"/>
      {/* Sesame seeds */}
      {[[0,-0.5],[0.25,-0.45],[-0.2,-0.47],[0.1,-0.38],[-0.15,-0.35]].map(([dx,dy],i)=>(
        <ellipse key={i} cx={cx+dx*bw*0.55} cy={cy+dy*bh} rx={bw*0.03} ry={bw*0.015} fill="#fff" opacity="0.5"/>
      ))}
      {/* Cheese */}
      <rect x={cx-bw*0.52} y={cy-bh*0.1} width={bw*1.04} height={bh*0.12} rx={3} fill="#f5c518"/>
      {/* Patty */}
      <rect x={cx-bw*0.5} y={cy+bh*0.04} width={bw} height={bh*0.18} rx={5} fill="#7a3a0a"/>
      <rect x={cx-bw*0.48} y={cy+bh*0.05} width={bw*0.96} height={bh*0.08} rx={3} fill="#5a2a06"/>
      {/* Lettuce */}
      {[-0.4,-0.2,0,0.2,0.4].map((dx,i)=>(
        <ellipse key={i} cx={cx+dx*bw*0.45} cy={cy+bh*0.24} rx={bw*0.15} ry={bh*0.07} fill="#2d8a2d"/>
      ))}
      {/* Tomato */}
      <rect x={cx-bw*0.46} y={cy+bh*0.32} width={bw*0.92} height={bh*0.1} rx={4} fill="#cc2200"/>
      {/* Bottom bun */}
      <ellipse cx={cx} cy={cy+bh*0.48} rx={bw*0.52} ry={bh*0.16} fill="#c8860a"/>
      <ellipse cx={cx} cy={cy+bh*0.52} rx={bw*0.48} ry={bh*0.09} fill="#e8a020"/>
    </g>
  )
}

export default function H2HGraph({ predictions, results }) {
  const { events, maxPts, final } = buildTimeline(predictions, results)
  const [hovIdx, setHovIdx] = useState(null)

  const totalMatches = ALL_FIXTURES.length
  const progress = events.length / Math.max(totalMatches, 1)

  if (!events.length) return (
    <div style={{background:'#111318',border:'1px solid #ffffff0e',borderRadius:16,padding:'32px 20px',textAlign:'center',marginBottom:12}}>
      <div style={{fontSize:48,marginBottom:12}}>🍔</div>
      <div style={{fontSize:14,fontWeight:700,color:'#ffffff50',marginBottom:6}}>Το γράφημα εξέλιξης εμφανίζεται μόλις αρχίσουν οι αγώνες</div>
      <div style={{fontSize:12,color:'#ffffff30'}}>Το burger μεγαλώνει καθώς προχωρά η σεζόν...</div>
    </div>
  )

  const W=380, H=210
  const PAD={top:22,right:20,bottom:38,left:30}
  const gW=W-PAD.left-PAD.right, gH=H-PAD.top-PAD.bottom
  const allPts=[{pts:{boikos:0,mavromichalis:0,chousiadas:0}},...events]
  const N=allPts.length-1
  const xFor=i=>PAD.left+(i/Math.max(N,1))*gW
  const yFor=v=>PAD.top+gH-(v/maxPts)*gH

  const smoothPath=p=>{
    const pts=allPts.map((ev,i)=>({x:xFor(i),y:yFor(ev.pts[p]??0)}))
    if(pts.length<2) return `M${pts[0].x} ${pts[0].y}`
    let d=`M${pts[0].x} ${pts[0].y}`
    for(let i=1;i<pts.length;i++){
      const prev=pts[i-1],curr=pts[i],cpx=(prev.x+curr.x)/2
      d+=` C${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`
    }
    return d
  }

  const areaPath=p=>{
    const pts=allPts.map((ev,i)=>({x:xFor(i),y:yFor(ev.pts[p]??0)}))
    const bot=PAD.top+gH
    let d=`M${pts[0].x} ${bot} L${pts[0].x} ${pts[0].y}`
    for(let i=1;i<pts.length;i++){
      const prev=pts[i-1],curr=pts[i],cpx=(prev.x+curr.x)/2
      d+=` C${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`
    }
    d+=` L${pts[pts.length-1].x} ${bot} Z`
    return d
  }

  const leader=final?PLAYERS.reduce((a,b)=>final[a]>=final[b]?a:b):null
  const hovered=hovIdx!==null?allPts[hovIdx+1]:null
  const gaps=final?[...PLAYERS].sort((a,b)=>final[b]-final[a]):[]

  return (
    <div style={{background:'#111318',border:'1px solid #ffffff0e',borderRadius:16,padding:'14px 14px 10px',marginBottom:12,overflow:'hidden'}}>
      {/* Title */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:'#e8e9ef'}}>Εξέλιξη Διαγωνισμού <span style={{fontSize:16}}>🍔</span></div>
          <div style={{fontSize:10,fontWeight:600,color:'#ffffff40',marginTop:1}}>{events.length} αγώνες · σωρευτικοί πόντοι</div>
        </div>
        {leader&&<div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',background:`${PC[leader].area}`,border:`1px solid ${PC[leader].glow}`,borderRadius:20}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:PC[leader].color,boxShadow:`0 0 6px ${PC[leader].color}`}}/>
          <span style={{fontSize:11,fontWeight:800,color:PC[leader].color}}>{PLAYER_NAMES[leader]} leads</span>
        </div>}
      </div>

      {/* Legend */}
      <div style={{display:'flex',gap:14,marginBottom:10,flexWrap:'wrap'}}>
        {PLAYERS.map(p=>(
          <div key={p} style={{display:'flex',alignItems:'center',gap:6}}>
            <svg width="22" height="8"><line x1="0" y1="4" x2="22" y2="4" stroke={PC[p].color} strokeWidth="2.5" strokeLinecap="round"/><circle cx="11" cy="4" r="2.5" fill={PC[p].color}/></svg>
            <span style={{fontSize:10,fontWeight:700,color:PC[p].color}}>{PLAYER_NAMES[p].toUpperCase().split('')[0]+PLAYER_NAMES[p].split('')[0].toLowerCase()}</span>
            {final&&<span style={{fontSize:11,fontWeight:900,color:PC[p].color}}>{final[p]}p</span>}
          </div>
        ))}
      </div>

      {/* SVG Chart */}
      <div style={{position:'relative',cursor:'crosshair'}}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block',overflow:'visible'}}
          onMouseLeave={()=>setHovIdx(null)}>
          <defs>
            {PLAYERS.map(p=><linearGradient key={p} id={`ag-${p}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PC[p].color} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={PC[p].color} stopOpacity="0.02"/>
            </linearGradient>)}
            {PLAYERS.map(p=><filter key={`gl-${p}`} id={`gl-${p}`}>
              <feGaussianBlur stdDeviation="2" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>)}
          </defs>

          {/* Grid */}
          {[0,0.25,0.5,0.75,1].map(f=>{
            const y=PAD.top+gH*(1-f), val=Math.round(f*maxPts)
            return <g key={f}>
              <line x1={PAD.left} y1={y} x2={PAD.left+gW} y2={y} stroke="#ffffff08" strokeWidth="1" strokeDasharray="3,4"/>
              <text x={PAD.left-5} y={y+4} textAnchor="end" fontSize="8" fill="#ffffff30" fontFamily="'Space Grotesk',sans-serif">{val}</text>
            </g>
          })}

          {/* 🍔 Burger watermark — grows with season progress */}
          <BurgerBg progress={progress} W={W} H={H}/>

          {/* Areas */}
          {PLAYERS.map(p=><path key={p} d={areaPath(p)} fill={`url(#ag-${p})`}/>)}

          {/* Lines */}
          {PLAYERS.map(p=><path key={p} d={smoothPath(p)} fill="none" stroke={PC[p].color} strokeWidth="2.5" strokeLinecap="round" filter={`url(#gl-${p})`}/>)}

          {/* Hover zones */}
          {events.map((_,i)=>{
            const x0=i===0?PAD.left:(xFor(i)+xFor(i-1))/2
            const x1=i===N-1?PAD.left+gW:(xFor(i)+xFor(i+1))/2
            return <rect key={i} x={x0} y={PAD.top} width={x1-x0} height={gH} fill="transparent"
              onMouseEnter={()=>setHovIdx(i)}/>
          })}

          {/* Hover line */}
          {hovered&&hovIdx!==null&&<>
            <line x1={xFor(hovIdx+1)} y1={PAD.top} x2={xFor(hovIdx+1)} y2={PAD.top+gH} stroke="#ffffff25" strokeWidth="1" strokeDasharray="3,3"/>
            {PLAYERS.map(p=>{
              const y=yFor(hovered.pts[p]??0)
              return <g key={p}>
                <circle cx={xFor(hovIdx+1)} cy={y} r="5" fill={PC[p].color} fillOpacity="0.2"/>
                <circle cx={xFor(hovIdx+1)} cy={y} r="3" fill={PC[p].color} style={{filter:`drop-shadow(0 0 3px ${PC[p].color})`}}/>
              </g>
            })}
          </>}

          {/* End dots */}
          {final&&PLAYERS.map(p=>{
            const x=xFor(N),y=yFor(final[p])
            return <g key={p}><circle cx={x} cy={y} r="4" fill={PC[p].color} fillOpacity="0.25"/><circle cx={x} cy={y} r="2.5" fill={PC[p].color}/></g>
          })}

          {/* X labels */}
          {events.map((_,i)=><text key={i} x={xFor(i+1)} y={H-6} textAnchor="middle" fontSize="8" fill="#ffffff28" fontFamily="'Space Grotesk',sans-serif">{i+1}</text>)}
        </svg>

        {/* Tooltip */}
        {hovered&&<div style={{position:'absolute',top:4,left:'50%',transform:'translateX(-50%)',background:'#0d0f14',border:'1px solid #ffffff18',borderRadius:10,padding:'8px 12px',minWidth:170,pointerEvents:'none',zIndex:10,boxShadow:'0 8px 24px rgba(0,0,0,.5)'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#ffffff50',marginBottom:6,letterSpacing:'.06em',textTransform:'uppercase'}}>{hovered.label} · {hovered.actual?.h}–{hovered.actual?.a}</div>
          {PLAYERS.map(p=>{const d=hovered.scores?.[p];return(
            <div key={p} style={{display:'flex',alignItems:'center',gap:7,marginBottom:4}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:PC[p].color,flexShrink:0}}/>
              <span style={{fontSize:11,fontWeight:600,color:'#e8e9ef',flex:1}}>{PLAYER_NAMES[p]}</span>
              <span style={{fontSize:10,color:'#ffffff45'}}>{d?.pred?`${d.pred.h}–${d.pred.a}`:'–'}</span>
              <span style={{fontSize:11,fontWeight:800,color:PC[p].color}}>{hovered.pts[p]}p</span>
              {d?.sc&&<span style={{fontSize:10,color:d.sc.points===2?'#00ff88':d.sc.points===1?'#ffdd00':'#ffffff30'}}>{d.sc.points===2?'🎯':d.sc.points===1?'✓':'✗'}</span>}
            </div>
          )})}
        </div>}
      </div>

      {/* Match pills */}
      <div style={{marginTop:8,display:'flex',flexWrap:'wrap',gap:'3px 8px'}}>
        {events.map((ev,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:4,padding:'2px 7px',background:hovIdx===i?'#ffffff12':'#ffffff06',borderRadius:5,cursor:'pointer',border:`1px solid ${hovIdx===i?'#ffffff22':'transparent'}`,transition:'all .12s'}}
            onMouseEnter={()=>setHovIdx(i)} onMouseLeave={()=>setHovIdx(null)}>
            <span style={{fontSize:9,fontWeight:800,color:'#ffffff35'}}>{i+1}</span>
            <span style={{fontSize:9,fontWeight:600,color:'#ffffff55'}}>{ev.label}</span>
          </div>
        ))}
      </div>

      {/* Gap bar */}
      {final&&<div style={{marginTop:10,padding:'10px 12px',background:'#0d0f14',borderRadius:10,border:'1px solid #ffffff08'}}>
        <div style={{fontSize:9,fontWeight:700,color:'#ffffff35',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:8}}>ΤΡΕΧΟΥΣΑ ΚΑΤΑΣΤΑΣΗ</div>
        {gaps.map((p,rank)=>{const maxP=final[gaps[0]],pct=maxP>0?(final[p]/maxP)*100:0;return(
          <div key={p} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <span style={{fontSize:11,fontWeight:700,color:['#ffdd00','#aaa','#cd7f32'][rank],width:14,textAlign:'center'}}>{rank+1}</span>
            <span style={{fontSize:11,fontWeight:700,color:PC[p].color,width:72,flexShrink:0}}>{PLAYER_NAMES[p]}</span>
            <div style={{flex:1,height:5,background:'#ffffff08',borderRadius:3}}>
              <div style={{height:'100%',width:`${pct}%`,background:PC[p].color,borderRadius:3,boxShadow:`0 0 6px ${PC[p].glow}`,transition:'width 1s ease'}}/>
            </div>
            <span style={{fontSize:13,fontWeight:900,color:PC[p].color,width:22,textAlign:'right'}}>{final[p]}</span>
            {rank>0&&<span style={{fontSize:10,color:'#ff4d6d',fontWeight:700,width:22,flexShrink:0}}>-{final[gaps[0]]-final[p]}</span>}
          </div>
        )})}
        {/* Tension message */}
        {(()=>{
          const d01=final[gaps[0]]-final[gaps[1]]
          if(d01===0) return <div style={{fontSize:11,fontWeight:700,color:'#ffdd00',textAlign:'center',marginTop:6}}>🔥 ΙΣΟΒΑΘΜΟΙ ΣΤΗΝ ΚΟΡΥΦΗ!</div>
          if(d01===1) return <div style={{fontSize:11,fontWeight:700,color:'#ff6b35',textAlign:'center',marginTop:6}}>⚡ Μόνο 1 πόντος διαφορά! To burger παίζει!</div>
          if(progress>0.5&&d01<=3) return <div style={{fontSize:11,fontWeight:700,color:'#4d9fff',textAlign:'center',marginTop:6}}>🍔 Μέση σεζόν — το burger είναι ακόμα διακύβευμα!</div>
          return null
        })()}
      </div>}
    </div>
  )
}
