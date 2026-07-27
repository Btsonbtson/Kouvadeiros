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
function MatchCard({match,result,predictions,onRefresh,allResults,currentUser,revealed}){
  const [showPush,setShowPush]=useState(false)
  const isRevealed=revealed?.[match.id]||false
  const minsUntil=(new Date(match.kickoff).getTime()-Date.now())/60000
  const isPreKickoff=minsUntil>=-1&&minsUntil<=1  // within 1 min of kickoff
  const showAllPreds=hasRes||(isRevealed||isPreKickoff)  // show all when revealed or at kickoff
  const myPred=currentUser?predictions?.[currentUser.id]:null
  const leg1Res = match.leg===2&&match.tie&&allResults ? allResults[match.tie+'-1'] : null
  const leg1Fix = match.leg===2&&match.tie ? UEFA_FIXTURES.find(f=>f.id===match.tie+'-1') : null
  const leg1Agg = leg1Res&&leg1Fix ? (()=>{
    const greek=match.greek
    const wasHome=leg1Fix.home===greek
    const gG=wasHome?leg1Res.h:leg1Res.a
    const oG=wasHome?leg1Res.a:leg1Res.h
    const diff=gG-oG
    return {h1:leg1Res.h,a1:leg1Res.a,diff,leg1Fix,
      situation:diff>0?'+'+diff+' προβάδισμα':diff<0?diff+' πίσω':'Ισόπαλη · Παρ/Πέν αν ισόπαλη'}
  })() : null
  const today=isToday(match.kickoff)
  const hasRes=result!=null
  const hn=TEAMS[match.home]?.name||match.home
  const an=TEAMS[match.away]?.name||match.away
  const tC={SL:'#f0c040',UCL:BLUE,UEL:'#f5733a',UECL:GREEN}[match.t]||GOLD

  return <div style={{background:SURF,border:`1px solid ${today?GREEN+'55':LINE}`,borderRadius:14,marginBottom:10,overflow:'hidden',boxShadow:today?`0 0 20px ${GREEN}12`:undefined}}>
    <div style={{height:2,background:`linear-gradient(90deg,${tC}cc,transparent)`}}/>
    <div style={{padding:'9px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:`1px solid ${LINE}`}}>
      <div style={{display:'flex',alignItems:'center',gap:7}}>
        <TPill id={match.t}/>
        <span style={{fontSize:10,fontWeight:600,color:MUTED}}>{match.round||''}</span>
        {today&&<span style={{display:'flex',alignItems:'center',gap:4,fontSize:10,fontWeight:700,color:GREEN}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:GREEN,animation:'pulse-dot 1.2s infinite',display:'inline-block'}}/>ΣΗΜΕΡΑ
        </span>}
      </div>
      <div style={{textAlign:'right'}}>
        <div style={{fontSize:11,fontWeight:600,color:today?GREEN:MUTED}}>{grDate(match.kickoff)}</div>
        <div style={{fontSize:11,fontWeight:700,color:today?GREEN:GOLD}}>{grTime(match.kickoff)}</div>
      </div>
    </div>

    <div style={{padding:'14px 14px 12px'}}>
      {/* Teams + score */}
      <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:10,marginBottom:8}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
          <TeamLogo k={match.home} size={36}/>
          <span style={{fontSize:11,fontWeight:600,textAlign:'right',color:TEXT,lineHeight:1.2}}>{hn}</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
          <ScorePill h={result?.h} a={result?.a} pending={today&&!hasRes}/>
          {result?.overtime&&<div style={{fontSize:9,fontWeight:700,color:GOLD,letterSpacing:'.03em',textAlign:'center'}}>{result.penalties?`PEN ${result.penH}–${result.penA}`:`AET ${result.otH}–${result.otA}`}</div>}
          {!hasRes&&!today&&<div style={{fontSize:10,color:DIM,fontWeight:600}}>vs</div>}
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:6}}>
          <TeamLogo k={match.away} size={36}/>
          <span style={{fontSize:11,fontWeight:600,color:TEXT,lineHeight:1.2}}>{an}</span>
        </div>
      </div>

      {/* Leg 1 result for Leg 2 matches */}
      {leg1Agg&&<div style={{
        background:'rgba(255,255,255,.04)',border:`1px solid ${LINE}`,
        borderRadius:9,padding:'8px 12px',marginBottom:10,marginTop:2
      }}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:6}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontSize:10,fontWeight:700,color:MUTED,letterSpacing:'.06em',textTransform:'uppercase'}}>Leg 1</span>
            <span style={{fontSize:14,fontWeight:900,color:TEXT,fontVariantNumeric:'tabular-nums'}}>
              {TEAMS[leg1Agg.leg1Fix.home]?.abbr||leg1Agg.leg1Fix.home} {leg1Agg.h1}–{leg1Agg.a1} {TEAMS[leg1Agg.leg1Fix.away]?.abbr||leg1Agg.leg1Fix.away}
            </span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:5}}>
            <span style={{fontSize:10,fontWeight:700,color:MUTED}}>Αθρ:</span>
            <span style={{fontSize:12,fontWeight:800,
              color:leg1Agg.diff>0?GREEN:leg1Agg.diff<0?RED:GOLD}}>
              {leg1Agg.situation}
            </span>
            {leg1Agg.diff===0&&<span style={{fontSize:10,color:MUTED}}>· παρ/πέν αν ισόπαλη</span>}
          </div>
        </div>
      </div>}

      {/* Odds */}
      <OddsRow matchId={match.id}/>

      {/* My prediction - always visible if I have one */}
      {!showAllPreds&&myPred&&currentUser&&<div style={{marginTop:10,background:'rgba(255,255,255,.04)',border:`1px solid ${PC[currentUser.id]?.b||LINE}`,borderRadius:9,padding:'8px 10px',display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:7,height:7,borderRadius:'50%',background:PC[currentUser.id]?.p||MUTED,flexShrink:0}}/>
        <span style={{fontSize:11,fontWeight:600,color:MUTED}}>Η πρόβλεψή μου:</span>
        <span style={{fontSize:14,fontWeight:900,color:PC[currentUser.id]?.p||TEXT,fontVariantNumeric:'tabular-nums'}}>{myPred.h}–{myPred.a}</span>
        {myPred.qual&&<span style={{fontSize:10,color:MUTED}}>→ {myPred.qual}</span>}
        {isPreKickoff&&<span style={{fontSize:10,color:GOLD,fontWeight:700,marginLeft:'auto'}}>🔒 Σε {Math.abs(Math.round(minsUntil))} λεπτά!</span>}
      </div>}

      {/* All predictions - at kickoff or after result */}
      {showAllPreds&&predictions&&<div style={{marginTop:10}}>
        {(isPreKickoff||isRevealed)&&!hasRes&&<div style={{fontSize:10,fontWeight:700,color:GOLD,textAlign:'center',marginBottom:6,letterSpacing:'.06em'}}>🔒 ΑΠΟΚΑΛΥΨΗ ΠΡΟΒΛΕΨΕΩΝ</div>}
        <div style={{display:'flex',gap:5}}>
        {PLAYERS.map(p=>{
          const pred=predictions[p],sc=pred?scoreMatch(pred,result):null,pc=PC[p]
          return <div key={p} style={{flex:1,background:sc?.exact?`${GREEN}15`:sc?.correct?`${GOLD}0a`:'rgba(255,255,255,.04)',border:`1px solid ${sc?.exact?GREEN+'44':sc?.correct?GOLD+'22':LINE}`,borderRadius:9,padding:'7px 6px',textAlign:'center'}}>
            <div style={{fontSize:9,fontWeight:700,color:pc.p,marginBottom:3,letterSpacing:'.04em'}}>{PLAYER_NAMES[p].substring(0,4).toUpperCase()}</div>
            <div style={{fontSize:13,fontWeight:800,color:TEXT,fontVariantNumeric:'tabular-nums'}}>{pred?`${pred.h}–${pred.a}`:'–'}</div>
            {sc&&<div style={{fontSize:10,fontWeight:700,color:sc.points===2?GREEN:sc.points===1?GOLD:DIM,marginTop:2}}>{sc.points===2?'🎯':sc.points===1?'✓':'✗'}{sc.points}p</div>}
          </div>
        })}
        </div>
      </div>}

      {/* Actions */}
      <div style={{display:'flex',gap:8,marginTop:12}}>
        <FetchBtn matchId={match.id} onFetched={onRefresh}/>
        <button onClick={()=>setShowPush(v=>!v)} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'8px 10px',borderRadius:8,border:`1px solid ${showPush?GOLD+'55':GOLD+'25'}`,background:showPush?`${GOLD}20`:`${GOLD}08`,color:GOLD,fontSize:11,fontWeight:700,cursor:'pointer'}}>
          <i className="ti ti-cloud-upload" style={{fontSize:13}}/>Push
        </button>
      </div>
      {showPush&&<PushPanel match={match} result={result} onSaved={()=>{setShowPush(false);onRefresh()}}/>}
    </div>
  </div>
}

