import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

export function ChemexModel() {
  const { scene } = useGLTF('/models/chemex.glb')

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        node.material.roughness = 0.2
        node.material.metalness = 0.05
        node.material.envMapIntensity = 2.0
        node.material.needsUpdate = true
        node.castShadow = true
        node.receiveShadow = true
      }
    })
  }, [scene])

  return <primitive object={scene} />
}
