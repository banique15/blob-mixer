import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function AnimatedSphere({
  radius = 1,
  widthSegments = 64,
  heightSegments = 32,
  animation = {},
  blobConfig = {},
  audioData = null,
  isSpeaking = false,
  ...props
}) {
  const meshRef = useRef()
  const geometryRef = useRef()
  
  // Get animation parameters with defaults
  const {
    breathingIntensity = 0.05,
    breathingSpeed = 0.8,
    scaleVariation = 0.02,
    floatSpeed = 1.2,
    pattern = 'gentle'
  } = animation

  // Get blob config parameters for control responsiveness
  const {
    complexity = 2,
    speed = 0.3,
    strength = 0.2
  } = blobConfig

  // Calculate audio multipliers - more subtle
  const audioMultiplier = audioData && isSpeaking ? {
    intensity: 1 + (audioData.average * 0.2),
    speed: 1 + (audioData.average * 0.15),
    variation: 1 + (audioData.bass * 0.1)
  } : { intensity: 1, speed: 1, variation: 1 }

  // Create base geometry and store original positions
  const { geometry, originalPositions } = useMemo(() => {
    const geom = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
    const positions = geom.attributes.position.array.slice()
    return { geometry: geom, originalPositions: positions }
  }, [radius, widthSegments, heightSegments])

  // Animation patterns based on AI state - more emphasized and distinctive
  const getAnimationPattern = (time, pattern) => {
    switch (pattern) {
      case 'pulsing':
        // Thinking: distinctive irregular pulsing with dramatic pauses
        const pulse1 = Math.sin(time * 1.4) * 0.7
        const pulse2 = Math.sin(time * 0.6) * 0.4
        const pulse3 = Math.sin(time * 2.3) * 0.2
        const pauseEffect = Math.sin(time * 0.3) * 0.3
        return (pulse1 + pulse2 + pulse3) * (1 + pauseEffect)
      
      case 'energetic':
        // Speaking: rapid, vibrant waves with high energy
        const energy1 = Math.sin(time * 2.8) * 0.6
        const energy2 = Math.cos(time * 2.1) * 0.4
        const energy3 = Math.sin(time * 3.7) * 0.3
        const energy4 = Math.cos(time * 1.6) * 0.2
        return energy1 + energy2 + energy3 + energy4
      
      case 'subtle':
        // Listening: focused, attentive micro-movements with concentration peaks
        const subtle1 = Math.sin(time * 0.8) * 0.6
        const subtle2 = Math.cos(time * 0.5) * 0.3
        const focus = Math.sin(time * 0.2) * 0.2
        return (subtle1 + subtle2) * (1 + focus)
      
      case 'chaotic':
        // Surprised: dramatic multi-frequency chaos with sudden bursts
        const chaos1 = Math.sin(time * 3.2) * 0.5
        const chaos2 = Math.cos(time * 4.1) * 0.4
        const chaos3 = Math.sin(time * 5.3) * 0.3
        const chaos4 = Math.cos(time * 2.7) * 0.2
        const burst = Math.sin(time * 0.9) * 0.4
        return (chaos1 + chaos2 + chaos3 + chaos4) * (1 + Math.abs(burst))
      
      case 'gentle':
      default:
        // Idle: calm, steady breathing with natural rhythm
        const gentle1 = Math.sin(time * 1.0) * 0.8
        const gentle2 = Math.sin(time * 0.6) * 0.3
        const natural = Math.cos(time * 0.4) * 0.1
        return gentle1 + gentle2 + natural
    }
  }

  // Perlin-like noise function for vertex displacement
  const noise = (x, y, z, time) => {
    return Math.sin(x * 2 + time) * Math.cos(y * 2 + time) * Math.sin(z * 2 + time)
  }

  // Animate vertices
  useFrame((state) => {
    if (!geometryRef.current) return

    // Use blob config parameters to make controls responsive
    const effectiveSpeed = speed * floatSpeed * audioMultiplier.speed
    const effectiveComplexity = complexity * 0.5 // Scale down complexity for noise
    const effectiveStrength = strength * 2 // Scale up strength for visibility
    
    const time = state.clock.elapsedTime * effectiveSpeed
    const positions = geometryRef.current.attributes.position.array
    const patternValue = getAnimationPattern(time, pattern)

    // Apply vertex displacement based on AI state pattern with audio reactivity
    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositions[i]
      const y = originalPositions[i + 1]
      const z = originalPositions[i + 2]

      // Calculate distance from center for radial effects
      const distance = Math.sqrt(x * x + y * y + z * z)
      
      // Base displacement using pattern with audio intensity and strength control
      const displacement = patternValue * breathingIntensity * effectiveStrength * audioMultiplier.intensity
      
      // Enhanced noise for more visible organic deformation with complexity control
      const noiseFreq = 2 * effectiveComplexity
      const noiseValue = noise(x * noiseFreq, y * noiseFreq, z * noiseFreq, time * breathingSpeed * 0.8) * scaleVariation * effectiveStrength * audioMultiplier.variation
      
      // More pronounced audio-reactive displacement
      const audioNoise = audioData && isSpeaking ?
        noise(x * 4 * effectiveComplexity, y * 4 * effectiveComplexity, z * 4 * effectiveComplexity, time * 2.5) * (audioData.average * 0.015) * effectiveStrength : 0
      
      // Enhanced displacement with better visibility
      const totalDisplacement = displacement + noiseValue + audioNoise
      const enhancedDisplacement = totalDisplacement * 1.2 // Increase visibility
      const scale = 1 + enhancedDisplacement
      
      positions[i] = x * scale
      positions[i + 1] = y * scale
      positions[i + 2] = z * scale
    }

    geometryRef.current.attributes.position.needsUpdate = true
    geometryRef.current.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} {...props}>
      <bufferGeometry ref={geometryRef} {...geometry} />
      {props.children}
    </mesh>
  )
}