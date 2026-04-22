import { cn } from '../../utils/helpers.js';
import './Section.css';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'alternate' | 'dark';
  padding?: 'sm' | 'md' | 'lg';
}

export function Section({
  children,
  className,
  id,
  variant = 'default',
  padding = 'lg',
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn('section', `section--${variant}`, `section--padding-${padding}`, className)}
    >
      {children}
    </section>
  );
}
