import { ReactNode } from 'react';
import { GlassCard } from './Card.style';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return <GlassCard className={className}>{children}</GlassCard>;
}
