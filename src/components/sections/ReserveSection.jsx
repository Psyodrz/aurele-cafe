import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ReserveSection() {
  const sectionRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', date: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reserve__eyebrow, .reserve__title', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        opacity: 0, y: 40, duration: 1.1, ease: 'expo.out', stagger: 0.15,
      })
      gsap.from('.reserve__field, .reserve__btn', {
        scrollTrigger: { trigger: '.reserve__form', start: 'top 70%' },
        opacity: 0, y: 20, duration: 0.9, ease: 'power3.out', stagger: 0.1,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Your name is required'
    if (!form.email.trim()) next.email = 'Your email is required'
    else if (!EMAIL_RE.test(form.email)) next.email = 'Invalid email address'
    if (!form.date) next.date = 'Please choose a date'
    else if (form.date < new Date().toISOString().split('T')[0]) {
      next.date = 'The date must be in the future'
    }
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length === 0) {
      // No backend — confirm client-side
      setSubmitted(true)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <section ref={sectionRef} className="reserve" id="reserve">
      <span className="reserve__eyebrow">Your Table Awaits</span>
      <h2 className="reserve__title">Reserve<br />your moment</h2>

      {submitted ? (
        <div className="reserve__success" role="status">
          <span className="reserve__success-mark">✓</span>
          <h3 className="reserve__success-title">Thank you, {form.name.split(' ')[0]}.</h3>
          <p className="reserve__success-text">
            Your request for {new Date(form.date).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })} has been received. We'll confirm by email within 24 hours.
          </p>
          <button
            className="reserve__btn"
            onClick={() => {
              setSubmitted(false)
              setForm({ name: '', email: '', date: '', message: '' })
            }}
          >
            New reservation
          </button>
        </div>
      ) : (
        <form className="reserve__form" onSubmit={handleSubmit} noValidate>
          <div className="reserve__field">
            <input
              className="reserve__input"
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={update('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name && <span className="reserve__error">{errors.name}</span>}
          </div>

          <div className="reserve__field">
            <input
              className="reserve__input"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={update('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className="reserve__error">{errors.email}</span>}
          </div>

          <div className="reserve__field">
            <input
              className="reserve__input"
              type="date"
              min={today}
              value={form.date}
              onChange={update('date')}
              aria-invalid={!!errors.date}
            />
            {errors.date && <span className="reserve__error">{errors.date}</span>}
          </div>

          <div className="reserve__field">
            <textarea
              className="reserve__input reserve__textarea"
              placeholder="Your Message (optional)"
              rows={3}
              value={form.message}
              onChange={update('message')}
            />
          </div>

          <button className="reserve__btn" type="submit">Reserve</button>
        </form>
      )}
    </section>
  )
}
