import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import HeroScene from './HeroScene'

export default function GlobalCanvas() {
  // Hide on mobile for performance
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  if (isMobile) return null

  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>
    </Canvas>
  )
}
