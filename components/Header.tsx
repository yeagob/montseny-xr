
import React, { useState, useEffect } from 'react';
import { Menu, X, Play } from 'lucide-react';

interface HeaderProps {
  onStartGame: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartGame }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Projects', href: '#portfolio' },
    { name: 'Services', href: '#services' },
    { name: 'IAN', href: '#ian' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel py-2' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo Area */}
          <div className="flex items-center">
            <div className="relative group cursor-pointer">
               <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(108,194,74,0.5)] group-hover:shadow-[0_0_25px_rgba(108,194,74,0.8)] transition-all duration-300 overflow-hidden border border-montseny-green">
                    <img src="/images/logo.png" alt="Montseny XR Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-orbitron text-2xl font-bold tracking-wider text-white">
                    MONTSENY <span className="text-montseny-green">XR</span>
                  </span>
               </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={onStartGame}
              className="flex items-center gap-2 font-orbitron font-bold text-montseny-green hover:text-white transition-colors"
            >
              <Play className="w-4 h-4" /> PLAY
            </button>
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="font-rajdhani font-bold text-lg text-gray-300 hover:text-montseny-green transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-montseny-green transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <a href="#contact" className="px-6 py-2 bg-transparent border border-montseny-green text-montseny-green font-orbitron font-bold rounded hover:bg-montseny-green hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(108,194,74,0.2)] hover:shadow-[0_0_20px_rgba(108,194,74,0.6)]">
              CONTACT
            </a>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              {isOpen ? <X className="w-8 h-8 text-montseny-green" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel absolute w-full top-full left-0 border-t border-gray-800">
          <div className="px-4 pt-2 pb-6 space-y-2">
             <button 
                onClick={() => {
                    onStartGame();
                    setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-4 font-orbitron text-base font-medium text-montseny-green hover:bg-white/5 rounded-md"
             >
                PLAY SIMULATION
             </button>
             {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 font-orbitron text-base font-medium text-white hover:text-montseny-green hover:bg-white/5 rounded-md"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
