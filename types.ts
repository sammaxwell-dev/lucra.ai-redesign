export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  date: string; // e.g., "Today", "Yesterday"
}

export enum ViewState {
  HOME = 'HOME',
  CHATS = 'CHATS',
  FILES = 'FILES'
}