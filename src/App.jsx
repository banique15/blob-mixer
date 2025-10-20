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
          <h1>AI Agent Visualizer</h1>
          <p>Emotional State Representation</p>
        </div>
        
        <div className="instructions">
          <p>🖱️ Drag to rotate • 🔍 Scroll to zoom</p>
          <p>🤖 Switch AI states in the control panel</p>
          <p>💭 Watch the blob transform with each emotion</p>
        </div>
        
        <div className="credits">
          <a href="https://github.com/banique15/blob-mixer" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}

export default App