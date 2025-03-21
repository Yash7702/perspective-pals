
import { ConversationType } from '@/types/conversation';
import { Persona, findPersonaById } from '@/data/personas';
import { prepareConversationContext } from '@/utils/conversationUtils';
import { huggingFaceRequest, hasHuggingFaceKey } from '@/utils/huggingface';

export const generatePersonaResponses = async (
  userMessage: string,
  conversation: ConversationType,
  selectedPersonas: string[],
  addMessage: (content: string, sender: 'user' | Persona) => void
): Promise<void> => {
  // Check if Hugging Face API key is set
  if (!hasHuggingFaceKey()) {
    addMessage(
      "Error: Hugging Face API key is not set. Please set your API key in the settings.",
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
      
      // Call the Hugging Face API
      try {
        const response = await generateAIResponse(persona, userMessage, conversationContext);
        addMessage(response, persona);
      } catch (error) {
        console.error(`Error generating response for ${persona.name}:`, error);
        addMessage(
          `I'm sorry, I couldn't generate a response as ${persona.name}. Please try again later.`,
          persona
        );
      }
    }
  } catch (error) {
    console.error("Error generating AI responses:", error);
    addMessage(
      "Sorry, I encountered an error while generating responses. Please try again later.",
      findPersonaById(selectedPersonas[0])
    );
  }
};

// Get system message for persona
const getSystemMessageForPersona = (persona: Persona): string => {
  switch (persona.id) {
    case 'rational':
      return "You are The Rational Analyst. You focus on facts, logic, and objective analysis. You approach every situation with a clear, analytical mindset, prioritizing data and evidence over emotions or traditions. You communicate in a structured, straightforward manner, often citing relevant information. You value critical thinking, skepticism of unproven claims, and reaching conclusions based on verifiable facts.";
    
    case 'empath':
      return "You are The Emotional Empath. You prioritize understanding people's feelings and experiences. You approach every situation with compassion and emotional intelligence, seeking to understand the human impact. You communicate with warmth, empathy, and validate feelings. You value emotional well-being, human connection, and making sure everyone feels heard and understood.";
    
    case 'traditionalist':
      return "You are The Strict Traditionalist. You value established principles, rules, and proven methods. You approach situations by applying traditional values, established norms, and time-tested approaches. You communicate with references to principles, precedents, and proper procedures. You value order, respect for established systems, moral clarity, and consistency with historical wisdom.";
    
    case 'freethinker':
      return "You are The Free Thinker. You challenge conventional thinking and explore novel possibilities. You approach every situation by questioning assumptions and considering alternatives that others might overlook. You communicate in a creative, sometimes provocative way that encourages others to think differently. You value innovation, intellectual freedom, breaking from outdated paradigms, and finding unexpected solutions.";
    
    case 'strategist':
      return "You are The Brave Strategist. You focus on action, results, and strategic advantage. You approach every situation by assessing risks, opportunities, and pathways to success. You communicate confidently, with a focus on clear objectives and decisive action. You value courage, decisiveness, calculated risk-taking, and achieving tangible outcomes. You prefer bold action over excessive deliberation.";
    
    default:
      return "You are a helpful AI assistant.";
  }
};

// Generate AI response using Hugging Face
const generateAIResponse = async (
  persona: Persona,
  userMessage: string,
  conversationHistory: any[] = []
): Promise<string> => {
  try {
    // Using the text-generation endpoint with a suitable model
    const systemPrompt = getSystemMessageForPersona(persona);
    
    // Build the prompt with context
    let fullPrompt = `${systemPrompt}\n\n`;
    
    // Add conversation history if any
    if (conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        if (msg.role === 'user') {
          fullPrompt += `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          fullPrompt += `${msg.role === 'system' ? 'System' : persona.title}: ${msg.content}\n`;
        }
      }
    }
    
    // Add the current user message
    fullPrompt += `User: ${userMessage}\n${persona.title}:`;
    
    // Make the API request
    const response = await huggingFaceRequest('/models/mistralai/Mistral-7B-Instruct-v0.2', {
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false
      }
    });
    
    // Extract the generated text
    let generatedText = response[0]?.generated_text || '';
    
    // Clean up the response if needed
    if (generatedText.includes(`${persona.title}:`)) {
      generatedText = generatedText.split(`${persona.title}:`)[1].trim();
    }
    if (generatedText.includes('User:')) {
      generatedText = generatedText.split('User:')[0].trim();
    }
    
    return generatedText || "I'm sorry, I couldn't generate a proper response. Please try again.";
  } catch (error) {
    console.error("Error in generateAIResponse:", error);
    throw error;
  }
};
