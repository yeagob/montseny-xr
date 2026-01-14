# AGENTS.md

Development guide for agentic coding assistants working on Montseny XR repository.

## Development Commands

```bash
npm run dev          # Start dev server (port 3000, host 0.0.0.0)
npm run build        # Production build (tsc + vite build)
npm run preview      # Preview production build
npm run lint         # TypeScript type checking (tsc --noEmit)
```

**No test framework configured** - This project does not have test files. When adding tests, check with user first.

## Code Style Guidelines

### Imports
- Group imports: React first, third-party libraries, local modules
- Use named imports for React hooks: `import { useState, useEffect } from 'react'`
- No unused imports - clean them up
- Path alias `@/*` resolves to project root directory

### Components
- Use functional components with TypeScript interfaces for props
- Define props interface above component or inline
- Default export: `export default ComponentName`
- Named exports for sub-components: `function SubComponent() {}`

### Types
- All shared types defined in `types.ts`
- Use enums for fixed categories: `Category`, `Importance`, `InteractionState`
- Interfaces for objects: `Project`, `ChatMessage`, `VoxelBlock`
- Use `React.FC<PropsType>` for component type annotation
- Strict TypeScript enabled - no implicit any

### Naming Conventions
- Components: PascalCase (e.g., `NeuralInterface`, `ProjectCard`)
- Functions: camelCase (e.g., `initializeChat`, `sendMessageToNexus`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `BLOCK_TYPES`, `SYSTEM_INSTRUCTION`)
- State variables: camelCase (e.g., `isGameMode`, `chatMessages`)
- Event handlers: `handle` prefix (e.g., `handleScroll`, `handleSubmit`)
- Hooks: `use` prefix for custom hooks (not currently used)

### 3D & Performance (Three.js / React Three Fiber)
- Use `useMemo` for geometry/data to prevent recreation on each render
- Use `useFrame` from @react-three/fiber for animation loops
- Store Three.js objects in `useRef` to avoid re-renders
- Raycasting for click detection (see VoxelGame.tsx)
- Particle systems use `Float32Array` and additive blending
- Dispose geometries/materials in cleanup functions

### State Management
- React hooks only (useState, useEffect, useRef, useCallback, useMemo)
- No Redux, Context API, or external state management
- Use refs for mutable values that don't trigger re-renders
- Dependency arrays in useEffect/useCallback/useMemo must be complete

### Error Handling
- Try-catch blocks for async operations
- Console.error for logging errors
- Return fallback values or user-friendly error messages
- Graceful degradation (e.g., demo mode when API key missing)

### Formatting
- 2-space indentation
- Single quotes for strings in some places, double quotes in JSX
- Semicolons at end of statements
- Trailing commas in multi-line arrays/objects
- No unnecessary whitespace or blank lines

### Audio & API
- Dual AudioContext for voice mode (input mic, output speaker)
- Audio processing: Float32Array ↔ PCM Int16Array at 16000 Hz
- Gemini API: REST for text chat, WebSocket for live voice
- API key from `process.env.API_KEY` (passed via Vite define)

### Environment
- Set `GEMINI_API_KEY` in `.env.local` before running dev server
- Never commit `.env.local` or `.env` files
- Vite passes env var as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`

### File Organization
```
App.tsx                 # Main entry, game/site toggle
index.tsx               # React DOM render
types.ts                # All shared TypeScript types
constants.ts            # PROJECTS data array
components/              # React components
services/               # API clients (gemini.ts), utilities (audioUtils.ts)
```

### Complex Components
- **NeuralInterface.tsx** (~590 lines): AI chatbot with text/voice modes, 3D phantom head, dual AudioContext lifecycle
- **VoxelGame.tsx** (~840 lines): Full-screen 3D voxel builder, pointer lock, raycasting, joystick controls, velocity-based movement

### Before Committing
Always run:
```bash
npm run lint    # Check TypeScript types
npm run build   # Ensure production build succeeds
```

### Adding New Features
1. Follow existing patterns in similar components
2. Add type definitions to `types.ts` if shared
3. Use existing libraries (Three.js, R3F, lucide-react icons) before adding new deps
4. Test both desktop and mobile (responsive design)
5. Consider performance with useMemo/useCallback for heavy computations

### Design System
Custom Tailwind colors (see index.html):
- `montseny-dark`: #050a08 (primary background)
- `montseny-green`: #39ff14 (primary accent/neon green)
- `montseny-blue`: #00f3ff (secondary accent/cyan)
- `montseny-forest`: #0f291e (overlay background)

Fonts: `orbitron` (headers), `rajdhani` (body), `mono` (code)
