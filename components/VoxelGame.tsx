
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Html, useKeyboardControls, KeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { BlockType, VoxelBlock } from '../types';
import { X, Play, Mail, MousePointer2, Hand, Move, Eye, Copy, Check, Terminal } from 'lucide-react';

// --- Data Definitions ---

const BLOCK_TYPES: BlockType[] = [
  { id: 'ai', name: 'Artificial Intelligence', description: 'Neural networks and deep learning integration.', color: '#39ff14', type: 'resource' },
  { id: 'sim', name: 'Simulation', description: 'Physics engines and digital twins.', color: '#00f3ff', type: 'resource' },
  { id: 'gamification', name: 'Gamification', description: 'Engagement mechanics and loops.', color: '#ff00ff', type: 'resource' },
  { id: 'robotics', name: 'Robotics', description: 'Hardware control and automation.', color: '#ff4d00', type: 'resource' },
  { id: 'npc', name: 'Smart NPC', description: 'Non-Player Characters with agency.', color: '#ffff00', type: 'resource' },
  { id: 'mcp', name: 'MCP Protocol', description: 'Model Context Protocol for LLMs.', color: '#ffffff', type: 'resource' },
  { id: 'realistic', name: 'Realistic', description: 'High-fidelity rendering and assets.', color: '#808080', type: 'resource' },
  { id: 'optimized', name: 'Optimized', description: 'High performance code.', color: '#0000ff', type: 'resource' },
  { id: 'vr', name: 'Virtual Reality', description: 'Immersive headset experiences.', color: '#800080', type: 'resource' },
  { id: 'webgl', name: 'General Web', description: 'Standard web technologies.', color: '#008000', type: 'resource' },
  { id: 'mvp', name: 'MVP WebApp', description: 'Minimum Viable Product development.', color: '#ffc0cb', type: 'resource' },
  { id: 'nodejs', name: 'NodeJS', description: 'Backend server logic.', color: '#006400', type: 'resource' },
  { id: 'agents', name: 'Agents', description: 'Autonomous task executors.', color: '#ff0000', type: 'resource' },
];

// --- Game Logic & Helper Components ---

const Crosshair = () => (
  <div className="absolute top-1/2 left-1/2 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex items-center justify-center">
    <div className="w-1 h-1 bg-black rounded-full shadow-[0_0_2px_white]"></div>
    <div className="absolute w-full h-[2px] bg-white/80"></div>
    <div className="absolute h-full w-[2px] bg-white/80"></div>
  </div>
);

const ControlsGuide = () => (
    <div className="absolute top-4 left-4 z-50 pointer-events-none hidden md:block">
        <div className="bg-black/60 backdrop-blur border border-white/20 p-4 rounded-lg text-white font-mono text-xs">
            <h3 className="font-bold text-montseny-green mb-2 uppercase border-b border-white/10 pb-1">Controls</h3>
            <ul className="space-y-1">
                <li><span className="text-yellow-400">W A S D</span> Move</li>
                <li><span className="text-yellow-400">SHIFT</span> Run</li>
                <li><span className="text-yellow-400">MOUSE</span> Look</li>
                <li><span className="text-yellow-400">L-CLICK</span> Interact / Place</li>
                <li><span className="text-yellow-400">ESC</span> Pause / Menu</li>
            </ul>
        </div>
    </div>
);

