import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Helper: split text into character spans
function splitChars(el) {
  if (!el) return []
  const text = el.textContent
  el.innerHTML = text
    .split('')
    .map(c => `<span class="char" style="display:inline-block; overflow:hidden"><span class="char-inner">${c === ' ' ? '&nbsp;' : c}</span></span>`)
    .join('')
  return el.querySelectorAll('.char-inner')
}

export default function HeroSection() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const videoRef = useRef(null)
  const titleRef = useRef(null)
  const eyebrowRef = useRef(null)
  const subRef = useRef(null)
  const scrollRef = useRef(null)
  const rafRef = useRef(null)
  const progressRef = useRef(0)

  // Entry text animation (unchanged)
  useEffect(() => {
    const chars = splitChars(titleRef.current)
    if (!chars.length) return

    gsap.set(chars, { y: '110%' })
    gsap.set([eyebrowRef.current, subRef.current, scrollRef.current], { opacity: 0, y: 10 })

    const tl = gsap.timeline({ delay: 0.4 })

    tl.to(chars, {
      y: '0%',
      duration: 1.3,
      ease: 'expo.out',
      stagger: 0.05,
    })
    .to(eyebrowRef.current, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    }, '-=0.9')
    .to(subRef.current, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
    }, '-=0.7')
    .to(scrollRef.current, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
    }, '-=0.4')

    return () => tl.kill()
  }, [])

  // Scroll-scrubbed background video
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Force full buffer: seek to end then back to 0
    const forceBuffer = () => {
      video.currentTime = video.duration
      setTimeout(() => { video.currentTime = 0 }, 300)
    }

    video.addEventListener('loadedmetadata', forceBuffer)
    video.load()
    video.pause()

    // RAF loop for smooth scrub
    const tick = () => {
      const duration = video.duration
      if (duration && !isNaN(duration) && video.readyState >= 2) {
        const target = progressRef.current * duration
        if (Math.abs(video.currentTime - target) > 0.01) {
          if (video.fastSeek) {
            video.fastSeek(target)
          } else {
            video.currentTime = target
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    const startRAF = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick)
    }
    const stopRAF = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
    // Hero is at the top, so start immediately
    startRAF()

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
        onToggle: (self) => {
          if (self.isActive) startRAF()
          else stopRAF()
        },
      })
    }, sectionRef)

    return () => {
      stopRAF()
      video.removeEventListener('loadedmetadata', forceBuffer)
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="hero">
      <div ref={pinRef} className="hero__pin">
        <video
          ref={videoRef}
          src="/coffee-roasting-seek.mp4"
          className="hero__video"
          muted
          playsInline
          preload="auto"
        />
        <div className="hero__content">
          <span ref={eyebrowRef} className="hero__eyebrow">A Sensory Experience</span>
          <h1 ref={titleRef} className="hero__title">Aurèle</h1>
          <p ref={subRef} className="hero__sub">Parisian Café · Est. 2026</p>
        </div>
        <div ref={scrollRef} className="hero__scroll">
          <div className="hero__scroll-line" />
          <span className="hero__scroll-text">Scroll</span>
        </div>
      </div>
    </section>
  )
}
