import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollVideoSection({ videoSrc, poster, title, subtitle }) {
  const videoRef = useRef(null)
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const rafRef = useRef(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let loaded = false
    // Defer the actual download/decode until the section is near the viewport.
    // Until then the poster image is shown, so idle sections cost nothing.
    const loadVideo = () => {
      if (loaded) return
      loaded = true
      video.preload = 'auto'
      video.load()
      video.pause()
      try { video.currentTime = 0.05 } catch (e) { /* ignore */ }
    }

    let isSeeking = false
    const onSeeked = () => { isSeeking = false }
    video.addEventListener('seeked', onSeeked)

    // RAF seek loop — runs ONLY while this section is on-screen
    const tick = () => {
      const duration = video.duration
      if (duration && !isNaN(duration) && video.readyState >= 2) {
        const target = progressRef.current * duration
        if (!isSeeking && Math.abs(video.currentTime - target) > 0.03) {
          isSeeking = true
          video.currentTime = target
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

    const ctx = gsap.context(() => {
      // Begin loading one viewport early so the clip is ready by the time it
      // pins, without every section downloading on first paint.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: loadVideo,
        onEnterBack: loadVideo,
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
        // Free up video decoders by only scrubbing the visible section
        onToggle: (self) => {
          if (self.isActive) { loadVideo(); startRAF() }
          else stopRAF()
        },
      })
    }, sectionRef)

    return () => {
      stopRAF()
      ctx.revert()
      video.removeEventListener('seeked', onSeeked)
    }
  }, [])

  return (
    <section ref={sectionRef} style={styles.section}>
      <div ref={pinRef} style={styles.pin}>
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          style={styles.video}
          muted
          playsInline
          preload="none"
        />
        <div style={styles.overlay}>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
          <h2 style={styles.title}>{title}</h2>
          <p style={styles.hint}>↕ scroll</p>
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: {
    height: '200vh',
    position: 'relative',
    background: '#0A0906',
  },
  pin: {
    position: 'sticky',
    top: 0,
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    bottom: '12vh',
    left: '8vw',
    zIndex: 2,
  },
  subtitle: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.6rem',
    color: '#C9A86C',
    letterSpacing: '0.4em',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
  },
  title: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: 'clamp(3rem, 8vw, 7rem)',
    color: '#F4F0EA',
    fontWeight: 300,
    lineHeight: 1.1,
    margin: 0,
  },
  hint: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.55rem',
    color: '#C9A86C',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    opacity: 0.5,
    marginTop: '1rem',
  },
}
