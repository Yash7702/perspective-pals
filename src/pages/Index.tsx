
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, MessageSquare } from 'lucide-react';
import { personas } from '@/data/personas';
import AIPerson from '@/components/AIPerson';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, []);

  useEffect(() => {
    // Rotate through personas every 3 seconds
    const interval = setInterval(() => {
      setCurrentPersonaIndex((prev) => (prev + 1) % personas.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentPersona = personas[currentPersonaIndex];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section 
        id="hero-section"
        className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-balance mb-4 bg-clip-text">
              Gain Multiple Perspectives with AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Interact with diverse AI personas offering unique viewpoints to help you make better decisions.
            </p>
          </div>

          <div className="flex justify-center mt-10">
            <Button 
              size="lg" 
              className="group"
              onClick={() => navigate('/chat')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Start a Conversation
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Personas Showcase */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {personas.map((persona, index) => (
              <div 
                key={persona.id}
                className={cn(
                  "flex flex-col items-center transition-all duration-500 transform",
                  index === currentPersonaIndex ? "scale-110" : "scale-100 opacity-70"
                )}
              >
                <AIPerson 
                  persona={persona} 
                  size="lg" 
                  animate={index === currentPersonaIndex}
                />
              </div>
            ))}
          </div>

          {/* Current Persona Thinking */}
          <div className="mt-12 text-center h-16">
            <div 
              className={cn(
                "bg-white/70 backdrop-blur-sm px-6 py-3 rounded-xl inline-block shadow-sm border border-neutral-200 transition-all duration-300",
                "transform"
              )}
            >
              <p className="text-sm italic text-muted-foreground">
                "{currentPersona.thinking}"
              </p>
            </div>
          </div>
        </div>

        {/* Background gradient effect */}
        <div className="absolute -z-10 inset-0 overflow-hidden">
          <div className={cn(
            "absolute -z-10 top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full",
            `bg-${currentPersona.color}/10 blur-3xl transition-colors duration-1000`
          )} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 bg-secondary/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Situation</h3>
              <p className="text-muted-foreground">
                Enter your question, scenario, or dilemma that you'd like to gain multiple perspectives on.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <div className="flex -space-x-2">
                  {personas.slice(0, 3).map((persona, i) => (
                    <div 
                      key={persona.id} 
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center ring-2 ring-background",
                        `bg-${persona.color}`
                      )}
                      style={{ zIndex: 3-i }}
                    />
                  ))}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose AI Personas</h3>
              <p className="text-muted-foreground">
                Select from our unique AI personalities, each offering distinct thinking styles and viewpoints.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <ChevronRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gain Insights</h3>
              <p className="text-muted-foreground">
                Receive thoughtful perspectives from each personality to expand your thinking and make better decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Expand Your Perspective?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start a conversation with our AI personas and gain valuable insights today.
          </p>
          <Button 
            size="lg" 
            className="group"
            onClick={() => navigate('/chat')}
          >
            Start Now
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Perspective. All rights reserved.</p>
          <p className="mt-2">Designed to help you make better decisions through multiple AI perspectives.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
