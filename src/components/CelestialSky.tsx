import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Sparkles, Star } from 'lucide-react'
import { config } from '../config'

interface ShootingStar {
  id: number
  x: number
  y: number
  length: number
  speed: number
  angle: number
  thickness: number
  color: string
  glowColor: string
  life: number
  maxLife: number
  sparks: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[]
}

interface CelestialRipple {
  id: number
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
}

export interface CelestialSkyHandle {
  triggerWish: (x?: number, y?: number) => void
  triggerShower: (count?: number) => void
}

interface CelestialSkyProps {
  variant?: 'garden' | 'finale'
  shower?: boolean
  interactive?: boolean
  className?: string
  showConstellations?: boolean
}

const WISHING_MESSAGES = [
  `A wish was made upon a shooting star for ${config.herName} ♡`,
  'May every silent wish in your heart come true ✨',
  'The universe heard your sweetest wish tonight 💫',
  `Written in the stars for ${config.herName} & ${config.yourName} 🌟`,
  'Close your eyes... your wish is already on its way ♡',
  `Out of all the stars in the cosmos, ${config.herName} shines the brightest ✨`,
]

/**
 * 💫 Celestial Wishing Skies & Shooting Stars
 * - Realistic meteor physics with glowing heads, stardust tails, and falling ember sparks.
 * - Tap / Click anywhere on the night sky to make a celestial wish and shoot a star!
 * - Floating wishing toasts with romantic personalized messages.
 * - Automatic background meteors and celebratory meteor showers.
 * - Hardware-accelerated Canvas with retina devicePixelRatio scaling.
 */
