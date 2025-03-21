
// This file handles Hugging Face API interactions

// Default API key to use if none is set by the user
// This is a publishable key that can be included in the codebase
const DEFAULT_API_KEY = "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";

// Get the Hugging Face API key from localStorage or use the default
export const getHuggingFaceKey = (): string => {
  return localStorage.getItem('huggingface_api_key') || DEFAULT_API_KEY;
};

// Set the Hugging Face API key in localStorage
export const setHuggingFaceKey = (key: string): void => {
  localStorage.setItem('huggingface_api_key', key);
};

// Check if the Hugging Face API key is set
export const hasHuggingFaceKey = (): boolean => {
  return !!getHuggingFaceKey();
};

// Use this function to make requests to Hugging Face API
export const huggingFaceRequest = async (endpoint: string, data: any): Promise<any> => {
  const apiKey = getHuggingFaceKey();
  
  try {
    console.log(`Making request to Hugging Face API: ${endpoint}`);
    const response = await fetch(`https://api-inference.huggingface.co${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error response:', errorText);
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error making Hugging Face API request:', error);
    throw error;
  }
};

// Example function to test the API connection
export const testHuggingFaceConnection = async (): Promise<boolean> => {
  try {
    // Simple text generation to test the connection
    await huggingFaceRequest('/models/gpt2/completions', {
      inputs: 'Hello, I am a',
      parameters: {
        max_new_tokens: 5
      }
    });
    return true;
  } catch (error) {
    console.error('Failed to connect to Hugging Face API:', error);
    return false;
  }
};
