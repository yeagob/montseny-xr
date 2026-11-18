
import React from 'react';
import { PlayCircle } from 'lucide-react';

const SotanoGame: React.FC = () => {
  return (
    <section id="sotano-game" className="relative w-full py-8 flex items-center justify-center bg-montseny-dark">
      <a
        href="https://sotano-yeagobs-projects.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="interactable group relative block w-full max-w-4xl mx-auto mt-[60px] overflow-hidden rounded-xl border border-montseny-green/30 hover:border-montseny-green/80 transition-all hover:shadow-[0_0_40px_rgba(57,255,20,0.3)]"
      >
        {/* Neon glow overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-montseny-green/0 via-montseny-green/5 to-montseny-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center gap-3 px-6 py-3 bg-black/80 backdrop-blur-md rounded-full border border-montseny-green/50">
            <PlayCircle className="w-6 h-6 text-montseny-green" />
            <span className="font-orbitron font-bold text-montseny-green tracking-wider text-sm">PLAY NOW</span>
          </div>
        </div>

        {/* Game cover image */}
        <img
          src="https://sotano-yeagobs-projects.vercel.app/the-roots-cover.jpg"
          alt="The Roots - Sotano Game"
          className="w-full h-auto object-cover"
        />

        {/* Bottom label */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-12">
          <p className="font-orbitron text-white text-sm md:text-base tracking-wider text-center">
            <span className="text-montseny-green">THE ROOTS</span> — Interactive Experience
          </p>
        </div>
      </a>
    </section>
  );
};

export default SotanoGame;
