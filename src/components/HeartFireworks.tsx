import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { letterFx } from '../lib/letterAudio'

export type HeartFireworksHandle = {
  launch: (targetX?: number, targetY?: number) => void
  launchShow: (count?: number) => void
}

type TrailPoint = {
  x: number
  y: number
}

type Rocket = {
  x: number
  y: number
  vx: number
  vy: number
  targetY: number
  color: string
  trail: TrailPoint[]
  soundPlayed?: boolean
}

type Spark = {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  alpha: number
  decay: number
  size: number
  shimmer: boolean
  trail: TrailPoint[]
}

const PALETTES = [
  // Rose gold & blush
  ['#FFE0E9', '#F7DDE2', '#E9A5B5', '#FFF0F5'],
  // Golden champagne & starlight
  ['#FFF9E5', '#D7B77A', '#FFE3A8', '#FFFFFF'],
  // Ruby passion & warm pink
  ['#FF3366', '#E9A5B5', '#FF7597', '#FFF5F8'],
  // Royal violet & gold
  ['#E9A5B5', '#D7B77A', '#FFB6C1', '#FFF'],
]

/**
 * High-performance 60fps Canvas Heart-Shaped Fireworks engine.
 * Automatically sleeps when no particles are on screen to preserve 100% CPU/battery.
 */
