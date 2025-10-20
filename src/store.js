import { create } from 'zustand'

export const useStore = create((set) => ({
  // Blob configuration
  blobConfig: {
    complexity: 2,
    speed: 0.3,
    strength: 0.2,
    color1: '#4a90e2',
    color2: '#7b68ee',
    color3: '#9370db',
    metalness: 0.6,
    roughness: 0.3,
    envMapIntensity: 1.2,
  },
  
  // UI state
  showControls: false,
  isRemixing: false,
  selectedPreset: 'idle',
  
  // Actions
  setBlobConfig: (config) => set((state) => ({
    blobConfig: { ...state.blobConfig, ...config }
  })),
  
  toggleControls: () => set((state) => ({
    showControls: !state.showControls
  })),
  
  setRemixing: (isRemixing) => set({ isRemixing }),
  
  setSelectedPreset: (preset) => set({ selectedPreset: preset }),
  
  // AI Agent State Presets
  presets: [
    {
      id: 'idle',
      name: '😌 Idle',
      description: 'Calm, waiting state',
      config: {
        complexity: 2,
        speed: 0.3,
        strength: 0.2,
        color1: '#4a90e2',
        color2: '#7b68ee',
        color3: '#9370db',
        metalness: 0.6,
        roughness: 0.3,
        envMapIntensity: 1.2,
      }
    },
    {
      id: 'thinking',
      name: '🤔 Thinking',
      description: 'Processing, analyzing',
      config: {
        complexity: 4,
        speed: 0.6,
        strength: 0.4,
        color1: '#ff6b6b',
        color2: '#ffa500',
        color3: '#ffcc00',
        metalness: 0.8,
        roughness: 0.2,
        envMapIntensity: 1.5,
      }
    },
    {
      id: 'speaking',
      name: '🗣️ Speaking',
      description: 'Active, communicating',
      config: {
        complexity: 3,
        speed: 0.8,
        strength: 0.5,
        color1: '#00ff88',
        color2: '#00d4ff',
        color3: '#00ffff',
        metalness: 0.9,
        roughness: 0.15,
        envMapIntensity: 2.0,
      }
    },
    {
      id: 'listening',
      name: '👂 Listening',
      description: 'Attentive, receiving input',
      config: {
        complexity: 2.5,
        speed: 0.4,
        strength: 0.25,
        color1: '#667eea',
        color2: '#764ba2',
        color3: '#a855f7',
        metalness: 0.7,
        roughness: 0.25,
        envMapIntensity: 1.3,
      }
    },
    {
      id: 'surprised',
      name: '😲 Surprised',
      description: 'Reacting, alert',
      config: {
        complexity: 5,
        speed: 1.2,
        strength: 0.7,
        color1: '#ff00ff',
        color2: '#ff0080',
        color3: '#ff1493',
        metalness: 1.0,
        roughness: 0.1,
        envMapIntensity: 2.5,
      }
    },
  ]
}))