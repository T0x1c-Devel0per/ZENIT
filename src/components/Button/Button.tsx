import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers.js';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--full-width',
        loading && 'btn--loading',
        className
      )}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      <span className="btn__content">{children}</span>
    </motion.button>
  );
}
