import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return <div className={`${styles.glassCard} ${className ?? ''}`}>{children}</div>;
}
