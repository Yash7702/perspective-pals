
import { useState, useEffect, useCallback } from 'react';
import { Persona, findPersonaById } from '@/data/personas';
import { ConversationType, ConversationHistoryType, MessageType } from '@/types/conversation';
import { createNewConversation, createNewMessage } from '@/utils/conversationUtils';
import { loadConversationHistory, saveConversationHistory, saveConversation } from '@/services/conversationStorage';
import { generatePersonaResponses } from '@/services/aiResponseService';

// Use export type for re-exporting types when isolatedModules is enabled
export type { MessageType, ConversationType, ConversationHistoryType } from '@/types/conversation';

export const useConversation = (initialConversation?: ConversationType) => {
  const [conversation, setConversation] = useState<ConversationType>(
    initialConversation || createNewConversation()
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistoryType>(() => {
    return loadConversationHistory();
  });

  useEffect(() => {
    saveConversationHistory(conversationHistory);
  }, [conversationHistory]);

  useEffect(() => {
    if (conversation.id && conversation.messages.length > 0) {
      setConversationHistory(prev => saveConversation(conversation, prev));
    }
  }, [conversation]);

  const addMessage = useCallback((content: string, sender: 'user' | Persona) => {
    const newMessage = createNewMessage(content, sender);
    
    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      updatedAt: new Date()
    }));
    
    return newMessage;
  }, []);

  const generateAIResponses = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      await generatePersonaResponses(userMessage, conversation, selectedPersonas, addMessage);
    } finally {
      setIsLoading(false);
    }
    
    // Update conversation title if it's the first message
    if (conversation.title === 'New Conversation' && userMessage.length > 0) {
      const newTitle = userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '');
      setConversation(prev => ({
        ...prev,
        title: newTitle
      }));
    }
  }, [addMessage, selectedPersonas, conversation]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || selectedPersonas.length === 0) return;
    
    // Add user message
    addMessage(content, 'user');
    
    // Generate AI responses
    await generateAIResponses(content);
  }, [addMessage, generateAIResponses, selectedPersonas]);

  const togglePersona = useCallback((personaId: string) => {
    setSelectedPersonas(prev => {
      if (prev.includes(personaId)) {
        return prev.filter(id => id !== personaId);
      } else {
        return [...prev, personaId];
      }
    });
  }, []);

  const startNewConversation = useCallback(() => {
    const newConversation = createNewConversation();
    setConversation(newConversation);
    return newConversation;
  }, []);

  const loadConversation = useCallback((id: string) => {
    const savedConversation = conversationHistory[id];
    if (savedConversation) {
      setConversation(savedConversation);
      
      // Extract unique persona IDs from the conversation
      const personas = savedConversation.messages
        .filter(msg => msg.sender !== 'user')
        .map(msg => (msg.sender as Persona).id)
        .filter((value, index, self) => self.indexOf(value) === index);
      
      setSelectedPersonas(personas);
    }
  }, [conversationHistory]);

  return {
    conversation,
    messages: conversation.messages,
    isLoading,
    selectedPersonas,
    conversationHistory,
    sendMessage,
    togglePersona,
    startNewConversation,
    loadConversation
  };
};
