import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { ExternalLink, Code, Layers } from 'lucide-react';

const projects: Project[] = [
  {
    id: '1',
    title: 'XR DREAMS MUSEUM',
    category: 'XR',
    description: 'Galería de arte inmersiva multi-usuario. Renderizado de alta fidelidad en WebGL.',
    imageUrl: 'https://picsum.photos/seed/xr1/800/600',
    techStack: ['Unity 3D', 'WebGL', 'Photon PUN', 'ShaderGraph'],
  },
  {
    id: '2',
    title: 'NEURAL NPC TRAINER',
    category: 'AI',
    description: 'Simulación de entrenamiento corporativo con Agentes Cognitivos que aprenden del usuario.',
    imageUrl: 'https://picsum.photos/seed/ai2/800/600',
    techStack: ['Python', 'Gemini API', 'Unity Sentis', 'NLP'],
  },
  {
    id: '3',
    title: 'FACTORY DIGITAL TWIN',
    category: 'Unity',
    description: 'Gemelo digital IoT para monitoreo industrial con superposición AR en tiempo real.',
    imageUrl: 'https://picsum.photos/seed/ind3/800/600',
    techStack: ['ARFoundation', 'MQTT', 'Azure Digital Twins'],
  },
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glow, setGlow] = useState({ x: 50, y: 50 });
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Rotate X based on Y position
      const rotateY = ((x - centerX) / centerX) * 10; // Rotate Y based on X position
  
      setRotate({ x: rotateX, y: rotateY });
      setGlow({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    };
  
    const handleMouseLeave = () => {
      setRotate({ x: 0, y: 0 });
    };
  
    return (
      <div 
        className="perspective-1000 w-full h-[500px] interactable"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          ref={cardRef}
          className="relative w-full h-full transition-all duration-100 ease-out transform-style-3d group rounded-xl border border-white/10 bg-black/40 backdrop-blur-md"
          style={{ 
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          }}
        >
            {/* Holographic Sheen */}
            <div 
                className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl mix-blend-overlay"
                style={{
                    background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.2), transparent 50%)`
                }}
            />

            {/* Content Layer (Lifted in Z-Space) */}
            <div className="absolute inset-0 flex flex-col overflow-hidden rounded-xl">
                {/* Image */}
                <div className="h-1/2 overflow-hidden relative">
                    <div className="absolute inset-0 bg-montseny-green/10 z-10 group-hover:bg-transparent transition-all duration-500"></div>
                    <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Tech Tag */}
                    <div className="absolute top-4 right-4 z-20 bg-black/80 border border-montseny-green text-montseny-green px-3 py-1 rounded-none skew-x-[-10deg] shadow-[0_0_10px_rgba(57,255,20,0.3)]">
                        <span className="font-rajdhani font-bold skew-x-[10deg] block">{project.category}</span>
                    </div>
                </div>

                {/* Text Details */}
                <div className="h-1/2 p-6 bg-gradient-to-b from-black/80 to-black/95 flex flex-col justify-between border-t border-white/5">
                    <div>
                        <h3 className="font-orbitron text-2xl text-white mb-2 group-hover:text-montseny-green transition-colors translate-z-10">
                            {project.title}
                        </h3>
                        <p className="font-rajdhani text-gray-400 text-lg leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech, i) => (
                                <span key={i} className="text-xs font-mono text-montseny-blue bg-montseny-blue/10 px-2 py-1 border border-montseny-blue/20 rounded">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <a href="#" className="flex items-center justify-between w-full py-3 px-4 bg-white/5 hover:bg-montseny-green/20 border border-white/10 hover:border-montseny-green text-white hover:text-montseny-green transition-all group/btn">
                            <span className="font-orbitron text-sm font-bold">VER CASO DE ESTUDIO</span>
                            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  };

const Projects: React.FC = () => {
  return (
    <section id="portfolio" className="py-32 bg-montseny-dark relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-montseny-dark to-transparent z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div>
                <h2 className="font-orbitron text-5xl md:text-7xl font-black text-white mb-2 tracking-tight">
                    PROYECTOS
                </h2>
                <p className="font-rajdhani text-montseny-green text-xl md:text-2xl tracking-widest uppercase">
                    Innovación Desplegada
                </p>
            </div>
            <div className="hidden md:block pb-4">
                <div className="flex items-center gap-2 text-gray-500 font-mono text-sm">
                    <Layers className="w-4 h-4" /> 
                    <span>3D INTERACTIVE MODULES LOADED</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;