// Handles Movement (WASD relative to camera look direction + Mobile Input)
const Player = ({ position, setPosition, mobileInput }: { position: THREE.Vector3, setPosition: (p: THREE.Vector3) => void, mobileInput: React.MutableRefObject<any> }) => {
  const { camera } = useThree();
  const [, get] = useKeyboardControls();
  const velocity = useRef(new THREE.Vector3());
  
  const speed = 4.0; 
  const damping = 0.9; 

  useFrame((state, delta) => {
    const { forward, backward, left, right, sprint } = get();
    const m = mobileInput.current;
    
    // 1. Get Camera Direction (Horizontal only)
    const frontVector = new THREE.Vector3(0, 0, 0);
    const sideVector = new THREE.Vector3(0, 0, 0);
    const direction = new THREE.Vector3(0, 0, 0);
    
    // Extract forward direction from camera, ignore Y (no flying)
    const camForward = new THREE.Vector3();
    camera.getWorldDirection(camForward);
    camForward.y = 0;
    camForward.normalize();

    // Extract right direction
    const camRight = new THREE.Vector3();
    camRight.crossVectors(camForward, camera.up);

    // 2. Calculate Input Vector (Keyboard + Mobile)
    const isForward = forward || m.y > 0.2;
    const isBackward = backward || m.y < -0.2;
    const isLeft = left || m.x < -0.2;
    const isRight = right || m.x > 0.2;

    if (isForward) frontVector.add(camForward);
    if (isBackward) frontVector.sub(camForward);
    if (isRight) sideVector.add(camRight);
    if (isLeft) sideVector.sub(camRight);

    direction.addVectors(frontVector, sideVector).normalize();

    // Determine active speed
    const activeSpeed = sprint ? speed * 2.0 : speed;

    // 3. Apply Physics
    if (direction.lengthSq() > 0) {
        velocity.current.addScaledVector(direction, activeSpeed * delta * 5);
    }
    
    velocity.current.multiplyScalar(damping); // Friction

    // 4. Update Position
    camera.position.add(new THREE.Vector3(velocity.current.x * delta, 0, velocity.current.z * delta));
    
    // Simple Floor Collision
    if (camera.position.y < 2) camera.position.y = 2;
    // Ceiling Collision
    if (camera.position.y > 13) camera.position.y = 13;
    // Wall Collision (Simple bounds)
    const bound = 19;
    if (camera.position.x > bound) camera.position.x = bound;
    if (camera.position.x < -bound) camera.position.x = -bound;
    if (camera.position.z > bound) camera.position.z = bound;
    if (camera.position.z < -bound) camera.position.z = -bound;

    // Mobile Look (Touch Drag)
    if (m.isLooking) {
        const sens = 2.0 * delta;
        camera.rotation.order = 'YXZ';
        camera.rotation.y -= m.lookX * sens;
        camera.rotation.x -= m.lookY * sens;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
        m.lookX = 0;
        m.lookY = 0;
    }

    if (Math.random() > 0.9) {
        setPosition(camera.position.clone());
    }
  });

  return (
    <group>
        <pointLight position={camera.position} intensity={0.5} distance={10} decay={2} color="#ffffff" />
    </group>
  );
};

// Visual representation of the block in hand
const PlayerHand = ({ holdingBlock }: { holdingBlock: BlockType | null }) => {
  const { camera } = useThree();
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const bobY = Math.sin(t * 8) * 0.05;
    const bobX = Math.cos(t * 4) * 0.03;
    const offset = new THREE.Vector3(0.5 + bobX, -0.4 + bobY, -0.8);
    offset.applyQuaternion(camera.quaternion);
    meshRef.current.position.copy(camera.position).add(offset);
    meshRef.current.quaternion.copy(camera.quaternion);
  });

  if (!holdingBlock) return null;

  return (
    <group ref={meshRef}>
       {/* Explicitly name this object so we can ignore it in raycasting */}
       <mesh name="player_hand" rotation={[0, Math.PI / 4, 0]} raycast={() => null}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color={holdingBlock.color} emissive={holdingBlock.color} emissiveIntensity={0.2} />
          <lineSegments>
             <edgesGeometry args={[new THREE.BoxGeometry(0.3, 0.3, 0.3)]} />
             <lineBasicMaterial color="black" />
          </lineSegments>
       </mesh>
    </group>
  );
};

