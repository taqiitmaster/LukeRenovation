/**
 * Tiny confetti burst — ~60 lines instead of a dependency.
 * Runs on a single canvas, self-terminates once every piece is off-screen,
 * and no-ops entirely for reduced-motion users.
 */
export function burstConfetti(canvas, { count = 90 } = {}) {
  if (!canvas) return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  ctx.scale(dpr, dpr)

  const colors = ['#22D3EE', '#2DD4BF', '#F5A623', '#E8ECEF']
  const pieces = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2
    const speed = 3 + Math.random() * 7
    return {
      x: w / 2,
      y: h * 0.42,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 4 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      color: colors[(Math.random() * colors.length) | 0],
      life: 1,
    }
  })

  let raf
  const tick = () => {
    ctx.clearRect(0, 0, w, h)
    let alive = 0
    for (const p of pieces) {
      p.vy += 0.22 // gravity
      p.vx *= 0.99
      p.x += p.vx
      p.y += p.vy
      p.rot += p.spin
      p.life -= 0.008
      if (p.y < h + 40 && p.life > 0) {
        alive++
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      }
    }
    if (alive > 0) raf = requestAnimationFrame(tick)
    else ctx.clearRect(0, 0, w, h)
  }
  raf = requestAnimationFrame(tick)

  return () => cancelAnimationFrame(raf)
}
