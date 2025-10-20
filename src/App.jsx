import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './components/Scene'
import { Controls } from './components/Controls'
import './App.css'

function App() {
  return (
    <div className="app">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{
          fov: 40,
          near: 0.1,
          far: 100,
          position: [0, 0, 2],
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#141518']} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      <Controls />
      
      <div className="ui-overlay">
        <div className="title">
          <h1>Blob Mixer</h1>
          <p>Interactive 3D Blob Generator</p>
        </div>
        
        <div className="instructions">
          <p>🖱️ Drag to rotate • 🔍 Scroll to zoom</p>
          <p>🎨 Use controls panel to customize</p>
        </div>
        
        <div className="credits">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            View Source
          </a>
        </div>
      </div>
    </div>
  )
}

export default App