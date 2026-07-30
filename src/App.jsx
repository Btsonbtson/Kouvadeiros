// KOUVADEIROS v7 — build 2026-07-26
import { useState, useEffect, useRef, useCallback } from 'react'
import { api, clearAuth, storeUser } from './lib/api'
import {
  ALL_FIXTURES, SUPER_LEAGUE, UEFA_FIXTURES,
  TEAMS, PLAYERS, PLAYER_NAMES, PCOL,
  scoreMatch, computeLeaderboard,
  grTime, grDate, isToday, isLocked, nowGR,
} from './lib/data'
import { TeamLogo, TPill, PtsBadge, ScorePill, Card, SLbl, Spinner } from './components/UI'
import H2HGraph from './components/H2HGraph'
import Guide from './pages/Guide'



// ─── TOKENS ──────────────────────────────────────────────────────────────────
const BG='#08090d', SURF='#111318', SURF2='#0d0f14', LINE='rgba(255,255,255,.08)'
const MUTED='rgba(255,255,255,.4)', DIM='rgba(255,255,255,.22)', TEXT='rgba(255,255,255,.92)'
const GREEN='#00ff88', GOLD='#ffdd00', RED='#ff4d6d', BLUE='#4d9fff', ORA='#ff6b35'
const PC={boikos:{p:'#ff2244',bg:'rgba(255,34,68,.15)',b:'rgba(255,34,68,.35)'},
          mavromichalis:{p:'#4d9fff',bg:'rgba(77,159,255,.12)',b:'rgba(77,159,255,.3)'},
          chousiadas:{p:'#ff6b35',bg:'rgba(255,107,53,.12)',b:'rgba(255,107,53,.3)'}}
const MEDALS=['🥇','🥈','🥉']

// Odds for each game (manual, update as needed)
const ODDS = {
  'uel-paok-1':  {h:3.1, d:3.3, a:2.1},
  'uel-paok-2':  {h:2.0, d:3.4, a:3.5},
  'uecl-pao-1':  {h:4.2, d:3.5, a:1.7},
  'uecl-pao-2':  {h:1.6, d:3.6, a:5.0},
  'ucl-oly-1':   {h:1.9, d:3.4, a:3.8},
  'ucl-oly-2':   {h:2.8, d:3.3, a:2.4},
  'ucl-aek-1':   {h:2.1, d:3.4, a:3.2},
  'ucl-aek-2':   {h:2.8, d:3.3, a:2.4},
  'sl-1-1':      {h:1.7, d:3.5, a:5.0},
  'sl-1-2':      {h:2.4, d:3.2, a:2.8},
  'sl-1-3':      {h:1.4, d:4.2, a:7.5},
  'sl-1-4':      {h:1.5, d:3.8, a:6.5},
  'sl-1-5':      {h:2.2, d:3.3, a:3.1},
  'sl-1-6':      {h:1.6, d:3.5, a:5.5},
  'sl-1-7':      {h:2.0, d:3.4, a:3.6},
}

const SEEDED_PREDS={
  'uel-paok-1':{boikos:{h:2,a:1,qual:'DYN'},mavromichalis:{h:0,a:0,qual:'DYN'},chousiadas:{h:2,a:1,qual:'DYN'}},
  'uecl-pao-1':{boikos:{h:0,a:3,qual:'PAO'},mavromichalis:{h:0,a:1,qual:'PAO'},chousiadas:{h:1,a:2,qual:'PAO'}},
}
const SEEDED_RES={'uel-paok-1':{h:2,a:3},'uecl-pao-1':{h:1,a:2}}

function isUEFATie(id){return UEFA_FIXTURES.some(f=>f.id===id)}

// ─── FETCH BTN ────────────────────────────────────────────────────────────────
function FetchBtn({matchId,onFetched}){
  const [st,setSt]=useState('idle')
  async function go(){setSt('loading');try{const r=await api.fetchScores(matchId);setSt(r.ok?'done':'pending');if(r.ok)onFetched?.()}catch{setSt('error')}}
  const cfg={idle:{bg:'rgba(77,159,255,.12)',c:BLUE,b:'rgba(77,159,255,.3)',i:'ti-world-search',l:'Update Score'},
             loading:{bg:'rgba(255,255,255,.06)',c:MUTED,b:LINE,i:'ti-loader-2',l:'...'},
             done:{bg:'rgba(0,255,136,.12)',c:GREEN,b:'rgba(0,255,136,.3)',i:'ti-check',l:'Updated ✓'},
             pending:{bg:'rgba(255,221,0,.12)',c:GOLD,b:'rgba(255,221,0,.3)',i:'ti-clock',l:'Not yet'},
             error:{bg:'rgba(255,77,109,.12)',c:RED,b:'rgba(255,77,109,.3)',i:'ti-alert-circle',l:'Error'}}[st]
  return <button onClick={go} disabled={st==='loading'||st==='done'} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'8px 10px',borderRadius:8,border:`1px solid ${cfg.b}`,background:cfg.bg,color:cfg.c,fontSize:11,fontWeight:700,cursor:'pointer',letterSpacing:'.02em'}}>
    <i className={`ti ${cfg.i}`} style={{fontSize:13,animation:st==='loading'?'spin .7s linear infinite':undefined}}/>{cfg.l}
  </button>
}

// ─── PUSH RESULT ──────────────────────────────────────────────────────────────
function PushPanel({match,result,onSaved}){
  const [h,setH]=useState(result?.h??0),[a,setA]=useState(result?.a??0)
  const [ot,setOt]=useState(false),[otH,setOtH]=useState(0),[otA,setOtA]=useState(0)
  const [pen,setPen]=useState(false),[penH,setPenH]=useState(0),[penA,setPenA]=useState(0)
  const [saving,setSaving]=useState(false),[saved,setSaved]=useState(false)
  const adj=(v,set,d)=>set(Math.max(0,Math.min(9,v+d)))
  const nb={background:SURF2,border:`1px solid ${LINE}`,borderRadius:9,width:42,height:42,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:800,fontVariantNumeric:'tabular-nums'}
  const ab=(w=30)=>({width:w,height:w,borderRadius:7,border:`1px solid ${LINE}`,background:'rgba(255,255,255,.06)',color:TEXT,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'})
  const NumRow=({label,hv,setHv,av,setAv})=><div style={{marginBottom:10}}>
    {label&&<div style={{fontSize:10,fontWeight:700,color:MUTED,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:6}}>{label}</div>}
    <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:6}}>
      <div style={{display:'flex',alignItems:'center',gap:5,justifyContent:'center'}}>
        <button style={ab()} onClick={()=>adj(hv,setHv,-1)}>–</button>
        <div style={nb}>{hv}</div>
        <button style={ab()} onClick={()=>adj(hv,setHv,+1)}>+</button>
      </div>
      <span style={{fontSize:16,color:DIM,textAlign:'center'}}>–</span>
      <div style={{display:'flex',alignItems:'center',gap:5,justifyContent:'center'}}>
        <button style={ab()} onClick={()=>adj(av,setAv,-1)}>–</button>
        <div style={nb}>{av}</div>
        <button style={ab()} onClick={()=>adj(av,setAv,+1)}>+</button>
      </div>
    </div>
  </div>
  async function save(){setSaving(true);try{await api.saveResult(match.id,h,a,ot,otH,otA,pen,penH,penA);setSaved(true);setTimeout(()=>setSaved(false),2000);onSaved?.()}catch{}finally{setSaving(false)}}
  return <div style={{background:SURF2,borderRadius:10,padding:'14px',marginTop:8,border:`1px solid ${LINE}`}}>
    <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:MUTED,marginBottom:12}}>Εισαγωγή Αποτελέσματος</div>
    <NumRow label="90'" hv={h} setHv={setH} av={a} setAv={setA}/>
    {match.leg===2&&<>
      <label style={{display:'flex',alignItems:'center',gap:8,fontSize:12,fontWeight:600,cursor:'pointer',color:GOLD,marginBottom:ot?10:0,marginTop:6}}>
        <input type="checkbox" checked={ot} onChange={e=>setOt(e.target.checked)} style={{width:15,height:15,accentColor:GOLD}}/>⏱ Παρατάσεις (AET)
      </label>
      {ot&&<NumRow label="Σκορ AET" hv={otH} setHv={setOtH} av={otA} setAv={setOtA}/>}
      {ot&&<label style={{display:'flex',alignItems:'center',gap:8,fontSize:12,fontWeight:600,cursor:'pointer',color:GREEN,marginTop:4,marginBottom:pen?10:0}}>
        <input type="checkbox" checked={pen} onChange={e=>setPen(e.target.checked)} style={{width:15,height:15,accentColor:GREEN}}/>⚽ Πέναλτι
      </label>}
      {ot&&pen&&<NumRow label="Σκορ Pen" hv={penH} setHv={setPenH} av={penA} setAv={setPenA}/>}
    </>}
    <button onClick={save} disabled={saving||saved} style={{width:'100%',padding:'10px',borderRadius:9,border:'none',background:saved?GREEN:'rgba(26,92,56,.9)',color:saved?SURF:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginTop:10,transition:'all .2s'}}>
      <i className={`ti ${saved?'ti-check':saving?'ti-loader-2':'ti-send'}`} style={{fontSize:15,animation:saving?'spin .7s linear infinite':undefined}}/>
      {saved?'Αποθηκεύτηκε!':saving?'Αποστολή…':'Push Result'}
    </button>
  </div>
}

// ─── ODDS DISPLAY ────────────────────────────────────────────────────────────
function OddsRow({matchId}){
  const odds=ODDS[matchId]
  if(!odds) return null
  const best=Math.max(odds.h,odds.d,odds.a)
  const pill=(label,val)=>{
    const hot=val===best
    return <div style={{flex:1,textAlign:'center',background:hot?'rgba(0,255,136,.1)':'rgba(255,255,255,.04)',borderRadius:8,padding:'6px 4px',border:`1px solid ${hot?'rgba(0,255,136,.3)':LINE}`}}>
      <div style={{fontSize:9,fontWeight:700,color:MUTED,letterSpacing:'.05em',marginBottom:3}}>{label}</div>
      <div style={{fontSize:14,fontWeight:800,color:hot?GREEN:TEXT,fontVariantNumeric:'tabular-nums'}}>{val.toFixed(2)}</div>
    </div>
  }
  return <div style={{marginTop:8}}>
    <div style={{fontSize:9,fontWeight:700,color:DIM,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:5}}>Αποδόσεις</div>
    <div style={{display:'flex',gap:5}}>
      {pill('1 (Γηπεδ.)',odds.h)}
      {pill('X (Ισοπαλία)',odds.d)}
      {pill('2 (Φιλοξ.)',odds.a)}
    </div>
  </div>
}

// ─── MATCH CARD ───────────────────────────────────────────────────────────────

