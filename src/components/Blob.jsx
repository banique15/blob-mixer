import { useRef, useState, useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import { WebGLCubeRenderTarget } from 'three'
import { useThree } from '@react-three/fiber'
import { useSpring, animated, config } from '@react-spring/three'
import { AnimatedSphere } from './AnimatedSphere'
import { useStore } from '../store'

// Import gradient textures
import gradient4 from '../assets/gradients/cloudconvert/06_cosmic-fusion.c57d060d.png'
import envMapSrc from '../assets/envmap-2048.min.jpg'


export function Blob({ position = [0, 0, 0], ...props }) {
  const materialRef = useRef()
  const blobRef = useRef()
  const { gl, size } = useThree()
  
  // Use local state and subscribe to store manually
  const [localBlobConfig, setLocalBlobConfig] = useState(useStore.getState().blobConfig)
  const [localAudioData, setLocalAudioData] = useState(useStore.getState().audioData)
  const [localIsSpeaking, setLocalIsSpeaking] = useState(useStore.getState().isSpeaking)
  const [currentAnimation, setCurrentAnimation] = useState({})
  
  const [envMap, setEnvMap] = useState()
  const [loaded, setLoaded] = useState(false)
  
  // Subscribe to store changes - prevent infinite loop by only updating when values actually change
  useEffect(() => {
    const unsubscribe = useStore.subscribe((state) => {
      setLocalBlobConfig(prev => {
        // Only update if config actually changed
        if (JSON.stringify(prev) !== JSON.stringify(state.blobConfig)) {
          return state.blobConfig
        }
        return prev
      })
      
      setLocalAudioData(state.audioData)
      setLocalIsSpeaking(state.isSpeaking)
      
      // Update animation parameters when preset changes
      const currentPreset = state.presets.find(p => p.id === state.selectedPreset)
      if (currentPreset && currentPreset.animation) {
        setCurrentAnimation(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(currentPreset.animation)) {
            return currentPreset.animation
          }
          return prev
        })
      }
    })
    
    return unsubscribe
  }, [])
  
  // Load textures
  const [envMapEq] = useTexture([envMapSrc])
  const [selectedGradient] = useTexture([gradient4])

  // Create cube environment map from equirectangular
  useEffect(() => {
    if (!envMapEq || !gl) return
    try {
      const rt = new WebGLCubeRenderTarget(envMapEq.image.height)
      rt.fromEquirectangularTexture(gl, envMapEq)
      rt.texture.colorSpace = 'srgb'
      setEnvMap(rt.texture)
      envMapEq.dispose()
    } catch (error) {
      console.error('Error creating environment map:', error)
    }
  }, [gl, envMapEq])

  useEffect(() => {
    if (envMap) {
      setLoaded(true)
      console.log('Blob loaded successfully!')
    }
  }, [envMap])

  // Log when local config changes (reduced frequency)
  useEffect(() => {
    // Only log significant changes, not every minor update
    if (localBlobConfig.color1) {
      console.log('🎨 Blob config updated:', localBlobConfig.color1, 'complexity:', localBlobConfig.complexity)
    }
  }, [localBlobConfig.color1, localBlobConfig.complexity])

  // Calculate audio-reactive multipliers
  const audioMult = localAudioData && localIsSpeaking ? {
    speed: 1 + (localAudioData.average * 0.8),
    strength: 1 + (localAudioData.bass * 0.6),
    complexity: 1 + (localAudioData.average * 0.4)
  } : { speed: 1, strength: 1, complexity: 1 }
  
  // Material spring animation - updates when localBlobConfig changes
  const [materialSpring, materialApi] = useSpring(() => ({
    distort: localBlobConfig.strength * audioMult.strength,
    frequency: localBlobConfig.complexity * audioMult.complexity,
    speed: localBlobConfig.speed * audioMult.speed,
    surfaceDistort: localBlobConfig.strength * 2 * audioMult.strength,
    surfaceFrequency: localBlobConfig.complexity * 0.8 * audioMult.complexity,
    surfaceSpeed: localBlobConfig.speed * 1.5 * audioMult.speed,
    numberOfWaves: Math.floor(localBlobConfig.complexity * 1.5 * audioMult.complexity),
    color: localBlobConfig.color1,
    envMapIntensity: localBlobConfig.envMapIntensity,
    roughness: localBlobConfig.roughness,
    metalness: localBlobConfig.metalness,
    config: config.molasses
  }))

  // Update spring when config changes
  useEffect(() => {
    // Update spring properties (removed excessive logging)
    
    // Update spring for other properties
    materialApi.start({
      distort: localBlobConfig.strength * audioMult.strength,
      frequency: localBlobConfig.complexity * audioMult.complexity,
      speed: localBlobConfig.speed * audioMult.speed,
      surfaceDistort: localBlobConfig.strength * 2 * audioMult.strength,
      surfaceFrequency: localBlobConfig.complexity * 0.8 * audioMult.complexity,
      surfaceSpeed: localBlobConfig.speed * 1.5 * audioMult.speed,
      numberOfWaves: Math.floor(localBlobConfig.complexity * 1.5 * audioMult.complexity),
      envMapIntensity: localBlobConfig.envMapIntensity,
      roughness: localBlobConfig.roughness,
      metalness: localBlobConfig.metalness,
    })
  }, [localBlobConfig, audioMult.strength, audioMult.complexity, audioMult.speed, materialApi])

  // Simplified mesh animation - just basic scale for audio reactivity
  const baseScale = 0.14
  const audioScale = localAudioData && localIsSpeaking ? baseScale * (1 + localAudioData.average * 0.1) : baseScale
  
  const [meshSpring, meshApi] = useSpring(() => ({
    scale: [audioScale, audioScale, audioScale],
    config: config.gentle
  }))

  // Update scale when audio changes
  useEffect(() => {
    meshApi.start({
      scale: [audioScale, audioScale, audioScale]
    })
  }, [audioScale, meshApi])

  // Gallery/scene scale animation
  const sizeRatio = Math.min(1, size.width / size.height * 1.2)
  const sceneScale = 1.0 * sizeRatio
  const gallerySpring = useSpring({
    scale: !loaded ? [0, 0, 0] : [sceneScale, sceneScale, sceneScale],
    config: { tension: 20, friction: 10, precision: 0.001 }
  })

  // Segments
  const segments = 256
  const segmentsX = segments * 1.33
  const segmentsY = segments

  return (
    <animated.group {...gallerySpring} frustumCulled={false}>
      <animated.mesh
        ref={blobRef}
        castShadow
        receiveShadow={false}
        scale={meshSpring.scale}
        frustumCulled={false}
      >
        <AnimatedSphere
          radius={1}
          widthSegments={segmentsX}
          heightSegments={segmentsY}
          animation={currentAnimation}
          blobConfig={localBlobConfig}
          audioData={localAudioData}
          isSpeaking={localIsSpeaking}
        >
          <meshPhysicalMaterial
            ref={materialRef}
            color={localBlobConfig.color1}
            transparent={false}
            opacity={1.0}
            flatShading={false}
            wireframe={false}
            clearcoat={0.2}
            clearcoatRoughness={0.7}
            transmission={0}
            side={2}
            roughness={localBlobConfig.roughness}
            metalness={localBlobConfig.metalness}
          />
        </AnimatedSphere>
      </animated.mesh>
    </animated.group>
  )
}

export default Blob