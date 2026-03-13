// src/components/ui/Badge.tsx
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: 'gold' | 'bordeaux' | 'emerald' | 'sapphire' | 'rose';
}

const colorStyles: Record<string, string> = {
  gold: 'bg-gold/20 text-gold border-gold/30',
  bordeaux: 'bg-bordeaux/20 text-bordeaux border-bordeaux/30',
  emerald: 'bg-emerald-600/20 text-emerald-600 border-emerald-600/30',
  sapphire: 'bg-blue-600/20 text-blue-600 border-blue-600/30',
  rose: 'bg-pink-400/20 text-pink-500 border-pink-400/30',
};

export default function Badge({ children, color = 'gold' }: BadgeProps) {
  return (
    <span
      className={`
        inline-block px-2 py-0.5 text-xs font-cormorant tracking-wider uppercase
        border rounded-nawra
        ${colorStyles[color]}
      `}
    >
      {children}
    </span>
  );
}
