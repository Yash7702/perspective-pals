
import { MessageType } from '@/types/conversation';

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const createNewConversation = () => ({
  id: generateId(),
  title: 'New Conversation',
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const createNewMessage = (content: string, sender: 'user' | any): MessageType => ({
  id: generateId(),
  content,
  sender,
  timestamp: new Date(),
});

export const extractPersonasFromMessages = (messages: MessageType[]): string[] => {
  return messages
    .filter(msg => msg.sender !== 'user')
    .map(msg => (msg.sender as any).id)
    .filter((value, index, self) => self.indexOf(value) === index);
};

export const prepareConversationContext = (messages: MessageType[], personaId: string) => {
  // Get context from previous messages by the same persona
  const personaMessages = messages
    .filter(msg => msg.sender !== 'user' && typeof msg.sender !== 'string' && (msg.sender as any).id === personaId)
    .slice(-3) // Last 3 messages from this persona
    .map(msg => ({
      role: 'assistant' as const,
      content: msg.content
    }));
  
  // Get last few user messages for context
  const userMessages = messages
    .filter(msg => msg.sender === 'user')
    .slice(-3) // Last 3 user messages
    .map(msg => ({
      role: 'user' as const,
      content: msg.content
    }));
  
  // Combine for conversation history
  return [...userMessages, ...personaMessages].sort((a, b) => {
    const aIndex = messages.findIndex(msg => 
      msg.content === a.content && 
      ((a.role === 'user' && msg.sender === 'user') || 
       (a.role === 'assistant' && msg.sender !== 'user'))
    );
    const bIndex = messages.findIndex(msg => 
      msg.content === b.content && 
      ((b.role === 'user' && msg.sender === 'user') || 
       (b.role === 'assistant' && msg.sender !== 'user'))
    );
    return aIndex - bIndex;
  });
};
