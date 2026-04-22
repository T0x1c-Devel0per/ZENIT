import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/helpers.js';
import './Textarea.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, resize = 'vertical', className, id, rows = 4, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('textarea-group', className)}>
        {label && (
          <label htmlFor={textareaId} className="textarea-group__label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn('textarea', error && 'textarea--error', `textarea--resize-${resize}`)}
          rows={rows}
          {...props}
        />
        {error && <span className="textarea-group__error">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
