# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Montseny XR is a futuristic portfolio website for Santiago, a senior XR/AI developer. It features an AI chatbot assistant (IAN), 3D visualizations, and an interactive voxel building game.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000, host 0.0.0.0)
npm run build        # Production build
npm run preview      # Preview production build
```

**Required**: Set `GEMINI_API_KEY` in `.env.local` before running.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (inline via CDN)
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **AI Integration**: Google Gemini API (@google/genai) - `gemini-2.5-flash` for text, `gemini-2.5-flash-native-audio-preview-09-2025` for voice

## Architecture

```
├── App.tsx                 # Main app - toggles between game mode and main site
├── index.tsx               # React entry point
├── types.ts                # TypeScript interfaces (Project, Category, Importance, etc.)
├── constants.ts            # PROJECTS array with all project data
├── components/
│   ├── Header.tsx          # Navigation with mobile menu
│   ├── Hero.tsx            # Landing section with 3D particles
│   ├── Services.tsx        # Services showcase
│   ├── NeuralInterface.tsx # IAN AI assistant (TEXT + VOICE modes, ~590 lines)
│   ├── Projects.tsx        # Portfolio section wrapper
│   ├── FlowExplorer.tsx    # Flow chart project explorer (chronological/category/importance)
│   ├── Contact.tsx         # Footer/contact section
│   └── VoxelGame.tsx       # 3D voxel builder (~840 lines)
├── services/
│   ├── gemini.ts           # Gemini API client, chat session, system instructions
│   └── audioUtils.ts       # Audio encoding/decoding for voice (base64, PCM)
```

## Projects Data Structure

Projects are defined in `constants.ts` with categories (Extended Reality, AI, Videogames, Simulation), importance levels (Top, Normal, Low Impact), and year for chronological sorting. The FlowExplorer allows users to navigate projects through a flow chart interface with three exploration paths.

## Key Patterns

**3D Rendering**:
- Use `useMemo` for geometry data to avoid recreation on every frame
- `useFrame` hook from R3F for animation loops
- Raycasting for click detection in VoxelGame
- Particle systems with `Float32Array` and additive blending

**State Management**:
- React hooks only (no Redux/Context)
- Refs for 3D objects, audio contexts, raycasters

**AI Integration**:
- Centralized Gemini client in `services/gemini.ts`
- Dual interface: async REST for text chat, WebSocket for live voice
- Audio processing converts between Float32Array and PCM Int16Array at 16000 Hz

## Design System

Custom Tailwind colors (defined in index.html):
- `montseny-dark`: #050a08 (primary background)
- `montseny-green`: #39ff14 (primary accent/neon green)
- `montseny-blue`: #00f3ff (secondary accent/cyan)
- `montseny-forest`: #0f291e (overlay background)

Fonts: `orbitron` (headers), `rajdhani` (body), `mono` (code)

## Complex Components

**NeuralInterface.tsx**: AI chatbot with text and voice modes. Voice mode uses dual AudioContext (input mic, output speaker), ScriptProcessor for real-time processing, and 3D phantom head visualization. Audio lifecycle setup/teardown is complex.

**VoxelGame.tsx**: Full-screen 3D voxel builder with pointer lock controls (desktop), touch joystick (mobile), block placement via raycasting, and email manifest generation. Uses velocity-based movement with damping.

## Configuration

- **Vite**: Path alias `@/*` → project root, passes `GEMINI_API_KEY` as `process.env`
- **TypeScript**: ES2022 target, ESNext modules, react-jsx
- Dependencies loaded via CDN (esm.sh) in index.html
