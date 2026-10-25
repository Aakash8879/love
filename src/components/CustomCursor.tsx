import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

/** A soft trailing ring, desktop only. The native cursor stays visible for usability. */
export default function CustomCursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 })

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY)
      const el = e.target as HTMLElement | null
      setActive(!!el?.closest('button, a, [data-cursor="hover"]'))
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [reduce, x, y])

  if (!enabled) return null
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] h-8 w-8 rounded-full border border-champagne/80"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{ scale: active ? 1.7 : 1, backgroundColor: active ? 'rgba(215,183,122,0.18)' : 'rgba(215,183,122,0)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    />
  )
}
