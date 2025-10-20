# 🤖 AI Agent Visualizer - Emotional State Representation

An interactive 3D web application that visualizes AI agent emotional states through animated blob shapes. Each state (Idle, Thinking, Speaking, Listening, Surprised) has unique visual characteristics powered by custom GLSL shaders. Built with React, Three.js, and custom shader materials.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.158.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🤖 **AI State Visualization** - Visual representation of AI agent emotional states
- 🎭 **5 Distinct States** - Idle, Thinking, Speaking, Listening, and Surprised
- 🌊 **Real-time Animation** - Smooth, organic morphing powered by Perlin noise shaders
- 🎛️ **Interactive Controls** - Fine-tune complexity, speed, strength, and visual properties
- 🖱️ **Intuitive Camera Controls** - Drag to rotate, scroll to zoom
- 💫 **Advanced PBR Materials** - Metalness, roughness, and environment mapping
- 🎨 **Smooth Transitions** - Animated state changes with React Spring
- ⚡ **High Performance** - Optimized rendering with React Three Fiber

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd blob-mixer
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

## 🎮 Usage

### Basic Controls

- **🖱️ Left Mouse Drag** - Rotate the camera around the blob
- **🔍 Scroll Wheel** - Zoom in/out
- **🎛️ Control Panel** - Adjust blob properties in real-time

### AI Agent States

Each state has unique visual characteristics:

- **😌 Idle** - Calm, gentle movement with cool blue/purple tones
- **🤔 Thinking** - Moderate complexity with warm orange/yellow colors
- **🗣️ Speaking** - Fast, energetic with bright cyan/green colors
- **👂 Listening** - Attentive, smooth with purple gradients
- **😲 Surprised** - Highly dynamic with intense pink/magenta colors

### Customization Options

- **AI State** - Switch between emotional states
- **Complexity** (1-5) - Detail level and surface intricacy
- **Speed** (0-2) - Animation speed
- **Strength** (0-1) - Distortion intensity
- **Color** - Primary color
- **Metalness** (0-1) - Metallic appearance
- **Roughness** (0-1) - Surface smoothness
- **Env Intensity** (0-3) - Reflection strength

## 🏗️ Project Structure

```
blob-mixer/
├── src/
│   ├── assets/           # Textures and gradients
│   │   ├── gradients/    # Gradient texture images
│   │   └── envmap-2048.min.jpg
│   ├── components/       # React components
│   │   ├── Blob.jsx      # Main blob component
│   │   ├── Scene.jsx     # 3D scene setup
│   │   ├── Controls.jsx  # UI controls
│   │   └── MagicalMaterial.jsx  # Custom shader material
│   ├── shaders/          # GLSL shaders
│   │   ├── headers.glsl  # Noise functions
│   │   └── displacement.glsl  # Vertex displacement
│   ├── store.js          # State management
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🎭 AI Agent States

1. **😌 Idle** - Calm, waiting state (blue/purple, low activity)
2. **🤔 Thinking** - Processing, analyzing (orange/yellow, moderate activity)
3. **🗣️ Speaking** - Active communication (cyan/green, high activity)
4. **👂 Listening** - Attentive, receiving (purple, moderate activity)
5. **😲 Surprised** - Reacting, alert (pink/magenta, very high activity)

## 🛠️ Technology Stack

- **React 18** - UI framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **React Spring** - Animation library
- **Leva** - GUI controls
- **Zustand** - State management
- **Vite** - Build tool and dev server
- **GLSL** - Custom shaders for blob effects

## 🔧 Development

### Build Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Shader Development

The blob's appearance is controlled by custom GLSL shaders:

- **headers.glsl** - Contains Perlin noise functions and uniforms
- **displacement.glsl** - Vertex displacement logic for blob shape

### Adding New AI States

Edit `src/store.js` and add new state configurations:

```javascript
{
  id: 'excited',
  name: '🎉 Excited',
  description: 'Energetic, enthusiastic',
  config: {
    complexity: 4.5,
    speed: 1.0,
    strength: 0.6,
    color1: '#ffaa00',
    metalness: 0.9,
    roughness: 0.15,
    envMapIntensity: 2.2,
  }
}
```

## 📝 Technical Details

### Blob Generation

The blob is created using:
1. **Sphere Geometry** - Base shape with high segment count
2. **Perlin Noise** - 3D noise function for organic distortion
3. **Vertex Displacement** - Moving vertices along their normals
4. **Normal Recalculation** - Smooth lighting on displaced surface

### Performance Optimizations

- Adaptive segment count based on device
- Efficient shader compilation
- Frame rate limiting (60 FPS)
- Frustum culling disabled for always-visible blob
- Optimized texture loading

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the MIT License.

## 🎯 Use Cases

- **AI/Chatbot Interfaces** - Visual feedback for conversational AI
- **Voice Assistants** - State indication for voice interactions
- **Educational Tools** - Teaching emotional intelligence in AI
- **Creative Projects** - Artistic representation of AI states
- **Presentations** - Demonstrating AI behavior concepts

## 🙏 Acknowledgments

- Perlin noise implementation by Stefan Gustavson
- Three.js and React Three Fiber communities
- Inspired by emotional design principles

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Enjoy creating beautiful 3D blobs! 🎨✨**
