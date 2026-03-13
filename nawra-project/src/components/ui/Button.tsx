// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', disabled, children, ...props }, ref) => {
    const baseStyles = `
      relative overflow-hidden font-cormorant tracking-wider uppercase
      rounded-lg transition-all duration-300 ease-spring
      flex items-center justify-center gap-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    `;

    const variants: Record<ButtonVariant, string> = {
      primary: `
        bg-gradient-to-r from-bordeaux to-bordeaux/90 text-cream
        hover:shadow-xl hover:shadow-bordeaux/30 hover:-translate-y-0.5
        active:translate-y-0
      `,
      secondary: `
        bg-gradient-to-r from-gold via-gold-light to-gold text-dark font-semibold
        hover:shadow-xl hover:shadow-gold/40 hover:-translate-y-0.5
        active:translate-y-0
      `,
      outline: `
        bg-transparent border-2 border-gold/50 text-gold
        hover:bg-gold/10 hover:border-gold
        active:bg-gold/20
      `,
      ghost: `
        bg-transparent text-cream/70
        hover:text-cream hover:bg-white/10
        active:bg-white/5
      `,
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-4 py-2.5 text-xs',
      md: 'px-6 py-3.5 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {/* Shimmer effect for primary/secondary */}
        {(variant === 'primary' || variant === 'secondary') && (
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}
        <span className="relative">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
