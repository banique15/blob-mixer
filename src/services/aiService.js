// AI Service for Vercel AI Gateway integration with voice synthesis
const AI_GATEWAY_API_KEY = import.meta.env.VITE_AI_GATEWAY_API_KEY
const AI_GATEWAY_BASE_URL = import.meta.env.VITE_AI_GATEWAY_BASE_URL
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY // Fallback for TTS

export class AIService {
  constructor() {
    this.audioContext = null
    this.analyser = null
    this.audioSource = null
    this.isSpeaking = false
  }

  // Initialize audio context for audio analysis
  initAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 256
    }
  }

  // Get audio frequency data for blob animation
  getAudioData() {
    if (!this.analyser) return null
    
    const bufferLength = this.analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    this.analyser.getByteFrequencyData(dataArray)
    
    // Calculate average frequency and bass
    const average = dataArray.reduce((a, b) => a + b) / bufferLength
    const bass = dataArray.slice(0, 10).reduce((a, b) => a + b) / 10
    
    return {
      average: average / 255, // Normalize to 0-1
      bass: bass / 255,
      raw: dataArray
    }
  }

  // Chat with AI using Vercel AI Gateway
  async chat(message, conversationHistory = []) {
    const chatPayload = {
      model: 'gpt-4o', // Try GPT-4o (latest available model)
      messages: [
        {
          role: 'system',
          content: 'You are a friendly AI assistant with emotions. Keep responses concise and conversational (2-3 sentences max). Show personality and react emotionally to what the user says.'
        },
        ...conversationHistory,
        { role: 'user', content: message }
      ],
      temperature: 0.8,
      max_tokens: 150
    }

    // Use Vercel AI Gateway (https://ai-gateway.vercel.sh/v1)
    if (AI_GATEWAY_API_KEY && AI_GATEWAY_BASE_URL) {
      try {
        console.log('🌐 Using Vercel AI Gateway:', AI_GATEWAY_BASE_URL)
        console.log('📝 Model:', chatPayload.model)
        
        const response = await fetch(`${AI_GATEWAY_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_GATEWAY_API_KEY}`
          },
          body: JSON.stringify(chatPayload)
        })

        console.log('📡 Response status:', response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Gateway error response:', errorText)
          throw new Error(`Vercel AI Gateway error: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log('📦 Response received, choices:', data.choices?.length || 0)
        
        const aiResponse = data.choices[0].message.content
        console.log('✅ Vercel AI Gateway success')

        return {
          text: aiResponse,
          sentiment: await this.analyzeSentimentWithAI(message, aiResponse)
        }
      } catch (error) {
        console.error('❌ Vercel AI Gateway failed:', error)
        console.log('🔄 Falling back to OpenAI direct...')
        
        // Fallback to OpenAI direct
        return await this.chatWithOpenAIDirect(message, conversationHistory)
      }
    }

    // No gateway configured, use OpenAI direct
    console.log('⚠️ No AI Gateway configured, using OpenAI direct')
    return await this.chatWithOpenAIDirect(message, conversationHistory)
  }

  // OpenAI direct fallback method
  async chatWithOpenAIDirect(message, conversationHistory = []) {
    const chatPayload = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly AI assistant with emotions. Keep responses concise and conversational (2-3 sentences max). Show personality and react emotionally to what the user says.'
        },
        ...conversationHistory,
        { role: 'user', content: message }
      ],
      temperature: 0.8,
      max_tokens: 150
    }

    if (OPENAI_API_KEY) {
      try {
        console.log('🤖 Using OpenAI direct API')
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify(chatPayload)
        })

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`)
        }

        const data = await response.json()
        const aiResponse = data.choices[0].message.content
        console.log('✅ OpenAI direct API success')

        return {
          text: aiResponse,
          sentiment: await this.analyzeSentimentWithAI(message, aiResponse)
        }
      } catch (error) {
        console.error('❌ OpenAI direct API failed:', error)
      }
    }

    // Final fallback
    return {
      text: "I'm having trouble connecting to AI services right now. Please check your API configuration and try again!",
      sentiment: {
        preset: 'idle',
        emotion: 'neutral',
        intensity: 0.5,
        duration: 2000
      }
    }
  }

  // Use GPT to analyze sentiment with Vercel AI Gateway and OpenAI fallback
  async analyzeSentimentWithAI(userMessage, aiResponse) {
    const sentimentPrompt = {
      model: 'gpt-3.5-turbo', // Use standard model name for Vercel AI Gateway
      messages: [
        {
          role: 'system',
          content: `Analyze the emotional context and return ONLY a JSON object with blob visualization parameters.

Available states: idle, thinking, speaking, listening, surprised
Emotions: neutral, excited, irritated, curious, happy, sad, confused

Use "surprised" state for:
- Unexpected questions or revelations
- Shocking statements or plot twists
- Sudden topic changes
- Exclamations or emotional outbursts
- Questions about unusual topics
- Expressions of amazement or disbelief

Format:
{
  "preset": "state",
  "emotion": "emotion",
  "intensity": 0.0-1.0,
  "duration": milliseconds,
  "color": "#hexcolor"
}`
        },
        {
          role: 'user',
          content: `User said: "${userMessage}"\nAI responded: "${aiResponse}"\n\nWhat should the blob look like?`
        }
      ],
      temperature: 0.3,
      max_tokens: 100
    }

    // Try Vercel AI Gateway first
    if (AI_GATEWAY_API_KEY && AI_GATEWAY_BASE_URL) {
      try {
        console.log('🎭 Using Vercel AI Gateway for sentiment analysis')
        const response = await fetch(`${AI_GATEWAY_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_GATEWAY_API_KEY}`
          },
          body: JSON.stringify(sentimentPrompt)
        })

        if (response.ok) {
          const data = await response.json()
          const sentimentText = data.choices[0].message.content
          
          // Parse JSON from response
          const jsonMatch = sentimentText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
          }
        }
      } catch (error) {
        console.warn('🎭 Sentiment analysis via Vercel Gateway failed, trying OpenAI direct:', error)
      }
    }

    // Fallback to OpenAI direct
    if (OPENAI_API_KEY) {
      try {
        const directPrompt = { ...sentimentPrompt, model: 'gpt-3.5-turbo' } // Remove prefix for direct API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify(directPrompt)
        })

        if (response.ok) {
          const data = await response.json()
          const sentimentText = data.choices[0].message.content
          
          // Parse JSON from response
          const jsonMatch = sentimentText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
          }
        }
      } catch (error) {
        console.error('🎭 Sentiment analysis via OpenAI direct also failed:', error)
      }
    }

    // Final fallback
    console.log('⚠️ Using default sentiment analysis')
    return {
      preset: 'speaking',
      emotion: 'neutral',
      intensity: 0.5,
      duration: 2000
    }
  }

  // Text-to-Speech using Web Speech API or OpenAI TTS
  async speak(text, onAudioData) {
    this.initAudio()
    
    try {
      // Try OpenAI TTS first (better quality)
      if (OPENAI_API_KEY) {
        await this.speakWithOpenAI(text, onAudioData)
      } else {
        // Fallback to browser TTS
        await this.speakWithBrowser(text, onAudioData)
      }
    } catch (error) {
      console.error('TTS error:', error)
      // Fallback to browser TTS
      await this.speakWithBrowser(text, onAudioData)
    }
  }

  // OpenAI Text-to-Speech
  async speakWithOpenAI(text, onAudioData) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'tts-1',
            voice: 'nova', // alloy, echo, fable, onyx, nova, shimmer
            input: text,
            speed: 1.0
          })
        })

        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        
        // Connect to analyser
        const source = this.audioContext.createMediaElementSource(audio)
        source.connect(this.analyser)
        this.analyser.connect(this.audioContext.destination)
        
        this.isSpeaking = true
        
        // Monitor audio data
        const monitorAudio = () => {
          if (!this.isSpeaking) return
          
          const audioData = this.getAudioData()
          if (audioData && onAudioData) {
            onAudioData(audioData)
          }
          
          requestAnimationFrame(monitorAudio)
        }
        
        audio.onplay = () => {
          console.log('🎵 OpenAI TTS started playing')
          monitorAudio()
        }
        
        audio.onended = () => {
          console.log('🎵 OpenAI TTS finished playing')
          this.isSpeaking = false
          URL.revokeObjectURL(audioUrl)
          resolve()
        }
        
        audio.onerror = (error) => {
          console.error('🎵 OpenAI TTS error:', error)
          this.isSpeaking = false
          URL.revokeObjectURL(audioUrl)
          reject(error)
        }
        
        await audio.play()
      } catch (error) {
        this.isSpeaking = false
        reject(error)
      }
    })
  }

  // Browser Web Speech API fallback
  async speakWithBrowser(text, onAudioData) {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      
      // Try to find a good voice
      const voices = speechSynthesis.getVoices()
      const preferredVoice = voices.find(v =>
        v.name.includes('Google') ||
        v.name.includes('Microsoft') ||
        v.lang.startsWith('en')
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      
      this.isSpeaking = true
      
      // Simulate audio data for blob animation
      const simulateAudio = () => {
        if (!this.isSpeaking) return
        
        // Generate fake audio data based on speech
        const fakeData = {
          average: 0.3 + Math.random() * 0.4,
          bass: 0.2 + Math.random() * 0.3,
          raw: new Uint8Array(128).map(() => Math.random() * 128)
        }
        
        if (onAudioData) {
          onAudioData(fakeData)
        }
        
        requestAnimationFrame(simulateAudio)
      }
      
      utterance.onstart = () => {
        console.log('🎵 Browser TTS started speaking')
        simulateAudio()
      }
      
      utterance.onend = () => {
        console.log('🎵 Browser TTS finished speaking')
        this.isSpeaking = false
        resolve()
      }
      
      utterance.onerror = (error) => {
        console.error('🎵 Browser TTS error:', error)
        this.isSpeaking = false
        resolve() // Still resolve to prevent hanging
      }
      
      speechSynthesis.speak(utterance)
    })
  }

  // Stop speaking
  stopSpeaking() {
    this.isSpeaking = false
    speechSynthesis.cancel()
  }
}

export const aiService = new AIService()