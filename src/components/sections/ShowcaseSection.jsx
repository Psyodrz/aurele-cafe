import { Suspense, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LatteModel } from '../canvas/LatteModel'

export default function ShowcaseSection() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current.children, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
        opacity: 0,
        x: -40,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.15,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="showcase">
      <div ref={textRef} className="showcase__text">
        <span className="showcase__eyebrow">Craft</span>
        <h2 className="showcase__title">The Art<br />of Coffee</h2>
        <p className="showcase__body">
          Every cup is a work of art. Our barista composes each extraction
          with the precision of a seasoned artist.
        </p>
        <div className="showcase__hint">↺ Drag to rotate</div>
      </div>

      <div className="showcase__canvas-wrap">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 42 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} color="#F4F0EA" />
            <directionalLight position={[4, 6, 4]} intensity={1.2} color="#C9A86C" castShadow />
            <directionalLight position={[-4, 2, -2]} intensity={0.3} color="#F4F0EA" />
            <LatteModel />
            <Environment preset="studio" />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.6}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.8}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  )
}
