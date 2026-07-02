import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initScroll } from './lib/scroll'
import GlobalCanvas from './components/canvas/GlobalCanvas'
import NavSection from './components/sections/NavSection'
import HeroSection from './components/sections/HeroSection'
import ManifestoSection from './components/sections/ManifestoSection'
import ScrollVideoSection from './components/ScrollVideoSection'
import MenuSection from './components/sections/MenuSection'
import GallerySection from './components/sections/GallerySection'
import TestimonialsSection from './components/sections/TestimonialsSection'
import ReserveSection from './components/sections/ReserveSection'
import HoursSection from './components/sections/HoursSection'
import FooterSection from './components/sections/FooterSection'
import ShowcaseSection from './components/sections/ShowcaseSection'
import Cursor from './components/ui/Cursor'
import ScrollProgress from './components/ui/ScrollProgress'
import Preloader from './components/ui/Preloader'

export default function App() {
  useEffect(() => {
    const lenis = initScroll()

    // After all sections, videos and fonts have settled, recalculate every
    // ScrollTrigger position so reveal animations aren't stuck at opacity 0.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t1 = setTimeout(refresh, 600)
    const t2 = setTimeout(refresh, 1500)

    return () => {
      window.removeEventListener('load', refresh)
      clearTimeout(t1)
      clearTimeout(t2)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <Preloader />
      <GlobalCanvas />
      <Cursor />
      <ScrollProgress />
      <NavSection />
      <main>
        <HeroSection />
        <ManifestoSection />
        <ScrollVideoSection
          videoSrc="/cafe-day-night-seek.mp4"
          poster="/images/cafe-day-night.png"
          title="The Atmosphere"
          subtitle="Day to Night"
        />
        <MenuSection />
        <ScrollVideoSection
          videoSrc="/cafe-interior-seek.mp4"
          poster="/images/cafe-interior.png"
          title="The Space"
          subtitle="Our World"
        />
        <ShowcaseSection />
        <GallerySection />
        <TestimonialsSection />
        <ReserveSection />
        <HoursSection />

        {/* Our Story / Philosophy */}
        <ScrollVideoSection
          videoSrc="/morning-coffee-seek.mp4"
          poster="/images/morning-coffee.png"
          title="Every morning, a ritual"
          subtitle="Our Story"
        />
        <ScrollVideoSection
          videoSrc="/cafe-day-night-seek.mp4"
          poster="/images/cafe-day-night.png"
          title="From dawn to dusk"
          subtitle="Our Philosophy"
        />

        {/* Coffee Origins & Alchemy */}
        <ScrollVideoSection
          videoSrc="/coffee-roasting-seek.mp4"
          poster="/images/coffee-roasting.png"
          title="From bean to roast"
          subtitle="Coffee Origins"
        />
        <ScrollVideoSection
          videoSrc="/coffee-transform-seek.mp4"
          poster="/images/coffee-transform.png"
          title="A craft transformed"
          subtitle="The Alchemy"
        />

        {/* Gourmet Art / Signature Menu */}
        <ScrollVideoSection
          videoSrc="/liquid-gourmet-seek.mp4"
          poster="/images/liquid-gourmet.png"
          title="The art of the pour"
          subtitle="Gourmet Art"
        />
        <ScrollVideoSection
          videoSrc="/dessert-reveal-seek.mp4"
          poster="/images/dessert-reveal.png"
          title="Crafted to indulge"
          subtitle="Signature Menu"
        />

        <FooterSection />
      </main>
    </>
  )
}
