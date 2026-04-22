import { cn } from '../../utils/helpers.js';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, hover = true, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'card--hover',
        `card--padding-${padding}`,
        className
      )}
    >
      {children}
    </div>
  );
}
