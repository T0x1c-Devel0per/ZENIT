import { cn } from '../../utils/helpers.js';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export function Card({ children, className, hover = true, padding = 'md', style }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'card--hover',
        `card--padding-${padding}`,
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
