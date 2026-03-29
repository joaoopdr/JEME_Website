import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#C21A27',
          muted:   '#615F59',
          danger:  '#790E17',
          text:    '#1D1D1B',
        },
      },
      fontFamily: {
        // --font-inter is set by next/font/google in layout.tsx
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
