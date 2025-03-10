
import { useState } from 'react';
import { Persona } from '@/data/personas';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AIPersonProps {
  persona: Persona;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const AIPerson = ({ 
  persona, 
  isSelected = false, 
  onClick, 
  size = 'md',
  animate = false
}: AIPersonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const sizes = {
    sm: {
      avatar: 'h-8 w-8 text-xs',
      wrapper: 'p-1.5',
      name: 'text-xs',
      title: 'text-[10px]',
    },
    md: {
      avatar: 'h-12 w-12 text-sm',
      wrapper: 'p-2',
      name: 'text-sm',
      title: 'text-xs',
    },
    lg: {
      avatar: 'h-16 w-16 text-base',
      wrapper: 'p-3',
      name: 'text-base',
      title: 'text-sm',
    },
  };

  const Icon = persona.icon;
  
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg transition-all',
        onClick ? 'cursor-pointer' : '',
        isSelected ? 'scale-[1.03]' : '',
        sizes[size].wrapper
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'persona-avatar relative',
          `bg-${persona.color}`,
          sizes[size].avatar,
          isSelected ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : '',
          animate ? 'animate-pulse-subtle' : ''
        )}
      >
        <Icon className="h-[55%] w-[55%]" />
        
        {/* Highlight effect */}
        {(isHovered || isSelected) && (
          <span className="absolute inset-0 rounded-full bg-white/20" />
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <span className={cn('font-medium', sizes[size].name)}>
          {persona.name}
        </span>
        {size !== 'sm' && (
          <span className={cn('text-muted-foreground', sizes[size].title)}>
            {persona.title.split('The ')[1]}
          </span>
        )}
      </div>
    </div>
  );
};

export default AIPerson;
