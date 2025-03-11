
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, Save, Check } from 'lucide-react';
import { setOpenAIKey, getOpenAIKey, hasOpenAIKey } from '@/utils/openai';
import { useToast } from '@/hooks/use-toast';

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is already set
    setIsSaved(hasOpenAIKey());
    
    // Get the key from storage for the input field
    if (hasOpenAIKey()) {
      setApiKey(getOpenAIKey());
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setOpenAIKey(apiKey.trim());
    setIsSaved(true);
    
    toast({
      title: "Success",
      description: "OpenAI API key saved successfully",
      variant: "default",
    });
  };

  return (
    <div className="w-full p-4 border rounded-lg bg-card mb-4">
      <div className="flex items-center gap-2 mb-2">
        <KeyRound className="h-5 w-5 text-primary" />
        <h3 className="font-medium">OpenAI API Key</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        Enter your OpenAI API key to get real AI-powered responses from each persona.
        Your key will be stored locally in your browser.
      </p>
      
      <div className="flex gap-2">
        <Input
          type={isVisible ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenAI API key (sk-...)"
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={() => setIsVisible(!isVisible)}
          className="px-3"
        >
          {isVisible ? "Hide" : "Show"}
        </Button>
        <Button onClick={handleSaveKey}>
          {isSaved ? <Check className="mr-1" /> : <Save className="mr-1" />}
          {isSaved ? "Saved" : "Save"}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Your API key is stored only in your browser's local storage and is never sent to our servers.
      </p>
    </div>
  );
};

export default ApiKeyInput;
