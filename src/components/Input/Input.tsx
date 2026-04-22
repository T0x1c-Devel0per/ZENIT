import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/helpers.js';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('input-group', className)}>
        {label && (
          <label htmlFor={inputId} className="input-group__label">
            {label}
          </label>
        )}
        <div className="input-wrapper">
          {icon && <span className="input-wrapper__icon">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn('input', error && 'input--error', icon && 'input--with-icon')}
            {...props}
          />
        </div>
        {error && <span className="input-group__error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
