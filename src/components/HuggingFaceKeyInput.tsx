
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Save, Edit, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getHuggingFaceKey, setHuggingFaceKey } from '@/utils/huggingface';

const HuggingFaceKeyInput = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is already set
    const hasKey = getHuggingFaceKey() !== '';
    setIsSaved(hasKey);
    
    // If key exists but we're not in editing mode, mask it
    if (hasKey && !isEditing) {
      setApiKey('•'.repeat(16)); // Mask the key with dots
    } else if (hasKey && isEditing) {
      // If we're editing, show the actual key
      setApiKey(getHuggingFaceKey());
    }
  }, [isEditing]);

  const handleSaveKey = () => {
    if (!apiKey.trim() || apiKey === '•'.repeat(16)) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setHuggingFaceKey(apiKey.trim());
    setIsSaved(true);
    setIsEditing(false);
    
    toast({
      title: "Success",
      description: "Hugging Face API key saved successfully",
      variant: "default",
    });
  };

  const handleEditKey = () => {
    setIsEditing(true);
    const savedKey = getHuggingFaceKey();
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setApiKey('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (getHuggingFaceKey()) {
      setApiKey('•'.repeat(16));
    } else {
      setApiKey('');
    }
  };

  return (
    <div className="w-full p-4 border rounded-lg bg-card mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Hugging Face API Key</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        Enter your Hugging Face API key to use advanced AI features. Your key will be stored locally in your browser.
      </p>
      
      <div className="flex gap-2">
        <Input
          type={isVisible ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Hugging Face API key (hf_...)"
          className="flex-1"
          readOnly={isSaved && !isEditing}
        />
        
        {(isEditing || !isSaved) ? (
          <>
            <Button
              variant="outline"
              onClick={() => setIsVisible(!isVisible)}
              className="px-3"
            >
              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            
            <Button onClick={handleSaveKey}>
              <Save className="mr-1 h-4 w-4" />
              Save
            </Button>
            
            {isEditing && (
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </>
        ) : (
          <Button onClick={handleEditKey}>
            <Edit className="mr-1 h-4 w-4" />
            Change Key
          </Button>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Your API key is stored securely in your browser's local storage and is never sent to our servers.
      </p>
    </div>
  );
};

export default HuggingFaceKeyInput;