const WorldStructure = () => {
  const size = 40;
  const height = 15;

  const texture = useMemo(() => {
     const canvas = document.createElement('canvas');
     canvas.width = 128;
     canvas.height = 128;
     const context = canvas.getContext('2d');
     if(context) {
        context.fillStyle = '#e0e0e0'; 
        context.fillRect(0,0,128,128);
        context.strokeStyle = '#a0a0a0';
        context.lineWidth = 2;
        context.strokeRect(0,0,128,128);
     }
     const t = new THREE.CanvasTexture(canvas);
     t.wrapS = THREE.RepeatWrapping;
     t.wrapT = THREE.RepeatWrapping;
     t.repeat.set(size / 2, size / 2);
     t.colorSpace = THREE.SRGBColorSpace;
     return t;
  }, []);

  const wallTexture = texture.clone();
  wallTexture.repeat.set(size / 2, height / 2);

  const material = new THREE.MeshStandardMaterial({ map: texture, color: '#ffffff', roughness: 0.5, metalness: 0.1 });
  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture, color: '#eeeeee', roughness: 0.8 });

  return (
    <group>
        <mesh name="env_floor" rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[size, size]} />
            <primitive object={material} attach="material" />
        </mesh>
        <mesh name="env_ceiling" rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
            <planeGeometry args={[size, size]} />
            <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
        <mesh name="env_wall_back" position={[0, height/2, -size/2]}>
            <boxGeometry args={[size, height, 1]} />
            <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh name="env_wall_front" position={[0, height/2, size/2]}>
            <boxGeometry args={[size, height, 1]} />
            <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh name="env_wall_left" position={[-size/2, height/2, 0]} rotation={[0, Math.PI/2, 0]}>
            <boxGeometry args={[size, height, 1]} />
            <primitive object={wallMaterial} attach="material" />
        </mesh>
        <mesh name="env_wall_right" position={[size/2, height/2, 0]} rotation={[0, Math.PI/2, 0]}>
            <boxGeometry args={[size, height, 1]} />
            <primitive object={wallMaterial} attach="material" />
        </mesh>
    </group>
  );
};

const GameBlock = ({ position, type, onClick, transparent = false, isHovered }: any) => {
  return (
    <group position={position}>
       <mesh onClick={onClick} receiveShadow castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color={type.color} 
            transparent={transparent}
            opacity={transparent ? 0.5 : 1}
            emissive={isHovered ? '#ffffff' : type.color}
            emissiveIntensity={isHovered ? 0.5 : 0.1}
            roughness={0.2}
          />
       </mesh>
       <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
            <lineBasicMaterial color="black" linewidth={2} />
        </lineSegments>
    </group>
  );
};

const GhostBlock = ({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            <mesh name="ghost_preview">
                <boxGeometry args={[1.05, 1.05, 1.05]} />
                <meshBasicMaterial color="#39ff14" wireframe transparent opacity={0.5} />
            </mesh>
        </group>
    );
}

// --- Main Game Component ---

const VoxelGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [holdingBlock, setHoldingBlock] = useState<BlockType | null>(null);
  
  const [placedBlocks, setPlacedBlocks] = useState<VoxelBlock[]>([]);
  const [resourceBlocks, setResourceBlocks] = useState<{ id: string, type: BlockType, position: [number, number, number] }[]>([]);
  
  // Interaction State
  const [hoveredData, setHoveredData] = useState<{ type?: BlockType, position: [number, number, number], isResource: boolean, id?: string, normal?: THREE.Vector3, placementPos?: [number, number, number] } | null>(null);
  
  // Mobile / Email State
  const mobileInput = useRef({ x: 0, y: 0, isLooking: false, lookX: 0, lookY: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Hide custom cursor when game is mounted
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    if (cursor) cursor.style.display = 'none';
    return () => {
      if (cursor) cursor.style.display = 'block';
    };
  }, []);

  useEffect(() => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const blocks: any[] = [];
    BLOCK_TYPES.forEach((type, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        for(let c=0; c<3; c++) {
             blocks.push({
                id: `res-${type.id}-${c}`,
                type,
                position: [-18 + (c*1.2), row * 1.5 + 1.5, col * 1.5 - 3]
            });
        }
    });
    setResourceBlocks(blocks);
  }, []);

  // Raycasting Hook
  const RaycasterHandler = () => {
    const { camera, scene } = useThree();
    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    
    useFrame(() => {
        if (!isLocked && !isTouch) return;
        
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        // Filter hits: Ignore Hand, Ignore "Ghost" objects, Limit distance
        const validHits = intersects.filter(hit => 
            hit.distance < 100 && // Increased distance
            hit.object.name !== 'player_hand' &&
            hit.object.name !== 'ghost_preview' &&
            hit.object.type === 'Mesh'
        );

        if (validHits.length > 0) {
            const hit = validHits[0];
            const hitPos = hit.object.parent?.position; 
            
            // 1. Check if hitting a Resource Block
            if (hitPos) {
                const rBlock = resourceBlocks.find(b => new THREE.Vector3(...b.position).distanceTo(hitPos) < 0.1);
                if (rBlock) {
                     // If we are holding a block, we might want to place ON this resource
                     let placementPos = undefined;
                     if (hit.face) {
                         placementPos = [
                             rBlock.position[0] + hit.face.normal.x,
                             rBlock.position[1] + hit.face.normal.y,
                             rBlock.position[2] + hit.face.normal.z
                         ] as [number, number, number];
                     }

                    setHoveredData({ type: rBlock.type, position: rBlock.position, isResource: true, id: rBlock.id, normal: hit.face?.normal, placementPos });
                    return;
                }

                // 2. Check if hitting a Placed Block
                const pBlock = placedBlocks.find(b => new THREE.Vector3(...b.position).distanceTo(hitPos) < 0.1);
                if (pBlock) {
                    const type = BLOCK_TYPES.find(t => t.id === pBlock.typeId);
                    if (type) {
                        let placementPos = undefined;
                        if (hit.face) {
                            placementPos = [
                                pBlock.position[0] + hit.face.normal.x,
                                pBlock.position[1] + hit.face.normal.y,
                                pBlock.position[2] + hit.face.normal.z
                            ] as [number, number, number];
                        }
                        setHoveredData({ type, position: pBlock.position, isResource: false, id: pBlock.id, normal: hit.face?.normal, placementPos });
                        return;
                    }
                }
            }

            // 3. Hitting Environment (Floor/Walls)
            // We can only place if we have a normal
            if (hit.face) {
                 const targetVec = new THREE.Vector3().copy(hit.point).add(hit.face.normal.clone().multiplyScalar(0.5));
                 const tx = Math.round(targetVec.x);
                 const ty = Math.floor(targetVec.y) + 0.5;
                 const tz = Math.round(targetVec.z);

                 setHoveredData({ 
                     position: [hit.point.x, hit.point.y, hit.point.z], 
                     isResource: false, 
                     normal: hit.face.normal,
                     id: 'env',
                     placementPos: [tx, ty, tz]
                 });
            } else {
                setHoveredData(null);
            }

        } else {
            setHoveredData(null);
        }
    });
    return null;
  };

  const handleInteract = useCallback(() => {
    if (!hoveredData) return;

    if (holdingBlock) {
        // Placing
        if (hoveredData.placementPos) {
             const [tx, ty, tz] = hoveredData.placementPos;
             
             const newBlock: VoxelBlock = {
                id: Math.random().toString(36).substr(2, 9),
                typeId: holdingBlock.id,
                position: [tx, ty, tz]
             };
             setPlacedBlocks(prev => [...prev, newBlock]);
             setHoldingBlock(null); // Consume block
        }
    } else {
        // Taking
        if (hoveredData.isResource && hoveredData.type) {
            const blockToTake = resourceBlocks.find(b => b.id === hoveredData.id);
            if (blockToTake) {
                setResourceBlocks(prev => prev.filter(b => b.id !== blockToTake.id));
                setHoldingBlock(blockToTake.type);
            }
        } else if (hoveredData.id !== 'env' && hoveredData.type) {
            // Pick up placed block
            setPlacedBlocks(prev => prev.filter(b => b.id !== hoveredData.id));
            setHoldingBlock(hoveredData.type);
        }
    }
  }, [hoveredData, holdingBlock, resourceBlocks]);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
        if (isLocked && e.button === 0) handleInteract();
    };
    window.addEventListener('mousedown', onMouseDown);
    return () => window.removeEventListener('mousedown', onMouseDown);
  }, [handleInteract, isLocked]);

  // --- Email Logic ---

  const generateEmailText = () => {
      const counts: Record<string, number> = {};
      placedBlocks.forEach(b => {
          const t = BLOCK_TYPES.find(type => type.id === b.typeId);
          if (t) counts[t.name] = (counts[t.name] || 0) + 1;
      });
      
      const summary = Object.entries(counts).map(([name, count]) => `- ${name} x${count}`).join('\n');
      const total = placedBlocks.length;

      return `Subject: Interactive Project Build Submission - ${new Date().toLocaleDateString()}

Dear Montseny XR Team,

I have used your interactive builder to design a preliminary project structure. Below is the technical summary of the required modules and components:

--- PROJECT MANIFEST ---
${summary}
------------------------

Total Modules: ${total}

I would like to request a consultation to discuss the feasibility and implementation of this configuration.

Best regards,
[Your Name]`;
  };

  const handleFinishProject = () => {
      if (placedBlocks.length === 0) {
          alert("You haven't placed any blocks in the project yet!");
          return;
      }
      
      const text = generateEmailText();

      if (isTouch) {
          // On mobile, direct mailto is usually better
          const subject = "Montseny XR Project Build";
          const body = text;
          window.open(`mailto:info@xr-dreams.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
          onClose();
      } else {
          // On PC, show copy panel
          setEmailContent(text);
          setShowEmailModal(true);
      }
  };

  const copyToClipboard = async () => {
      try {
          await navigator.clipboard.writeText(emailContent);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
          console.error('Failed to copy text: ', err);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white font-sans select-none touch-none">
        <KeyboardControls map={[
            { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
            { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
            { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
            { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
            { name: 'sprint', keys: ['Shift'] },
        ]}>
            <Canvas shadows camera={{ fov: 75, position: [0, 2, 5] }}>
                <ambientLight intensity={0.9} />
                <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
                <hemisphereLight intensity={0.5} groundColor="#444444" skyColor="#ffffff" />
                
                <WorldStructure />
                <RaycasterHandler />
                <PlayerHand holdingBlock={holdingBlock} />
                <Player position={new THREE.Vector3(0,2,0)} setPosition={() => {}} mobileInput={mobileInput} />
                
                {!isTouch && !showEmailModal && (
                    <PointerLockControls 
                        onLock={() => { 
                            setIsLocked(true); 
                            setHasStarted(true); 
                        }} 
                        onUnlock={() => setIsLocked(false)} 
                    />
                )}

                {resourceBlocks.map((rb) => (
                     <GameBlock 
                        key={rb.id} 
                        position={rb.position} 
                        type={rb.type} 
                        isHovered={hoveredData?.id === rb.id}
                    />
                ))}

                {placedBlocks.map((pb) => {
                    const type = BLOCK_TYPES.find(t => t.id === pb.typeId);
                    if(!type) return null;
                    return (
                        <GameBlock 
                            key={pb.id} 
                            position={pb.position} 
                            type={type}
                            isHovered={hoveredData?.id === pb.id}
                        />
                    );
                })}

                {/* GHOST BLOCK FOR PLACEMENT VISUALIZATION */}
                {holdingBlock && hoveredData?.placementPos && (
                    <GhostBlock position={hoveredData.placementPos} />
                )}

                <Html position={[-16, 5, 0]} center transform rotation={[0, Math.PI/2, 0]}>
                     <div className="bg-white/90 text-black p-2 border-2 border-black font-orbitron text-xl font-bold shadow-lg">
                        INVENTORY
                     </div>
                </Html>

                 <Html position={[0, 0.1, 0]} center transform rotation={[-Math.PI/2, 0, 0]}>
                     <div className="text-black/20 font-orbitron text-6xl tracking-widest font-black">
                        BUILD AREA
                     </div>
                </Html>
            </Canvas>
        </KeyboardControls>

        {/* HUD */}
        <Crosshair />
        <ControlsGuide />

        {/* Mobile HUD */}
        {isTouch && hasStarted && !showEmailModal && (
            <div className="absolute inset-0 z-[150] pointer-events-none">
                <div 
                    className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full border border-white/30 pointer-events-auto flex items-center justify-center backdrop-blur-sm"
                    onTouchStart={(e) => {
                        const touch = e.touches[0];
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = (touch.clientX - rect.left - rect.width/2) / (rect.width/2);
                        const y = -(touch.clientY - rect.top - rect.height/2) / (rect.height/2);
                        mobileInput.current.x = x;
                        mobileInput.current.y = y;
                    }}
                    onTouchMove={(e) => {
                        const touch = e.touches[0];
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = (touch.clientX - rect.left - rect.width/2) / (rect.width/2);
                        const y = -(touch.clientY - rect.top - rect.height/2) / (rect.height/2);
                        mobileInput.current.x = Math.max(-1, Math.min(1, x));
                        mobileInput.current.y = Math.max(-1, Math.min(1, y));
                    }}
                    onTouchEnd={() => { mobileInput.current.x = 0; mobileInput.current.y = 0; }}
                >
                    <Move className="text-white/50 w-8 h-8" />
                    <div className="absolute w-6 h-6 bg-white rounded-full opacity-50" style={{ transform: `translate(${mobileInput.current.x * 30}px, ${-mobileInput.current.y * 30}px)`}}></div>
                </div>

                <div 
                    className="absolute top-0 right-0 w-1/2 h-full pointer-events-auto"
                    onTouchStart={(e) => {
                        mobileInput.current.isLooking = true;
                        mobileInput.current.lastLookX = e.touches[0].clientX;
                        mobileInput.current.lastLookY = e.touches[0].clientY;
                    }}
                    onTouchMove={(e) => {
                        if(mobileInput.current.isLooking) {
                            const dx = e.touches[0].clientX - mobileInput.current.lastLookX;
                            const dy = e.touches[0].clientY - mobileInput.current.lastLookY;
                            mobileInput.current.lookX = dx * 0.005;
                            mobileInput.current.lookY = dy * 0.005;
                            mobileInput.current.lastLookX = e.touches[0].clientX;
                            mobileInput.current.lastLookY = e.touches[0].clientY;
                        }
                    }}
                    onTouchEnd={() => { mobileInput.current.isLooking = false; }}
                ></div>

                <button 
                    className="absolute bottom-16 right-10 w-20 h-20 bg-montseny-green/80 rounded-full border-4 border-white pointer-events-auto active:scale-95 flex items-center justify-center"
                    onClick={handleInteract}
                >
                    <Hand className="w-8 h-8 text-black" />
                </button>

                 <button 
                    className="absolute top-4 right-4 p-3 bg-black/50 rounded-lg border border-white/30 pointer-events-auto backdrop-blur-md"
                    onClick={() => { setIsLocked(false); }} 
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full text-xs font-mono text-white/70 pointer-events-none flex items-center gap-2">
                    <Eye className="w-3 h-3" /> Drag Right Side to Look
                </div>
            </div>
        )}

        {/* Context Info */}
        {(isLocked || (isTouch && hasStarted)) && hoveredData && (hoveredData.isResource || hoveredData.id !== 'env') && (
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-10 z-50 pointer-events-none">
                 <div className="bg-white/90 backdrop-blur border-2 border-black p-3 rounded-lg text-center shadow-xl text-black">
                     <h3 className="font-orbitron font-bold">{hoveredData.type?.name}</h3>
                     <div className="mt-1 text-xs font-bold font-mono uppercase text-montseny-green bg-black inline-block px-2 py-1 rounded">
                         {holdingBlock ? "PLACE HERE" : "PICK UP"}
                     </div>
                 </div>
             </div>
        )}
        
        {/* Holding Info */}
        {(isLocked || (isTouch && hasStarted)) && holdingBlock && (
            <div className="absolute top-4 right-4 md:bottom-10 md:right-10 md:top-auto z-50">
                <div className="bg-white border-2 border-black p-4 rounded-xl flex items-center gap-4 shadow-lg">
                     <div className="w-8 h-8 rounded border border-black" style={{ backgroundColor: holdingBlock.color }}></div>
                     <div className="text-black">
                         <div className="text-xs text-gray-500 font-mono">HOLDING</div>
                         <div className="font-bold font-orbitron">{holdingBlock.name}</div>
                     </div>
                </div>
            </div>
        )}

        {/* Start Screen */}
        {!hasStarted && (
             <div className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => {
                      if (isTouch) {
                          setIsLocked(true);
                          setHasStarted(true);
                      } else {
                          const canvas = document.querySelector('canvas');
                          if(canvas) canvas.requestPointerLock();
                      }
                  }}
             >
                 <MousePointer2 className="w-12 h-12 text-montseny-green animate-bounce mb-4" />
                 <h2 className="font-orbitron text-3xl text-white font-bold animate-pulse">INITIALIZE SYSTEM</h2>
                 <p className="text-gray-400 mt-2 font-mono text-sm">
                    {isTouch ? '[ TAP TO START ENGINE ]' : '[ CLICK TO ENGAGE ]'}
                 </p>
             </div>
        )}

        {/* Email Modal (PC) */}
        {showEmailModal && (
            <div className="absolute inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-black border border-montseny-green/30 shadow-[0_0_50px_rgba(57,255,20,0.2)] rounded-lg overflow-hidden relative">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-5 h-5 text-montseny-green" />
                            <h3 className="font-orbitron text-xl text-white">PROJECT MANIFEST GENERATED</h3>
                        </div>
                        <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="mb-6">
                            <p className="text-gray-400 font-rajdhani mb-2">Please copy the technical summary below and send it to:</p>
                            <div className="inline-block px-4 py-2 bg-montseny-green/10 border border-montseny-green/50 rounded text-montseny-green font-mono text-lg select-text">
                                info@xr-dreams.com
                            </div>
                        </div>

                        <div className="relative">
                            <textarea 
                                value={emailContent} 
                                readOnly 
                                className="w-full h-64 bg-black border border-gray-800 p-4 font-mono text-xs text-gray-300 focus:outline-none focus:border-montseny-green resize-none"
                            />
                            <div className="absolute bottom-4 right-4">
                                <button 
                                    onClick={copyToClipboard}
                                    className={`flex items-center gap-2 px-4 py-2 rounded font-bold font-orbitron text-xs transition-all ${copySuccess ? 'bg-montseny-green text-black' : 'bg-white text-black hover:bg-gray-200'}`}
                                >
                                    {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copySuccess ? 'COPIED!' : 'COPY TO CLIPBOARD'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 text-center border-t border-white/10">
                        <button onClick={() => setShowEmailModal(false)} className="text-gray-500 hover:text-white font-mono text-sm">
                            [ CLOSE PANEL ]
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Menu Screen (Only if started then paused) */}
        {hasStarted && !isLocked && !isTouch && !showEmailModal && (
            <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
                <div className="max-w-md w-full bg-white border-4 border-black p-8 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] text-center relative">
                    
                    <h2 className="font-orbitron text-4xl text-black mb-2 font-black">SIMULATION PAUSED</h2>
                    <p className="font-rajdhani text-gray-600 mb-8 font-bold">Select an action protocol.</p>

                    <div className="space-y-4">
                        <button 
                            onClick={() => document.querySelector('canvas')?.requestPointerLock()}
                            className="w-full py-4 bg-black text-white font-bold font-orbitron rounded hover:bg-montseny-green hover:text-black transition-colors flex items-center justify-center gap-2"
                        >
                            <Play className="w-5 h-5" /> RESUME
                        </button>

                        <button 
                            onClick={handleFinishProject}
                            disabled={placedBlocks.length === 0}
                            className="w-full py-4 bg-montseny-blue text-black font-bold font-orbitron rounded hover:bg-blue-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Mail className="w-5 h-5" /> SEND BLUEPRINT
                        </button>

                        <button 
                            onClick={onClose}
                            className="w-full py-4 bg-transparent border-2 border-red-500 text-red-500 font-bold font-orbitron rounded hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <X className="w-5 h-5" /> EXIT
                        </button>
                    </div>
                </div>
            </div>
        )}

         {/* Mobile Menu */}
         {isTouch && hasStarted && !isLocked && (
            <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="bg-white border-4 border-black p-8 rounded-2xl text-center w-80">
                    <h2 className="font-orbitron text-2xl text-black mb-6 font-black">PAUSED</h2>
                     <button onClick={() => setIsLocked(true)} className="w-full py-4 bg-black text-white font-bold font-orbitron rounded mb-4">RESUME</button>
                     <button onClick={handleFinishProject} className="w-full py-4 bg-montseny-blue text-black font-bold font-orbitron rounded mb-4">SEND</button>
                     <button onClick={onClose} className="w-full py-4 border-2 border-red-500 text-red-500 font-bold font-orbitron rounded">EXIT</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default VoxelGame;
