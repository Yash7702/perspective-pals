
import { useState } from 'react';
import { personas } from '@/data/personas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIPerson from '@/components/AIPerson';

const PersonaSummary = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mb-4">
          View Persona Summaries
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Persona Perspectives</DialogTitle>
          <DialogDescription>
            Explore different AI personalities and their unique perspectives
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={personas[0].id} className="mt-4">
          <TabsList className="flex overflow-x-auto mb-4 pb-1">
            {personas.map((persona) => (
              <TabsTrigger key={persona.id} value={persona.id} className="flex items-center gap-2">
                <AIPerson persona={persona} size="xs" />
                <span>{persona.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {personas.map((persona) => (
            <TabsContent key={persona.id} value={persona.id}>
              <Card>
                <CardHeader className={`bg-${persona.color}/10 border-b border-${persona.color}/20`}>
                  <div className="flex items-center gap-3">
                    <AIPerson persona={persona} size="md" />
                    <div>
                      <CardTitle>{persona.title}</CardTitle>
                      <CardDescription>{persona.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-2">Core Traits:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {persona.traits.map((trait, index) => (
                      <span 
                        key={index} 
                        className={`px-2 py-1 rounded text-xs bg-${persona.color}/10 text-${persona.color}-foreground`}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                  
                  <h4 className="font-medium mb-2">Thinking Style:</h4>
                  <p className="text-sm italic mb-4">"{persona.thinking}"</p>
                  
                  <div className="text-sm text-muted-foreground border-t pt-3 mt-3">
                    <p>
                      When you ask questions to this persona, they'll respond with this 
                      perspective in mind, providing unique insights based on their personality.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PersonaSummary;
