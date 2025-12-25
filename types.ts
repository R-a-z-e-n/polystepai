
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  GRAMMAR = 'GRAMMAR',
  VOCABULARY = 'VOCABULARY',
  WORKOUTS = 'WORKOUTS',
  CONVERSATION = 'CONVERSATION',
  CULTURE = 'CULTURE',
  COMMUNITY = 'COMMUNITY',
  OFFLINE = 'OFFLINE'
}

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  mastery: number; // 0 to 100
  lastReviewed: string;
  example: string;
}

export interface GrammarNote {
  topic: string;
  explanation: string;
  examples: string[];
}

export interface Exercise {
  id: string;
  type: 'translation' | 'composition' | 'cloze';
  content: string;
  instruction: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  timestamp: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
}
