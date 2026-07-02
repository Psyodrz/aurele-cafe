import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollProgress() {
  const lineRef = useRef(null)

  useEffect(() => {
    gsap.to(lineRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    })
  }, [])

  return (
    <div
      ref={lineRef}
      className="scroll-progress"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '1px',
        width: '100%',
        background: 'var(--gold)',
        transformOrigin: 'left',
        transform: 'scaleX(0)',
        zIndex: 200,
      }}
    />
  )
}
