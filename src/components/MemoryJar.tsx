import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart as HeartIcon, Sparkles, X, RotateCcw } from 'lucide-react'
import { config } from '../config'
import { letterFx } from '../lib/letterAudio'
import Heart from './Heart'

interface FoldedStar {
  x: number
  y: number
  rot: number
  color: string
  size: number
  delay: number
}

const STAR_COLORS = ['#E9A5B5', '#D7B77A', '#FFF9F5', '#F7DDE2', '#DE8B9F', '#E6C485']

/**
 * 🫙 "Reasons I Love You" Birthday Memory Jar
 * An interactive glowing glass apothecary jar filled with folded origami notes and fairy lights.
 * Tapping the jar draws a folded reason why Vikash loves Bhavana with authentic glass & paper sounds.
 */
export default function MemoryJar() {
  const { badge, title, subtitle, tagText, jarLabel, reasons } = config.memoryJar

  const [activeReasonIndex, setActiveReasonIndex] = useState<number | null>(null)
  const [discoveredIndices, setDiscoveredIndices] = useState<Set<number>>(new Set())
  const [isDrawing, setIsDrawing] = useState(false)
  const [favoriteHearts, setFavoriteHearts] = useState<{ [key: number]: number }>({})

  // Generate resting & floating origami stars inside the glass jar
  const jarStars = useMemo<FoldedStar[]>(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      x: 18 + (i * 29) % 64 + (Math.random() - 0.5) * 8,
      y: 42 + (i * 23) % 46 + (Math.random() - 0.5) * 6,
      rot: (Math.random() - 0.5) * 80,
      color: STAR_COLORS[i % STAR_COLORS.length],
      size: 14 + (i % 3) * 3,
      delay: -(i * 0.4),
    }))
  }, [])

  // Draw a surprise note from the jar
  const drawReason = () => {
    if (isDrawing) return
    setIsDrawing(true)

    // Play crystal glass clink and paper flutter audio
    letterFx.playJarPick()

    // Mobile micro-haptic pulse
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([28, 42])
    }

    // Pick an unseen reason first, or cycle through
    let nextIndex: number
    const undiscovered = reasons
      .map((_, i) => i)
      .filter((i) => !discoveredIndices.has(i) && i !== activeReasonIndex)

    if (undiscovered.length > 0) {
      nextIndex = undiscovered[Math.floor(Math.random() * undiscovered.length)]
    } else {
      // Pick a random reason different from current
      const pool = reasons.map((_, i) => i).filter((i) => i !== activeReasonIndex)
      nextIndex = pool[Math.floor(Math.random() * pool.length)] || 0
    }

    setTimeout(() => {
      setActiveReasonIndex(nextIndex)
      setDiscoveredIndices((prev) => new Set(prev).add(nextIndex))
      setIsDrawing(false)
    }, 420)
  }

  const handleFavorite = (index: number) => {
    setFavoriteHearts((prev) => ({ ...prev, [index]: (prev[index] || 0) + 1 }))
  }

  const allDiscovered = discoveredIndices.size === reasons.length

  return (
    <section
      id="memory-jar"
      aria-labelledby="jar-title"
      className="relative overflow-hidden px-5 py-24 text-burgundy sm:px-6 md:py-36"
      style={{
        background: 'linear-gradient(180deg, #FFF9F5 0%, #F9ECEF 45%, #F7DDE2 85%, #FFF9F5 100%)',
      }}
    >
      {/* Background ambient lighting halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,165,181,0.3)_0%,rgba(215,183,122,0.15)_45%,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-burgundy/15 bg-ivory/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-burgundy shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-champagne" />
            <span>{badge}</span>
          </div>

          <h2
            id="jar-title"
            className="mt-3 font-serif text-[clamp(2.8rem,7.5vw,5.6rem)] leading-[0.95]"
          >
            {title}
          </h2>

          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-burgundy/70">
            {subtitle}
          </p>
        </motion.div>

        {/* ============================================================ */}
        {/* THE GLOWING GLASS MEMORY JAR                                 */}
        {/* ============================================================ */}
        <div className="mt-12 flex flex-col items-center">
          <motion.div
            role="button"
            tabIndex={0}
            onClick={drawReason}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                drawReason()
              }
            }}
            whileHover={{ y: -6, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Apothecary Memory Jar. Tap to pick a love note."
            className="group relative z-20 flex aspect-[3/4] w-64 cursor-pointer flex-col items-center justify-end select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne sm:w-72"
          >
            {/* Candlelight fairy halo behind the jar */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-4 bottom-2 top-10 rounded-full bg-[radial-gradient(ellipse_at_50%_65%,rgba(215,183,122,0.45)_0%,rgba(233,165,181,0.25)_45%,transparent_75%)] animate-pulse"
              style={{ animationDuration: '3.5s' }}
            />

            {/* Cork Stopper at top of jar */}
            <div
              aria-hidden
              className="relative z-30 h-8 w-24 rounded-t-md border-b-2 border-[#683d1c] shadow-md transition-transform duration-300 group-hover:-translate-y-1"
              style={{
                background:
                  'linear-gradient(to right, #7a4620 0%, #b87a45 35%, #d19760 60%, #854b22 100%)',
              }}
            >
              {/* Cork texture notches */}
              <div className="absolute inset-x-2 top-2 h-0.5 bg-black/15" />
              <div className="absolute inset-x-3 top-4 h-0.5 bg-black/15" />
            </div>

            {/* Glass Neck Rim */}
            <div
              aria-hidden
              className="relative z-20 h-5 w-28 rounded-md border border-champagne/40 bg-gradient-to-r from-white/35 via-white/15 to-white/25 shadow-sm backdrop-blur-sm"
            >
              {/* Rustic Twine wrapped around neck */}
              <div className="absolute inset-x-0 top-1.5 h-1.5 bg-[#8b552b] shadow-inner" />

              {/* Hanging Kraft Paper Tag */}
              <motion.div
                animate={{ rotate: [-2, 3, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-5 top-2.5 z-30 origin-top rounded-sm border border-[#a16b3d] bg-[#d9ab7e] px-2 py-0.5 shadow-md"
              >
                <span className="font-hand text-xs font-bold text-burgundy whitespace-nowrap">
                  {tagText}
                </span>
                <span className="absolute -top-1.5 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-[#8b552b]" />
              </motion.div>
            </div>

            {/* Main Cylindrical Glass Vessel Body */}
            <div
              className="relative z-10 flex h-[82%] w-full flex-col justify-end overflow-hidden rounded-[2.5rem] border border-champagne/45 p-4 shadow-[0_30px_70px_-20px_rgba(75,23,40,0.4),inset_0_2px_4px_rgba(255,255,255,0.45)] backdrop-blur-[3px]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,249,245,0.08) 45%, rgba(233,165,181,0.12) 100%)',
              }}
            >
              {/* Glass vertical specular glint reflections */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-3 top-4 bottom-4 w-2.5 rounded-full bg-gradient-to-b from-white/50 via-white/10 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute right-4 top-8 bottom-8 w-1 rounded-full bg-gradient-to-b from-white/35 to-transparent"
              />

              {/* Thick curved glass base */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-2 bottom-1 h-5 rounded-b-[2rem] border-t border-white/40 bg-white/20 shadow-inner"
              />

              {/* Inside the Glass: Floating Origami Stars & Hearts */}
              <div aria-hidden className="pointer-events-none absolute inset-0">
                {jarStars.map((star, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      y: [0, -5, 0],
                      rotate: [star.rot, star.rot + 6, star.rot],
                    }}
                    transition={{
                      duration: 3.5 + (i % 3),
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: star.delay,
                    }}
                    style={{
                      left: `${star.x}%`,
                      top: `${star.y}%`,
                      color: star.color,
                      fontSize: `${star.size}px`,
                    }}
                    className="absolute select-none font-serif drop-shadow-[0_2px_4px_rgba(75,23,40,0.25)]"
                  >
                    {i % 2 === 0 ? '✦' : '♡'}
                  </motion.span>
                ))}

                {/* Floating firefly embers inside jar */}
                <span className="firefly absolute left-[30%] top-[40%] h-1.5 w-1.5 rounded-full bg-champagne shadow-[0_0_8px_#d7b77a]" />
                <span className="firefly absolute left-[65%] top-[55%] h-1 w-1 rounded-full bg-ivory shadow-[0_0_8px_#fff]" />
                <span className="firefly absolute left-[45%] top-[70%] h-1.5 w-1.5 rounded-full bg-petal shadow-[0_0_8px_#e9a5b5]" />
              </div>

              {/* Jar Front Engraved Label */}
              <div className="relative z-20 mb-3 flex flex-col items-center rounded-xl border border-burgundy/10 bg-ivory/70 py-2.5 px-3 text-center shadow-sm backdrop-blur-sm">
                <Heart className="h-3.5 w-3.5 text-burgundy" />
                <span className="mt-1 font-serif text-sm font-bold tracking-wider text-burgundy uppercase">
                  Reasons I Love You
                </span>
                <span className="text-[10px] tracking-wide text-burgundy/60">
                  {discoveredIndices.size} of {reasons.length} opened
                </span>
              </div>
            </div>
          </motion.div>

          {/* Interactive Trigger Button below Jar */}
          <div className="mt-6">
            <motion.button
              type="button"
              onClick={drawReason}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-burgundy px-7 py-3 font-medium text-ivory shadow-lg shadow-burgundy/25 transition hover:bg-plum active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-champagne" />
              <span>{jarLabel}</span>
            </motion.button>
          </div>

          {/* All reasons discovered celebration banner */}
          {allDiscovered && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 font-hand text-xl text-burgundy/80 sm:text-2xl"
            >
              You’ve opened every note in this jar, but my reasons to love you are infinite ♡
            </motion.p>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* UNFOLDED LOVE NOTE MODAL DIALOG                              */}
      {/* ============================================================ */}
      <AnimatePresence>
        {activeReasonIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveReasonIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-plum/80 p-4 backdrop-blur-md sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 30, rotate: -2 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 30, rotate: 2 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="grain grain-paper relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-burgundy/15 bg-[#FFFDF9] p-7 text-center shadow-[0_30px_70px_-20px_rgba(0,0,0,0.65)] sm:p-9"
            >
              {/* Paper ruled line at top */}
              <div aria-hidden className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-petal via-champagne to-petal" />

              {/* Top Bar: Reason number & Close */}
              <div className="flex items-center justify-between border-b border-burgundy/10 pb-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-[#9a6b2f] uppercase">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    Reason #{activeReasonIndex + 1} of {reasons.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveReasonIndex(null)}
                  aria-label="Fold note back"
                  className="grid h-8 w-8 place-items-center rounded-full text-burgundy/60 transition hover:bg-burgundy/10 hover:text-burgundy"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* The Love Reason Body */}
              <div className="py-8">
                <p className="font-hand text-[1.75rem] leading-snug text-burgundy sm:text-[2.1rem]">
                  “{reasons[activeReasonIndex]}”
                </p>
                <p className="mt-5 font-hand text-lg text-[#9a6b2f]">
                  — One of the million reasons I adore you, {config.herName} ♡
                </p>
              </div>

              {/* Action Buttons: Pick Another & Favorite Heart */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-burgundy/10 pt-5">
                <button
                  type="button"
                  onClick={() => handleFavorite(activeReasonIndex)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-burgundy/15 bg-ivory px-3.5 py-2 text-xs font-semibold text-burgundy transition hover:bg-burgundy/5"
                >
                  <HeartIcon
                    className={`h-4 w-4 ${
                      (favoriteHearts[activeReasonIndex] || 0) > 0
                        ? 'fill-petal text-petal'
                        : 'text-burgundy/60'
                    }`}
                  />
                  <span>Save to my heart ♡</span>
                </button>

                <motion.button
                  type="button"
                  onClick={drawReason}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-full bg-burgundy px-5 py-2.5 text-xs font-medium text-ivory shadow-md transition hover:bg-plum"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Pick Another Reason ✨</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
