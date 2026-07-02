import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function fadeInUp(el, opts = {}) {
  const {
    trigger = el,
    start = 'top 80%',
    duration = 1,
    y = 40,
    ease = 'expo.out',
    delay = 0,
  } = opts

  return gsap.from(el, {
    scrollTrigger: { trigger, start, toggleActions: 'play none none none' },
    opacity: 0,
    y,
    duration,
    ease,
    delay,
  })
}

export function staggerFadeIn(els, opts = {}) {
  const {
    trigger,
    start = 'top 75%',
    duration = 1,
    y = 60,
    ease = 'expo.out',
    stagger = 0.15,
  } = opts

  return gsap.from(els, {
    scrollTrigger: { trigger, start, toggleActions: 'play none none none' },
    opacity: 0,
    y,
    duration,
    ease,
    stagger,
  })
}
