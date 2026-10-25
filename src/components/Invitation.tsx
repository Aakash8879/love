import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Clock, Lock, Sparkles } from 'lucide-react'
import { config } from '../config'
import Heart, { HEART_PATH } from './Heart'
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

type ConfettiPiece = {
  id: number
  x: number
  rot: number
  scale: number
  color: string
  shape: 'heart' | 'star' | 'streamer' | 'dot'
  duration: number
  delay: number
}

/** Elegant Rolling Number with fluid blur-slide transitions and full glyph visibility */
function RollingNumber({ value, isUnlocked }: { value: string; isUnlocked: boolean }) {
  return (
    <div className="relative flex h-10 sm:h-12 w-full items-center justify-center overflow-hidden px-1 select-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 16, opacity: 0, filter: 'blur(2px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -16, opacity: 0, filter: 'blur(2px)' }}
          transition={{ duration: 0.32, ease: [0.2, 0.9, 0.3, 1] }}
          className={`font-serif tabular-nums text-2xl font-bold tracking-normal sm:text-3xl md:text-4xl ${
            isUnlocked
              ? 'text-champagne [text-shadow:0_0_20px_rgba(255,240,190,0.85)]'
              : 'text-champagne drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
          }`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  )
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
  const [shake, setShake] = useState(false)
  const [showLockedHint, setShowLockedHint] = useState(false)
  const [previewUnlocked, setPreviewUnlocked] = useState(false)
  const clickBadgeCountRef = useRef(0)

  const isUnlocked = time.hasReached || previewUnlocked

  const celebrationConfetti = useMemo<ConfettiPiece[]>(() => {
    if (!isUnlocked) return []
    const count = 36
    const colors = ['#D7B77A', '#E9A5B5', '#FFF9F5', '#FF3366', '#EAD29A']
    const shapes: ('heart' | 'star' | 'streamer' | 'dot')[] = ['heart', 'star', 'streamer', 'dot']
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i * 2.7 + 1.2) % 100,
      rot: (i * 53) % 360,
      scale: 0.65 + ((i % 5) * 0.12),
      color: colors[i % colors.length],
      shape: shapes[i % shapes.length],
      duration: 5.5 + (i % 4) * 1.4,
      delay: (i * 0.28) % 6,
    }))
  }, [isUnlocked])

  useEffect(() => {
    resetScrollTop()
  }, [])

  const handleBadgeClick = () => {
    clickBadgeCountRef.current += 1
    if (clickBadgeCountRef.current >= 3) {
      setPreviewUnlocked((prev) => {
        const next = !prev
        if (next) letterFx.playCelebrationFanfare()
        return next
      })
      clickBadgeCountRef.current = 0
    }
  }

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

  const handleButtonClick = () => {
    if (!isUnlocked) {
      setShake(true)
      setShowLockedHint(true)
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setShowLockedHint(false), 4000)
      return
    }
    open()
  }

  // Live countdown timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      const nextTime = calculateCountdown(targetDate)
      setTime(nextTime)

      // When countdown reaches zero, play celebration fanfare and enable button
      if (wasCountingRef.current && nextTime.hasReached) {
        wasCountingRef.current = false
        letterFx.playCelebrationFanfare()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

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

      {/* 🌟 CELEBRATION BACKGROUND AURORA (When Countdown Completes) */}
      {isUnlocked && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0.55, 0.9, 0.55],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 'min(92vw, 780px)',
            height: 'min(92vw, 780px)',
            background:
              'radial-gradient(circle, rgba(255, 230, 160, 0.38) 0%, rgba(233, 165, 181, 0.22) 35%, rgba(215, 183, 122, 0.08) 55%, transparent 70%)',
          }}
        />
      )}

      {/* 🎊 CELEBRATION FALLING CONFETTI & STARDUST (When Countdown Completes) */}
      {isUnlocked && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {celebrationConfetti.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: '-10vh', x: `${p.x}vw`, rotate: 0, opacity: 0 }}
              animate={{
                y: '108vh',
                rotate: p.rot + 360,
                opacity: [0, 0.85, 0.85, 0],
              }}
              transition={{
                duration: reduce ? 0.01 : p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute left-0 top-0"
              style={{ transform: `scale(${p.scale})` }}
            >
              {p.shape === 'heart' && (
                <svg viewBox="0 0 24 24" className="h-4 w-4 drop-shadow-sm" fill={p.color}>
                  <path d={HEART_PATH} />
                </svg>
              )}
              {p.shape === 'star' && (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 drop-shadow-sm" fill={p.color}>
                  <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                </svg>
              )}
              {p.shape === 'streamer' && (
                <span
                  className="block h-4 w-1.5 rounded-full drop-shadow-sm"
                  style={{ backgroundColor: p.color, transform: 'skewX(16deg)' }}
                />
              )}
              {p.shape === 'dot' && (
                <span className="block h-2 w-2 rounded-full drop-shadow-sm" style={{ backgroundColor: p.color }} />
              )}
            </motion.div>
          ))}
        </div>
      )}

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

        {/* Live Countdown Status Badge (Tapping 3x toggles developer test unlock) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          onClick={handleBadgeClick}
          className="mb-5 inline-flex cursor-pointer select-none items-center gap-2 rounded-full border border-champagne/35 bg-plum/60 px-4 py-1.5 text-xs font-semibold tracking-wider text-champagne shadow-md backdrop-blur-md outline-none focus:outline-none"
        >
          {isUnlocked ? (
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

        {/* Main Title (Changes context between locked and unlocked) */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={isUnlocked ? 'unlocked-title' : 'locked-title'}
            id="invite-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-balance max-w-4xl font-serif text-[clamp(2.4rem,7.5vw,5.5rem)] leading-[0.98] tracking-[-0.01em]"
          >
            {isUnlocked ? config.invitation.title : (config.invitation.lockedTitle || config.invitation.title)}
          </motion.h1>
        </AnimatePresence>

        {/* Subtitle (Changes context between locked and unlocked) */}
        <AnimatePresence mode="wait">
          <motion.p
            key={isUnlocked ? 'unlocked-sub' : 'locked-sub'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.7 }}
            className="text-balance mt-4 max-w-md text-base leading-relaxed text-blush/80 sm:text-lg"
          >
            {isUnlocked ? config.invitation.subtitle : (config.invitation.lockedSubtitle || config.invitation.subtitle)}
          </motion.p>
        </AnimatePresence>

        {/* ============================================================ */}
        {/* ⏳ CELESTIAL CLOCKWORK LIVE COUNTDOWN PODS                  */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="my-7 w-full max-w-lg px-1 sm:px-2"
        >
          {/* Constellation filigree ribbon */}
          <div
            className="mb-3.5 flex items-center justify-center gap-2.5 select-none"
            aria-hidden
          >
            <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-champagne/40 to-transparent" />
            <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-champagne/85 uppercase">
              <Sparkles className="h-3 w-3 text-champagne animate-spin" style={{ animationDuration: '6s' }} />
              <span>{isUnlocked ? 'Birthday Has Arrived' : 'Moments Until Your Day'}</span>
              <Heart className="h-2.5 w-2.5 fill-petal/70 text-petal/70" />
            </span>
            <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent via-champagne/40 to-transparent" />
          </div>

          {/* Celestial Glass Pods Row */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
            {countdownUnits.map((unit, idx) => (
              <div key={unit.label} className="contents">
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  animate={
                    unit.isLive && !isUnlocked
                      ? {
                          scale: [1, 1.018, 1],
                          boxShadow: [
                            '0 12px 30px -10px rgba(0,0,0,0.5)',
                            '0 16px 36px -8px rgba(215,183,122,0.22)',
                            '0 12px 30px -10px rgba(0,0,0,0.5)',
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                  className={`group relative flex flex-1 flex-col items-center justify-center rounded-2xl p-2.5 sm:rounded-3xl sm:p-4 backdrop-blur-xl transition-all duration-700 cursor-default select-none ${
                    isUnlocked
                      ? 'border-2 border-champagne bg-gradient-to-b from-champagne/25 via-petal/15 to-[#1c0f1b]/80 shadow-[0_0_30px_rgba(215,183,122,0.5)]'
                      : 'border border-champagne/35 bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-[#1c0f1b]/70 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.55)] hover:border-champagne/55'
                  }`}
                >
                  {/* Top subtle metallic hairline reflection */}
                  <div className="pointer-events-none absolute inset-x-2.5 top-0 h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />

                  {/* Ambient inner radial glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl opacity-50 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: 'radial-gradient(circle at 50% 35%, rgba(215, 183, 122, 0.12) 0%, transparent 70%)',
                    }}
                  />

                  {/* Live pulsing beacon on seconds unit */}
                  {unit.isLive && !isUnlocked && (
                    <div className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-champagne/80 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-champagne shadow-[0_0_8px_#d7b77a]" />
                      </span>
                    </div>
                  )}

                  {/* Celebration sparkle on units when unlocked */}
                  {isUnlocked && (
                    <Sparkles className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 h-3.5 w-3.5 text-champagne animate-pulse opacity-90" />
                  )}

                  {/* Digits display with rolling animation and full glyph visibility */}
                  <RollingNumber value={unit.value} isUnlocked={isUnlocked} />

                  {/* Unit label */}
                  <span className="mt-1 text-[9px] sm:text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-blush/80 uppercase">
                    {unit.label}
                  </span>
                </motion.div>

                {/* Pulsing cosmic colon between units */}
                {idx < countdownUnits.length - 1 && (
                  <div
                    className="flex flex-col items-center justify-center gap-1.5 shrink-0 px-0.5 sm:px-1 self-center pb-4 sm:pb-5 select-none"
                    aria-hidden
                  >
                    <motion.span
                      animate={!isUnlocked ? { opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] } : { opacity: 0.9 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                      className="h-1.5 w-1.5 rounded-full bg-champagne shadow-[0_0_8px_rgba(215,183,122,0.8)]"
                    />
                    <motion.span
                      animate={!isUnlocked ? { opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] } : { opacity: 0.9 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                      className="h-1.5 w-1.5 rounded-full bg-champagne shadow-[0_0_8px_rgba(215,183,122,0.8)]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isUnlocked && formattedTargetDate && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-3.5 text-center text-xs tracking-wider text-champagne/80"
            >
              Unlocks on <span className="font-semibold text-ivory">{formattedTargetDate}</span> ✨
            </motion.p>
          )}
        </motion.div>

        {/* Locked / Enabled Action Button */}
        <div className="flex flex-col items-center">
          <motion.button
            ref={btn}
            type="button"
            onClick={(e) => {
              e.currentTarget.blur()
              handleButtonClick()
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              x: shake ? [-6, 6, -5, 5, -2, 2, 0] : 0,
            }}
            transition={
              shake
                ? { duration: 0.45 }
                : { duration: 1, delay: 1.4 }
            }
            whileHover={isUnlocked ? { scale: 1.05 } : { scale: 1.01 }}
            whileTap={isUnlocked ? { scale: 0.95 } : { scale: 0.99 }}
            className={`relative inline-flex min-h-[54px] items-center gap-2.5 rounded-full px-9 py-4 text-[0.98rem] tracking-wide transition-all outline-none focus:outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#21131f] ${
              isUnlocked
                ? 'btn-glow bg-gradient-to-r from-burgundy via-[#78263f] to-burgundy font-semibold text-ivory shadow-[0_0_40px_rgba(233,165,181,0.5)] cursor-pointer ring-2 ring-champagne/50'
                : 'border border-champagne/30 bg-white/[0.07] font-medium text-ivory/60 shadow-lg backdrop-blur-md cursor-not-allowed hover:border-champagne/45 hover:bg-white/[0.1] hover:text-ivory/80'
            }`}
            aria-disabled={!isUnlocked}
          >
            {/* Ambient celebration halo behind button when ready */}
            {isUnlocked && (
              <span
                aria-hidden
                className="absolute -inset-1 -z-10 rounded-full bg-gradient-to-r from-champagne/40 via-petal/50 to-champagne/40 blur-md animate-pulse"
              />
            )}

            {isUnlocked ? (
              <>
                <Sparkles className="h-4 w-4 text-champagne animate-spin" style={{ animationDuration: '4s' }} aria-hidden />
                <span>{config.invitation.button || 'Open your birthday surprise ♡'}</span>
                <Heart className="h-4 w-4 fill-petal text-petal" aria-hidden />
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 text-champagne/80" aria-hidden />
                <span>{config.invitation.lockedButton || 'Locked until countdown ends 🔒'}</span>
              </>
            )}
          </motion.button>

          {/* Hint when user taps the locked button before midnight */}
          <AnimatePresence>
            {showLockedHint && (
              <motion.p
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                className="mt-3.5 inline-block rounded-full border border-champagne/35 bg-plum/90 px-4 py-1.5 text-xs text-blush shadow-lg backdrop-blur-md"
              >
                🔒 Shh, it’s a surprise! Vikash locked this until your birthday ♡
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
