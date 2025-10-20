import { useControls } from 'leva'
import { useStore } from '../store'
import { useEffect } from 'react'

export function Controls() {
  const { blobConfig, setBlobConfig, presets, setSelectedPreset, selectedPreset } = useStore()
  
  // Create preset options with emojis and names
  const presetOptions = presets.reduce((acc, preset) => {
    acc[preset.name] = preset.id
    return acc
  }, {})
  
  const [values, set] = useControls(() => ({
    'AI State': {
      value: selectedPreset || 'idle',
      options: presetOptions,
      onChange: (value) => {
        const preset = presets.find(p => p.id === value)
        if (preset) {
          setBlobConfig(preset.config)
          setSelectedPreset(preset.id)
          // Update all control values
          set({
            complexity: preset.config.complexity,
            speed: preset.config.speed,
            strength: preset.config.strength,
            color: preset.config.color1,
            metalness: preset.config.metalness,
            roughness: preset.config.roughness,
            envMapIntensity: preset.config.envMapIntensity,
          })
        }
      }
    },
    complexity: {
      value: blobConfig.complexity,
      min: 1,
      max: 5,
      step: 0.1,
      label: 'Complexity',
      onChange: (value) => setBlobConfig({ complexity: value })
    },
    speed: {
      value: blobConfig.speed,
      min: 0,
      max: 2,
      step: 0.1,
      label: 'Speed',
      onChange: (value) => setBlobConfig({ speed: value })
    },
    strength: {
      value: blobConfig.strength,
      min: 0,
      max: 1,
      step: 0.05,
      label: 'Strength',
      onChange: (value) => setBlobConfig({ strength: value })
    },
    color: {
      value: blobConfig.color1,
      label: 'Color',
      onChange: (value) => setBlobConfig({ color1: value })
    },
    metalness: {
      value: blobConfig.metalness,
      min: 0,
      max: 1,
      step: 0.1,
      label: 'Metalness',
      onChange: (value) => setBlobConfig({ metalness: value })
    },
    roughness: {
      value: blobConfig.roughness,
      min: 0,
      max: 1,
      step: 0.1,
      label: 'Roughness',
      onChange: (value) => setBlobConfig({ roughness: value })
    },
    envMapIntensity: {
      value: blobConfig.envMapIntensity,
      min: 0,
      max: 3,
      step: 0.1,
      label: 'Env Intensity',
      onChange: (value) => setBlobConfig({ envMapIntensity: value })
    }
  }), [blobConfig, presets, selectedPreset])
  
  return null
}

export default Controls