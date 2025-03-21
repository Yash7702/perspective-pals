
// This file handles Hugging Face API interactions

// Get the Hugging Face API key from localStorage
export const getHuggingFaceKey = (): string => {
  return localStorage.getItem('huggingface_api_key') || '';
};

// Check if the Hugging Face API key is set
export const hasHuggingFaceKey = (): boolean => {
  return !!getHuggingFaceKey();
};

// Use this function to make requests to Hugging Face API
export const huggingFaceRequest = async (endpoint: string, data: any): Promise<any> => {
  const apiKey = getHuggingFaceKey();
  
  if (!apiKey) {
    throw new Error('Hugging Face API key is not set');
  }
  
  try {
    const response = await fetch(`https://api-inference.huggingface.co${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error making Hugging Face API request:', error);
    throw error;
  }
};
