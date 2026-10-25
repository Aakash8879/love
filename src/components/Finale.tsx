import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { config } from '../config'
import Heart, { HEART_PATH } from './Heart'
import EdgeFade from './EdgeFade'

const PETAL = 'M100 100 C 60 90, 62 46, 100 40 C 138 46, 140 90, 100 100 Z'

/** A rose drawn in layers: stem first, then petals open from the outside in. */
function Rose({ bloom, reduce }: { bloom: boolean; reduce: boolean }) {
  const layers = [
    { n: 6, s: 1.05, off: 0, color: '#E9A5B5', delay: 1.0 },
    { n: 5, s: 0.82, off: 36, color: '#d98a9e', delay: 1.5 },
    { n: 4, s: 0.6, off: 15, color: '#b9506e', delay: 2.0 },
    { n: 3, s: 0.4, off: 60, color: '#8a2a48', delay: 2.5 },
  ]
  const t = (d: number) => (reduce ? 0 : d)
  return (
    <div className="relative mx-auto w-[min(56vw,230px)]" aria-hidden>
      <div className="absolute left-1/2 top-[30%] h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,165,181,0.35),transparent_60%)]" />
      <svg viewBox="0 0 200 270" className="rose-sway relative w-full overflow-visible">
        <motion.path
          d="M100 112 C 96 160, 108 200, 98 268"
          stroke="#5b7a52" strokeWidth="4" fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={bloom ? { pathLength: 1 } : {}} transition={{ duration: t(1.4), ease: 'easeInOut' }}
        />
        <motion.path
          d="M101 190 C 120 170, 146 172, 156 160 C 146 186, 124 194, 101 190 Z" fill="#5b7a52"
          initial={{ scale: 0, opacity: 0 }} animate={bloom ? { scale: 1, opacity: 1 } : {}} style={{ originX: '0%', originY: '100%' }}
          transition={{ duration: t(0.9), delay: t(0.8) }}
        />
        <motion.path
          d="M99 220 C 80 200, 54 204, 44 192 C 56 218, 78 226, 99 220 Z" fill="#4c6a45"
          initial={{ scale: 0, opacity: 0 }} animate={bloom ? { scale: 1, opacity: 1 } : {}} style={{ originX: '100%', originY: '100%' }}
          transition={{ duration: t(0.9), delay: t(1.1) }}
        />
        {layers.map((layer, li) =>
          Array.from({ length: layer.n }, (_, i) => (
            <g key={`${li}-${i}`} transform={`rotate(${(360 / layer.n) * i + layer.off} 100 100)`}>
              <motion.path
                d={PETAL}
                fill={layer.color}
                stroke="rgba(33,19,31,0.25)"
                strokeWidth="0.8"
                style={{ originX: '50%', originY: '100%' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={bloom ? { scale: layer.s, opacity: 1 } : {}}
                transition={{ duration: t(1.6), delay: t(layer.delay + i * 0.08), ease: [0.2, 0.8, 0.2, 1] }}
              />
            </g>
          )),
        )}
        <motion.circle cx="100" cy="100" r="7" fill="#6e1f39" initial={{ scale: 0 }} animate={bloom ? { scale: 1 } : {}} transition={{ delay: t(2.9), duration: t(0.8) }} />
      </svg>
    </div>
  )
}

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        left: `${(i * 61.8) % 100}%`, top: `${(i * 37.3) % 100}%`,
        size: i % 7 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
        d: `${3 + (i % 5)}s`, delay: `${-(i * 0.37)}s`,
      })),
    [],
  )
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {stars.map((s, i) => (
        <span key={i} className="twinkle absolute rounded-full bg-ivory" style={{ left: s.left, top: s.top, width: s.size, height: s.size, ['--d' as string]: s.d, ['--delay' as string]: s.delay }} />
      ))}
    </div>
  )
}

