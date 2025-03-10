
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trash2, Search, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useConversation, ConversationType } from '@/hooks/useConversation';
import { cn } from '@/lib/utils';

const History = () => {
  const navigate = useNavigate();
  const { conversationHistory, loadConversation, startNewConversation } = useConversation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedConversations, setSortedConversations] = useState<ConversationType[]>([]);

  useEffect(() => {
    // Sort conversations by updatedAt (most recent first)
    const sorted = Object.values(conversationHistory).sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    // Filter by search term
    const filtered = sorted.filter(conv => 
      conv.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSortedConversations(filtered);
  }, [conversationHistory, searchTerm]);

  const handleLoadConversation = (id: string) => {
    loadConversation(id);
    navigate('/chat');
  };

  const handleNewConversation = () => {
    startNewConversation();
    navigate('/chat');
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Conversation History</h1>
            <Button onClick={handleNewConversation}>
              <Plus className="mr-1 h-4 w-4" />
              New Conversation
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Conversations List */}
          {sortedConversations.length > 0 ? (
            <div className="space-y-3">
              {sortedConversations.map((conversation) => (
                <div 
                  key={conversation.id} 
                  className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => handleLoadConversation(conversation.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg line-clamp-1">{conversation.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(conversation.updatedAt)} · {conversation.messages.length} messages
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Delete conversation (not implemented in this demo)
                        alert('Delete functionality would be implemented here.');
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              {searchTerm ? (
                <>
                  <h3 className="text-xl font-medium mb-2">No matching conversations</h3>
                  <p className="text-muted-foreground mb-6">
                    Try a different search term or clear your search.
                  </p>
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-medium mb-2">No conversations yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start a new conversation to get perspectives from our AI personas.
                  </p>
                  <Button onClick={handleNewConversation}>
                    <Plus className="mr-1 h-4 w-4" />
                    New Conversation
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;