const HeartFireworks = forwardRef<HeartFireworksHandle, { className?: string }>(
  ({ className = '' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rocketsRef = useRef<Rocket[]>([])
    const sparksRef = useRef<Spark[]>([])
    const isRunningRef = useRef(false)
    const rafIdRef = useRef<number | null>(null)

    // Launch a single firework rocket towards (targetX, targetY)
    const launchRocket = (targetX?: number, targetY?: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const w = canvas.width / (window.devicePixelRatio > 1 ? 2 : 1)
      const h = canvas.height / (window.devicePixelRatio > 1 ? 2 : 1)

      const startX = w * (0.2 + Math.random() * 0.6)
      const destX = targetX !== undefined ? targetX : w * (0.25 + Math.random() * 0.5)
      const destY = targetY !== undefined ? targetY : h * (0.18 + Math.random() * 0.35)

      const dx = destX - startX
      const dy = destY - h
      const dist = Math.hypot(dx, dy)
      const speed = 10 + Math.random() * 3

      const vx = (dx / dist) * speed
      const vy = (dy / dist) * speed

      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)]
      const color = palette[Math.floor(Math.random() * palette.length)]

      rocketsRef.current.push({
        x: startX,
        y: h,
        vx,
        vy,
        targetY: destY,
        color,
        trail: [],
      })

      letterFx.playFireworkLaunch()

      // Wake up the animation loop if sleeping
      if (!isRunningRef.current) {
        isRunningRef.current = true
        tick()
      }
    }

    // Launch a synchronized multi-rocket grand display
    const launchShow = (count = 5) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const w = canvas.width / (window.devicePixelRatio > 1 ? 2 : 1)
      const h = canvas.height / (window.devicePixelRatio > 1 ? 2 : 1)

      for (let i = 0; i < count; i++) {
        window.setTimeout(() => {
          const tx = w * (0.2 + (i / (count - 1 || 1)) * 0.6 + (Math.random() - 0.5) * 0.12)
          const ty = h * (0.18 + Math.random() * 0.28)
          launchRocket(tx, ty)
        }, i * 320)
      }
    }

    useImperativeHandle(ref, () => ({
      launch: launchRocket,
      launchShow,
    }))

    // Explode a rocket into mathematical parametric heart particles
    const explode = (x: number, y: number, baseColor: string) => {
      letterFx.playFireworkBurst()

      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)]
      const count = 75
      const scale = 0.28 + Math.random() * 0.12

      // 1. Parametric heart-shaped perimeter sparks
      for (let i = 0; i < count; i++) {
        const t = (Math.PI * 2 * i) / count
        // Heart curve formula:
        // x = 16 sin^3(t)
        // y = -(13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t))
        const sinT = Math.sin(t)
        const hx = 16 * Math.pow(sinT, 3)
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))

        // Direction vector from origin
        const speedMultiplier = scale * (0.9 + Math.random() * 0.25)
        const vx = hx * speedMultiplier + (Math.random() - 0.5) * 0.5
        const vy = hy * speedMultiplier + (Math.random() - 0.5) * 0.5

        const color = i % 4 === 0 ? baseColor : palette[i % palette.length]

        sparksRef.current.push({
          x,
          y,
          vx,
          vy,
          color,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.008,
          size: 2.2 + Math.random() * 1.5,
          shimmer: Math.random() > 0.35,
          trail: [],
        })
      }

      // 2. Inner glowing core heart sparks
      const innerCount = 20
      for (let i = 0; i < innerCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 1.8
        sparksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4,
          color: '#FFFFFF',
          alpha: 1,
          decay: 0.025 + Math.random() * 0.015,
          size: 1.8 + Math.random() * 1.2,
          shimmer: true,
          trail: [],
        })
      }
    }

    // Main Canvas 60fps render loop
    const tick = () => {
      const canvas = canvasRef.current
      if (!canvas) {
        isRunningRef.current = false
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        isRunningRef.current = false
        return
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // -------------------------------------------------------------
      // 1. UPDATE & DRAW ROCKETS
      // -------------------------------------------------------------
      const activeRockets: Rocket[] = []
      for (let i = 0; i < rocketsRef.current.length; i++) {
        const r = rocketsRef.current[i]
        r.trail.push({ x: r.x, y: r.y })
        if (r.trail.length > 8) r.trail.shift()

        r.x += r.vx
        r.y += r.vy
        r.vy += 0.08 // slight gravity deceleration

        // Draw rocket ascending streak
        ctx.save()
        ctx.scale(dpr, dpr)
        ctx.beginPath()
        if (r.trail.length > 1) {
          ctx.moveTo(r.trail[0].x, r.trail[0].y)
          for (let j = 1; j < r.trail.length; j++) {
            ctx.lineTo(r.trail[j].x, r.trail[j].y)
          }
        } else {
          ctx.moveTo(r.x, r.y + 4)
          ctx.lineTo(r.x, r.y)
        }
        ctx.strokeStyle = '#FFE3A8'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.shadowColor = '#D7B77A'
        ctx.shadowBlur = 6
        ctx.stroke()

        // Glowing rocket head
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Check if rocket reached apex or target height
        if (r.y <= r.targetY || r.vy >= -0.5) {
          explode(r.x, r.y, r.color)
        } else {
          activeRockets.push(r)
        }
      }
      rocketsRef.current = activeRockets

      // -------------------------------------------------------------
      // 2. UPDATE & DRAW HEART SPARKS
      // -------------------------------------------------------------
      const activeSparks: Spark[] = []
      for (let i = 0; i < sparksRef.current.length; i++) {
        const s = sparksRef.current[i]

        s.trail.push({ x: s.x, y: s.y })
        if (s.trail.length > 5) s.trail.shift()

        s.vx *= 0.982 // drag
        s.vy *= 0.982
        s.vy += 0.045 // gravity
        s.x += s.vx
        s.y += s.vy
        s.alpha -= s.decay

        if (s.alpha > 0.01) {
          ctx.save()
          ctx.scale(dpr, dpr)

          const currentAlpha = s.shimmer && Math.random() < 0.25 ? s.alpha * 0.35 : s.alpha

          // Spark trailing motion streamer
          if (s.trail.length > 1) {
            ctx.beginPath()
            ctx.moveTo(s.trail[0].x, s.trail[0].y)
            for (let j = 1; j < s.trail.length; j++) {
              ctx.lineTo(s.trail[j].x, s.trail[j].y)
            }
            ctx.strokeStyle = s.color
            ctx.globalAlpha = currentAlpha * 0.6
            ctx.lineWidth = s.size * 0.75
            ctx.lineCap = 'round'
            ctx.stroke()
          }

          // Spark head glow
          ctx.globalAlpha = currentAlpha
          ctx.fillStyle = s.color
          ctx.shadowColor = s.color
          ctx.shadowBlur = 5
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 0.8, 0, Math.PI * 2)
          ctx.fill()

          ctx.restore()
          activeSparks.push(s)
        }
      }
      sparksRef.current = activeSparks

      // -------------------------------------------------------------
      // 3. SLEEP LOOP IF EMPTY (0% CPU IDLE)
      // -------------------------------------------------------------
      if (rocketsRef.current.length > 0 || sparksRef.current.length > 0) {
        rafIdRef.current = requestAnimationFrame(tick)
      } else {
        isRunningRef.current = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    // Handle canvas resize
    useEffect(() => {
      const handleResize = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const rect = canvas.getBoundingClientRect()
        canvas.width = Math.floor(rect.width * dpr)
        canvas.height = Math.floor(rect.height * dpr)
      }

      handleResize()
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      }
    }, [])

    return (
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      />
    )
  },
)

HeartFireworks.displayName = 'HeartFireworks'
export default HeartFireworks
