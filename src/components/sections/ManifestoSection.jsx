import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function splitWords(el) {
  if (!el) return []
  const words = el.textContent.trim().split(/\s+/)
  el.innerHTML = words
    .map(w => `<span class="word" style="display:inline-block">${w}</span>`)
    .join(' ')
  return el.querySelectorAll('.word')
}

export default function ManifestoSection() {
  const sectionRef = useRef(null)
  const quoteRef = useRef(null)
  const attributionRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    const words = splitWords(quoteRef.current)
    if (!words.length) return

    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0, y: 15 })

      gsap.to(words, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          end: 'center 40%',
          scrub: 1.8,
        },
        opacity: 1,
        y: 0,
        stagger: 0.04,
        ease: 'none',
      })

      gsap.from(attributionRef.current, {
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'bottom 60%',
        },
        opacity: 0,
        y: 15,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.from(bodyRef.current, {
        scrollTrigger: {
          trigger: attributionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="manifesto">
      <div className="manifesto__bar" />
      <div className="manifesto__inner">
        <blockquote ref={quoteRef} className="manifesto__quote">
          Coffee is not a drink. It is a ritual.
        </blockquote>
        <p ref={attributionRef} className="manifesto__attribution">— Aurèle, Paris</p>
        <p ref={bodyRef} className="manifesto__body">
          We believe every cup deserves complete attention. Carefully selected
          beans, a mastered extraction, a moment suspended in time.
        </p>
      </div>
    </section>
  )
}
