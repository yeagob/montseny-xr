
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="font-orbitron text-3xl font-bold text-white mb-2">READY TO SCALE?</h2>
            <p className="font-rajdhani text-gray-400 text-lg">Let's transform your idea into an extended reality.</p>
          </div>
          
          <button 
            onClick={onStartGame}
            className="px-8 py-4 bg-montseny-green text-black font-orbitron font-bold rounded hover:bg-white hover:shadow-[0_0_30px_rgba(108,194,74,0.6)] transition-all duration-300"
          >
            START PROJECT
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12">
          <div>
             <span className="font-orbitron text-xl font-bold text-white block mb-4">
              MONTSENY <span className="text-montseny-green">XR</span>
            </span>
            <p className="text-gray-500 font-rajdhani">
              Extreme innovation in design and development.<br/>
              Barcelona, Spain.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
             <h4 className="font-orbitron text-white font-bold mb-2">LINKS</h4>
             <button
                onClick={onStartGame}
                className="flex items-center gap-2 text-montseny-green hover:text-white transition-colors text-left font-orbitron font-bold"
             >
                <Play className="w-4 h-4" /> PLAY
             </button>
             <a href="#hero" className="text-gray-400 hover:text-montseny-green">Home</a>
             <a href="#services" className="text-gray-400 hover:text-montseny-green">Services</a>
             <a href="#ian" className="text-gray-400 hover:text-montseny-blue">IAN (Chat)</a>
             <a href="#portfolio" className="text-gray-400 hover:text-montseny-green">Projects</a>
          </div>

          <div>
             <h4 className="font-orbitron text-white font-bold mb-4">CONNECT</h4>
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
                   href="mailto:info@xr-dreams.com"
                   className="text-montseny-green hover:text-white font-mono text-sm transition-colors"
                 >
                   info@xr-dreams.com
                 </a>
               </div>
             )}
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600 font-rajdhani text-sm">
          &copy; {new Date().getFullYear()} Montseny XR. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Contact;
