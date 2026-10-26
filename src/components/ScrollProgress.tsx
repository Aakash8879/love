import { useState } from 'react'
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Heart from './Heart'
import { scrollToTarget } from '../lib/smoothScroll'

interface Chapter {
  id: string
  title: string
  icon: string
  progress: number
}

const CHAPTERS: Chapter[] = [
  { id: '#her', title: 'Dedication', icon: '✨', progress: 0.0 },
  { id: '#letter', title: 'Love Letter', icon: '💌', progress: 0.15 },
  { id: '#gallery', title: 'Our Memories', icon: '📸', progress: 0.32 },
  { id: '#memory-jar', title: 'Memory Jar', icon: '🫙', progress: 0.48 },
  { id: '#cake', title: 'Birthday Cake', icon: '🎂', progress: 0.64 },
  { id: '#garden', title: 'Love Garden', icon: '🌸', progress: 0.78 },
  { id: '#music', title: 'Our Song', icon: '🎵', progress: 0.90 },
  { id: '#finale', title: 'Forever', icon: '💖', progress: 1.0 },
]

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28 })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 })

  // Track vertical rail position: 0% to 100% of the rail's height
  const orbY = useTransform(smoothProgress, [0, 1], ['0%', '100%'])
  const railHeightPercent = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  const [hoveredChapter, setHoveredChapter] = useState<Chapter | null>(null)

  return (
    <>
      {/* ============================================================ */}
      {/* 1. TOP HORIZONTAL STARLIGHT BEAM                              */}
      {/* ============================================================ */}
      <div className="fixed inset-x-0 z-[45] pointer-events-none" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <motion.div
          aria-hidden
          className="h-[2.5px] origin-left bg-gradient-to-r from-petal via-champagne to-petal shadow-[0_0_12px_rgba(215,183,122,0.8)]"
          style={{ scaleX }}
        />
      </div>

      {/* ============================================================ */}
      {/* 2. CELESTIAL VERTICAL SCROLL RAIL (Right edge)                */}
      {/* Elegant glassmorphic constellation rail with floating heart orb */}
      {/* ============================================================ */}
      <aside
        aria-label="Chapter scroll navigation"
        className="fixed right-3 sm:right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center select-none"
      >
        {/* Rail Outer Pill Container */}
        <div className="relative flex flex-col items-center rounded-full border border-champagne/30 bg-[#21131F]/80 px-2 py-4 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:border-champagne/50 hover:bg-[#21131F]/90">
          
          {/* Top Star Accent */}
          <Sparkles className="mb-2 h-3 w-3 text-champagne animate-pulse opacity-85" />

          {/* Vertical Track Rail */}
          <div className="relative h-64 w-[3px] rounded-full bg-white/10 overflow-visible">
            {/* Active filled glowing gradient line */}
            <motion.div
              className="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-champagne via-petal to-champagne shadow-[0_0_8px_rgba(215,183,122,0.7)]"
              style={{ height: railHeightPercent }}
            />

            {/* Chapter Milestone Dots */}
            {CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => scrollToTarget(ch.id)}
                onMouseEnter={() => setHoveredChapter(ch)}
                onMouseLeave={() => setHoveredChapter(null)}
                aria-label={`Scroll to ${ch.title}`}
                className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                style={{ top: `${ch.progress * 100}%` }}
              >
                {/* Hit area */}
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-champagne/40 transition-all duration-300 group-hover:scale-150 group-hover:bg-champagne group-hover:shadow-[0_0_8px_#D7B77A]" />
                </span>
              </button>
            ))}

            {/* Floating Golden Heart Orb (Rides smoothly along rail as you scroll) */}
            <motion.div
              style={{ top: orbY }}
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              {/* Outer halo beacon */}
              <span className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-champagne/50 via-petal/40 to-champagne/50 blur-sm animate-pulse" />
              {/* Golden Heart Pill */}
              <div className="relative grid h-5 w-5 place-items-center rounded-full border border-champagne bg-gradient-to-br from-[#4B1728] via-[#21131F] to-[#4B1728] shadow-[0_0_12px_rgba(215,183,122,0.9)]">
                <Heart className="h-2.5 w-2.5 fill-champagne text-champagne animate-pulse" />
              </div>
            </motion.div>
          </div>

          {/* Bottom Star Accent */}
          <Heart className="mt-2.5 h-2.5 w-2.5 fill-petal/60 text-petal/60" />
        </div>

        {/* Floating Chapter Tooltip Preview Card */}
        <AnimatePresence>
          {hoveredChapter && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.94 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="flex items-center gap-2 rounded-full border border-champagne/45 bg-[#21131F]/95 px-3.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.55)] backdrop-blur-md">
                <span className="text-sm">{hoveredChapter.icon}</span>
                <span className="font-serif text-sm font-medium tracking-wide text-champagne">
                  {hoveredChapter.title}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </>
  )
}
