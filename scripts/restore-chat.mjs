import { writeFileSync, readFileSync } from 'fs'
import { spawnSync } from 'child_process'

function extractJson(raw) {
  const i = raw.indexOf('{')
  const j = raw.lastIndexOf('}')
  return JSON.parse(raw.slice(i, j + 1))
}

const get = spawnSync(
  'npx',
  ['wrangler', 'kv', 'key', 'get', 'state', '--namespace-id', '5988821db92146b08969e4b27ec8854e', '--remote'],
  { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, shell: true },
)
if (get.status !== 0) {
  console.error('get failed')
  process.exit(1)
}
const state = extractJson(get.stdout)

// Known-good chat snapshot from before PowerShell encoding corruption
const restoredChat = [
  { p: 'Boikos', t: 'Καλωσορίσατε στο Κουβαδέιρος 2026/27! 🏆', ts: '19:00', a: true },
  { p: 'Mavromichalis', t: 'Πάλι διποντάρα ο αλητης', ts: '03:41 μ.μ.', a: false },
  { p: 'Mavromichalis', t: 'κάτι γίνεται ', ts: '04:37 μ.μ.', a: false },
  { p: 'Chousiadas', t: 'Πού είναι τα σκορ αας ρε αλητες;', ts: '08:45 μ.μ.', a: false },
  { p: 'Boikos', t: 'Την Πανάθα ξερή νίκη την παίξατε ρε αλήτες?', ts: '09:33 μ.μ.', a: true },
  { p: 'Boikos', t: 'Ντροπή ρε ρουφιάνοι', ts: '09:33 μ.μ.', a: true },
  { p: 'Boikos', t: 'Αίσχος ', ts: '09:33 μ.μ.', a: true },
  { p: 'Boikos', t: 'ΝΑΙ ΜΩΡΗ ΣΖΟΦΙΑ....', ts: '10:06 μ.μ.', a: true },
  { p: 'Mavromichalis', t: 'τελικά οι προκρίσεις καταχωρούνται αλλά δεν αθροίζουν στους βαθμούς ', ts: '08:03 π.μ.', a: false },
  { p: 'Mavromichalis', t: 'επίσης οι ώρες των αγώνων δεν είναι σωστές. Για παράδειγμα ο γάβρος παίζει 9.00 και αυτό λέει 9.30', ts: '08:06 π.μ.', a: false },
  { p: 'Mavromichalis', t: 'Θα πρέπει να αφαιρεθεί το σημερινό παιχνίδι φάντασμα του ΟΦΗ  ', ts: '08:08 π.μ.', a: false },
  { p: 'Mavromichalis', t: 'οι προκρίσεις αθροίζονται τελικά. Sorry για το spaming ', ts: '08:13 π.μ.', a: false },
  { p: 'Boikos', t: 'Ναι αυτό με τις ώρες μ΄έχει παιδέψει πολύ. Το παιχνίδι φάντασμα εντελώς κουλό.', ts: '04:31 μ.μ.', a: true },
  { p: 'Chousiadas', t: 'Παιδιά βάλτε να χτυπάνε ειδοποιήσεις. Βλέπω τα μηνύματα σας με 12 ώρες καθυστέρηση. ', ts: '08:31 μ.μ.', a: false },
  { p: 'Boikos', t: 'Έβαλα ένδειξη θες και ήχο?', ts: '08:35 μ.μ.', a: true },
  // Messages sent after corruption — keep ASCII / recovered Greek
  { p: 'Boikos', t: 'Test....Test.....1,2....1,2!', ts: '03:28 μ.μ.', a: true },
  { p: 'Boikos', t: 'Κυρίες μουουουουου.......', ts: '03:28 μ.μ.', a: true },
  { p: 'Chousiadas', t: 'Εμένα δεν χτύπησε πάντως. πρέπει να το έχω κάπως ανοιχτό, να υποθέσω;', ts: '03:34 μ.μ.', a: false },
  { p: 'Boikos', t: 'Τώρα που το έχεις ανοιχτό?', ts: '03:39 μ.μ.', a: true },
  { p: 'Chousiadas', t: 'οχι, τίποτα.', ts: '03:46 μ.μ.', a: false },
]

state.chat = restoredChat

// Preserve mavromichalis PAOK Leg1 tip
if (!state.predictions) state.predictions = {}
if (!state.predictions['uel-paok-1']) state.predictions['uel-paok-1'] = {}
const mav = state.predictions['uel-paok-1'].mavromichalis || { h: 0, a: 0 }
mav.qual = 'PAOK'
state.predictions['uel-paok-1'].mavromichalis = mav

writeFileSync('data/state-fixed.json', JSON.stringify(state))
console.log('chat restored', state.chat.length, 'bytes', Buffer.byteLength(JSON.stringify(state)))
console.log('last:', state.chat[state.chat.length - 1].t)
