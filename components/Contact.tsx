
import React, { useState } from 'react';
import { Mail, Github, Linkedin, Twitter, Play } from 'lucide-react';

interface ContactProps {
    onStartGame: () => void;
}

const Contact: React.FC<ContactProps> = ({ onStartGame }) => {
  const [showEmail, setShowEmail] = useState(false);
  return (
    <footer id="contact" className="bg-montseny-forest/20 border-t border-montseny-green/20 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* Personal closing — a quiet line, not a sales pitch */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="font-orbitron text-2xl md:text-3xl text-white mb-3">
            Currently at <span className="text-montseny-green">Product Madness</span>, tinkering with IANs after hours.
          </h2>
          <p className="font-rajdhani text-gray-400 text-lg">
            If any of this resonates — a project, a question, an excuse to talk about persistent agents or contact improvisation — the inbox is open.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12">
          <div>
             <span className="font-orbitron text-xl font-bold text-white block mb-4">
              SANTIAGO <span className="text-montseny-green">DOPAZO</span>
            </span>
            <p className="text-gray-500 font-rajdhani">
              XR &amp; AI engineer, twenty-plus years in.<br/>
              Sant Esteve de Palautordera, at the foot of the Montseny.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
             <h4 className="font-orbitron text-white font-bold mb-2">EXPLORE</h4>
             <a href="#hero" className="text-gray-400 hover:text-montseny-green">Home</a>
             <a href="#portfolio" className="text-gray-400 hover:text-montseny-green">Projects</a>
             <a href="#ian" className="text-gray-400 hover:text-montseny-blue">Talk to IAN</a>
             <a href="#about" className="text-gray-400 hover:text-montseny-green">Territory</a>
             <button
                onClick={onStartGame}
                className="flex items-center gap-2 text-montseny-green hover:text-white transition-colors text-left font-orbitron font-bold"
             >
                <Play className="w-4 h-4" /> Easter egg
             </button>
          </div>

          <div>
             <h4 className="font-orbitron text-white font-bold mb-4">REACH OUT</h4>
             <div className="flex space-x-4 items-center">
               <a href="https://github.com/yeagob" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-125 transition-transform"><Github /></a>
               <a href="https://www.linkedin.com/in/santiago-gamelover/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 hover:scale-125 transition-transform"><Linkedin /></a>
               <a href="https://x.com/SantiGameLover" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-400 hover:scale-125 transition-transform"><Twitter /></a>
               <button
                  onClick={() => setShowEmail(!showEmail)}
                  className="text-gray-400 hover:text-red-400 hover:scale-125 transition-transform"
               >
                  <Mail />
               </button>
             </div>
             {showEmail && (
               <div className="mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <a
                   href="mailto:santiago@xr-dreams.com"
                   className="text-montseny-green hover:text-white font-mono text-sm transition-colors"
                 >
                   santiago@xr-dreams.com
                 </a>
               </div>
             )}
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600 font-rajdhani text-sm">
          &copy; {new Date().getFullYear()} Santiago Dopazo. Built with code, forest air and a stubborn octopus.
        </div>
      </div>
    </footer>
  );
};

export default Contact;
