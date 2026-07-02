import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const REVIEWS = [
  {
    quote: "The best espresso I've had outside of Italy. A daily ritual that's become essential.",
    author: 'Camille Laurent',
    role: 'Regular since 2026',
  },
  {
    quote: 'An atmosphere suspended, outside of time. You come for the coffee and stay for the quiet.',
    author: 'Théo Marchand',
    role: 'Writer',
  },
  {
    quote: 'Every detail is considered, from the bean to the porcelain. Aurèle elevates coffee to an art.',
    author: 'Sophie Renaud',
    role: 'Food Critic',
  },
]

export default function TestimonialsSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonials__title', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        opacity: 0, y: 30, duration: 1, ease: 'expo.out',
      })
      gsap.from('.testimonials__card', {
        scrollTrigger: { trigger: '.testimonials__grid', start: 'top 78%' },
        opacity: 0, y: 50, duration: 1, ease: 'expo.out', stagger: 0.15,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="testimonials" id="testimonials">
      <div className="testimonials__header">
        <span className="testimonials__tag">02 — Testimonials</span>
        <h2 className="testimonials__title">What People Whisper</h2>
      </div>
      <div className="testimonials__grid">
        {REVIEWS.map((r) => (
          <figure key={r.author} className="testimonials__card">
            <span className="testimonials__quote-mark">“</span>
            <blockquote className="testimonials__quote">{r.quote}</blockquote>
            <figcaption className="testimonials__author">
              <span className="testimonials__author-name">{r.author}</span>
              <span className="testimonials__author-role">{r.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
