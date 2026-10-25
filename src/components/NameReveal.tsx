import { useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowDown, Heart as HeartIcon, Sparkles } from 'lucide-react'
import { config } from '../config'
import FloatingHearts from './FloatingHearts'
import { scrollToTarget } from '../lib/smoothScroll'

/**
 * Screen 2: Her name revealed as a celestial centerpiece.
 * Elevated with metallic gradient typography, zero shadow clipping artifacts,
 * luxury glassmorphism quote card, and a smooth organic horizon transition.
 */
export default function NameReveal({ opened }: { opened: boolean }) {
  const reduce = useReducedMotion()
  const state = opened ? 'show' : 'hidden'
  const letters = Array.from(config.herName)
  const base = reduce ? 0 : 0.8

  const [tappedHearts, setTappedHearts] = useState<{ id: number; x: number; y: number }[]>([])

  const triggerSparkleBurst = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now() + Math.random()

    setTappedHearts((prev) => [...prev, { id, x, y }])
    setTimeout(() => {
      setTappedHearts((prev) => prev.filter((h) => h.id !== id))
    }, 2000)
  }

  const wordVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.065,
        delayChildren: base,
      },
    },
  }

  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: reduce ? 0 : 35,
      scale: reduce ? 1 : 0.9,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduce ? 0.2 : 0.95,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const lineVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0.2 : 1.1,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <section
      id="her"
      aria-label="For you"
      className="grain relative flex min-h-[100svh] items-center overflow-hidden px-6 pb-36 pt-24 text-ivory md:pb-44 md:pt-32"
      style={{
        background:
          'radial-gradient(120% 85% at 50% 20%, #381525 0%, #261121 45%, #180916 100%)',
      }}
    >
      {/* Ambient background celestial light leaks */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="leak absolute -left-[20%] -top-[15%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(233,165,181,0.22),transparent_65%)]" />
        <div className="leak absolute -bottom-[25%] -right-[20%] h-[65vmax] w-[65vmax] rounded-full bg-[radial-gradient(circle,rgba(215,183,122,0.18),transparent_65%)] [animation-delay:-8s]" />
      </div>

      <FloatingHearts count={10} className="text-petal/60" />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Top Celestial Badge */}
        <motion.div
          variants={lineVariants}
          custom={base - 0.2}
          initial="hidden"
          animate={state}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-plum/60 px-4 py-1.5 text-xs font-semibold tracking-wider text-champagne shadow-md backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-champagne animate-pulse" />
          <span className="uppercase tracking-[0.2em]">A Birthday Dedication</span>
        </motion.div>

        {/* Handwritten Greeting */}
        <motion.p
          variants={lineVariants}
          custom={base}
          initial="hidden"
          animate={state}
          className="font-hand text-3xl font-bold text-champagne drop-shadow-sm sm:text-4xl md:text-5xl"
        >
          {config.intro.greeting}
        </motion.p>

        {/* ============================================================ */}
        {/* THE CENTERPIECE NAME: BHAVANA (Seamless, No Clipping Seams)   */}
        {/* ============================================================ */}
        <div className="relative my-2 sm:my-4">
          <motion.h1
            aria-label={config.herName}
            variants={wordVariants}
            initial="hidden"
            animate={state}
            onClick={triggerSparkleBurst}
            className="group cursor-pointer select-none font-serif text-[clamp(3.8rem,15vw,13.5rem)] italic leading-[0.88] tracking-[-0.02em] filter drop-shadow-[0_10px_35px_rgba(233,165,181,0.35)]"
          >
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="inline-block bg-gradient-to-b from-[#FFFDF9] via-[#faebd0] to-[#e8a3b4] bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105"
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}
          </motion.h1>

          {/* Interactive Tap Heart Particles on Name */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
            {tappedHearts.map((h) => (
              <motion.span
                key={h.id}
                initial={{ opacity: 1, y: h.y, x: h.x, scale: 0.6 }}
                animate={{ opacity: 0, y: h.y - 70, scale: 1.4 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute font-hand text-2xl text-petal"
              >
                ♡
              </motion.span>
            ))}
          </div>
        </div>

        {/* Lower Row: Poetic Headline & Glassmorphism Quote Card */}
        <div className="mt-8 grid gap-8 sm:mt-12 md:grid-cols-[1.25fr_1fr] md:items-center md:gap-14">
          {/* Headline */}
          <h2 className="font-serif text-[clamp(2rem,5vw,3.6rem)] leading-[1.08] text-blush drop-shadow-sm">
            {config.intro.headlineLines.map((l, i) => (
              <motion.span
                key={i}
                variants={lineVariants}
                custom={base + letters.length * 0.065 + 0.3 + i * 0.25}
                initial="hidden"
                animate={state}
                className="block"
              >
                {l}
              </motion.span>
            ))}
          </h2>

          {/* Support Quote Card */}
          <motion.div
            variants={lineVariants}
            custom={base + letters.length * 0.065 + 0.8}
            initial="hidden"
            animate={state}
            className="relative rounded-2xl border border-champagne/30 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent p-6 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.55)] backdrop-blur-md"
          >
            {/* Top gold heart quote icon */}
            <div className="mb-3 flex items-center gap-2 text-champagne">
              <HeartIcon className="h-4 w-4 fill-champagne/40" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-champagne/80">
                Forever In My Heart
              </span>
            </div>

            <p className="text-pretty text-base leading-relaxed text-ivory/85 sm:text-lg">
              “{config.intro.support}”
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sleek Scroll Button */}
      <motion.a
        href="#letter"
        onClick={(e) => {
          e.preventDefault()
          scrollToTarget('#letter')
        }}
        variants={lineVariants}
        custom={base + letters.length * 0.065 + 1.2}
        initial="hidden"
        animate={state}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-champagne/35 bg-plum/70 px-5 py-2.5 text-xs font-semibold tracking-wider text-champagne shadow-lg backdrop-blur-md transition hover:border-champagne hover:bg-plum hover:text-ivory"
      >
        <span>Scroll to your letter</span>
        <motion.span
          animate={reduce ? {} : { y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-3.5 w-3.5" aria-hidden />
        </motion.span>
      </motion.a>

      {/* ============================================================ */}
      {/* ORGANIC CURVED HORIZON DIVIDER (Transitions smoothly to #FFF9F5) */}
      {/* Replaces the washed-out white fog band with a crisp curve     */}
      {/* ============================================================ */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 inset-x-0 h-16 w-full overflow-hidden sm:h-24"
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          className="h-full w-full text-ivory"
        >
          <path
            d="M0,45 C320,105 480,15 720,55 C960,95 1120,25 1440,65 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  )
}
