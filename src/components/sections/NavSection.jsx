import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function NavSection() {
  const navRef = useRef(null)

  useEffect(() => {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top -80',
      onEnter: () => navRef.current?.classList.add('nav--scrolled'),
      onLeaveBack: () => navRef.current?.classList.remove('nav--scrolled'),
    })

    // Entry animation
    gsap.from(navRef.current, {
      y: -20, opacity: 0, duration: 1, delay: 1.8, ease: 'power3.out'
    })
  }, [])

  const handleClick = (e) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute('href')
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav ref={navRef} className="nav">
      <a href="/" className="nav__logo">Aurèle</a>
      <ul className="nav__links">
        <li><a href="#menu" onClick={handleClick}>Menu</a></li>
        <li><a href="#gallery" onClick={handleClick}>Atmosphere</a></li>
        <li><a href="#hours" onClick={handleClick}>Hours</a></li>
        <li><a href="#reserve" onClick={handleClick}>Reserve</a></li>
      </ul>
      <a href="#reserve" className="nav__cta" onClick={handleClick}>Reserve</a>
    </nav>
  )
}
