import React, { useRef, useMemo } from 'react';
import { Cuboid, Brain, Glasses, Rocket } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- 3D Background for Services ---

function DigitalWaves() {
  const ref = useRef<THREE.Points>(null!);
  
  // Higher resolution grid for smoother waves
  const particles = useMemo(() => {
    const rows = 150; // Increased resolution
    const cols = 80;
    const count = rows * cols;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color('#0f291e'); // Dark Forest
    const color2 = new THREE.Color('#00f3ff'); // Cyan
    
    let i = 0;
    for (let xi = 0; xi < rows; xi++) {
        for (let zi = 0; zi < cols; zi++) {
            const x = (xi - rows / 2) * 0.8;
            const z = (zi - cols / 2) * 0.8;
            
            // Initial Flat plane
            positions[i * 3] = x;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = z;

            // Color gradient based on depth
            const mixedColor = color1.clone().lerp(color2, (zi / cols));
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
            
            i++;
        }
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    const count = particles.positions.length / 3;
    
    for(let i = 0; i < count; i++) {
        const x = particles.positions[i * 3];
        const z = particles.positions[i * 3 + 2];
        
        // Slow, rolling wave formula
        // y = sin(x) + cos(z) combination, but very slow time factor
        const y = Math.sin((x * 0.3) + (t * 0.5)) * 2 + Math.cos((z * 0.2) + (t * 0.3)) * 2;
        
        positions[i * 3 + 1] = y;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group rotation={[0.4, 0, 0]} position={[0, -5, -10]}>
      <Points ref={ref} positions={particles.positions} colors={particles.colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}


const Services: React.FC = () => {
  const services = [
    {
      icon: Cuboid,
      title: 'Advanced Unity Development',
      desc: 'Scalable software architecture for video games and industrial simulations.'
    },
    {
      icon: Brain,
      title: 'Generative AI Integration',
      desc: 'IAN (Cognitive Agents), intelligent NPCs, and procedural content generation.'
    },
    {
      icon: Glasses,
      title: 'Extended Reality (XR)',
      desc: 'Immersive experiences for Meta Quest, Vision Pro, and WebAR.'
    },
    {
      icon: Rocket,
      title: 'Strategic Gamification',
      desc: 'Transforming boring processes into addictive experiences.'
    }
  ];

  return (
    <section id="services" className="py-20 relative bg-black overflow-hidden">
      
      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0 opacity-50">
         <Canvas camera={{ position: [0, 10, 20], fov: 45 }}>
            <fog attach="fog" args={['#000000', 10, 50]} />
            <DigitalWaves />
         </Canvas>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-4xl text-white mb-4">TECHNOLOGICAL <span className="text-montseny-blue">MISSION</span></h2>
          <p className="font-rajdhani text-xl text-gray-400">Solutions that break the barrier between the physical and digital.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div key={i} className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border-t-2 border-transparent hover:border-montseny-green group bg-black/60 backdrop-blur-md">
              <div className="mb-6 bg-white/5 rounded-full w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <s.icon className="w-10 h-10 text-montseny-green group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-orbitron text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="font-rajdhani text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;