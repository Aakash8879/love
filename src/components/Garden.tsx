import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { config } from '../config'
import EdgeFade from './EdgeFade'

/** Flower heads, as % of the garden box. Extra notes reuse positions with an offset. */
const POSITIONS = [
  { x: 13, y: 44 }, { x: 33, y: 27 }, { x: 55, y: 39 }, { x: 78, y: 25 },
  { x: 89, y: 52 }, { x: 23, y: 66 }, { x: 47, y: 63 }, { x: 70, y: 70 },
]
const PETALS = ['#E9A5B5', '#F7DDE2', '#E9A5B5', '#FFF9F5', '#F7DDE2', '#E9A5B5', '#FFF9F5', '#F7DDE2']

function Bloom({ color, found }: { color: string; found: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <motion.g animate={{ scale: found ? 1.12 : 1, rotate: found ? 30 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }} style={{ originX: '50px', originY: '50px' }}>
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={i} cx="50" cy="26" rx="13" ry="22" fill={color} opacity="0.92" transform={`rotate(${i * 60} 50 50)`} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={`in${i}`} cx="50" cy="36" rx="8" ry="13" fill="#FFF9F5" opacity="0.55" transform={`rotate(${i * 60 + 30} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r={found ? 11 : 9} fill="#D7B77A" />
        <circle cx="47" cy="47" r="3" fill="#FFF9F5" opacity="0.7" />
      </motion.g>
    </svg>
  )
}

/** Screen 6: a night garden of glowing flowers, each hiding a note. */
export default function Garden() {
  const { title, subtitle, notes } = config.garden
  const [active, setActive] = useState<number | null>(null)
  const [found, setFound] = useState<Set<number>>(new Set())

  const flowers = useMemo(
    () =>
      notes.map((_, i) => {
        const p = POSITIONS[i % POSITIONS.length]
        const shift = Math.floor(i / POSITIONS.length) * 6
        return { x: Math.min(92, p.x + shift), y: Math.min(78, p.y + shift), color: PETALS[i % PETALS.length], d: `${4.5 + (i % 4) * 0.7}s` }
      }),
    [notes],
  )

  const fireflies = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${(i * 53) % 100}%`, top: `${15 + ((i * 37) % 70)}%`,
        dx: `${((i % 5) - 2) * 18}px`, dy: `${-20 - (i % 4) * 14}px`,
        d: `${7 + (i % 5) * 1.6}s`, delay: `${-(i * 1.3)}s`,
      })),
    [],
  )

  const open = (i: number) => {
    setActive(i)
    setFound((prev) => new Set(prev).add(i))
  }
  const allFound = found.size === notes.length

  return (
    <section
      aria-labelledby="garden-title"
      className="grain relative overflow-hidden px-5 pb-40 pt-24 text-ivory sm:px-6 md:pb-52 md:pt-36"
      style={{ background: 'linear-gradient(180deg, #FFF9F5 0%, #4B1728 9%, #2b1424 35%, #21131F 100%)' }}
    >
      <EdgeFade edge="bottom" color="#F7DDE2" />
      <div aria-hidden className="pointer-events-none absolute right-[8%] top-[14%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,249,245,0.55),rgba(247,221,226,0.15)_45%,transparent_70%)] md:h-64 md:w-64" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 id="garden-title" className="font-serif text-[clamp(2.6rem,7.5vw,5.6rem)] leading-[0.95]">{title}</h2>
          <p className="text-balance mx-auto mt-5 max-w-md text-base leading-relaxed text-blush/75">{subtitle}</p>
        </motion.div>

        <div className="relative mx-auto mt-10 aspect-[4/5] w-full max-w-5xl sm:aspect-[4/3] md:aspect-[16/9]">
          {fireflies.map((f, i) => (
            <span
              key={i}
              aria-hidden
              className="firefly absolute h-1.5 w-1.5 rounded-full bg-champagne shadow-[0_0_10px_3px_rgba(215,183,122,0.7)]"
              style={{ left: f.left, top: f.top, ['--dx' as string]: f.dx, ['--dy' as string]: f.dy, ['--d' as string]: f.d, ['--delay' as string]: f.delay }}
            />
          ))}

          {flowers.map((f, i) => (
            <div key={`stem${i}`} aria-hidden className="absolute w-px bg-gradient-to-b from-champagne/70 to-champagne/0" style={{ left: `${f.x}%`, top: `${f.y}%`, height: `${100 - f.y}%` }} />
          ))}

          <svg aria-hidden viewBox="0 0 1000 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[18%] w-full">
            <path d="M0 70 C 120 40, 240 90, 380 60 S 640 30, 760 62 S 920 80, 1000 50 L1000 120 L0 120 Z" fill="#2b1424" />
            <path d="M0 95 C 160 70, 300 110, 460 85 S 760 70, 1000 92 L1000 120 L0 120 Z" fill="#170c15" />
          </svg>

          {flowers.map((f, i) => {
            const isFound = found.has(i)
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => open(i)}
                aria-label={isFound ? `Flower ${i + 1}, note found. Read it again` : `Flower ${i + 1}, tap to read a note`}
                aria-pressed={active === i}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 140, damping: 14 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[4.5rem] sm:w-[4.5rem]"
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
              >
                <span aria-hidden className={`halo ${isFound ? 'halo-found' : 'halo-pulse'}`} style={{ animationDelay: `${-i * 0.4}s` }} />
                <span className="sway relative block h-full w-full" style={{ ['--d' as string]: f.d }}>
                  <Bloom color={f.color} found={isFound} />
                </span>
              </motion.button>
            )
          })}
        </div>

        <div className="relative mx-auto -mt-2 min-h-[11rem] max-w-xl" aria-live="polite">
          <AnimatePresence mode="wait">
            {active !== null ? (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative rounded-[1.75rem] border border-champagne/25 bg-ivory/[0.08] px-7 py-7 text-center shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-md sm:px-10"
              >
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="Close note"
                  className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-ivory/60 hover:bg-ivory/10 hover:text-ivory"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
                <p className="font-hand text-[1.75rem] leading-snug text-ivory sm:text-[2rem]">{notes[active]}</p>
              </motion.div>
            ) : (
              <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-10 text-center text-sm text-blush/60">
                Tap a glowing flower to open its note.
              </motion.p>
            )}
          </AnimatePresence>
          <p className="mt-5 text-center text-sm text-blush/70">
            {allFound ? 'You found every note. There will always be more where these came from ♡' : `${found.size} of ${notes.length} notes found`}
          </p>
        </div>
      </div>
    </section>
  )
}
