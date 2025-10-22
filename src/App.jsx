import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './components/Scene'
import { Controls } from './components/Controls'
import { ChatPanel } from './components/Chat/ChatPanel'
import './App.css'

function App() {
  const [showChat, setShowChat] = useState(true)
  
  return (
    <div className="app">
      {/* Split View Layout */}
      <div className={`app-layout ${showChat ? 'split-view' : 'full-view'}`}>
        
        {/* Chat Panel */}
        {showChat && (
          <div className="chat-container">
            <ChatPanel />
          </div>
        )}
        
        {/* Blob Visualizer */}
        <div className="blob-container">
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
          
          <div className="blob-overlay">
            <div className="blob-header">
              <h1>AI Agent Visualizer</h1>
              <p>Watch me react to our conversation</p>
            </div>
            
            <button
              className="toggle-chat-button"
              onClick={() => setShowChat(!showChat)}
              title={showChat ? 'Hide Chat' : 'Show Chat'}
            >
              {showChat ? '◀️' : '▶️'}
            </button>
            
            <div className="blob-footer">
              <a href="https://github.com/banique15/blob-mixer" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default App