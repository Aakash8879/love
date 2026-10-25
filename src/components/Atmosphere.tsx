import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

type Particle = {
  x: number; y: number; r: number; vx: number; vy: number
  rot: number; vr: number; petal: boolean; color: string; a: number; phase: number
}

/** A single lightweight canvas of drifting rose petals and glowing motes over the whole site. */
export default function Atmosphere() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let w = 0, h = 0, raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const petalColors = ['#E9A5B5', '#F7DDE2', '#D98FA3']
    const spawn = (initial: boolean): Particle => {
      const petal = Math.random() < 0.5
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : petal ? -20 : h + 20,
        r: petal ? 5 + Math.random() * 6 : 0.8 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: petal ? 0.25 + Math.random() * 0.4 : -(0.08 + Math.random() * 0.18),
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.02,
        petal,
        color: petal ? petalColors[Math.floor(Math.random() * petalColors.length)] : '#D7B77A',
        a: petal ? 0.3 + Math.random() * 0.3 : 0.35 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      }
    }
    const count = w < 640 ? 12 : 22
    const parts = Array.from({ length: count }, () => spawn(true))

    let t = 0
    let last = performance.now()
    const tick = (now: number) => {
      // time-based motion so speed stays the same on 60Hz and 120Hz screens
      const dt = Math.min((now - last) / 16.67, 3)
      last = now
      if (document.hidden) { raf = requestAnimationFrame(tick); return }
      t += 0.01 * dt
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        p.x += (p.vx + Math.sin(t + p.phase) * (p.petal ? 0.35 : 0.12)) * dt
        p.y += p.vy * dt
        p.rot += p.vr * dt
        if (p.y > h + 30 || p.y < -30) parts[i] = spawn(false)
        ctx.globalAlpha = p.petal ? p.a : p.a * (0.6 + 0.4 * Math.sin(t * 3 + p.phase))
        if (p.petal) {
          const c = Math.cos(p.rot) * dpr, s = Math.sin(p.rot) * dpr
          ctx.setTransform(c, s, -s, c, p.x * dpr, p.y * dpr)
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.setTransform(dpr, 0, 0, dpr, p.x * dpr, p.y * dpr)
          ctx.fillStyle = p.color
          ctx.globalAlpha *= 0.25
          ctx.beginPath(); ctx.arc(0, 0, p.r * 4, 0, Math.PI * 2); ctx.fill()
          ctx.globalAlpha *= 3
          ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill()
        }
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [reduce])

  if (reduce) return null
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[55]" />
}