// ─── H2H EVOLUTION CHART ─────────────────────────────────────────────────────
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
      {n>=2&&<div style={{borderTop:`1px solid ${LINE}`,padding:'10px 16px',display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none'}}>
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
  try {
    const played=ALL_FIXTURES.filter(m=>results?.[m.id]!=null)
    if(!played.length) return(
      <div style={{padding:24,background:SURF,borderRadius:12,border:`1px solid ${LINE}`}}>
        <div style={{color:MUTED,fontSize:13,marginBottom:8}}>Δεν υπάρχουν αγώνες για ανάλυση ακόμα</div>
        <div style={{fontSize:10,color:'#ffffff30'}}>results: {Object.keys(results||{}).join(', ')||'κενό'}</div>
        <div style={{fontSize:10,color:'#ffffff30'}}>preds: {Object.keys(predictions||{}).join(', ')||'κενό'}</div>
      </div>
    )

    const oracle={boikos:0,mavromichalis:0,chousiadas:0}
    const contrarian={boikos:0,mavromichalis:0,chousiadas:0}
    let allSame=0,allSameRight=0,allDiff=0
    const allDiffWins=[0,0,0]
    const h2h={}
    for(let i=0;i<PLAYERS.length;i++) for(let j=i+1;j<PLAYERS.length;j++)
      h2h[i+'_'+j]={wins:[0,0,0],diff:0,
        names:[PLAYER_NAMES[PLAYERS[i]],PLAYER_NAMES[PLAYERS[j]]],
        colors:[PC[PLAYERS[i]].p,PC[PLAYERS[j]].p]}

    played.forEach(m=>{
      const actual=results[m.id]
      const preds=PLAYERS.map(p=>predictions?.[m.id]?.[p])
      if(preds.some(p=>!p))return
      const scores=PLAYERS.map((p,i)=>scoreMatch(preds[i],actual))
      const pts=scores.map(s=>s?.points??0)
      const res3=preds.map(pr=>pr.h>pr.a?'H':pr.h<pr.a?'A':'D')
      if(new Set(res3).size===1){allSame++;if(pts.some(p=>p>0))allSameRight++}
      if(new Set(res3).size===3){allDiff++;pts.forEach((p,i)=>{if(p>0)allDiffWins[i]++})}
      for(let i=0;i<PLAYERS.length;i++) for(let j=i+1;j<PLAYERS.length;j++){
        const key=i+'_'+j
        if(res3[i]!==res3[j]){
          h2h[key].diff++
          if(pts[i]>pts[j])h2h[key].wins[0]++
          else if(pts[j]>pts[i])h2h[key].wins[1]++
          else h2h[key].wins[2]++
        }
      }
      const exactPs=PLAYERS.filter((_,i)=>scores[i]?.exact)
      if(exactPs.length===1)oracle[exactPs[0]]++
      PLAYERS.forEach((p,i)=>{
        const others=PLAYERS.filter((_,j)=>j!==i)
        const otherRes=others.map(o=>{const op=predictions?.[m.id]?.[o];return op?(op.h>op.a?'H':op.h<op.a?'A':'D'):null})
        if(otherRes[0]&&otherRes.every(r=>r===otherRes[0])&&res3[i]!==otherRes[0]&&pts[i]>0)contrarian[p]++
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

    const Block=({title,emoji,children})=>(
      <div style={{background:SURF,border:`1px solid ${LINE}`,borderRadius:12,padding:'14px 16px',marginBottom:10}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:12,display:'flex',alignItems:'center',gap:7}}>
          <span style={{fontSize:18}}>{emoji}</span><span style={{color:TEXT}}>{title}</span>
        </div>
        {children}
      </div>
    )

    return(
      <div>
        <Block title="Head to Head — Όταν διαφωνούν" emoji="⚔️">
          {Object.entries(h2h).map(([key,data])=>(
            <div key={key} style={{marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:700,color:MUTED,marginBottom:7,textTransform:'uppercase'}}>{data.names[0]} vs {data.names[1]} · {data.diff} battles</div>
              <MiniBar val={data.wins[0]} max={data.diff} color={data.colors[0]} label={data.names[0]}/>
              <MiniBar val={data.wins[1]} max={data.diff} color={data.colors[1]} label={data.names[1]}/>
              {data.wins[2]>0&&<div style={{fontSize:10,color:DIM}}>Ισόπαλα: {data.wins[2]}</div>}
            </div>
          ))}
        </Block>

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

        <Block title="Free For All — Όλοι διαφωνούν" emoji="🔀">
          <div style={{fontSize:12,color:MUTED,marginBottom:10}}>{allDiff} αγώνες</div>
          {PLAYERS.map((p,i)=><MiniBar key={p} val={allDiffWins[i]} max={allDiff} color={PC[p].p} label={PLAYER_NAMES[p]}/>)}
        </Block>

        <Block title="The Oracle — Μοναδικό exact score" emoji="🔮">
          <div style={{display:'flex',gap:6}}>
            {PLAYERS.map(p=>{const isL=oracle[p]>0&&p===oLdr,pc=PC[p];return(
              <div key={p} style={{flex:1,background:isL?pc.bg:'rgba(255,255,255,.04)',border:`1px solid ${isL?pc.b:LINE}`,borderRadius:10,padding:'12px 8px',textAlign:'center'}}>
                <div style={{fontSize:10,fontWeight:700,color:isL?pc.p:MUTED,marginBottom:4}}>{PLAYER_NAMES[p].substring(0,4).toUpperCase()}</div>
                <div style={{fontSize:26,fontWeight:900,color:isL?pc.p:MUTED}}>{oracle[p]}</div>
                {isL&&oracle[p]>0&&<div style={{fontSize:11,marginTop:4}}>🔮</div>}
              </div>
            )})}
          </div>
        </Block>

        <Block title="The Maverick — Διαφώνησε & είχε δίκιο" emoji="🌶️">
          <div style={{display:'flex',gap:6}}>
            {PLAYERS.map(p=>{const isL=contrarian[p]>0&&p===cLdr,pc=PC[p];return(
              <div key={p} style={{flex:1,background:isL?pc.bg:'rgba(255,255,255,.04)',border:`1px solid ${isL?pc.b:LINE}`,borderRadius:10,padding:'12px 8px',textAlign:'center'}}>
                <div style={{fontSize:10,fontWeight:700,color:isL?pc.p:MUTED,marginBottom:4}}>{PLAYER_NAMES[p].substring(0,4).toUpperCase()}</div>
                <div style={{fontSize:26,fontWeight:900,color:isL?pc.p:MUTED}}>{contrarian[p]}</div>
                {isL&&contrarian[p]>0&&<div style={{fontSize:11,marginTop:4}}>🌶️</div>}
              </div>
            )})}
          </div>
        </Block>

        <Block title="⚡ Θαύματα & Ωσάννα" emoji="🙏">
          {PLAYERS.map(p=>{
            const ts=(thavmaStats&&thavmaStats[p])||{benefited:0,pts_gained:0,pts_lost:{}}
            const totalLost=Object.values(ts.pts_lost||{}).reduce((a,b)=>a+b,0)
            const pc=PC[p]
            return(
              <div key={p} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8,background:'rgba(255,255,255,.03)',borderRadius:8,padding:'8px 10px'}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:pc.p,flexShrink:0}}/>
                <span style={{fontSize:12,fontWeight:700,color:TEXT,flex:1}}>{PLAYER_NAMES[p]}</span>
                <span style={{fontSize:11,color:GREEN,fontWeight:700}}>🍀{ts.benefited||0} +{ts.pts_gained||0}p</span>
                <span style={{fontSize:11,color:RED,fontWeight:700}}>😤-{totalLost}p</span>
              </div>
            )
          })}
        </Block>
      </div>
    )
  } catch(e) {
    return <div style={{padding:24,background:'rgba(255,77,109,.1)',border:'1px solid rgba(255,77,109,.3)',borderRadius:12,color:'#ff4d6d',fontSize:12,fontWeight:600}}>
      ❌ Rivalry Error: {e.message}<br/>
      <span style={{fontSize:10,color:MUTED,fontWeight:400}}>{e.stack?.split('\n')[0]}</span>
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
function PredictCard({match,myPred,onSave,results}){
  const locked=isLocked(match.kickoff),isUEFA=isUEFATie(match.id)
  const leg1Res=match.leg===2&&match.tie&&results?results[match.tie+'-1']:null
  const leg1Fix=match.leg===2&&match.tie?UEFA_FIXTURES.find(f=>f.id===match.tie+'-1'):null
  const [h,setH]=useState(myPred?.h??0),[a,setA]=useState(myPred?.a??0)
  const [qual,setQual]=useState(myPred?.qual??match.home)
  const [predOT,setPredOT]=useState(myPred?.predOT??false),[otH,setOtH]=useState(myPred?.otH??0),[otA,setOtA]=useState(myPred?.otA??0)
  const [predPen,setPredPen]=useState(myPred?.predPen??false),[penH,setPenH]=useState(myPred?.penH??0),[penA,setPenA]=useState(myPred?.penA??0)
  const [saving,setSaving]=useState(false),[saved,setSaved]=useState(false),[error,setError]=useState('')
  // Sync when server predictions load
  useEffect(()=>{
    if(myPred){
      setH(myPred.h??0);setA(myPred.a??0)
      setQual(myPred.qual??match.home)
      setPredOT(myPred.predOT??false)
      setOtH(myPred.otH??0);setOtA(myPred.otA??0)
    }
  },[myPred?.h,myPred?.a,myPred?.qual])
  const adj=(v,set,d)=>{if(!locked){set(Math.max(0,Math.min(9,v+d)));setSaved(false)}}
  const hn=TEAMS[match.home]?.name||match.home,an=TEAMS[match.away]?.name||match.away
  const tC={SL:'#f0c040',UCL:BLUE,UEL:'#f5733a',UECL:GREEN}[match.t]||GOLD
  const nb={width:50,height:50,background:SURF2,border:`1px solid ${locked?LINE:tC+'55'}`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,color:locked?MUTED:TEXT,fontVariantNumeric:'tabular-nums'}
  const ab={width:34,height:34,borderRadius:8,border:`1px solid ${LINE}`,background:'rgba(255,255,255,.06)',color:TEXT,cursor:locked?'not-allowed':'pointer',fontSize:17,display:'flex',alignItems:'center',justifyContent:'center'}
  const ARow=({lbl,hv,setHv,av,setAv,sm})=><div style={{marginBottom:sm?8:0}}>
    {lbl&&<div style={{fontSize:10,fontWeight:700,color:tC,letterSpacing:'.05em',marginBottom:6,textTransform:'uppercase'}}>{lbl}</div>}
    <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:8}}>
      {[['h',hv,setHv],['a',av,setAv]].map(([s,v,set],i)=><>
        {i===1&&<span key="sep" style={{fontSize:sm?16:20,color:DIM,textAlign:'center'}}>–</span>}
        <div key={s} style={{display:'flex',alignItems:'center',gap:sm?5:7,justifyContent:'center'}}>
          <button style={sm?{...ab,width:26,height:26,fontSize:14}:ab} onClick={()=>adj(v,set,-1)}>–</button>
          <div style={sm?{...nb,width:38,height:38,fontSize:18}:nb}>{v}</div>
          <button style={sm?{...ab,width:26,height:26,fontSize:14}:ab} onClick={()=>adj(v,set,+1)}>+</button>
        </div>
      </>)}
    </div>
  </div>
  async function save(){
    if(locked)return;setSaving(true);setError('')
    try{
      await onSave(match.id,h,a,qual,predOT,otH,otA,predPen,penH,penA)
      setSaved(true);setTimeout(()=>setSaved(false),2500)
    }catch(e){
      const msg=e?.message||'Σφάλμα'
      setError('❌ '+msg+' — έλεγξε σύνδεση & ξανά')
      console.error('Save failed:',e)
    }finally{setSaving(false)}
  }

  return <div style={{background:SURF,border:`1px solid ${locked?LINE:tC+'33'}`,borderRadius:14,marginBottom:12,overflow:'hidden'}}>
    <div style={{height:2,background:`linear-gradient(90deg,${tC}cc,transparent)`}}/>
    <div style={{padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:`1px solid ${LINE}`}}>
      <div style={{display:'flex',alignItems:'center',gap:7}}><TPill id={match.t}/><span style={{fontSize:10,fontWeight:600,color:MUTED}}>{match.round}</span></div>
      <div style={{textAlign:'right'}}>
        <div style={{fontSize:11,fontWeight:700,color:locked?RED:GREEN}}>{locked?'🔒 Κλειδωμένο':`Κλείνει ${grTime(match.kickoff)}`}</div>
        <div style={{fontSize:10,color:MUTED}}>{grDate(match.kickoff)}</div>
      </div>
    </div>
    <div style={{padding:'16px 14px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${LINE}`}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}><TeamLogo k={match.home} size={30}/><span style={{fontSize:13,fontWeight:700}}>{hn}</span></div>
        <span style={{color:DIM,fontSize:14,fontWeight:700}}>vs</span>
        <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:13,fontWeight:700}}>{an}</span><TeamLogo k={match.away} size={30}/></div>
      </div>

      {/* Odds */}
      <OddsRow matchId={match.id}/>

      {leg1Res&&leg1Fix&&<div style={{background:'rgba(255,255,255,.04)',border:`1px solid ${LINE}`,borderRadius:8,padding:'7px 12px',margin:'8px 0',display:'flex',alignItems:'center',justifyContent:'space-between',gap:6}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:9,fontWeight:700,color:MUTED,letterSpacing:'.06em',textTransform:'uppercase'}}>Leg 1</span>
          <span style={{fontSize:13,fontWeight:900,color:TEXT,fontVariantNumeric:'tabular-nums'}}>{TEAMS[leg1Fix.home]?.abbr} {leg1Res.h}–{leg1Res.a} {TEAMS[leg1Fix.away]?.abbr}</span>
        </div>
        {(()=>{const g=match.greek,wH=leg1Fix.home===g,gG=wH?leg1Res.h:leg1Res.a,oG=wH?leg1Res.a:leg1Res.h,d=gG-oG;return<span style={{fontSize:11,fontWeight:800,color:d>0?GREEN:d<0?RED:GOLD}}>{d>0?`+${d} προβ.`:d<0?`${d} πίσω`:'Ισόπαλη·Παρ/Πέν'}</span>})()}
      </div>}
      {myPred&&<div style={{fontSize:11,fontWeight:600,color:MUTED,textAlign:'center',marginBottom:12,marginTop:10}}>Αποθ: {myPred.h}–{myPred.a}</div>}
      <div style={{marginTop:12,marginBottom:16}}><ARow hv={h} setHv={setH} av={a} setAv={setA}/></div>

      {isUEFA&&match.leg===2&&!locked&&<div style={{background:`${GOLD}0a`,border:`1px solid ${GOLD}25`,borderRadius:10,padding:'12px',marginBottom:12}}>
        <label style={{display:'flex',alignItems:'center',gap:8,fontSize:12,fontWeight:700,cursor:'pointer',color:GOLD,marginBottom:predOT?12:0}}>
          <input type="checkbox" checked={predOT} onChange={e=>{setPredOT(e.target.checked);setSaved(false)}} style={{width:15,height:15,accentColor:GOLD}}/>⏱ Παρατάσεις +1pt αποτ. +1pt σκορ
        </label>
        {predOT&&<ARow lbl="Σκορ AET" hv={otH} setHv={setOtH} av={otA} setAv={setOtA} sm/>}
        {predOT&&<label style={{display:'flex',alignItems:'center',gap:8,fontSize:12,fontWeight:700,cursor:'pointer',color:GREEN,marginTop:8,marginBottom:predPen?12:0}}>
          <input type="checkbox" checked={predPen} onChange={e=>{setPredPen(e.target.checked);setSaved(false)}} style={{width:15,height:15,accentColor:GREEN}}/>⚽ Πέναλτι +1pt αποτ. +1pt σκορ
        </label>}
        {predOT&&predPen&&<ARow lbl="Σκορ Pen" hv={penH} setHv={setPenH} av={penA} setAv={setPenA} sm/>}
      </div>}

      {isUEFA&&!locked&&<div style={{background:`${BLUE}0a`,border:`1px solid ${BLUE}25`,borderRadius:10,padding:'10px 12px',marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:BLUE,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:7}}>🔑 Ποιος προκρίνεται; +1pt</div>
        <select value={qual} onChange={e=>{setQual(e.target.value);setSaved(false)}} style={{width:'100%',fontSize:13,fontWeight:600,padding:'8px 11px',borderRadius:8,border:`1px solid ${BLUE}35`,background:SURF2,color:TEXT,outline:'none'}}>
          <option value={match.home}>{hn}</option>
          <option value={match.away}>{an}</option>
        </select>
      </div>}

      {error&&<div style={{fontSize:11,color:'#ff4d6d',background:'rgba(255,77,109,.1)',border:'1px solid rgba(255,77,109,.25)',borderRadius:8,padding:'7px 10px',marginBottom:8,textAlign:'center',fontWeight:600}}>{error}</div>}
        <button onClick={save} disabled={locked||saving||saved} style={{width:'100%',padding:'12px',borderRadius:10,border:'none',fontWeight:700,fontSize:14,cursor:locked?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,letterSpacing:'.03em',transition:'all .2s',background:locked?'rgba(255,255,255,.06)':saved?GREEN:`${tC}ee`,color:locked?DIM:SURF}}>
        <span style={{fontSize:16}}>{saved?'✓':locked?'🔒':saving?'⏳':'💾'}</span>
        {saved?'✓ Αποθηκεύτηκε!':locked?'🔒 Κλειδωμένο':saving?'Αποθήκευση…':myPred?'Άλλαξε Πρόβλεψη ✏️':'Κάνε την πρόβλεψή σου ⚽'}
      </button>
    </div>
  </div>
}

// ─── CHANGE PASSWORD MODAL ────────────────────────────────────────────────────
function ChangePasswordModal({user, onClose}){
  const isAdmin=user.id==='boikos'
  const [tab,setTab]=useState(isAdmin?'admin':'self')
  const [cur,setCur]=useState(''),[nw,setNw]=useState(''),[conf,setConf]=useState('')
  const [selUser,setSelUser]=useState(PLAYERS[1])
  const [adminPw,setAdminPw]=useState(''),[adminConf,setAdminConf]=useState('')
  const [msg,setMsg]=useState(''),[err,setErr]=useState(''),[loading,setLoading]=useState(false)

  async function changeSelf(e){
    e.preventDefault();setMsg('');setErr('')
    if(nw!==conf){setErr('Οι κωδικοί δεν ταιριάζουν');return}
    if(nw.length<4){setErr('Τουλάχιστον 4 χαρακτήρες');return}
    setLoading(true)
    try{await api.changePassword(cur,nw);setMsg('✓ Αλλάχθηκε επιτυχώς!');setCur('');setNw('');setConf('')}
    catch{setErr('Λάθος τρέχων κωδικός')}finally{setLoading(false)}
  }
  async function adminSet(e){
    e.preventDefault();setMsg('');setErr('')
    if(adminPw!==adminConf){setErr('Οι κωδικοί δεν ταιριάζουν');return}
    if(adminPw.length<4){setErr('Τουλάχιστον 4 χαρακτήρες');return}
    setLoading(true)
    const emails={boikos:'boikos.y@caredirect.com',mavromichalis:'mavromichalis.y@caredirect.com',chousiadas:'chousiadas.th@caredirect.com'}
    try{await api.adminSetPassword(emails[selUser],adminPw);setMsg(`✓ Ο κωδικός του ${PLAYER_NAMES[selUser]} άλλαξε!`);setAdminPw('');setAdminConf('')}
    catch{setErr('Σφάλμα — ελέγξτε συνδεσιμότητα')}finally{setLoading(false)}
  }

  const inp={width:'100%',padding:'11px 14px',background:SURF2,border:`1px solid ${LINE}`,borderRadius:9,color:TEXT,fontSize:14,outline:'none',marginBottom:12,fontFamily:'inherit'}

  return <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
    <div style={{background:SURF,border:`1px solid ${LINE}`,borderRadius:16,padding:24,width:'100%',maxWidth:420,position:'relative'}}>
      <button onClick={onClose} style={{position:'absolute',top:14,right:14,background:'none',border:'none',color:MUTED,fontSize:20,cursor:'pointer'}}>×</button>
      <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>🔐 Αλλαγή Κωδικού</div>

      {isAdmin&&<div style={{display:'flex',gap:6,marginBottom:16}}>
        {[{id:'self',l:'Ο κωδικός μου'},{id:'admin',l:'👑 Admin'}].map(tabItem=><button key={tabItem.id} onClick={()=>{setTab(tabItem.id);setMsg('');setErr('')}} style={{flex:1,padding:'7px',borderRadius:8,border:`1px solid ${tab===tabItem.id?'rgba(255,255,255,.3)':LINE}`,background:tab===tabItem.id?'rgba(255,255,255,.1)':'transparent',color:tab===tabItem.id?TEXT:MUTED,fontSize:11,fontWeight:700,cursor:'pointer'}}>{tabItem.l}</button>)}
      </div>}

      {tab==='self'?<form onSubmit={changeSelf}>
        <input type="password" value={cur} onChange={e=>setCur(e.target.value)} placeholder="Τρέχων κωδικός" required style={inp}/>
        <input type="password" value={nw} onChange={e=>setNw(e.target.value)} placeholder="Νέος κωδικός" required style={inp}/>
        <input type="password" value={conf} onChange={e=>setConf(e.target.value)} placeholder="Επαλήθευση νέου" required style={{...inp,marginBottom:0}}/>
        {err&&<div style={{color:RED,fontSize:12,fontWeight:600,marginTop:8}}>{err}</div>}
        {msg&&<div style={{color:GREEN,fontSize:12,fontWeight:600,marginTop:8}}>{msg}</div>}
        <button type="submit" disabled={loading} style={{width:'100%',marginTop:14,padding:'11px',borderRadius:10,border:'none',background:GREEN,color:SURF,fontWeight:700,fontSize:14,cursor:'pointer'}}>
          {loading?'…':'Αλλαγή'}
        </button>
      </form>:<form onSubmit={adminSet}>
        <div style={{fontSize:11,color:MUTED,marginBottom:10}}>Αλλαγή κωδικού για άλλον χρήστη (admin only)</div>
        <select value={selUser} onChange={e=>setSelUser(e.target.value)} style={{...inp}}>
          {PLAYERS.filter(p=>p!==user.id).map(p=><option key={p} value={p}>{PLAYER_NAMES[p]}</option>)}
        </select>
        <input type="password" value={adminPw} onChange={e=>setAdminPw(e.target.value)} placeholder="Νέος κωδικός" required style={inp}/>
        <input type="password" value={adminConf} onChange={e=>setAdminConf(e.target.value)} placeholder="Επαλήθευση" required style={{...inp,marginBottom:0}}/>
        {err&&<div style={{color:RED,fontSize:12,fontWeight:600,marginTop:8}}>{err}</div>}
        {msg&&<div style={{color:GREEN,fontSize:12,fontWeight:600,marginTop:8}}>{msg}</div>}
        <button type="submit" disabled={loading} style={{width:'100%',marginTop:14,padding:'11px',borderRadius:10,border:'none',background:GOLD,color:SURF,fontWeight:700,fontSize:14,cursor:'pointer'}}>
          {loading?'…':'Αλλαγή για '+PLAYER_NAMES[selUser]}
        </button>
      </form>}
    </div>
  </div>
}

// ─── PAGES ────────────────────────────────────────────────────────────────────
function MatchdayPage({predictions,results,onRefresh,currentUser,revealed}){
  const [tab,setTab]=useState('all')
  const board=computeLeaderboard(ALL_FIXTURES,predictions,results)
  const now=Date.now()
  const sorted=[...ALL_FIXTURES].sort((a,b)=>{
    const aLocked=now>=new Date(a.kickoff).getTime()-60000
    const bLocked=now>=new Date(b.kickoff).getTime()-60000
    if(aLocked!==bLocked) return aLocked?1:-1  // unlocked first
    return new Date(a.kickoff)-new Date(b.kickoff)
  })
  const fx={all:sorted,sl:[...SUPER_LEAGUE].sort((a,b)=>new Date(a.kickoff)-new Date(b.kickoff)),
    ucl:UEFA_FIXTURES.filter(f=>f.t==='UCL'),uel:UEFA_FIXTURES.filter(f=>f.t==='UEL'),
    uecl:UEFA_FIXTURES.filter(f=>f.t==='UECL')}[tab]||[]

  return <div>
    {/* Scoreboard strip */}
    <div style={{background:'#0a0b0f',borderBottom:`1px solid ${LINE}`,padding:'10px 16px',display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none'}}>
      {board.map((row,i)=>{const pc=PC[row.player];return <div key={row.player} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 12px',background:i===0?pc.bg:'rgba(255,255,255,.04)',borderRadius:20,border:`1px solid ${i===0?pc.b:LINE}`,flexShrink:0}}>
        <span style={{fontSize:14}}>{MEDALS[i]}</span>
        <span style={{fontSize:12,fontWeight:700,color:i===0?pc.p:TEXT}}>{PLAYER_NAMES[row.player]}</span>
        <span style={{fontSize:14,fontWeight:900,color:i===0?pc.p:MUTED,fontVariantNumeric:'tabular-nums'}}>{row.pts}<span style={{fontSize:10,fontWeight:600,color:MUTED}}>p</span></span>
      </div>})}
    </div>
    {/* Tabs */}
    <div style={{display:'flex',gap:5,padding:'10px 16px 8px',overflowX:'auto',scrollbarWidth:'none'}}>
      {[{id:'all',l:'All'},{id:'sl',l:'SL'},{id:'ucl',l:'UCL'},{id:'uel',l:'UEL'},{id:'uecl',l:'UECL'}].map(tabItem=><button key={tabItem.id} onClick={()=>setTab(tabItem.id)} style={{fontSize:11,fontWeight:700,padding:'5px 13px',borderRadius:7,border:`1px solid ${tab===tabItem.id?'rgba(255,255,255,.3)':LINE}`,background:tab===tabItem.id?'rgba(255,255,255,.12)':'transparent',color:tab===tabItem.id?TEXT:MUTED,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,letterSpacing:'.03em'}}>{tabItem.l}</button>)}
    </div>
    {/* ALL games - full scroll */}
    <div style={{padding:'0 16px 80px'}}>
      {fx.map(m=><MatchCard key={m.id} match={m} result={results?.[m.id]} predictions={predictions?.[m.id]} onRefresh={onRefresh} allResults={results} currentUser={currentUser} revealed={revealed}/>)}
    </div>
  </div>
}

function LeaguePage({predictions,results,thavmaStats}){
  const board=computeLeaderboard(ALL_FIXTURES,predictions,results)
  const maxPts=ALL_FIXTURES.filter(m=>results?.[m.id]!=null).length*2
  const [tab,setTab]=useState('standings')
  return <div style={{padding:'16px 16px 80px'}}>
    <div style={{display:'flex',gap:6,marginBottom:16,overflowX:'auto',scrollbarWidth:'none'}}>
      {[{id:'standings',l:'Standings'},{id:'rivalry',l:'🌶️ Rivalry'},{id:'analytics',l:'Analytics'},{id:'campaigns',l:'Campaigns'}].map(tabItem=><button key={tabItem.id} onClick={()=>setTab(tabItem.id)} style={{fontSize:11,fontWeight:700,padding:'6px 13px',borderRadius:7,border:`1px solid ${tab===tabItem.id?'rgba(255,255,255,.3)':LINE}`,background:tab===tabItem.id?'rgba(255,255,255,.12)':'transparent',color:tab===tabItem.id?TEXT:MUTED,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,letterSpacing:'.03em'}}>{tabItem.l}</button>)}
    </div>
        {tab==='standings'&&<>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.4)',marginBottom:10}}>Ανάλυση ανά τουρνουά</div>
      {board.map(row=>{
        const bd={};['SL','UCL','UEL','UECL'].forEach(t=>{
          let pts=0,played=0
          ALL_FIXTURES.filter(m=>m.t===t).forEach(m=>{
            const ac=results?.[m.id];if(!ac)return
            const sc=scoreMatch(predictions?.[m.id]?.[row.player],ac)
            if(!sc)return;pts+=sc.points;played++
          })
          bd[t]={pts,played}
        })
        const pc=PC[row.player]
        return <div key={row.player} style={{background:SURF,border:`1px solid ${LINE}`,borderRadius:12,padding:'14px 16px',marginBottom:8}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:pc.p,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:900,color:SURF}}>{PLAYER_NAMES[row.player].substring(0,1)}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:TEXT}}>{PLAYER_NAMES[row.player]}</div>
              <div style={{fontSize:10,color:MUTED,marginTop:1}}>{row.exact} exact · {row.correct} correct · {row.played} games</div>
            </div>
            <div style={{fontSize:22,fontWeight:900,color:pc.p,fontVariantNumeric:'tabular-nums'}}>{row.pts}<span style={{fontSize:12,color:MUTED,fontWeight:500}}>p</span></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5}}>
            {Object.entries(bd).map(([t,d])=><div key={t} style={{background:'rgba(255,255,255,.05)',borderRadius:8,padding:'8px 5px',textAlign:'center'}}>
              <TPill id={t}/><div style={{fontSize:15,fontWeight:800,marginTop:5,color:d.pts>0?pc.p:MUTED,fontVariantNumeric:'tabular-nums'}}>{d.pts}</div>
              <div style={{fontSize:9,color:MUTED,marginTop:1}}>{d.played}αγ</div>
            </div>)}
          </div>
        </div>
      })}
    </>}
    {tab==='rivalry'&&<RivalryStats predictions={predictions} results={results} thavmaStats={thavmaStats}/>}
    {tab==='analytics'&&board.map(row=>{
      const n=row.played,ea=n>0?Math.round(row.exact/n*100):0,ca=n>0?Math.round(row.correct/n*100):0,pc=PC[row.player]
      return <div key={row.player} style={{background:SURF,border:`1px solid ${LINE}`,borderRadius:12,padding:'16px',marginBottom:10}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
          <div style={{width:40,height:40,borderRadius:'50%',background:pc.p,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,fontWeight:900,color:SURF}}>{PLAYER_NAMES[row.player].substring(0,1)}</div>
          <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{PLAYER_NAMES[row.player]}</div><div style={{fontSize:11,color:MUTED,fontWeight:600}}>Rank #{row.rank}</div></div>
          <div style={{fontSize:28,fontWeight:900,color:pc.p,fontVariantNumeric:'tabular-nums'}}>{row.pts}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:14}}>
          {[{l:'Exact',v:row.exact,c:GREEN},{l:'Correct',v:row.correct,c:GOLD},{l:'Pts/αγ',v:n>0?(row.pts/n).toFixed(1):'–',c:BLUE}].map(s=><div key={s.l} style={{background:SURF2,borderRadius:9,padding:'10px 8px',textAlign:'center'}}>
            <div style={{fontSize:20,fontWeight:900,color:s.c,fontVariantNumeric:'tabular-nums'}}>{s.v}</div>
            <div style={{fontSize:10,color:MUTED,marginTop:2,fontWeight:600,letterSpacing:'.04em'}}>{s.l}</div>
          </div>)}
        </div>
        {[{l:'Exact accuracy',pct:ea,c:GREEN},{l:'Result accuracy',pct:ca,c:GOLD}].map(bar=><div key={bar.l} style={{marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11,fontWeight:600,marginBottom:4}}><span style={{color:MUTED}}>{bar.l}</span><span style={{color:bar.c}}>{bar.pct}%</span></div>
          <div style={{height:6,background:'rgba(255,255,255,.08)',borderRadius:3}}><div style={{height:'100%',width:`${bar.pct}%`,background:bar.c,borderRadius:3}}/></div>
        </div>)}
      </div>
    })}
    {tab==='campaigns'&&<div>
      <SLbl>Ελληνικοί Σύλλογοι · 2026/27</SLbl>
      {[{t:'AEK',c:'UCL',s:'Play-offs · 18/19 Αυγ',n:'Κλήρωση 3 Αυγ',live:false},{t:'OLY',c:'UCL',s:'Q3 · 4 Αυγ vs NEC',n:'Karaiskakis',live:false},{t:'PAOK',c:'UEL',s:'Q2 L1 ✅ 2–3 · L2: 30 Ιουλ',n:'Toumba · 21:30',live:true},{t:'PAO',c:'UECL',s:'Q2 L1 ✅ 1–2 · L2: 30 Ιουλ',n:'ΟΑΚΑ · 21:30',live:true}].map(c=><div key={c.t} style={{background:SURF,border:`1px solid ${c.live?GREEN+'44':LINE}`,borderRadius:12,padding:'14px 16px',marginBottom:8,boxShadow:c.live?`0 0 16px ${GREEN}10`:undefined}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
          <TeamLogo k={c.t} size={38}/>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{TEAMS[c.t]?.name}</div><TPill id={c.c} size="lg"/></div>
          {c.live&&<div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,color:GREEN}}><span style={{width:7,height:7,borderRadius:'50%',background:GREEN,animation:'pulse-dot 1.2s infinite',display:'inline-block'}}/>ACTIVE</div>}
        </div>
        <div style={{borderTop:`1px solid ${LINE}`,paddingTop:8}}>
          <div style={{fontSize:12,fontWeight:700,color:c.live?TEXT:MUTED}}>{c.s}</div>
          <div style={{fontSize:11,color:MUTED,marginTop:2}}>{c.n}</div>
        </div>
      </div>)}
    </div>}
  </div>
}

