import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Services from './components/Services';
import NeuralInterface from './components/NeuralInterface';
import Contact from './components/Contact';

function App() {
  
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
    <div className="bg-montseny-dark min-h-screen selection:bg-montseny-green selection:text-black">
      <Header />
      <main>
        <Hero />
        <NeuralInterface />
        <Projects />
        <Services />
      </main>
      <Contact />
    </div>
  );
}

export default App;