export type CoachMessageRole = 'user' | 'assistant' | 'system';

export interface CoachMessage {
  id: string;
  role: CoachMessageRole;
  content: string;
  timestamp: number;
}

export interface CoachConversation {
  id: string;
  messages: CoachMessage[];
  createdAt: number;
  topic?: string;
}

export type CoachTone = 'warm' | 'motivating' | 'analytical' | 'gentle';

export interface CoachPersona {
  name: string;
  tone: CoachTone;
  emoji: string;
  systemPrompt: string;
}
