import { useRef, useState, useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import { WebGLCubeRenderTarget, sRGBEncoding } from 'three'
import { useThree } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { MagicalMaterial } from './MagicalMaterial'
import { useStore } from '../store'

// Import gradient textures
import gradient4 from '../assets/gradients/cloudconvert/06_cosmic-fusion.c57d060d.png'
import envMapSrc from '../assets/envmap-2048.min.jpg'

const AnimatedMagicalMaterial = animated(MagicalMaterial)

export function Blob({ position = [0, 0, 0], ...props }) {
  const materialRef = useRef()
  const blobRef = useRef()
  const { gl, size } = useThree()
  
  const blobConfig = useStore((state) => state.blobConfig)
  const [envMap, setEnvMap] = useState()
  const [loaded, setLoaded] = useState(false)
  
  // Load textures
  const [envMapEq] = useTexture([envMapSrc])
  const [selectedGradient] = useTexture([gradient4])

  // Create cube environment map from equirectangular
  useEffect(() => {
    if (!envMapEq || !gl) return
    try {
      const rt = new WebGLCubeRenderTarget(envMapEq.image.height)
      rt.fromEquirectangularTexture(gl, envMapEq)
      rt.texture.encoding = sRGBEncoding
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

  // Material spring animation - smoothly transitions between states
  const materialSpring = useSpring({
    distort: blobConfig.strength,
    frequency: blobConfig.complexity,
    speed: blobConfig.speed,
    surfaceDistort: blobConfig.strength * 2, // Surface detail follows strength
    surfaceFrequency: blobConfig.complexity * 0.8,
    surfaceSpeed: blobConfig.speed * 1.5,
    numberOfWaves: Math.floor(blobConfig.complexity * 1.5),
    surfacePoleAmount: 1,
    gooPoleAmount: 1,
    fixNormals: 1.0,
    color: blobConfig.color1,
    envMapIntensity: blobConfig.envMapIntensity,
    roughness: blobConfig.roughness,
    metalness: blobConfig.metalness,
    clearcoat: 1,
    clearcoatRoughness: 0.7,
    transmission: 0,
    config: {
      tension: 80,
      friction: 26,
      precision: 0.0001,
      mass: 1
    }
  })

  // Mesh spring animation
  const meshSpring = useSpring({
    scale: [0.14, 0.14, 0.14],
    rotation: [0, 0, 0],
    config: { tension: 50, friction: 14 }
  })

  // Gallery/scene scale animation
  const sizeRatio = Math.min(1, size.width / size.height * 1.2)
  const sceneScale = 1.0 * sizeRatio
  const gallerySpring = useSpring({
    scale: !loaded ? [0, 0, 0] : [sceneScale, sceneScale, sceneScale],
    config: { tension: 20, friction: 10, precision: 0.001 }
  })

  // Segments (reduce for better performance)
  const segments = 256
  const segmentsX = segments * 1.33
  const segmentsY = segments

  return (
    <animated.group {...gallerySpring} frustumCulled={false}>
      <animated.mesh
        ref={blobRef}
        castShadow
        receiveShadow={false}
        {...meshSpring}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, segmentsX, segmentsY]} />
        <AnimatedMagicalMaterial
          ref={materialRef}
          map={selectedGradient}
          envMap={envMap}
          transparent={true}
          flatShading={false}
          wireframe={false}
          {...materialSpring}
        />
      </animated.mesh>
    </animated.group>
  )
}

export default Blob