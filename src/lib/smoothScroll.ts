import Lenis from 'lenis'

/**
 * Inertia ("buttery") scrolling for mouse wheels and trackpads.
 * Touch screens keep their native scrolling, which already feels smooth and natural.
 * Disabled automatically when the device asks for reduced motion.
 */
let lenis: Lenis | null = null
let rafId = 0

export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true })
  const raf = (time: number) => {
    lenis?.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
  return () => {
    cancelAnimationFrame(rafId)
    lenis?.destroy()
    lenis = null
  }
}

export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) lenis?.stop()
  else lenis?.start()
}

export function scrollToTarget(target: string | number, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) })
    return
  }
  const behavior: ScrollBehavior = immediate ? 'auto' : 'smooth'
  if (typeof target === 'number') window.scrollTo({ top: target, behavior })
  else document.querySelector(target)?.scrollIntoView({ behavior })
}
