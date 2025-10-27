# 🎨 Blob Mixer - AI Voice-Enabled 3D Blob Generator

An interactive 3D blob generator with AI-powered voice conversations and real-time audio-reactive animations. Built with React, Three.js, and Vercel AI Gateway.

![Blob Mixer Demo](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.158.0-orange)

## ✨ Features

### 🎭 AI Agent States
- **😌 Idle** - Calm, waiting state
- **🤔 Thinking** - Processing, analyzing
- **🗣️ Speaking** - Active communication with voice
- **👂 Listening** - Attentive, receiving input
- **😲 Surprised** - Reacting, alert

### 🎤 Voice & Audio Features
- **Text-to-Speech** - AI responses with natural voice (OpenAI TTS or browser fallback)
- **Audio-Reactive Blob** - Real-time blob animations synced to voice frequency
- **Sentiment Analysis** - AI analyzes emotions and triggers appropriate blob reactions
- **Smooth Transitions** - Fluid state changes between listening → thinking → speaking → emotion

### 🎨 Visual Features
- Custom GLSL shaders with Perlin noise
- Real-time parameter controls with Leva
- Multiple gradient textures
- Environment mapping for realistic reflections
- Audio-reactive scaling and deformation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Vercel AI Gateway API key (primary AI service)
- OpenAI API key (optional, for fallback and TTS only)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/banique15/blob-mixer.git
cd blob-mixer
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
# Primary AI service (required)
VITE_AI_GATEWAY_BASE_URL=https://ai-gateway.vercel.sh/v1
VITE_AI_GATEWAY_API_KEY=your-vercel-ai-gateway-api-key

# Optional: for fallback and TTS only
# VITE_OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

> **Note:** The app primarily uses Vercel AI Gateway. OpenAI API key is optional and only used for fallback functionality and text-to-speech.

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 🎮 How to Use

### Chat Interface
1. Type your message in the chat input
2. Press Enter or click 🚀 to send
3. Watch the blob transition through states:
   - **Listening** (purple) - Receiving your message
   - **Thinking** (orange/red) - Processing response
   - **Speaking** (cyan/green) - AI responds with voice
   - **Emotion** - Blob shows detected emotion

### Blob Controls
- Click the settings icon to open Leva controls
- Adjust parameters in real-time:
  - **Complexity** - Detail level of blob deformation
  - **Speed** - Animation speed
  - **Strength** - Deformation intensity
  - **Colors** - Primary, secondary, tertiary colors
  - **Material** - Metalness, roughness, environment intensity

### Audio Reactivity
- The blob automatically reacts to AI voice:
  - **Scale** - Pulses with audio volume
  - **Speed** - Increases with voice intensity
  - **Deformation** - Responds to bass frequencies

## 🏗️ Project Structure

```
blob-mixer/
├── src/
│   ├── components/
│   │   ├── Blob.jsx                 # Main 3D blob component
│   │   ├── MagicalMaterial.jsx      # Custom shader material
│   │   ├── Scene.jsx                # Three.js scene setup
│   │   ├── Controls.jsx             # Leva GUI controls
│   │   └── Chat/
│   │       ├── ChatPanel.jsx        # Chat UI with voice
│   │       └── ChatPanel.css        # Chat styling
│   ├── services/
│   │   └── aiService.js             # Vercel AI Gateway & OpenAI integration
│   ├── shaders/
│   │   ├── headers.glsl             # Perlin noise functions
│   │   └── displacement.glsl        # Vertex displacement
│   ├── assets/
│   │   ├── gradients/               # Texture images
│   │   └── envmap-2048.min.jpg      # Environment map
│   ├── store.js                     # Zustand state management
│   ├── App.jsx                      # Main app component
│   └── main.jsx                     # Entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Technical Details

### Technologies Used
- **React 18** - UI framework
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Zustand** - State management
- **React Spring** - Smooth animations
- **Leva** - GUI controls
- **Vercel AI Gateway** - Primary AI service with GPT-4o
- **OpenAI API** - Fallback & TTS
- **Vite** - Build tool

### Key Concepts

#### Audio Analysis
The `aiService.js` analyzes audio frequency data:
```javascript
{
  average: 0.0-1.0,  // Overall volume
  bass: 0.0-1.0,     // Low frequencies
  raw: Uint8Array    // Full frequency spectrum
}
```

#### Blob Reactions
State transitions triggered by chat events:
```javascript
triggerBlobReaction({
  preset: 'speaking',     // AI state
  duration: 3000,         // How long to show
  emotion: 'excited',     // Emotion overlay
  intensity: 0.8          // Strength (0-1)
})
```

#### GLSL Shaders
Custom vertex shader uses Perlin noise for organic deformation:
- 3D noise generation
- Time-based animation
- Audio-reactive multipliers
- Smooth normal recalculation

## 🎨 Customization

### Adding New AI States
Edit `src/store.js`:
```javascript
{
  id: 'custom',
  name: '✨ Custom State',
  description: 'Your description',
  config: {
    complexity: 3,
    speed: 0.5,
    strength: 0.4,
    color1: '#ff0000',
    // ... other parameters
  }
}
```

### Changing Voice
Edit `src/services/aiService.js`:
```javascript
// OpenAI voices: alloy, echo, fable, onyx, nova, shimmer
voice: 'nova'
```

### Adjusting Audio Reactivity
Edit `src/components/Blob.jsx`:
```javascript
audioMultipliers.current = {
  speed: 1 + (audioData.average * 0.8),    // Adjust multiplier
  strength: 1 + (audioData.bass * 0.6),
  complexity: 1 + (audioData.average * 0.4)
}
```

## 🐛 Troubleshooting

### No Voice Output
- Check browser supports Web Speech API
- Verify OpenAI API key in `.env`
- Check browser console for errors

### Blob Not Reacting to Audio
- Ensure microphone permissions granted
- Check audio context is initialized
- Verify `audioData` state is updating

### Performance Issues
- Reduce blob segments in `Blob.jsx`
- Lower shader quality settings
- Disable environment mapping

## 📝 API Keys

### Vercel AI Gateway (Primary)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create an account or sign in
3. Navigate to your project settings
4. Create a new AI Gateway API key
5. Add to `.env` file as `VITE_AI_GATEWAY_API_KEY`

### OpenAI API Key (Optional - Fallback & TTS)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new secret key
5. Add to `.env` file as `VITE_OPENAI_API_KEY`

**AI Service Priority:**
1. **Primary**: Vercel AI Gateway (GPT-4o for chat, GPT-3.5-turbo for sentiment)
2. **Fallback**: OpenAI Direct API (same models)
3. **TTS**: Always uses OpenAI Direct API

**Estimated Costs:**
- GPT-4o: ~$0.005 per 1K tokens (input), ~$0.015 per 1K tokens (output)
- GPT-3.5-Turbo: ~$0.0005 per 1K tokens (input), ~$0.0015 per 1K tokens (output)
- TTS: ~$0.015 per 1K characters

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Inspired by [Soupy.app](https://soupy.app)
- Three.js community for amazing examples
- OpenAI for powerful AI capabilities

## 🔗 Links

- [GitHub Repository](https://github.com/banique15/blob-mixer)
- [Live Demo](https://blob-mixer.vercel.app) (coming soon)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)

---

Made with ❤️ by [Banique](https://github.com/banique15)
