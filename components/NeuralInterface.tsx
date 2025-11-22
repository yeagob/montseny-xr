import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Mic, MicOff, X, Terminal, Volume2, Activity, MessageSquare, Send, Wifi, Zap } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decode, decodeAudioData, createBlob } from '../services/audioUtils';
import { sendMessageToNexus } from '../services/gemini';
import { ChatMessage } from '../types';

// --- 3D Avatar Component ---

function PhantomHead({ analyzer }: { analyzer: AnalyserNode | null }) {
  const ref = useRef<THREE.Points>(null!);
  const count = 4000;
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color1 = new THREE.Color('#39ff14');
    const color2 = new THREE.Color('#00f3ff');

    for (let i = 0; i < count; i++) {
      let u = -1 + (2 * i) / count;
      if (isNaN(u)) u = 0;
      
      const safeU = Math.max(-1, Math.min(1, u));
      const phi = Math.acos(safeU);
      const theta = Math.sqrt(count * Math.PI) * phi;

      let x = Math.cos(theta) * Math.sin(phi);
      let y = Math.sin(theta) * Math.sin(phi);
      let z = Math.cos(phi);

      if (isNaN(x) || isNaN(y) || isNaN(z)) {
          x = 0; y = 0; z = 0;
      }

      y = y * 1.2;
      z = z * 1.1;

      pos[i * 3] = x * 2.5;
      pos[i * 3 + 1] = y * 2.5;
      pos[i * 3 + 2] = z * 2.5;

      const mixed = color1.clone().lerp(color2, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const dataArray = useMemo(() => new Uint8Array(32), []);

  useFrame((state) => {
    if (!ref.current) return;
    
    let volume = 0;
    if (analyzer) {
        analyzer.getByteFrequencyData(dataArray);
        volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    }

    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    
    const currentPositions = ref.current.geometry.attributes.position.array as Float32Array;
    const intensity = volume / 255.0;

    for(let i = 0; i < count; i++) {
        const noise = Math.sin(t * 2 + i) * 0.0001; 
        const reaction = intensity * (Math.random() * 0.0003); 
        
        let ox = positions[i*3];
        let oy = positions[i*3+1];
        let oz = positions[i*3+2];

        if (isNaN(ox)) ox = 0;
        if (isNaN(oy)) oy = 0;
        if (isNaN(oz)) oz = 0;

        currentPositions[i*3] = ox + (ox * (noise + reaction));
        currentPositions[i*3+1] = oy + (oy * (noise + reaction));
        currentPositions[i*3+2] = oz + (oz * (noise + reaction));
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

// --- Main Interface Component ---

const NeuralInterface: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'IDLE' | 'TEXT' | 'VOICE'>('IDLE');
  
  // --- Text Chat State ---
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello. I am IAN, the site\'s Artificial Intelligence. I am connected to Santiago\'s project database. How can I help you?', timestamp: new Date() }
  ]);
  const [isTextThinking, setIsTextThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Voice Chat State ---
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [volume, setVolume] = useState(1);
  const [voiceStatus, setVoiceStatus] = useState("OFFLINE");

  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // --- Text Logic ---

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeMode === 'TEXT') {
        scrollToBottom();
    }
  }, [messages, activeMode]);

  const handleTextSend = async () => {
    if (!textInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: textInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setTextInput('');
    setIsTextThinking(true);

    try {
        const responseText = await sendMessageToNexus(userMsg.text);
        const modelMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
        setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
        setMessages(prev => [...prev, { role: 'model', text: "Connection error with service.", timestamp: new Date() }]);
    } finally {
        setIsTextThinking(false);
    }
  };

  // --- Voice Logic ---

  const toggleVoiceSession = async () => {
    if (isVoiceConnected) {
      shutdownAudio();
    } else {
      setVoiceStatus("CONNECTING TO SERVER...");
      await startLiveSession();
    }
  };

  const shutdownAudio = () => {
    processorRef.current?.disconnect();
    inputSourceRef.current?.disconnect();
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
    }
    audioContextRef.current = null;
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    setIsVoiceConnected(false);
    setVoiceStatus("DISCONNECTED");
  };

  const startLiveSession = async () => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            setVoiceStatus("ERROR: MISSING API KEY");
            alert("API KEY not configured in deployment environment (Vercel).");
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = audioCtx;
        
        const analyzer = audioCtx.createAnalyser();
        analyzer.fftSize = 64;
        analyzerRef.current = analyzer;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = volume;
        gainNode.connect(audioCtx.destination);
        gainNodeRef.current = gainNode;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const source = inputCtx.createMediaStreamSource(stream);
        inputSourceRef.current = source;

        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
                },
                systemInstruction: `You are IAN, a friendly and natural AI assistant.
                Your job is to chat with visitors about Santiago's portfolio (Montseny XR).
                Be brief, clear, and helpful. Speak in English.`,
            },
            callbacks: {
                onopen: () => {
                    setVoiceStatus("IAN LISTENING...");
                    setIsVoiceConnected(true);
                    
                    const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                    processor.onaudioprocess = (e) => {
                        if (!isMicOn) return;
                        const inputData = e.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromise.then(session => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    source.connect(processor);
                    processor.connect(inputCtx.destination);
                    processorRef.current = processor;
                },
                onmessage: async (message: LiveServerMessage) => {
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (base64Audio && audioContextRef.current) {
                        const ctx = audioContextRef.current;
                        const audioBuffer = await decodeAudioData(
                            decode(base64Audio),
                            ctx,
                            24000,
                            1
                        );

                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                        const source = ctx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(analyzer); 
                        analyzer.connect(gainNode);
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        sourcesRef.current.add(source);
                        source.addEventListener('ended', () => sourcesRef.current.delete(source));
                    }
                },
                onclose: () => {
                    setVoiceStatus("CONNECTION CLOSED");
                    setIsVoiceConnected(false);
                },
                onerror: (e) => {
                    console.error("Live API Error", e);
                    setVoiceStatus("CONNECTION ERROR");
                }
            }
        });

    } catch (err: any) {
        console.error("Audio Init Failed", err);
        setVoiceStatus("HARDWARE ERROR");
    }
  };

  useEffect(() => {
    if (gainNodeRef.current) gainNodeRef.current.gain.value = volume;
  }, [volume]);

  useEffect(() => {
    if (inputSourceRef.current && inputSourceRef.current.mediaStream) {
        inputSourceRef.current.mediaStream.getAudioTracks().forEach(track => {
            track.enabled = isMicOn;
        });
    }
  }, [isMicOn]);

  return (
    <section id="ian" className="py-20 relative bg-montseny-forest/20 border-y border-montseny-green/10 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-montseny-green/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {activeMode === 'IDLE' && (
            <div className="max-w-6xl mx-auto px-4 text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                 <div className="mb-12">
                     <div className="inline-flex items-center justify-center p-4 rounded-full bg-black/40 border border-montseny-green/30 mb-6">
                        <Zap className="w-8 h-8 text-montseny-green animate-pulse" />
                     </div>
                     <h2 className="font-orbitron text-4xl md:text-5xl text-white mb-4">
                        IAN <span className="text-montseny-green glitch-wrapper" data-text="AI">AI</span>
                     </h2>
                     <p className="font-rajdhani text-xl text-gray-400 max-w-2xl mx-auto">
                         Intelligent Artificial Natural. A language model connected to the context of this portfolio to solve your doubts. Not magic, just engineering.
                     </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                     {/* Text Option */}
                     <button 
                        onClick={() => setActiveMode('TEXT')}
                        className="group relative p-8 bg-black/60 border border-montseny-blue/30 rounded-2xl hover:border-montseny-blue transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] text-left interactable overflow-hidden"
                     >
                         <div className="absolute inset-0 bg-gradient-to-br from-montseny-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                         <Terminal className="w-12 h-12 text-montseny-blue mb-6 group-hover:scale-110 transition-transform duration-300" />
                         <h3 className="font-orbitron text-2xl text-white mb-2 group-hover:text-montseny-blue transition-colors">TEXT CHAT</h3>
                         <p className="font-mono text-sm text-gray-500 group-hover:text-gray-300">
                            > Ask questions about projects<br/>
                            > Fast and accurate answers<br/>
                            > Powered by Gemini
                         </p>
                     </button>

                     {/* Voice Option */}
                     <button 
                        onClick={() => setActiveMode('VOICE')}
                        className="group relative p-8 bg-black/60 border border-montseny-green/30 rounded-2xl hover:border-montseny-green transition-all duration-300 hover:shadow-[0_0_30px_rgba(57,255,20,0.2)] text-left interactable overflow-hidden"
                     >
                         <div className="absolute inset-0 bg-gradient-to-br from-montseny-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                         <Activity className="w-12 h-12 text-montseny-green mb-6 group-hover:scale-110 transition-transform duration-300" />
                         <h3 className="font-orbitron text-2xl text-white mb-2 group-hover:text-montseny-green transition-colors">VOICE MODE (LIVE)</h3>
                         <p className="font-mono text-sm text-gray-500 group-hover:text-gray-300">
                            > Speak naturally with IAN<br/>
                            > Real-time audio responses<br/>
                            > Fluid conversational experience
                         </p>
                     </button>
                 </div>
            </div>
        )}

        {activeMode === 'TEXT' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                <div className="w-full max-w-2xl h-[70vh] bg-black border border-montseny-green/40 shadow-[0_0_50px_rgba(57,255,20,0.2)] flex flex-col relative overflow-hidden">
                    
                    {/* CRT Scanline Effect Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-40 bg-[length:100%_4px,6px_100%]"></div>
                    <div className="absolute inset-0 pointer-events-none animate-scanline bg-gradient-to-b from-transparent via-montseny-green/5 to-transparent h-32 z-40"></div>

                    {/* Header */}
                    <div className="bg-montseny-forest/80 p-4 flex justify-between items-center border-b border-montseny-green/30 relative z-50">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-5 h-5 text-montseny-green" />
                            <span className="font-mono text-montseny-green tracking-widest">IAN_TERMINAL</span>
                            <div className="flex items-center gap-1 ml-4">
                                <Wifi className="w-4 h-4 text-montseny-green animate-pulse" />
                                <span className="text-xs text-montseny-green">ONLINE</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setActiveMode('IDLE')} 
                            className="text-montseny-green hover:text-white transition-colors interactable"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-sm relative z-30 bg-black/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 border ${
                                    msg.role === 'user' 
                                    ? 'border-montseny-blue/50 bg-montseny-blue/10 text-montseny-blue rounded-tl-xl rounded-bl-xl rounded-br-xl' 
                                    : 'border-montseny-green/50 bg-montseny-green/10 text-montseny-green rounded-tr-xl rounded-br-xl rounded-bl-xl'
                                }`}>
                                    <div className="text-[10px] opacity-50 mb-1 uppercase tracking-wider">
                                        {msg.role === 'user' ? 'YOU' : 'IAN'}
                                    </div>
                                    <div className="leading-relaxed text-base font-rajdhani font-semibold">
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTextThinking && (
                            <div className="flex justify-start">
                                <div className="text-montseny-green font-mono animate-pulse">
                                    > IAN IS TYPING...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-black border-t border-montseny-green/30 relative z-50">
                        <div className="flex items-center gap-2">
                            <span className="text-montseny-green font-bold">{'>'}</span>
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleTextSend()}
                                placeholder="Type here..."
                                autoFocus
                                className="flex-1 bg-transparent border-none text-white font-mono focus:ring-0 focus:outline-none placeholder-gray-600"
                            />
                            <button 
                                onClick={handleTextSend}
                                className="p-2 text-montseny-green hover:bg-montseny-green/20 rounded transition-colors interactable"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeMode === 'VOICE' && (
            <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-in fade-in duration-500">
                
                {/* 3D Avatar Container */}
                <div className="absolute inset-0 z-0">
                     <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                        <ambientLight intensity={0.5} />
                        <PhantomHead analyzer={analyzerRef.current} />
                     </Canvas>
                </div>

                {/* Overlay UI */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-12 pointer-events-none">
                    
                    <div className="flex justify-between items-start pointer-events-auto">
                         <div className="bg-black/40 backdrop-blur-md p-4 border-l-4 border-montseny-green rounded-r-lg">
                            <h3 className="font-orbitron text-2xl text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-montseny-green" />
                                IAN (VOICE)
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${isVoiceConnected ? 'bg-montseny-green animate-pulse' : 'bg-red-500'}`}></div>
                                <span className="font-mono text-xs text-montseny-green/80 tracking-widest">{voiceStatus}</span>
                            </div>
                         </div>
                         
                         <button 
                            onClick={() => { shutdownAudio(); setActiveMode('IDLE'); }} 
                            className="p-3 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500 text-white hover:text-red-500 transition-all interactable backdrop-blur-sm"
                         >
                            <X className="w-8 h-8" />
                         </button>
                    </div>

                    <div className="text-center pointer-events-auto">
                        {!isVoiceConnected && (
                             <button 
                                onClick={toggleVoiceSession}
                                className="px-10 py-5 bg-montseny-green text-black hover:bg-white hover:scale-105 transition-all font-orbitron font-bold text-lg rounded shadow-[0_0_30px_rgba(57,255,20,0.4)]"
                             >
                                START CONVERSATION
                             </button>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 pointer-events-auto bg-black/30 backdrop-blur-md p-6 rounded-3xl border border-white/10 max-w-xl mx-auto w-full">
                        <button 
                            onClick={() => setIsMicOn(!isMicOn)}
                            disabled={!isVoiceConnected}
                            className={`p-6 rounded-full border-2 transition-all interactable ${isMicOn ? 'border-montseny-green text-montseny-green shadow-[0_0_20px_rgba(57,255,20,0.4)]' : 'border-red-500 text-red-500 bg-red-500/10'} ${!isVoiceConnected && 'opacity-50 cursor-not-allowed'}`}
                        >
                            {isMicOn ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
                        </button>

                        <div className="flex items-center gap-4 flex-1 w-full">
                            <Volume2 className="w-6 h-6 text-montseny-blue" />
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.01" 
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-montseny-blue interactable"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-40"></div>
            </div>
        )}
    </section>
  );
};

export default NeuralInterface;