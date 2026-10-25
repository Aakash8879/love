import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { config } from '../config'
import FloatingHearts from './FloatingHearts'
import EdgeFade from './EdgeFade'
import { scrollToTarget } from '../lib/smoothScroll'

/** Screen 2: her name as the centerpiece, revealed once the curtain opens. */
export default function NameReveal({ opened }: { opened: boolean }) {
  const reduce = useReducedMotion()
  const state = opened ? 'show' : 'hidden'
  const letters = Array.from(config.herName)
  const base = reduce ? 0 : 0.9

  const word: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.055, delayChildren: base } },
  }
  const letter: Variants = {
    hidden: { y: reduce ? 0 : '110%', opacity: 0 },
    show: { y: '0%', opacity: 1, transition: { duration: reduce ? 0.2 : 1.1, ease: [0.2, 0.8, 0.2, 1] } },
  }
  const line: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: reduce ? 0.2 : 1.2, delay: reduce ? 0 : base + letters.length * 0.055 + 0.4 + i * 0.55 },
    }),
  }

  return (
    <section
      id="her"
      aria-label="For you"
      className="grain relative flex min-h-[100svh] items-center overflow-hidden px-6 pb-48 pt-20 text-ivory md:pb-56"
      style={{ background: 'linear-gradient(180deg, #21131F 0%, #2d1527 55%, #4B1728 100%)' }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="leak absolute -left-[20%] -top-[15%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(233,165,181,0.28),transparent_60%)]" />
        <div className="leak absolute -bottom-[30%] -right-[25%] h-[65vmax] w-[65vmax] rounded-full bg-[radial-gradient(circle,rgba(215,183,122,0.22),transparent_60%)] [animation-delay:-8s]" />
      </div>
      <FloatingHearts count={8} className="text-petal/70" />
      <EdgeFade edge="bottom" color="#FFF9F5" />

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p variants={line} custom={-1.6} initial="hidden" animate={state} className="font-hand text-3xl text-champagne sm:text-4xl">
          {config.intro.greeting}
        </motion.p>

        <motion.h1
          aria-label={config.herName}
          variants={word}
          initial="hidden"
          animate={state}
          className="mt-2 break-words font-serif text-[clamp(3.2rem,14vw,13rem)] italic leading-[0.9] tracking-[-0.02em] [text-shadow:0_0_60px_rgba(233,165,181,0.35)]"
        >
          {letters.map((ch, i) => (
            <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span className="inline-block" variants={letter}>
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1.3fr_1fr] md:items-end md:gap-16">
          <h2 className="font-serif text-[clamp(1.8rem,4.6vw,3.3rem)] leading-[1.08] text-blush">
            {config.intro.headlineLines.map((l, i) => (
              <motion.span key={i} variants={line} custom={i} initial="hidden" animate={state} className="block">
                {l}
              </motion.span>
            ))}
          </h2>
          <motion.p
            variants={line}
            custom={config.intro.headlineLines.length + 0.4}
            initial="hidden"
            animate={state}
            className="text-pretty max-w-sm border-l border-champagne/40 pl-5 text-base leading-relaxed text-ivory/75 sm:text-lg"
          >
            {config.intro.support}
          </motion.p>
        </div>
      </div>

      <motion.a
        href="#letter"
        onClick={(e) => { e.preventDefault(); scrollToTarget('#letter') }}
        variants={line}
        custom={4}
        initial="hidden"
        animate={state}
        className="absolute bottom-[calc(7.5rem+env(safe-area-inset-bottom,0px))] left-1/2 z-[2] md:bottom-[calc(10rem+env(safe-area-inset-bottom,0px))] flex -translate-x-1/2 flex-col items-center gap-2 rounded-full px-4 py-2 text-xs tracking-wide text-ivory/60 hover:text-ivory"
      >
        Keep going
        <motion.span animate={reduce ? {} : { y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </motion.a>
    </section>
  )
}
