
import { ConversationHistoryType, ConversationType } from '@/types/conversation';

export const loadConversationHistory = (): ConversationHistoryType => {
  const saved = localStorage.getItem('conversationHistory');
  return saved ? JSON.parse(saved) : {};
};

export const saveConversationHistory = (history: ConversationHistoryType): void => {
  localStorage.setItem('conversationHistory', JSON.stringify(history));
};

export const saveConversation = (
  conversation: ConversationType, 
  history: ConversationHistoryType
): ConversationHistoryType => {
  if (conversation.id && conversation.messages.length > 0) {
    return {
      ...history,
      [conversation.id]: {
        ...conversation,
        updatedAt: new Date()
      }
    };
  }
  return history;
};
