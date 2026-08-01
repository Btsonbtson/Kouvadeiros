/** Short synthesized bell for Ιερά Εξέταση notifications (no asset file). */
let sharedCtx = null

function getCtx() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!sharedCtx || sharedCtx.state === 'closed') sharedCtx = new AC()
  return sharedCtx
}

export async function playChatBell() {
  try {
    const ctx = getCtx()
    if (!ctx) return
    if (ctx.state === 'suspended') await ctx.resume()

    const now = ctx.currentTime
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.22, now + 0.02)
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.05)
    master.connect(ctx.destination)

    // Two partials ≈ hand-bell overtone
    ;[
      { f: 880, g: 0.55, d: 0.9 },
      { f: 1320, g: 0.28, d: 0.7 },
      { f: 1760, g: 0.12, d: 0.45 },
    ].forEach(({ f, g, d }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(f, now)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(g, now + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + d)
      osc.connect(gain)
      gain.connect(master)
      osc.start(now)
      osc.stop(now + d + 0.05)
    })
  } catch {
    /* ignore autoplay / audio errors */
  }
}
