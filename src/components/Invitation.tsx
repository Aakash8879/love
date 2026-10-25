import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { config } from '../config'
import Heart from './Heart'

const EASE = [0.7, 0, 0.2, 1] as const

/** Screen 1: a velvet curtain with the invitation. Opening it parts the curtain. */
export default function Invitation({ onOpen }: { onOpen: () => void }) {
  const [leaving, setLeaving] = useState(false)
  const reduce = useReducedMotion()
  const btn = useRef<HTMLButtonElement>(null)

  useEffect(() => { btn.current?.focus({ preventScroll: true }) }, [])

  const open = () => {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(onOpen, reduce ? 250 : 1900)
  }

  const curtain = { duration: reduce ? 0.2 : 1.4, ease: EASE, delay: reduce ? 0 : 0.45 }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="invite-title" className="fixed inset-0 z-50 overflow-hidden">
      {/* Curtain halves */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ background: 'radial-gradient(120% 80% at 100% 50%, #4B1728 0%, #2b1424 45%, #21131F 100%)' }}
        animate={leaving ? { x: '-101%' } : { x: 0 }}
        transition={curtain}
      >
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-champagne/50 to-transparent" />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ background: 'radial-gradient(120% 80% at 0% 50%, #4B1728 0%, #2b1424 45%, #21131F 100%)' }}
        animate={leaving ? { x: '101%' } : { x: 0 }}
        transition={curtain}
      >
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-champagne/50 to-transparent" />
      </motion.div>

      {/* Soft light that blooms as the curtain opens */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,249,245,0.9) 0%, rgba(247,221,226,0.5) 25%, transparent 60%)' }}
        initial={{ opacity: 0, scale: 0.2 }}
        animate={leaving ? { opacity: [0, 0.85, 0], scale: [0.2, 1, 1.6] } : { opacity: 0.08, scale: 0.6 }}
        transition={{ duration: leaving ? 1.6 : 0.1, ease: 'easeOut' }}
      />

      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      {/* Content */}
      <motion.div
        className="relative flex h-full flex-col items-center justify-center px-7 text-center text-ivory"
        animate={leaving ? { opacity: 0, y: -24, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduce ? 0.1 : 0.7, ease: 'easeOut' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-10 flex items-center gap-4 text-champagne"
          aria-hidden
        >
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-champagne/70" />
          <Heart className="h-4 w-4" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-champagne/70" />
        </motion.div>

        <motion.h1
          id="invite-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-balance max-w-4xl font-serif text-[clamp(2.5rem,8.5vw,6rem)] leading-[0.98] tracking-[-0.01em]"
        >
          {config.invitation.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.3 }}
          className="text-balance mt-7 max-w-md text-base leading-relaxed text-blush/75 sm:text-lg"
        >
          {config.invitation.subtitle}
        </motion.p>

        <motion.button
          ref={btn}
          type="button"
          onClick={open}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-glow mt-12 min-h-[52px] rounded-full bg-gradient-to-r from-burgundy via-[#6a2440] to-burgundy px-8 py-4 text-[0.95rem] font-medium tracking-wide text-ivory"
        >
          {config.invitation.button}
        </motion.button>
      </motion.div>
    </div>
  )
}