const CelestialSky = forwardRef<CelestialSkyHandle, CelestialSkyProps>(function CelestialSky(
  {
    variant = 'garden',
    shower = false,
    interactive = true,
    className = '',
    showConstellations = true,
  },
  ref
) {
  const reduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const shootingStarsRef = useRef<ShootingStar[]>([])
  const ripplesRef = useRef<CelestialRipple[]>([])
  const animFrameRef = useRef<number | null>(null)
  const lastSpawnRef = useRef<number>(Date.now())
  const wishMessageTimerRef = useRef<number | null>(null)

  const [activeWish, setActiveWish] = useState<string | null>(null)
  const [wishCount, setWishCount] = useState<number>(0)

  // Spawn a realistic shooting star
  const spawnStar = useCallback(
    (customX?: number, customY?: number, isWish = false) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      // Angle: standard 35° to 45° diagonal meteor direction
      const angle = Math.PI * (0.2 + (Math.random() - 0.5) * 0.08) // ~36° - 42°

      // Starting coordinate
      let startX: number
      let startY: number

      if (customX !== undefined && customY !== undefined) {
        // Star originates from slightly above-left of tap position
        startX = Math.max(-50, customX - 180 - Math.random() * 80)
        startY = Math.max(-50, customY - 140 - Math.random() * 60)
      } else {
        // Natural meteor across top-left quadrant of sky
        startX = Math.random() * (w * 0.75) - 40
        startY = Math.random() * (h * 0.45) - 40
      }

      const colors = ['#FFF9F5', '#D7B77A', '#F7DDE2', '#EED8A1']
      const glowColors = [
        'rgba(215, 183, 122, 0.9)',
        'rgba(233, 165, 181, 0.85)',
        'rgba(255, 249, 245, 0.95)',
      ]

      const chosenColor = colors[Math.floor(Math.random() * colors.length)]
      const chosenGlow = glowColors[Math.floor(Math.random() * glowColors.length)]

      const star: ShootingStar = {
        id: Date.now() + Math.random(),
        x: startX,
        y: startY,
        length: isWish ? 180 + Math.random() * 120 : 130 + Math.random() * 90,
        speed: isWish ? 20 + Math.random() * 8 : 15 + Math.random() * 7,
        angle,
        thickness: isWish ? 2.6 : 1.8 + Math.random() * 0.8,
        color: chosenColor,
        glowColor: chosenGlow,
        life: 0,
        maxLife: isWish ? 48 : 38 + Math.floor(Math.random() * 12),
        sparks: [],
      }

      shootingStarsRef.current.push(star)
    },
    []
  )

  // Public imperative handle for external triggering (e.g. all flowers found or finale hug)
  useImperativeHandle(ref, () => ({
    triggerWish: (x?: number, y?: number) => {
      triggerCelestialWish(x, y)
    },
    triggerShower: (count = 7) => {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          spawnStar()
        }, i * 280)
      }
    },
  }))

  // Trigger interactive wish
  const triggerCelestialWish = useCallback(
    (clickX?: number, clickY?: number) => {
      spawnStar(clickX, clickY, true)
      // Slight delayed companion star for majestic wishing effect
      setTimeout(() => {
        spawnStar(clickX ? clickX + 40 : undefined, clickY ? clickY + 20 : undefined, false)
      }, 160)

      // Celestial ripple at tap point
      if (clickX !== undefined && clickY !== undefined) {
        ripplesRef.current.push({
          id: Date.now() + Math.random(),
          x: clickX,
          y: clickY,
          radius: 5,
          maxRadius: 75,
          alpha: 0.9,
        })
      }

      // Display romantic wishing message toast
      const nextMsg = WISHING_MESSAGES[wishCount % WISHING_MESSAGES.length]
      setActiveWish(nextMsg)
      setWishCount((c) => c + 1)

      if (wishMessageTimerRef.current) clearTimeout(wishMessageTimerRef.current)
      wishMessageTimerRef.current = window.setTimeout(() => {
        setActiveWish(null)
      }, 4000)
    },
    [spawnStar, wishCount]
  )

  // Listen to shower prop triggers
  useEffect(() => {
    if (shower) {
      const timerIds: number[] = []
      for (let i = 0; i < 9; i++) {
        timerIds.push(
          window.setTimeout(() => {
            spawnStar()
          }, i * 220)
        )
      }
      return () => timerIds.forEach(clearTimeout)
    }
  }, [shower, spawnStar])

  // Canvas lifecycle & animation loop
  useEffect(() => {
    if (reduce || typeof window === 'undefined') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = window.devicePixelRatio || 1

    const resize = () => {
      dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.resetTransform?.()
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    // Animation frame render loop
    const render = () => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      ctx.clearRect(0, 0, w, h)

      const now = Date.now()

      // Automatic natural shooting stars (every 4.5 to 7.5 seconds)
      const interval = variant === 'finale' ? 4200 : 5400
      if (now - lastSpawnRef.current > interval) {
        spawnStar()
        // 25% chance of twin meteor
        if (Math.random() < 0.28) {
          setTimeout(() => spawnStar(), 300)
        }
        lastSpawnRef.current = now
      }

      // 1. Draw Celestial Tap Ripples
      const ripples = ripplesRef.current
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        r.radius += (r.maxRadius - r.radius) * 0.08
        r.alpha *= 0.95

        if (r.alpha < 0.02) {
          ripples.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.strokeStyle = '#D7B77A'
        ctx.lineWidth = 1.2
        ctx.globalAlpha = r.alpha
        ctx.shadowColor = '#D7B77A'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.stroke()

        // Inner glowing star core
        ctx.fillStyle = '#FFF9F5'
        ctx.globalAlpha = r.alpha * 0.8
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // 2. Draw Shooting Stars with Glowing Tail & Stardust
      const stars = shootingStarsRef.current
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i]
        s.life++

        const progress = s.life / s.maxLife
        if (progress >= 1 || s.x > w + 200 || s.y > h + 200) {
          stars.splice(i, 1)
          continue
        }

        // Calculate meteor head opacity (quick fade in, sustained brightness, smooth tail fade)
        let opacity = 1
        if (progress < 0.15) {
          opacity = progress / 0.15
        } else if (progress > 0.65) {
          opacity = (1 - progress) / 0.35
        }

        // Move meteor head along trajectory
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed

        // Tail origin coordinates (trailing behind head)
        const tailX = s.x - Math.cos(s.angle) * s.length
        const tailY = s.y - Math.sin(s.angle) * s.length

        // Spawn lingering stardust sparks along tail
        if (Math.random() < 0.45) {
          s.sparks.push({
            x: s.x - Math.cos(s.angle) * (Math.random() * (s.length * 0.6)),
            y: s.y - Math.sin(s.angle) * (Math.random() * (s.length * 0.6)),
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 + 0.2,
            alpha: opacity * 0.9,
            size: Math.random() * 1.8 + 1,
          })
        }

        // Draw lingering stardust sparks
        for (let j = s.sparks.length - 1; j >= 0; j--) {
          const sp = s.sparks[j]
          sp.x += sp.vx
          sp.y += sp.vy
          sp.alpha *= 0.9
          if (sp.alpha < 0.03) {
            s.sparks.splice(j, 1)
            continue
          }
          ctx.save()
          ctx.fillStyle = s.color
          ctx.globalAlpha = sp.alpha
          ctx.beginPath()
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }

        // Render Meteor Head & Long Gradient Tail
        ctx.save()
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)')
        grad.addColorStop(0.65, s.glowColor.replace(/[\d.]+\)$/, `${opacity * 0.45})`))
        grad.addColorStop(0.92, s.glowColor.replace(/[\d.]+\)$/, `${opacity * 0.85})`))
        grad.addColorStop(1, s.color)

        ctx.strokeStyle = grad
        ctx.lineWidth = s.thickness
        ctx.lineCap = 'round'
        ctx.globalAlpha = opacity

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(s.x, s.y)
        ctx.stroke()

        // Brilliant glowing Meteor Head
        ctx.fillStyle = '#FFFFFF'
        ctx.shadowColor = s.color
        ctx.shadowBlur = 12
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.thickness * 1.3, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [reduce, variant, spawnStar])

  // Click on the celestial sky to make a wish
  const handleSkyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    triggerCelestialWish(x, y)
  }

  return (
    <div
      onClick={handleSkyClick}
      className={`pointer-events-auto absolute inset-0 select-none overflow-hidden ${
        interactive ? 'cursor-pointer' : 'pointer-events-none'
      } ${className}`}
      aria-label="Celestial Wishing Sky. Tap anywhere to make a wish upon a shooting star."
    >
      {/* Background Constellation Lines (Bhavana & Vikash Heart Constellation) */}
      {showConstellations && (
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40">
          <svg className="h-full w-full opacity-60" viewBox="0 0 1000 600" preserveAspectRatio="none">
            {/* Subtle celestial constellation lines */}
            <g stroke="#D7B77A" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.35">
              <line x1="140" y1="90" x2="220" y2="130" />
              <line x1="220" y1="130" x2="290" y2="80" />
              <line x1="290" y1="80" x2="360" y2="120" />
              <line x1="360" y1="120" x2="250" y2="210" />
              <line x1="250" y1="210" x2="140" y2="90" />

              <line x1="780" y1="70" x2="850" y2="110" />
              <line x1="850" y1="110" x2="920" y2="65" />
              <line x1="850" y1="110" x2="870" y2="190" />
            </g>
            {/* Constellation Star Vertices */}
            <circle cx="140" cy="90" r="2.2" fill="#FFF9F5" />
            <circle cx="220" cy="130" r="1.8" fill="#D7B77A" />
            <circle cx="290" cy="80" r="2.4" fill="#FFF9F5" />
            <circle cx="360" cy="120" r="1.8" fill="#D7B77A" />
            <circle cx="250" cy="210" r="2.8" fill="#FFF9F5" />

            <circle cx="780" cy="70" r="2.2" fill="#D7B77A" />
            <circle cx="850" cy="110" r="2.5" fill="#FFF9F5" />
            <circle cx="920" cy="65" r="2" fill="#D7B77A" />
            <circle cx="870" cy="190" r="2" fill="#FFF9F5" />
          </svg>
        </div>
      )}

      {/* Dynamic Shooting Stars & Wishing Ripples Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Interactive Wishing Sky Floating Hint */}
      {interactive && (
        <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-champagne/30 bg-plum/60 px-3 py-1 text-[11px] font-medium tracking-wide text-champagne/90 shadow-md backdrop-blur-md transition-opacity duration-300">
          <Star className="h-3 w-3 fill-champagne text-champagne animate-pulse" />
          <span>Tap the sky to make a wish ✨</span>
        </div>
      )}

      {/* Romantic Celestial Wish Toast Notification */}
      <AnimatePresence>
        {activeWish && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 220 }}
            className="pointer-events-none absolute left-1/2 top-16 z-30 -translate-x-1/2"
          >
            <div className="flex items-center gap-2.5 rounded-full border border-champagne/50 bg-plum/85 px-6 py-2.5 text-center text-sm font-medium text-ivory shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <Sparkles className="h-4 w-4 shrink-0 text-champagne animate-spin" style={{ animationDuration: '4s' }} />
              <span className="font-hand text-lg leading-none text-champagne sm:text-xl">
                {activeWish}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export default CelestialSky
