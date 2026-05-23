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

---

## IAN AI Assistant Customization Guide

IAN (Intelligent Artificial Natural) is the futuristic AI assistant on this site, supporting both **Text Chat** and **Live Voice** modes.

### 1. Where IAN is Defined
- **Text Mode logic & Client initialization**: [gemini.ts](file:///d:/ClaudeCode/Montseny-XR/services/gemini.ts)
- **Voice Mode logic & WebSocket / Audio pipeline**: [NeuralInterface.tsx](file:///d:/ClaudeCode/Montseny-XR/components/NeuralInterface.tsx)

### 2. Modifying the Prompts

#### A. Main System Instruction (Text & Voice Shared Context)
The core knowledge base, professional background of Santiago, project list, and conversational style are defined as a single constant `SYSTEM_INSTRUCTION` in [gemini.ts](file:///d:/ClaudeCode/Montseny-XR/services/gemini.ts#L15).
- **To change Santiago's biography, project lists, or general behavior**: Edit `SYSTEM_INSTRUCTION` directly in `services/gemini.ts`. Both text and voice chat will inherit these updates.

#### B. Voice-Specific System Instruction
In [NeuralInterface.tsx](file:///d:/ClaudeCode/Montseny-XR/components/NeuralInterface.tsx#L297), the voice mode appends an extra instruction to the prompt:
```typescript
systemInstruction: SYSTEM_INSTRUCTION + `\n\nIMPORTANT FOR VOICE MODE: Keep responses brief and conversational since this is a spoken dialogue. Limit responses to 2-3 sentences when possible.`,
```
- **To change voice-only behaviors** (e.g., asking IAN to be more concise, use sound effects in speech, or adopt a certain tone during voice calls), modify this string in `components/NeuralInterface.tsx`.

### 3. Modifying Chat & Voice Configurations

#### A. Changing the AI Models
- **Text Chat Model**: Configured in `initializeChat()` inside [gemini.ts](file:///d:/ClaudeCode/Montseny-XR/services/gemini.ts#L307). Currently set to `'gemini-2.5-flash'`.
- **Voice Chat Model**: Configured in `startLiveSession()` inside [NeuralInterface.tsx](file:///d:/ClaudeCode/Montseny-XR/components/NeuralInterface.tsx#L291). Currently set to `'gemini-2.5-flash-native-audio-preview-09-2025'`.

#### B. Changing the Voice Style (Voice Actor)
Gemini Live API provides multiple prebuilt voices. In [NeuralInterface.tsx](file:///d:/ClaudeCode/Montseny-XR/components/NeuralInterface.tsx#L295), the voice is set as:
```typescript
voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
```
To change the voice, replace `'Fenrir'` with other supported Gemini voices:
- `Puck` (Energetic, high pitch)
- `Charon` (Deep, husky)
- `Kore` (Clear, professional)
- `Fenrir` (Deep, crisp)
- `Aoede` (Warm, expressive)

#### C. Changing Text Generation Parameters (Temperature)
In [gemini.ts](file:///d:/ClaudeCode/Montseny-XR/services/gemini.ts#L310), the temperature is set to `0.7` to balance creativity and facts:
```typescript
temperature: 0.7,
```
To make IAN more factual and stick strictly to the prompt, lower this value (e.g., `0.2`). To make IAN more creative, raise it (e.g., `1.0`).

### 4. Technical Architecture (Deep Dive)

#### Text Mode:
1. User types in `NeuralInterface.tsx` and clicks Send.
2. `handleTextSend()` calls `sendMessageToNexus(message)` in `services/gemini.ts`.
3. If first message, `initializeChat()` creates a `Chat` session using `@google/genai` client, passing `SYSTEM_INSTRUCTION` and `temperature`.
4. Response is displayed in the custom terminal window styled with a retro green scanline CRT overlay.

#### Voice Mode:
1. User enters Voice Mode and clicks **START CONVERSATION**.
2. `startLiveSession()` opens a bidirectional WebSocket using `ai.live.connect` with `gemini-2.5-flash-native-audio-preview-09-2025`.
3. **Input Stream**:
   - Microphone captured at 16000 Hz via `inputContextRef`.
   - `ScriptProcessorNode` processes chunks in real-time, calculates sound levels to detect user talking (`avgLevel > 0.01` is `isUserTalking`), and compiles float data into 16-bit PCM blobs using `services/audioUtils.ts`.
   - Sent via `session.sendRealtimeInput({ media: pcmBlob })`.
4. **Output Stream**:
   - `onmessage` callback receives base64-encoded audio chunks.
   - Decoded to `AudioBuffer` and scheduled sequentially on output `audioContextRef` (24000 Hz) to ensure seamless playback.
   - Outputs play through an `AnalyserNode` connected to a 3D R3F Canvas showing a **Phantom Head** particle sphere that pulses dynamically based on speaking volume.

