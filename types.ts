// Project Categories
export enum Category {
  EXTENDED_REALITY = 'Extended Reality',
  ARTIFICIAL_INTELLIGENCE = 'AI',
  VIDEOGAMES = 'Videogames',
  SIMULATION = 'Simulation'
}

// Project Importance Levels
export enum Importance {
  TOP = 'Top',
  NORMAL = 'Standard',
  CASUAL = 'Personal'
}

// Filter Criteria for Flow Explorer
export type FilterCriteria = 'chronological' | 'category' | 'importance';

export interface Project {
  id: string;
  title: string;
  categories: Category[];
  importance: Importance;
  year: string;
  sortYear: number;
  description: string;
  imageUrl: string;
  techStack: string[];
  link?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum InteractionState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  THINKING = 'THINKING',
  SPEAKING = 'SPEAKING'
}

export interface BlockType {
  id: string;
  name: string;
  description: string;
  color: string;
  type: 'resource' | 'placed';
}

export interface VoxelBlock {
  id: string;
  typeId: string;
  position: [number, number, number];
}