function H2HChart({predictions,results}){
  const played=[...ALL_FIXTURES].filter(m=>results?.[m.id]!=null)
    .sort((a,b)=>new Date(a.kickoff)-new Date(b.kickoff))

  if(played.length===0) return(
    <div style={{padding:'40px 20px',textAlign:'center'}}>
      <div style={{fontSize:32,marginBottom:12}}>⚡</div>
      <div style={{fontSize:14,fontWeight:700,color:TEXT,marginBottom:6}}>Η μάχη δεν έχει αρχίσει</div>
      <div style={{fontSize:12,color:MUTED}}>Αποτελέσματα σε εξέλιξη — το γράφημα θα ζωντανέψει σύντομα</div>
    </div>
  )

  // Build cumulative points per player after each match
  const timeline=[]
  const running={boikos:0,mavromichalis:0,chousiadas:0}
  played.forEach(m=>{
    const actual=results[m.id]
    PLAYERS.forEach(p=>{
      const sc=scoreMatch(predictions?.[m.id]?.[p],actual)
      running[p]+=(sc?.points||0)
    })
    timeline.push({
      match:m,
      pts:{...running},
      label: TEAMS[m.home]?.abbr+'–'+TEAMS[m.away]?.abbr,
    })
  })

  const maxPts=Math.max(...PLAYERS.map(p=>running[p]),1)
  const W=320,H=180,PAD={t:20,r:16,b:36,l:28}
  const cw=W-PAD.l-PAD.r,ch=H-PAD.t-PAD.b
  const n=timeline.length

  function px(i){return PAD.l+(i/(Math.max(n-1,1)))*cw}
  function py(pts){return PAD.t+ch-(pts/maxPts)*ch}

  // Sparkline path
  function path(p){
    const pts=[{x:PAD.l,y:PAD.t+ch},...timeline.map((t,i)=>({x:px(i),y:py(t.pts[p])}))]
    return pts.map((pt,i)=>i===0?`M${pt.x},${pt.y}`:`L${pt.x},${pt.y}`).join(' ')
  }
  function areaPath(p){
    const pts=[{x:PAD.l,y:PAD.t+ch},...timeline.map((t,i)=>({x:px(i),y:py(t.pts[p])})),{x:px(n-1),y:PAD.t+ch}]
    return pts.map((pt,i)=>i===0?`M${pt.x},${pt.y}`:`L${pt.x},${pt.y}`).join(' ')+'Z'
  }

  const leader=PLAYERS.reduce((a,b)=>running[a]>=running[b]?a:b)
  const sorted=[...PLAYERS].sort((a,b)=>running[b]-running[a])

  return(
    <div style={{background:SURF,border:`1px solid ${LINE}`,borderRadius:14,overflow:'hidden',marginBottom:12}}>
      {/* Header */}
      <div style={{padding:'14px 16px 12px',borderBottom:`1px solid ${LINE}`}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:TEXT,marginBottom:2}}>Εξέλιξη Αγώνα</div>
            <div style={{fontSize:10,color:MUTED}}>Σωρευτικοί πόντοι · {played.length} αγ</div>
          </div>
          {/* Live standings */}
          <div style={{display:'flex',gap:6}}>
            {sorted.map((p,i)=><div key={p} style={{display:'flex',alignItems:'center',gap:5,background:PC[p].bg,border:`1px solid ${PC[p].b}`,borderRadius:20,padding:'4px 10px'}}>
              <span style={{fontSize:12}}>{MEDALS[i]}</span>
              <span style={{fontSize:11,fontWeight:800,color:PC[p].p,fontVariantNumeric:'tabular-nums'}}>{running[p]}p</span>
            </div>)}
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{padding:'8px 4px 0'}}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
          <defs>
            {PLAYERS.map(p=><linearGradient key={p} id={`g-${p}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PC[p].p} stopOpacity={0.25}/>
              <stop offset="100%" stopColor={PC[p].p} stopOpacity={0.0}/>
            </linearGradient>)}
          </defs>

          {/* Grid lines */}
          {[0,.25,.5,.75,1].map(frac=>{
            const y=PAD.t+ch-(frac*ch)
            return <g key={frac}>
              <line x1={PAD.l} y1={y} x2={W-PAD.r} y2={y} stroke="rgba(255,255,255,.07)" strokeWidth={1}/>
              <text x={PAD.l-4} y={y+4} fontSize={7} fill="rgba(255,255,255,.3)" textAnchor="end">{Math.round(frac*maxPts)}</text>
            </g>
          })}

          {/* Event separators + labels */}
          {timeline.map((t,i)=><g key={i}>
            <line x1={px(i)} y1={PAD.t} x2={px(i)} y2={PAD.t+ch} stroke="rgba(255,255,255,.05)" strokeWidth={1} strokeDasharray="2,3"/>
            <text x={px(i)} y={H-4} fontSize={7} fill="rgba(255,255,255,.35)" textAnchor="middle"
              style={{fontSize:n>6?6:7}}>{t.label}</text>
          </g>)}

          {/* Area fills */}
          {PLAYERS.map(p=><path key={`area-${p}`} d={areaPath(p)} fill={`url(#g-${p})`}/>)}

          {/* Lines */}
          {PLAYERS.map(p=><path key={`line-${p}`} d={path(p)} fill="none" stroke={PC[p].p}
            strokeWidth={p===leader?2.5:1.5} strokeLinejoin="round" strokeLinecap="round"
            style={{filter:p===leader?`drop-shadow(0 0 3px ${PC[p].p})`:'none'}}/>)}

          {/* Dots at each match event */}
          {timeline.map((t,i)=>PLAYERS.map(p=>{
            const isLdr=t.pts[p]===Math.max(...PLAYERS.map(q=>t.pts[q]))
            return <circle key={`${p}-${i}`} cx={px(i)} cy={py(t.pts[p])} r={i===n-1?4:isLdr?3.5:2.5}
              fill={PC[p].p} stroke={i===n-1?SURF:BG} strokeWidth={1.5}
              style={{filter:i===n-1?`drop-shadow(0 0 4px ${PC[p].p})`:'none'}}/>
          }))}
        </svg>
      </div>

      {/* Legend */}
      <div style={{display:'flex',justifyContent:'center',gap:16,padding:'8px 16px 14px'}}>
        {PLAYERS.map(p=><div key={p} style={{display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:20,height:3,borderRadius:2,background:PC[p].p,boxShadow:`0 0 4px ${PC[p].p}`}}/>
          <span style={{fontSize:10,fontWeight:600,color:MUTED}}>{PLAYER_NAMES[p]}</span>
        </div>)}
      </div>

      {/* Gap drama row */}
      {n>=2&&<div style={{borderTop:`1px solid ${LINE}`,padding:'10px 16px',display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none',msOverflowStyle:'none'}}>
        {sorted.slice(1).map(p=>{
          const gap=running[sorted[0]]-running[p]
          return <div key={p} style={{fontSize:11,fontWeight:600,color:MUTED,display:'flex',alignItems:'center',gap:5,whiteSpace:'nowrap'}}>
            <span style={{color:PC[p].p,fontWeight:800}}>{PLAYER_NAMES[p]}</span>
            <span style={{color:RED,fontWeight:700}}>–{gap}pts</span>
            <span style={{color:DIM}}>πίσω</span>
          </div>
        })}
        <div style={{marginLeft:'auto',fontSize:11,fontWeight:700,color:PC[leader].p,whiteSpace:'nowrap'}}>
          👑 {PLAYER_NAMES[leader]} leads
        </div>
      </div>}
    </div>
  )
}


// ─── RIVALRY STATS (clean rewrite) ───────────────────────────────────────────
function RivalryStats({predictions,results,thavmaStats}){
  try{
    const played=ALL_FIXTURES.filter(m=>results?.[m.id]!=null)
    if(!played.length) return(
      <div style={{padding:24,background:SURF,borderRadius:12,border:'1px solid '+LINE,textAlign:'center',color:MUTED,fontSize:13}}>
        Δεν υπάρχουν δεδομένα ακόμα — παίξτε μερικούς αγώνες! 🍔
      </div>
    )

    // ── Compute all stats ──────────────────────────────────────────────────
    const oracle={boikos:0,mavromichalis:0,chousiadas:0}
    const contrarian={boikos:0,mavromichalis:0,chousiadas:0}
    // 1v2: each player vs the other two when they agree
    const oneVsTwo={
      boikos:        {wins:0,losses:0,draws:0,battles:0},
      mavromichalis: {wins:0,losses:0,draws:0,battles:0},
      chousiadas:    {wins:0,losses:0,draws:0,battles:0},
    }
    let allSame=0,allSameRight=0,allDiff=0
    const allDiffWins=[0,0,0]
    const h2h={}
    for(let i=0;i<PLAYERS.length;i++) for(let j=i+1;j<PLAYERS.length;j++)
      h2h[i+'_'+j]={wins:[0,0,0],diff:0,names:[PLAYER_NAMES[PLAYERS[i]],PLAYER_NAMES[PLAYERS[j]]],colors:[PC[PLAYERS[i]].p,PC[PLAYERS[j]].p]}

    played.forEach(m=>{
      const actual=results[m.id]
      const preds=PLAYERS.map(p=>predictions?.[m.id]?.[p])
      if(preds.some(p=>!p)) return
      const scores=PLAYERS.map((p,i)=>scoreMatch(preds[i],actual))
      const pts=scores.map(s=>s?.points??0)
      const res3=preds.map(pr=>pr.h>pr.a?'H':pr.h<pr.a?'A':'D')

      // Consensus
      if(new Set(res3).size===1){allSame++;if(pts.some(p=>p>0))allSameRight++}
      // Free for all
      if(new Set(res3).size===3){allDiff++;pts.forEach((p,i)=>{if(p>0)allDiffWins[i]++})}

      // H2H
      for(let i=0;i<PLAYERS.length;i++) for(let j=i+1;j<PLAYERS.length;j++){
        const key=i+'_'+j
        if(res3[i]!==res3[j]){
          h2h[key].diff++
          if(pts[i]>pts[j])h2h[key].wins[0]++
          else if(pts[j]>pts[i])h2h[key].wins[1]++
          else h2h[key].wins[2]++
        }
      }

      // Oracle & Maverick
      const exactPs=PLAYERS.filter((_,i)=>scores[i]?.exact)
      if(exactPs.length===1) oracle[exactPs[0]]++
      PLAYERS.forEach((p,i)=>{
        const others=PLAYERS.filter((_,j)=>j!==i)
        const otherPreds=others.map(o=>predictions?.[m.id]?.[o])
        const otherRes=otherPreds.map(op=>op?(op.h>op.a?'H':op.h<op.a?'A':'D'):null)
        if(otherRes[0]&&otherRes.every(r=>r===otherRes[0])&&res3[i]!==otherRes[0]){
          contrarian[p]++
          // 1v2: the lone player vs the pair
          const myPts=pts[i]
          const theirPts=Math.max(...others.map((_,k)=>pts[PLAYERS.indexOf(others[k])]))
          oneVsTwo[p].battles++
          if(myPts>theirPts) oneVsTwo[p].wins++
          else if(myPts<theirPts) oneVsTwo[p].losses++
          else oneVsTwo[p].draws++
        }
      })
    })

    const oLdr=PLAYERS.reduce((a,b)=>oracle[a]>=oracle[b]?a:b)
    const cLdr=PLAYERS.reduce((a,b)=>contrarian[a]>=contrarian[b]?a:b)

    const MiniBar=({val,max,color,label})=>(
      <div style={{marginBottom:8}}>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,fontWeight:600,marginBottom:3}}>
          <span style={{color:MUTED}}>{label}</span>
          <span style={{color}}>{max>0?Math.round(val/max*100)+'%':'-'} ({val}/{max})</span>
        </div>
        <div style={{height:5,background:'rgba(255,255,255,.08)',borderRadius:3}}>
          <div style={{height:'100%',width:max>0?Math.round(val/max*100)+'%':'0%',background:color,borderRadius:3}}/>
        </div>
      </div>
    )

    const Block=({title,emoji,children,accent})=>(
      <div style={{background:SURF,border:'1px solid '+(accent||LINE),borderRadius:12,padding:'14px 16px',marginBottom:10}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:12,display:'flex',alignItems:'center',gap:7}}>
          <span style={{fontSize:18}}>{emoji}</span><span style={{color:TEXT}}>{title}</span>
        </div>
        {children}
      </div>
    )

    // 1v2 config
    const oneVsTwoConfig=[
      {player:'boikos',        title:'Μπόικος vs. Συνεταιράκια',      subtitle:'Όταν ο Μπόικος διαφωνεί με Μαυρομιχάλη & Χουσιάδα'},
      {player:'mavromichalis', title:'Μαύρος - Ενάντια στην Λογική',  subtitle:'Όταν ο Μαυρομιχάλης διαφωνεί με Μπόικο & Χουσιάδα'},
      {player:'chousiadas',    title:'Χουσιάδας vs. Μπαρμπάδες',      subtitle:'Όταν ο Χουσιάδας διαφωνεί με Μπόικο & Μαυρομιχάλη'},
    ]

    return(
      <div>

        {/* ── ΘΑΥΜΑΤΑ / ΩΣΑΝΑ — TOP ── */}
        <Block title="⚡ Θαύματα & Ωσάννα — Late Goal Drama" emoji="🙏" accent="rgba(255,221,0,.2)">
          <div style={{fontSize:11,color:MUTED,marginBottom:12}}>Πόντοι που χαρίστηκαν από γκολ μετά το 85'</div>
          {PLAYERS.map(p=>{
            const ts=(thavmaStats&&thavmaStats[p])||{benefited:0,pts_gained:0,pts_lost:{}}
            const totalLost=Object.values(ts.pts_lost||{}).reduce((a,b)=>a+b,0)
            const pc2=PC[p]
            return(
              <div key={p} style={{marginBottom:8,background:'rgba(255,255,255,.03)',borderRadius:10,padding:'10px 12px',border:'1px solid '+LINE}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:pc2.p}}/>
                  <span style={{fontSize:12,fontWeight:700,color:TEXT,flex:1}}>{PLAYER_NAMES[p]}</span>
                  <span style={{fontSize:11,color:GREEN,fontWeight:700}}>🍀 {ts.benefited||0}x +{ts.pts_gained||0}p</span>
                  <span style={{fontSize:11,color:RED,fontWeight:700}}>😤 -{totalLost}p</span>
                </div>
                <div style={{height:4,background:'rgba(255,255,255,.06)',borderRadius:2}}>
                  <div style={{height:'100%',width:Math.min(100,(ts.pts_gained||0)*25)+'%',background:pc2.p,borderRadius:2}}/>
                </div>
              </div>
            )
          })}
        </Block>

        {/* ── ΕΝΑΣ ΕΝΑΝΤΙΟΝ 2 ── */}
        <Block title="1 vs 2 — Ο Μοναχικός Λύκος" emoji="🐺">
          <div style={{fontSize:11,color:MUTED,marginBottom:12}}>Όταν ένας διαφωνεί με τους άλλους δύο που συμφωνούν μεταξύ τους — ποιος κερδίζει;</div>
          {oneVsTwoConfig.map(cfg=>{
            const st=oneVsTwo[cfg.player]
            const pc2=PC[cfg.player]
            const winPct=st.battles>0?Math.round(st.wins/st.battles*100):0
            return(
              <div key={cfg.player} style={{background:'rgba(255,255,255,.04)',borderRadius:12,padding:'12px 14px',marginBottom:10,border:'1px solid '+pc2.b}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <div style={{width:32,height:32,borderRadius:'50%',background:pc2.p,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,color:'#08090d'}}>{PLAYER_NAMES[cfg.player][0]}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:800,color:pc2.p}}>{cfg.title}</div>
                    <div style={{fontSize:9,color:MUTED,marginTop:1}}>{cfg.subtitle}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:22,fontWeight:900,color:winPct>=50?GREEN:RED}}>{winPct}%</div>
                    <div style={{fontSize:9,color:MUTED}}>{st.battles} battles</div>
                  </div>
                </div>
                {st.battles>0&&<>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginBottom:8}}>
                    {[
                      {lbl:'Νίκες',val:st.wins,color:GREEN},
                      {lbl:'Ισοπαλίες',val:st.draws,color:GOLD},
                      {lbl:'Ήττες',val:st.losses,color:RED},
                    ].map(s=>(
                      <div key={s.lbl} style={{background:'rgba(255,255,255,.04)',borderRadius:8,padding:'6px',textAlign:'center'}}>
                        <div style={{fontSize:18,fontWeight:900,color:s.color}}>{s.val}</div>
                        <div style={{fontSize:9,color:MUTED,marginTop:1}}>{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{height:5,background:'rgba(255,255,255,.06)',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:winPct+'%',background:winPct>=50?GREEN:RED,borderRadius:3,transition:'width 1s'}}/>
                  </div>
                </>}
                {st.battles===0&&<div style={{fontSize:11,color:MUTED,textAlign:'center',padding:'8px 0'}}>Δεν υπάρχουν battles ακόμα</div>}
              </div>
            )
          })}
        </Block>

        {/* ── H2H ── */}
        <Block title="Head to Head — Όταν διαφωνούν" emoji="⚔️">
          {Object.entries(h2h).map(([key,data])=>(
            <div key={key} style={{marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:700,color:MUTED,marginBottom:7,textTransform:'uppercase'}}>{data.names[0]} vs {data.names[1]} · {data.diff} battles</div>
              <MiniBar val={data.wins[0]} max={data.diff} color={data.colors[0]} label={data.names[0]}/>
              <MiniBar val={data.wins[1]} max={data.diff} color={data.colors[1]} label={data.names[1]}/>
              {data.wins[2]>0&&<div style={{fontSize:10,color:DIM,marginTop:3}}>Ισόπαλα: {data.wins[2]}</div>}
            </div>
          ))}
        </Block>

        {/* ── CONSENSUS ── */}
        <Block title="Consensus — Και οι 3 ίδια" emoji="🤝">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div style={{background:'rgba(255,255,255,.04)',borderRadius:10,padding:'12px',textAlign:'center'}}>
              <div style={{fontSize:28,fontWeight:900,color:TEXT}}>{allSame}</div>
              <div style={{fontSize:11,color:MUTED,marginTop:2}}>Φορές συμφώνησαν</div>
            </div>
            <div style={{background:allSame>0&&allSameRight===0?'rgba(255,77,109,.1)':'rgba(0,255,136,.06)',borderRadius:10,padding:'12px',textAlign:'center'}}>
              <div style={{fontSize:28,fontWeight:900,color:allSame>0&&allSameRight===0?RED:GREEN}}>{allSame>0?Math.round(allSameRight/allSame*100):0}%</div>
              <div style={{fontSize:11,color:MUTED,marginTop:2}}>Ακρίβεια</div>
            </div>
          </div>
          {allSame>0&&allSameRight===0&&<div style={{fontSize:12,fontWeight:700,color:RED,textAlign:'center',marginTop:10}}>💀 Όταν συμφωνούν... πάντα λάθος!</div>}
        </Block>

        {/* ── FREE FOR ALL ── */}
        <Block title="Free For All — Όλοι διαφωνούν" emoji="🔀">
          <div style={{fontSize:12,color:MUTED,marginBottom:10}}>{allDiff} αγώνες · ποιος κερδίζει;</div>
          {PLAYERS.map((p,i)=><MiniBar key={p} val={allDiffWins[i]} max={allDiff} color={PC[p].p} label={PLAYER_NAMES[p]}/>)}
        </Block>

        {/* ── ORACLE ── */}
        <Block title="The Oracle — Μοναδικό exact score" emoji="🔮">
          <div style={{display:'flex',gap:6}}>
            {PLAYERS.map(p=>{const isL=oracle[p]>0&&p===oLdr,pc2=PC[p];return(
              <div key={p} style={{flex:1,background:isL?pc2.bg:'rgba(255,255,255,.04)',border:'1px solid '+(isL?pc2.b:LINE),borderRadius:10,padding:'12px 8px',textAlign:'center'}}>
                <div style={{fontSize:10,fontWeight:700,color:isL?pc2.p:MUTED,marginBottom:4}}>{PLAYER_NAMES[p].substring(0,4).toUpperCase()}</div>
                <div style={{fontSize:26,fontWeight:900,color:isL?pc2.p:MUTED}}>{oracle[p]}</div>
                {isL&&oracle[p]>0&&<div style={{fontSize:11,marginTop:4}}>🔮</div>}
              </div>
            )})}
          </div>
        </Block>

        {/* ── MAVERICK ── */}
        <Block title="The Maverick — Διαφώνησε & είχε δίκιο" emoji="🌶️">
          <div style={{display:'flex',gap:6}}>
            {PLAYERS.map(p=>{const isL=contrarian[p]>0&&p===cLdr,pc2=PC[p];return(
              <div key={p} style={{flex:1,background:isL?pc2.bg:'rgba(255,255,255,.04)',border:'1px solid '+(isL?pc2.b:LINE),borderRadius:10,padding:'12px 8px',textAlign:'center'}}>
                <div style={{fontSize:10,fontWeight:700,color:isL?pc2.p:MUTED,marginBottom:4}}>{PLAYER_NAMES[p].substring(0,4).toUpperCase()}</div>
                <div style={{fontSize:26,fontWeight:900,color:isL?pc2.p:MUTED}}>{contrarian[p]}</div>
                {isL&&contrarian[p]>0&&<div style={{fontSize:11,marginTop:4}}>🌶️</div>}
              </div>
            )})}
          </div>
        </Block>

      </div>
    )
  }catch(e){
    return <div style={{padding:24,background:'rgba(255,77,109,.1)',border:'1px solid rgba(255,77,109,.3)',borderRadius:12,color:RED,fontSize:12,fontWeight:600}}>
      ❌ Σφάλμα: {e.message}
    </div>
  }
}

