import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Sparkles, RotateCcw } from 'lucide-react'
import { config } from '../config'
import { letterFx } from '../lib/letterAudio'
import Heart from './Heart'

/** 3D Embossed Molten Wax Seal Component */
function WaxSeal({
  breaking,
  onClick,
}: {
  breaking: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      aria-label="Break the wax seal to open letter"
      className="group relative z-30 flex flex-col items-center focus:outline-none"
    >
      {/* Candlelight aura glow */}
      <span
        aria-hidden
        className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(215,183,122,0.45)_0%,rgba(233,165,181,0.2)_40%,transparent_70%)] animate-pulse pointer-events-none"
      />

      {/* Ribbon band behind seal */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-28 -right-28 top-1/2 h-8 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#4B1728] to-transparent shadow-md"
      >
        <div className="absolute inset-x-0 top-0.5 h-[1px] bg-champagne/40" />
        <div className="absolute inset-x-0 bottom-0.5 h-[1px] bg-champagne/40" />
      </div>

      {/* 3D Wax Seal Body */}
      <motion.div
        animate={
          breaking
            ? { scale: [1, 1.25, 0], opacity: [1, 1, 0], rotate: [0, 8, -12] }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.55, ease: 'easeInOut' }}
        className="relative grid h-24 w-24 place-items-center select-none"
      >
        {/* Organic irregular molten wax outer rim */}
        <div
          className="absolute inset-0 rounded-full shadow-[0_15px_30px_-5px_rgba(40,10,20,0.8),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:scale-105"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, #8b1d38 0%, #5b1325 55%, #380a16 100%)',
            clipPath:
              'polygon(50% 0%, 65% 3%, 78% 9%, 90% 20%, 97% 35%, 100% 50%, 98% 65%, 91% 79%, 80% 90%, 65% 97%, 50% 100%, 35% 98%, 20% 91%, 9% 80%, 2% 65%, 0% 50%, 3% 35%, 10% 20%, 21% 9%, 35% 2%)',
          }}
        />

        {/* Inner raised stamp circle */}
        <div
          className="relative grid h-[4.75rem] w-[4.75rem] place-items-center rounded-full border-2 border-champagne/60 shadow-[inset_0_4px_8px_rgba(0,0,0,0.5),0_2px_4px_rgba(255,255,255,0.2)]"
          style={{
            background:
              'radial-gradient(circle at 40% 35%, #7a1830 0%, #4e0f1e 65%, #2a0610 100%)',
          }}
        >
          {/* Circular fine rule */}
          <div className="absolute inset-1.5 rounded-full border border-champagne/30" />

          {/* Golden Monogram "B ♡ V" */}
          <div className="relative flex flex-col items-center justify-center text-center">
            <span className="text-[7.5px] font-semibold tracking-[0.25em] text-champagne/85 uppercase">
              FOR MY LOVE
            </span>
            <div className="my-0.5 flex items-center justify-center gap-1 font-serif text-lg font-bold tracking-wider text-champagne drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <span>B</span>
              <Heart className="h-3 w-3 fill-champagne text-champagne" />
              <span>V</span>
            </div>
            <span className="text-[6.5px] font-medium tracking-[0.2em] text-champagne/70 uppercase">
              SEALED
            </span>
          </div>

          {/* Specular wax gloss reflection */}
          <span
            aria-hidden
            className="absolute left-2.5 top-2.5 h-3.5 w-6 -rotate-45 rounded-full bg-white/20 blur-[1px]"
          />
        </div>
      </motion.div>

      {/* Floating Call to Action */}
      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-burgundy/15 bg-ivory/80 px-4 py-1.5 text-xs font-semibold text-burgundy shadow-sm backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
        <Sparkles className="h-3.5 w-3.5 text-[#9a6b2f]" />
        <span>Tap wax seal to break & read ♡</span>
      </span>
    </motion.button>
  )
}

