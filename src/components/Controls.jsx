import { useControls } from 'leva'
import { useStore } from '../store'
import { useEffect } from 'react'

export function Controls() {
  const { setBlobConfig, presets, setSelectedPreset } = useStore()
  
  const controls = useControls({
    preset: {
      value: 'custom',
      options: ['custom', ...presets.map(p => p.id)],
      onChange: (value) => {
        if (value !== 'custom') {
          const preset = presets.find(p => p.id === value)
          if (preset) {
            setBlobConfig(preset.config)
            setSelectedPreset(preset.id)
          }
        }
      }
    },
    complexity: {
      value: 3,
      min: 1,
      max: 5,
      step: 0.1,
      onChange: (value) => setBlobConfig({ complexity: value })
    },
    speed: {
      value: 0.5,
      min: 0,
      max: 2,
      step: 0.1,
      onChange: (value) => setBlobConfig({ speed: value })
    },
    strength: {
      value: 0.3,
      min: 0,
      max: 1,
      step: 0.05,
      onChange: (value) => setBlobConfig({ strength: value })
    },
    color1: {
      value: '#ff6b6b',
      onChange: (value) => setBlobConfig({ color1: value })
    },
    metalness: {
      value: 0.8,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (value) => setBlobConfig({ metalness: value })
    },
    roughness: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (value) => setBlobConfig({ roughness: value })
    },
    envMapIntensity: {
      value: 1.5,
      min: 0,
      max: 3,
      step: 0.1,
      onChange: (value) => setBlobConfig({ envMapIntensity: value })
    }
  })
  
  return null
}

export default Controls