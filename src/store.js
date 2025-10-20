import { create } from 'zustand'

export const useStore = create((set) => ({
  // Blob configuration
  blobConfig: {
    complexity: 3,
    speed: 0.5,
    strength: 0.3,
    color1: '#ff6b6b',
    color2: '#4ecdc4',
    color3: '#45b7d1',
    metalness: 0.8,
    roughness: 0.2,
    envMapIntensity: 1.5,
  },
  
  // UI state
  showControls: false,
  isRemixing: false,
  selectedPreset: null,
  
  // Actions
  setBlobConfig: (config) => set((state) => ({
    blobConfig: { ...state.blobConfig, ...config }
  })),
  
  toggleControls: () => set((state) => ({ 
    showControls: !state.showControls 
  })),
  
  setRemixing: (isRemixing) => set({ isRemixing }),
  
  setSelectedPreset: (preset) => set({ selectedPreset: preset }),
  
  // Presets
  presets: [
    {
      id: 'cosmic',
      name: 'Cosmic Fusion',
      config: {
        complexity: 4,
        speed: 0.4,
        strength: 0.4,
        color1: '#ff00ff',
        color2: '#00ffff',
        color3: '#ffff00',
        metalness: 0.9,
        roughness: 0.1,
      }
    },
    {
      id: 'ocean',
      name: 'Deep Ocean',
      config: {
        complexity: 3,
        speed: 0.3,
        strength: 0.25,
        color1: '#001f3f',
        color2: '#0074D9',
        color3: '#7FDBFF',
        metalness: 0.7,
        roughness: 0.3,
      }
    },
    {
      id: 'sunset',
      name: 'Sunset Vibes',
      config: {
        complexity: 3,
        speed: 0.5,
        strength: 0.3,
        color1: '#ff6b6b',
        color2: '#ffa500',
        color3: '#ff1493',
        metalness: 0.6,
        roughness: 0.4,
      }
    },
    {
      id: 'neon',
      name: 'Neon Dreams',
      config: {
        complexity: 5,
        speed: 0.7,
        strength: 0.5,
        color1: '#00ff00',
        color2: '#ff00ff',
        color3: '#00ffff',
        metalness: 1.0,
        roughness: 0.1,
      }
    },
  ]
}))