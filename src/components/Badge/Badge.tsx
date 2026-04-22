import { cn } from '../../utils/helpers.js';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span className={cn('badge', `badge--${variant}`, `badge--${size}`, className)}>
      {children}
    </span>
  );
}