/** The envelope opens, a card peeks out, then the full message unfolds below it. */
function Envelope({ reduce }: { reduce: boolean }) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), reduce ? 0 : 500),
      window.setTimeout(() => setPhase(2), reduce ? 0 : 1000),
      window.setTimeout(() => setPhase(3), reduce ? 0 : 1900),
    ]
    return () => timers.forEach(clearTimeout)
  }, [reduce])

  return (
    <motion.div initial={{ opacity: 0, y: 40, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }} className="mx-auto mt-14 w-full max-w-md">
      <div className="relative mx-auto aspect-[3/2] w-[88%]" style={{ perspective: 1200 }} aria-hidden>
        <div className="absolute inset-0 rounded-md bg-[#c98a9b]" />
        <motion.div
          className="absolute inset-x-[7%] bottom-[6%] h-[86%] rounded-sm bg-ivory p-4 text-left shadow"
          initial={{ y: 0 }}
          animate={{ y: phase >= 2 ? '-48%' : 0 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ zIndex: 10 }}
        >
          <p className="font-hand text-2xl text-burgundy">For you, {config.herName} ♡</p>
          <div className="mt-2 space-y-2">
            <div className="h-px w-full bg-burgundy/10" /><div className="h-px w-5/6 bg-burgundy/10" /><div className="h-px w-2/3 bg-burgundy/10" />
          </div>
        </motion.div>
        <div className="absolute inset-0 z-20 rounded-md bg-gradient-to-b from-blush to-petal" style={{ clipPath: 'polygon(0 32%, 50% 66%, 100% 32%, 100% 100%, 0 100%)' }} />
        <motion.div
          className="absolute inset-x-0 top-0 h-[66%] origin-top bg-gradient-to-b from-petal to-[#d98a9e]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', zIndex: phase >= 2 ? 1 : 30, transformStyle: 'preserve-3d' }}
          animate={{ rotateX: phase >= 1 ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-[66%] z-40 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-burgundy text-champagne shadow-lg"
          animate={{ opacity: phase >= 1 ? 0 : 1, scale: phase >= 1 ? 0.6 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart className="h-4 w-4" />
        </motion.div>
      </div>

      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 24, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: reduce ? 0 : 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="grain grain-paper relative mt-8 rounded-sm bg-ivory px-7 py-9 text-left text-burgundy shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] sm:px-10"
            aria-live="polite"
          >
            <p className="whitespace-pre-line font-hand text-[1.7rem] leading-snug">{config.finale.finalMessage}</p>
            <p className="mt-6 text-right font-hand text-2xl text-[#A8405F]">{config.yourName}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

type Burst = { id: number; hearts: { x: number; y: number; s: number; r: number; d: number }[] }

/** Screen 8: stars, a blooming rose, and the last words. */
export default function Finale({ onRestart }: { onRestart: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = !!useReducedMotion()
  const [showEnvelope, setShowEnvelope] = useState(false)
  const [hugged, setHugged] = useState(false)
  const [bursts, setBursts] = useState<Burst[]>([])
  const { lines, headline, promise, surpriseButton, hugButton, hugMessage } = config.finale

  const step = reduce ? 0.1 : 1.6
  const at = {
    line: (i: number) => 3.2 + i * step,
    headline: 3.2 + lines.length * step + 0.3,
    promise: 3.2 + lines.length * step + 1.9,
    button: 3.2 + lines.length * step + 3,
  }
  if (reduce) { at.headline = 0.3; at.promise = 0.4; at.button = 0.5; at.line = (i) => i * 0.1 }

  const hug = () => {
    setHugged(true)
    const id = Date.now()
    const hearts = Array.from({ length: reduce ? 6 : 22 }, () => ({
      x: (Math.random() - 0.5) * 340, y: -(220 + Math.random() * 320), s: 14 + Math.random() * 22, r: (Math.random() - 0.5) * 50, d: 2.2 + Math.random() * 1.2,
    }))
    setBursts((b) => [...b, { id, hearts }])
    window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 3800)
  }

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: reduce ? 0.2 : 1.3, delay, ease: [0.2, 0.8, 0.2, 1] as const },
  })

  return (
    <section
      id="finale"
      aria-labelledby="finale-title"
      className="grain relative min-h-[100svh] overflow-hidden px-5 pb-28 pt-40 text-ivory sm:px-6 md:pt-52"
      style={{ background: 'radial-gradient(120% 70% at 50% 20%, #4B1728 0%, #33101f 45%, #21131F 100%)' }}
    >
      <EdgeFade edge="top" color="#F7DDE2" />
      <Stars />
      <div ref={ref} className="relative mx-auto max-w-4xl text-center">
        <Rose bloom={inView} reduce={reduce} />

        <div className="mt-10 space-y-3">
          {lines.map((l, i) => (
            <motion.p key={i} {...fade(at.line(i))} className="text-balance font-serif text-[clamp(1.4rem,4vw,2.2rem)] italic leading-snug text-blush/80">
              {l}
            </motion.p>
          ))}
        </div>

        <motion.h2
          id="finale-title"
          {...fade(at.headline)}
          className="text-balance mt-12 font-serif text-[clamp(2.5rem,8.5vw,6.4rem)] leading-[0.95] tracking-[0.01em] [text-shadow:0_0_50px_rgba(233,165,181,0.45)]"
        >
          {headline}
        </motion.h2>

        <motion.p {...fade(at.promise)} className="text-pretty mx-auto mt-8 max-w-2xl text-base leading-relaxed text-ivory/75 sm:text-lg">
          {promise}
        </motion.p>

        <motion.div {...fade(at.button)} className="mt-12 flex flex-col items-center gap-4">
          {!showEnvelope && (
            <motion.button
              type="button"
              onClick={() => setShowEnvelope(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-glow min-h-[52px] rounded-full bg-gradient-to-r from-burgundy via-[#6a2440] to-burgundy px-8 py-4 font-medium tracking-wide"
            >
              {surpriseButton}
            </motion.button>
          )}
        </motion.div>

        <AnimatePresence>{showEnvelope && <Envelope reduce={reduce} />}</AnimatePresence>

        {showEnvelope && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 2.6, duration: 1 }} className="mt-12 flex flex-col items-center">
            <motion.button
              type="button"
              onClick={hug}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex min-h-[52px] items-center gap-3 rounded-full border border-champagne/50 bg-ivory/5 px-8 py-4 font-medium tracking-wide text-ivory backdrop-blur hover:bg-ivory/10"
            >
              <Heart className="h-4 w-4 text-petal" />
              {hugButton}
            </motion.button>
            <div className="min-h-[4rem]" aria-live="polite">
              <AnimatePresence>
                {hugged && (
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mt-6 font-hand text-[1.9rem] leading-snug text-blush">
                    {hugMessage}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        <motion.button
          type="button"
          onClick={onRestart}
          {...fade(at.button + 0.6)}
          className="mt-16 inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm text-ivory/50 hover:text-ivory"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Start again
        </motion.button>
      </div>

      <div aria-hidden className="pointer-events-none fixed inset-0 z-[65]">
        {bursts.map((b) =>
          b.hearts.map((h, i) => (
            <motion.svg
              key={`${b.id}-${i}`}
              viewBox="0 0 24 24"
              className="absolute left-1/2 top-[72%] text-petal"
              style={{ width: h.s, height: h.s, marginLeft: -h.s / 2 }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.3, rotate: 0 }}
              animate={{ x: h.x, y: h.y, opacity: [0, 1, 1, 0], scale: [0.3, 1, 1, 0.8], rotate: h.r }}
              transition={{ duration: h.d, ease: 'easeOut', delay: i * 0.03 }}
            >
              <path d={HEART_PATH} fill="currentColor" />
            </motion.svg>
          )),
        )}
      </div>
    </section>
  )
}