function LeaderHero({board,maxPts}){
  if(!board?.length)return null
  const [first,...rest]=board
  return <div style={{marginBottom:16}}>
    <div style={{background:`linear-gradient(135deg,${PC[first.player].bg},${SURF})`,border:`1px solid ${PC[first.player].b}`,borderRadius:16,padding:'20px 18px',marginBottom:8,position:'relative',overflow:'hidden',boxShadow:`0 0 30px ${PC[first.player].p}15`}}>
      <div style={{position:'absolute',right:-10,top:-20,fontSize:120,fontWeight:900,color:'rgba(255,255,255,.03)',lineHeight:1}}>1</div>
      <div style={{display:'flex',alignItems:'center',gap:14,position:'relative'}}>
        <div style={{position:'relative'}}>
          <div style={{width:56,height:56,borderRadius:'50%',background:PC[first.player].p,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:900,color:SURF,boxShadow:`0 0 20px ${PC[first.player].p}50`}}>
            {PLAYER_NAMES[first.player].substring(0,1)}</div>
          <div style={{position:'absolute',bottom:-2,right:-2,fontSize:14}}>🥇</div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:PC[first.player].p,marginBottom:3}}>LEADER</div>
          <div style={{fontSize:22,fontWeight:700,color:TEXT,letterSpacing:'-.01em'}}>{PLAYER_NAMES[first.player]}</div>
          <div style={{fontSize:11,color:MUTED,fontWeight:500,marginTop:2}}>{first.exact} exact · {first.correct} correct · {first.played} games</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:44,fontWeight:900,color:PC[first.player].p,lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{first.pts}</div>
          <div style={{fontSize:11,color:MUTED,fontWeight:600}}>{maxPts>0?`/ ${maxPts} pts`:'pts'}</div>
        </div>
      </div>
      {maxPts>0&&<div style={{marginTop:14}}>
        <div style={{height:4,background:'rgba(255,255,255,.1)',borderRadius:2,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${Math.round(first.pts/maxPts*100)}%`,background:`linear-gradient(90deg,${PC[first.player].p},${PC[first.player].p}88)`,borderRadius:2}}/>
        </div>
        <div style={{fontSize:10,color:MUTED,marginTop:4,textAlign:'right',fontWeight:600}}>{Math.round(first.pts/maxPts*100)}% of maximum</div>
      </div>}
    </div>
    {rest.map((row,i)=>{const pc=PC[row.player],gap=first.pts-row.pts;return <div key={row.player} style={{background:SURF,border:`1px solid ${LINE}`,borderRadius:12,padding:'13px 16px',marginBottom:6,display:'flex',alignItems:'center',gap:12}}>
      <span style={{fontSize:22}}>{['🥈','🥉'][i]}</span>
      <div style={{width:38,height:38,borderRadius:'50%',background:pc.p,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:800,color:SURF}}>{PLAYER_NAMES[row.player].substring(0,1)}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:700,color:TEXT}}>{PLAYER_NAMES[row.player]}</div>
        <div style={{fontSize:10,color:MUTED,marginTop:1}}>{row.exact} exact · {row.correct} correct</div>
      </div>
      <div style={{textAlign:'right',marginRight:8}}>
        <div style={{fontSize:22,fontWeight:800,color:pc.p,fontVariantNumeric:'tabular-nums'}}>{row.pts}</div>
        {gap>0&&<div style={{fontSize:10,color:RED,fontWeight:700}}>–{gap} pts</div>}
      </div>
      {first.pts>0&&<div style={{width:44}}>
        <div style={{height:4,background:'rgba(255,255,255,.08)',borderRadius:2}}>
          <div style={{height:'100%',width:`${Math.round(row.pts/first.pts*100)}%`,background:pc.p,borderRadius:2}}/>
        </div>
        <div style={{fontSize:9,color:MUTED,marginTop:2,textAlign:'right',fontWeight:700}}>{Math.round(row.pts/first.pts*100)}%</div>
      </div>}
    </div>})}
  </div>
}

// ─── PREDICT CARD ─────────────────────────────────────────────────────────────

function HistoryPage({predictions,results}){
  const played=[...ALL_FIXTURES].filter(m=>results?.[m.id]!=null).sort((a,b)=>new Date(b.kickoff)-new Date(a.kickoff))
  return <div style={{padding:'16px 16px 80px'}}>
    <SLbl>Αποτελέσματα · {played.length} αγώνες</SLbl>
    {!played.length&&<div style={{textAlign:'center',padding:40,color:MUTED,fontSize:13}}>Δεν υπάρχουν αποτελέσματα ακόμα</div>}
    {played.map(m=>{
      const actual=results[m.id]
      return <div key={m.id} style={{background:SURF,border:`1px solid ${LINE}`,borderRadius:12,padding:'14px 16px',marginBottom:10}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:3}}><TPill id={m.t}/><span style={{fontSize:10,fontWeight:600,color:MUTED}}>{grDate(m.kickoff)}</span></div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'10px 0 12px'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}><TeamLogo k={m.home} size={26}/><span style={{fontSize:12,fontWeight:700}}>{TEAMS[m.home]?.name}</span></div>
          <span style={{fontSize:20,fontWeight:900,fontVariantNumeric:'tabular-nums'}}>{actual.h} – {actual.a}</span>
          <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:12,fontWeight:700}}>{TEAMS[m.away]?.name}</span><TeamLogo k={m.away} size={26}/></div>
        </div>
        <div style={{display:'flex',gap:5}}>
          {PLAYERS.map(p=>{const pred=predictions?.[m.id]?.[p],sc=pred?scoreMatch(pred,actual):null,pc=PC[p];return <div key={p} style={{flex:1,background:sc?.exact?`${GREEN}12`:sc?.correct?`${GOLD}08`:'rgba(255,255,255,.04)',borderRadius:9,padding:'8px',textAlign:'center',border:`1px solid ${sc?.exact?GREEN+'35':sc?.correct?GOLD+'20':LINE}`}}>
            <div style={{fontSize:10,fontWeight:800,color:pc.p,marginBottom:3,letterSpacing:'.04em'}}>{PLAYER_NAMES[p].substring(0,4).toUpperCase()}</div>
            <div style={{fontSize:13,fontWeight:800,color:TEXT,fontVariantNumeric:'tabular-nums'}}>{pred?`${pred.h}–${pred.a}`:'–'}</div>
            {sc&&<div style={{fontSize:11,fontWeight:700,color:sc.points===2?GREEN:sc.points===1?GOLD:DIM,marginTop:2}}>{sc.points===2?'🎯':sc.points===1?'✓':'✗'}{sc.points}p</div>}
          </div>})}
        </div>
      </div>
    })}
  </div>
}

function BanterPage({chat,onSend,onRead}){
  const [txt,setTxt]=useState('');const ref=useRef()
  useEffect(()=>{ref.current?.scrollIntoView({behavior:'smooth'});onRead?.()},[chat])
  function send(){if(!txt.trim())return;onSend(txt);setTxt('')}
  return <div style={{display:'flex',flexDirection:'column',height:'calc(100svh - 114px)'}}>
    <div style={{padding:'10px 16px',borderBottom:`1px solid ${LINE}`,background:'#0a0b0f'}}>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:MUTED}}>Kouvadeiros FC · Ιερά Εξέταση</div>
    </div>
    <div style={{flex:1,padding:'14px 16px',overflowY:'auto',background:BG}}>
      {(chat||[]).map((m,i)=>{const pc=PC[m.p?.toLowerCase()]||PC.boikos;return <div key={i} style={{marginBottom:16,animation:'slide-up .15s ease'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
          <div style={{width:26,height:26,borderRadius:'50%',background:pc.p,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:BG}}>{m.p?.substring(0,1).toUpperCase()}</div>
          <span style={{fontSize:12,fontWeight:700,color:pc.p}}>{m.p}</span>
          {m.a&&<span style={{fontSize:9,fontWeight:700,background:`${GOLD}20`,color:GOLD,padding:'1px 6px',borderRadius:4,letterSpacing:'.04em'}}>ADMIN</span>}
          <span style={{fontSize:10,color:DIM,marginLeft:'auto',fontWeight:600}}>{m.ts}</span>
        </div>
        <div style={{fontSize:13,color:TEXT,lineHeight:1.5,paddingLeft:34,fontWeight:500}}>{m.t}</div>
      </div>})}
      <div ref={ref}/>
    </div>
    <div style={{padding:'10px 16px',borderTop:`1px solid ${LINE}`,display:'flex',gap:8,background:'#0a0b0f'}}>
      <input value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Πες κάτι..."
        style={{flex:1,background:SURF,border:`1px solid ${LINE}`,borderRadius:9,padding:'10px 14px',color:TEXT,fontSize:13,outline:'none',fontWeight:500}}/>
      <button onClick={send} style={{width:42,height:42,borderRadius:9,background:GREEN,border:'none',color:BG,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,fontWeight:700}}>↑</button>
    </div>
  </div>
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
// ─── ADD PLAYER MODAL ────────────────────────────────────────────────────────
function AddPlayerModal({ onClose, onAdded }) {
  const [name,  setName]  = useState('')
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const [phone, setPhone] = useState('+30')
  const [saving,setSaving]= useState(false)
  const [done,  setDone]  = useState(false)
  const inp = { width:'100%', padding:'10px 12px', background:'#0d0f14', border:`1px solid ${LINE}`,
    borderRadius:9, color:TEXT, fontSize:13, outline:'none', fontFamily:'inherit', marginBottom:10 }
  async function save() {
    if(!name||!email||!pass){return}
    setSaving(true)
    try {
      await api.addPlayer({name,email,password:pass,phone})
      setDone(true); setTimeout(()=>{onAdded?.();onClose()},1200)
    } catch(e){ alert('Error: '+e.message) }
    finally { setSaving(false) }
  }
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.8)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
      <div style={{ background:SURF,border:`1px solid ${LINE}`,borderRadius:16,padding:24,width:'100%',maxWidth:380 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18 }}>
          <div style={{ fontSize:15,fontWeight:800,color:TEXT }}>➕ Νέος Παίκτης</div>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',color:MUTED,fontSize:20 }}>✕</button>
        </div>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Όνομα (π.χ. Papadopoulos)" style={inp}/>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={inp}/>
        <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" style={inp}/>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+30 694 000 0000" style={inp}/>
        <button onClick={save} disabled={saving||done} style={{ width:'100%',padding:12,borderRadius:10,border:'none',
          background:done?'#00ff88':saving?'#ffffff15':'#1a5c38',color:done?'#08090d':'#fff',
          fontSize:14,fontWeight:700,cursor:'pointer',marginTop:4 }}>
          {done?'✓ Προστέθηκε!':saving?'Αποθήκευση…':'Προσθήκη Παίκτη'}
        </button>
      </div>
    </div>
  )
}


// ─── DESKTOP SIDEBAR ─────────────────────────────────────────────────────────
function LeaderSidebar({ predictions, results, compact }) {
  const board = computeLeaderboard(ALL_FIXTURES, predictions, results)
  const maxPts = ALL_FIXTURES.filter(m=>results?.[m.id]!=null).length*2
  // Compact horizontal strip for mobile
  if(compact) return (
    <div style={{display:'flex',gap:8,marginBottom:8}}>
      {board.map((row,i)=>{
        const pc2=PC[row.player]
        return <div key={row.player} style={{flex:1,background:SURF,border:`1px solid ${pc2.b}`,borderRadius:10,padding:'8px 10px',display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:13,fontWeight:700}}>{i===0?'🥇':i===1?'🥈':'🥉'}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,fontWeight:700,color:pc2.p,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{PLAYER_NAMES[row.player].substring(0,5)}</div>
            <div style={{fontSize:11,fontWeight:900,color:TEXT}}>{row.pts}p</div>
          </div>
        </div>
      })}
    </div>
  )

  return (
    <div>
      {/* Mini leaderboard */}
      <div style={{background:SURF,border:`1px solid ${LINE}`,borderRadius:14,padding:'14px 16px',marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:MUTED,marginBottom:12}}>Κατάταξη</div>
        {board.map((row,i)=>{
          const p=PC[row.player]
          return <div key={row.player} style={{display:'flex',alignItems:'center',gap:10,marginBottom:i<board.length-1?10:0}}>
            <span style={{fontSize:18,width:24,textAlign:'center'}}>{['🥇','🥈','🥉'][i]}</span>
            <div style={{width:32,height:32,borderRadius:'50%',background:p.p,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#08090d'}}>{PLAYER_NAMES[row.player].substring(0,1)}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:TEXT}}>{PLAYER_NAMES[row.player]}</div>
              <div style={{fontSize:10,color:MUTED}}>{row.exact}🎯 {row.correct}✓</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:20,fontWeight:900,color:p.p,fontVariantNumeric:'tabular-nums'}}>{row.pts}</div>
              <div style={{fontSize:9,color:MUTED}}>pts{maxPts>0?`/${maxPts}`:''}</div>
            </div>
          </div>
        })}
      </div>
      {/* Graph */}
      <H2HGraph predictions={predictions} results={results}/>
    </div>
  )
}

// ─── APP SHELL (RESPONSIVE) ─────────────────────────────────────────────────
const NAV=[
  {id:'matchday', l:'ΠΡΟΒΛΕΨΕΙΣ',      icon:'⚽'},
  {id:'schedule', l:'ΠΡΟΓΡΑΜΜΑ',       icon:'📅'},
  {id:'league',   l:'Διαγωνισμός',    icon:'🏆'},
  {id:'history',  l:'Ιστορικό',       icon:'📋'},
  {id:'banter',   l:'ΙΕΡΑ ΕΞΕΤΑΣΗ',   icon:'🔥'},
]

function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === 'undefined') return 'mobile'
    return window.innerWidth >= 1024 ? 'desktop' : window.innerWidth >= 768 ? 'tablet' : 'mobile'
  })
  useEffect(() => {
    const fn = () => setBp(window.innerWidth >= 1024 ? 'desktop' : window.innerWidth >= 768 ? 'tablet' : 'mobile')
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return bp
}

export default function App({ user, onLogout }) {
  const [screen,  setScreen]  = useState('matchday')
  const [state,   setState]   = useState({ predictions:{...SEEDED_PREDS}, results:{...SEEDED_RES}, chat:[], slStandings:[] })
  const [liveScores, setLiveScores] = useState({})
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncOk,  setSyncOk]  = useState(true)
  const [showGuide, setShowGuide] = useState(false)
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const poll = useRef()
  const bp   = useBreakpoint()
  const isDesktop = bp === 'desktop'
  const isTablet  = bp === 'tablet'
  const isMobile  = bp === 'mobile'

  const load = useCallback(async () => {
    try {
      const s = await api.getState()
      // Extract liveScores from state (Worker stores live_{matchId})
      const live={}
      Object.entries(s).forEach(([k,v])=>{
        if(k.startsWith('live_')&&v) live[k.replace('live_','')]=v
      })
      if(Object.keys(live).length>0) setLiveScores(live)
      setState({
        ...s,
        predictions:{ ...SEEDED_PREDS,...s.predictions,
          ...Object.fromEntries(Object.keys({...SEEDED_PREDS,...s.predictions}).map(mid=>[mid,{...(SEEDED_PREDS[mid]||{}),...(s.predictions[mid]||{})}])) },
        results:{ ...SEEDED_RES, ...s.results },
      })
      setSyncOk(true)
      // Also fetch SL standings (non-blocking)
      api.getSlStandings().then(d=>{
        if(d?.teams?.length) setState(prev=>({...prev,slStandings:d.teams}))
      }).catch(()=>{})
    } catch { setSyncOk(false) }
    finally { setLoading(false) }
  },[])

  useEffect(()=>{ load(); poll.current=setInterval(()=>{
      // Check if any match is live right now
      const now=Date.now()
      const anyLive=ALL_FIXTURES.some(m=>{
        const ko=new Date(m.kickoff).getTime()
        const minsAfter=(now-ko)/60000
        return minsAfter>=0&&minsAfter<=120
      })
      load()
      // Reschedule with appropriate interval
      clearInterval(poll.current)
      poll.current=setInterval(load,anyLive?5000:15000)
    },15000); return()=>clearInterval(poll.current) },[load])

  async function savePrediction(matchId,h,a,qual,predOT,otH,otA,predPen,penH,penA){
    setSyncing(true)
    try{
      await api.savePred(matchId,h,a,qual,predOT,otH,otA,predPen,penH,penA)
      setState(prev=>({...prev,predictions:{...prev.predictions,[matchId]:{...(prev.predictions[matchId]||{}),[user.id]:{h,a,qual,predOT,otH,otA,predPen,penH,penA}}}}))
      setSyncOk(true)
    }catch{setSyncOk(false);throw new Error('Save failed')}finally{setSyncing(false)}
  }

  async function sendChat(text){
    const msg={p:user.name,t:text,ts:nowGR(),a:user.id==='boikos'}
    setState(prev=>({...prev,chat:[...(prev.chat||[]),msg]}))
    try{await api.sendChat(text)}catch{}
  }

  async function handleLogout(){await api.logout();clearAuth();onLogout()}

  if(showGuide) return <Guide onBack={()=>setShowGuide(false)}/>

  if(loading) return(
    <div style={{minHeight:'100vh',background:BG,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <div style={{fontSize:24,fontWeight:800,letterSpacing:'.06em',color:GREEN}}>ΚΟΥΒΑΔΕΪΡΟΣ</div>
      <Spinner size={28}/>
    </div>
  )

  const pc = PC[user.id] || PC.boikos
  const pages={
    matchday:<MatchdayPage predictions={state.predictions} results={state.results} onRefresh={load} currentUser={user} revealed={state.revealed} onSave={savePrediction} liveScores={liveScores} slStandings={state.slStandings}/>,
    league:  <LeaguePage   predictions={state.predictions} results={state.results} thavmaStats={state.thavmaStats}/>,
    schedule: <SchedulePage slStandings={state.slStandings}/>,
    history: <HistoryPage  predictions={state.predictions} results={state.results}/>,
    banter:  <BanterPage   chat={state.chat} onSend={sendChat}/>,
  }

  // ── HEADER ───────────────────────────────────────────────────────────────────
  const Header = () => (
    <div style={{ background:'#0a0b0f', borderBottom:`1px solid ${LINE}`,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding: isDesktop ? '0 32px' : '0 16px',
      height: isDesktop ? 56 : 48,
      position:'sticky', top:0, zIndex:20, flexShrink:0 }}>
      {/* Brand */}
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{fontSize:isDesktop?18:15,fontWeight:800,letterSpacing:'-.01em',color:TEXT}}>ΚΟΥΒΑΔΕΪΡΟΣ</div>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:'.08em',color:GREEN,background:`${GREEN}18`,border:`1px solid ${GREEN}35`,borderRadius:4,padding:'2px 6px'}}>26/27</div>
      </div>

      {/* Desktop nav — inline in header */}
      {isDesktop && (
        <div style={{display:'flex',gap:4}}>
          {NAV.map(navItem=>(
            <button key={navItem.id} onClick={()=>setScreen(navItem.id)} style={{
              display:'flex',alignItems:'center',gap:7,padding:'8px 14px',
              borderRadius:8, border:'none',
              background:screen===navItem.id?'rgba(255,255,255,.1)':'transparent',
              color:screen===navItem.id?TEXT:MUTED,cursor:'pointer',fontSize:13,fontWeight:600,
              borderBottom:screen===navItem.id?`2px solid ${GREEN}`:'2px solid transparent',
              transition:'all .15s'
            }}>
              <span>{navItem.icon}</span>{navItem.l}
            </button>
          ))}
        </div>
      )}

      {/* Right controls */}
      <div style={{display:'flex',alignItems:'center',gap:isDesktop?12:8}}>
        <div style={{width:7,height:7,borderRadius:'50%',background:syncOk?GREEN:RED,animation:syncing?'pulse-d .7s infinite':undefined}}/>
        {user?.role==='admin' && (
          <button onClick={()=>setShowAddPlayer(true)} title="Προσθήκη παίκτη"
            style={{background:'none',border:'none',cursor:'pointer',color:MUTED,display:'flex',alignItems:'center',padding:'4px 6px',borderRadius:8,fontSize:isDesktop?16:14}}>
          ➕
        </button>
        )}
        <button onClick={()=>setShowGuide(true)} title="Οδηγός & Κανόνες"
          style={{background:'none',border:'none',cursor:'pointer',color:MUTED,display:'flex',alignItems:'center',padding:'4px 6px',borderRadius:8,fontSize:isDesktop?17:15}}>
          ℹ️
        </button>
        <div style={{display:'flex',alignItems:'center',gap:7}}>
          <div style={{width:isDesktop?32:26,height:isDesktop?32:26,borderRadius:'50%',background:pc.p,
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:isDesktop?13:11,fontWeight:900,color:'#08090d'}}>
            {user.name.substring(0,1)}
          </div>
          {isDesktop && <span style={{fontSize:12,fontWeight:700,color:pc.p}}>{user.name}</span>}
        </div>
        <button onClick={handleLogout} style={{background:'rgba(255,77,109,.12)',border:'1px solid rgba(255,77,109,.3)',cursor:'pointer',color:'#ff4d6d',display:'flex',alignItems:'center',padding:'5px 10px',borderRadius:8,fontSize:12,fontWeight:700,gap:4}}>
          🚪 {isDesktop?'Έξοδος':''}
        </button>
      </div>
    </div>
  )

  // ── BOTTOM NAV (mobile/tablet only) ─────────────────────────────────────────
  const BottomNav = () => (
    <div style={{ background:'#0a0b0f', borderTop:`1px solid ${LINE}`,
      display:'flex', justifyContent:'space-around',
      padding:`6px 0 ${isMobile?'max(8px,env(safe-area-inset-bottom))':'8px'}`,
      position:'fixed', bottom:0, left:0, right:0, zIndex:20 }}>
      {NAV.map(navItem=>(
        <button key={navItem.id} onClick={()=>setScreen(navItem.id)}
          style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,
            padding:'3px 8px',background:'none',border:'none',cursor:'pointer',minWidth:44,flex:1}}>
          <span style={{fontSize:isTablet?22:19,filter:screen===navItem.id?undefined:'grayscale(.6) opacity(.5)'}}>{navItem.icon}</span>
          <span style={{fontSize:isTablet?10:9,fontWeight:700,letterSpacing:'.04em',color:screen===navItem.id?GREEN:MUTED,textTransform:'uppercase'}}>{navItem.l}</span>
          {screen===navItem.id&&<div style={{width:16,height:2,background:GREEN,borderRadius:1}}/>}
        </button>
      ))}
      <button onClick={handleLogout}
        style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,
          padding:'3px 8px',background:'none',border:'none',cursor:'pointer',minWidth:44,flex:1}}>
        <span style={{fontSize:19}}>🚪</span>
        <span style={{fontSize:9,fontWeight:700,color:'#ff4d6d',textTransform:'uppercase'}}>Έξοδος</span>
      </button>
    </div>
  )

  // ── DESKTOP SIDEBAR LAYOUT ──────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div style={{display:'flex',flexDirection:'column',minHeight:'100vh',background:BG,fontFamily:"'Space Grotesk',system-ui,sans-serif",color:TEXT}}>
        {showAddPlayer && user?.role==='admin' && <AddPlayerModal onClose={()=>setShowAddPlayer(false)} onAdded={load}/>}
        <Header/>
        <div style={{flex:1,display:'grid',gridTemplateColumns:'300px 1fr',maxWidth:1280,width:'100%',margin:'0 auto',padding:'24px 32px',gap:24,alignItems:'start'}}>
          {/* Left sidebar: leaderboard + graph */}
          <div style={{position:'sticky',top:80}}>
            <LeaderSidebar predictions={state.predictions} results={state.results}/>
          </div>
          {/* Main content */}
          <div style={{minWidth:0}}>
            {pages[screen]}
          </div>
        </div>
      </div>
    )
  }

  // ── MOBILE / TABLET ─────────────────────────────────────────────────────────
  return (
    <div style={{background:BG,minHeight:'100vh',display:'flex',flexDirection:'column',
      maxWidth:isTablet?768:'100%',margin:'0 auto',fontFamily:"'Space Grotesk',system-ui,sans-serif",color:TEXT}}>
      {showAddPlayer && user?.role==='admin' && <AddPlayerModal onClose={()=>setShowAddPlayer(false)} onAdded={load}/>}
      <Header/>
      {/* Mobile/Tablet leaderboard + graph */}
      <div style={{padding:'8px 16px 0'}}>
        <LeaderSidebar predictions={state.predictions} results={state.results} compact/>
        <div style={{background:'rgba(255,255,255,.03)',borderRadius:12,padding:'10px 12px',marginTop:6,border:'1px solid rgba(255,255,255,.08)'}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'rgba(255,255,255,.4)',marginBottom:6}}>📈 Εξέλιξη Διαγωνισμού</div>
          <H2HGraph predictions={state.predictions} results={state.results}/>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',paddingBottom:isTablet?72:64}}>
        {pages[screen]}
      </div>
      <BottomNav/>
    </div>
  )
}// ─── LEAGUE PAGE ─────────────────────────────────────────────────────────────
function LeaguePage({predictions,results,thavmaStats}){
  const board=computeLeaderboard(ALL_FIXTURES,predictions,results)
  const [tab,setTab]=useState('standings')
  return <div style={{padding:'16px 16px 80px'}}>
    <div style={{display:'flex',gap:6,marginBottom:16,overflowX:'auto',scrollbarWidth:'none',msOverflowStyle:'none'}}>
      {[{id:'standings',l:'Συγκομιδή'},{id:'rivalry',l:'🌶️ Διαγκωνισμοί'},{id:'analytics',l:'Αναλυτικά'},{id:'campaigns',l:'Ενεργές Διοργανώσεις'}].map(tabItem=>(
        <button key={tabItem.id} onClick={()=>setTab(tabItem.id)}
          style={{fontSize:11,fontWeight:700,padding:'6px 13px',borderRadius:7,whiteSpace:'nowrap',
            border:'1px solid '+(tab===tabItem.id?'rgba(255,255,255,.3)':LINE),
            background:tab===tabItem.id?'rgba(255,255,255,.12)':'transparent',
            color:tab===tabItem.id?TEXT:MUTED,cursor:'pointer'}}>
          {tabItem.l}
        </button>
      ))}
    </div>
    {tab==='standings'&&<>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.4)',marginBottom:10}}>Ανάλυση ανά τουρνουά</div>
      {board.map(row=>{
        const bd={};
        ['SL','UCL','UEL','UECL'].forEach(t=>{
          let pts=0,played=0;
          ALL_FIXTURES.filter(m=>m.t===t).forEach(m=>{
            const ac=results?.[m.id];if(!ac)return;
            const sc=scoreMatch(predictions?.[m.id]?.[row.player],ac);
            if(!sc)return;pts+=sc.points;played++;
          });
          bd[t]={pts,played};
        });
        const pcr=PC[row.player];
        return <div key={row.player} style={{background:SURF,border:'1px solid '+LINE,borderRadius:12,padding:'14px 16px',marginBottom:8}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:pcr.p,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:900,color:SURF}}>{PLAYER_NAMES[row.player].substring(0,1)}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:TEXT}}>{PLAYER_NAMES[row.player]}</div>
              <div style={{fontSize:10,color:MUTED,marginTop:1}}>{row.exact} exact · {row.correct} correct · {row.played} games</div>
            </div>
            <div style={{fontSize:22,fontWeight:900,color:pcr.p}}>{row.pts}<span style={{fontSize:12,color:MUTED,fontWeight:500}}>p</span></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5}}>
            {Object.entries(bd).map(([t,d])=>(
              <div key={t} style={{background:'rgba(255,255,255,.05)',borderRadius:8,padding:'8px 5px',textAlign:'center'}}>
                <TPill id={t}/>
                <div style={{fontSize:15,fontWeight:800,marginTop:5,color:d.pts>0?pcr.p:MUTED}}>{d.pts}</div>
                <div style={{fontSize:9,color:MUTED,marginTop:1}}>{d.played}αγ</div>
              </div>
            ))}
          </div>
        </div>;
      })}
    </>}
    {tab==='rivalry'&&<RivalryStats predictions={predictions} results={results} thavmaStats={thavmaStats}/>}
    {tab==='analytics'&&(()=>{
      const played=ALL_FIXTURES.filter(m=>results?.[m.id]!=null)
      if(!played.length) return <div style={{padding:24,textAlign:'center',color:MUTED,fontSize:13}}>Δεν υπάρχουν δεδομένα ακόμα</div>
      return <div>
        {PLAYERS.map(p=>{
          const pc2=PC[p]
          let exact=0,correct=0,total=0,streak=0,maxStreak=0,curStreak=0,pts=0
          played.forEach(m=>{
            const pred=predictions?.[m.id]?.[p]
            const res=results[m.id]
            if(!pred) return
            const sc=scoreMatch(pred,res)
            if(!sc) return
            total++; pts+=sc.points
            if(sc.exact){exact++;correct++}
            else if(sc.correct){correct++}
            curStreak=sc.points>0?curStreak+1:0
            maxStreak=Math.max(maxStreak,curStreak)
          })
          const accPct=total?Math.round(correct/total*100):0
          const exactPct=total?Math.round(exact/total*100):0
          const avgPts=total?(pts/total).toFixed(1):0
          return <div key={p} style={{background:SURF,border:'1px solid '+LINE,borderRadius:12,padding:'14px 16px',marginBottom:10}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
              <div style={{width:38,height:38,borderRadius:'50%',background:pc2.p,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,color:'#08090d'}}>{PLAYER_NAMES[p][0]}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:TEXT}}>{PLAYER_NAMES[p]}</div>
                <div style={{fontSize:10,color:MUTED}}>{total} αγώνες · {pts} πόντοι</div>
              </div>
              <div style={{fontSize:26,fontWeight:900,color:pc2.p}}>{avgPts}<span style={{fontSize:11,color:MUTED}}>p/αγ</span></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:10}}>
              {[
                {lbl:'Ακρίβεια',val:accPct+'%',sub:correct+'/'+total+' σωστά',color:accPct>=60?GREEN:accPct>=40?GOLD:RED},
                {lbl:'Exact Score',val:exactPct+'%',sub:exact+'/'+total+' ακριβή',color:exactPct>=30?GREEN:exactPct>=15?GOLD:RED},
                {lbl:'Max Σερί',val:maxStreak,sub:'σερί πόντοι',color:maxStreak>=3?GREEN:maxStreak>=2?GOLD:MUTED},
              ].map(stat=>(
                <div key={stat.lbl} style={{background:'rgba(255,255,255,.04)',borderRadius:10,padding:'10px 8px',textAlign:'center'}}>
                  <div style={{fontSize:9,fontWeight:700,color:MUTED,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:4}}>{stat.lbl}</div>
                  <div style={{fontSize:22,fontWeight:900,color:stat.color}}>{stat.val}</div>
                  <div style={{fontSize:9,color:MUTED,marginTop:2}}>{stat.sub}</div>
                </div>
              ))}
            </div>
            <div style={{height:4,background:'rgba(255,255,255,.06)',borderRadius:2}}>
              <div style={{height:'100%',width:accPct+'%',background:pc2.p,borderRadius:2,transition:'width 1s ease'}}/>
            </div>
          </div>
        })}
      </div>
    })()}
    {tab==='campaigns'&&(()=>{
      const comps=[
        {id:'UEL',  name:'UEFA Europa League',     color:'#f5733a', teams:['PAOK'], emoji:'🟠'},
        {id:'UECL', name:'UEFA Conference League', color:'#00c853', teams:['PAO'],  emoji:'🟢'},
        {id:'UCL',  name:'UEFA Champions League',  color:'#4d9fff', teams:['OLY','AEK'], emoji:'🔵'},
        {id:'SL',   name:'Super League 2026/27',   color:'#f0c040', teams:['OLY','AEK','PAOK','PAO','ARI','ATR','AST','KIF','LEV','OFI','PNE','VOL','IRA','KAL'], emoji:'🟡'},
      ]
      return <div>
        {comps.map(comp=>{
          const compMatches=ALL_FIXTURES.filter(m=>m.t===comp.id)
          const played=compMatches.filter(m=>results?.[m.id]!=null)
          const upcoming=compMatches.filter(m=>!results?.[m.id])
          const nextMatch=upcoming.sort((a,b)=>new Date(a.kickoff)-new Date(b.kickoff))[0]
          const totalPts=PLAYERS.reduce((acc,p)=>{
            let pts=0
            played.forEach(m=>{
              const sc=scoreMatch(predictions?.[m.id]?.[p],results[m.id])
              if(sc) pts+=sc.points
            })
            acc[p]=pts; return acc
          },{})
          return <div key={comp.id} style={{background:SURF,border:'1px solid '+LINE,borderRadius:12,padding:'14px 16px',marginBottom:10,borderLeft:'3px solid '+comp.color}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <span style={{fontSize:18}}>{comp.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:TEXT}}>{comp.name}</div>
                <div style={{fontSize:10,color:MUTED,marginTop:1}}>{played.length}/{compMatches.length} αγώνες · {upcoming.length} εναπομένουν</div>
              </div>
              <TPill id={comp.id}/>
            </div>
            <div style={{display:'flex',gap:5,marginBottom:10,flexWrap:'wrap'}}>
              {comp.teams.map(t=>(
                <div key={t} style={{display:'flex',alignItems:'center',gap:5,background:'rgba(255,255,255,.05)',borderRadius:8,padding:'4px 8px'}}>
                  <TeamLogo k={t} size={18}/>
                  <span style={{fontSize:10,fontWeight:600,color:TEXT}}>{TEAMS[t]?.name||t}</span>
                </div>
              ))}
            </div>
            {nextMatch&&<div style={{fontSize:10,color:MUTED,marginBottom:10}}>
              ⏭ Επόμενος: <span style={{color:GOLD,fontWeight:700}}>{TEAMS[nextMatch.home]?.abbr} vs {TEAMS[nextMatch.away]?.abbr}</span> · {grDate(nextMatch.kickoff)} {grTime(nextMatch.kickoff)}
            </div>}
            <div style={{display:'flex',gap:6}}>
              {PLAYERS.map(p=>(
                <div key={p} style={{flex:1,background:PC[p].bg,border:'1px solid '+PC[p].b,borderRadius:8,padding:'6px',textAlign:'center'}}>
                  <div style={{fontSize:9,fontWeight:700,color:PC[p].p,marginBottom:2}}>{PLAYER_NAMES[p].substring(0,4).toUpperCase()}</div>
                  <div style={{fontSize:18,fontWeight:900,color:PC[p].p}}>{totalPts[p]||0}p</div>
                </div>
              ))}
            </div>
          </div>
        })}
      </div>
    })()}
  </div>
}

// ─── MATCHDAY PAGE ────────────────────────────────────────────────────────────
function MatchdayPage({predictions,results,onRefresh,currentUser,revealed,onSave,liveScores,slStandings}){
  const now=Date.now()
  const ONE_HOUR=3600000
  const sorted=[...ALL_FIXTURES]
    .filter(m=>{
      const ko=new Date(m.kickoff).getTime()
      const res=results?.[m.id]
      // Hide finished matches after 1 hour post-kickoff
      if(res && now > ko + ONE_HOUR) return false
      return true
    })
    .sort((a,b)=>{
      const aRes=results?.[a.id], bRes=results?.[b.id]
      const aKo=new Date(a.kickoff).getTime(), bKo=new Date(b.kickoff).getTime()
      const aLive=now>=aKo&&now<aKo+7200000&&!aRes
      const bLive=now>=bKo&&now<bKo+7200000&&!bRes
      const aLocked=now>=aKo-60000, bLocked=now>=bKo-60000
      if(aLive&&!bLive) return -1
      if(bLive&&!aLive) return 1
      if(aLocked!==bLocked) return aLocked?1:-1
      return aKo-bKo
    })
  return <div style={{padding:'12px 16px 80px'}}>
    <div style={{fontSize:10,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:MUTED,marginBottom:14}}>
      Ανοιχτές πρώτα · Ζωντανοί αγώνες επάνω
    </div>
    {sorted.map(m=>(
      <MatchPredictCard key={m.id} match={m}
        result={results?.[m.id]}
        predictions={predictions?.[m.id]}
        onRefresh={onRefresh}
        allResults={results}
        currentUser={currentUser}
        revealed={revealed}
        onSave={onSave}
        liveScore={liveScores?.[m.id]}
        slStandings={slStandings}
      />
    ))}
  </div>
}


// ─── FORM STRIP ───────────────────────────────────────────────────────────────
function FormStrip({form}){
  if(!form||!form.length) return null
  const col={W:GREEN,L:RED,D:GOLD}
  return <div style={{display:'flex',gap:3,alignItems:'center'}}>
    {form.map((r,i)=>(
      <div key={i} style={{
        width:18,height:18,borderRadius:'50%',
        background:col[r]||MUTED,
        display:'flex',alignItems:'center',justifyContent:'center',
        fontSize:9,fontWeight:800,color:'#08090d'
      }}>{r}</div>
    ))}
  </div>
}

// ─── UNIFIED MATCH+PREDICT CARD ───────────────────────────────────────────────
function MatchPredictCard({match,result,predictions,onRefresh,allResults,currentUser,revealed,onSave,liveScore,slStandings}){
  // ── State ──────────────────────────────────────────────────────────────────
  const [showPush,setShowPush]=useState(false)
  const myPred=currentUser?predictions?.[currentUser.id]:null
  const [h,setH]=useState(myPred?.h??0),[a,setA]=useState(myPred?.a??0)
  const [qual,setQual]=useState(myPred?.qual??match.home)
  const [predOT,setPredOT]=useState(myPred?.predOT??false)
  const [otH,setOtH]=useState(myPred?.otH??0),[otA,setOtA]=useState(myPred?.otA??0)
  const [predPen,setPredPen]=useState(myPred?.predPen??false)
  const [penH,setPenH]=useState(myPred?.penH??0),[penA,setPenA]=useState(myPred?.penA??0)
  const [saving,setSaving]=useState(false),[saved,setSaved]=useState(false),[error,setError]=useState('')

  // Sync prediction inputs when server data arrives
  useEffect(()=>{
    if(myPred){
      setH(myPred.h??0);setA(myPred.a??0)
      setQual(myPred.qual??match.home)
      setPredOT(myPred.predOT??false)
      setOtH(myPred.otH??0);setOtA(myPred.otA??0)
    }
  },[myPred?.h,myPred?.a,myPred?.qual])

  // ── Derived state ──────────────────────────────────────────────────────────
  const hasRes=result!=null
  const locked=isLocked(match.kickoff)
  const isUEFA=isUEFATie(match.id)
  const isRevealed=revealed?.[match.id]||false
  const minsUntil=(new Date(match.kickoff).getTime()-Date.now())/60000
  const isPreKickoff=minsUntil>=-1&&minsUntil<=1
  const showAllPreds=hasRes||(isRevealed||isPreKickoff)
  const today=isToday(match.kickoff)
  // SL standings lookup - robust matching
  const isSL=match.t==='SL'
  const findSLTeam=(key)=>{
    if(!key||(slStandings||[]).length===0) return null
    const name=(TEAMS[key]?.name||key).toLowerCase()
    const abbr=(TEAMS[key]?.abbr||key).toLowerCase()
    return (slStandings||[]).find(t=>
      t.team?.toLowerCase()===abbr||
      t.team?.toLowerCase()===key.toLowerCase()||
      t.name?.toLowerCase().includes(name)||
      name.includes(t.name?.toLowerCase()||'__')
    )||null
  }
  const slHome=isSL?findSLTeam(match.home):null
  const slAway=isSL?findSLTeam(match.away):null
  const hn=TEAMS[match.home]?.name||match.home
  const an=TEAMS[match.away]?.name||match.away
  const tC={SL:'#f0c040',UCL:BLUE,UEL:'#f5733a',UECL:GREEN}[match.t]||GOLD

  // Leg 1 aggregate
  const leg1Res=match.leg===2&&match.tie&&allResults?allResults[match.tie+'-1']:null
  const leg1Fix=match.leg===2&&match.tie?UEFA_FIXTURES.find(f=>f.id===match.tie+'-1'):null
  const leg1Agg=leg1Res&&leg1Fix?(()=>{
    const greek=match.greek
    const wasHome=leg1Fix.home===greek
    const gG=wasHome?leg1Res.h:leg1Res.a
    const oG=wasHome?leg1Res.a:leg1Res.h
    const diff=gG-oG
    return {h1:leg1Res.h,a1:leg1Res.a,diff,leg1Fix,
      situation:diff>0?'+'+diff+' προβάδισμα':diff<0?diff+' πίσω':'Ισόπαλη · Παρ/Πέν αν ισόπαλη'}
  })():null

  // Score input helpers
  const adj=(v,set,d)=>{if(!locked){set(Math.max(0,Math.min(9,v+d)));setSaved(false)}}
  const nb={width:50,height:50,background:SURF2,border:`1px solid ${locked?LINE:tC+'55'}`,borderRadius:10,
    display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,
    color:locked?MUTED:TEXT,fontVariantNumeric:'tabular-nums'}
  const ab={width:34,height:34,borderRadius:8,border:`1px solid ${LINE}`,
    background:'rgba(255,255,255,.06)',color:TEXT,cursor:locked?'not-allowed':'pointer',
    fontSize:17,display:'flex',alignItems:'center',justifyContent:'center'}

  const ScoreRow=({lbl,hv,setHv,av,setAv,sm})=>(
    <div style={{marginBottom:sm?6:0}}>
      {lbl&&<div style={{fontSize:10,fontWeight:700,color:tC,letterSpacing:'.05em',marginBottom:5,textTransform:'uppercase',textAlign:'center'}}>{lbl}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:8}}>
        {[['h',hv,setHv],['a',av,setAv]].map(([side,v,set],i)=>(
          <>
            {i===1&&<span style={{fontSize:sm?16:20,color:DIM,textAlign:'center'}}>–</span>}
            <div style={{display:'flex',alignItems:'center',gap:sm?4:7,justifyContent:'center'}}>
              <button style={sm?{...ab,width:26,height:26,fontSize:14}:ab} onClick={()=>adj(v,set,-1)}>–</button>
              <div style={sm?{...nb,width:38,height:38,fontSize:18}:nb}>{v}</div>
              <button style={sm?{...ab,width:26,height:26,fontSize:14}:ab} onClick={()=>adj(v,set,+1)}>+</button>
            </div>
          </>
        ))}
      </div>
    </div>
  )

  async function save(){
    if(locked)return;setSaving(true);setError('')
    try{
      await onSave(match.id,h,a,qual,predOT,otH,otA,predPen,penH,penA)
      setSaved(true);setTimeout(()=>setSaved(false),2500)
    }catch(e){
      setError('❌ '+(e?.message||'Σφάλμα')+' — έλεγξε σύνδεση & ξανά')
    }finally{setSaving(false)}
  }

  return (
    <div style={{background:SURF,border:`1px solid ${today?GREEN+'55':LINE}`,borderRadius:14,
      marginBottom:10,overflow:'hidden',boxShadow:today?`0 0 20px ${GREEN}12`:undefined}}>
      <div style={{height:2,background:`linear-gradient(90deg,${tC}cc,transparent)`}}/>

      {/* Header */}
      <div style={{padding:'9px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:`1px solid ${LINE}`}}>
        <div style={{display:'flex',alignItems:'center',gap:7}}>
          <TPill id={match.t}/>
          <span style={{fontSize:10,fontWeight:600,color:MUTED}}>{match.round||''}</span>
          {today&&<span style={{display:'flex',alignItems:'center',gap:4,fontSize:10,fontWeight:700,color:GREEN}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:GREEN,animation:'pulse-dot 1.2s infinite',display:'inline-block'}}/>ΣΗΜΕΡΑ
          </span>}
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:11,fontWeight:700,color:locked?RED:GREEN}}>
            {locked?'🔒 Κλειδωμένο':`Κλείνει ${grTime(match.kickoff)}`}
          </div>
          <div style={{fontSize:10,color:MUTED}}>{grDate(match.kickoff)}</div>
        </div>
      </div>

      <div style={{padding:'14px 14px 12px'}}>

        {/* Teams row */}
        <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:10,marginBottom:8}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
            <TeamLogo k={match.home} size={36}/>
            <span style={{fontSize:11,fontWeight:600,textAlign:'right',color:TEXT,lineHeight:1.2}}>{hn}</span>
            {slHome&&<span style={{fontSize:9,fontWeight:700,color:GOLD,background:GOLD+'18',borderRadius:4,padding:'1px 5px'}}>#{slHome.rank}</span>}
            {slHome?.form?.length>0&&<div style={{display:'flex',justifyContent:'flex-end'}}><FormStrip form={slHome.form.slice(-5)}/></div>}
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
            <ScorePill h={liveScore?liveScore.h:result?.h} a={liveScore?liveScore.a:result?.a} pending={today&&!hasRes&&!liveScore}/>
            {liveScore&&<div style={{fontSize:9,fontWeight:700,color:GREEN,letterSpacing:'.06em',display:'flex',alignItems:'center',gap:3}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:GREEN,animation:'pulse-dot 1s infinite',display:'inline-block'}}/>
              {liveScore.min}'
            </div>}
            {result?.overtime&&<div style={{fontSize:9,fontWeight:700,color:GOLD,letterSpacing:'.03em',textAlign:'center'}}>
              {result.penalties?`Μπενάλντιζ ${result.penH}–${result.penA}`:`ΠΑΡΑΤΑΣΗ ${result.otH}–${result.otA}`}
            </div>}
            {!hasRes&&!today&&<div style={{fontSize:10,color:DIM,fontWeight:600}}>vs</div>}
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:4}}>
            <TeamLogo k={match.away} size={36}/>
            <span style={{fontSize:11,fontWeight:600,color:TEXT,lineHeight:1.2}}>{an}</span>
            {slAway&&<span style={{fontSize:9,fontWeight:700,color:GOLD,background:GOLD+'18',borderRadius:4,padding:'1px 5px'}}>#{slAway.rank}</span>}
            {slAway?.form?.length>0&&<FormStrip form={slAway.form.slice(-5)}/>}
          </div>
        </div>

        {/* Leg 1 aggregate */}
        {leg1Agg&&<div style={{background:'rgba(255,255,255,.04)',border:`1px solid ${LINE}`,
          borderRadius:9,padding:'8px 12px',marginBottom:10,display:'flex',
          alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:6}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontSize:9,fontWeight:700,color:MUTED,letterSpacing:'.06em',textTransform:'uppercase'}}>Leg 1</span>
            <span style={{fontSize:13,fontWeight:900,color:TEXT,fontVariantNumeric:'tabular-nums'}}>
              {TEAMS[leg1Agg.leg1Fix.home]?.abbr} {leg1Agg.h1}–{leg1Agg.a1} {TEAMS[leg1Agg.leg1Fix.away]?.abbr}
            </span>
          </div>
          <span style={{fontSize:11,fontWeight:800,color:leg1Agg.diff>0?GREEN:leg1Agg.diff<0?RED:GOLD}}>
            {leg1Agg.situation}
          </span>
        </div>}

        {/* Odds */}
        <OddsRow matchId={match.id}/>

        {/* ── PREDICTION SECTION (only when not locked / no result) ── */}
        {!hasRes&&(
          <div style={{marginTop:12,borderTop:`1px solid ${LINE}`,paddingTop:12}}>

            {/* Score input */}
            <ScoreRow hv={h} setHv={setH} av={a} setAv={setA}/>

            {/* UEFA qual selector */}
            {isUEFA&&!locked&&(
              <div style={{marginTop:10}}>
                <div style={{fontSize:10,fontWeight:700,color:tC,letterSpacing:'.05em',marginBottom:6,textTransform:'uppercase'}}>Πρόκριση</div>
                <div style={{display:'flex',gap:6}}>
                  {[match.home,match.away].map(tm=>(
                    <button key={tm} onClick={()=>{if(!locked){setQual(tm);setSaved(false)}}}
                      style={{flex:1,padding:'7px 5px',borderRadius:8,border:`1px solid ${qual===tm?tC+'88':LINE}`,
                        background:qual===tm?`${tC}18`:'transparent',color:qual===tm?tC:MUTED,
                        fontSize:11,fontWeight:700,cursor:locked?'not-allowed':'pointer'}}>
                      {TEAMS[tm]?.name||tm}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Overtime toggle (UEFA only) */}
            {isUEFA&&!locked&&(
              <div style={{marginTop:8,display:'flex',gap:6}}>
                <button onClick={()=>{if(!locked){setPredOT(v=>!v);setSaved(false)}}}
                  style={{flex:1,padding:'6px',borderRadius:8,border:`1px solid ${predOT?GOLD+'66':LINE}`,
                    background:predOT?`${GOLD}15`:'transparent',color:predOT?GOLD:MUTED,
                    fontSize:10,fontWeight:700,cursor:locked?'not-allowed':'pointer'}}>
                  {predOT?'✓ ':''} ΠΑΡΑΤΑΣΗ
                </button>
                {predOT&&<button onClick={()=>{if(!locked){setPredPen(v=>!v);setSaved(false)}}}
                  style={{flex:1,padding:'6px',borderRadius:8,border:`1px solid ${predPen?RED+'66':LINE}`,
                    background:predPen?`${RED}15`:'transparent',color:predPen?RED:MUTED,
                    fontSize:10,fontWeight:700,cursor:locked?'not-allowed':'pointer'}}>
                  {predPen?'✓ ':''} Μπενάλντιζ
                </button>}
              </div>
            )}

            {/* OT score row */}
            {predOT&&!locked&&<div style={{marginTop:8}}>
              <ScoreRow lbl={predPen?'Μπενάλντιζ':'ΠΑΡΑΤΑΣΗ'} hv={otH} setHv={setOtH} av={otA} setAv={setOtA} sm/>
            </div>}

            {/* Error */}
            {error&&<div style={{fontSize:11,color:RED,background:'rgba(255,77,109,.08)',
              border:'1px solid rgba(255,77,109,.2)',borderRadius:8,padding:'7px 10px',
              marginTop:8,textAlign:'center',fontWeight:600}}>{error}</div>}

            {/* Save button */}
            <button onClick={save} disabled={locked||saving||saved}
              style={{width:'100%',marginTop:10,padding:'11px',borderRadius:10,
                background:saved?`${GREEN}22`:locked?'rgba(255,255,255,.06)':`${tC}22`,
                color:saved?GREEN:locked?MUTED:tC,fontSize:13,fontWeight:800,cursor:locked?'not-allowed':'pointer',
                border:`1px solid ${saved?GREEN+'44':locked?LINE:tC+'44'}`}}>
              {saved?'✓ Αποθηκεύτηκε!':locked?'🔒 Κλειδωμένο':saving?'Αποθήκευση…':myPred?'Άλλαξε Πρόβλεψη ✏️':'Κάνε την πρόβλεψή σου ⚽'}
            </button>
          </div>
        )}

        {/* ── MY PREDICTION (before reveal, after locking) ── */}
        {!showAllPreds&&locked&&!hasRes&&myPred&&currentUser&&(
          <div style={{marginTop:10,background:'rgba(255,255,255,.04)',
            border:`1px solid ${PC[currentUser.id]?.b||LINE}`,
            borderRadius:9,padding:'8px 10px',display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:PC[currentUser.id]?.p||MUTED,flexShrink:0}}/>
            <span style={{fontSize:11,fontWeight:600,color:MUTED}}>Η πρόβλεψή μου:</span>
            <span style={{fontSize:14,fontWeight:900,color:PC[currentUser.id]?.p||TEXT,fontVariantNumeric:'tabular-nums'}}>{myPred.h}–{myPred.a}</span>
            {myPred.qual&&<span style={{fontSize:10,color:MUTED}}>→ {myPred.qual}</span>}
          </div>
        )}

        {/* ── ALL PREDICTIONS (reveal or result) ── */}
        {showAllPreds&&predictions&&(
          <div style={{marginTop:10}}>
            {(isPreKickoff||isRevealed)&&!hasRes&&(
              <div style={{fontSize:10,fontWeight:700,color:GOLD,textAlign:'center',marginBottom:6,letterSpacing:'.06em'}}>🔒 ΑΠΟΚΑΛΥΨΗ ΠΡΟΒΛΕΨΕΩΝ</div>
            )}
            <div style={{display:'flex',gap:5}}>
              {PLAYERS.map(playerKey=>{
                const pred=predictions[playerKey]
                const sc=pred?scoreMatch(pred,result):null
                const pc=PC[playerKey]
                return (
                  <div key={playerKey} style={{flex:1,
                    background:sc?.exact?`${GREEN}15`:sc?.correct?`${GOLD}0a`:'rgba(255,255,255,.04)',
                    border:`1px solid ${sc?.exact?GREEN+'44':sc?.correct?GOLD+'22':LINE}`,
                    borderRadius:9,padding:'7px 6px',textAlign:'center'}}>
                    <div style={{fontSize:9,fontWeight:700,color:pc.p,marginBottom:3,letterSpacing:'.04em'}}>{PLAYER_NAMES[playerKey].substring(0,4).toUpperCase()}</div>
                    <div style={{fontSize:13,fontWeight:800,color:TEXT,fontVariantNumeric:'tabular-nums'}}>{pred?`${pred.h}–${pred.a}`:'–'}</div>
                    {pred?.qual&&<div style={{fontSize:9,color:MUTED,marginTop:1}}>→{pred.qual}</div>}
                    {sc&&<div style={{fontSize:10,fontWeight:700,color:sc.points===2?GREEN:sc.points===1?GOLD:DIM,marginTop:2}}>{sc.points===2?'🎯':sc.points===1?'✓':'✗'}{sc.points}p</div>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── ADMIN ACTIONS ── */}
        {currentUser?.role==='admin'&&(
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <FetchBtn matchId={match.id} onFetched={onRefresh}/>
            <button onClick={()=>setShowPush(v=>!v)}
              style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,
                padding:'8px 10px',borderRadius:8,
                border:`1px solid ${showPush?GOLD+'55':GOLD+'25'}`,
                background:showPush?`${GOLD}20`:`${GOLD}08`,
                color:GOLD,fontSize:11,fontWeight:700,cursor:'pointer'}}>
              <i className="ti ti-cloud-upload" style={{fontSize:13}}/>Push
            </button>
          </div>
        )}
        {showPush&&currentUser?.role==='admin'&&(
          <PushPanel match={match} result={result} onSaved={()=>{setShowPush(false);onRefresh()}}/>
        )}
      </div>
    </div>
  )
}




// ─── FIXTURE LIST ────────────────────────────────────────────────────────────
function FixtureList({fixtures,rankMap,formMap,setView,setH2hMatch}){
  if(!fixtures.length) return <div style={{padding:32,textAlign:'center',color:MUTED,fontSize:13}}>Δεν βρέθηκαν αγώνες</div>
  const now=Date.now()
  // Group by round
  const groups={};
  fixtures.forEach(m=>{
    const key=m.round||m.t||'Αγώνες'
    if(!groups[key]) groups[key]=[]
    groups[key].push(m)
  })
  return <div>
    {Object.entries(groups).map(([round,gMatches])=>(
      <div key={round}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',
          color:MUTED,marginBottom:8,marginTop:16,display:'flex',alignItems:'center',gap:8}}>
          <div style={{flex:1,height:1,background:LINE}}/>
          {round}
          <div style={{flex:1,height:1,background:LINE}}/>
        </div>
        {gMatches.map(m=>{
          const ko=new Date(m.kickoff).getTime()
          const isPast=ko<now
          const isSL=m.t==='SL'
          const homeRank=rankMap?.[m.home]||rankMap?.[TEAMS[m.home]?.name]
          const awayRank=rankMap?.[m.away]||rankMap?.[TEAMS[m.away]?.name]
          const homeForm=formMap?.[m.home]||formMap?.[TEAMS[m.home]?.name]||[]
          const awayForm=formMap?.[m.away]||formMap?.[TEAMS[m.away]?.name]||[]
          return <div key={m.id} style={{background:SURF,border:'1px solid '+LINE,borderRadius:12,
            padding:'10px 14px',marginBottom:6,opacity:isPast?0.65:1}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
              <TPill id={m.t}/>
              <div style={{fontSize:10,color:MUTED,fontWeight:600}}>{grDate(m.kickoff)} · {grTime(m.kickoff)}</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:8}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:3}}>
                <div style={{display:'flex',alignItems:'center',gap:5}}>
                  {homeRank&&<span style={{fontSize:9,fontWeight:700,color:GOLD,background:GOLD+'18',borderRadius:4,padding:'1px 4px'}}>#{homeRank}</span>}
                  <span style={{fontSize:12,fontWeight:700,color:TEXT}}>{TEAMS[m.home]?.name||m.home}</span>
                  <TeamLogo k={m.home} size={22}/>
                </div>
                {isSL&&homeForm.length>0&&<div style={{display:'flex',justifyContent:'flex-end'}}><FormStrip form={homeForm.slice(-5)}/></div>}
              </div>
              <span style={{fontSize:12,color:DIM,fontWeight:700}}>vs</span>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:3}}>
                <div style={{display:'flex',alignItems:'center',gap:5}}>
                  <TeamLogo k={m.away} size={22}/>
                  <span style={{fontSize:12,fontWeight:700,color:TEXT}}>{TEAMS[m.away]?.name||m.away}</span>
                  {awayRank&&<span style={{fontSize:9,fontWeight:700,color:GOLD,background:GOLD+'18',borderRadius:4,padding:'1px 4px'}}>#{awayRank}</span>}
                </div>
                {isSL&&awayForm.length>0&&<FormStrip form={awayForm.slice(-5)}/>}
              </div>
            </div>
            <button onClick={()=>{setView('h2h');setH2hMatch(m.id)}}
              style={{marginTop:8,width:'100%',padding:'5px',borderRadius:7,
                border:'1px solid '+LINE,background:'rgba(255,255,255,.04)',
                color:MUTED,fontSize:11,fontWeight:600,cursor:'pointer'}}>
              ⚔️ H2H
            </button>
          </div>
        })}
      </div>
    ))}
  </div>
}

// ─── SCHEDULE PAGE ────────────────────────────────────────────────────────────
function SchedulePage({slStandings}){
  const [filter,  setFilter]  = useState('all')
  const [view,    setView]    = useState('list')
  const [h2hMatch,setH2hMatch]= useState(null)
  const [nFilter, setNFilter] = useState('all')
  const [espnFixtures, setEspnFixtures] = useState([])
  const [loadingFix, setLoadingFix] = useState(true)

  useEffect(()=>{
    api.getSlFixtures().then(d=>{
      if(d?.events?.length) setEspnFixtures(d.events)
    }).catch(()=>{}).finally(()=>setLoadingFix(false))
  },[])

  const now = Date.now()

  // Build form map from SL standings
  const formMap = {}
  ;(slStandings||[]).forEach(t=>{
    formMap[t.team] = t.form || []
    formMap[t.name] = t.form || []
  })

  const rankMap = {}
  ;(slStandings||[]).forEach(t=>{
    rankMap[t.team] = t.rank
    rankMap[t.name] = t.rank
  })

  let fixtures = [...ALL_FIXTURES]

  if(filter!=='all'){
    if(['SL','UCL','UEL','UECL'].includes(filter)){
      fixtures = fixtures.filter(m=>m.t===filter)
    } else {
      fixtures = fixtures.filter(m=>m.home===filter||m.away===filter)
    }
  }

  if(nFilter==='next5'){
    fixtures = fixtures.filter(m=>new Date(m.kickoff).getTime()>now).slice(0,5)
  } else if(nFilter==='next3'){
    fixtures = fixtures.filter(m=>new Date(m.kickoff).getTime()>now).slice(0,3)
  } else if(nFilter==='last5'){
    fixtures = fixtures.filter(m=>new Date(m.kickoff).getTime()<now).slice(-5)
  }

  fixtures.sort((a,b)=>new Date(a.kickoff)-new Date(b.kickoff))

  // H2H selected match
  const h2hData = h2hMatch ? ALL_FIXTURES.find(m=>m.id===h2hMatch) : null

  const allTeams = [...new Set(ALL_FIXTURES.flatMap(m=>[m.home,m.away]))].sort()

  return <div style={{padding:'12px 16px 80px'}}>

    {/* Controls */}
    <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap',alignItems:'center'}}>
      {/* Team filter */}
      <select value={filter} onChange={e=>setFilter(e.target.value)}
        style={{flex:1,minWidth:120,padding:'8px 10px',borderRadius:9,
          background:SURF,border:'1px solid '+LINE,color:TEXT,fontSize:12,fontWeight:600}}>
        <option value="all">🌍 Όλες οι διοργανώσεις</option>
        <optgroup label="Διοργανώσεις">
          <option value="SL">🟡 Super League</option>
          <option value="UCL">🔵 Champions League</option>
          <option value="UEL">🟠 Europa League</option>
          <option value="UECL">🟢 Conference League</option>
        </optgroup>
        <optgroup label="Ομάδες">
          {allTeams.map(t=>(
            <option key={t} value={t}>{TEAMS[t]?.name||t}</option>
          ))}
        </optgroup>
      </select>

      {/* N filter */}
      <select value={nFilter} onChange={e=>setNFilter(e.target.value)}
        style={{flex:1,minWidth:110,padding:'8px 10px',borderRadius:9,
          background:SURF,border:'1px solid '+LINE,color:TEXT,fontSize:12,fontWeight:600}}>
        <option value="all">Όλοι</option>
        <option value="next3">Επόμενοι 3</option>
        <option value="next5">Επόμενοι 5</option>
        <option value="last5">Τελευταίοι 5</option>
      </select>

      {/* View toggle */}
      <div style={{display:'flex',gap:4}}>
        {[{id:'list',l:'📋'},{id:'h2h',l:'⚔️ H2H'}].map(v=>(
          <button key={v.id} onClick={()=>setView(v.id)}
            style={{padding:'7px 12px',borderRadius:8,border:'1px solid '+(view===v.id?GREEN+'66':LINE),
              background:view===v.id?GREEN+'18':'transparent',color:view===v.id?GREEN:MUTED,
              fontSize:12,fontWeight:700,cursor:'pointer'}}>
            {v.l}
          </button>
        ))}
      </div>
    </div>

    {/* LIST VIEW */}
    {view==='list'&&<FixtureList fixtures={fixtures} rankMap={rankMap} formMap={formMap} setView={setView} setH2hMatch={setH2hMatch}/>}

    {/* H2H VIEW */}
    {view==='h2h'&&<div>
      {/* Match selector */}
      <select value={h2hMatch||''} onChange={e=>setH2hMatch(e.target.value)}
        style={{width:'100%',padding:'10px 12px',borderRadius:10,
          background:SURF,border:'1px solid '+LINE,color:TEXT,fontSize:12,fontWeight:600,marginBottom:14}}>
        <option value="">Επίλεξε αγώνα...</option>
        {ALL_FIXTURES.map(m=>(
          <option key={m.id} value={m.id}>
            {TEAMS[m.home]?.abbr||m.home} vs {TEAMS[m.away]?.abbr||m.away} · {grDate(m.kickoff)}
          </option>
        ))}
      </select>

      {h2hData&&(()=>{
        const homeTeam=h2hData.home, awayTeam=h2hData.away
        const homeLast=ALL_FIXTURES.filter(m=>
          (m.home===homeTeam||m.away===homeTeam)&&new Date(m.kickoff).getTime()<now
        ).slice(-3)
        const awayLast=ALL_FIXTURES.filter(m=>
          (m.home===awayTeam||m.away===awayTeam)&&new Date(m.kickoff).getTime()<now
        ).slice(-3)
        const homeNext=ALL_FIXTURES.filter(m=>
          (m.home===homeTeam||m.away===homeTeam)&&new Date(m.kickoff).getTime()>now
        ).slice(0,3)
        const awayNext=ALL_FIXTURES.filter(m=>
          (m.home===awayTeam||m.away===awayTeam)&&new Date(m.kickoff).getTime()>now
        ).slice(0,3)

        const TeamCol=({team,last,next,rank,form})=>(
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
              <TeamLogo k={team} size={28}/>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:TEXT}}>{TEAMS[team]?.name||team}</div>
                {rank&&<div style={{fontSize:10,color:GOLD,fontWeight:700}}>#{rank} SL</div>}
              </div>
            </div>
            {form?.length>0&&<div style={{marginBottom:10}}><FormStrip form={form}/></div>}
            <div style={{fontSize:10,fontWeight:700,color:MUTED,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:6}}>Τελευταίοι 3</div>
            {last.map(m=>{
              const isHome=m.home===team
              const opp=isHome?m.away:m.home
              return <div key={m.id} style={{background:'rgba(255,255,255,.04)',borderRadius:8,padding:'6px 8px',marginBottom:4,fontSize:11}}>
                <span style={{color:MUTED}}>{isHome?'Εντός':'Εκτός'} vs </span>
                <span style={{color:TEXT,fontWeight:600}}>{TEAMS[opp]?.abbr||opp}</span>
                <span style={{color:MUTED}}> · {grDate(m.kickoff)}</span>
              </div>
            })}
            {last.length===0&&<div style={{fontSize:11,color:MUTED,padding:'8px 0'}}>Δεν υπάρχουν</div>}
            <div style={{fontSize:10,fontWeight:700,color:MUTED,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:6,marginTop:10}}>Επόμενοι 3</div>
            {next.map(m=>{
              const isHome=m.home===team
              const opp=isHome?m.away:m.home
              return <div key={m.id} style={{background:'rgba(255,255,255,.04)',borderRadius:8,padding:'6px 8px',marginBottom:4,fontSize:11}}>
                <span style={{color:MUTED}}>{isHome?'Εντός':'Εκτός'} vs </span>
                <span style={{color:TEXT,fontWeight:600}}>{TEAMS[opp]?.abbr||opp}</span>
                <span style={{color:MUTED}}> · {grDate(m.kickoff)}</span>
              </div>
            })}
            {next.length===0&&<div style={{fontSize:11,color:MUTED,padding:'8px 0'}}>Δεν υπάρχουν</div>}
          </div>
        )

        return <div>
          <div style={{background:SURF,border:'1px solid '+LINE,borderRadius:12,padding:'14px',marginBottom:10}}>
            <div style={{textAlign:'center',marginBottom:14}}>
              <TPill id={h2hData.t}/>
              <div style={{fontSize:13,fontWeight:700,color:TEXT,marginTop:8}}>
                {TEAMS[homeTeam]?.name||homeTeam} vs {TEAMS[awayTeam]?.name||awayTeam}
              </div>
              <div style={{fontSize:11,color:MUTED,marginTop:2}}>{grDate(h2hData.kickoff)} · {grTime(h2hData.kickoff)}</div>
            </div>
            <div style={{display:'flex',gap:12}}>
              <TeamCol team={homeTeam} last={homeLast} next={homeNext}
                rank={rankMap[homeTeam]} form={formMap[homeTeam]}/>
              <div style={{width:1,background:LINE,flexShrink:0}}/>
              <TeamCol team={awayTeam} last={awayLast} next={awayNext}
                rank={rankMap[awayTeam]} form={formMap[awayTeam]}/>
            </div>
          </div>
        </div>
      })()}
      {!h2hData&&<div style={{padding:32,textAlign:'center',color:MUTED,fontSize:13}}>Επίλεξε αγώνα για να δεις το H2H</div>}
    </div>}
  </div>
}
