import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (e) => { xTo(e.clientX); yTo(e.clientY) }
    window.addEventListener('mousemove', onMove)

    // Expand on interactive elements
    const addHoverListeners = () => {
      const targets = document.querySelectorAll('a, button, .menu__card, input, textarea')
      targets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'))
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'))
      })
    }

    // Add listeners after a short delay to ensure DOM is ready
    const timer = setTimeout(addHoverListeners, 500)

    return () => {
      window.removeEventListener('mousemove', onMove)
      clearTimeout(timer)
    }
  }, [])

  return <div ref={cursorRef} className="cursor" />
}
