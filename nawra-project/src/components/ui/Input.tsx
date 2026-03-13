// src/components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react';

type InputVariant = 'dark' | 'light';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'light', label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).slice(2);

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className={`text-sm font-medium tracking-wide ${
              variant === 'dark' ? 'text-cream/70' : 'text-dark/70'
            }`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            ${variant === 'dark' ? 'inp-dark' : 'inp-light'}
            ${error ? '!border-red-500 !ring-red-500/20' : ''}
            rounded-xl
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="flex items-center gap-1.5 text-red-500 text-xs">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
