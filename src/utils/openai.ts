
import { Persona } from "@/data/personas";

// This should be provided by the user in a secure way, not hardcoded
// We'll use localStorage temporarily, but in production, you should use environment variables
// or a server-side approach
let apiKey = localStorage.getItem('openai_api_key') || '';

export const setOpenAIKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('openai_api_key', key);
};

export const getOpenAIKey = () => {
  return apiKey;
};

export const hasOpenAIKey = () => {
  return !!apiKey;
};

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

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

export const generateAIResponse = async (
  persona: Persona,
  userMessage: string,
  conversationHistory: OpenAIMessage[] = []
): Promise<string> => {
  if (!apiKey) {
    return "Error: OpenAI API key is not set. Please set your API key in the settings.";
  }

  try {
    const systemMessage = getSystemMessageForPersona(persona);
    
    const messages: OpenAIMessage[] = [
      { role: 'system', content: systemMessage },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API Error:", error);
      return `Error: ${error.error?.message || 'Failed to get response from OpenAI'}`;
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Sorry, I couldn't generate a response at this time. Please try again later.";
  }
};
