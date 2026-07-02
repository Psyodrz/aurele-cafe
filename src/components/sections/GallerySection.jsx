import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const IMAGES = [
  { src: '/images/gallery/interior-1.png', alt: 'Aurèle interior' },
  { src: '/images/gallery/table.png', alt: 'Set table' },
  { src: '/images/gallery/bar.png', alt: 'Coffee bar' },
  { src: '/images/gallery/window.png', alt: 'Natural light' },
]

export default function GallerySection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery__title', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        opacity: 0, y: 30, duration: 1, ease: 'expo.out',
      })

      // Parallax each image at different speeds
      document.querySelectorAll('.gallery__img').forEach((img, i) => {
        const yAmt = i % 2 === 0 ? -40 : 40
        gsap.to(img, {
          y: yAmt,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.gallery__item'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        })
      })

      // Stagger reveal on scroll
      gsap.from('.gallery__item', {
        scrollTrigger: {
          trigger: '.gallery__grid',
          start: 'top 75%',
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.12,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="gallery" id="gallery">
      <div className="gallery__header">
        <h2 className="gallery__title">The Atmosphere</h2>
      </div>
      <div className="gallery__grid">
        {IMAGES.map((img, i) => (
          <div key={i} className="gallery__item">
            <img src={img.src} alt={img.alt} className="gallery__img" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  )
}
