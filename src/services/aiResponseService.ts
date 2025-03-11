
import { ConversationType } from '@/types/conversation';
import { Persona, findPersonaById } from '@/data/personas';
import { generateAIResponse, hasOpenAIKey } from '@/utils/openai';
import { prepareConversationContext } from '@/utils/conversationUtils';

export const generatePersonaResponses = async (
  userMessage: string,
  conversation: ConversationType,
  selectedPersonas: string[],
  addMessage: (content: string, sender: 'user' | Persona) => void
): Promise<void> => {
  // Check if OpenAI API key is set
  if (!hasOpenAIKey()) {
    addMessage(
      "Error: OpenAI API key is not set. Please set your API key in the input field below.",
      findPersonaById(selectedPersonas[0])
    );
    return;
  }
  
  try {
    // Generate responses from selected personas
    for (const personaId of selectedPersonas) {
      const persona = findPersonaById(personaId);
      
      // Get conversation context
      const conversationContext = prepareConversationContext(conversation.messages, personaId);
      
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
  }
};
