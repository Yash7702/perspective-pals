
import { useState, useEffect, useCallback } from 'react';
import { Persona, findPersonaById } from '@/data/personas';

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

const mockResponses = {
  rational: [
    "Based on the available facts, I must analyze this objectively. The evidence suggests that...",
    "From a logical standpoint, we should consider the following factors...",
    "The data points to several rational conclusions. First, we must consider...",
    "Let's break this down systematically and examine each component...",
    "When we analyze this situation objectively, the most reasonable approach would be..."
  ],
  empath: [
    "I'm sensing that this situation has deep emotional implications. People might feel...",
    "The human impact here cannot be overlooked. Many would experience...",
    "This could be emotionally challenging for those involved because...",
    "From a compassionate perspective, we need to consider how this affects...",
    "The emotional wellbeing of everyone involved is paramount. Let's consider..."
  ],
  traditionalist: [
    "Traditional wisdom offers clear guidance here. Our established principles suggest...",
    "History has shown us that in similar situations, the proper approach is to...",
    "The time-tested rules for handling this type of situation indicate that...",
    "From a principled standpoint, there are certain standards we must uphold...",
    "Our foundational values would guide us to approach this by..."
  ],
  freethinker: [
    "What if we looked at this from an entirely new angle? Consider the possibility that...",
    "The conventional approach might not be optimal here. Instead, we could explore...",
    "Let's challenge our assumptions and consider some creative alternatives...",
    "I see an opportunity for innovation here. What if we tried...",
    "Breaking from tradition might yield better results. We could attempt..."
  ],
  strategist: [
    "Let's focus on action and results. The most effective strategy would be to...",
    "To achieve the optimal outcome, I recommend taking these decisive steps...",
    "This situation calls for bold action. I suggest immediately...",
    "Looking at the end goal, the most direct path to success is...",
    "Let's not overthink this. The winning move is clearly to..."
  ]
};

const getRandomResponse = (personaId: string) => {
  const responses = mockResponses[personaId as keyof typeof mockResponses];
  return responses[Math.floor(Math.random() * responses.length)];
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useConversation = (initialConversation?: ConversationType) => {
  const [conversation, setConversation] = useState<ConversationType>(
    initialConversation || {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistoryType>(() => {
    const saved = localStorage.getItem('conversationHistory');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
  }, [conversationHistory]);

  useEffect(() => {
    if (conversation.id && conversation.messages.length > 0) {
      setConversationHistory(prev => ({
        ...prev,
        [conversation.id]: {
          ...conversation,
          updatedAt: new Date()
        }
      }));
    }
  }, [conversation]);

  const addMessage = useCallback((content: string, sender: 'user' | Persona) => {
    const newMessage = {
      id: generateId(),
      content,
      sender,
      timestamp: new Date(),
    };
    
    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      updatedAt: new Date()
    }));
    
    return newMessage;
  }, []);

  const generateAIResponses = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    
    // Add a small delay to simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate responses from selected personas
    for (const personaId of selectedPersonas) {
      const delay = 800 + Math.random() * 1200; // Random delay between 800ms and 2000ms
      await new Promise(resolve => setTimeout(resolve, delay));
      
      const persona = findPersonaById(personaId);
      const aiResponse = getRandomResponse(personaId);
      addMessage(aiResponse, persona);
    }
    
    setIsLoading(false);
    
    // Update conversation title if it's the first message
    if (conversation.title === 'New Conversation' && userMessage.length > 0) {
      const newTitle = userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '');
      setConversation(prev => ({
        ...prev,
        title: newTitle
      }));
    }
  }, [addMessage, selectedPersonas, conversation.title]);

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
    const newConversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
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