/** Screen 3: An ivory, handwritten letter sealed with a 3D wax seal that writes itself in */
export default function Letter() {
  const [open, setOpen] = useState(false)
  const [breaking, setBreaking] = useState(false)
  const reduce = useReducedMotion()
  const { title, intro, greeting, paragraphs, closing, signature } = config.letter
  const blocks = [greeting, ...paragraphs]

  const handleBreakSeal = () => {
    if (breaking) return
    setBreaking(true)

    // Play tactile synthesized wax snap and paper rustle
    letterFx.playSealBreak()

    // Mobile micro-haptics
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([35, 45, 40])
    }

    setTimeout(() => {
      setOpen(true)
      setBreaking(false)
    }, 450)
  }

  const handleReseal = () => {
    letterFx.playReseal()
    setOpen(false)
  }

  return (
    <section
      id="letter"
      aria-labelledby="letter-title"
      className="relative overflow-hidden bg-ivory px-5 py-24 text-burgundy sm:px-6 md:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(247,221,226,0.9),transparent_65%)]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.25fr)] md:gap-20">
        {/* Left Column: Heading & Intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1 }}
          className="md:sticky md:top-28 md:self-start"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-burgundy/15 bg-blush/40 px-3.5 py-1 text-xs font-semibold tracking-wide text-burgundy shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[#9a6b2f]" />
            <span>From My Heart</span>
          </div>

          <h2
            id="letter-title"
            className="text-balance mt-3 font-serif text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.95]"
          >
            {title}
          </h2>

          <p className="mt-6 max-w-xs text-base leading-relaxed text-burgundy/70">
            {intro}
          </p>

          {/* Quick status pill when letter is opened */}
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 hidden md:block"
            >
              <button
                type="button"
                onClick={handleReseal}
                className="inline-flex items-center gap-2 rounded-full border border-burgundy/20 bg-ivory px-4 py-2 text-xs font-medium text-burgundy/70 transition hover:bg-burgundy/5 hover:text-burgundy"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Fold & re-seal letter</span>
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column: Folded Parchment with 3D Wax Seal / Full Letter */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="grain grain-paper relative rounded-xl border border-burgundy/10 bg-[#FFFDF8] shadow-[0_1px_0_rgba(75,23,40,0.06),0_40px_80px_-40px_rgba(75,23,40,0.45),0_12px_30px_-20px_rgba(75,23,40,0.25)]"
        >
          {/* Red margin guideline on paper */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-6 w-px bg-petal/60 sm:left-10"
          />

          <AnimatePresence mode="wait" initial={false}>
            {!open ? (
              /* FOLDED PARCHMENT WITH 3D WAX SEAL */
              <motion.div
                key="sealed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="relative flex min-h-[22rem] flex-col items-center justify-center overflow-hidden px-8 py-16 text-center sm:px-14 sm:py-20"
              >
                {/* Folded paper crease line */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-burgundy/15 shadow-sm"
                />

                {/* Faint preview of handwritten greeting */}
                <p className="pointer-events-none mb-10 select-none font-hand text-2xl text-burgundy/35 italic">
                  {greeting}
                </p>

                {/* 3D Wax Seal */}
                <WaxSeal breaking={breaking} onClick={handleBreakSeal} />

                {/* Subtle paper watermark stamp */}
                <p className="pointer-events-none mt-10 select-none font-hand text-lg text-burgundy/30">
                  {closing} {signature}
                </p>
              </motion.div>
            ) : (
              /* FULL UNFURLED LETTER WITH INK LINES */
              <motion.div
                key="opened"
                initial={{ opacity: 0, scaleY: 0.92, transformOrigin: 'top' }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="paper-lines relative px-8 py-10 pl-12 font-hand text-[1.55rem] leading-[2.4rem] text-burgundy/90 sm:px-14 sm:py-14 sm:pl-20 sm:text-[1.7rem]"
              >
                <div className="space-y-[2.4rem]">
                  {blocks.map((b, i) => (
                    <motion.p
                      key={i}
                      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: reduce ? 0 : 0.15 + i * 0.15,
                        ease: [0.2, 0.8, 0.2, 1],
                      }}
                      className={i === 0 ? 'font-bold text-burgundy sm:text-[1.85rem]' : ''}
                    >
                      {b}
                    </motion.p>
                  ))}
                </div>

                {/* Letter Signature & Re-seal Button */}
                <motion.div
                  initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduce ? 0 : 0.15 + blocks.length * 0.15, duration: 0.8 }}
                  className="mt-[2.4rem] pt-6"
                >
                  <p className="text-burgundy/80">{closing}</p>
                  <p className="mt-2 text-2xl font-bold text-[#A8405F] sm:text-3xl">
                    {signature}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-burgundy/10 pt-4 font-sans text-xs text-burgundy/50">
                    <span className="flex items-center gap-1.5 font-hand text-base text-[#9a6b2f]">
                      Written with all my heart ♡
                    </span>
                    <button
                      type="button"
                      onClick={handleReseal}
                      className="inline-flex items-center gap-1.5 rounded-full border border-burgundy/15 px-3.5 py-1.5 font-medium text-burgundy/70 transition hover:bg-burgundy/5 hover:text-burgundy"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Re-seal letter</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
