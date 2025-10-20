import { Suspense } from 'react'
import { OrbitControls, Environment } from '@react-three/drei'
import { Blob } from './Blob'

export function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Main Blob */}
      <Suspense fallback={null}>
        <Blob position={[0, 0, 0]} />
      </Suspense>
      
      {/* Camera Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={0.5}
        maxDistance={3}
        target={[0, 0, 0]}
      />
      
      {/* Environment for reflections */}
      <Environment preset="studio" />
    </>
  )
}

export default Scene