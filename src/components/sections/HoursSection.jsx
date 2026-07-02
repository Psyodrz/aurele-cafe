import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const HOURS = [
  { day: 'Monday — Friday', time: '07:00 — 20:00' },
  { day: 'Saturday', time: '08:00 — 22:00' },
  { day: 'Sunday', time: '09:00 — 18:00' },
]

export default function HoursSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hours__col', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        opacity: 0, y: 40, duration: 1, ease: 'expo.out', stagger: 0.15,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="hours" id="hours">
      <div className="hours__inner">
        <div className="hours__col">
          <span className="hours__tag">03 — Visit</span>
          <h2 className="hours__title">Hours<br />&amp; Address</h2>
        </div>

        <div className="hours__col">
          <h3 className="hours__label">Opening</h3>
          <ul className="hours__list">
            {HOURS.map((h) => (
              <li key={h.day} className="hours__item">
                <span className="hours__day">{h.day}</span>
                <span className="hours__time">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hours__col">
          <h3 className="hours__label">Find Us</h3>
          <address className="hours__address">
            14 Rue des Lilas<br />
            75004 Paris, France
          </address>
          <a href="tel:+33142000000" className="hours__contact">+33 1 42 00 00 00</a>
          <a href="mailto:hello@aurele.cafe" className="hours__contact">hello@aurele.cafe</a>
        </div>
      </div>
    </section>
  )
}
