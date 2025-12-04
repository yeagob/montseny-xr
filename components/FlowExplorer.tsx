import React, { useState, useMemo } from 'react';
import { PROJECTS } from '../constants';
import { FilterCriteria, Importance, Category, Project } from '../types';
import { Clock, Layers, Star, GitBranch, RotateCcw, ArrowRight, Tag, Activity } from 'lucide-react';

// === PROJECT CARD COMPONENT ===
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const handleClick = () => {
    if (project.link && project.link !== '#') {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="group relative bg-black/60 rounded-xl overflow-hidden border border-white/10 hover:border-montseny-green/50 transition-all duration-300 hover:shadow-2xl hover:shadow-montseny-green/10 flex flex-col h-full cursor-pointer interactable"
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-montseny-green/10 z-10 group-hover:bg-transparent transition-all duration-500"></div>
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center px-3 py-1 text-xs font-mono bg-black/80 text-montseny-green border border-montseny-green/50 backdrop-blur-sm">
            {project.year}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-orbitron text-xl text-white group-hover:text-montseny-green transition-colors mb-3">
          {project.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.categories.map((cat) => (
            <span key={cat} className="inline-flex items-center text-xs text-montseny-blue bg-montseny-blue/10 px-2 py-1 border border-montseny-blue/30">
              <Tag size={10} className="mr-1" /> {cat}
            </span>
          ))}
          <span className={`inline-flex items-center text-xs px-2 py-1 border ${project.importance === Importance.TOP
            ? 'text-montseny-green bg-montseny-green/10 border-montseny-green/30'
            : project.importance === Importance.NORMAL
              ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
              : 'text-gray-400 bg-gray-400/10 border-gray-400/30'
            }`}>
            <Activity size={10} className="mr-1" /> {project.importance}
          </span>
        </div>

        <p className="font-rajdhani text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="flex flex-wrap gap-1">
            {project.techStack.slice(0, 4).map((tech, i) => (
              <span key={i} className="text-xs font-mono text-montseny-blue/70 bg-montseny-blue/5 px-2 py-0.5 border border-montseny-blue/10">
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-xs font-mono text-gray-500">+{project.techStack.length - 4}</span>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <div className="w-full flex items-center justify-between px-4 py-2 border border-montseny-green/30 text-montseny-green font-rajdhani text-sm group-hover:bg-montseny-green group-hover:text-black transition-all">
            <span>View Details</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

// === SELECTION NODE COMPONENT ===
const SelectionNode: React.FC<{
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ icon, label, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`
      interactable relative group flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-xl border-2 transition-all duration-300
      ${selected
        ? 'bg-montseny-green/10 border-montseny-green shadow-[0_0_30px_rgba(57,255,20,0.2)] scale-105'
        : 'bg-black/40 border-white/20 hover:border-montseny-green/50 hover:bg-black/60'
      }
    `}
  >
    <div className={`
      mb-3 p-3 rounded-full transition-colors duration-300
      ${selected ? 'bg-montseny-green text-black' : 'bg-black/60 text-gray-400 group-hover:text-montseny-green'}
    `}>
      {icon}
    </div>
    <span className={`font-rajdhani text-sm font-medium text-center px-2 ${selected ? 'text-montseny-green' : 'text-gray-400 group-hover:text-white'}`}>
      {label}
    </span>

    {/* Connector point bottom */}
    {selected && (
      <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-montseny-green rotate-45 border-b-2 border-r-2 border-montseny-dark"></div>
    )}
  </button>
);

// === GROUP BUTTON COMPONENT ===
const GroupButton: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      interactable min-w-[120px] px-4 py-2 font-rajdhani text-sm transition-all duration-300 border
      ${active
        ? 'bg-montseny-green text-black border-montseny-green shadow-[0_0_15px_rgba(57,255,20,0.3)]'
        : 'bg-black/40 text-gray-400 border-white/20 hover:border-montseny-green/50 hover:text-white'
      }
    `}
  >
    {label}
  </button>
);

// === MAIN FLOW EXPLORER COMPONENT ===
const FlowExplorer: React.FC = () => {
  const [activeCriteria, setActiveCriteria] = useState<FilterCriteria | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Get Groups based on Criteria
  const availableGroups = useMemo(() => {
    if (!activeCriteria) return [];

    const groups = new Set<string>();
    PROJECTS.forEach(p => {
      if (activeCriteria === 'chronological') {
        groups.add(String(p.sortYear));
      } else if (activeCriteria === 'category') {
        p.categories.forEach(c => groups.add(c));
      } else if (activeCriteria === 'importance') {
        groups.add(p.importance);
      }
    });

    // Sort logic
    return Array.from(groups).sort((a, b) => {
      if (activeCriteria === 'chronological') return Number(b) - Number(a); // Descending year
      if (activeCriteria === 'importance') {
        const order = [Importance.TOP, Importance.NORMAL, Importance.CASUAL];
        return order.indexOf(a as Importance) - order.indexOf(b as Importance);
      }
      return a.localeCompare(b);
    });
  }, [activeCriteria]);

  // Get Projects based on Selected Group
  const filteredProjects = useMemo(() => {
    if (!activeCriteria || !activeGroup) return [];

    const filtered = PROJECTS.filter(p => {
      if (activeCriteria === 'chronological') {
        return String(p.sortYear) === activeGroup;
      } else if (activeCriteria === 'category') {
        return p.categories.includes(activeGroup as Category);
      } else if (activeCriteria === 'importance') {
        return p.importance === activeGroup;
      }
      return false;
    });

    // Sort based on criteria
    return filtered.sort((a, b) => {
      if (activeCriteria === 'chronological' || activeCriteria === 'category') {
        // Sort by importance first (TOP > NORMAL > CASUAL)
        const importanceOrder = [Importance.TOP, Importance.NORMAL, Importance.CASUAL];
        const importanceCompare = importanceOrder.indexOf(a.importance) - importanceOrder.indexOf(b.importance);

        if (importanceCompare !== 0) {
          return importanceCompare;
        }

        // Then by date (most recent first)
        return b.sortYear - a.sortYear;
      } else if (activeCriteria === 'importance') {
        // Sort by date only (most recent first)
        return b.sortYear - a.sortYear;
      }
      return 0;
    });
  }, [activeCriteria, activeGroup]);

  // Handlers
  const handleCriteriaSelect = (criteria: FilterCriteria) => {
    if (activeCriteria === criteria) return;
    setActiveCriteria(criteria);
    setActiveGroup(null);
  };

  const handleGroupSelect = (group: string) => {
    setActiveGroup(group);
  };

  const resetFlow = () => {
    setActiveCriteria(null);
    setActiveGroup(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative">

      {/* Header & Reset */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-2 text-montseny-green opacity-80">
          <GitBranch size={20} />
          <span className="text-sm font-mono tracking-widest uppercase">Flow Explorer</span>
        </div>
        {(activeCriteria || activeGroup) && (
          <button
            onClick={resetFlow}
            className="interactable flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm px-3 py-1 border border-white/20 hover:bg-white/5"
          >
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>

      <div className="flex flex-col items-center">

        {/* Step 1: Root Question */}
        <div className="z-10 flex flex-col items-center w-full">
          <h3 className="font-orbitron text-xl md:text-2xl text-center mb-8 text-white">
            How do you want to explore?
          </h3>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <SelectionNode
              icon={<Clock size={20} />}
              label="Chronologically"
              selected={activeCriteria === 'chronological'}
              onClick={() => handleCriteriaSelect('chronological')}
            />
            <SelectionNode
              icon={<Layers size={20} />}
              label="By Category"
              selected={activeCriteria === 'category'}
              onClick={() => handleCriteriaSelect('category')}
            />
            <SelectionNode
              icon={<Star size={20} />}
              label="By Importance"
              selected={activeCriteria === 'importance'}
              onClick={() => handleCriteriaSelect('importance')}
            />
          </div>
        </div>

        {/* Step 2: Groups (Dynamic) */}
        <div className={`transition-all duration-500 overflow-hidden flex flex-col items-center w-full ${activeCriteria ? 'max-h-[1000px] opacity-100 mt-0' : 'max-h-0 opacity-0 -mt-4'}`}>
          {/* Connector Line */}
          <div className="w-0.5 h-8 mx-auto bg-montseny-green shadow-[0_0_10px_rgba(57,255,20,0.5)]" />

          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 w-full max-w-4xl mx-auto mt-2">
            <h4 className="text-center text-gray-400 mb-6 text-sm font-mono uppercase tracking-wider">
              {activeCriteria === 'chronological' && 'Select a Year'}
              {activeCriteria === 'category' && 'Select a Category'}
              {activeCriteria === 'importance' && 'Select Impact Level'}
            </h4>

            <div className="flex flex-wrap justify-center gap-3">
              {availableGroups.map((group) => (
                <GroupButton
                  key={group}
                  label={group}
                  active={activeGroup === group}
                  onClick={() => handleGroupSelect(group)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Results */}
        <div className={`transition-all duration-700 w-full ${activeGroup ? 'opacity-100 translate-y-0 mt-8' : 'opacity-0 translate-y-10 pointer-events-none mt-0 h-0'}`}>
          {activeGroup && (
            <div className="flex flex-col items-center w-full">
              {/* Connector Line */}
              <div className="w-0.5 h-8 bg-montseny-green shadow-[0_0_10px_rgba(57,255,20,0.5)] mb-8"></div>

              {/* Projects Grid/Scroll */}
              <div className="w-full overflow-x-auto pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-max md:min-w-0">
                  {filteredProjects.map((project, idx) => (
                    <div
                      key={project.id}
                      style={{ animationDelay: `${idx * 100}ms` }}
                      className="w-[320px] md:w-auto"
                    >
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-gray-500 text-center py-10 bg-black/30 rounded-xl w-full font-rajdhani">
                  No projects found for this filter.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FlowExplorer;
