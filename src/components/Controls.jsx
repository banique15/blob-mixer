import { useControls } from 'leva'
import { useStore } from '../store'
import { useEffect } from 'react'

export function Controls() {
  const { blobConfig, setBlobConfig, setSelectedPreset, selectedPreset } = useStore()
  const presets = useStore(state => state.presets)
  
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
          // Use triggerBlobReaction instead of direct config update
          useStore.getState().triggerBlobReaction({
            preset: preset.id,
            duration: null, // No timeout for manual selection
            emotion: null
          })
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
      onChange: (value) => {
        // Clear any active timeout when manually adjusting
        const state = useStore.getState()
        if (state.resetTimeout) {
          clearTimeout(state.resetTimeout)
          useStore.setState({ resetTimeout: null })
        }
        setBlobConfig({ complexity: value })
      }
    },
    speed: {
      value: blobConfig.speed,
      min: 0,
      max: 2,
      step: 0.1,
      label: 'Speed',
      onChange: (value) => {
        const state = useStore.getState()
        if (state.resetTimeout) {
          clearTimeout(state.resetTimeout)
          useStore.setState({ resetTimeout: null })
        }
        setBlobConfig({ speed: value })
      }
    },
    strength: {
      value: blobConfig.strength,
      min: 0,
      max: 1,
      step: 0.05,
      label: 'Strength',
      onChange: (value) => {
        const state = useStore.getState()
        if (state.resetTimeout) {
          clearTimeout(state.resetTimeout)
          useStore.setState({ resetTimeout: null })
        }
        setBlobConfig({ strength: value })
      }
    },
    color: {
      value: blobConfig.color1,
      label: 'Color',
      onChange: (value) => {
        const state = useStore.getState()
        if (state.resetTimeout) {
          clearTimeout(state.resetTimeout)
          useStore.setState({ resetTimeout: null })
        }
        setBlobConfig({ color1: value })
      }
    },
    metalness: {
      value: blobConfig.metalness,
      min: 0,
      max: 1,
      step: 0.1,
      label: 'Metalness',
      onChange: (value) => {
        const state = useStore.getState()
        if (state.resetTimeout) {
          clearTimeout(state.resetTimeout)
          useStore.setState({ resetTimeout: null })
        }
        setBlobConfig({ metalness: value })
      }
    },
    roughness: {
      value: blobConfig.roughness,
      min: 0,
      max: 1,
      step: 0.1,
      label: 'Roughness',
      onChange: (value) => {
        const state = useStore.getState()
        if (state.resetTimeout) {
          clearTimeout(state.resetTimeout)
          useStore.setState({ resetTimeout: null })
        }
        setBlobConfig({ roughness: value })
      }
    },
    envMapIntensity: {
      value: blobConfig.envMapIntensity,
      min: 0,
      max: 3,
      step: 0.1,
      label: 'Env Intensity',
      onChange: (value) => {
        const state = useStore.getState()
        if (state.resetTimeout) {
          clearTimeout(state.resetTimeout)
          useStore.setState({ resetTimeout: null })
        }
        setBlobConfig({ envMapIntensity: value })
      }
    }
  }), [blobConfig, presets, selectedPreset])
  
  // Sync Leva controls when store changes (from chat interactions)
  useEffect(() => {
    set({
      'AI State': selectedPreset,
      complexity: blobConfig.complexity,
      speed: blobConfig.speed,
      strength: blobConfig.strength,
      color: blobConfig.color1,
      metalness: blobConfig.metalness,
      roughness: blobConfig.roughness,
      envMapIntensity: blobConfig.envMapIntensity,
    })
  }, [blobConfig, selectedPreset, set])
  
  return null
}

export default Controls