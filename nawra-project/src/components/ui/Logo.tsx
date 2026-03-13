// src/components/ui/Logo.tsx
import { Playfair_Display, Amiri } from 'next/font/google';

const playfair = Playfair_Display({
  weight: '400',
  style: 'italic',
  subsets: ['latin'],
  display: 'swap',
});

const amiri = Amiri({
  weight: '400',
  subsets: ['arabic'],
  display: 'swap',
});

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  size?: LogoSize;
}

const SIZES: Record<LogoSize, { fontSize: number; gap: number }> = {
  sm: { fontSize: 36, gap: 5 },
  md: { fontSize: 56, gap: 8 },
  lg: { fontSize: 110, gap: 12 },
};

export default function Logo({ size = 'md' }: LogoProps) {
  const { fontSize, gap } = SIZES[size];

  return (
    <div
      className="flex items-baseline select-none"
      style={{ gap: `${gap}px` }}
    >
      <span
        className={playfair.className}
        style={{ fontSize: `${fontSize}px`, color: '#FAF3E8', lineHeight: 1 }}
      >
        la
      </span>
      <span
        className={`${amiri.className} shimmer-gold`}
        style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}
      >
        ع
      </span>
      <span
        className={playfair.className}
        style={{ fontSize: `${fontSize}px`, color: '#FAF3E8', lineHeight: 1 }}
      >
        rosa
      </span>
      <span
        className={`${amiri.className} shimmer-gold`}
        style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}
      >
        ة
      </span>
    </div>
  );
}

// LogoMark - Just the ع for favicon/icon
interface LogoMarkProps {
  size?: number;
}

export function LogoMark({ size = 32 }: LogoMarkProps) {
  return (
    <span
      className={`${amiri.className} shimmer-gold`}
      style={{ fontSize: `${size}px`, lineHeight: 1, display: 'inline-block' }}
    >
      ع
    </span>
  );
}
