import { create } from 'zustand'

export const useStore = create((set, get) => ({
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
  
  // Chat state
  messages: [],
  isTyping: false,
  currentEmotion: null,
  
  // Audio state for voice reactivity
  audioData: null,
  isSpeaking: false,
  speakingInterval: null,
  
  // Actions
  setBlobConfig: (config) => set((state) => ({
    blobConfig: { ...state.blobConfig, ...config }
  })),
  
  toggleControls: () => set((state) => ({
    showControls: !state.showControls
  })),
  
  setRemixing: (isRemixing) => set({ isRemixing }),
  
  setSelectedPreset: (preset) => set({ selectedPreset: preset }),
  
  // Expose presets for Controls component
  getPresets: () => get().presets,
  
  // Chat actions
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: Date.now() }]
  })),
  
  setIsTyping: (isTyping) => set({ isTyping }),
  
  setCurrentEmotion: (emotion) => set({ currentEmotion: emotion }),
  
  // Audio actions
  setAudioData: (data) => set({ audioData: data }),
  
  setIsSpeaking: (speaking) => {
    console.log('🎤 setIsSpeaking called:', speaking)
    const currentState = get()
    set({ isSpeaking: speaking })
    
    if (speaking) {
      // Clear any existing interval first to prevent duplicates
      if (currentState.speakingInterval) {
        clearInterval(currentState.speakingInterval)
      }
      
      // Start continuous monitoring while speaking
      const speakingInterval = setInterval(() => {
        const state = get()
        if (!state.isSpeaking) {
          // AI stopped speaking, clear interval
          console.log('🔇 Interval detected speaking stopped, clearing interval')
          clearInterval(speakingInterval)
          set({ speakingInterval: null })
          return
        }
        
        // Only force speaking state if we're in idle/neutral state
        // Preserve emotional states like 'surprised' during speech
        if (state.selectedPreset === 'idle' || state.selectedPreset === 'listening') {
          console.log('🔊 Enforcing speaking state during speech (from idle/listening)')
          state.forceSpeakingState()
        }
      }, 500)
      
      // Store interval ID for cleanup
      set({ speakingInterval })
    } else {
      console.log('🔇 AI stopped speaking, cleaning up...')
      
      // CRITICAL: Clear monitoring interval immediately
      if (currentState.speakingInterval) {
        console.log('🧹 Clearing speaking interval:', currentState.speakingInterval)
        clearInterval(currentState.speakingInterval)
        set({ speakingInterval: null })
      }
      
      // Clear any pending timeouts that might interfere
      if (currentState.resetTimeout) {
        console.log('🧹 Clearing any pending timeouts')
        clearTimeout(currentState.resetTimeout)
        set({ resetTimeout: null })
      }
      
      // Disable any further force speaking attempts
      console.log('🛑 Speaking disabled, no more force speaking allowed')
    }
    
    // Only sync if we're starting to speak, not when stopping
    if (speaking) {
      setTimeout(() => {
        const state = get()
        if (state.isSpeaking) { // Double check we're still speaking
          state.forceSpeakingState()
        }
      }, 0)
    } else {
      console.log('🔄 AI finished speaking, intervals cleared, ready for state transitions')
    }
  },
  
  // Blob reaction system
  triggerBlobReaction: (reaction) => {
    const { preset, duration = 2000, emotion } = reaction
    const state = get()
    const presetConfig = state.presets.find(p => p.id === preset)
    
    // Only log significant state changes to reduce noise
    if (preset !== get().selectedPreset) {
      console.log('🎭 State change:', preset)
    }
    
    if (presetConfig) {
      // Preset found (reduced logging)
      
      // Clear any existing timeout
      if (state.resetTimeout) {
        clearTimeout(state.resetTimeout)
      }
      
      // Apply the preset directly to state
      set({
        blobConfig: { ...presetConfig.config },
        selectedPreset: preset,
        currentEmotion: emotion,
        resetTimeout: null
      })
      
      // Config applied (reduced logging)
      
      // Set timeout for non-speaking states only
      // Speaking state duration is controlled by TTS completion
      if (duration && preset !== 'speaking' && preset !== 'idle') {
        // Setting timeout for non-speaking state
        const timeoutId = setTimeout(() => {
          const currentState = get()
          
          console.log('⏰ Timeout fired - checking speaking status:', currentState.isSpeaking)
          
          // NEVER return to idle if AI is still speaking
          if (currentState.isSpeaking) {
            console.log('⏰ Duration ended but AI still speaking, staying in speaking state')
            currentState.forceSpeakingState()
            return
          }
          
          console.log('⏰ Duration ended, returning to idle')
          
          const idlePreset = currentState.presets.find(p => p.id === 'idle')
          if (idlePreset) {
            set({
              blobConfig: { ...idlePreset.config },
              selectedPreset: 'idle',
              currentEmotion: null,
              resetTimeout: null
            })
          }
        }, duration)
        
        set({ resetTimeout: timeoutId })
      }
    } else {
      console.error('❌ Preset not found:', preset)
    }
  },

  // New method to sync blob state with speaking status
  syncBlobWithSpeaking: () => {
    const state = get()
    
    // If AI starts speaking, only switch to speaking state if we're in idle
    // This preserves emotional states (thinking, surprised, etc.) while speaking
    if (state.isSpeaking && state.selectedPreset === 'idle') {
      const speakingPreset = state.presets.find(p => p.id === 'speaking')
      if (speakingPreset) {
        console.log('🎤 AI started speaking from idle, switching to speaking state')
        set({
          blobConfig: { ...speakingPreset.config },
          selectedPreset: 'speaking',
          currentEmotion: null
        })
      }
    }
    
    // If AI stops speaking and we're in speaking state (not an emotion state), return to idle
    if (!state.isSpeaking && state.selectedPreset === 'speaking' && !state.currentEmotion) {
      const idlePreset = state.presets.find(p => p.id === 'idle')
      if (idlePreset) {
        console.log('🔇 AI stopped speaking, returning to idle')
        set({
          blobConfig: { ...idlePreset.config },
          selectedPreset: 'idle',
          currentEmotion: null
        })
      }
    }
  },

  // Enhanced method to ensure speaking state is maintained while AI is speaking
  forceSpeakingState: () => {
    const state = get()
    console.log('🔊 forceSpeakingState called - isSpeaking:', state.isSpeaking, 'currentPreset:', state.selectedPreset)
    
    // ONLY force speaking if AI is actually speaking AND we're in idle/listening state
    // Preserve emotional states like 'surprised', 'thinking' during speech
    if (state.isSpeaking && (state.selectedPreset === 'idle' || state.selectedPreset === 'listening')) {
      const speakingPreset = state.presets.find(p => p.id === 'speaking')
      if (speakingPreset) {
        console.log('🔊 Force maintaining speaking state while AI is speaking (from idle/listening)')
        // Clear any pending timeouts that might return to idle
        if (state.resetTimeout) {
          clearTimeout(state.resetTimeout)
        }
        set({
          blobConfig: { ...speakingPreset.config },
          selectedPreset: 'speaking',
          currentEmotion: null,
          resetTimeout: null
        })
      }
    } else if (!state.isSpeaking) {
      console.log('🚫 forceSpeakingState called but AI is not speaking - ignoring')
    } else if (state.selectedPreset === 'surprised' || state.selectedPreset === 'thinking') {
      console.log('🎭 Preserving emotional state during speech:', state.selectedPreset)
    } else {
      console.log('✅ Already in speaking state, no action needed')
    }
  },
  
  // Timeout ID for reset
  resetTimeout: null,
  
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
        envMapIntensity: 0.3,
      },
      animation: {
        breathingIntensity: 0.04,
        breathingSpeed: 0.8,
        rotationSpeed: 0.05,
        scaleVariation: 0.015,
        positionFloat: { x: 0, y: 0.05, z: 0 },
        floatSpeed: 1.0,
        pattern: 'gentle'
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
        envMapIntensity: 0.4,
      },
      animation: {
        breathingIntensity: 0.08,
        breathingSpeed: 1.4,
        rotationSpeed: 0.08,
        scaleVariation: 0.035,
        positionFloat: { x: 0.01, y: 0.03, z: 0.01 },
        floatSpeed: 1.6,
        pattern: 'pulsing'
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
        envMapIntensity: 0.5,
      },
      animation: {
        breathingIntensity: 0.12,
        breathingSpeed: 2.2,
        rotationSpeed: 0.12,
        scaleVariation: 0.05,
        positionFloat: { x: 0.02, y: 0.04, z: 0.02 },
        floatSpeed: 2.4,
        pattern: 'energetic'
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
        envMapIntensity: 0.4,
      },
      animation: {
        breathingIntensity: 0.025,
        breathingSpeed: 0.6,
        rotationSpeed: 0.03,
        scaleVariation: 0.008,
        positionFloat: { x: 0.005, y: 0.015, z: 0.005 },
        floatSpeed: 0.7,
        pattern: 'subtle'
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
        envMapIntensity: 0.6,
      },
      animation: {
        breathingIntensity: 0.15,
        breathingSpeed: 3.2,
        rotationSpeed: 0.15,
        scaleVariation: 0.08,
        positionFloat: { x: 0.03, y: 0.06, z: 0.03 },
        floatSpeed: 3.0,
        pattern: 'chaotic'
      }
    },
  ]
}))