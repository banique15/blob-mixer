import { useState, useRef, useEffect } from 'react'
import { useStore } from '../../store'
import { aiService } from '../../services/aiService'
import './ChatPanel.css'

export function ChatPanel() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const conversationHistory = useRef([])
  
  const messages = useStore((state) => state.messages)
  const addMessage = useStore((state) => state.addMessage)
  const triggerBlobReaction = useStore((state) => state.triggerBlobReaction)
  const setAudioData = useStore((state) => state.setAudioData)
  const setIsSpeaking = useStore((state) => state.setIsSpeaking)
  const setIsTyping = useStore((state) => state.setIsTyping)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle audio data updates for blob reactivity
  const handleAudioData = (audioData) => {
    setAudioData(audioData)
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    })

    // Add to conversation history
    conversationHistory.current.push({
      role: 'user',
      content: userMessage
    })

    try {
      // Trigger listening state
      triggerBlobReaction({
        preset: 'listening',
        duration: 1000,
        emotion: 'attentive',
        intensity: 0.6
      })

      await new Promise(resolve => setTimeout(resolve, 500))

      // Trigger thinking state
      triggerBlobReaction({
        preset: 'thinking',
        duration: 2000,
        emotion: 'curious',
        intensity: 0.7
      })

      // Get AI response with sentiment
      const { text: aiResponse, sentiment } = await aiService.chat(
        userMessage,
        conversationHistory.current
      )

      // Simple detection: Check if user message contains surprising/exciting content
      const isSurprisingMessage = /\b(omg|wow|holy|incredible|amazing|shocking|unbelievable|surprised|can't believe|mind.?blow|what\?!|!!|wtf|whoa|no way)\b/i.test(userMessage)
      
      // Debug: Log sentiment analysis and surprise detection
      console.log('🎭 Sentiment Analysis Result:', sentiment)
      console.log('😲 Is Surprising Message:', isSurprisingMessage, 'Message:', userMessage)

      // Add AI response to conversation history
      conversationHistory.current.push({
        role: 'assistant',
        content: aiResponse
      })

      // Keep history manageable (last 10 messages)
      if (conversationHistory.current.length > 10) {
        conversationHistory.current = conversationHistory.current.slice(-10)
      }

      // Add AI message to UI
      addMessage({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      })

      // Start speaking with voice first
      setIsSpeaking(true)
      setIsTyping(false)

      // Use surprised state if user message was surprising, otherwise speaking
      const blobPreset = isSurprisingMessage ? 'surprised' : 'speaking'
      const blobColor = isSurprisingMessage ? '#ff00ff' : undefined // Magenta for surprised
      
      triggerBlobReaction({
        preset: blobPreset,
        emotion: sentiment.emotion || 'neutral',
        intensity: isSurprisingMessage ? 1.0 : (sentiment.intensity || 0.7),
        color: blobColor
      })
      
      console.log(`🎭 Using blob state: ${blobPreset}${isSurprisingMessage ? ' (SURPRISED!)' : ''}`)
      
      // Wait for speech to complete
      console.log('🎵 Waiting for TTS to complete...')
      await aiService.speak(aiResponse, handleAudioData)
      
      // Speech is done, now we can safely transition
      console.log('🎵 TTS completed, transitioning blob state')
      setIsSpeaking(false)
      setAudioData(null)

      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100))

      // Always return to idle after speaking, regardless of emotion
      console.log('🎭 Speech completed, returning to idle state')
      triggerBlobReaction({
        preset: 'idle',
        emotion: null,
        intensity: 0.5
      })

    } catch (error) {
      console.error('Chat error:', error)
      
      // Add error message
      addMessage({
        role: 'assistant',
        content: "Sorry, I'm having trouble responding right now. Please try again!",
        timestamp: new Date().toISOString(),
        isError: true
      })

      // Return to idle
      triggerBlobReaction({
        preset: 'idle',
        duration: 1000,
        emotion: 'neutral',
        intensity: 0.5
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h2>💬 Chat with AI</h2>
        <p className="chat-subtitle">Voice-enabled conversation with blob reactions</p>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h3>Start a conversation!</h3>
            <p>The AI will respond with voice and the blob will react to emotions</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role} ${message.isError ? 'error' : ''}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="message assistant typing">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send)"
          disabled={isLoading}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="send-button"
        >
          {isLoading ? '⏳' : '🚀'}
        </button>
      </div>

      <div className="chat-footer">
        <small>
          💡 Tip: The blob reacts to voice and emotions in real-time!
        </small>
      </div>
    </div>
  )
}

export default ChatPanel