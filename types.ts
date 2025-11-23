
export interface Project {
  id: string;
  title: string;
  category: 'XR' | 'AI' | 'Unity' | 'Web';
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
