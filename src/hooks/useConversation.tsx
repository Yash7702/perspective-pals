
import { useState, useEffect, useCallback } from 'react';
import { Persona, findPersonaById } from '@/data/personas';
import { generateAIResponse, hasOpenAIKey } from '@/utils/openai';

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
    
    // Check if OpenAI API key is set
    if (!hasOpenAIKey()) {
      addMessage(
        "Error: OpenAI API key is not set. Please set your API key in the input field below.",
        findPersonaById(selectedPersonas[0])
      );
      setIsLoading(false);
      return;
    }
    
    try {
      // Generate responses from selected personas
      for (const personaId of selectedPersonas) {
        const persona = findPersonaById(personaId);
        
        // Get context from previous messages by the same persona
        const personaMessages = conversation.messages
          .filter(msg => msg.sender !== 'user' && typeof msg.sender !== 'string' && msg.sender.id === personaId)
          .slice(-3) // Last 3 messages from this persona
          .map(msg => ({
            role: 'assistant' as const,
            content: msg.content
          }));
        
        // Get last few user messages for context
        const userMessages = conversation.messages
          .filter(msg => msg.sender === 'user')
          .slice(-3) // Last 3 user messages
          .map(msg => ({
            role: 'user' as const,
            content: msg.content
          }));
        
        // Combine for conversation history
        const conversationContext = [...userMessages, ...personaMessages].sort((a, b) => {
          const aIndex = conversation.messages.findIndex(msg => 
            msg.content === a.content && 
            ((a.role === 'user' && msg.sender === 'user') || 
             (a.role === 'assistant' && msg.sender !== 'user'))
          );
          const bIndex = conversation.messages.findIndex(msg => 
            msg.content === b.content && 
            ((b.role === 'user' && msg.sender === 'user') || 
             (b.role === 'assistant' && msg.sender !== 'user'))
          );
          return aIndex - bIndex;
        });
        
        // Add a small delay to simulate natural conversation timing
        if (selectedPersonas.indexOf(personaId) > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        }
        
        // Call the OpenAI API
        const aiResponse = await generateAIResponse(persona, userMessage, conversationContext);
        addMessage(aiResponse, persona);
      }
    } catch (error) {
      console.error("Error generating AI responses:", error);
      addMessage(
        "Sorry, I encountered an error while generating responses. Please try again later.",
        findPersonaById(selectedPersonas[0])
      );
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
