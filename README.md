# 🎨 Blob Mixer - Interactive 3D Blob Generator

An interactive 3D web application that creates mesmerizing animated blob shapes with customizable materials, colors, and effects. Built with React, Three.js, and custom GLSL shaders.

![Blob Mixer](https://img.shields.io/badge/React-18.2.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.158.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🌊 **Real-time 3D Blob Animation** - Smooth, organic blob shapes powered by custom GLSL shaders
- 🎨 **Multiple Gradient Presets** - Cosmic Fusion, Deep Ocean, Sunset Vibes, and more
- 🎛️ **Interactive Controls** - Adjust complexity, speed, strength, colors, and material properties
- 🖱️ **Intuitive Camera Controls** - Drag to rotate, scroll to zoom
- 💫 **Advanced Materials** - Metalness, roughness, and environment mapping
- 📱 **Responsive Design** - Works on desktop and mobile devices
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

### Customization Options

- **Preset** - Choose from pre-configured blob styles
- **Complexity** - Control the detail level (1-5)
- **Speed** - Animation speed (0-2)
- **Strength** - Distortion intensity (0-1)
- **Color** - Primary blob color
- **Metalness** - Metallic appearance (0-1)
- **Roughness** - Surface roughness (0-1)
- **Env Map Intensity** - Environment reflection strength (0-3)

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

## 🎨 Available Presets

1. **Cosmic Fusion** - Vibrant neon colors with high metalness
2. **Deep Ocean** - Cool blue tones with medium complexity
3. **Sunset Vibes** - Warm orange and pink hues
4. **Neon Dreams** - Intense neon colors with maximum metalness

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

### Adding New Presets

Edit `src/store.js` and add new preset configurations:

```javascript
{
  id: 'my-preset',
  name: 'My Preset',
  config: {
    complexity: 3,
    speed: 0.5,
    strength: 0.3,
    color1: '#ff6b6b',
    metalness: 0.8,
    roughness: 0.2,
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

## 🙏 Acknowledgments

- Inspired by the original Blob Mixer project
- Perlin noise implementation by Stefan Gustavson
- Three.js and React Three Fiber communities

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Enjoy creating beautiful 3D blobs! 🎨✨**
