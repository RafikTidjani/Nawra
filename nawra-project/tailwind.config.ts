import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Soft Luxury Palette
        primary: '#3D3228',      // Warm charcoal brown (text)
        secondary: '#D4A59A',    // Dusty rose/blush
        accent: '#FBF1EE',       // Blush cream (sections)
        background: '#FFFBF9',   // Warm cream white
        text: '#3D3228',         // Warm charcoal
        'text-secondary': '#8B7E75', // Warm taupe

        // Extended palette
        rose: {
          50: '#FDF8F6',
          100: '#FBF1EE',
          200: '#F5E1DC',
          300: '#E8C4BC',
          400: '#D4A59A',
          500: '#C4918A',
          600: '#A67369',
        },
        gold: {
          50: '#FDF9F3',
          100: '#F9F0E3',
          200: '#F0DEC4',
          300: '#E5C89E',
          400: '#D4B078',
          500: '#C8A97E',
          600: '#B8956A',
        },
        cream: {
          50: '#FFFBF9',
          100: '#FFF8F5',
          200: '#FBF1EE',
          300: '#F5E6E1',
        },
      },
      fontFamily: {
        heading: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        velora: '12px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(61, 50, 40, 0.06)',
        'soft-lg': '0 10px 40px rgba(61, 50, 40, 0.08)',
        'glow-rose': '0 8px 30px rgba(212, 165, 154, 0.25)',
        'glow-gold': '0 8px 30px rgba(200, 169, 126, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
