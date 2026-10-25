import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 z-[45] h-[2px] origin-left bg-gradient-to-r from-petal via-champagne to-petal"
      style={{ scaleX, top: 'env(safe-area-inset-top, 0px)' }}
    />
  )
}
