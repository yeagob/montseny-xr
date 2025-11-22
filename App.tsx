
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Services from './components/Services';
import NeuralInterface from './components/NeuralInterface';
import Contact from './components/Contact';
import VoxelGame from './components/VoxelGame';

function App() {
  const [isGameMode, setIsGameMode] = useState(false);

  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href')?.substring(1);
        const targetElement = document.getElementById(targetId || '');
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <>
      {isGameMode ? (
        <VoxelGame onClose={() => setIsGameMode(false)} />
      ) : (
        <div className="bg-montseny-dark min-h-screen selection:bg-montseny-green selection:text-black">
          <Header onStartGame={() => setIsGameMode(true)} />
          <main>
            <Hero onStartGame={() => setIsGameMode(true)} />
            <Services />
            <NeuralInterface />
            <Projects />
          </main>
          <Contact onStartGame={() => setIsGameMode(true)} />
        </div>
      )}
    </>
  );
}

export default App;
