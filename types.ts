export interface Project {
  id: string;
  title: string;
  category: 'XR' | 'AI' | 'Unity';
  description: string;
  imageUrl: string;
  techStack: string[];
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