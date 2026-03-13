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
        dark:      '#0D0608',
        dark2:     '#1A0A00',
        cream:     '#FAF3E8',
        gold:      '#C9921A',
        'gold-light': '#F5C842',
        bordeaux:  '#8B1A2F',
      },
      fontFamily: {
        amiri:      ['var(--font-amiri)', 'Georgia', 'serif'],
        cormorant:  ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      borderRadius: {
        nawra: '2px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '1500': '1500ms',
      },
    },
  },
  plugins: [],
};

export default config;
