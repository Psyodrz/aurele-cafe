import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis

export function initScroll() {
  // Stop the browser from restoring the previous scroll position on reload/HMR,
  // which otherwise drops you mid-page (e.g. the menu) instead of the hero.
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)

  lenis = new Lenis({
    // Frame-rate-independent smoothing — buttery but stays responsive
    // (more consistent than duration/easing across 60/120/144Hz displays)
    lerp: 0.12,
    smoothWheel: true,
    wheelMultiplier: 1,
    // Smooth on trackpads/touch too, without feeling sluggish
    syncTouch: true,
    touchMultiplier: 1.5,
    orientation: 'vertical',
  })

  // CRITICAL: Connect Lenis to ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  // Ensure we land at the very top once Lenis is wired up.
  lenis.scrollTo(0, { immediate: true, force: true })

  return lenis
}

export function getLenis() { return lenis }
