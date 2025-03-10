
import { useState, useRef, useEffect } from 'react';
import { Persona } from '@/data/personas';
import { MessageCircle, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import AIPerson from './AIPerson';

interface ConversationBubbleProps {
  content: string;
  sender: 'user' | Persona;
  timestamp?: Date;
}

const ConversationBubble = ({
  content,
  sender,
  timestamp = new Date(),
}: ConversationBubbleProps) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const isUser = sender === 'user';
  const persona = isUser ? null : sender;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (bubbleRef.current) {
      observer.observe(bubbleRef.current);
    }

    return () => {
      if (bubbleRef.current) {
        observer.unobserve(bubbleRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={bubbleRef}
      className={cn(
        'flex gap-3 mb-6 opacity-0 transform',
        isUser ? 'flex-row-reverse' : '',
        isVisible ? 'animate-fade-in opacity-100' : '',
        isUser ? 'animate-slide-in-left' : 'animate-slide-in-right'
      )}
    >
      {isUser ? (
        <div className="persona-avatar bg-primary flex-shrink-0">
          <MessageCircle className="h-[55%] w-[55%] text-white" />
        </div>
      ) : (
        <div className="flex-shrink-0">
          <AIPerson persona={persona} size="sm" />
        </div>
      )}

      <div className="flex flex-col max-w-[85%]">
        <div 
          className={cn(
            'persona-bubble',
            isUser 
              ? 'bg-primary text-primary-foreground rounded-tr-none' 
              : `bg-${persona?.color}/10 text-foreground rounded-tl-none border border-${persona?.color}/20`
          )}
        >
          <div className="mb-1">
            <span className="font-medium">
              {isUser ? 'You' : persona?.title}
            </span>
            <span className="text-xs opacity-70 ml-2">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>

        {!isUser && (
          <div className="flex items-center gap-1 mt-1.5 ml-2">
            <button 
              className={cn(
                "p-1.5 rounded-full hover:bg-secondary transition-colors",
                liked === true ? "text-green-500" : "text-muted-foreground"
              )}
              onClick={() => setLiked(liked === true ? null : true)}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button 
              className={cn(
                "p-1.5 rounded-full hover:bg-secondary transition-colors",
                liked === false ? "text-red-500" : "text-muted-foreground"
              )}
              onClick={() => setLiked(liked === false ? null : false)}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
            <button 
              className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground ml-1"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationBubble;
