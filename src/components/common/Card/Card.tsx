import { ReactNode, HTMLAttributes } from 'react';
import { GlassCard } from './Card.style';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className, ...rest }: CardProps) {
  return (
    <GlassCard className={className} {...rest}>
      {children}
    </GlassCard>
  );
}
