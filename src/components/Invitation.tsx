import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Clock, Sparkles } from 'lucide-react'
import { config } from '../config'
import Heart from './Heart'
import { letterFx } from '../lib/letterAudio'
import { resetScrollTop } from '../lib/smoothScroll'

const EASE = [0.7, 0, 0.2, 1] as const

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  hasReached: boolean
}

function calculateCountdown(targetDateString: string): CountdownTime {
  const target = new Date(targetDateString).getTime()
  const now = Date.now()
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, hasReached: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds, hasReached: false }
}

/** Screen 1: Velvet curtain invitation with live birthday countdown and automatic unlock */
export default function Invitation({ onOpen }: { onOpen: () => void }) {
  const [leaving, setLeaving] = useState(false)
  const reduce = useReducedMotion()
  const btn = useRef<HTMLButtonElement>(null)

  const { targetDate, countdownBadge, birthdayArrivedBadge } = config.invitation

  const [time, setTime] = useState<CountdownTime>(() => calculateCountdown(targetDate))
  const wasCountingRef = useRef(!time.hasReached)

  useEffect(() => {
    resetScrollTop()
    btn.current?.focus({ preventScroll: true })
  }, [])

  const open = () => {
    if (leaving) return
    setLeaving(true)
    resetScrollTop()
    letterFx.playSealBreak()
    window.setTimeout(() => {
      resetScrollTop()
      onOpen()
    }, reduce ? 250 : 1900)
  }

  // Live countdown timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      const nextTime = calculateCountdown(targetDate)
      setTime(nextTime)

      // When countdown reaches zero while on the page, automatically unlock!
      if (wasCountingRef.current && nextTime.hasReached) {
        wasCountingRef.current = false
        // Play celebratory chime and open main page
        setTimeout(() => {
          open()
        }, 1200)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, open])

  const curtain = { duration: reduce ? 0.2 : 1.4, ease: EASE, delay: reduce ? 0 : 0.45 }

  const formattedTargetDate = useMemo(() => {
    try {
      const d = new Date(targetDate)
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch {
      return ''
    }
  }, [targetDate])

  const countdownUnits = [
    { label: 'Days', value: time.days.toString().padStart(2, '0') },
    { label: 'Hours', value: time.hours.toString().padStart(2, '0') },
    { label: 'Mins', value: time.minutes.toString().padStart(2, '0') },
    { label: 'Secs', value: time.seconds.toString().padStart(2, '0'), isLive: true },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Curtain Left Half */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          background:
            'radial-gradient(120% 80% at 100% 50%, #4B1728 0%, #2b1424 45%, #21131F 100%)',
        }}
        animate={leaving ? { x: '-101%' } : { x: 0 }}
        transition={curtain}
      >
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-champagne/50 to-transparent" />
      </motion.div>

      {/* Curtain Right Half */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          background:
            'radial-gradient(120% 80% at 0% 50%, #4B1728 0%, #2b1424 45%, #21131F 100%)',
        }}
        animate={leaving ? { x: '101%' } : { x: 0 }}
        transition={curtain}
      >
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-champagne/50 to-transparent" />
      </motion.div>

      {/* Soft light blooming as curtains part */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[75vmax] w-[75vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,249,245,0.92) 0%, rgba(247,221,226,0.55) 25%, transparent 60%)',
        }}
        initial={{ opacity: 0, scale: 0.2 }}
        animate={
          leaving ? { opacity: [0, 0.9, 0], scale: [0.2, 1, 1.6] } : { opacity: 0.08, scale: 0.6 }
        }
        transition={{ duration: leaving ? 1.6 : 0.1, ease: 'easeOut' }}
      />

      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      {/* Screen 1 Invitation Content */}
      <motion.div
        className="relative flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-12 text-center text-ivory"
        animate={leaving ? { opacity: 0, y: -24, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduce ? 0.1 : 0.7, ease: 'easeOut' }}
      >
        {/* Top Gold Heart Ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-6 flex items-center gap-4 text-champagne"
          aria-hidden
        >
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-champagne/70" />
          <Heart className="h-4 w-4" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-champagne/70" />
        </motion.div>

        {/* Live Countdown Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/35 bg-plum/60 px-4 py-1.5 text-xs font-semibold tracking-wider text-champagne shadow-md backdrop-blur-md"
        >
          {time.hasReached ? (
            <>
              <Sparkles className="h-3.5 w-3.5 text-champagne animate-pulse" />
              <span>{birthdayArrivedBadge}</span>
            </>
          ) : (
            <>
              <Clock className="h-3.5 w-3.5 text-champagne animate-pulse" />
              <span className="uppercase">{countdownBadge}</span>
            </>
          )}
        </motion.div>

        {/* Main Title */}
        <motion.h1
          id="invite-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-balance max-w-4xl font-serif text-[clamp(2.4rem,7.5vw,5.5rem)] leading-[0.98] tracking-[-0.01em]"
        >
          {config.invitation.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="text-balance mt-4 max-w-md text-base leading-relaxed text-blush/80 sm:text-lg"
        >
          {config.invitation.subtitle}
        </motion.p>

        {/* ============================================================ */}
        {/* ⏳ LIVE BIRTHDAY COUNTDOWN CARDS                             */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="my-7 w-full max-w-md"
        >
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
            {countdownUnits.map((unit) => (
              <div
                key={unit.label}
                className="relative flex flex-col items-center justify-center rounded-2xl border border-champagne/30 bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-transparent p-3 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-4"
              >
                {/* Live beacon for seconds */}
                {unit.isLive && !time.hasReached && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80] animate-ping" />
                )}

                <span className="font-serif text-2xl font-bold tracking-tight text-champagne drop-shadow-sm sm:text-4xl">
                  {unit.value}
                </span>
                <span className="mt-0.5 text-[10px] font-semibold tracking-widest text-blush/75 uppercase">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          {!time.hasReached && formattedTargetDate && (
            <p className="mt-3 text-xs tracking-wide text-champagne/75">
              Unlocks automatically on {formattedTargetDate} ✨
            </p>
          )}
        </motion.div>

        {/* Open Button (Clickable anytime or when unlocked) */}
        <motion.button
          ref={btn}
          type="button"
          onClick={open}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="btn-glow min-h-[52px] rounded-full bg-gradient-to-r from-burgundy via-[#6a2440] to-burgundy px-8 py-4 text-[0.95rem] font-medium tracking-wide text-ivory shadow-xl"
        >
          {time.hasReached ? 'Enter your birthday surprise ♡' : config.invitation.button}
        </motion.button>
      </motion.div>
    </div>
  )
}
