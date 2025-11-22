# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Montseny XR is a portfolio website for XR and AI development, featuring an interactive AI chat interface (NEXUS) powered by Google Gemini with voice interaction and 3D visualizations.

## Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run preview  # Preview production build
```

## Environment Setup

Requires `GEMINI_API_KEY` in `.env.local` for AI functionality. Without it, the app runs in simulation mode with fallback responses.

## Architecture

### Entry Flow
`index.html` → `index.tsx` → `App.tsx` → Components (Header, Hero, NeuralInterface, Projects, Services, Contact)

### Key Directories
- `components/` - React components
- `services/` - Utility services (Gemini API, audio encoding)
- `types.ts` - TypeScript type definitions

### Tech Stack
- **React 18 + TypeScript + Vite** - Core framework
- **Three.js + React Three Fiber** - 3D visualizations
- **@google/genai** - Gemini AI integration
- **Tailwind CSS** (CDN) - Styling with custom theme
- **Web Audio API** - Voice interaction

### AI Integration (NEXUS)
- `services/gemini.ts` - Singleton Gemini client using `gemini-2.5-flash` model
- System prompt defines Spanish-speaking cyberpunk AI personality
- Supports text chat and voice interaction via Gemini Live API
- Falls back to simulation mode if API key missing

### 3D Visualization
- `NeuralInterface.tsx` - "PhantomHead" particle system (4000 points) reactive to audio
- `Hero.tsx` - "NeuralGalaxy" animated sphere + "CyberFloor" grid
- Uses `maath/random` for particle distribution, additive blending for glow effects

### Audio System
- `services/audioUtils.ts` - Base64 PCM encoding/decoding (16-bit, 16kHz)
- Real-time microphone input via Web Audio API
- Audio frequency analysis drives 3D visual reactions

### Theme/Styling
Custom colors defined in `index.html` Tailwind config:
- `montseny-dark`: #050a08 (background)
- `montseny-green`: #39ff14 (primary neon)
- `montseny-blue`: #00f3ff (secondary neon)
- `montseny-forest`: #0f291e (accent)

Custom fonts: Orbitron, Rajdhani, Share Tech Mono

### UI Patterns
- Glassmorphism with backdrop blur (`glass-panel` class)
- Neon glow effects and glitch animations
- Custom cursor with hover effects
- Smooth scroll for anchor navigation
