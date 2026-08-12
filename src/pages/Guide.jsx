import { useState } from 'react'

const BG='#08090d', SURF='#111318', LINE='rgba(255,255,255,.1)'
const GREEN='#00ff88', GOLD='#ffdd00', BLUE='#4d9fff', RED='#ff2244', ORA='#ff6b35'
const MUTED='rgba(255,255,255,.4)', TEXT='rgba(255,255,255,.92)'

const Section = ({ emoji, title, children, accent }) => (
  <div style={{ background:SURF, border:`1px solid ${accent||LINE}`, borderRadius:14, padding:'18px 16px', marginBottom:12 }}>
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, paddingBottom:12, borderBottom:`1px solid ${LINE}` }}>
      <span style={{ fontSize:24 }}>{emoji}</span>
      <div style={{ fontSize:15, fontWeight:800, color:accent||TEXT, letterSpacing:'-.01em' }}>{title}</div>
    </div>
    {children}
  </div>
)

const Row = ({ label, value, color }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
    <span style={{ fontSize:13, color:MUTED }}>{label}</span>
    <span style={{ fontSize:13, fontWeight:700, color:color||TEXT }}>{value}</span>
  </div>
)

const Rule = ({ n, text, sub }) => (
  <div style={{ display:'flex', gap:12, marginBottom:10 }}>
    <div style={{ width:24, height:24, borderRadius:'50%', background:GREEN, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#08090d', flexShrink:0, marginTop:1 }}>{n}</div>
    <div>
      <div style={{ fontSize:13, fontWeight:600, color:TEXT, lineHeight:1.4 }}>{text}</div>
      {sub && <div style={{ fontSize:11, color:MUTED, marginTop:3, lineHeight:1.4 }}>{sub}</div>}
    </div>
  </div>
)

export default function Guide({ onBack }) {
  const [tab, setTab] = useState('rules')

  return (
    <div style={{ background:BG, minHeight:'100vh', fontFamily:"'Space Grotesk',system-ui,sans-serif", color:TEXT, maxWidth:480, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ background:'#0a0b0f', padding:'12px 16px', display:'flex', alignItems:'center', gap:12, borderBottom:`1px solid ${LINE}`, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:MUTED, fontSize:20, display:'flex', alignItems:'center', padding:4 }}>←</button>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:TEXT }}>Οδηγός & Κανόνες</div>
          <div style={{ fontSize:10, color:MUTED, fontWeight:600 }}>ΚΟΥΒΑΔΕΙΡΟΣ 2026/27</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, padding:'12px 16px 0', borderBottom:`1px solid ${LINE}` }}>
        {[{id:'rules',l:'📋 Κανόνες'},{id:'scoring',l:'🏆 Βαθμολογία'},{id:'howto',l:'📱 Πώς παίζω'},{id:'whatsapp',l:'💬 WhatsApp'}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ fontSize:11, fontWeight:700, padding:'7px 12px', borderRadius:'8px 8px 0 0', border:`1px solid ${tab===t.id?LINE:'transparent'}`, borderBottom:'none', background:tab===t.id?SURF:'transparent', color:tab===t.id?TEXT:MUTED, cursor:'pointer', whiteSpace:'nowrap' }}>{t.l}</button>
        ))}
      </div>

      <div style={{ padding:'16px 16px 80px' }}>

        {tab==='rules' && <>
          <Section emoji="⚽" title="Τι είναι το Κουβαδέιρος;" accent={GREEN}>
            <div style={{ fontSize:13, color:MUTED, lineHeight:1.7 }}>
              Το <strong style={{color:TEXT}}>Κουβαδέιρος</strong> είναι ιδιωτικό πρωτάθλημα προβλέψεων μεταξύ των παικτών της CareDirect FC. Κάθε παίκτης προβλέπει το αποτέλεσμα των αγώνων των ελληνικών ομάδων σε Super League και UEFA, μαζεύει πόντους και ο καλύτερος προβλεψιολόγος της σεζόν κερδίζει αιώνια δόξα (και μάλλον ένα ποτό).
            </div>
          </Section>

          <Section emoji="📅" title="Ποιοι αγώνες βαθμολογούνται;" accent={GOLD}>
            <Rule n="1" text="Super League Greece 2026/27" sub="Όλοι οι αγώνες της κανονικής σεζόν — 7 ομάδες ανά αγωνιστική"/>
            <Rule n="2" text="UEFA — Ελληνικές ομάδες" sub="AEK (UCL), Ολυμπιακός (UCL), ΠΑΟΚ (UEL), ΠΑΟ (UECL) — όλα τα ματς"/>
            <Rule n="3" text="Αγώνες δύο σκελών (Legs)" sub="Κάθε σκέλος βαθμολογείται ξεχωριστά"/>
          </Section>

          <Section emoji="🔒" title="Προθεσμία Πρόβλεψης" accent={RED}>
            <div style={{ background:'rgba(255,34,68,.08)', border:`1px solid rgba(255,34,68,.2)`, borderRadius:10, padding:'12px 14px', marginBottom:10 }}>
              <div style={{ fontSize:13, fontWeight:700, color:RED, marginBottom:6 }}>⚠️ Κλείδωμα 15 λεπτά πριν την εκκίνηση</div>
              <div style={{ fontSize:12, color:MUTED, lineHeight:1.6 }}>
                15 λεπτά πριν τη σέντρα οι προβλέψεις κλειδώνουν και εμφανίζονται σε όλους. Δεν μπορείς να αλλάξεις ή να εισάγεις πρόβλεψη μετά από αυτό το σημείο.
              </div>
            </div>
            <div style={{ fontSize:12, color:MUTED, lineHeight:1.6 }}>
              💡 <strong style={{color:TEXT}}>Tip:</strong> Θα λάβεις WhatsApp υπενθυμίσεις <strong style={{color:TEXT}}>30′</strong> και <strong style={{color:TEXT}}>20′</strong> πριν κάθε αγώνα για τον οποίο δεν έχεις κάνει πρόβλεψη (κλείδωμα στις 15′).
            </div>
          </Section>
        </>}

        {tab==='scoring' && <>
          <Section emoji="🎯" title="Σύστημα Βαθμολόγησης" accent={GREEN}>
            <div style={{ background:'rgba(0,255,136,.06)', border:`1px solid rgba(0,255,136,.2)`, borderRadius:10, padding:'12px 14px', marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, paddingBottom:10, borderBottom:`1px solid ${LINE}` }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:TEXT }}>🎯 Ακριβές σκορ</div>
                  <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>π.χ. προέβλεψες 2–1, έγινε 2–1</div>
                </div>
                <div style={{ fontSize:22, fontWeight:900, color:GREEN }}>+2p</div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, paddingBottom:10, borderBottom:`1px solid ${LINE}` }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:TEXT }}>✓ Σωστό αποτέλεσμα</div>
                  <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>Νίκη/Ισοπαλία/Ήττα — χωρίς ακριβές σκορ</div>
                </div>
                <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>+1p</div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:TEXT }}>✗ Λάθος αποτέλεσμα</div>
                  <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>Δεν βρήκες ούτε το αποτέλεσμα</div>
                </div>
                <div style={{ fontSize:22, fontWeight:900, color:MUTED }}>0p</div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10, borderTop:`1px solid rgba(255,255,255,.06)` }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:TEXT }}>⛔ DQ — χωρίς tip 90′</div>
                  <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>Μόνο αν λείπει η πρόβλεψη κανονικής διάρκειας πριν το κλείδωμα · −1</div>
                </div>
                <div style={{ fontSize:22, fontWeight:900, color:'#ff2244' }}>−1p</div>
              </div>
            </div>

            <div style={{ fontSize:12, fontWeight:700, color:MUTED, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:10 }}>BONUS UEFA — Πρόκριση · Παράταση · Πέναλτι</div>
            {[
              {l:'🔑 Πρόκριση — tip στο Leg 1, μετράει στο Leg 2', v:'+1p', c:BLUE},
              {l:'⏱ Παράταση (120′) — σωστό αποτέλεσμα', v:'+1p', c:GOLD},
              {l:'⏱ Παράταση (120′) — ακριβές σκορ', v:'+1p', c:GREEN},
              {l:'⚽ Πέναλτι — νικητής μπαράζ', v:'+1p', c:GOLD},
              {l:'⚽ Πέναλτι — ακριβές σκορ μπαράζ', v:'+1p', c:GREEN},
            ].map((r,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:`1px solid rgba(255,255,255,.05)` }}>
                <span style={{ fontSize:12, color:MUTED }}>{r.l}</span>
                <span style={{ fontSize:13, fontWeight:800, color:r.c }}>{r.v}</span>
              </div>
            ))}
            <div style={{ fontSize:11, color:MUTED, marginTop:10, lineHeight:1.5 }}>
              Max UEFA Leg 2 = <strong style={{color:TEXT}}>7p</strong> (2×90′ + 2×ET + 2×pen + 1×πρόκριση).
              Οι πόντοι 90′ μετράνε το κανονικό· ET το συνολικό σκορ στα 120′· pens το μπαράζ.
              Αν δεν παίχτηκε ET/pen (ή δεν έβαλες tip), εκείνα τα layers = 0 — όχι DQ.
              DQ −1 μόνο αν λείπει η πρόβλεψη 90′ πριν το κλείδωμα.
            </div>
          </Section>

          <Section emoji="📊" title="Παραδείγματα" accent={BLUE}>
            {[
              {match:'ΠΑΟΚ vs Dynamo', pred:'2–0', actual:'2–0', pts:2, label:'Ακριβές σκορ! 🎯'},
              {match:'ΠΑΟ vs Paksi', pred:'0–1', actual:'1–2', pts:1, label:'Σωστό αποτέλεσμα ✓'},
              {match:'ΟΛΥ vs NEC', pred:'3–0', actual:'0–1', pts:0, label:'Λάθος ✗'},
            ].map((ex,i)=>(
              <div key={i} style={{ background:'rgba(255,255,255,.04)', borderRadius:10, padding:'10px 12px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:TEXT }}>{ex.match}</div>
                  <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>Πρόβλεψη: <strong style={{color:TEXT}}>{ex.pred}</strong> · Αποτ.: <strong style={{color:TEXT}}>{ex.actual}</strong></div>
                  <div style={{ fontSize:11, color:MUTED, marginTop:1 }}>{ex.label}</div>
                </div>
                <div style={{ fontSize:22, fontWeight:900, color:ex.pts===2?GREEN:ex.pts===1?GOLD:MUTED }}>{ex.pts}p</div>
              </div>
            ))}
          </Section>
        </>}

        {tab==='howto' && <>
          <Section emoji="📱" title="Πώς κάνω πρόβλεψη;" accent={GREEN}>
            <Rule n="1" text='Πήγαινε στην καρτέλα "Predict"' sub="Βλέπεις όλους τους επερχόμενους αγώνες σε χρονολογική σειρά"/>
            <Rule n="2" text="Επίλεξε το σκορ που προβλέπεις" sub="Χρησιμοποίησε τα +/– κουμπιά για γκολ Γηπεδούχου και Φιλοξενούμενου"/>
            <Rule n="3" text="UEFA Leg 1: επίλεξε ποιος προκρίνεται" sub="Μπλε κουτί μόνο στο πρώτο ματς της σειράς — +1 όταν κλείσει το Leg 2"/>
            <Rule n="4" text="UEFA Leg 2: παράταση / πέναλτι (προαιρετικά)" sub="Μόνο στο δεύτερο ματς. Έως +2 από ET και +2 από pens αν παίξουν και τα βρεις"/>
            <Rule n="5" text='Πάτα "Αποθήκευσε πρόβλεψη"' sub="Πράσινο κουμπί στο κάτω μέρος. Μπορείς να αλλάξεις μέχρι 15 λεπτά πριν τον αγώνα"/>
          </Section>

          <Section emoji="🏆" title="Πώς βλέπω την κατάταξη;" accent={GOLD}>
            <Rule n="1" text='Καρτέλα "League" → "Standings"' sub="Βλέπεις τη συνολική κατάταξη και τους πόντους ανά τουρνουά"/>
            <Rule n="2" text='Καρτέλα "League" → "🌶️ Rivalry"' sub="Συγκριτικά στατιστικά: H2H, Oracle, Maverick, Consensus, Free-for-all"/>
            <Rule n="3" text="Γράφημα Εξέλιξης" sub="Στην καρτέλα Αγώνες — κύλα για να δεις πώς εξελίσσεται ο αγώνας"/>
          </Section>

          <Section emoji="⚙️" title="Admin (Boikos only)" accent={RED}>
            <Rule n="1" text="Update Score" sub="Πάτα για αυτόματη ανανέωση σκορ από live πηγές"/>
            <Rule n="2" text="Push Result" sub="Εισάγαι χειροκίνητα το αποτέλεσμα (συμπεριλαμβανομένων AET & Pen)"/>
            <Rule n="3" text="Προσθήκη Παίκτη" sub="Μπορείς να προσθέσεις νέους παίκτες από τις Ρυθμίσεις (εικονίδιο ⚙️)"/>
          </Section>
        </>}

        {tab==='whatsapp' && <>
          <Section emoji="💬" title="WhatsApp Υπενθυμίσεις" accent={GREEN}>
            <div style={{ background:'rgba(0,255,136,.06)', border:`1px solid rgba(0,255,136,.2)`, borderRadius:10, padding:'14px', marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:GREEN, marginBottom:8 }}>Πότε στέλνουμε μήνυμα;</div>
              <div style={{ fontSize:12, color:MUTED, lineHeight:1.7 }}>
                Αν <strong style={{color:TEXT}}>δεν έχεις κάνει πρόβλεψη</strong> για κάποιον αγώνα, λαμβάνεις αυτόματο WhatsApp μήνυμα <strong style={{color:TEXT}}>30′</strong> και ξανά <strong style={{color:TEXT}}>20′</strong> πριν την εκκίνηση — ώστε να προλάβεις πριν το κλείδωμα στις <strong style={{color:TEXT}}>15′</strong> (τότε φαίνονται όλες οι προβλέψεις).
              </div>
            </div>
            <div style={{ background:'rgba(255,77,109,.06)', border:`1px solid rgba(255,77,109,.25)`, borderRadius:10, padding:'14px', marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:RED, marginBottom:8 }}>📰 Ο Κουβάς</div>
              <div style={{ fontSize:12, color:MUTED, lineHeight:1.7 }}>
                Μετά το <strong style={{color:TEXT}}>τελευταίο ματς της ημέρας</strong> (~20′ μετά τη λήξη), στέλνουμε σε <strong style={{color:TEXT}}>όλους τους παίκτες</strong> το πρωτοσέλιδο «Ο Κουβάς»: σχόλια για κάθε αποτέλεσμα της ημέρας, βαθμολογία, και το <strong style={{color:TEXT}}>προοδευτικό γράφημα ανταγωνισμού</strong>. Link + φωτο μέσα στο WhatsApp.
              </div>
            </div>
            <div style={{ background:'rgba(255,107,53,.06)', border:`1px solid rgba(255,107,53,.25)`, borderRadius:10, padding:'14px', marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:ORA, marginBottom:8 }}>🔥 Ιερά Εξέταση — offline</div>
              <div style={{ fontSize:12, color:MUTED, lineHeight:1.7 }}>
                Νέο μήνυμα στο chat → WhatsApp στους άλλους παίκτες (ακόμα κι αν η εφαρμογή είναι κλειστή). Μέσα στην εφαρμογή ακούγεται και το κουδούνι.
              </div>
            </div>
            <div style={{ fontSize:12, fontWeight:700, color:MUTED, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:10 }}>Μορφή μηνύματος</div>
            <div style={{ background:'#0d0f14', borderRadius:10, padding:'14px', fontFamily:'monospace', fontSize:12, lineHeight:1.8, color:TEXT, border:`1px solid ${LINE}`, marginBottom:14 }}>
              ⚽ KOUVADEIROS — Υπενθύμιση<br/>
              <br/>
              Δεν έχεις κάνει πρόβλεψη για:<br/>
              <strong style={{color:GREEN}}>ΠΑΟΚ vs Dynamo Kyiv</strong><br/>
              UEL Q2 Leg 2 · σε <strong style={{color:RED}}>8 λεπτά</strong> 🔒<br/>
              <br/>
              Απάντα:<br/>
              <strong style={{color:GOLD}}>PRED [match-id] [σκορ] [πρόκριση]</strong><br/>
              <br/>
              Παράδειγμα:<br/>
              <span style={{color:BLUE}}>PRED uel-paok-2 2-0 PAOK</span>
            </div>
            <div style={{ fontSize:12, color:MUTED, lineHeight:1.7 }}>
              <strong style={{color:TEXT}}>Match ID</strong> = ο κωδικός στο μήνυμα<br/>
              <strong style={{color:TEXT}}>Σκορ</strong> = Γκολ Γηπεδούχου–Φιλοξενούμενου<br/>
              <strong style={{color:TEXT}}>Πρόκριση</strong> = μόνο για UEFA (π.χ. PAOK ή DYN)<br/>
            </div>
          </Section>

          <Section emoji="📲" title="Ενεργοποίηση WhatsApp" accent={BLUE}>
            <Rule n="1" text="Αποθήκευσε τον αριθμό σου" sub="Κατά τη σύνδεση ζητήθηκε ο αριθμός κινητού σου. Αν τον παρέλειψες, μπορείς να τον εισάγεις από τις Ρυθμίσεις."/>
            <Rule n="2" text="JOIN στο Twilio Sandbox (ΥΠΟΧΡΕΩΤΙΚΟ)" sub="Άνοιξε WhatsApp → νέο chat στο +1 415 523 8886 → στείλε ακριβώς το μήνυμα join από Twilio Console (Messaging → Try it out → Send a WhatsApp message), π.χ. join <δύο-λέξεις>. Χωρίς αυτό, τα μηνύματα αποτυγχάνουν με error 63015."/>
            <Rule n="3" text="Απαντήσεις μέσω WhatsApp" sub="Μπορείς να κάνεις πρόβλεψη απαντώντας απευθείας στο μήνυμα — αποθηκεύεται αυτόματα στην εφαρμογή"/>
          </Section>
        </>}
      </div>
    </div>
  )
}
