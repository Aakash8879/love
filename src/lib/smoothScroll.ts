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
  if (locked) {
    lenis?.stop()
    resetScrollTop()
  } else {
    lenis?.start()
  }
}

export function resetScrollTop() {
  if (typeof window === 'undefined') return
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  if (lenis) {
    lenis.scrollTo(0, { immediate: true })
  }
}

export function scrollToTarget(target: string | number, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, duration: immediate ? 0 : 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) })
    if (immediate && typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior })
    }
    return
  }
  const behavior: ScrollBehavior = immediate ? 'auto' : 'smooth'
  if (typeof target === 'number') window.scrollTo({ top: target, behavior })
  else document.querySelector(target)?.scrollIntoView({ behavior })
}
