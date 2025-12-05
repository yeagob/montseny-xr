
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';
import { ArrowDown, Terminal, MessageSquare, PlayCircle, Snowflake } from 'lucide-react';
import * as THREE from 'three';

const CHRISTMAS_MODE = true;

// --- 3D Components ---

function NeuralGalaxy(props: any) {
  const ref = useRef<THREE.Points>(null!);

  // The "Old" script effect: Dense, energetic sphere
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(8000), { radius: 1.5 }) as Float32Array;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#39ff14" // Montseny Green
          size={0.012}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function CyberFloor() {
  const ref = useRef<THREE.Points>(null!);

  // A vast, subtle grid that waves gently below the sphere
  const particles = useMemo(() => {
    const rows = 80;
    const cols = 80;
    const count = rows * cols;
    const positions = new Float32Array(count * 3);

    let i = 0;
    for (let xi = 0; xi < rows; xi++) {
      for (let zi = 0; zi < cols; zi++) {
        const x = (xi - rows / 2) * 0.8;
        const z = (zi - cols / 2) * 0.8;
        positions[i * 3] = x;
        positions[i * 3 + 1] = -2; // Start low
        positions[i * 3 + 2] = z;
        i++;
      }
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    const count = particles.length / 3;

    for (let i = 0; i < count; i++) {
      const x = particles[i * 3];
      const z = particles[i * 3 + 2];
      // Very slow, subtle wave
      const y = Math.sin((x * 0.15) + (t * 0.3)) * 0.4 + Math.cos((z * 0.1) + (t * 0.2)) * 0.4;
      positions[i * 3 + 1] = y - 4; // Keep it at the bottom
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f3ff"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.15} // Subtle opacity
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Spores() {
  const ref = useRef<THREE.Points>(null!);
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(2000), { radius: 12 }) as Float32Array;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 40;
      ref.current.rotation.y -= delta / 50;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}

function ChristmasTree(props: any) {
  const ref = useRef<THREE.Points>(null!);

  const { treePoints, ornamentPoints, starPoints } = useMemo(() => {
    // Tree Body (Cone)
    const treeCount = 6000;
    const treePos = new Float32Array(treeCount * 3);
    const treeColors = new Float32Array(treeCount * 3);
    const green = new THREE.Color('#39ff14');
    const darkGreen = new THREE.Color('#0f5c0f');

    for (let i = 0; i < treeCount; i++) {
      const y = (Math.random() * 4) - 2; // Height from -2 to 2
      const radius = (2 - y) * 0.4; // Cone shape
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius; // Uniform distribution in circle slice

      treePos[i * 3] = Math.cos(angle) * r;
      treePos[i * 3 + 1] = y;
      treePos[i * 3 + 2] = Math.sin(angle) * r;

      // Mix greens
      const color = green.clone().lerp(darkGreen, Math.random());
      treeColors[i * 3] = color.r;
      treeColors[i * 3 + 1] = color.g;
      treeColors[i * 3 + 2] = color.b;
    }

    // Ornaments
    const ornamentCount = 200;
    const ornamentPos = new Float32Array(ornamentCount * 3);
    const ornamentColors = new Float32Array(ornamentCount * 3);
    const ornamentPalette = [
      new THREE.Color('#ff0000'), // Red
      new THREE.Color('#ffd700'), // Gold
      new THREE.Color('#00f3ff'), // Blue
      new THREE.Color('#ff00ff'), // Purple
    ];

    for (let i = 0; i < ornamentCount; i++) {
      const y = (Math.random() * 3.5) - 1.8; // Slightly smaller range
      const radius = (2 - y) * 0.4;
      const angle = Math.random() * Math.PI * 2;

      // Place on surface
      ornamentPos[i * 3] = Math.cos(angle) * radius;
      ornamentPos[i * 3 + 1] = y;
      ornamentPos[i * 3 + 2] = Math.sin(angle) * radius;

      const color = ornamentPalette[Math.floor(Math.random() * ornamentPalette.length)];
      ornamentColors[i * 3] = color.r;
      ornamentColors[i * 3 + 1] = color.g;
      ornamentColors[i * 3 + 2] = color.b;
    }

    // Star
    const starCount = 300;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = Math.random() * 0.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPos[i * 3] = 0 + r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = 2.2 + r * Math.sin(phi) * Math.sin(theta); // Top of tree
      starPos[i * 3 + 2] = 0 + r * Math.cos(phi);
    }

    return { treePoints: { pos: treePos, col: treeColors }, ornamentPoints: { pos: ornamentPos, col: ornamentColors }, starPoints: starPos };
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta / 4;
    }
  });

  return (
    <group {...props}>
      {/* Tree Body */}
      <Points ref={ref} positions={treePoints.pos} colors={treePoints.col} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Ornaments */}
      <Points positions={ornamentPoints.pos} colors={ornamentPoints.col} stride={3} frustumCulled={false} rotation-y={ref.current?.rotation.y}>
        <PointMaterial
          transparent
          vertexColors
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Star */}
      <Points positions={starPoints} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffff00"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function Snow() {
  const ref = useRef<THREE.Points>(null!);
  const count = 3000;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      spd[i] = Math.random() * 0.02 + 0.005;
    }
    return [pos, spd];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speeds[i];
      // Reset if too low
      if (pos[i * 3 + 1] < -5) {
        pos[i * 3 + 1] = 5;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

// --- 2D Particle Overlay Component ---
const ParticleNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let mouse = { x: -1000, y: -1000 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.color = Math.random() > 0.5 ? '#39ff14' : '#00f3ff';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const directionX = (dx / distance) * force * 2;
          const directionY = (dy / distance) * force * 2;
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const init = () => {
      resizeCanvas();
      particles = [];
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 12000); // Reduced density for overlay
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(57, 255, 20, ${1 - distance / 100})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      resizeCanvas();
      init();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-1 pointer-events-none"
    />
  );
};

const Hero: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-montseny-dark">

      {/* 3D Scene (Background Layer) */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <fog attach="fog" args={['#050a08', 2, 15]} />
          {CHRISTMAS_MODE ? (
            <>
              <ChristmasTree />
              <Snow />
            </>
          ) : (
            <>
              <NeuralGalaxy />
              <CyberFloor />
              <Spores />
            </>
          )}
        </Canvas>
      </div>

      {/* 2D Particle Overlay (Mid Layer) */}
      <ParticleNetwork />

      {/* Overlay Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050a08_90%)]"></div>

      <div className="relative z-10 text-center px-4 w-full max-w-5xl pointer-events-none">

        {/* Floating Holographic Header */}
        <div className="relative mb-10 transform-style-3d perspective-1000">
          <div className="inline-block bg-montseny-forest/50 backdrop-blur-sm border border-montseny-green/30 px-4 py-2 rounded-full mb-6 animate-pulse-fast pointer-events-auto">
            <span className="font-mono text-montseny-green text-xs md:text-sm tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-montseny-green rounded-full animate-ping"></span>
              SYSTEM_ONLINE :: IAN_ACTIVE
            </span>
          </div>

          <h1 className="font-orbitron font-black text-6xl md:text-9xl text-white mb-2 relative select-none glitch-wrapper pointer-events-auto" data-text="MONTSENY XR">
            MONTSENY <span className="text-transparent bg-clip-text bg-gradient-to-r from-montseny-green to-montseny-blue">XR</span>
          </h1>

          <p className="font-rajdhani text-gray-300 text-xl md:text-3xl tracking-wide max-w-3xl mx-auto mt-6 text-glow-blue pointer-events-auto">
            Where <span className="text-montseny-green font-bold">Nature</span> converges with <span className="text-montseny-blue font-bold">Code</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12 pointer-events-auto">
          <button
            onClick={onStartGame}
            className="interactable group relative px-8 py-4 bg-black/80 overflow-hidden border border-white text-white font-orbitron font-bold tracking-wider transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] backdrop-blur-md"
          >
            <span className="absolute inset-0 w-0 bg-white transition-all duration-300 ease-out group-hover:w-full opacity-100"></span>
            <span className="relative group-hover:text-black flex items-center gap-2 z-10">
              <PlayCircle className="w-5 h-5" /> START PROJECT
            </span>
          </button>

          <a href="#portfolio" className="interactable group relative px-8 py-4 bg-black/80 overflow-hidden border border-montseny-green text-white font-orbitron font-bold tracking-wider transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] backdrop-blur-md">
            <span className="absolute inset-0 w-0 bg-montseny-green transition-all duration-300 ease-out group-hover:w-full opacity-100"></span>
            <span className="relative group-hover:text-black flex items-center gap-2 z-10">
              <Terminal className="w-5 h-5" /> PORTFOLIO
            </span>
          </a>

          <a href="#ian" className="interactable group relative px-8 py-4 bg-black/80 overflow-hidden border border-montseny-blue text-white font-orbitron font-bold tracking-wider transition-all hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] backdrop-blur-md">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-montseny-blue/20 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
            <span className="relative flex items-center gap-2 z-10">
              <MessageSquare className="w-5 h-5 text-montseny-blue" /> TALK TO IAN
            </span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-montseny-green pointer-events-auto">
        <ArrowDown className="w-6 h-6 opacity-70" />
      </div>
    </section>
  );
};

export default Hero;
