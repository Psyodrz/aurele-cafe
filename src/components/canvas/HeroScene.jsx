import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { useRef } from 'react'
import { ChemexModel } from './ChemexModel'

export default function HeroScene() {
  const groupRef = useRef(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.08
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.05
  })

  return (
    <>
      <ambientLight intensity={0.2} color="#F4F0EA" />
      <directionalLight position={[3, 4, 3]} intensity={0.6} color="#C9A86C" />
      <group ref={groupRef} position={[2.5, -0.5, 0]} scale={0.9}>
        <ChemexModel />
      </group>
      <Environment preset="studio" />
    </>
  )
}
