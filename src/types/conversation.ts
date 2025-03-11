
import { Persona } from '@/data/personas';

export type MessageType = {
  id: string;
  content: string;
  sender: 'user' | Persona;
  timestamp: Date;
};

export type ConversationType = {
  id: string;
  title: string;
  messages: MessageType[];
  createdAt: Date;
  updatedAt: Date;
};

export type ConversationHistoryType = {
  [id: string]: ConversationType;
};
