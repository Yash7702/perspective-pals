
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { personas } from '@/data/personas';
import AIPerson from '@/components/AIPerson';
import Navbar from '@/components/Navbar';
import ConversationBubble from '@/components/ConversationBubble';
import ApiKeyInput from '@/components/ApiKeyInput';
import PersonaSummary from '@/components/PersonaSummary';
import { useConversation } from '@/hooks/useConversation';
import { hasOpenAIKey } from '@/utils/openai';
import { cn } from '@/lib/utils';

const Chat = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { 
    messages, 
    isLoading, 
    selectedPersonas, 
    togglePersona, 
    sendMessage 
  } = useConversation();
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedPersonas.length > 0) {
      await sendMessage(message);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleFollowUpQuestion = async (content: string, targetPersonaId: string) => {
    if (content.trim()) {
      await sendMessage(content, [targetPersonaId]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col pt-20 px-4 sm:px-6">
        <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col">
          {/* API Key Input */}
          {!hasOpenAIKey() && <ApiKeyInput />}

          {/* Persona Selection and Summary */}
          <div className="py-6 border-b">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Choose perspectives:</h2>
              <PersonaSummary />
            </div>
            <div className="flex flex-wrap gap-3">
              {personas.map((persona) => (
                <AIPerson
                  key={persona.id}
                  persona={persona}
                  isSelected={selectedPersonas.includes(persona.id)}
                  onClick={() => togglePersona(persona.id)}
                />
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 py-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
                <p className="text-muted-foreground max-w-md">
                  Choose one or more AI personas above, then type your message to get multiple perspectives.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((msg, index) => (
                  <div key={msg.id}>
                    <ConversationBubble
                      content={msg.content}
                      sender={msg.sender}
                      timestamp={msg.timestamp}
                      showFollowUp={msg.sender !== 'user' && index === messages.length - 1}
                      onFollowUp={handleFollowUpQuestion}
                      isLoading={isLoading}
                    />
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="py-4 border-t sticky bottom-0 bg-background">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask for perspectives on any situation..."
                className="w-full border rounded-lg px-4 py-3 pr-16 resize-none min-h-[56px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={1}
                disabled={isLoading || selectedPersonas.length === 0}
              />
              <Button
                className="absolute right-2 bottom-2 rounded-full w-10 h-10 p-0"
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading || selectedPersonas.length === 0}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <SendHorizontal className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            {selectedPersonas.length === 0 && (
              <p className="text-sm text-orange-500 mt-2">
                Please select at least one AI persona to start a conversation.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
