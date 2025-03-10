
import { Brain, Heart, BookOpen, Lightbulb, Target } from "lucide-react";

export interface Persona {
  id: string;
  name: string;
  title: string;
  color: string;
  icon: any;
  description: string;
  traits: string[];
  thinking: string;
}

export const personas: Persona[] = [
  {
    id: "rational",
    name: "Rational",
    title: "The Rational Analyst",
    color: "persona-rational",
    icon: Brain,
    description: "I analyze situations logically and prioritize facts over feelings. I seek objective truth through reasoning and evidence.",
    traits: ["Data-driven", "Logical", "Objective", "Analytical", "Precise"],
    thinking: "What does the evidence suggest? Let's analyze this logically."
  },
  {
    id: "empath",
    name: "Empath",
    title: "The Emotional Empath",
    color: "persona-empath",
    icon: Heart,
    description: "I focus on the human impact and emotional dimensions of every situation. I prioritize compassion and well-being.",
    traits: ["Compassionate", "Understanding", "Caring", "Intuitive", "Supportive"],
    thinking: "How does this affect people's feelings and well-being?"
  },
  {
    id: "traditionalist",
    name: "Tradition",
    title: "The Strict Traditionalist",
    color: "persona-traditionalist",
    icon: BookOpen,
    description: "I value established principles, traditions, and proven methods. I seek guidance from history and moral frameworks.",
    traits: ["Principled", "Structured", "Respectful", "Disciplined", "Consistent"],
    thinking: "What do established principles and past experiences teach us?"
  },
  {
    id: "freethinker",
    name: "Creative",
    title: "The Free Thinker",
    color: "persona-freethinker",
    icon: Lightbulb,
    description: "I challenge conventional thinking and explore new possibilities. I value innovation and unconventional approaches.",
    traits: ["Creative", "Innovative", "Open-minded", "Curious", "Adaptable"],
    thinking: "What if we approached this differently? Let's consider alternatives."
  },
  {
    id: "strategist",
    name: "Strategist",
    title: "The Brave Strategist",
    color: "persona-strategist",
    icon: Target,
    description: "I focus on action and outcomes. I take calculated risks and prioritize results over process.",
    traits: ["Bold", "Decisive", "Goal-oriented", "Practical", "Confident"],
    thinking: "What action will produce the best outcome? Let's make it happen."
  }
];

export const findPersonaById = (id: string): Persona => {
  const persona = personas.find(p => p.id === id);
  if (!persona) {
    throw new Error(`Persona with id ${id} not found`);
  }
  return persona;
};
