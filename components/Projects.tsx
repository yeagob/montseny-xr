import React from 'react';
import { GitBranch } from 'lucide-react';
import FlowExplorer from './FlowExplorer';
import { PROJECTS } from '../constants';

const Projects: React.FC = () => {
  return (
    <section id="portfolio" className="py-32 bg-montseny-dark relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-montseny-dark to-transparent z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
                <h2 className="font-orbitron text-5xl md:text-7xl font-black text-white mb-2 tracking-tight">
                    PROJECTS
                </h2>
                <p className="font-rajdhani text-montseny-green text-xl md:text-2xl tracking-widest uppercase">
                    EXPLORE MY WORK
                </p>
            </div>
            <div className="hidden md:block pb-4">
                <div className="flex items-center gap-2 text-gray-500 font-mono text-sm">
                    <GitBranch className="w-4 h-4" />
                    <span>{PROJECTS.length} PROJECTS AVAILABLE</span>
                </div>
            </div>
        </div>

        {/* Flow Chart Explorer */}
        <FlowExplorer />
      </div>
    </section>
  );
};

export default Projects;