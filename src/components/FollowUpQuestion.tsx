
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { Persona } from '@/data/personas';

interface FollowUpQuestionProps {
  persona: Persona;
  onSend: (content: string, targetPersonaId: string) => Promise<void>;
  isLoading: boolean;
}

const FollowUpQuestion = ({ persona, onSend, isLoading }: FollowUpQuestionProps) => {
  const [followUpText, setFollowUpText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSend = async () => {
    if (followUpText.trim()) {
      await onSend(followUpText, persona.id);
      setFollowUpText('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  if (!isExpanded) {
    return (
      <div className="mt-2 ml-12">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`text-xs text-${persona.color} hover:bg-${persona.color}/10`}
          onClick={() => setIsExpanded(true)}
        >
          Ask follow-up question
        </Button>
      </div>
    );
  }
  
  return (
    <div className={`mt-2 ml-12 p-2 rounded-lg border border-${persona.color}/20 bg-${persona.color}/5`}>
      <div className="flex gap-2">
        <Input
          value={followUpText}
          onChange={(e) => setFollowUpText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${persona.name} a follow-up...`}
          className="text-sm"
          disabled={isLoading}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!followUpText.trim() || isLoading}
          className={`bg-${persona.color} hover:bg-${persona.color}/90`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizontal className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default FollowUpQuestion;
