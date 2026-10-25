import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  maxSize: number
  type: 'heart' | 'star' | 'mote' | 'ring'
  color: string
  alpha: number
  rotation: number
  rotationSpeed: number
  life: number
  maxLife: number
  swayOffset: number
  swaySpeed: number
}

// Romantic color palette matching the universe theme
const SPARKLE_COLORS = [
  '#D7B77A', // Champagne gold
  '#E9A5B5', // Petal pink
  '#FFF9F5', // Starlight ivory
  '#F7DDE2', // Soft blush
  '#E594A5', // Rose
  '#F3D08A', // Warm gold
]

/**
 * 💫 Magical Touch Sparkle & Heart Trail (Mobile & Desktop)
 * - Renders a high-performance GPU-accelerated Canvas particle trail on both mobile touch and desktop cursor.
 * - Spawns romantic floating hearts, diamond stars, and glowing stardust motes as you swipe, tap, or move.
 * - Features explosive fairy-tale tap/click blooms on touch & click.
 * - Includes a smooth desktop magnetic cursor follower ring.
 * - Fully passive touch listeners: 60-120fps native scrolling with zero jank.
 * - Auto-sleeping requestAnimationFrame loop (0% idle CPU usage).
 */
export default function CustomCursor() {
  const reduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number | null>(null)
  const isRunningRef = useRef(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  // Desktop magnetic cursor ring state
  const [isDesktop, setIsDesktop] = useState(false)
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const springX = useSpring(mouseX, { stiffness: 400, damping: 28, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 400, damping: 28, mass: 0.5 })

  // Initialize desktop pointer detection
  useEffect(() => {
    if (typeof window === 'undefined') return
    const finePointer = window.matchMedia('(pointer: fine)').matches
    setIsDesktop(finePointer)
  }, [])

  // Canvas particle engine lifecycle
  useEffect(() => {
    if (reduce || typeof window === 'undefined') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let dpr = window.devicePixelRatio || 1

    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.resetTransform?.()
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas, { passive: true })

    // Helper: Wake up animation loop if sleeping
    const wakeUpLoop = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true
        animFrameRef.current = requestAnimationFrame(loop)
      }
    }

    // Helper: Spawn single trail particle
    const spawnTrailParticle = (x: number, y: number, speed = 1) => {
      const typeRoll = Math.random()
      const type: Particle['type'] = typeRoll < 0.38 ? 'heart' : typeRoll < 0.82 ? 'star' : 'mote'
      const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)]
      const angle = Math.random() * Math.PI * 2
      const spread = Math.random() * 1.6 * speed

      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * spread,
        vy: type === 'heart' ? -(Math.random() * 1.4 + 0.6) : Math.sin(angle) * spread - 0.4,
        size: type === 'heart' ? Math.random() * 7 + 9 : type === 'star' ? Math.random() * 6 + 7 : Math.random() * 2.5 + 2,
        maxSize: type === 'heart' ? 16 : 14,
        type,
        color,
        alpha: 1,
        rotation: (Math.random() - 0.5) * 0.6,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        life: 0,
        maxLife: Math.floor(Math.random() * 25 + 35), // ~0.6s to 1.0s
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.08 + 0.04,
      })

      wakeUpLoop()
    }

    // Helper: Spawn magical blossom burst on tap or click
    const spawnBurst = (x: number, y: number) => {
      const burstCount = 14
      // Expanding halo ring
      particlesRef.current.push({
        x,
        y,
        vx: 0,
        vy: 0,
        size: 8,
        maxSize: 45,
        type: 'ring',
        color: '#D7B77A',
        alpha: 0.9,
        rotation: 0,
        rotationSpeed: 0,
        life: 0,
        maxLife: 28,
        swayOffset: 0,
        swaySpeed: 0,
      })

      // Radial burst of stars, hearts & sparkles
      for (let i = 0; i < burstCount; i++) {
        const type: Particle['type'] = i % 3 === 0 ? 'heart' : 'star'
        const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
        const burstSpeed = Math.random() * 3.5 + 2.0
        const color = SPARKLE_COLORS[i % SPARKLE_COLORS.length]

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * burstSpeed,
          vy: Math.sin(angle) * burstSpeed - (type === 'heart' ? 1.0 : 0.4),
          size: type === 'heart' ? Math.random() * 6 + 10 : Math.random() * 6 + 8,
          maxSize: 18,
          type,
          color,
          alpha: 1,
          rotation: (Math.random() - 0.5) * 1.2,
          rotationSpeed: (Math.random() - 0.5) * 0.12,
          life: 0,
          maxLife: Math.floor(Math.random() * 25 + 40),
          swayOffset: Math.random() * Math.PI * 2,
          swaySpeed: 0.06,
        })
      }

      wakeUpLoop()
    }

    // Pointer move listener (Desktop mouse / stylus)
    const handlePointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      const el = e.target as HTMLElement | null
      setIsHoveringInteractive(!!el?.closest('button, a, [data-cursor="hover"], input, [role="button"]'))

      if (lastPosRef.current) {
        const dx = e.clientX - lastPosRef.current.x
        const dy = e.clientY - lastPosRef.current.y
        const dist = Math.hypot(dx, dy)

        if (dist > 9) {
          spawnTrailParticle(e.clientX, e.clientY, Math.min(2.2, dist / 20))
          if (dist > 35) {
            spawnTrailParticle(
              lastPosRef.current.x + dx * 0.5,
              lastPosRef.current.y + dy * 0.5,
              1
            )
          }
          lastPosRef.current = { x: e.clientX, y: e.clientY }
        }
      } else {
        lastPosRef.current = { x: e.clientX, y: e.clientY }
        spawnTrailParticle(e.clientX, e.clientY)
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      setIsClicking(true)
      spawnBurst(e.clientX, e.clientY)
    }

    const handlePointerUp = () => {
      setIsClicking(false)
    }

    // Touch event listeners (Mobile swipe, taps & multi-touch gestures)
    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i]
        spawnBurst(t.clientX, t.clientY)
      }
      if (e.touches[0]) {
        lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i]
        if (lastPosRef.current) {
          const dx = t.clientX - lastPosRef.current.x
          const dy = t.clientY - lastPosRef.current.y
          const dist = Math.hypot(dx, dy)
          if (dist > 10) {
            spawnTrailParticle(t.clientX, t.clientY, 1.4)
            lastPosRef.current = { x: t.clientX, y: t.clientY }
          }
        } else {
          lastPosRef.current = { x: t.clientX, y: t.clientY }
          spawnTrailParticle(t.clientX, t.clientY)
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const t = e.changedTouches[0]
        spawnTrailParticle(t.clientX, t.clientY, 1.8)
      }
      lastPosRef.current = null
    }

    // Register listeners
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Drawing functions
    const drawHeart = (p: Particle) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = 8

      const s = p.size / 16
      ctx.beginPath()
      ctx.moveTo(0, s * -4)
      ctx.bezierCurveTo(s * -7, s * -11, s * -14, s * -2, 0, s * 10)
      ctx.bezierCurveTo(s * 14, s * -2, s * 7, s * -11, 0, s * -4)
      ctx.fill()
      ctx.restore()
    }

    const drawStar = (p: Particle) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = 10

      ctx.beginPath()
      const outer = p.size
      const inner = p.size * 0.2
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? outer : inner
        const angle = (i * Math.PI) / 4
        const px = Math.cos(angle) * r
        const py = Math.sin(angle) * r
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()

      // Center bright starlight core
      ctx.fillStyle = '#FFF9F5'
      ctx.beginPath()
      ctx.arc(0, 0, inner * 0.75, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawMote = (p: Particle) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = 6
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawRing = (p: Particle) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.globalAlpha = p.alpha
      ctx.strokeStyle = p.color
      ctx.lineWidth = 1.5
      ctx.shadowColor = p.color
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }

    // Main animation loop
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

      const particles = particlesRef.current

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++

        const progress = p.life / p.maxLife

        if (progress >= 1) {
          particles.splice(i, 1)
          continue
        }

        // Particle physics
        if (p.type === 'ring') {
          p.size += (p.maxSize - p.size) * 0.14
          p.alpha = Math.max(0, (1 - progress) * 0.85)
        } else {
          // Floating physics with gentle sway
          p.swayOffset += p.swaySpeed
          const sway = Math.sin(p.swayOffset) * 0.4
          p.x += p.vx + sway
          p.y += p.vy
          p.vx *= 0.96
          p.vy *= 0.96

          if (p.type === 'heart') {
            p.vy -= 0.04 // gentle upward balloon float
          } else {
            p.vy -= 0.015
          }

          p.rotation += p.rotationSpeed
          // Smooth quadratic opacity fade-out
          p.alpha = Math.max(0, (1 - progress) * (1 - progress * 0.3))
        }

        // Draw particle
        if (p.type === 'heart') drawHeart(p)
        else if (p.type === 'star') drawStar(p)
        else if (p.type === 'mote') drawMote(p)
        else if (p.type === 'ring') drawRing(p)
      }

      // If particles remain, keep running. If empty, sleep loop to save battery
      if (particles.length > 0) {
        animFrameRef.current = requestAnimationFrame(loop)
      } else {
        isRunningRef.current = false
      }
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [reduce, mouseX, mouseY])

  return (
    <>
      {/* High-performance hardware-accelerated Touch Sparkle & Heart Trail Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[65] h-full w-full"
      />

      {/* Desktop Magnetic Follower Ring (fine pointer only) */}
      {isDesktop && !reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[70] h-9 w-9 rounded-full border border-champagne/85 shadow-[0_0_12px_rgba(215,183,122,0.3)] backdrop-blur-[0.5px]"
          style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
          animate={{
            scale: isClicking ? 0.8 : isHoveringInteractive ? 1.8 : 1,
            backgroundColor: isHoveringInteractive
              ? 'rgba(215, 183, 122, 0.22)'
              : isClicking
              ? 'rgba(233, 165, 181, 0.3)'
              : 'rgba(215, 183, 122, 0.03)',
            borderColor: isHoveringInteractive ? '#D7B77A' : 'rgba(215, 183, 122, 0.75)',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 24 }}
        >
          {/* Inner jewel center dot */}
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne shadow-[0_0_6px_#D7B77A]" />
        </motion.div>
      )}
    </>
  )
}