function PredictPage({predictions,currentUser,onSave,results}){
  const now=Date.now()
  const sorted=[...ALL_FIXTURES].sort((a,b)=>{
    const aLocked=now>=new Date(a.kickoff).getTime()-60000
    const bLocked=now>=new Date(b.kickoff).getTime()-60000
    if(aLocked!==bLocked) return aLocked?1:-1  // unlocked first
    return new Date(a.kickoff)-new Date(b.kickoff)
  })
  return <div style={{padding:'12px 16px 80px'}}>
    <div style={{fontSize:10,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:MUTED,marginBottom:14}}>Χρονολογική σειρά · Παλιότερα πρώτα</div>
    {sorted.map(m=><PredictCard key={m.id} match={m} myPred={predictions?.[m.id]?.[currentUser.id]} onSave={onSave} results={results}/>)}
  </div>
}

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
function LeaderSidebar({ predictions, results }) {
  const board = computeLeaderboard(ALL_FIXTURES, predictions, results)
  const maxPts = ALL_FIXTURES.filter(m=>results?.[m.id]!=null).length*2
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
  {id:'matchday',l:'Αγώνες',  icon:'⚽'},
  {id:'league',  l:'League',  icon:'🏆'},
  {id:'predict', l:'Predict', icon:'✏️'},
  {id:'history', l:'History', icon:'📋'},
  {id:'banter',  l:'ΙΕΡΑ ΕΞΕΤΑΣΗ', icon:'🔥'},
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
  const [state,   setState]   = useState({ predictions:{...SEEDED_PREDS}, results:{...SEEDED_RES}, chat:[] })
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
      setState({
        ...s,
        predictions:{ ...SEEDED_PREDS,...s.predictions,
          ...Object.fromEntries(Object.keys({...SEEDED_PREDS,...s.predictions}).map(mid=>[mid,{...(SEEDED_PREDS[mid]||{}),...(s.predictions[mid]||{})}])) },
        results:{ ...SEEDED_RES, ...s.results },
      })
      setSyncOk(true)
    } catch { setSyncOk(false) }
    finally { setLoading(false) }
  },[])

  useEffect(()=>{ load(); poll.current=setInterval(load,15000); return()=>clearInterval(poll.current) },[load])

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
    <div style={{minHeight:'100dvh',background:BG,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <div style={{fontSize:24,fontWeight:800,letterSpacing:'.06em',color:GREEN}}>ΚΟΥΒΑΔΕΙΡΟΣ</div>
      <Spinner size={28}/>
    </div>
  )

  const pc = PC[user.id] || PC.boikos
  const pages={
    matchday:<MatchdayPage predictions={state.predictions} results={state.results} onRefresh={load} currentUser={user} revealed={state.revealed}/>,
    league:  <LeaguePage   predictions={state.predictions} results={state.results} thavmaStats={state.thavmaStats}/>,
    predict: <PredictPage  predictions={state.predictions} currentUser={user} onSave={savePrediction} results={state.results}/>,
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
        <div style={{fontSize:isDesktop?18:15,fontWeight:800,letterSpacing:'-.01em',color:TEXT}}>ΚΟΥΒΑΔΕΙΡΟΣ</div>
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
      <div style={{display:'flex',flexDirection:'column',minHeight:'100dvh',background:BG,fontFamily:"'Space Grotesk',system-ui,sans-serif",color:TEXT}}>
        {showAddPlayer && user?.role==='admin' && <AddPlayerModal onClose={()=>setShowAddPlayer(false)} onAdded={load}/>}
        <Header/>
        <div style={{flex:1,display:'grid',gridTemplateColumns:'var(--sidebar-w,300px) 1fr',maxWidth:1280,width:'100%',margin:'0 auto',padding:'24px 32px',gap:24,alignItems:'start'}}>
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
    <div style={{background:BG,minHeight:'100dvh',display:'flex',flexDirection:'column',
      maxWidth:isTablet?768:'100%',margin:'0 auto',fontFamily:"'Space Grotesk',system-ui,sans-serif",color:TEXT}}>
      {showAddPlayer && user?.role==='admin' && <AddPlayerModal onClose={()=>setShowAddPlayer(false)} onAdded={load}/>}
      <Header/>
      <div style={{flex:1,overflowY:'auto',paddingBottom:isTablet?72:64}}>
        {pages[screen]}
      </div>
      <BottomNav/>
    </div>
  )
}
