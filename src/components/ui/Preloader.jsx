import { useEffect, useRef, useState } from 'react'

// CSS-driven preloader: entrance, bar fill and exit all run on the compositor
// thread so they stay perfectly smooth even while the main thread is busy
// mounting Three.js / decoding videos. Only the numeric counter runs in JS.
const FILL_DELAY = 600   // matches the bar's CSS animation-delay (ms)
const FILL_DURATION = 2000 // matches the bar's CSS animation-duration (ms)
const EXIT_PAUSE = 300   // hold at 100% before sliding away (ms)

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export default function Preloader() {
  const counterRef = useRef(null)
  const [leaving, setLeaving] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let raf
    const start = performance.now() + FILL_DELAY

    const loop = (now) => {
      const t = Math.min(Math.max((now - start) / FILL_DURATION, 0), 1)
      if (counterRef.current) {
        counterRef.current.textContent =
          String(Math.round(easeInOutCubic(t) * 100)).padStart(3, '0')
      }
      if (t < 1) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const leaveTimer = setTimeout(
      () => setLeaving(true),
      FILL_DELAY + FILL_DURATION + EXIT_PAUSE
    )

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(leaveTimer)
    }
  }, [])

  if (done) return null

  return (
    <div
      className={`preloader${leaving ? ' is-leaving' : ''}`}
      onTransitionEnd={(e) => {
        if (leaving && e.propertyName === 'transform') setDone(true)
      }}
    >
      <div className="preloader__center">
        <span className="preloader__eyebrow">Parisian Café</span>
        <h1 className="preloader__title">Aurèle</h1>
      </div>
      <div className="preloader__footer">
        <div className="preloader__bar-track">
          <div className="preloader__bar" />
        </div>
        <span ref={counterRef} className="preloader__counter">000</span>
      </div>
    </div>
  )
}
