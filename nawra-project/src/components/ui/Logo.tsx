// src/components/ui/Logo.tsx
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  weight: ['600'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  size?: LogoSize;
  variant?: 'light' | 'dark';
}

const SIZES: Record<LogoSize, { fontSize: number; letterSpacing: string }> = {
  sm: { fontSize: 20, letterSpacing: '0.2em' },
  md: { fontSize: 28, letterSpacing: '0.25em' },
  lg: { fontSize: 48, letterSpacing: '0.3em' },
};

export default function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const { fontSize, letterSpacing } = SIZES[size];
  const color = variant === 'light' ? '#FFFBF9' : '#3D3228';

  return (
    <span
      className={cormorant.className}
      style={{
        fontSize: `${fontSize}px`,
        color,
        lineHeight: 1,
        letterSpacing,
        fontWeight: 600,
      }}
    >
      VELORA
    </span>
  );
}

// LogoMark - Just the V for favicon/icon
interface LogoMarkProps {
  size?: number;
  variant?: 'light' | 'dark';
}

export function LogoMark({ size = 32, variant = 'dark' }: LogoMarkProps) {
  const color = variant === 'light' ? '#FFFBF9' : '#3D3228';

  return (
    <span
      className={cormorant.className}
      style={{
        fontSize: `${size}px`,
        color,
        lineHeight: 1,
        fontWeight: 600,
        display: 'inline-block',
      }}
    >
      V
    </span>
  );
}
